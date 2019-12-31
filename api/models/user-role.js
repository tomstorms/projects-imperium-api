/**
 * Adapted from: https://stackoverflow.com/questions/38893178/what-is-the-best-way-to-implement-roles-and-permission-in-express-rest-api
 * 
 * Role types:
 * - Super Admin
 * - Admin
 * - Manager
 * - Staff
 * - Guest
 * - Public
 * 
 *  */ 

const mongoose = require('mongoose');

const userRoleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    type: {
        type: String,
        unique: true,
        required: [ true, "Role name is required" ]
    },
    rights: [
        {
            name: String, // permission name
            path: String, // based path
            url: String   // if granted, the path to give access to
        }
    ]
});

module.exports = mongoose.set('useCreateIndex', true).model('UserRole', userRoleSchema);