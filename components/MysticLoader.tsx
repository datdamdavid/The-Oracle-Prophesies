
import React from 'react';

export const MysticLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-32 h-32">
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-full bg-yellow-500/20 blur-xl animate-pulse"></div>
        {/* Rotating rings */}
        <div className="absolute inset-0 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
        <div className="absolute inset-4 border-2 border-purple-500/30 border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
        {/* Center orb */}
        <div className="absolute inset-10 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.8)] flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
        </div>
      </div>
      <p className="mt-8 font-mystic text-xl text-yellow-500 animate-pulse tracking-widest uppercase">
        Consulting the Cosmic Archives...
      </p>
      <p className="mt-2 text-slate-400 font-scroll italic">
        The threads of time are weaving your answer.
      </p>
    </div>
  );
};
