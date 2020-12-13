const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const gifSchema = new Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    }
})
const userSchema = new Schema({
    userID: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    gifs: [gifSchema]
});
const User = mongoose.model('User', userSchema);
module.exports = User;