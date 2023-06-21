const socket = io("https://summertime-server-production.up.railway.app:5000")

const form = document.getElementById("sendMsg")
const message = document.getElementById("message")

form.addEventListener("submit", (e) => {
    e.preventDefault()
    const msg = message.value
    if(msg) {
        socket.emit("sendMsg", msg)
        console.log(`Sent Msg: ${msg}`)
        message.value = ""
    }
})

const chatLog = document.getElementById("msgs")

socket.on("recieveMsg", msg => {
    console.log("recieved msg " + msg)
    let msgNode = document.createElement("li")
    msgNode.innerHTML = msg
    chatLog.appendChild(msgNode)
})

const users = document.getElementById("online")
socket.on("updateUsers", _users => {
    console.log("update " + _users)
    users.innerHTML = `Online Users ${_users}`
})