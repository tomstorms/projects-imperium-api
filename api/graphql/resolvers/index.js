const userResolver = require('./user/user');
const userAuthResolver = require('./user_auth/user_auth');

const establishmentResolver = require('./establishment/establishment');
const roomCategoryResolver = require('./roomcategory/roomcategory');
const roomResolver = require('./room/room');

const rootResolver = {
    ...userAuthResolver,
    ...userResolver,
    ...establishmentResolver,
    ...roomCategoryResolver,
    ...roomResolver,
}

module.exports = rootResolver;
