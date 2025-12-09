import { Player, PlayerSymbol } from './types';

export const GRID_SIZE = 5;
export const WIN_LENGTH = 4;

export const PLAYERS: Player[] = [
  {
    id: 0,
    name: 'Player 1',
    symbol: PlayerSymbol.X,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-100 dark:bg-cyan-400/20',
    borderColor: 'border-cyan-500 dark:border-cyan-400'
  },
  {
    id: 1,
    name: 'Player 2',
    symbol: PlayerSymbol.O,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-100 dark:bg-rose-400/20',
    borderColor: 'border-rose-500 dark:border-rose-400'
  },
  {
    id: 2,
    name: 'Player 3',
    symbol: PlayerSymbol.TRIANGLE,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-400/20',
    borderColor: 'border-emerald-500 dark:border-emerald-400'
  }
];

export const INITIAL_BOARD: (PlayerSymbol | null)[] = Array(GRID_SIZE * GRID_SIZE).fill(null);