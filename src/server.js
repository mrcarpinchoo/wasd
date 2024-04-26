'use strict';

// Imports
// libraries
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');

// project modules
const authRouter = require('./router/authRouter');
const userRouter = require('./router/userRouter');
const imageRouter = require('./router/imageRouter');

dotenv.config(); // loads .env file contents into process.env

// socket
const IP_ADDRESS = 'localhost';
const PORT = process.env.PORT || 3000;

const app = express(); // express application

// global middleware
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));

// routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/images', imageRouter);

app.listen(PORT, IP_ADDRESS, () =>
    console.log(`Server is running on http://${IP_ADDRESS}:${PORT}`)
);
