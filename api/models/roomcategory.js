const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    establishment: {
        type: Schema.Types.ObjectId,
        ref: 'Establishment'
    }
});

module.exports = mongoose.model('RoomCategory', roomCategorySchema);
