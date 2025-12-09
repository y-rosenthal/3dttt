import { GRID_SIZE, WIN_LENGTH } from '../constants';
import { BoardState, PlayerSymbol, WinResult } from '../types';

export const checkWin = (board: BoardState): WinResult => {
  const size = GRID_SIZE;
  const len = WIN_LENGTH;

  // Helper to get cell at row, col
  const getCell = (r: number, c: number) => board[r * size + c];

  // Check all possible starting positions
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const current = getCell(r, c);
      if (!current) continue;

      // Directions: [dRow, dCol]
      const directions = [
        [0, 1],  // Horizontal
        [1, 0],  // Vertical
        [1, 1],  // Diagonal Down-Right
        [1, -1]  // Diagonal Down-Left
      ];

      for (const [dr, dc] of directions) {
        // Check if a line of WIN_LENGTH fits in this direction from (r,c)
        let lineIndices: number[] = [r * size + c];
        let match = true;

        for (let k = 1; k < len; k++) {
          const nr = r + dr * k;
          const nc = c + dc * k;

          // Check bounds
          if (nr < 0 || nr >= size || nc < 0 || nc >= size) {
            match = false;
            break;
          }

          if (getCell(nr, nc) !== current) {
            match = false;
            break;
          }
          lineIndices.push(nr * size + nc);
        }

        if (match) {
          return {
            winner: current,
            line: lineIndices,
            isDraw: false
          };
        }
      }
    }
  }

  // Check draw
  if (!board.includes(null)) {
    return { winner: null, line: null, isDraw: true };
  }

  return { winner: null, line: null, isDraw: false };
};
