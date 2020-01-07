const userResolver = require('./user/user');
const userAuthResolver = require('./user_auth/user_auth');

const establishmentResolver = require('./establishment/establishment');
const roomCategoryResolver = require('./roomcategory/roomcategory');
const roomResolver = require('./room/room');
const contactResolver = require('./contact/contact');
const reservationResolver = require('./reservation/reservation');

const rootResolver = {
    ...userAuthResolver,
    ...userResolver,
    ...establishmentResolver,
    ...roomCategoryResolver,
    ...roomResolver,
    ...contactResolver,
    ...reservationResolver,
}

module.exports = rootResolver;
