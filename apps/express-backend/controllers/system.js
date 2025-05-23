const { systemItems, systemTypes } = require('../models');

const { DatabaseError, InvalidRoute, InvalidParams } = require('../utils/errors.js');

const { Ollama } = require('ollama');
const ollama = new Ollama({ host: 'http://localhost:11434' });

module.exports = {
  async getUserHomeFolder(req, res, next) {
    const {userId} = req.params
    if (!userId){
      return res.status(400).send('Missing userId')
    }

    try {
      let userHome = await systemItems.findOne({
        where: {
          parentFolderId: null,
          userId,
          name: 'Home',
        },
        include: [
          {
            model: systemTypes,
            required: true,
          }
        ]
      })

      if (!userHome) {
        let temp = {
          parentFolderId: null,
          userId,
          name: 'Home',
          size: 0,
          systemTypeId: 1,
        }
        await systemItems.create(temp)
        userHome = await systemItems.findOne({
          where: {
            parentFolderId: null,
            userId,
            name: 'Home',
          },
          include: [
            {
              model: systemTypes,
              required: true,
            }
          ]
        })
      }

      res.status(200).send(userHome)
    } catch (e) {
      console.log(e)
      next(new DatabaseError('Error while getting user home folder', null, e));
    }
  },
  async getContentsOfFolder(req, res, next){
    const {parentFolderId} = req.params
    if (!parentFolderId){
      return res.status(400).send('Missing parentFolderId')
    }

    try {
      let contents = []

      const folders = await systemItems.findAll({
        where: {
          systemTypeId: 1,
          parentFolderId,
        },
        include: {
          model: systemTypes,
          required: true,
        }
      })

      contents = contents.concat(folders)

      const files = await systemItems.findAll({
        where: {
          systemTypeId: 2,
          parentFolderId,
        },
        include: {
          model: systemTypes,
          required: true,
        }
      })

      contents = contents.concat(files)

      res.status(200).send(contents)
    } catch (e) {
      console.log(e)
      next(new DatabaseError('Error while getting folder contents', null, e));
    }
  },
  async createFolderForUser(req, res, next){
    try {
      const {parentFolderId, userId} = req.params
      if (!parentFolderId){
        return res.status(400).send('Missing parentFolderId')
      }
      if (!userId){
        return res.status(400).send('Missing userId')
      }

      let temp = {
        systemTypeId: 1,
        parentFolderId,
        userId,
        name: 'New Folder',
        size: 0,
      }

      temp = await systemItems.create(temp)

      res.status(200).send('Successfully created new folder')
    } catch (e) {
      console.log(e)
      next(new DatabaseError('Error while creating new folder', null, e));
    }
  },
  async updateItem(req, res, next){
    try {
      const {id} = req.params
      if (!id) {
        return res.status(400).send('Missing id')
      }
      const data = req.body
      if (!data) {
        return res.status(400).send('Missing data')
      }

      await systemItems.update(data, {where: {id}})

      res.status(200).send('Successfully updated system item')
    } catch (e) {
      console.log(e)
      next(new DatabaseError('Error while update item', null, e));
    }
  },
  async deleteItems(req, res, next){
    try {
      console.log(req.body)
      for (let id of req.body) {
        await systemItems.destroy({where: {id}})
      }

      res.status(200).send('Successfully deleted items')
    } catch (e) {
      console.log(e)
      next(new DatabaseError('Error while deleting items', null, e));
    }
  },
  async recentFiles(req, res, next){
    try {
      console.log(req.params)
      const {userId} = req.params
      if (!userId){
        return res.status(400).send('Missing userId')
      }

      let files = await systemItems.findAll({
        where: {
          userId,
          systemTypeId: 2,
        },
        include: {
          model: systemTypes,
          required: true,
        },
        order: [
          ['updatedAt', 'DESC']
        ],
        limit: 10
      });

      res.status(200).send(files)
    } catch (e) {
      console.log(e)
      next(new DatabaseError('Error while deleting items', null, e));
    }
  },
  async sendAIMessage(req, res, next){
    try {
      const conversation = req.body;
      console.log(JSON.stringify(conversation, null, 2))
      const response = await ollama.chat({
        model: 'gemma3',
        messages: conversation,
      });
      res.json(response);
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: err.message });
    }
  },
  async getFileByAddress(req, res, next){
    try {
      const {fileAddress} = req.params
      if (!fileAddress){
        return res.status(400).send('Missing fileAddress')
      }

      const file = await systemItems.findOne({
        where: {
          fileAddress
        },
        include: {
          model: systemTypes,
          required: true,
        }
      })

      res.status(200).send(file)
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: err.message });
    }
  }
};
