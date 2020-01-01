const mongoose = require('mongoose');

const roomCategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0.00 },
});

module.exports = mongoose.model('Room_Category', roomCategorySchema);
