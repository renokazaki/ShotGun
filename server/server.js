const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const app = express();

const port = process.env.PORT || 5001;
const staticPath = path.resolve(__dirname, "dist");

// setup middleware 
app.use(express.static(staticPath));



const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://post-672j.onrender.com"||"http://localhost:3000",
    // origin: "https://post-672j.onrender.com",
    methods: ["GET", "POST"],
  },
});

//チャットアプリから以下のonとemitのみ修正
let nextUserId = 1; // 次のユーザIDを管理

io.on("connection", (socket) => {
  console.log("New client connected");

  const userId = nextUserId++;
  const userName = `User ${userId}`;
  const id = socket.id
  console.log(id)

  //socketは自分のみ

    socket.on ("item_value",(id, icon, name, description) => {
      console.log(id, icon, name, description)
      //ioはみんなに
      io.emit("item_value",{ id, icon, name, description})
  })


  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    const indexFile = path.join(__dirname, "dist", "index.html");
    return res.sendFile(indexFile);
  });
}

server.listen(port, () => console.log(`server listening on port ${port}`));
