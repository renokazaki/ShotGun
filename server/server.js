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
    // origin: "http://localhost:3000",
    origin: "https://shotgun.onrender.com",
    methods: ["GET", "POST"],
  },
});

//チャットアプリから以下のonとemitのみ修正
let nextUserId = 1; // 次のユーザIDを管理

io.on("connection", (socket) => {
  // console.log("New client connected");

  const userId = nextUserId++;
  const id = socket.id
  // console.log(id)

  //socketは自分のみ

  socket.emit("your_data", { userId ,id});


    socket.on ("item_value",(id, icon, name, description) => {
      console.log("サーバー"+id, icon, name, description)
      //ioはみんなに
      io.emit("item_value",{ id, icon, name, description})
  })




  socket.on("userName_value", (userName, id) => {
    console.log(userName, id);
    
    // userNameオブジェクトのflagプロパティをtrueに設定
    const updatedUserName = { ...userName, flag: true };

    // 全クライアントに送信
    io.emit("userName_value", updatedUserName, { userId, id });
  });

  socket.on('opponent_life', (opponentLife) => {
    console.log('Received opponentLife from client:', opponentLife);
    

    const newOpponentLife = opponentLife.slice(0, -1);
    console.log('Processed opponentLife:', newOpponentLife);

    // 全クライアントに新しい opponentLife を送信
    io.emit('opponent_life', newOpponentLife);
  });


  socket.on('my_life', (myLife) => {
    console.log('Received myLife from client:', myLife);
    

    const newMyLife = myLife.slice(0, -1);
    console.log('Processed myLife:', newMyLife);

    // 全クライアントに新しい opponentLife を送信
    io.emit('my_life', newMyLife);
  });


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
