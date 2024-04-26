'use strict';

// Imports
// libraries
const express = require('express');

// project modules
const User = require('../../db/User');
const Image = require('../../db/Image');
const { validateToken } = require('../middleware/auth');

const router = express.Router();

// GET requests
/*
router.get('/:email', async (req, res) => {
    // const images = await User.getImages(req.params.email);
    // return res.send(images);
});
*/

router.get('/own', validateToken, async (req, res) => {
    console.log(req.email);
    console.log('hi');

    /*
    const images = await Image.getImages(req.params.email);

    return res.send(images);
    */
});

// POST requests
router.post('/:email', async (req, res) => {
    const { name, url, description, binary } = req.body;

    if (!name || !url || !description || !binary)
        return res.status(400).send({ err: 'Missing attributes' });

    const doc = await Image.saveImage(req.params.email, req.body);

    return res.status(201).send(doc);
});

// DELETE requests
router.delete('/:email/:imgName', async (req, res) => {
    const deletedImage = await Image.deleteImage(
        req.params.email,
        req.params.imgName
    );

    if (!deletedImage) return res.status(404).send('Image or user not found');

    return res.send(deletedImage);
});

module.exports = router;
