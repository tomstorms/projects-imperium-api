const bcrypt = require('bcryptjs');
const { transformUser } = require('../merge');

const User = require('../../../models/user');

module.exports = {
    users: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        if (!req.userRole === 'superadmin') {
            throw new Error('Forbidden');
        }

        try {
            const users = await User.find();
            return users.map(user => {
                return transformUser(user);
            });
        }
        catch(err) {
            throw err;
        }
    },
    createUser: async (args, req) => {
        try {
            const existingUser = await User.findOne({email: args.userInput.email})
            if (existingUser) {
                throw new Error('User already exists');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            // Only Super Admin allowed to change roles
            let userRole = 'authenticated';
            if (req.userRole === 'superadmin') {
                userRole = args.userInput.user_role;
            }

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword,
                user_role: userRole,
                user_profile: ''
            });
            
            const result = await user.save();

            return { ...result._doc, password: null };
        }
        catch(err) {
            throw err;
        }
    },
    updateUser: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        if ((req.userId !== args.userInput._id) || (!req.userRole === 'superadmin')) {
            // Can only update your own account
            // Unless superadmin
            throw new Error('Forbidden');
        }

        try {

            // Only Super Admin allowed to change roles
            let userRole = 'authenticated';
            if (req.userRole === 'superadmin') {
                userRole = args.userInput.user_role;
            }
            
            const result = await User.findByIdAndUpdate(
                args.userInput._id,
                { 
                    email: args.userInput.email,
                    password: hashedPassword,
                    user_role: userRole,
                    user_profile: ''
                }
            );

            if (!result) {
                throw new Error('Failed to update User');
            }

            return true;
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
            const result = await User.findByIdAndDelete(args.userInput._id);

            if (!result) {
                throw new Error('Failed to delete User');
            }

            return true;
        }
        catch(err) {
            throw err;
        }
    }
}