// const express = require('express')
const { ApolloServer } = require('apollo-server')
const { readFileSync } = require('fs');
const { GraphQLScalarType } = require('graphql')

// read GraphQL config file
// var typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8');
var typeDefs = `
      scalar DateTime

      # define Photo Type
      type Photo {
            id: ID!
            url: String!
            name: String!
            description: String
            category: PhotoCategory!
            postedBy: User!
            taggedUsers: [User!]!
            created: DateTime!
      }

      type User {
            githubLogin: ID!
            name: String
            avatar: String
            postedPhotos: [Photo!]!
            inPhotos: [Photo!]! 
      }

      # PhotoCategory
      enum PhotoCategory{
            SELFIE
            PORTRAIT
            ACTION
            LANDSCAPE
            GRAPHIC
      }

      # input type
      input PostPhotoInput {
            name: String!
            description: String
            category: PhotoCategory=PORTRAIT
      }

      type Query {
            totalPhotos: Int!
            allPhotos: [Photo!]!
      }

      type Mutation {
            postPhoto(input: PostPhotoInput!): Photo!
      }
`

// id
var _id = 0;
// Array for Users
var users = [
      {"githubLogin": "mHattrup", "name": "Mike Hattrup"},
      {"githubLogin": "gPlake", "name": "Glen Plake"},
      {"githubLogin": "sSchmidt", "name": "Scot Schmidt"}
];
// Array for photos
var photos = [
      {
            "id": "1",
            "name": "Dropping the Heart Chute",
            "description": "The heart chute is one of my favorite chutes",
            "category": "ACTION",
            "githubUser": "gPlake",
            "created": "2022:08:02"
      },
      {
            "id": "2",
            "name": "Enjoying the sunshine",
            "category": "SELFIE",
            "githubUser": "sSchmidt",
            "created": "2022:08:02"
      },
      {
            "id": "3",
            "name": "Gunbarrel 25",
            "description": "25 laps on gunbarrel today",
            "category": "LANDSCAPE",
            "githubUser": "sSchmidt",
            "created": "2022:08:02"
      }
];
// Array of tag
var tags = [
      { "photoID": "1", "userID": "gPlake" },
      { "photoID": "2", "userID": "sSchmidt" },
      { "photoID": "2", "userID": "mHattrup" },
      { "photoID": "2", "userID": "gPlake" },
];
// data
var d = new Date(`4/18/2018`)

// Revolver
const resolvers = {
      // query
      Query: {
            totalPhotos: () => photos.length,
            allPhotos: () => photos
      },
      // mutaition
      Mutation: {
            postPhoto(parent, args) {
                  // create new photo
                  var newPhoto = {
                        id: _id++,
                        ...args.input,
                        created: new Date()
                  };
                  // add
                  photos.push(newPhoto)
                  return newPhoto
            }
      },
      Photo: {
            url: parent => `http://yoursite.com/img${parent.id}.jpg`,
            postedBy: parent => {
                  return users.find(u => u.githubLogin === parent.githubLogin)
            },
            taggedUsers : parent => tags
                                          .filter(tag => tag.photoID === parent.id)
                                          .map(tag => tag.userID)
                                          .map(userID => users.find(u => u.githubLogin === userID)),
            
      },
      User: {
            postedPhotos: parent => {
                  return photos.filter(p => p.githubLogin === parent.githubLogin)
            },
            inPhotos: parent => tags
                  .filter(tag => tag.userID === parent.id)
                  .map(tag => tag.photoID)
                  .map(photoID => photos.find(p => p.id === photoID))
      },
      DateTime: new GraphQLScalarType({
            name: `DateTime`,
            description: "A valid data time value",
            parseValue: value => new Date(value),
            serialize: value => new Date(value).toISOString(),
            parseLiteral: ast => ast.value
      }),
}

// create server instance
const server = new ApolloServer({
      typeDefs,
      resolvers
});

// start Web server
server
      .listen()
      .then(({url}) => console.log(`GraphQL Service running on ${url}`))

