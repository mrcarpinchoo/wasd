'use strict';

// Imports
// libraries

// project modules
const { mongoose } = require('./connectdb');
const User = require('./User');

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    binary: {
        type: String,
        required: false
    }
});

imageSchema.statics.saveImage = async (email, imageData) => {
    imageData.owner = email;

    const image = Image(imageData);

    const doc = await image.save();

    await User.addImage(email, doc._id);

    return doc;
};

imageSchema.statics.findImageByName = async name => {
    return await Image.findOne({ name });
};

imageSchema.statics.deleteImage = async (email, name) => {
    const deletedImage = await Image.findOneAndDelete({ owner: email, name });

    if (!deletedImage) return null;

    return await User.removeImage(email, deletedImage._id);
};

/*
// w bout these?
ImageSchema.statics.getImages = async (email)=>{
    let images = await Image.find({owner:email})
                            .select('name url owner')
    return images
}

*/

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
