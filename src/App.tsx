import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  BookOpen, 
  Play, 
  Trophy, 
  Settings
} from 'lucide-react';
import { cn } from './lib/utils';
import { AppMode } from './types';
import Simulator from './components/Simulator';
import Learn from './components/Learn';
import Practice from './components/Practice';

export default function App() {
  const [mode, setMode] = useState<AppMode>('LEARN');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-matte-black text-pure-white overflow-x-hidden">
      {/* Background Micro-details */}
      <div className="fixed inset-0 pointer-events-none opacity-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-acid/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-acid/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation Rail */}
      <nav className="fixed top-0 left-0 right-0 h-20 border-b border-acid/10 bg-surface z-50 flex items-center justify-between px-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-extrabold tracking-tighter uppercase text-acid">
            PDA.LAB <span className="text-pure-white/50">01</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {[
            { id: 'LEARN', label: 'Concept', icon: BookOpen },
            { id: 'SIMULATE', label: 'Visualization', icon: Play },
            { id: 'PRACTICE', label: 'Practice', icon: Trophy },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMode(item.id as AppMode)}
              className={cn(
                "group relative py-2 px-4 rounded-full text-[13px] font-bold uppercase tracking-tight transition-all duration-300 cursor-pointer border border-white/10",
                mode === item.id ? "bg-acid text-matte-black border-acid" : "text-pure-white/60 hover:text-pure-white"
              )}
            >
              <span className="flex items-center gap-2">
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-pure-white/30 uppercase tracking-[0.2em]">V.2.0.4 NEOGRIP</span>
          <div className="h-8 w-[1px] bg-white/10" />
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer">
            <Settings className="w-5 h-5 text-pure-white/40" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {mode === 'LEARN' && <Learn onStartSimulate={() => setMode('SIMULATE')} />}
            {mode === 'SIMULATE' && <Simulator />}
            {mode === 'PRACTICE' && <Practice />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 h-10 border-t border-white/10 bg-matte-black/90 backdrop-blur-sm z-50 flex items-center justify-between px-8 text-[10px] font-mono text-soft-white/30 uppercase tracking-[0.2em]">
        <div className="flex gap-6">
          <span>Build v1.0.4</span>
          <span>Engine: PDA-V2</span>
        </div>
        <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 bg-acid rounded-full" />
            Connection: Stable
          </span>
          <span>© 2026 Neo-Grip Labs</span>
        </div>
      </footer>
    </div>
  );
}
