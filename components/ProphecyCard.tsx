
import React from 'react';
import { OracleResult } from '../types';

interface ProphecyCardProps {
  result: OracleResult;
}

export const ProphecyCard: React.FC<ProphecyCardProps> = ({ result }) => {
  // Simple markdown-ish rendering for the response text
  const formattedText = result.introduction.split('\n').map((line, i) => {
    if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-mystic text-yellow-500 mb-6 mt-8">{line.replace('# ', '')}</h1>;
    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-mystic text-yellow-400 mb-4 mt-6">{line.replace('## ', '')}</h2>;
    if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-mystic text-yellow-200 mb-3 mt-4">{line.replace('### ', '')}</h3>;
    if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-6 mb-2 text-slate-300 list-disc">{line.substring(2)}</li>;
    if (line.trim() === '') return <div key={i} className="h-4" />;
    return <p key={i} className="mb-4 text-slate-200 leading-relaxed font-scroll text-lg italic">{line}</p>;
  });

  return (
    <div className="max-w-4xl mx-auto mt-12 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="mystic-border bg-indigo-950/40 backdrop-blur-md rounded-2xl p-8 md:p-12 relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-yellow-500/40 m-4 rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-yellow-500/40 m-4 rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-yellow-500/40 m-4 rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-yellow-500/40 m-4 rounded-br-lg"></div>

        <div className="relative z-10">
          {formattedText}
        </div>

        {result.sources.length > 0 && (
          <div className="mt-12 pt-8 border-t border-yellow-500/20">
            <h4 className="font-mystic text-sm text-yellow-600 uppercase tracking-widest mb-4">Chronicle Fragments (Sources)</h4>
            <ul className="flex flex-wrap gap-4">
              {result.sources.map((source, idx) => (
                <li key={idx}>
                  <a 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-slate-900/50 hover:bg-slate-800 border border-slate-700 rounded-full px-4 py-2 text-slate-400 transition-colors"
                  >
                    {source.title || 'View Source'}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center text-slate-500 text-xs italic uppercase tracking-tighter">
        This prophecy is generated for entertainment purposes only. The future is unwritten.
      </div>
    </div>
  );
};
