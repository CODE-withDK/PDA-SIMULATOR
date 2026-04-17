import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight,
  ChevronLeft, 
  Layers, 
  Zap, 
  CheckCircle2, 
  XCircle,
  Plus,
  Trash2,
  Book,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PDA, SimulationStep } from '../types';
import { PDAEngine } from '../lib/pdaEngine';
import { EXAMPLES } from '../examples';
import ExampleSelector from './ExampleSelector';
import InteractiveDiagram from './InteractiveDiagram';
import TheoryModal from './TheoryModal';

export default function Simulator() {
  const [selectedExample, setSelectedExample] = useState('anbn');
  const [inputString, setInputString] = useState('aabb');
  const [engine, setEngine] = useState<PDAEngine | null>(null);
  const [currentStep, setCurrentStep] = useState<SimulationStep | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [showExamples, setShowExamples] = useState(false);
  const [showTheory, setShowTheory] = useState(false);

  // Handle loading an example
  const handleLoadExample = (exampleId: string, sampleInput: string) => {
    setSelectedExample(exampleId);
    setInputString(sampleInput);
  };

  // Handle running an example (load + auto-play)
  const handleRunExample = (exampleId: string, sampleInput: string) => {
    setSelectedExample(exampleId);
    setInputString(sampleInput);
    // Auto-play will be set in next effect
    setTimeout(() => setIsPlaying(true), 100);
  };

  useEffect(() => {
    const pda = EXAMPLES[selectedExample].pda;
    const newEngine = new PDAEngine(pda, inputString);
    setEngine(newEngine);
    setCurrentStep(newEngine.getCurrentStep());
    setIsPlaying(false);
  }, [selectedExample, inputString]);

  useEffect(() => {
    let interval: any;
    if (isPlaying && engine) {
      interval = setInterval(() => {
        const success = engine.step();
        if (success) {
          setCurrentStep({ ...engine.getCurrentStep() });
        } else {
          setIsPlaying(false);
        }
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, engine, playbackSpeed]);

  const handleStep = (transition?: any) => {
    if (engine) {
      const success = engine.step(transition);
      if (success) {
        setCurrentStep({ ...engine.getCurrentStep() });
      }
    }
  };

  const handleStepBack = () => {
    if (engine) {
      const success = engine.stepBackward();
      if (success) {
        setCurrentStep({ ...engine.getCurrentStep() });
        setIsPlaying(false);
      }
    }
  };

  const handleReset = () => {
    if (engine) {
      engine.reset();
      setCurrentStep({ ...engine.getCurrentStep() });
      setIsPlaying(false);
    }
  };

  const isAccepted = engine?.isAccepted();
  const isStuck = engine?.isStuck();

  return (
    <div className="grid lg:grid-cols-[260px_1fr_200px] gap-4 items-stretch min-h-[500px]">
      {/* Left Sidebar: Controls */}
      <aside className="bg-surface asym-panel p-4 flex flex-col gap-4 border border-white/5 overflow-y-auto">
        {/* Example Selector */}
        <ExampleSelector
          selectedExample={selectedExample}
          onSelectExample={setSelectedExample}
          onLoadExample={handleLoadExample}
          onRunExample={handleRunExample}
        />

        <button 
          onClick={() => setShowTheory(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-acid/10 text-acid rounded-xl hover:bg-acid/20 transition-all font-black text-sm uppercase tracking-wide border border-acid/30 hover:border-acid"
        >
          <Book className="w-4 h-4" /> Learn PDA
        </button>

        <div className="h-[1px] bg-white/10" />

        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[2px] text-acid mb-4">Input String</h3>
          <input 
            type="text"
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            placeholder="Enter string (e.g., aabb)"
            className="w-full bg-black p-4 rounded-xl border border-acid/50 focus:border-acid font-mono text-lg tracking-[4px] text-acid text-center neo-shadow outline-none transition-colors"
          />
        </div>

        <div className="bg-white/5 p-4 rounded-2xl space-y-3">
          <h3 className="text-[11px] font-black uppercase tracking-[2px] text-acid">Guided Insight</h3>
          <p className="text-[13px] leading-relaxed text-text-dim">
            Currently at state <b className="text-pure-white">{currentStep?.state}</b>. 
            Reading symbol <b className="text-pure-white">'{currentStep?.remainingInput[0] || 'ε'}'</b>.
          </p>
        </div>

        <div className="bg-white/5 p-4 rounded-2xl border-l-4 border-acid space-y-2">
          <h3 className="text-[11px] font-black uppercase tracking-[2px] text-acid">Logic Rule</h3>
          <p className="text-xs font-mono text-pure-white">
            {currentStep?.transition ? 
              `δ(${currentStep.transition.from}, ${currentStep.transition.read || 'ε'}, ${currentStep.transition.pop || 'ε'}) → (${currentStep.transition.to}, ${currentStep.transition.push.join('') || 'ε'})` : 
              'No transition applied'}
          </p>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[2px] text-acid">Transitions</h3>
            <button className="p-1.5 bg-acid/10 text-acid rounded-lg hover:bg-acid/20 transition-colors cursor-pointer">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-hide">
            {EXAMPLES[selectedExample].pda.transitions.map((t, i) => {
              const isActive = currentStep?.transition === t;
              const isPossible = engine?.getNextPossibleTransitions().includes(t);
              return (
                <button 
                  key={i}
                  onClick={() => handleStep(t)}
                  disabled={!isPossible || isPlaying}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all duration-300",
                    isActive ? "bg-acid border-acid text-matte-black scale-105 neo-shadow" : 
                    isPossible ? "bg-acid/10 border-acid/30 text-acid hover:bg-acid/20 cursor-pointer" :
                    "bg-black/40 border-white/5 text-text-dim opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span>{t.from} → {t.to}</span>
                    {isPossible && !isActive && <Play className="w-2.5 h-2.5 animate-pulse" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Center: Visualization */}
      <div className="flex flex-col gap-4">
        {/* Diagram Area */}
        <div className="flex-1 bg-pure-white rounded-[40px] relative overflow-hidden flex flex-col items-center justify-center text-matte-black p-6 min-h-[350px]">
          <div className="blob-bg absolute inset-0 m-auto pointer-events-none" />
          
          {/* Status Overlays - Top Right */}
          <AnimatePresence>
            {isAccepted && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-6 right-6 bg-acid text-matte-black px-6 py-2 rounded-full font-black uppercase tracking-widest neo-shadow text-sm z-20"
              >
                ✓ Accepted
              </motion.div>
            )}
            {isStuck && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-6 right-6 bg-red-500 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest neo-shadow text-sm z-20"
              >
                ✗ Rejected
              </motion.div>
            )}
          </AnimatePresence>

          {/* State Diagram with All States and Transitions - Scrollable */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            <InteractiveDiagram 
              pda={EXAMPLES[selectedExample].pda}
              currentStep={currentStep}
            />
          </div>
        </div>

        {/* Current Step Information - Below Diagram */}
        <motion.div
          key={currentStep?.step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-[20px] p-3 border border-white/10"
        >
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <div className="text-[8px] font-black uppercase tracking-[0.5px] text-acid/70 mb-0.5">State</div>
              <div className="text-sm font-black text-acid">{currentStep?.state}</div>
            </div>
            <div className="text-center">
              <div className="text-[8px] font-black uppercase tracking-[0.5px] text-acid/70 mb-0.5">Reading</div>
              <div className="text-sm font-black text-acid">{currentStep?.remainingInput[0] || 'ε'}</div>
            </div>
            <div className="text-center">
              <div className="text-[8px] font-black uppercase tracking-[0.5px] text-acid/70 mb-0.5">Stack Top</div>
              <div className="text-sm font-black text-acid">{currentStep?.stack[0] || 'ε'}</div>
            </div>
            <div className="text-center">
              <div className="text-[8px] font-black uppercase tracking-[0.5px] text-acid/70 mb-0.5">Step</div>
              <div className="text-sm font-black text-acid">{currentStep?.step}</div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-white/5 text-[9px] text-text-dim text-center font-mono">
            {currentStep?.action}
          </div>
        </motion.div>

        {/* Footer Actions */}
        <div className="h-20 flex items-center justify-center gap-4">
          <button onClick={handleReset} className="vibrant-btn text-sm px-4 py-2">Reset</button>
          <button 
            onClick={handleStepBack}
            disabled={engine?.getHistory().length === 1}
            className="vibrant-btn flex items-center gap-2 px-5 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <button 
            onClick={() => handleStep()} 
            className="vibrant-btn-main flex items-center gap-2 px-8 py-2 text-sm"
          >
            Step <ChevronRight className="w-5 h-5" />
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="vibrant-btn text-sm px-4 py-2">
            {isPlaying ? 'Pause' : 'Run'}
          </button>
        </div>
      </div>

      {/* Right: Stack & Trace */}
      <aside className="flex flex-col gap-3">
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="text-[10px] font-black uppercase tracking-[1px] text-acid">Stack</h3>
          <div className="flex-1 bg-surface rounded-[20px] p-3 border border-dashed border-acid flex flex-col-reverse gap-1 overflow-y-auto scrollbar-hide">
            <AnimatePresence initial={false}>
              {currentStep?.stack.map((symbol, i) => (
                <motion.div
                  key={`${symbol}-${currentStep.stack.length - i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "h-8 rounded-lg border flex items-center justify-center font-bold text-sm transition-all",
                    i === 0 ? "bg-acid border-acid text-matte-black" : "bg-matte-black border-acid/30 text-acid"
                  )}
                >
                  {symbol}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="h-[200px] bg-surface rounded-[20px] p-3 flex flex-col gap-2 border border-white/5">
          <h3 className="text-[10px] font-black uppercase tracking-[1px] text-acid">Trace</h3>
          <div className="flex-1 overflow-y-auto font-mono text-[9px] text-text-dim space-y-0.5 pr-2 scrollbar-hide">
            {engine?.getHistory().map((step, i) => (
              <div key={i} className={cn(
                "grid grid-cols-[16px_40px_1fr] py-0.5 border-b border-white/5 gap-1",
                i === currentStep?.step && "text-acid"
              )}>
                <span className="text-right">{step.step}</span>
                <span className="font-bold">{step.state}</span>
                <span className="truncate text-text-dim">{step.action}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <TheoryModal isOpen={showTheory} onClose={() => setShowTheory(false)} />
    </div>
  );
}
