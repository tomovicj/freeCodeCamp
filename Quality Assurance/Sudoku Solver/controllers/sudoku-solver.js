class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length != 81) return { error: 'Expected puzzle to be 81 characters long' };
    if (!/[\d\.]{81}/.test(puzzleString)) return { error: 'Invalid characters in puzzle' };
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const puzzleArray = puzzleString.split("");
    const board = [];
    for (let i = 0; i < 9; i++) {
      board.push(puzzleArray.splice(0, 9));
    }

    return board[row].includes(value) === false;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const puzzleArray = puzzleString.split("");
    const board = [[], [], [], [], [], [], [], [], []];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        board[i].push(puzzleArray[(j * 9) + i]);
      }
    }

    return board[column].includes(value) === false;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const puzzleArray = puzzleString.split("");
    const board = [[], [], [], [], [], [], [], [], []];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 3; j++) {
        const y = Math.floor(i / 3);
        board[(y * 3) + j].push(...puzzleArray.slice((i * 9) + (j * 3), (i * 9) + (j * 3) + 3));
      }
    }

    const x = Math.floor(column / 3);
    const y = Math.floor(row / 3);

    if (x == 3) x = 2;
    if (y == 3) y = 2;

    return board[(y * 3) + x].includes(value) === false;
  }

  solve(puzzleString) {
    const board = puzzleString.split("");

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        // If already filled
        if (board[(row * 9) + col] != ".") continue;

        // Try every possible number
        for (let value = 1; value <= 9; value++) {
          if (this.checkRowPlacement(board.join(""), row, col, value.toString()) &&
            this.checkColPlacement(board.join(""), row, col, value.toString()) &&
            this.checkRegionPlacement(board.join(""), row, col, value.toString())
          ) {
            board[(row * 9) + col] = value.toString();
            // Try to find the rest of numbers with this number
            const x = this.solve(board.join(""));
            // If not dead end
            if (x != null) {
              return x;
            }
          }
        }
        // If dead end
        // If not solved, it means its impossible or invalid game
        if (board[(row * 9) + col] == ".") return null;
      }
    }
    return board.join("");
  }

  getRowAndCol(coordinate) {
    if (/^[A-I][1-9]$/.test(coordinate)) {
      const x = coordinate[1] - 1;
      const y = coordinate.charCodeAt(0) - 65;
      return { row: y, col: x };
    }
    return null;
  }
}

module.exports = SudokuSolver;

