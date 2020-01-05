
const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type Establishment {
        _id: ID!
        name: String!
        room_category: [RoomCategory]
    }
    input EstablishmentInputCreate {
        name: String!
    }
    input EstablishmentInputUpdate {
        _id: ID!
        name: String!
    }
    input EstablishmentInputDelete {
        _id: ID!
    }


    type RoomCategory {
        _id: ID!
        name: String!
        price: Float!
        establishment: Establishment!
    }
    input RoomCategoryInput {
        name: String!
        price: Float!
        establishment_id: String!
    }
    input RoomCategoryInputUpdate {
        _id: ID!
        name: String
        price: Float
        establishment_id: String
    }
    input RoomCategoryInputDelete {
        _id: ID!
    }


    type Room {
        _id: ID!
        name: String!
        description: String
        room_category: RoomCategory!
    }
    input RoomInput {
        name: String!
        description: String
        room_category_id: String!
    }
    input RoomInputUpdate {
        _id: ID!
        name: String!
        description: String
        room_category_id: String!
    }
    input RoomInputDelete {
        _id: ID!
    }


    type User {
        _id: ID!
        email: String!
        password: String
        user_role: String!
        user_profile: String
    }
    input UserInput {
        email: String!
        password: String!
        user_role: String! = "authenticated"
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
        userRole: String!
        userProfile: String
    }

    type RootQuery {
        establishments: [Establishment!]!
        room_category: [RoomCategory!]!
        rooms: [Room!]!
        login(email: String!, password: String!): AuthData!
    }

    type RootMutation {
        createEstablishment(establishmentInput: EstablishmentInputCreate!): Establishment
        updateEstablishment(establishmentInput: EstablishmentInputUpdate!): Establishment
        deleteEstablishment(establishmentInput: EstablishmentInputDelete!): Boolean

        createRoomCategory(roomCategoryInput: RoomCategoryInput!): RoomCategory
        updateRoomCategory(roomCategoryInput: RoomCategoryInputUpdate!): RoomCategory
        deleteRoomCategory(roomCategoryInput: RoomCategoryInputDelete!): Boolean

        createRoom(roomInput: RoomInput!): Room
        updateRoom(roomInput: RoomInputUpdate!): Room
        deleteRoom(roomInput: RoomInputDelete!): Boolean

        createUser(userInput: UserInput!): User
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);