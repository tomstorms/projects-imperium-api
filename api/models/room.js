const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    room_category: {
        type: Schema.Types.ObjectId,
        ref: 'RoomCategory'
    }
});

module.exports = mongoose.model('Rooms', roomSchema);
