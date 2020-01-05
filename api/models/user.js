const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    user_role: {
        type: String,
        required: true,
    },
    user_profile: {
        type: String,
    }
});

module.exports = mongoose.model('Users', userSchema);

