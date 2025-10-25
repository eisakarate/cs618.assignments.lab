//app.js - handles routes and definitions of them

import express from 'express'
//fix for Refused to connect  Content Security Policy directive: "connect-src 'self'
//import helmet from 'helmet'

import { postsRouts } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import { eventRoutes } from './routes/events.js'

//import optional authentication
import { optionalAuth } from './middleware/jwt.js'

import bodyParser from 'body-parser'

import cors from 'cors'

//import apollo server
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4' //used to tie the route (app) to the apollo server

//import graphQL type/resolver
import { typeDefs, resolvers } from './graphql/index.js'

//setup a new server (apollo server) to host the type and resolvers
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

const app = express()

//make the app use the body parser to parse JSON
// bodyParser.Json() -> middleware that intercepts the request and parses it to JSON
app.use(bodyParser.json())

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         connectSrc: [
//           "'unsafe-inline'",
//           "'self'",
//           'https://zany-space-eureka-67rqv5jgj67hr4jw-3000.app.github.dev',
//           'https://zany-space-eureka-67rqv5jgj67hr4jw-3000.app.github.dev/',
//           'https://zany-space-eureka-67rqv5jgj67hr4jw-3000.app.github.dev/api/v1/',
//           'http://localhost:3000/',
//           'http://127.0.0.1:3000/',
//         ],
//       },
//     },
//   }),
// )

// use the CORS to allow access from other URLs
app.use(cors())

//start up the apollo server, associate it with a route "/graphql"
apolloServer.start().then(() =>
  app.use(
    '/graphql',
    optionalAuth,
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        return { auth: req.auth }
      },
    }),
  ),
)

//define routes
postsRouts(app)
userRoutes(app)
eventRoutes(app)

//define a route (root)
app.get('/', (req, res) => {
  res.send('hello from express, tests, nodemon running')
})

//define addtional routes
app.get('/posts', (req, res) => {
  res.send('Posts')
})

//make it public
export { app }
