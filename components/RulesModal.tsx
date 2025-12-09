import React from 'react';
import { WIN_LENGTH, GRID_SIZE } from '../constants';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl transform scale-100 transition-transform">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">How to Play</h2>
        
        <div className="space-y-4 text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-3">
            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-xl">👥</div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">3 Players</h3>
              <p className="text-sm">Player 1 (X), Player 2 (O), and Player 3 (▲) take turns placing their marks.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-xl">🎯</div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Goal: Connect {WIN_LENGTH}</h3>
              <p className="text-sm">Be the first to align <strong>{WIN_LENGTH}</strong> of your symbols horizontally, vertically, or diagonally.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-xl">⚔️</div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">The Grid</h3>
              <p className="text-sm">The game is played on a larger <strong>{GRID_SIZE}x{GRID_SIZE}</strong> grid. Plan ahead and block your two opponents!</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20"
        >
          Got it, Let's Play!
        </button>
      </div>
    </div>
  );
};

export default RulesModal;