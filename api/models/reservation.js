const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    booking_ref: {
        type: String,
        required: true,
    },
    rooms: {
        type: Schema.Types.ObjectId,
        ref: 'Rooms'
    }
});

module.exports = mongoose.model('Reservations', reservationSchema);
