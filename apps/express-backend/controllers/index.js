'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const controllers = {};

fs
    .readdirSync(__dirname)
    .filter(file => {
      return (
          file.indexOf('.') !== 0 &&
          file !== basename &&
          file.slice(-3) === '.js'
      );
    })
    .forEach(file => {
      const controllerName = file.slice(0, -3); // Remove the .js extension
      controllers[controllerName] = require(path.join(__dirname, file));
    });

module.exports = controllers;