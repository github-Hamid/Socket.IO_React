const express = require("express");
// to build our server together with socket.io
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
//establish a connection
// first argument is the express server we created to connect it with
// socket.io server
const io = new Server(server, {
  cors: {
    // which server is going to be calling our socket.ioserver
    // it is the react server and we put local host for react
    origin: "http://localhost:3000",
    // accepting the method of the request
    methods: ["GET", "POST"],
  },
});

// initiate and detect if someone connect
// emit an event
// first argument is id or name
// callback function argument is to specify events and listening events. it is the user(I think)
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected!`);

  //create an event which determines when someone wants to join a room
  // first argument is the name
  // we can pass through the argument 'data' the room id in frontend
  socket.on("join_room", (data) => {
    // join based on the id of the frontend
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // this event is for when user send a message
  // callback function argument 'data' is the object we send in the client side
  socket.on("send_message", (data) => {
    // to() is used to specify which room
    socket.to(data.room).emit("receive_message", data);
  });

  // disconnect at the end of our connection
  socket.on("disconnect", () => {
    console.log(`user ${socket.id} is disconnected`);
  });
});

server.listen(3001, () => {
  console.log("server is listening to 3001");
});
