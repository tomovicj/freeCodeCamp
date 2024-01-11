class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length != 81) return { error: 'Expected puzzle to be 81 characters long' };
    if (!/[\d\.]{81}/.test(puzzleString)) return { error: 'Invalid characters in puzzle' };
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const board = this.makeBoard(puzzleString);

    return board[row].includes(value) === false;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const board = this.makeBoard(puzzleString);

    for (let i = 0; i < 9; i++) {
      if (board[i][column] == value) {
        return false;
      }
    }

    return true;
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

    for (let i = 0; i < board.length; i++) {
      if (board[i] != ".") continue;

      const row = Math.floor(i / 9);
      const column = i - (row * 9);
      for (let value = 1; value <= 9; value++) {
        if (this.checkRowPlacement(board.join(""), row, column, value.toString()) &&
          this.checkColPlacement(board.join(""), row, column, value.toString()) &&
          this.checkRegionPlacement(board.join(""), row, column, value.toString())
        ) {
          board[i] = value.toString();
          const solution = this.solve(board.join(""));
          if (solution != null) {
            return solution;
          } else {
            // If solution is not right
            board[i] = ".";
          }
        }
      }
      if (board[i] == ".") {
        return null;
      }
    }
    return board.join("");
  }

  makeBoard(puzzleString) {
    const puzzleArray = puzzleString.split("");
    const board = [];
    for (let i = 0; i < 9; i++) {
      board.push(puzzleArray.slice(i * 9, (i * 9) + 9));
    }
    return board;
  }

  getRowAndCol(coordinate) {
    if (/^[A-I][1-9]$/.test(coordinate)) {
      const x = coordinate[1] - 1;
      const y = coordinate.charCodeAt(0) - 65;
      return { row: y, col: x };
    }
    return null;
  }

  isAlreadyPlaced(puzzleString, row, column, value) {
    const board = this.makeBoard(puzzleString);
    if (board[row][column] == value) return true;
    return false;
  }
}

module.exports = SudokuSolver;

