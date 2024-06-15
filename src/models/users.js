const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    description: {type: String, required: true}, 
    duration: {type: Number, required: true}, 
    date: {type: String, required: true}
})

const userSchema = new mongoose.Schema({
    username: {type: String, required: true}, 
    count: {type: Number, required: true}, 
    log: [logSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = { User };