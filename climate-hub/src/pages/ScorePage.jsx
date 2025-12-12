import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trophy, RefreshCw, Sparkles, Target, Lightbulb, Calendar } from 'lucide-react';
import LightRays from '../components/ui/LightRays';

export default function ScorePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { score = 0, total = 5 } = location.state || {};

  const percentage = (score / total) * 100;

  const getMessage = () => {
    if (score === total) {
      return {
        title: "You are a Climate Hero! 🌱",
        message: "Perfect score! You truly understand climate-friendly choices.",
        icon: <Sparkles className="text-emerald-400" size={64} />
      };
    } else if (score >= total / 2) {
      return {
        title: "Good Job! Keep improving 🌍",
        message: "You're on the right track! A few more insights and you'll be a climate champion.",
        icon: <Target className="text-emerald-400" size={64} />
      };
    } else {
      return {
        title: "Small steps make a big impact 🌿",
        message: "Every journey starts with learning. Explore more inside ClimateHub to become climate-aware!",
        icon: <Trophy className="text-emerald-400" size={64} />
      };
    }
  };

  const { title, message, icon } = getMessage();

  // Daily suggestions that rotate (you can make this more dynamic later)
  const dailySuggestions = [
    { icon: "💡", text: "Switch off lights when leaving a room" },
    { icon: "🚴", text: "Use bicycle or walk for short distances" },
    { icon: "🛍️", text: "Carry a reusable bag for shopping" }
  ];

  const playAgain = () => {
    navigate('/games/play');
  };

  const goHome = () => {
    navigate('/games');
  };

  return (
    <div className="flex-1 w-full bg-[#000000] relative flex flex-col items-center justify-center p-4 md:p-8">
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

      {/* Score Card */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto">
        <div className="bg-[#050505]/80 backdrop-blur-xl rounded-2xl shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] border border-emerald-500/20 p-6 text-center">
          {/* Icon */}
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative">
              {icon}
            </div>
          </div>

          {/* Score Display */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Your Score
          </h1>
          
          <div className="mb-4">
            <p className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              {score}/{total}
            </p>
            <p className="text-lg text-gray-400 mt-1">{percentage.toFixed(0)}% Correct</p>
          </div>

          {/* Progress Ring */}
          <div className="mb-4 flex justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="42"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-[#1a1a1a]"
              />
              <circle
                cx="48"
                cy="48"
                r="42"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - percentage / 100)}`}
                className="text-emerald-500 transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Message */}
          <div className="mb-5">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              {title}
            </h2>
            <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
              {message}
            </p>
          </div>

          {/* Daily Suggestions */}
          <div className="mb-4 bg-[#0a0a0a]/60 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Lightbulb className="text-emerald-400" size={20} />
              <h3 className="text-lg font-bold text-white">Today's Climate Actions</h3>
            </div>
            <div className="space-y-2">
              {dailySuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center gap-3 text-left bg-[#000000]/40 p-2.5 rounded-lg border border-white/5">
                  <span className="text-xl">{suggestion.icon}</span>
                  <p className="text-gray-300 text-xs flex-1">{suggestion.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Reminder Message */}
          <div className="mb-5 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Calendar className="text-emerald-400" size={18} />
              <p className="text-emerald-400 font-bold">Come back tomorrow!</p>
            </div>
            <p className="text-gray-300 text-xs">
              Play daily to save your Mother Earth 🌍💚
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={playAgain}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-900/30 hover:scale-105 flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw size={18} />
              Play Again
            </button>
            <button
              onClick={goHome}
              className="px-6 py-3 bg-[#0a0a0a]/80 text-gray-300 font-bold rounded-xl hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2 text-sm"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
