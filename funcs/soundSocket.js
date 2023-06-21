String.prototype.hashCode = function() {
    var hash = 0,
      i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

class HashTable {
    constructor() {
        this.data = new Array(10)
        this.size = 0
        this.capacity = 7
    }

    add(_id, _data) {
        if(this.size > this.capacity) this.expand()
        let slot = _id.hashCode() % this.data.length
        while(this.data[slot]) {
            slot++
            slot %= this.data.length
        }
        const entry = {id: _id, data: _data}
        this.data[slot] = entry
    }

    get(_id) {
        let slot = _id.hashCode() % this.data.length
        while(!this.data[slot] || this.data[slot].id != _id) {
            slot++
            slot %= this.data.length
        }
        return this.data[slot].data
    }

    remove(_id) {
        let count = 0
        let slot = _id.hashCode() % this.data.length
        while(!this.data[slot] || this.data[slot].id != _id) {
            slot++
            slot %= this.data.length
            if(count++ > this.data.length) return
        }
        this.data[slot] = undefined
    }

    expand() {
        const expandedSize = this.data.length * 2
        console.log("Expanding Hashset to " + expandedSize)
        let newArr = new Array(expandedSize)
        for(let i = 0; i < this.capacity; i++) {
            newArr[i] = this.data[i]
        }
        this.data = newArr
        this.capacity *= 2
    }

    getAll() {
        let all = []
        for(let i = 0; i < this.data.length; i++) {
            const entry = this.data[i]
            if(entry != undefined) all.push(entry.data)
        }
        return all
    }
}

module.exports = function initSoundSocket(io) {

    const Users = new HashTable()
    const users = []

    io.on("connection", (socket) => {
        const id = socket.id
        console.log("new connection with id " + id)
        io.emit("updateUsers", Users.getAll())
    
        socket.on("login", username => {
            Users.add(id, {name: username, id: socket.id})
            io.emit("updateUsers", Users.getAll())
            console.log("user " + username + " has logged in")
        })
    
        socket.on("send", obj => {
            console.log("recieved send from " + socket.id + " of " + obj.sound + " to " + obj.uid)
            io.to(obj.uid).emit("recieve", obj.sound)
        })
    
        socket.on("disconnect", () => {
            Users.remove(id)
            console.log("user " + id +" disconnected")
        })
    })
}