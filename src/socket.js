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
    socket.on("addTimeline", (arg) => this.addTimeline(arg.type, arg.data));
    socket.on("getTimelines", () => this.getTimelines());
  }

  sendNumberOfUsers() {
    console.log("send");
    this.socket.emit("numberOfUsers", { number: numberOfUsers });
  }

  getTimelines() {
    console.log("getTimelines");
    if(synthTimeline.length > 0) {
      this.socket.emit("synthTimeline", {
        type: "synth",
        data: synthTimeline,
      });
    }
    if(congaTimeline.length > 0) {
      this.socket.emit("congaTimeline", {
        type: "conga",
        data: congaTimeline,
      });
    }
    if(drumsTimeline.length > 0) {
      this.socket.emit("drumsTimeline", {
        type: "drums",
        data: drumsTimeline,
      });
    }
  }

  addTimeline(type, data) {
    switch (type) {
      case "synth":
        synthTimeline.push(data);
        console.log("addTimeline : synth");
        console.log(synthTimeline);
        this.io.sockets.emit("addSynthTimeline", data);
        break;
      case "conga":
        congaTimeline.push(data);
        console.log("addTimeline : conga");
        console.log(congaTimeline);
        this.io.sockets.emit("addCongaTimeline", data);
        break;
      case "drums":
        drumsTimeline.push(data);
        console.log("addTimeline : drums");
        console.log(drumsTimeline);
        this.io.sockets.emit("addDrumsTimeline", data);
        break;
    }
  }

  // Used on new client connection
  sendNewUser() {
    numberOfUsers++;
    this.io.sockets.emit("updateNumberOfUsers", { number: numberOfUsers });
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
