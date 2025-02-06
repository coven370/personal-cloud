const { users, auth_groups, scopes, auth_groups_users, ranks, completed_ranks, poom_dan } = require('../models');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv-safe');
const nodemailer = require('nodemailer');
const { Op } = require("sequelize");

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
const config = require('../config/config.json');
const env = config[process.env.ENV];

const { DatabaseError, InvalidRoute, InvalidParams } = require('../utils/errors.js');

module.exports = {
  sendEmail(subject, message, email, attachments) {
    const transporter = nodemailer.createTransport({
      host: env.email.host,
      port: env.email.port,
      secureConnection: env.email.secureConnection,
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: env.email.from,
      to: email,
      // to: email,
      bcc: 'nate@aivector.com',
      subject,
      html: message,
    };

    if (attachments) {
      mailOptions.attachments = attachments;
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // console.log(error);
      } else {
        // console.log(`Email sent: ${info.response}`);
      }
    });
  },

  list(req, res, next) {
    console.log('Get All')
    return users
    .findAll({
      order: [
        ['lastName', 'ASC'],
      ],
    })
    .then((allUsers) => {
      res.status(200).send(allUsers);
    })
    .catch((error) => {
      console.log(error)
      next(new DatabaseError('A critical error occurred ', null, error));
    });
  },

  getById(req, res, next) {
    return users
    .findByPk(req.params.id, {
      include: [{
        model: auth_groups,
        required: false,
        include: [{
          model: scopes,
          required: false,
        },
        ],
      },
        {
          model: poom_dan,
          required: false
        }
      ],
    })
    .then((user) => {
      if (!user) {
        res.status(200).send({
          success: false,
          message: 'User Not Found',
        });
        return;
      }

      res.status(200).send(user);
    })
    .catch((error) => {
      // console.log(error);
      next(new DatabaseError('A critical error occurred ', null, error));
    });
  },

  add(req, res, next) {
    if (!req.body.username) {
      res.status(500).send({ success: false, message: 'Missing username' });
      return;
    }
    if (!req.body.email) {
      res.status(500).send({ success: false, message: 'Missing email' });
      return;
    }
    if (!req.body.firstName) {
      res.status(500).send({ success: false, message: 'Missing first name' });
      return;
    }
    if (!req.body.lastName) {
      res.status(500).send({ success: false, message: 'Missing last name' });
      return;
    }
    if (!req.body.password || req.body.password.length === 0) {
      res.status(500).send({ success: false, message: 'Missing password!' });
      return;
    }
    const user = req.body

    return users.findAll({
      where: {
        [Op.or]: [
          { email: user.email },
          { username: user.username }
        ]
      }
    })
        .then(response => {
          if (response.length > 0){
            res.status(400).send({ success: false, message: 'Username or Email Already Exists!' })
            return
          }
          user.password = bcrypt.hashSync(user.password, 10);
          return users.create(user)
              .then(response => {
                res.status(200).send(response);
              })
              .catch((error) => {
                console.log('Error: ' + error);
                next(new DatabaseError('Critical error occurred while creating or updating user ', null, error));
              });
        })

    /*if (req.body.id) {
      // this is an update
      const username = req.body;
      req.body.enabled = true;
      if (req.body.password && req.body.password.length >= 1) {
        username.password = bcrypt.hashSync(req.body.password, 10);
      }
      // find the auth group "student"
      return users.update(username, {
        where: {
          id: req.body.id,
        }
      })
      .then((user) => {
        res.status(200).send(user);
      })
      .catch((error) => {
        // console.log('Error: ' + error);
        next(new DatabaseError('Critical error occurred while creating or updating user ', null, error));
      });
    } else {
      // create the user, it's new
      const username = req.body;
      let a = null;
      let b = null;
      for (a = '', b = 36; a.length < 40;) a += (Math.random() * b | 0).toString(b);
      username['link'] = a;
      // console.log('Username: ', username);
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      return auth_groups.findOne({
        where: {
          name: 'student'
        }
      })
      .then((group) => {
        group_id = group.id;
        return users
        .create(username)
      })
      .then((user) => {
        return auth_groups_users.create({
          'auth_group_id': group_id,
          'user_id': user.id,
        });
      })
      .then(() => {
        // send out the validation link
        let message = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"> <html xmlns=\"http://www.w3.org/1999/xhtml\"> <head> <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" /> <title>BST Confirmation Email</title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/> </head> <body style=\"margin: 0; padding: 0;\">";
        message += '<table width="100%" border="0" cellSpacing="0" cellPadding="0">';
        message += '<tr>';
        message += '<td style="text-align: center;">';
        message += "<img src='https://bst.aivector.com/static/img/bst_logo.jpg'><br>";
        message += `Welcome to Beyond Sports Board Breaking Program.<br>Please verify your email address so we can get you started creating Breaking Outlines!<br>`;
        message += `<a href="https://bst.aivector.com/verification?key=${a}">Click here to verify your address</a>`;
        message += '</td>';
        message += '</tr>';
        message += '</table>';
        message += '</body></html>';
        module.exports.sendEmail('Account Verification Link', message, req.body.email, false);
        res.status(200).send('User Creation Successful');
      })
      .catch((error) => {
        // console.log('Error: ', error);
        next(new DatabaseError('A critical error occurred ', null, error));
      });
    }*/
  },

  update(req, res, next) {
    const { id } = req.params;

    return users.update(req.body, {
      where: {
        id,
      }
    })
    .then((updated) => {
      res.status(200).send(updated);
    })
    .catch((error) => {
      next(new DatabaseError('A critical error occurred ', null, error));
    });
  },
};
