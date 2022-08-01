// const express = require('express')
const { ApolloServer } = require('apollo-server')
const { readFileSync } = require('fs');

// read GraphQL config file
// var typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8');
var typeDefs = `
      # define Photo Type
      type Photo {
            id: ID!
            url: String!
            name: String!
            description: String
            category: PhotoCategory!
            postedBy: User!
      }

      type User {
            githubLogin: ID!
            name: String
            avatar: String
            postedPhotos: [Photo!]!
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
            "githubUser": "gPlake"
      },
      {
            "id": "2",
            "name": "Enjoying the sunshine",
            "category": "SELFIE",
            "githubUser": "sSchmidt"
      },
      {
            "id": "3",
            "name": "Gunbarrel 25",
            "description": "25 laps on gunbarrel today",
            "category": "LANDSCAPE",
            "githubUser": "sSchmidt"
      }
];

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
                        ...args.input
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
            }
      },
      User: {
            postedPhotos: parent => {
                  return photos.filter(p => p.githubLogin === parent.githubLogin)
            }
      }
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

