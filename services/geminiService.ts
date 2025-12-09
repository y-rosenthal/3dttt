import { GoogleGenAI } from "@google/genai";
import { BoardState, Player } from "../types";
import { GRID_SIZE, WIN_LENGTH } from "../constants";

// Initialize Gemini
// Note: In a real production app, you might proxy this through a backend to hide the key.
// But for this SPA requirement, we use the env variable directly as instructed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getGeminiHint = async (
  board: BoardState,
  currentPlayer: Player,
  allPlayers: Player[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key missing. Cannot fetch hint.";
  }

  try {
    const boardVisual = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      const row = board.slice(r * GRID_SIZE, (r + 1) * GRID_SIZE).map(c => c || '.').join(' ');
      boardVisual.push(row);
    }
    const boardString = boardVisual.join('\n');

    const prompt = `
      You are an expert strategic game advisor for a 3-player Tic-Tac-Toe variant.
      
      RULES:
      1. The game is played on a ${GRID_SIZE}x${GRID_SIZE} grid.
      2. There are 3 players: Player 1 (X), Player 2 (O), and Player 3 (▲).
      3. The goal is to get ${WIN_LENGTH} of your symbols in a row (horizontal, vertical, or diagonal).
      4. It is currently ${currentPlayer.name}'s turn (Symbol: ${currentPlayer.symbol}).
      
      CURRENT BOARD STATE:
      ${boardString}
      
      TASK:
      Analyze the board. Identify threats from other players and winning opportunities for the current player.
      Suggest the SINGLE best move for ${currentPlayer.name} in format (Row, Col) using 0-based indexing.
      Provide a brief, witty, 1-sentence explanation of why.
      
      Output format: "Move: (row, col). Reason: [Reasoning]"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The AI is pondering too deeply and timed out. Rely on your instincts!";
  }
};
