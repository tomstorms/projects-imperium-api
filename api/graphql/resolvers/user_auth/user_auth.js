const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../../models/user');

module.exports = {
    login: async ({email, password}) => {
        try {
            const defaultTokenExpiry = 15 * 60; // seconds

            const user = await User.findOne({email: email});
            if (!user) {
                throw new Error('User does not exist');
            }

            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new Error('Password is incorrect');
            }

            const tokenExpiry = Math.floor(Date.now() / 1000) + defaultTokenExpiry;

            const token = jwt.sign(
                {
                    exp: tokenExpiry,
                    userId: user.id,
                    userRole: user.user_role,
                    email: user.email 
                },
                process.env.JWT_KEY
            );

            return { 
                token: token, 
                tokenExpiration: tokenExpiry, 
                userId: user.id, 
                userRole: user.user_role, 
                userProfile: user.user_profile,
            };
        }
        catch(err) {
            throw err;
        }
    }
}