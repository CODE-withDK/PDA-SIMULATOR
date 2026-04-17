import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Star, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  Timer,
  Target
} from 'lucide-react';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

const EXERCISES = [
  {
    id: '1',
    level: 'Beginner',
    title: 'Predict the Stack',
    desc: 'Given the PDA for aⁿbⁿ and input "aabb", what will be the stack content after 3 steps?',
    options: ['[A, A, Z]', '[A, Z]', '[Z]', '[A, A, A, Z]'],
    correct: 0,
    points: 100
  },
  {
    id: '2',
    level: 'Intermediate',
    title: 'Fill the Gap',
    desc: 'In a palindrome PDA, which transition is missing to match "b" characters?',
    options: [
      'q1, b, b -> q1, ε',
      'q1, b, a -> q1, ε',
      'q0, b, Z -> q1, bZ',
      'q1, ε, b -> q1, b'
    ],
    correct: 0,
    points: 250
  },
  {
    id: '3',
    level: 'Advanced',
    title: 'Logic Check',
    desc: 'Why can a standard PDA NOT recognize the language aⁿbⁿcⁿ?',
    options: [
      'Stack is too small',
      'LIFO structure only allows matching one pair at a time',
      'Input alphabet is limited',
      'Final states are unreachable'
    ],
    correct: 1,
    points: 500
  }
];

export default function Practice() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const current = EXERCISES[currentIdx];

  const handleCheck = () => {
    if (selectedOption === null) return;
    
    const correct = selectedOption === current.correct;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + current.points);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#CCFF00', '#FFFFFF', '#0A0A0A']
      });
    }
  };

  const handleNext = () => {
    if (currentIdx < EXERCISES.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl mx-auto text-center space-y-8 py-20"
      >
        <div className="w-32 h-32 bg-acid rounded-full flex items-center justify-center mx-auto neo-shadow">
          <Trophy className="w-16 h-16 text-matte-black" />
        </div>
        <h2 className="text-5xl font-black uppercase tracking-tighter">Lab Complete!</h2>
        <p className="text-soft-white/60 text-xl">
          You've mastered the basics of Pushdown Automata.
        </p>
        <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] inline-block px-12">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-soft-white/40 block mb-2">Final Score</span>
          <span className="text-6xl font-black text-acid">{score}</span>
        </div>
        <div className="pt-8">
          <button 
            onClick={() => {
              setCurrentIdx(0);
              setScore(0);
              setCompleted(false);
              setSelectedOption(null);
              setIsCorrect(null);
            }}
            className="bg-acid text-matte-black px-12 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform cursor-pointer"
          >
            Restart Training
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid lg:grid-cols-[1fr_300px] gap-8">
      <div className="space-y-8">
        {/* Progress Header */}
        <div className="flex items-center justify-between bg-surface border border-white/5 p-6 rounded-[32px]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-acid/10 rounded-2xl flex items-center justify-center text-acid">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">Exercise {currentIdx + 1} of {EXERCISES.length}</span>
              <h3 className="text-lg font-black uppercase tracking-tighter">Assessment Module</h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">Current Score</span>
            <div className="text-2xl font-black text-acid">{score}</div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-surface border border-white/5 p-10 rounded-[48px] space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <HelpCircle className="w-32 h-32" />
          </div>

          <div className="space-y-4 relative z-10">
            <div className="inline-block px-3 py-1 bg-acid text-matte-black rounded-full text-[8px] font-black uppercase tracking-widest">
              {current.level} Level
            </div>
            <p className="text-2xl font-medium leading-relaxed">
              {current.desc}
            </p>
          </div>

          <div className="grid gap-4 relative z-10">
            {current.options.map((option, i) => (
              <button
                key={i}
                onClick={() => setSelectedOption(i)}
                disabled={isCorrect !== null}
                className={cn(
                  "w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between group cursor-pointer",
                  selectedOption === i 
                    ? "bg-acid border-acid text-matte-black neo-shadow" 
                    : "bg-matte-black/40 border-white/10 text-text-dim hover:border-acid/30"
                )}
              >
                <span className="font-bold text-sm tracking-widest uppercase">{option}</span>
                <div className={cn(
                  "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                  selectedOption === i ? "border-matte-black/20 bg-matte-black/10" : "border-white/10 bg-white/5"
                )}>
                  {selectedOption === i && <div className="w-2 h-2 bg-matte-black rounded-full" />}
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 relative z-10">
            <div className="flex items-center gap-4">
              <AnimatePresence mode="wait">
                {isCorrect === true && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-acid font-black uppercase text-xs tracking-widest"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Correct! +{current.points}
                  </motion.div>
                )}
                {isCorrect === false && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-red-500 font-black uppercase text-xs tracking-widest"
                  >
                    <XCircle className="w-4 h-4" /> Try Again
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isCorrect === true ? (
              <button 
                onClick={handleNext}
                className="vibrant-btn-main flex items-center gap-2"
              >
                Next Challenge <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleCheck}
                disabled={selectedOption === null || isCorrect !== null}
                className="vibrant-btn-main disabled:opacity-30"
              >
                Check Answer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Stats */}
      <aside className="space-y-6">
        <div className="bg-surface border border-white/5 p-8 rounded-[32px] space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[2px] text-acid">Your Progress</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">Accuracy</span>
              <span className="text-xs font-black">85%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-acid w-[85%]" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">Speed</span>
              <span className="text-xs font-black">Fast</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-acid w-[60%]" />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-white/5 p-8 rounded-[32px] space-y-4">
          <div className="flex items-center gap-3">
            <Timer className="w-4 h-4 text-text-dim" />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">Time Elapsed</span>
          </div>
          <div className="text-2xl font-mono font-black">04:22.09</div>
        </div>
      </aside>
    </div>
  );
}
