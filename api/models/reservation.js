const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    booking_ref: {
        type: String,
        required: true,
    },
    primary_contact: {
        type: Schema.Types.ObjectId,
        ref: 'Contacts'
    }
});

module.exports = mongoose.model('Reservations', reservationSchema);
