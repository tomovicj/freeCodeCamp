class Player {
  constructor({ x, y, score, id }) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
  }

  movePlayer(dir, speed) {
    switch (dir) {
      case "up":
        this.y -= speed;
        if (this.y < 0) {
          this.y = 0;
        }
        break;
      case "down":
        this.y += speed;
        // 30 is the height of the player
        if (this.y > 480 - 30) {
          this.y = 480 - 30;
        }
        break;
      case "left":
        this.x -= speed;
        if (this.x < 0) {
          this.x = 0;
        }
        break;
      case "right":
        this.x += speed;
        // 30 is the width of the player
        if (this.x > 640 - 30) {
          this.x = 640 - 30;
        }
        break;
    }
  }
  collision(item) {
    const centerX = item.x + 7.5;
    const centerY = item.y + 7.5;
    if (
      this.x <= centerX &&
      this.x + 30 >= centerX &&
      this.y <= centerY &&
      this.y + 30 >= centerY
    ) {
      return true;
    }
  }

  calculateRank(arr) {
    const sorted = arr.sort((a, b) => b.score - a.score);
    return `Rank: ${sorted.findIndex((player) => player.id === this.id) + 1}/${
      sorted.length
    }`;
  }
}

try {
  module.exports = Player;
} catch (e) {}

export default Player;
