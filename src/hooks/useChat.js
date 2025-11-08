import { useState, useEffect } from 'react'
import { useSocket } from '../contexts/SocketIOContext.jsx'
//import { joinRoom } from '../../backend/src/services/chat.js'

export function useChat() {
  //how to handle chats
  const { socket } = useSocket()
  const [messages, setMessages] = useState([])
  const [currentRoom, setCurrentRoom] = useState('public')

  function switchRoom(room) {
    setCurrentRoom(room)
  }
  function joinRoom(room) {
    socket.emit('chat.join', room)
    switchRoom(room)
  }
  function clearMessage() {
    setMessages([]) //clear the messages in this user's active state
  }
  async function getRooms() {
    const userInfo = await socket.emitWithAck('user.info', socket.id)
    const rooms = userInfo.rooms.filter((room) => room != socket.id)
    return rooms
  }

  //on recieved message
  function receiveMessage(message) {
    setMessages((messages) => [...messages, message])
  }
  //receive
  useEffect(() => {
    socket.on('chat.message', receiveMessage)
    return () => socket.off('chat.message', receiveMessage)
  }, [])

  //send message function
  async function sendMessage(message) {
    //preprocessing
    if (message.startsWith('/')) {
      const [command, ...args] = message.substring(1).split(' ')
      switch (command) {
        case 'clear':
          clearMessage() //set messages to be empty
          break
        case 'rooms': //must enclose the case, when there is more than one line
        {
          const rooms = getRooms() //filterout the default room
          receiveMessage({
            message: `You are in: ${rooms.join(', ')}`,
          })
          break
        }
        case 'join': {
          //check if room was passed
          if (args.length === 0) {
            return receiveMessage({
              message: 'Please provide a room name: /join <room>.',
            })
          }

          //check if the user is alreay in the room
          const room = args[0] //get first room
          const rooms = await getRooms() //get list of rooms
          if (rooms.includes(room)) {
            return receiveMessage({
              message: `You are already in the room: ${room}`,
            })
          }

          //join the room
          joinRoom(room)
          break
        }
        case 'switch': {
          if (args.length === 0) {
            return receiveMessage({
              message: 'Please provide a room name: /switch <room>',
            })
          }
          const room = args[0]
          const rooms = await getRooms()
          if (!rooms.includes(room)) {
            return receiveMessage({
              message: `You are not in room "${room}". Type "/join ${room}" to join it first.`,
            })
          }
          switchRoom(room)
          receiveMessage({
            message: `Switched to room "${room}".`,
          })
          break
        }
        default:
          receiveMessage({
            message: `Unknown command: ${command}`,
          })
          break
      }
    } else {
      socket.emit('chat.message', currentRoom, message)
    }
  }
  return { messages, sendMessage }
}
