const mongoose = require('mongoose');

const roomCategprySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: String,
});

module.exports = mongoose.model('RoomCategory', roomCategprySchema);
