import jwt from 'jsonwebtoken' //for token/authentication
import { getUserInfoById } from './services/users.js' //get the user information form the service layer

import {
  joinRoom,
  sendPublicMessage,
  getUserInfoBySocketId,
} from './services/chat.js'
//listen to a connection/socket-event
export function handleSocket(io) {
  //require authentication, for all requests (middleware thar runs before anything)
  io.use((socket, next) => {
    //check if token was provided
    if (!socket.handshake.auth?.token) {
      return next(new Error('Authentication failed: no token provided'))
    }
    //jwt token was passed, verify the token via JWT_SECRET we set in the environment
    jwt.verify(
      socket.handshake.auth.token,
      process.env.JWT_SECRET,
      async (err, decodedToken) => {
        //check if the token doesn't meet our requirements
        if (err) {
          //failed, set the "next" step as "error"
          return next(new Error('Authentication failed: invalid token'))
        }
        // store the decoded token in socket.auth
        socket.auth = decodedToken
        //get the user's info
        socket.user = await getUserInfoById(socket.auth.sub)
        return next()
      },
    )
  })

  //function to handle connection (called after the io.use())
  io.on('connection', async (socket) => {
    joinRoom(io, socket, { room: 'public' })

    //join the room
    socket.on('chat.message', (room, message) =>
      sendPublicMessage(io, { username: socket.user.username, room, message }),
    )
    socket.on('chat.join', (room) => joinRoom(io, socket, { room }))
    //send user info
    socket.on('user.info', async (socketId, callback) =>
      callback(await getUserInfoBySocketId(io, socketId)),
    )
  })
}
