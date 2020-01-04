const Establishment = require('../../../models/establishment');
const RoomCategory = require('../../../models/roomcategory');
const { transformRoomCategory } = require('../merge');

module.exports = {
    room_category: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        try {
            const roomCategories = await RoomCategory.find();
            return roomCategories.map(roomCategory => {
                return transformRoomCategory(roomCategory);
            });
        }
        catch(err) {
            throw err;
        }
    },
    createRoomCategory: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        try {
            const establishmentObj = await Establishment.findOne({ _id: args.roomCategoryInput.establishment_id });
            if (!establishmentObj) {
                throw new Error('Invalid Establishment');
            }

            const roomCategory = new RoomCategory({
                name: args.roomCategoryInput.name,
                price: +args.roomCategoryInput.price,
                establishment: establishmentObj._id,
            });

            const result = await roomCategory.save();
            const createdRoomCategory = transformRoomCategory(result);
            return createdRoomCategory;
        }
        catch(err) {
            throw err;
        }
    },
}