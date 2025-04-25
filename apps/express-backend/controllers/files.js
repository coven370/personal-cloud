const Sequelize = require('sequelize');
const { DatabaseError, InvalidRoute, InvalidParams } = require('../utils/errors.js');
const { users, systemItems } = require('../models');

const path = require('path');
const fs = require('fs');
const mime= require('mime-types')

module.exports = {
    downloadFile(req, res, next) {
        const filename = req.params.filename;
        console.log('Filename:', filename);

        const filePath = path.join(__dirname, '../../uploads', filename);
        console.log('File Path:', filePath);

        if (fs.existsSync(filePath)) {
            res.download(filePath, filename, (err) => {
                if (err) {
                    console.error('Download error:', err);
                    return next(err);
                }
            });
        } else {
            console.log('File not found!');
            res.status(404).send('File not found');
        }
    },


    async add(req, res, next) {
        const parentFolderId = req.params.folderId;
        const { userId } = req.params;

        if (!parentFolderId) {
            return res.status(400).send('Missing parentFolderId');
        }
        if (!userId) {
            return res.status(400).send('Missing userId');
        }

        if (!req.files || !req.files.fileInput) {
            return res.status(402).send('Bad request: No File Uploaded');
        }

        const file = req.files.fileInput;
        const uploadsDir = path.join(__dirname, '../../uploads');

        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        try {
            let temp = {
                systemTypeId: 2,
                parentFolderId,
                userId,
                name: file.name,
                size: file.size,
            };
            const systemItem = await systemItems.create(temp);

            const createdAtTimestamp = systemItem.createdAt.getTime();
            const splitName = file.name.split('.')
            const newFileName = `${userId}_${splitName[0]}_${createdAtTimestamp}.${splitName[1]}`;
            const newSavePath = path.join(uploadsDir, newFileName);

            await new Promise((resolve, reject) => {
                file.mv(newSavePath, (err) => {
                    if (err) {
                        console.error('File move error:', err);
                        return reject(err);
                    }
                    resolve();
                });
            });

            await systemItems.update(
                { fileAddress: newFileName },
                { where: { id: systemItem.id } }
            );

            await updateFolderSize(parentFolderId, file.size)

            res.status(200).send({ message: 'File uploaded successfully', path: newSavePath });
        } catch (e) {
            console.error(e);
            next(new DatabaseError('Error while processing file upload', null, e));
        }
    },
    getFile(req, res, next) {
        try {
            const filename   = req.params.filename;
            const uploadsDir = path.join(__dirname, '../../uploads');
            const filePath   = path.join(uploadsDir, filename);

            if (!fs.existsSync(filePath)) {
                return res.status(404).send('File not found');
            }

            // lookup() returns a MIME string or false
            const type = mime.lookup(filePath) || 'application/octet-stream';
            res.setHeader('Content-Type', type);

            res.sendFile(filePath, err => {
                if (err) {
                    console.error('Error sending file:', err);
                    next(err);
                }
            });
        } catch (e) {
            console.error(e);
            next(new DatabaseError('Error while processing file upload', null, e));
        }
    },
};

async function updateFolderSize(parentFolderId, size){
    let parentFolder = await systemItems.findByPk(parentFolderId);
    let newSize = parentFolder.size + size;
    await systemItems.update({ size: newSize }, { where: { id: parentFolderId } });
    if (parentFolder.parentFolderId){
        await updateFolderSize(parentFolder.parentFolderId, size)
    }
}
