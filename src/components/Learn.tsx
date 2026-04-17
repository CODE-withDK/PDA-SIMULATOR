import { motion } from 'motion/react';
import { ArrowRight, Zap, ChevronRight, BookOpen, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

interface LearnProps {
  onStartSimulate: () => void;
}

export default function Learn({ onStartSimulate }: LearnProps) {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 bg-acid text-matte-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
          >
            <Zap className="w-3 h-3 fill-current" />
            V.2.0.4 NEOGRIP
          </motion.div>
          
          <h1 className="text-7xl font-black tracking-tighter leading-[0.85] uppercase">
            PDA.LAB <br />
            <span className="text-acid">LEARNING</span> <br />
            SYSTEM
          </h1>
          
          <p className="text-text-dim text-lg max-w-md leading-relaxed">
            Master Pushdown Automata through high-contrast visualization. 
            Understand how the stack extends finite state logic.
          </p>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={onStartSimulate}
              className="vibrant-btn-main flex items-center gap-3 px-10 py-5 text-lg"
            >
              Visualization <ArrowRight className="w-5 h-5" />
            </button>
            <button className="vibrant-btn px-10 py-5 text-lg">
              Theory
            </button>
          </div>
        </div>

        <div className="relative">
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 bg-pure-white p-10 rounded-[40px] neo-shadow text-matte-black"
          >
            <div className="blob-bg absolute inset-0 m-auto opacity-10" />
            <div className="space-y-4 relative z-10">
              {[
                { label: 'PUSH A', active: true },
                { label: 'PUSH B', active: false },
                { label: 'POP A', active: false },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className={cn(
                    "h-16 rounded-2xl flex items-center justify-between px-8 border-2 transition-all",
                    item.active ? "bg-acid border-matte-black" : "bg-matte-black/5 border-matte-black/10"
                  )}
                >
                  <span className="font-black uppercase tracking-widest text-sm">
                    {item.label}
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Concept",
            desc: "The theoretical foundation of context-free languages.",
            icon: BookOpen,
          },
          {
            title: "Interaction",
            desc: "Hands-on simulation with real-time stack feedback.",
            icon: Zap,
          },
          {
            title: "Assessment",
            desc: "Validate your knowledge through guided practice.",
            icon: Trophy,
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="p-8 rounded-[32px] border border-white/5 bg-surface hover:border-acid/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-acid/10 text-acid">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2 group-hover:text-acid transition-colors">
              {feature.title}
            </h3>
            <p className="text-text-dim text-sm leading-relaxed">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
