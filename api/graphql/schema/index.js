
const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type Establishment {
        _id: ID!
        name: String!
        room_category: [RoomCategory]
    }
    input EstablishmentInput {
        name: String!
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
        createEstablishment(establishmentInput: EstablishmentInput!): Establishment
        createRoomCategory(roomCategoryInput: RoomCategoryInput!): RoomCategory
        createRoom(roomInput: RoomInput!): Room
        createUser(userInput: UserInput!): User
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);