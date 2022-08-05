const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const expressPlayground = require('graphql-playground-middleware-express').default
const { readFileSync } = require('fs');
const { GraphQLScalarType } = require('graphql')
//const resolvers = require('./resolvers');
const { MongoClient } = require('mongodb');
const { authorizeWithGithub } = require('./lib');
require('dotenv').config();

// read GraphQL config file
var typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8');

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
            totalPhotos: (parent, args, { db }) => 
                  db.collection('photos')
                  .estimatedDocumentCount(),

            allPhotos: (parent, args, { db }) =>
                  db.collection('photos')
                  .find()
                  .toArray(),
            
            totalUsers: (parent, args, { db }) =>
                  db.collection('users')
                  .estimatedDocumentCount(),
            
            allUsers: (parent, args, { db }) =>
                  db.collection('users')
                  .find()
                  .toArray(),
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
            },

            async githubAuth(parent, { code }, { db }) {
                  // get accecctoken & account info
                  let {
                        message,
                        access_token,
                        avatar_url,
                        login,
                        name
                  } = await authorizeWithGithub({
                        client_id: process.env.CLIENT_ID,
                        client_secret: process.env.CLIENT_SECRET,
                        code
                  })
              
                  if (message) {
                        throw new Error(message)
                  }
                  // fix the user info
                  let latestUserInfo = {
                        name,
                        githubLogin: login,
                        githubToken: access_token,
                        avatar: avatar_url
                  }
                  // mutate users info 
                  const { ops:[user] } = await db
                                          .collection('users')
                                          .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true })
              
                  return { user, token: access_token }
            },
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

/**
 * sever start
 */
async function start() {
      // server
      var app = express();

      var server;
      var db;
      // DB name
      const MONGO_DB = process.env.DB_HOST;

      try {
            // create DB object
            const client = await MongoClient.connect(MONGO_DB, { 
                  useNewUrlParser: true 
            });
            // connect to DB
            db = client.db();
      } catch (error) {
            console.log(`
            
              Mongo DB Host not found!
              please add DB_HOST environment variable to .env file
              exiting...
               
            `)
            process.exit(1)
      }

      // create server instance
      server = new ApolloServer({
            typeDefs,
            resolvers,
            context: { db },
      });

      // add middleware to server
      server.applyMiddleware({ app });

      // config of route
      app.get('/', (req, res) => res.end(`Welcome to the PhotoShare API`));
      app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

      // start Web server
      app.listen({ port: 4000 }, () => {
            console.log(`GraphQL Service running on port 4000 ${server.graphqlPath}`)
      });
}

// execute function
start();

