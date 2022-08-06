const express = require('express')
const { ApolloServer, PubSub } = require('apollo-server-express')
const expressPlayground = require('graphql-playground-middleware-express').default
const { readFileSync } = require('fs');
const { GraphQLScalarType } = require('graphql')
//const resolvers = require('./resolvers');
const { MongoClient } = require('mongodb');
const { createServer } = require('http');
const { authorizeWithGithub, uploadStream } = require('./lib');
const fetch = require('node-fetch');
require('dotenv').config();
const path = require('path');

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
            me: (parent, args, { currentUser }) => currentUser,

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
            async postPhoto(parent, args, { db, currentUser, pubsub }) {
                  // check
                  if (!currentUser) {
                        throw new Error('only an authorized user can post a photo')
                  }

                  const newPhoto = {
                        ...args.input,
                        userID: currentUser.githubLogin,
                        created: new Date()
                  }
                  // insert
                  const { insertedIds } = await db.collection('photos').insert(newPhoto);
                  // get ID
                  newPhoto.id = insertedIds[0];
                  
                  // path
                  var toPath = path.join(__dirname, '..', 'assets', 'photos', `${newPhoto.id}.jpg`);
                  const { stream } = await args.input.file;
                  // call uploadStream function
                  await uploadStream(stream, toPath);
                  // publish
                  pubsub.publish('photo-added', { newPhoto });

                  return newPhoto;
            },

            async githubAuth(parent, { code }, { db, pubsub}) {
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
                  const { ops:[user], result  } = await db
                                          .collection('users')
                                          .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true })
              
                  // publish
                  result.upserted && pubsub.publish('user-added', { newUser: user });
                  return { user, token: access_token }
            },

            addFakeUsers: async (parent, { count }, { db, pubsub }) => {
                  
                  var randomUserApi = `https://randomuser.me/api/?results=${count}`
                  // call api
                  var { results } = await fetch(randomUserApi).then(res => res.json())
                  // users info
                  var users = results.map(r => ({
                        githubLogin: r.login.username,
                        name: `${r.name.first} ${r.name.last}`,
                        avatar: r.picture.thumbnail,
                        githubToken: r.login.sha1
                  }))
                  // insert
                  await db.collection('users').insert(users);
                  // publish
                  users.forEach(newUser => pubsub.publish('user-added', {newUser}))

                  return users;
            },

            async fakeUserAuth(parent, { githubLogin }, { db }) {
                  // find user 
                  var user = await db.collection('users').findOne({ githubLogin })
              
                  if (!user) {
                        throw new Error(`Cannot find user with githubLogin "${githubLogin}"`)
                  }     
                  // token & user info
                  return {
                        token: user.githubToken,
                        user
                  }
            }
      },
      Subscription: {
            newPhoto: {
                  subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('photo-added')
            },
            newUser: {
                  subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('user-added')
            },
      },
      Photo: {
            id: parent => parent.id || parent._id,
            url: parent => `/img/photos/${parent.id}.jpg`,
            postedBy: (parent, args, { db })  => db.collection('users').findOne({ githubLogin: parent.userID }),
            taggedUsers: async (parent, args, { db }) => {           
                  // get Array of tags
                  const tags = await db.collection('tags').find().toArray()
                  // login
                  const logins = tags
                      .filter(t => t.photoID === parent._id.toString())
                      .map(t => t.githubLogin)
                      
                  return db.collection('users')
                      .find({ githubLogin: { $in: logins }})
                      .toArray()
            }
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
      // pubsub instance
      const pubsub = new PubSub();

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
            context: async ({ req, connection }) => {
                  const githubToken = req ? req.headers.authorization : connection.context.Authorization;
                  const currentUser = await db.collection('users').findOne({ githubToken })
                  return { db, currentUser, pubsub }
            },
      });

      // add middleware to server
      server.applyMiddleware({ app });

      // config of route
      app.get('/', (req, res) => res.end(`Welcome to the PhotoShare API`));
      app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

      const httpServer = createServer(app);
      // start websocket connection
      server.installSubscriptionHandlers(httpServer);

      // start Web server
      httpServer.listen({ port: 4000 }, () => {
            console.log(`GraphQL Service running on port 4000 ${server.graphqlPath}`)
      });
}

// execute function
start();

