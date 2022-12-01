const { createServer } = require("http");
const { Server } = require("socket.io");
// Import our main class
const concerto = require("./src/socket");

// Create web server
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Listen for new websocket connections
concerto(io);

// Start the server
httpServer.listen(process.env.PORT || 3000);