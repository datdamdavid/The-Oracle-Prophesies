
import React from 'react';
import { SavedProphecy } from '../types';

interface HistoryListProps {
  history: SavedProphecy[];
  onSelect: (item: SavedProphecy) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onDelete, onClose }) => {
  return (
    <div className="max-w-2xl mx-auto mt-8 animate-in fade-in zoom-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-mystic text-2xl text-yellow-500 tracking-widest uppercase">The Sacred Archives</h2>
        <button 
          onClick={onClose}
          className="text-slate-500 hover:text-white transition-colors text-sm font-mystic"
        >
          [ Close ]
        </button>
      </div>

      {history.length === 0 ? (
        <div className="mystic-border bg-slate-900/40 p-12 rounded-2xl text-center italic text-slate-500">
          The archives are currently empty. Seek your first prophecy to fill these halls.
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((item) => (
            <div 
              key={item.id}
              className="group relative mystic-border bg-slate-900/60 hover:bg-indigo-950/40 transition-all rounded-xl p-5 cursor-pointer flex justify-between items-center overflow-hidden"
              onClick={() => onSelect(item)}
            >
              <div className="relative z-10">
                <div className="text-xs text-yellow-600 font-mystic uppercase tracking-widest mb-1">
                  {new Date(item.timestamp).toLocaleDateString()} • {item.timeline}
                </div>
                <div className="text-lg text-slate-200 font-scroll font-bold group-hover:text-yellow-400 transition-colors">
                  {item.topic}
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="relative z-20 p-2 text-slate-600 hover:text-red-400 transition-colors"
                title="Erase from records"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
