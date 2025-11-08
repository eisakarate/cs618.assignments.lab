//app.js - handles routes and definitions of them

import express from 'express'
//fix for Refused to connect  Content Security Policy directive: "connect-src 'self'
//import helmet from 'helmet'
import { userRoutes } from './routes/users.js'

import bodyParser from 'body-parser'

import cors from 'cors'

// add socket.io and node
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { handleSocket } from './socket.js'

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
//define routes
userRoutes(app)

//create new server (module.12)
//take the app and wrap a socket-layer around it
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})
handleSocket(io)

//define a route (root)
app.get('/', (req, res) => {
  res.send('hello from express, tests, nodemon running')
})

//define addtional routes
app.get('/posts', (req, res) => {
  res.send('Posts')
})

//make it public
//export { app }
export { server as app } // export node-server
