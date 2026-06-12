const dotenv = require("dotenv");
dotenv.config();

// Validate env first, before anything else
require("./config/envValidator");

const connectDB = require("./config/db");

const app = require("./app");

// 🔥 NEW
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// 🔥 CREATE HTTP SERVER
const server = http.createServer(app);

// 🔥 SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// 🔥 GLOBAL ACCESS
global.io = io;

// 🔥 CONNECTION CHECK
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// 🔥 USE server.listen INSTEAD OF app.listen
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});