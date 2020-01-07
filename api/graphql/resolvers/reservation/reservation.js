const Reservation = require('../../../models/reservation');
const RoomCategory = require('../../../models/roomcategory');
const Room = require('../../../models/room');
const { transformRoom } = require('../merge');

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
            return reservations.map(room => {
                return transformRoom(room);
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
            let bookingRef = String.random(6);
            let reservationObj = await Reservation.findOne({ reservation_ref: bookingRef });

            while(reservationObj) { 
                bookingRef = String.random(6);
                reservationObj = await Reservation.findOne({ reservation_ref: bookingRef });
            }

            const room = new Reservation({
                name: args.roomInput.name,
                description: args.roomInput.description,
                room_category: roomCategoryObj._id,
            });

            const result = await room.save();
            const createdRoom = transformRoom(result);
            return createdRoom;

        }
        catch(err) {
            throw err;
        }
    },
    updateReservation: async (args, req) => {
    //     if (!req.isAuth) {
            throw new Error('UPDATE COMING');
    //     }

    //     if (!req.userRole === 'superadmin') {
    //         throw new Error('Forbidden');
    //     }

    //     try {
    //         const roomCategoryObj = await RoomCategory.findOne({ _id: args.roomInput.room_category_id });
    //         if (!roomCategoryObj) {
    //             throw new Error('Invalid Room Category');
    //         }

    //         const result = await Room.findByIdAndUpdate(
    //             args.roomInput._id,
    //             { 
    //                 name: args.roomInput.name,
    //                 description: args.roomInput.description,
    //                 room_category: roomCategoryObj._id,
    //             },
    //             { new: true }, // return latest results
    //         );

    //         if (!result) {
    //             throw new Error('Failed to update Room');
    //         }

    //         const updatedRoom = transformRoom(result);
    //         return updatedRoom;
    //     }
    //     catch(err) {
    //         throw err;
    //     }
    },
    deleteReservation: async (args, req) => {
    //     if (!req.isAuth) {
            throw new Error('DELETE COMING');
    //     }

    //     if (!req.userRole === 'superadmin') {
    //         throw new Error('Forbidden');
    //     }

    //     try {
    //         const result = await Room.findByIdAndDelete(args.roomInput._id);

    //         if (!result) {
    //             throw new Error('Failed to delete Room');
    //         }

    //         return true;
    //     }
    //     catch(err) {
    //         throw err;
    //     }
    }
}