const dotenv = require("dotenv/config")
const cors = require("cors")
const express = require("express")
const http = require("http")
const { Server } = require("socket.io")


const PORT = process.env.PORT || 3000
const soundSocketPort = 4000
const chatRoomPort = 5000
const serverOptions = {cors: {origin: "*"}}

const app = express()

app.use(express.static("public"))
app.use(cors)

app.listen(PORT, () => {
    console.log("Summertime Server running on port " + PORT)
})

const initSoundSocket = require("../summertime-server/funcs/soundSocket")
const soundSocketServer = http.createServer().listen(soundSocketPort, () => console.log("soundServer listening on port " + soundSocketPort))
const soundSocket = new Server(soundSocketServer, serverOptions)
initSoundSocket(soundSocket)

const initChatSocket = require("../summertime-server/funcs/chatSocket")
const chatRoomServer = http.createServer().listen(chatRoomPort, () => console.log("chatServer listening on port " + chatRoomPort))
const chatSocket = new Server(chatRoomServer, serverOptions)
initChatSocket(chatSocket)
