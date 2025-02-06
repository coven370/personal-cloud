const { users } = require('../models');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const generator = require('generate-password');
const nodemailer = require('nodemailer');
require('../config/passport')(passport);
const dotenv = require('dotenv-safe');

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
const config = require('../config/config.json');
const {Op} = require("sequelize");
const env = config[process.env.ENV];

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

  list(req, res) {
    return users
      .findAll({
        attributes: [
          'id',
          'rank_id',
          'username',
          'first_name',
          'last_name',
          'phone',
          'address1',
          'address2',
          'address3',
          'city',
          'state',
          'zip',
          'enabled',
          'weight',
          'current_outline',
        ],
        order: [
          ['last_name', 'ASC'],
        ],
        where: {
          enabled: true,
        },
      })
      .then(rusers => res.status(200).json(rusers))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getUserTzTime(req, res) {
    // first obtain the user ID
    const user = users.findByPk(req.params.id, {
      attributes: ['timezone'],
    });

    // take the time value passed in and convert it to the user's timezone
  },

  changePassword(req, res) {
    if (!req.body.user_id) {
      res.status(200).send('No User ID');
      return;
    }

    if (!req.body.password) {
      res.status(200).send('No password was set');
      return;
    }

    console.log('In change password: ', req.body.user_id);
    console.log('In change password: ', req.body.password);

    const password = bcrypt.hashSync(req.body.password, 10);

    // first, get the user from the DB, then update it
    return users.findOne({
      where: {
        id: req.body.user_id,
      }
    })
    .then((user) => {
      return users.update({
        password,
        password_change: false,
      },{
        where: {
          id: user.id,
        }
      })
    })
    .then(() => {
      res.status(200).send('Password reset');
    })
    .catch((error) => {
      //console.log('Error: ', error);
      res.status(500).send(error);
    });
  },

  resetPassword(req, res) {
    // console.log('Auth: ', JSON.stringify(req.body));
    if (!req.body.username) {
      res.status(200).send('Password change successful');
      return;
    }

    const preEncrypt = generator.generate({
      length: 10,
      numbers: true
    });
    const password = bcrypt.hashSync(preEncrypt, 10);
    let email = null;

    // first, get the user from the DB, then update it
    return users.findOne({
      where: {
        username: req.body.username,
      }
    })
    .then((user) => {
      if (user && user.email) {
        email = user.email;
      }
      return users.update({
        password,
        password_change: true,
      },{
        where: {
          id: user.id,
        }
      })
    })
    .then(() => {
      let message = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"> <html xmlns=\"http://www.w3.org/1999/xhtml\"> <head> <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" /> <title>BST Password Reset Email</title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/> </head> <body style=\"margin: 0; padding: 0;\">";
      message += '<table width="100%" border="0" cellSpacing="0" cellPadding="0">';
      message += '<tr>';
      message += '<td style="text-align: center;">';
      message += "<img src='https://bst.aivector.com/static/img/bst_logo.jpg'><br>";
      message += `This is the link to your new password.  Please keep it confidential!<br>Your temporary password is <span style="font-weight: bold;">${preEncrypt}</span><br>`;
      message += `<a href="https://bst.aivector.com/login">Click here to login to bst</a>`;
      message += '</td>';
      message += '</tr>';
      message += '</table>';
      message += '</body></html>';
      module.exports.sendEmail('Password Reset Link', message, email, false);
      res.status(200).send('An email was sent out to the user account');
    })
    .catch((error) => {
      // console.log('Error: ', error);
      res.status(500).send(error);
    });
  },

  getById(req, res) {
    return users
      .findByPk(req.params.id, {
        attributes: [
          'id',
          'rank_id',
          'username',
          'first_name',
          'last_name',
          'phone',
          'address1',
          'address2',
          'address3',
          'city',
          'state',
          'zip',
          'enabled',
          'weight',
          'current_outline',
        ],
        order: [
          ['last_name', 'ASC'],
        ],
      })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'users Not Found',
          });
        }

        return res.status(200).send(user);
      })
      .catch(error => res.status(400).send(error));
  },

  add(req, res) {
    return users
      .create(req.body)
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  },

  search(req, res) {
    // start by the filter
    return users
      .findAll({
        attributes: [
          'id',
          'rank_id',
          'username',
          'first_name',
          'last_name',
          'phone',
          'address1',
          'address2',
          'address3',
          'city',
          'state',
          'zip',
          'enabled',
          'weight',
          'current_outline',
        ],
        order: [
          ['last_name', 'ASC'],
        ],
        where: {
          $or: {
            username: {
              $like: `%${req.params.search}%`,
            },
          },
        },
      })
      .then(rusers => res.status(200).json(rusers))
      .catch(error => res.status(400).send(error));
  },

  register(req, res) {
    return res.status(401).send('Call not implemented yet');
  },

  comparePassword(password, cb) {
    // hash encrypt the password, it should match if it is correct
    // const salt = bcrypt.genSaltSync();
    return bcrypt.compareSync(password, cb);
  },

  loginCheck(req, res) {
    // checks if the token is valid or not, returns a 1 or a 0
    let token = '';
    if (req.headers && req.headers.authorization) {
      token = module.exports.getToken(req.headers);
      if (token) {
        return res.status(200).json({ rv: 0, success: true, msg: 'Logged in.' });
      }

      return res.status(403).json({ rv: 1001, success: false, msg: 'Unauthorized.' });
    }

    return res.status(403).send({ rv: 1002, success: false, msg: 'Unauthorized.' });
  },

  // log in method for handling login, logout.
  // follows the dominioninsurance.com cookie method if it exists
  login(req, res) {
    console.log('In login: ');
    console.log('Username: ', req.body.username);
    console.log('Password: ', req.body.password);
    let username = null;
    if (req.body.username) {
      username = req.body.username;
    } else {
      console.log('No username');
      res.status(401).json({message: 'Failed to authenticate', success: false});
      return;
    }

    let password = null;
    if (req.body.password) {
      password = req.body.password;
    } else {
      console.log('No password');
      res.status(401).json({message: 'Failed to authenticate', success: false});
      return;
    }

    try {
      return users.findOne({
        where: {
          [Op.or]: [
            { email: username },
            { username }
          ]
        },
      })
          .then((user) => {
            console.log(user)
            if (!user) {
              res.status(401).json({
                rv: 0,
                success: false,
                msg: 'Authentication failed. Invalid login.',
              });
              return;
            }

            console.log('In login: ', password);
            console.log('User login: ', user.password);
            // do local authentication first
            if (module.exports.comparePassword(password, user.password) === true) {
              const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {expiresIn: 86400});
              // return the information including token as JSON
              res.status(200).json({success: true, token: `JWT ${token}`, user});
            } else {
              res.status(401).json({message: 'Authentication failed: ', success: false});
            }
          })
          .catch((error) => {
            console.log('ERROR: ', error);
            res.status(500).json({
              success: false,
              message: 'Failed to authenticate: ' + error,
            });
          });
    } catch (e){
      console.log(e)
    }
  },
};
