require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expect = require("chai");
const socket = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const nocache = require("nocache");

const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner.js");

const Player = require("./public/Player.mjs");
const Collectible = require("./public/Collectible.mjs");

const app = express();

// Security features
app.use(helmet());
app.use(nocache()); // helmet.noCache() is deprecated
app.use((req, res, next) => {
  res.setHeader("X-Powered-By", "PHP 7.4.3");
  res.setHeader("pragma", "no-cache");
  next();
});

app.use("/public", express.static(process.cwd() + "/public"));
app.use("/assets", express.static(process.cwd() + "/assets"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({ origin: "*" }));

// Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log("Tests are not valid:");
        console.error(error);
      }
    }, 1500);
  }
});

const io = socket(server);

const players = [];
let collectible;

const getRandomPosition = (maxCoord) => Math.floor(Math.random() * maxCoord);

const createCollectible = () => {
  collectible = new Collectible({
    x: getRandomPosition(640 - 15),  // 15 is the width of the collectible
    y: getRandomPosition(480 - 15),  // 15 is the height of the collectible
    value: 1,
    id: 0,
  });
  return collectible;
};

collectible = createCollectible();

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle new player joining the game
  const newPlayer = new Player({ x: getRandomPosition(640 - 30), y: getRandomPosition(480 - 30), score: 0, id: socket.id });    // 30 is the width and height of the player
  players.push(newPlayer)
  io.emit("playerJoin", newPlayer);

  // Send current game data
  socket.emit("players", players);
  socket.emit("collectible", collectible);
  
  // Handle player movement
  socket.on("move", (data) => {
    const player = players.find((player) => player.id === socket.id);
    if (!player) return;
    player.movePlayer(data.dir, data.speed);
    io.emit("playerMoved", {id: player.id, x: player.x, y: player.y});
    
    // Handle player collecting a collectible
    if (player.collision(collectible)) {
      player.score += collectible.value;
      io.emit("playerScore", {id: player.id, score: player.score});
      collectible = createCollectible();
      io.emit("collectible", collectible);
    }
  });

  // Handle player disconnecting from the game
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // Remove disconnected player from the players array
    for (let i = players.length - 1; i >= 0; i--) {
      if (players[i].id === socket.id) {
          players.splice(i, 1);
      }
    }
    io.emit("playerDisconnect", {id: socket.id});
  });
});

module.exports = app; // For testing
