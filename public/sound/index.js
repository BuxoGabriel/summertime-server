const socket = io("ws://localhost:4000")
let username = ""
let users = []
let id = undefined
const userlist = document.getElementById("onlineUsers")
const personSelect = document.getElementById("personSelect")

const clownHorn = new Audio("clownHorn.mp3")
const duckQuack = new Audio("duckQuack.mp3")
const goofyFall = new Audio("goofyFall.mp3")
const soundPlays = [clownHorn, duckQuack, goofyFall]

function updateUsers(_users) {
    //update user list
    users = _users
    //update online users
    const userlistChildren = users.map(user => {
        let ele = document.createElement("li")
        ele.innerText = user.name
        ele.onclick = () => sendSelectedSound(user.id)
        return ele
    })
    userlist.replaceChildren(...userlistChildren)
}

socket.on("updateUsers", users => updateUsers(users))

socket.on("recieve", _sound => {
    console.log("recieved " + _sound)
    const sound = soundPlays[_sound]
    sound.play()
})

document.getElementById("login").onclick = () => {
    username = document.getElementById("username").value
    if(username) {
        socket.emit("login", username)
    }
    document.getElementById("loginForm").style.display = "none"
}

function sendSelectedSound(_uid) {
    const select = document.getElementById("soundSelect")
    socket.emit("send", {uid: _uid, sound: select.selectedIndex})
    console.log("sent option " + select.selectedIndex + " to " + _uid)
}