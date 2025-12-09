export enum PlayerSymbol {
  X = 'X',
  O = 'O',
  TRIANGLE = '▲'
}

export interface Player {
  id: number;
  name: string;
  symbol: PlayerSymbol;
  color: string;
  bgColor: string;
  borderColor: string;
}

export type BoardState = (PlayerSymbol | null)[];

export interface WinResult {
  winner: PlayerSymbol | null;
  line: number[] | null;
  isDraw: boolean;
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}