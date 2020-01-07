const Contact = require('../../../models/contact');
const { transformContact } = require('../merge');

module.exports = {
    contacts: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        if (!(req.userRole === 'authenticated' || req.userRole === 'superadmin')) {
            throw new Error('Forbidden');
        }

        try {
            const contacts = await Contact.find();
            return contacts.map(room => {
                return transformContact(room);
            });
        }
        catch(err) {
            throw err;
        }
    },
    createContact: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        if (!req.userRole === 'superadmin') {
            throw new Error('Forbidden');
        }

        try {
            const contact = new Contact({
                first_name: args.contactInput.first_name,
                last_name: args.contactInput.last_name,
                email: args.contactInput.email,
            });

            const result = await contact.save();
            const createdContact = transformContact(result);
            return createdContact;
        }
        catch(err) {
            throw err;
        }
    },
    updateContact: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('UPDATE COMING');
        }

        if (!req.userRole === 'superadmin') {
            throw new Error('Forbidden');
        }

        try {
            const contactObj = await Contact.findOne({ _id: args.contactInput._id });
            if (!contactObj) {
                throw new Error('Invalid Contact');
            }

            const result = await Contact.findByIdAndUpdate(
                args.contactInput._id,
                { 
                    first_name: args.contactInput.first_name,
                    last_name: args.contactInput.last_name,
                    email: args.contactInput.email,
                },
                { new: true }, // return latest results
            );

            if (!result) {
                throw new Error('Failed to update Contact');
            }

            const updatedContact = transformContact(result);
            return updatedContact;
        }
        catch(err) {
            throw err;
        }
    },
    deleteContact: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('DELETE COMING');
        }

        if (!req.userRole === 'superadmin') {
            throw new Error('Forbidden');
        }

        try {
            const result = await Contact.findByIdAndDelete(args.contactInput._id);

            if (!result) {
                throw new Error('Failed to delete Contact');
            }

            return true;
        }
        catch(err) {
            throw err;
        }
    }
}