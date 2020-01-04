const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const establishmentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Establishment', establishmentSchema);
