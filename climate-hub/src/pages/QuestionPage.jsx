import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight, Lightbulb } from 'lucide-react';
import LightRays from '../components/ui/LightRays';
import { gameQuestions } from '../data/gameQuestions';

export default function QuestionPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = gameQuestions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correct;

  const handleAnswer = (choice) => {
    if (selectedAnswer) return; // Prevent multiple selections

    setSelectedAnswer(choice);
    if (choice === currentQuestion.correct) {
      setScore(score + 1);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex < gameQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Game over, navigate to score page
      navigate('/games/score', { state: { score, total: gameQuestions.length } });
    }
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

      {/* Question Card */}
      <div className="relative z-10 max-w-3xl w-full mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentIndex + 1} of {gameQuestions.length}</span>
            <span>Score: {score}</span>
          </div>
          <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / gameQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-[#050505]/80 backdrop-blur-xl rounded-3xl shadow-[0_0_60px_-10px_rgba(16,185,129,0.3)] border border-emerald-500/20 p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleAnswer('A')}
              disabled={selectedAnswer !== null}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                selectedAnswer === null
                  ? 'border-white/20 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                  : selectedAnswer === 'A'
                  ? isCorrect
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-red-500 bg-red-500/10'
                  : 'border-white/10 opacity-50'
              } ${selectedAnswer ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-emerald-400">A</span>
                <span className="text-lg text-white">{currentQuestion.optionA}</span>
              </div>
              {selectedAnswer === 'A' && (
                <div className="absolute top-4 right-4">
                  {isCorrect ? <CheckCircle className="text-emerald-400" size={24} /> : <XCircle className="text-red-400" size={24} />}
                </div>
              )}
            </button>

            <button
              onClick={() => handleAnswer('B')}
              disabled={selectedAnswer !== null}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                selectedAnswer === null
                  ? 'border-white/20 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                  : selectedAnswer === 'B'
                  ? isCorrect
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-red-500 bg-red-500/10'
                  : 'border-white/10 opacity-50'
              } ${selectedAnswer ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-emerald-400">B</span>
                <span className="text-lg text-white">{currentQuestion.optionB}</span>
              </div>
              {selectedAnswer === 'B' && (
                <div className="absolute top-4 right-4">
                  {isCorrect ? <CheckCircle className="text-emerald-400" size={24} /> : <XCircle className="text-red-400" size={24} />}
                </div>
              )}
            </button>
          </div>

          {/* Feedback Card */}
          {showFeedback && (
            <div className={`p-6 rounded-xl border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-orange-500/10 border-orange-500/30'} mb-6 animate-in fade-in duration-300`}>
              <div className="flex items-start gap-3">
                <Lightbulb className={isCorrect ? 'text-emerald-400' : 'text-orange-400'} size={24} />
                <div>
                  <p className={`font-bold mb-2 ${isCorrect ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {isCorrect ? '✅ Correct!' : '❌ Not quite right'}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next Button */}
          {showFeedback && (
            <button
              onClick={handleNext}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-900/30 hover:scale-105 flex items-center justify-center gap-2"
            >
              {currentIndex < gameQuestions.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight size={20} />
                </>
              ) : (
                <>
                  View Score
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
