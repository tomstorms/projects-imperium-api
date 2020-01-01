const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: String,
    layout: String,
    wheelchair_access: Boolean,
    room_category: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomCategory' },
    web_link: String,
});

module.exports = mongoose.model('Room', roomSchema);
