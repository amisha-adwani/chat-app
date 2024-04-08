const connectToMongo = require("./db");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const Room = require("./models/Room");
const User = require("./models/User");
const router = require("./routes/room");
const authRouter = require("./routes/auth");
const cors = require("cors");
const { ObjectId } = require("mongodb");
require("dotenv").config();
connectToMongo();
const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.get("/", (req, res) => {
  res.send("Server is up and running");
});
app.use("/auth", authRouter);
app.use("/room", router);

io.on("connection", (socket) => {
  socket.on("send_message", ({ message, roomId, senderId, username }) => {
    io.to(roomId).emit("receive_message", { message, senderId, username });
  });

  socket.on('drawing',(data)=>{
    console.log(data.color)
    socket.broadcast.emit('onDrawing', {x : data.x, y: data.y, color: data.color})
  })
  socket.on('endDrawing', (data)=>{
   socket.broadcast.emit('onEndDrawing', {x : data.x, y: data.y})
  })
  socket.on("create-room", async ({ newRoomId, senderId, username }) => {
    try {
      const userId = new ObjectId(senderId);
      const user = await User.findOne({ _id: userId });
      if (user) {
      const room = new Room({
        roomId: newRoomId,
        members: [{ memberId: senderId, memberName: username }],
      });
      await room.save();
      socket.broadcast.emit("created-room", { newRoomId });
  
      
        await User.findOneAndUpdate(
          { _id: userId },
          { $push: { roomsOwned: newRoomId } }
        );
      }
    } catch (error) {
          socket.emit("error",  "Please login to continue");
       
    }
});

  socket.on("remove-room", async ({ roomId, senderId }) => {
    try {
      const userId = new ObjectId(senderId);
      const user = await User.findOne({ _id: userId });
      if (user) {
        if (user.roomsOwned.includes(roomId)) {
          user.roomsOwned = user.roomsOwned.filter(id => id !== roomId);
          user.save()
        await Room.deleteOne({ roomId: roomId })
         console.log("deleted");
        } else {
          socket.emit("error", "You are not the owner of the room");
        }
      }
    } catch (error) {
      socket.emit("error", "Please login to continue");
    }
  });

  socket.on("join-room", async ({ roomId, username, senderId }) => {
    try {
      socket.join(roomId);
      const room = await Room.findOne({ roomId: roomId });
      if (room) {

        await Room.findOneAndUpdate(
          { roomId: roomId },
          { $push: { members: { memberId: senderId, memberName: username } } }
        );

        io.to(roomId).emit("user-join", username);
      } else {
        console.log("ERROR joining room");
      }
    } catch (error) {
      socket.emit("error", "couldnt perform requested action");
    }
  });
  socket.on("leave-room", async ({ roomId, username, senderId }) => {
    try {
      await Room.findOneAndUpdate(
        { roomId: roomId },
        { $pull: { members: { memberId: senderId, memberName: username } } },
        { new: true }
      );
      socket.leave(roomId);
      io.to(roomId).emit("user-left", username);
    } catch (error) {
      socket.emit("error", "couldnt perform requested action");
    }
  });
});

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
