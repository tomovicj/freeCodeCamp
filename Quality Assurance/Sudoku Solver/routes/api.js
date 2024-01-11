'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  const solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (puzzle == undefined || coordinate == undefined || value == undefined) return res.json({ error: 'Required field(s) missing' })

      const validPuzzle = solver.validate(puzzle);
      if (validPuzzle !== true) return res.json(validPuzzle);

      const coordinates = solver.getRowAndCol(coordinate.toUpperCase());
      if (coordinates == null) return res.json({ error: 'Invalid coordinate' });
      if (!/^[1-9]{1}$/.test(value)) return res.json({ error: 'Invalid value' });

      const conflict = [];
      if (!solver.checkRowPlacement(puzzle, coordinates.row, coordinates.col, value)) conflict.push("row");
      if (!solver.checkColPlacement(puzzle, coordinates.row, coordinates.col, value)) conflict.push("column");
      if (!solver.checkRegionPlacement(puzzle, coordinates.row, coordinates.col, value)) conflict.push("region");

      if (conflict.length == 0) {
        return res.json({ valid: true });
      }

      return res.json({ valid: false, conflict });
    });

  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;

      if (puzzle == undefined) return res.json({ error: 'Required field missing' });

      const validPuzzle = solver.validate(puzzle);
      if (validPuzzle !== true) return res.json(validPuzzle);

      const solution = solver.solve(puzzle);
      if (solution == null) return res.json({ error: 'Puzzle cannot be solved' });

      return res.json({ solution });
    });
};
