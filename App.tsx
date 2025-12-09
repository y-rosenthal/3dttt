import React, { useState, useEffect, useCallback } from 'react';
import Square from './components/Square';
import RulesModal from './components/RulesModal';
import { GRID_SIZE, PLAYERS, INITIAL_BOARD } from './constants';
import { BoardState, GameStatus, PlayerSymbol, WinResult } from './types';
import { checkWin } from './utils/gameLogic';
import { getGeminiHint } from './services/geminiService';

const App: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [turnIndex, setTurnIndex] = useState(0);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [winResult, setWinResult] = useState<WinResult>({ winner: null, line: null, isDraw: false });
  const [showRules, setShowRules] = useState(true);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  // Dark mode state - defaulting to true to match original design
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const currentPlayer = PLAYERS[turnIndex % 3];

  const handleSquareClick = useCallback((index: number) => {
    if (board[index] || status === GameStatus.FINISHED) return;

    setBoard(prev => {
      const newBoard = [...prev];
      newBoard[index] = currentPlayer.symbol;
      return newBoard;
    });

    setAiHint(null); // Clear hint on move
    setTurnIndex(prev => prev + 1);
  }, [board, currentPlayer, status]);

  useEffect(() => {
    // Check win condition after every board update
    if (status === GameStatus.IDLE && board.some(x => x !== null)) {
        setStatus(GameStatus.PLAYING);
    }

    const result = checkWin(board);
    if (result.winner || result.isDraw) {
      setWinResult(result);
      setStatus(GameStatus.FINISHED);
    }
  }, [board, status]);

  const resetGame = () => {
    setBoard(INITIAL_BOARD);
    setTurnIndex(0);
    setStatus(GameStatus.PLAYING);
    setWinResult({ winner: null, line: null, isDraw: false });
    setAiHint(null);
  };

  const handleAskAI = async () => {
    if (status === GameStatus.FINISHED || isAiThinking) return;
    
    setIsAiThinking(true);
    setAiHint("Consulting the oracle...");
    
    try {
      const hint = await getGeminiHint(board, currentPlayer, PLAYERS);
      setAiHint(hint);
    } catch (e) {
      setAiHint("AI is offline.");
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center py-8 px-4 selection:bg-indigo-500/30 transition-colors duration-300">
      
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-md border border-slate-200 dark:border-slate-700 transition-all z-40"
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>
        )}
      </button>

      {/* Header */}
      <header className="mb-8 text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 transition-all">
          Tri-Tactics
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm tracking-wide uppercase font-medium">
          3-Player Strategy • 5x5 Grid • Connect 4
        </p>
      </header>

      {/* Game Info Bar */}
      <div className="w-full max-w-lg mb-8 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm shadow-sm">
        {PLAYERS.map((p, idx) => (
          <div 
            key={p.id}
            className={`
              flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300
              ${status !== GameStatus.FINISHED && idx === turnIndex % 3 ? `bg-white dark:bg-slate-800 ring-2 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950 shadow-md ${p.borderColor}` : 'opacity-60 grayscale-[0.5] scale-90'}
            `}
          >
            <span className={`text-2xl font-bold ${p.color}`}>{p.symbol}</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 hidden sm:block">{p.name}</span>
          </div>
        ))}
      </div>

      {/* Main Game Area */}
      <div className="relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r ${currentPlayer.borderColor.replace('border-', 'from-')} to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000`}></div>
        
        <div className="relative bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl transition-colors">
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {board.map((value, i) => (
              <Square
                key={i}
                value={value}
                onClick={() => handleSquareClick(i)}
                isWinningSquare={winResult.line?.includes(i) ?? false}
                disabled={status === GameStatus.FINISHED}
              />
            ))}
          </div>
        </div>
      </div>

      {/* AI Hint Section */}
      <div className="w-full max-w-lg mt-6 min-h-[80px]">
        {status === GameStatus.PLAYING && (
          <div className="flex flex-col items-center gap-3">
            {!aiHint ? (
              <button
                onClick={handleAskAI}
                disabled={isAiThinking}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium transition-all border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
              >
                {isAiThinking ? (
                   <>
                    <svg className="animate-spin h-4 w-4 text-indigo-500 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Thinking...</span>
                   </>
                ) : (
                  <>
                    <span>✨ Ask AI for a Hint</span>
                  </>
                )}
              </button>
            ) : (
              <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 p-4 rounded-xl text-indigo-800 dark:text-indigo-200 text-sm text-center animate-in fade-in slide-in-from-bottom-2">
                <span className="font-bold block mb-1 text-indigo-600 dark:text-indigo-300">Gemini suggests:</span>
                {aiHint}
              </div>
            )}
          </div>
        )}

        {/* Status Messages */}
        {status === GameStatus.FINISHED && (
          <div className="text-center animate-in zoom-in duration-300 mt-4">
            {winResult.winner ? (
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                   Winner: <span className={PLAYERS.find(p => p.symbol === winResult.winner)?.color}>{winResult.winner}</span>!
                </h2>
                <p className="text-slate-600 dark:text-slate-400">Glorious victory!</p>
              </div>
            ) : (
              <h2 className="text-3xl font-bold text-slate-400 dark:text-slate-300">It's a Draw!</h2>
            )}
            <button
              onClick={resetGame}
              className="mt-6 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors shadow-lg shadow-slate-900/10 dark:shadow-white/10"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Rules Toggle */}
      <button 
        onClick={() => setShowRules(true)}
        className="fixed bottom-6 right-6 h-10 w-10 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-lg transition-colors z-40"
        title="Show Rules"
      >
        ?
      </button>

      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
    </div>
  );
};

export default App;