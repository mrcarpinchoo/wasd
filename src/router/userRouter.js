'use strict';

// Imports
// libraries
const express = require('express');
const { nanoid } = require('nanoid');

// project modules
const {
    validateAuthHeader,
    authenticateUser,
    authorizeAdmin
} = require('../middleware/auth');
const User = require('../../db/User');

const router = express.Router();

// GET requests
router.get('/', validateAuthHeader, authenticateUser, async (req, res) => {
    let filters;

    const { name, email, pageNum, pageSize } = req.query;

    filters = {};

    if (name) filters.name = new RegExp(name, 'i');

    const filteredUsers = await User.findUsers(
        filters,
        req.isAdmin,
        +pageNum,
        +pageSize
    );

    return res.send(filteredUsers);
});

router.get('/:email', async (req, res) => {
    console.log(req.params.email);
    /*
    const user = users.find(user => user.id == req.params.id);

    if (!user) return res.status(404).send({ error: 'User not found' });

    return res.send(user);
    */

    return res.send({});
});

// POST requests
// registers a new user
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;

    if (name && name.trim() && email && email.trim()) {
        const user = await User.findUser(email);

        if (user) return res.status(409).send({ error: 'User already exists' });

        const userData = {
            uuid: nanoid(6),
            name,
            email,
            password
        };

        const newUser = await User.saveUser(userData);

        return res.status(201).send(newUser);
    }

    let error = '';

    if (name === undefined || !name.trim()) error += 'name is empty; ';
    if (email === undefined || !email.trim()) error += 'email is empty';

    return res.status(400).send({ error });
});

// PUT requests
// updates an existent user
router.put('/:email', async (req, res) => {
    const user = await User.findUser(req.params.email);

    if (!user) return res.status(404).send({ error: 'User not found' });

    const { name, password } = req.body;

    if (!name)
        return res.status(400).send({ error: 'User name is not not valid' });

    user.name = name;

    if (!user.password) delete user.password;

    const doc = await User.updateUser(user.email, user);

    return res.status(201).send(doc);
});

// deletes user
router.delete(
    '/:email',
    validateAuthHeader,
    authenticateUser,
    authorizeAdmin,
    async (req, res) => {
        const user = await User.findUser(req.params.email);

        if (!user) return res.status(404).send({ error: 'User not found' });

        const doc = await User.deleteUser(req.params.email);

        return res.send(doc);
    }
);

module.exports = router;
