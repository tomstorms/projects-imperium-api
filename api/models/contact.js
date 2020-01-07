const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Contacts', contactSchema);
