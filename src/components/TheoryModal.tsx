import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TheoryModal({ isOpen, onClose }: TheoryModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-surface rounded-[30px] border border-white/10 max-w-2xl max-h-[80vh] overflow-y-auto w-full p-8 neo-shadow">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-acid">PDA Theory</h2>
                <button
                  onClick={onClose}
                  className="p-2 bg-acid/10 text-acid rounded-lg hover:bg-acid/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 text-text-dim">
                {/* Introduction */}
                <section>
                  <h3 className="text-lg font-black text-acid mb-3">What is a Pushdown Automaton?</h3>
                  <p className="leading-relaxed">
                    A <b className="text-pure-white">Pushdown Automaton (PDA)</b> is a computational model that extends finite automata with a <b className="text-pure-white">stack</b>. 
                    It can recognize context-free languages, which are more powerful than regular languages recognized by finite automata.
                  </p>
                </section>

                {/* Components */}
                <section>
                  <h3 className="text-lg font-black text-acid mb-3">Components</h3>
                  <div className="space-y-2 bg-black/20 p-4 rounded-xl">
                    <p><b className="text-acid">States (Q):</b> Nodes representing different configurations</p>
                    <p><b className="text-acid">Input Alphabet (Σ):</b> Symbols read from the input string</p>
                    <p><b className="text-acid">Stack Alphabet (Γ):</b> Symbols that can be pushed/popped from the stack</p>
                    <p><b className="text-acid">Initial State (q₀):</b> Starting configuration (highlighted in yellow)</p>
                    <p><b className="text-acid">Initial Stack Symbol (Z₀):</b> Symbol placed on stack initially</p>
                    <p><b className="text-acid">Final States (F):</b> Accepting states (shown with double circles)</p>
                    <p><b className="text-acid">Transitions (δ):</b> Rules for state changes based on input and stack</p>
                  </div>
                </section>

                {/* Transitions */}
                <section>
                  <h3 className="text-lg font-black text-acid mb-3">Transition Format</h3>
                  <p className="mb-3">Each transition is represented as:</p>
                  <div className="bg-black/30 p-4 rounded-xl font-mono text-acid mb-3">
                    δ(state, read, pop) → (next_state, push_symbols)
                  </div>
                  <div className="space-y-2">
                    <p><b className="text-acid">state:</b> Current state</p>
                    <p><b className="text-acid">read:</b> Symbol to read from input (ε = epsilon, read nothing)</p>
                    <p><b className="text-acid">pop:</b> Symbol to pop from stack (ε = pop nothing)</p>
                    <p><b className="text-acid">next_state:</b> State to transition to</p>
                    <p><b className="text-acid">push_symbols:</b> Symbols to push onto stack</p>
                  </div>
                </section>

                {/* Example */}
                <section>
                  <h3 className="text-lg font-black text-acid mb-3">Example: Balanced Parentheses</h3>
                  <p className="mb-3">Accepts strings like <span className="font-mono text-acid">()</span>, <span className="font-mono text-acid">(())</span>, <span className="font-mono text-acid">()()...</span></p>
                  <div className="bg-black/20 p-4 rounded-xl space-y-2 text-sm">
                    <p><b className="text-acid">q₀ → q₁:</b> On <span className="font-mono">(</span>, push <span className="font-mono">Z</span></p>
                    <p><b className="text-acid">q₁ → q₁:</b> On <span className="font-mono">(</span>, push <span className="font-mono">Z</span></p>
                    <p><b className="text-acid">q₁ → q₁:</b> On <span className="font-mono">)</span>, pop <span className="font-mono">Z</span></p>
                    <p><b className="text-acid">q₁ → q₂:</b> On ε (epsilon), pop initial symbol when done</p>
                  </div>
                </section>

                {/* Acceptance */}
                <section>
                  <h3 className="text-lg font-black text-acid mb-3">Acceptance Condition</h3>
                  <p className="leading-relaxed">
                    A string is <b className="text-acid">accepted</b> if:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mt-2 bg-black/20 p-4 rounded-xl">
                    <li>All input symbols are consumed (empty input remaining)</li>
                    <li>The PDA reaches a final state OR the stack is empty</li>
                  </ul>
                </section>

                {/* How to Use */}
                <section>
                  <h3 className="text-lg font-black text-acid mb-3">How to Use This Simulator</h3>
                  <ul className="list-disc list-inside space-y-2 bg-black/20 p-4 rounded-xl">
                    <li>Select a preloaded example or enter your own input string</li>
                    <li>Click <b className="text-acid">Step</b> to execute one transition at a time</li>
                    <li>Click <b className="text-acid">Run</b> for automatic playback</li>
                    <li>Watch the stack update as transitions occur</li>
                    <li>See the trace log showing the sequence of steps</li>
                    <li>Check if the string is <b className="text-acid">Accepted</b> or <b className="text-acid">Rejected</b></li>
                  </ul>
                </section>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
