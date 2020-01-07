const RoomCategory = require('../../../models/roomcategory');
const Room = require('../../../models/room');
const { transformRoom } = require('../merge');

module.exports = {
    rooms: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        if (!(req.userRole === 'authenticated' || req.userRole === 'superadmin')) {
            throw new Error('Forbidden');
        }

        try {
            const rooms = await Room.find();
            return rooms.map(room => {
                return transformRoom(room);
            });
        }
        catch(err) {
            throw err;
        }
    },
    createRoom: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        if (!req.userRole === 'superadmin') {
            throw new Error('Forbidden');
        }

        try {
            const roomCategoryObj = await RoomCategory.findOne({ _id: args.roomInput.room_category_id });
            if (!roomCategoryObj) {
                throw new Error('Invalid Room Category');
            }

            const room = new Room({
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
    updateRoom: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        if (!req.userRole === 'superadmin') {
            throw new Error('Forbidden');
        }

        try {
            const roomCategoryObj = await RoomCategory.findOne({ _id: args.roomInput.room_category_id });
            if (!roomCategoryObj) {
                throw new Error('Invalid Room Category');
            }

            const result = await Room.findByIdAndUpdate(
                args.roomInput._id,
                { 
                    name: args.roomInput.name,
                    description: args.roomInput.description,
                    room_category: roomCategoryObj._id,
                },
                { new: true }, // return latest results
            );

            if (!result) {
                throw new Error('Failed to update Room');
            }

            const updatedRoom = transformRoom(result);
            return updatedRoom;
        }
        catch(err) {
            throw err;
        }
    },
    deleteRoom: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        if (!req.userRole === 'superadmin') {
            throw new Error('Forbidden');
        }

        try {
            const result = await Room.findByIdAndDelete(args.roomInput._id);

            if (!result) {
                throw new Error('Failed to delete Room');
            }

            return true;
        }
        catch(err) {
            throw err;
        }
    }
}