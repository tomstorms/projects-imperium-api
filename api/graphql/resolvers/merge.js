const DataLoader = require('dataloader');

const User = require('../../models/user');
const Establishment = require('../../models/establishment');
const RoomCategory = require('../../models/roomcategory');
const Contact = require('../../models/contact');
const { dateToString } = require('../../helpers/date');

const userLoader = new DataLoader(userIds => {
    return User.find({_id: {$in: userIds}});
});

const user = async userId => {
    try {
        const user = await userLoader.load(userId.toString());
        return { 
            ...user._doc, 
            _id: user.id, 
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents) 
        };
    }
    catch(err) {
        throw err;
    }
};

const establishmentLoader = new DataLoader(establishmentIds => {
    return Establishment.find({_id: {$in: establishmentIds}});
});

const roomCategoryLoader = new DataLoader(roomCategoryIds => {
    return roomCategory(roomCategoryIds);
});

const roomCategory = async roomCategoryIds => {
    try {
        const roomCategories = await RoomCategory.find({_id: {$in: roomCategoryIds}});
        roomCategories.sort((a,b) => {
            return (
                roomCategoryIds.indexOf(a._id.toString()) - roomCategoryIds.indexOf(b._id.toString())
            );
        });
        return roomCategories.map(event => {
            return transformRoomCategory(event);
        });
    }
    catch(err) {
        throw err;
    }
}

const singleEvent = async eventId => {
    try {
        const event = await eventLoader.load(eventId.toString());
        return event;
    }
    catch(err) {
        throw err;
    }
};

const singleEstablishment = async establishmentId => {
    try {
        const establishment = await establishmentLoader.load(establishmentId.toString());
        return establishment;
    }
    catch(err) {
        throw err;
    }
};

const singleRoomCategory = async roomCategoryId => {
    try {
        const roomCategory = await roomCategoryLoader.load(roomCategoryId.toString());
        return roomCategory;
    }
    catch(err) {
        throw err;
    }
};

const manyRoomCategoryOfEstablishment = async establishmentId => {
    try {
        const roomCategories = await RoomCategory.find({establishment: {$in: establishmentId}});
        return roomCategories;
    }
    catch(err) {
        throw err;
    }
};


const contactLoader = new DataLoader(contactIds => {
    return Contact.find({_id: {$in: contactIds}});
});

const singleContact = async contactId => {
    try {
        const contact = await contactLoader.load(contactId.toString());
        return contact;
    }
    catch(err) {
        throw err;
    }
};

// const transformEvent = event => {
//     return {
//         ...event._doc, 
//         _id: event.id,
//         date: dateToString(event._doc.date),
//         creator: user.bind(this, event.creator),
//     }
// }
// exports.transformEvent = transformEvent;

// const transformBooking = booking => {
//     return { 
//         ...booking._doc,
//         _id: booking.id, 
//         user: user.bind(this, booking._doc.user),
//         event: singleEvent.bind(this, booking._doc.event),
//         createdAt: dateToString(booking._doc.createdAt),
//         updatedAt: dateToString(booking._doc.updatedAt),
//     };
// }
// exports.transformBooking = transformBooking;

const transformEstablishment = establishment => {
    return { 
        ...establishment._doc,
        _id: establishment.id, 
        room_category: manyRoomCategoryOfEstablishment.bind(this, establishment.id),
    };
}
exports.transformEstablishment = transformEstablishment;

const transformRoomCategory = roomCategory => {
    return { 
        ...roomCategory._doc,
        _id: roomCategory.id, 
        establishment: singleEstablishment.bind(this, roomCategory._doc.establishment),
    };
}
exports.transformRoomCategory = transformRoomCategory;

const transformRoom = room => {
    return { 
        ...room._doc,
        _id: room.id, 
        room_category: singleRoomCategory.bind(this, room._doc.room_category),
    };
}
exports.transformRoom = transformRoom;

const transformUser = user => {
    return { 
        ...user._doc,
        _id: user.id,
    };
}
exports.transformUser = transformUser;

const transformContact = contact => {
    return { 
        ...contact._doc,
        _id: contact.id,
    };
}
exports.transformContact = transformContact;

const transformReservation = reservation => {
    return { 
        ...reservation._doc,
        _id: reservation.id,
        primary_contact: singleContact.bind(this, reservation._doc.primary_contact),
    };
}
exports.transformReservation = transformReservation;
