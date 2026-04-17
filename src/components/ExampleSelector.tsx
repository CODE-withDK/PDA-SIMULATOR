import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ChevronDown, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { EXAMPLES } from '../examples';

interface ExampleSelectorProps {
  selectedExample: string;
  onSelectExample: (exampleId: string) => void;
  onLoadExample: (exampleId: string, sampleInput: string) => void;
  onRunExample?: (exampleId: string, sampleInput: string) => void;
}

export default function ExampleSelector({
  selectedExample,
  onSelectExample,
  onLoadExample,
  onRunExample,
}: ExampleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const exampleList = Object.values(EXAMPLES);
  const currentExample = EXAMPLES[selectedExample];

  const handleSelectExample = (id: string) => {
    onSelectExample(id);
    setIsOpen(false);
  };

  const handleLoadClick = () => {
    onLoadExample(selectedExample, EXAMPLES[selectedExample].sampleInput);
  };

  const handleRunClick = () => {
    if (onRunExample) {
      onRunExample(selectedExample, EXAMPLES[selectedExample].sampleInput);
    }
  };

  // Group examples by category
  const grouped = exampleList.reduce((acc, ex) => {
    if (!acc[ex.category]) acc[ex.category] = [];
    acc[ex.category].push(ex);
    return acc;
  }, {} as Record<string, typeof exampleList>);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-acid" />
        <h3 className="text-[11px] font-black uppercase tracking-[2px] text-acid">
          Preloaded Examples
        </h3>
      </div>

      {/* Dropdown Selector */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full px-4 py-3 rounded-xl border transition-all duration-300 flex items-center justify-between font-medium text-sm",
            isOpen
              ? "bg-acid/20 border-acid text-acid"
              : "bg-surface border-white/10 text-white hover:border-acid/50"
          )}
        >
          <span className="truncate text-left">{currentExample?.name}</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-300",
              isOpen && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-surface border border-white/10 rounded-xl overflow-hidden z-50 max-h-64 overflow-y-auto shadow-lg"
            >
              {Object.entries(grouped).map(([category, examples]) => (
                <div key={category}>
                  {/* Category Header */}
                  <div className="px-4 py-2 bg-black/50 border-b border-white/5 text-[10px] font-black uppercase tracking-[1px] text-acid/80 sticky top-0">
                    {category}
                  </div>

                  {/* Category Items */}
                  {examples.map((example) => (
                    <button
                      key={example.id}
                      onClick={() => handleSelectExample(example.id)}
                      className={cn(
                        "w-full px-4 py-3 border-b border-white/5 text-left transition-all hover:bg-acid/10",
                        selectedExample === example.id && "bg-acid/20 border-l-4 border-l-acid"
                      )}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="font-semibold text-sm text-white">
                          {example.name}
                        </div>
                        <div className="text-[11px] text-text-dim">
                          {example.description}
                        </div>
                        <div className="text-[10px] text-acid/60 font-mono mt-1">
                          Sample: <span className="text-acid">{example.sampleInput}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Current Example Info */}
      <motion.div
        key={selectedExample}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 border border-acid/20 rounded-xl p-4 space-y-3"
      >
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[1px] text-acid mb-1">
            Concept
          </h4>
          <p className="text-xs text-text-dim">{currentExample?.concept}</p>
        </div>

        <div className="h-[1px] bg-white/5" />

        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[1px] text-acid mb-1">
            Sample Input
          </h4>
          <div className="bg-black p-2 rounded-lg border border-acid/30 font-mono text-sm text-acid text-center">
            {currentExample?.sampleInput || 'ε'}
          </div>
        </div>

        <div className="h-[1px] bg-white/5" />

        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[1px] text-acid mb-2">
            Quick Actions
          </h4>
          <div className="flex gap-2">
            <button
              onClick={handleLoadClick}
              className="flex-1 px-3 py-2 bg-acid/20 border border-acid/50 text-acid hover:bg-acid/30 rounded-lg text-sm font-semibold transition-colors"
            >
              Load Example
            </button>
            {onRunExample && (
              <button
                onClick={handleRunClick}
                className="flex-1 px-3 py-2 bg-acid/40 border border-acid text-matte-black hover:bg-acid/60 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-3 h-3" />
                Run
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div className="bg-black/30 border border-white/5 rounded-lg p-2 text-center">
          <div className="font-black text-acid">{currentExample?.pda.states.length}</div>
          <div className="text-text-dim">States</div>
        </div>
        <div className="bg-black/30 border border-white/5 rounded-lg p-2 text-center">
          <div className="font-black text-acid">
            {currentExample?.pda.transitions.length}
          </div>
          <div className="text-text-dim">Transitions</div>
        </div>
      </div>
    </div>
  );
}
