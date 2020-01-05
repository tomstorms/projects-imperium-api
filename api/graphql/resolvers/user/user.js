const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../../models/user');

module.exports = {
    createUser: async (args, req) => {
        try {
            const existingUser = await User.findOne({email: args.userInput.email})
            if (existingUser) {
                throw new Error('User already exists');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const userRole = args.userInput.user_role | 'authenticated';

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
}