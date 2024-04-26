'use strict';

// Imports
// libraries
const bcrypt = require('bcryptjs');

// project modules
const { mongoose } = require('./connectdb');

// User schema
const userSchema = mongoose.Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    images: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image',
            default: []
        }
    ]
});

// User CRUD operations -----
// create
userSchema.statics.saveUser = async data => {
    const hash = bcrypt.hashSync(data.password, 10);

    data.password = hash;

    const user = User(data);

    return await user.save();
};

// read
// by default, returns all users
userSchema.statics.findUsers = async (
    filters = {},
    isAdmin = false,
    pageNum = 1,
    pageSize = 0
) => {
    const projection = isAdmin ? {} : { name: 1, email: 1, _id: 0 };

    const docs = User.find(filters, projection)
        .sort({ name: 1 })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .populate('images', 'name description url');

    const count = User.find(filters).count();

    const res = await Promise.all([docs, count]);

    const users = res[0];
    const total = res[1];

    return {
        users,
        total,
        page: pageNum,
        pageSize
    };
};

userSchema.statics.findUser = async email => {
    const doc = await User.findOne({ email });

    return doc;
};

// update
userSchema.statics.updateUser = async (email, userData) => {
    if (userData.password) {
        const hash = bcrypt.hashSync(data.password, 10);

        userData.password = hash;
    }

    const doc = await User.findOneAndUpdate(
        { email },
        { $set: userData },
        { new: true }
    );

    return doc;
};

// delete
userSchema.statics.deleteUser = async email => {
    const doc = await User.findOneAndDelete({ email });

    return doc;
};

// images CRUD operations
// create
userSchema.statics.addImage = async (email, imageID) => {
    const user = await User.findUser(email);

    if (user) {
        user.images.push(imageID);

        return await user.save();
    }

    return { error: 'User not found' };
};

/*
// addImage v2
userSchema.statics.addImage = async (email, imageID) => {
    const user = await findOneAndUpdate(
        { email },
        {
            $push: {
                images: imageID
            }
        },
        { new: true }
    );

    return user;
};
*/

// read
userSchema.statics.getImages = async email => {
    const doc = await User.findOne({ email }).populate('images', 'name url');

    return doc.images;
};

// delete
userSchema.statics.removeImage = async (email, imageID) => {
    return await User.findOneAndUpdate(
        { email },
        { $pull: { images: imageID } },
        { new: true }
    );
};

userSchema.statics.authUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) return null;

    if (bcrypt.compareSync(password, user.password)) return user;

    return null;
};

const User = mongoose.model('User', userSchema);

/*
const data = {
    name: 'Alejandro',
    email: 'guillermo.romero@iteso.mx',
    password: '2004' 
};

// (async () => await User.saveUser(data))();
*/

module.exports = User;
