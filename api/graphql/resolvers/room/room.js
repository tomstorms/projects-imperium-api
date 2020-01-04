const RoomCategory = require('../../../models/roomcategory');
const Room = require('../../../models/room');
const { transformRoom } = require('../merge');

module.exports = {
    rooms: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
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
}