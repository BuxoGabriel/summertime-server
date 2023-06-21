module.exports = function initChatSocket(io) {
    let usersOnline = 0

    io.on("connection", (socket) => {
        console.log("A new user has connected")
        usersOnline++
        io.emit("updateUsers", usersOnline)
        
        socket.on("sendMsg", (msg) => {
            io.emit("recieveMsg", msg)
            console.log(`User ${socket.id} sent Msg ${msg}`)
        })
    
        socket.on("disconnect", () => {
            console.log("A user has disconnected")
            usersOnline--
            io.emit("updateUsers", usersOnline)
        })
    })

}