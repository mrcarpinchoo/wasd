'use strict';

// Imports
// libraries
const jwt = require('jsonwebtoken');

// project modules
const User = require('../../db/User');

function validateAuthHeader(req, res, next) {
    const authHeader = req.get('x-auth');

    if (!authHeader)
        return res.status(403).send({ error: 'No authentication data' });

    req.token = authHeader;

    next();
}

function authenticateUser(req, res, next) {
    const password = '1001';

    req.isAdmin = false;

    if (req.token === password) req.isAdmin = true;

    next();
}

function authorizeAdmin(req, res, next) {
    if (!req.isAdmin)
        return res
            .status(401)
            .send({ error: 'Invalid administrator credentials' });

    next();
}

function validateToken(req, res, next) {
    const token = req.get('x-token');

    if (!token) return res.status(401).send({ error: 'Token is missing' });

    jwt.verify(token, process.env.TOKEN, (err, decoded) => {
        if (err) return res.status(401).send({ error: err.message });

        req.email = decoded.email;
        req._id = decoded._id;

        next();
    });
}

module.exports = {
    validateAuthHeader,
    authenticateUser,
    authorizeAdmin,
    validateToken
};
