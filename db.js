require("dotenv").config();
const mongoose = require('mongoose');
const { User } = require('./src/models/users.js');

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

const createUser = async (username) => {
    const newUser = new User({username, count: 0, log: []});
    try {
        savedUser = await newUser.save();
        console.log('Saved user: ', savedUser);
        return savedUser;
    } catch (err) {
        console.log('Error saving document: ', err);
        throw err;
    }
};

const getAllUsers = async () => {
    try {
        const allUsers = await User.find().select('_id username __v');
        return allUsers;
    } catch (err) {
        console.log('Error finding documents: ', err);
        throw err;
    }
}

const logExercise = async (userId, description, duration, date) => {
    try {
        newLog = {description, duration, date}
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            {$push: {log: newLog}, $inc: {count: 1}},
            {new: true}
        );
        console.log("Successfully log new exercise to user: ", updatedUser);
        return updatedUser;
    } catch (err) {
        console.log('Error finding or updating the document: ', err);
        throw err;
    }
};

const findUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user;
    } catch (err) {
        console.log('Error finding the document: ', err);
        throw err;
    };
}

module.exports = { createUser, getAllUsers, logExercise, findUserById };