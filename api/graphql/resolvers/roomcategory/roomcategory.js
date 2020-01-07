const Establishment = require('../../../models/establishment');
const RoomCategory = require('../../../models/roomcategory');
const { transformRoomCategory } = require('../merge');

module.exports = {
    room_category: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        if (!(req.userRole === 'authenticated' || req.userRole === 'superadmin')) {
            throw new Error('Forbidden');
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

        if (!req.userRole === 'superadmin') {
            throw new Error('Forbidden');
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
    updateRoomCategory: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        if (!req.userRole === 'superadmin') {
            throw new Error('Forbidden');
        }

        try {
            console.log(args);

            const establishmentObj = await Establishment.findOne({ _id: args.roomCategoryInput.establishment_id });
            if (!establishmentObj) {
                throw new Error('Invalid Establishment');
            }

            const result = await RoomCategory.findByIdAndUpdate(
                args.roomCategoryInput._id,
                { 
                    name: args.roomCategoryInput.name,
                    price: +args.roomCategoryInput.price,
                    establishment: establishmentObj._id,
                },
                { new: true }, // return latest results
            );

            if (!result) {
                throw new Error('Failed to update Room Category');
            }

            const updated = transformRoomCategory(result);
            return updated;
        }
        catch(err) {
            throw err;
        }
    },
    deleteRoomCategory: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        if (!req.userRole === 'superadmin') {
            throw new Error('Forbidden');
        }

        try {
            const result = await RoomCategory.findByIdAndDelete(args.roomCategoryInput._id);

            if (!result) {
                throw new Error('Failed to delete Room Category');
            }

            return true;
        }
        catch(err) {
            throw err;
        }
    }
}