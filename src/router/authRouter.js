'use strict';

// Imports
// libraries
const express = require('express');
const jwt = require('jsonwebtoken');

// project modules
const User = require('../../db/User');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.authUser(email, password);

    if (!user)
        return res
            .status(401)
            .send({ error: 'Email or password is not correct' });

    const token = jwt.sign(
        { email: user.email, _id: user._id },
        process.env.TOKEN,
        { expiresIn: 60 * 3 }
    );

    return res.send({ token });
});

module.exports = router;
