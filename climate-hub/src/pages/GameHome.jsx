import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Trophy, Leaf } from 'lucide-react';
import LightRays from '../components/ui/LightRays';

export default function GameHome() {
  const navigate = useNavigate();

  const startGame = () => {
    navigate('/games/play');
  };

  return (
    <div className="min-h-full w-full bg-[#000000] relative flex flex-col items-center justify-center py-12 px-4">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <LightRays
            raysOrigin="top-center"
            raysColor="#10b981"
            raysSpeed={1.0}
            lightSpread={1.0}
            rayLength={1.5}
            className="opacity-30"
          />
      </div>

      {/* Game Home Card */}
      <div className="relative z-10 max-w-2xl mx-auto p-8">
        <div className="bg-[#050505]/80 backdrop-blur-xl rounded-3xl shadow-[0_0_60px_-10px_rgba(16,185,129,0.3)] border border-emerald-500/20 p-12 text-center">
          {/* Icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-500 p-6 rounded-2xl shadow-lg">
              <Gamepad2 size={64} className="text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Climate Choice Challenge
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
            Test your climate awareness! Pick the climate-friendlier choice to score points and learn how to make a positive impact on our planet.
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-[#0a0a0a]/60 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <Trophy className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Score Points</p>
            </div>
            <div className="bg-[#0a0a0a]/60 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <Leaf className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Learn Climate Facts</p>
            </div>
            <div className="bg-[#0a0a0a]/60 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <Gamepad2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">5 Questions</p>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startGame}
            className="relative w-full max-w-sm mx-auto py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-900/30 hover:shadow-emerald-500/40 hover:scale-105 overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center justify-center gap-2 text-lg">
              <Gamepad2 size={24} />
              Start Game
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
