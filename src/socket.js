function concerto(io) {
  io.on("connection", (socket) => {
    new Connection(io, socket);
  });
}

const usersSockets = new Map();
const synthTimeline = [];
const congaTimeline = [];
const drumsTimeline = [];
let numberOfUsers = 0;

class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;
    this.id = socket.id;
    this.name = "Anonymous";

    usersSockets.set(socket, { id: this.id, name: this.name });

    // On connection, send a user-connection event containing user info
    this.sendNewUser(this.id, this.name);
    console.log("new user : " + socket);

    socket.on("disconnect", () => this.disconnect());
    socket.on("connect_error", (err) => {});
    socket.on("getNumberOfUsers", () => this.sendNumberOfUsers());
  }

  sendNumberOfUsers() {
    console.log("send");
    this.socket.emit("numberOfUsers", {number: numberOfUsers});
  }

  // Used on new client connection
  sendNewUser(id, name) {
    numberOfUsers++;
    this.io.sockets.emit("updateNumberOfUsers", { number : numberOfUsers });
  }

  // Used on new client disconnection
  sendFormerUser() {
    numberOfUsers--;
    this.io.sockets.emit("updateNumberOfUsers", { number: numberOfUsers });
  }

  disconnect() {
    console.log("user disconnected :" + this.socket);
    usersSockets.delete(this.socket);
    this.sendFormerUser();
  }
}

module.exports = concerto;
