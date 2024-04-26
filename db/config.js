'use strict';

// Imports
// libraries
const dotenv = require('dotenv');

// project modules

dotenv.config(); // loads .env file contents into process.env

module.exports = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    getURI: function () {
        return `mongodb+srv://${this.user}:${this.password}@wasd.hxiugps.mongodb.net/${this.dbName}?retryWrites=true&w=majority&appName=wasd`;
    }
};
