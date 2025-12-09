import React from 'react';
import { PlayerSymbol } from '../types';
import { PLAYERS } from '../constants';

interface SquareProps {
  value: PlayerSymbol | null;
  onClick: () => void;
  isWinningSquare: boolean;
  disabled: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinningSquare, disabled }) => {
  const getPlayerStyle = (val: PlayerSymbol) => {
    const player = PLAYERS.find(p => p.symbol === val);
    return player ? player.color : 'text-slate-200';
  };

  const baseClasses = "h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-bold transition-all duration-200 ease-out shadow-lg";
  
  // Default (Light) -> Dark classes
  let stateClasses = "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-2 border-slate-200 dark:border-slate-700/50";
  
  if (value) {
    stateClasses = "bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 cursor-default";
  }
  
  if (isWinningSquare) {
    stateClasses = "bg-yellow-100 dark:bg-yellow-500/20 border-2 border-yellow-500 dark:border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)] scale-105 z-10";
  }

  if (disabled && !value && !isWinningSquare) {
    stateClasses = "bg-slate-100 dark:bg-slate-800/50 cursor-not-allowed border-slate-100 dark:border-slate-800 opacity-50";
  }

  return (
    <button
      className={`${baseClasses} ${stateClasses} ${value ? getPlayerStyle(value) : ''}`}
      onClick={onClick}
      disabled={disabled || !!value}
    >
      {value}
    </button>
  );
};

export default Square;