const Reservation = require('../../../models/reservation');
const Contact = require('../../../models/contact');
const { transformReservation } = require('../merge');

String.random = function (length) {
	let radom13chars = function () {
		return Math.random().toString(16).substring(2, 15)
	}
	let loops = Math.ceil(length / 13)
	return new Array(loops).fill(radom13chars).reduce((string, func) => {
		return string + func()
	}, '').substring(0, length)
}

module.exports = {
    reservations: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        if (!(req.userRole === 'authenticated' || req.userRole === 'superadmin')) {
            throw new Error('Forbidden');
        }

        try {
            const reservations = await Reservation.find();
            return reservations.map(reservation => {
                return transformReservation(reservation);
            });
        }
        catch(err) {
            throw err;
        }
    },
    createReservation: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        if (!req.userRole === 'superadmin') {
            throw new Error('Forbidden');
        }

        try {

            // Loop until we have a unique Booking Reference
            const bookingRefLength = 7;
            let bookingRef = String.random(bookingRefLength);
            let reservationObj = await Reservation.findOne({ booking_ref: bookingRef });

            while(reservationObj) { 
                bookingRef = String.random(bookingRefLength);
                reservationObj = await Reservation.findOne({ booking_ref: bookingRef });
            }

            bookingRef = bookingRef.toUpperCase();

            // Fetch Primary Contact

            const primaryContactObj = await Contact.findOne({ _id: args.reservationInput.primary_contact_id });
            if (!primaryContactObj) {
                throw new Error('Invalid Primary Contact');
            }

            // Create Reservation

            const reservation = new Reservation({
                booking_ref: bookingRef,
                primary_contact: primaryContactObj._id,
            });

            const result = await reservation.save();
            const createdReservation = transformReservation(result);
            return createdReservation;

        }
        catch(err) {
            throw err;
        }
    },
    updateReservation: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        if (!req.userRole === 'superadmin') {
            throw new Error('Forbidden');
        }

        try {
            const primaryContactObj = await Contact.findOne({ _id: args.reservationInput.primary_contact_id });
            if (!primaryContactObj) {
                throw new Error('Invalid Primary Contact');
            }

            const result = await Reservation.findByIdAndUpdate(
                args.reservationInput._id,
                { 
                    primary_contact: primaryContactObj._id,
                },
                { new: true }, // return latest results
            );

            if (!result) {
                throw new Error('Failed to update Reservation');
            }

            const updatedReservation = transformReservation(result);
            return updatedReservation;
        }
        catch(err) {
            throw err;
        }
    },
    deleteReservation: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        if (!req.userRole === 'superadmin') {
            throw new Error('Forbidden');
        }

        try {
            const result = await Reservation.findByIdAndDelete(args.reservationInput._id);

            if (!result) {
                throw new Error('Failed to delete Reservation');
            }

            return true;
        }
        catch(err) {
            throw err;
        }
    },
    getReservationByBookingRef: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        if (!req.userRole === 'superadmin') {
            throw new Error('Forbidden');
        }

        try {
            const result = await Reservation.findOne({ booking_ref: args.reservationInput.booking_ref });
            
            if (!result) {
                throw new Error('Failed to find Reservation with Booking Reference');
            }

            const getReservation = transformReservation(result);
            return getReservation;
        }
        catch(err) {
            throw err;
        }
    },
}