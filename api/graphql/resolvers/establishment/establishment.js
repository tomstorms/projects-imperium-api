const Establishment = require('../../../models/establishment');
const { transformEstablishment } = require('../merge');

module.exports = {
    establishments: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        try {
            const establishments = await Establishment.find();
            return establishments.map(establishment => {
                return transformEstablishment(establishment);
            });
        }
        catch(err) {
            throw err;
        }
    },
    createEstablishment: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        try {
            const estObj = new Establishment({
                name: args.establishmentInput.name,
            });

            const result = await estObj.save();
            const created = transformEstablishment(result);
            return created;
        }
        catch(err) {
            throw err;
        }
    },
    updateEstablishment: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        try {
            const result = await Establishment.findByIdAndUpdate(
                args.establishmentInput._id,
                { 
                    name: args.establishmentInput.name,
                },
                { new: true }, // return latest results
            );

            if (!result) {
                throw new Error('Failed to update Establishment');
            }
            
            const updated = transformEstablishment(result);
            return updated;
        }
        catch(err) {
            throw err;
        }
    },
    deleteEstablishment: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        try {
            const result = await Establishment.findByIdAndDelete(args.establishmentInput._id);

            if (!result) {
                throw new Error('Failed to delete Establishment');
            }

            return true;
        }
        catch(err) {
            throw err;
        }
    }
}