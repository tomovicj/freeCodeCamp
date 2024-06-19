import Player from "./Player.mjs";
import Collectible from "./Collectible.mjs";

const socket = io();
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d");

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image at ${src}`));
    img.src = src;
  });
};

let goldCoinArt = null;
let mainPlayerArt = null;
let otherPlayerArt = null;
loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/gold-coin.png"
).then((img) => {
  goldCoinArt = img;
  refreshCanvas();
});
loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/main-player.png"
).then((img) => {
  mainPlayerArt = img;
  refreshCanvas();
});
loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/other-player.png"
).then((img) => {
  otherPlayerArt = img;
  refreshCanvas();
});

let players = [];
let me = null;
let ranking = "";
let collectible = null;

socket.on("connect", () => {
  console.log(socket.id);
});

// Handle players connecting/disconnectiog
socket.on("players", (data) => {
  players = data.map((p) => {
    const newPlayer = new Player(p);
    if (newPlayer.id == socket.id) me = newPlayer;
    return newPlayer;
  });
  calculateRank();
  refreshCanvas();
});
socket.on("playerJoin", (data) => {
  players.push(new Player(data));
  calculateRank();
  refreshCanvas();
});
socket.on("playerDisconnect", (data) => {
  // Remove disconnected player from the players array
  for (let i = players.length - 1; i >= 0; i--) {
    if (players[i].id === data.id) {
      players.splice(i, 1);
    }
  }
  calculateRank();
  refreshCanvas();
});

// Handle collectible
socket.on("collectible", (data) => {
  collectible = new Collectible(data);
  refreshCanvas();
});

// Update score of player that collected a collectible
socket.on("playerScore", (data) => {
  console.log(data);
  const player = players.find((p) => p.id == data.id);
  if (player) {
    player.score = data.score;
    calculateRank();
    refreshCanvas();
  }
});

// Update position of player that moved
socket.on("playerMoved", (data) => {
  const player = players.find((p) => p.id == data.id);
  if (player) {
    player.x = data.x;
    player.y = data.y;
    refreshCanvas();
  }
});

const refreshCanvas = () => {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // If the images are not loaded yet, don't draw anything
  if (!mainPlayerArt || !otherPlayerArt || !goldCoinArt) return;

  // Make the background gray
  context.fillStyle = "gray";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the collectible
  if (collectible) context.drawImage(goldCoinArt, collectible.x, collectible.y);

  // Draw the players
  players.forEach((p) => {
    if (p !== me) {
      context.drawImage(otherPlayerArt, p.x, p.y);
    }
  });
  // Draw me last so It's always on top of other players
  if (me) context.drawImage(mainPlayerArt, me.x, me.y);

  // Draw ranking
  context.fillStyle = "white";
  context.font = "20px 'Press Start 2P'";
  context.fillText(ranking, 10, 30);
};

const calculateRank = () => {
  if (me) ranking = me.calculateRank(players);
};

document.addEventListener("keypress", (e) => {
  const dir = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    KeyW: "up",
    KeyS: "down",
    KeyA: "left",
    KeyD: "right",
  }[e.code];

  if (dir) {
    socket.emit("move", { dir, speed: 5 });
  }
});
