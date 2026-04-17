import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { PDA, SimulationStep } from '../types';
import { RotateCcw } from 'lucide-react';

interface InteractiveDiagramProps {
  pda: PDA;
  currentStep: SimulationStep | null;
}

const DEFAULT_NODE_WIDTH = 64;
const DEFAULT_NODE_HEIGHT = 64;
const CONTAINER_HEIGHT = 350;
const STORAGE_KEY = 'pda_node_positions';

interface NodePosition {
  [key: string]: { x: number; y: number };
}

export default function InteractiveDiagram({ pda, currentStep }: InteractiveDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<NodePosition>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Initialize positions from localStorage or compute defaults
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPositions(JSON.parse(saved));
      } catch {
        initializeDefaultPositions();
      }
    } else {
      initializeDefaultPositions();
    }
  }, [pda.states]);

  const initializeDefaultPositions = () => {
    const defaultPositions: NodePosition = {};
    const spacing = 120;
    pda.states.forEach((state, idx) => {
      defaultPositions[state] = {
        x: 40 + idx * spacing,
        y: CONTAINER_HEIGHT / 2 - DEFAULT_NODE_HEIGHT / 2,
      };
    });
    setPositions(defaultPositions);
  };

  // Save positions to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(positions).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    }
  }, [positions]);

  const handleMouseDown = (state: string, e: React.MouseEvent) => {
    if (e.button !== 0) return;
    
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const pos = positions[state];
    const offsetX = e.clientX - containerRect.left - pos.x;
    const offsetY = e.clientY - containerRect.top - pos.y;

    setDragging(state);
    setOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left - offset.x;
    const y = e.clientY - containerRect.top - offset.y;

    // Bounds checking
    const boundedX = Math.max(0, Math.min(x, containerRect.width - DEFAULT_NODE_WIDTH));
    const boundedY = Math.max(0, Math.min(y, containerRect.height - DEFAULT_NODE_HEIGHT));

    setPositions(prev => ({
      ...prev,
      [dragging]: { x: boundedX, y: boundedY }
    }));
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleResetPositions = () => {
    localStorage.removeItem(STORAGE_KEY);
    initializeDefaultPositions();
  };

  // Get all unique (from, to) pairs from transitions
  const getUniqueTransitionPairs = () => {
    const pairs = new Set<string>();
    pda.transitions.forEach(t => {
      const key = `${t.from}-${t.to}`;
      pairs.add(key);
    });
    return Array.from(pairs);
  };

  // Calculate arrow path between two states
  const getArrowPath = (fromState: string, toState: string, curveIndex: number = 0): string => {
    const fromPos = positions[fromState];
    const toPos = positions[toState];

    if (!fromPos || !toPos) return '';

    const x1 = fromPos.x + DEFAULT_NODE_WIDTH / 2;
    const y1 = fromPos.y + DEFAULT_NODE_HEIGHT / 2;
    const x2 = toPos.x + DEFAULT_NODE_WIDTH / 2;
    const y2 = toPos.y + DEFAULT_NODE_HEIGHT / 2;

    // Self-loop: draw circle arc
    if (fromState === toState) {
      const radius = 40;
      const arcX = x1 + radius;
      const arcY = y1;
      return `M ${x1} ${y1 - radius} A ${radius} ${radius} 0 1 1 ${arcX} ${arcY}`;
    }

    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Multiple transitions between same states: use different curve heights
    const curveOffset = (curveIndex - 0.5) * 30;

    // Perpendicular offset for curve
    const perpX = -dy / distance;
    const perpY = dx / distance;

    const controlX = (x1 + x2) / 2 + perpX * (20 + curveOffset);
    const controlY = (y1 + y2) / 2 + perpY * (20 + curveOffset);

    return `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
  };

  return (
    <div className="w-full h-full flex flex-col gap-3">
      {/* Diagram Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative flex-1 bg-pure-white rounded-[20px] overflow-hidden border border-white/10"
        style={{
          width: '100%',
          cursor: dragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          minHeight: `${CONTAINER_HEIGHT}px`,
        }}
      >
        {/* SVG Layer for Arrows and Labels */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#333333" />
            </marker>
            <filter id="labelGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Draw arrows for all transitions - one arrow per (from, to) pair */}
          {getUniqueTransitionPairs().map(pair => {
            const [fromState, toState] = pair.split('-');

            return (
              <path
                key={`arrow-${pair}`}
                d={getArrowPath(fromState, toState, 0)}
                stroke="#333333"
                strokeWidth="2.5"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
            );
          })}

          {/* Transition Labels for all transitions */}
          {getUniqueTransitionPairs().map(pair => {
            const [fromState, toState] = pair.split('-');

            const transitionsBetween = pda.transitions.filter(
              t => t.from === fromState && t.to === toState
            );

            if (transitionsBetween.length === 0) return null;

            const fromPos = positions[fromState];
            const toPos = positions[toState];
            if (!fromPos || !toPos) return null;

            // Self-loop label positioning
            if (fromState === toState) {
              const x = fromPos.x + DEFAULT_NODE_WIDTH / 2 + 50;
              const y = fromPos.y;

              return (
                <g key={`labels-${pair}`}>
                  {transitionsBetween.map((t, labelIdx) => {
                    const offsetY = -35 + (labelIdx - Math.floor(transitionsBetween.length / 2)) * 18;
                    const label = `${t.read || 'ε'}, ${t.pop || 'ε'} → ${t.push.join('') || 'ε'}`;
                    
                    return (
                      <g key={`label-${pair}-${labelIdx}`}>
                        <rect
                          x={x - 70}
                          y={y + offsetY - 8}
                          width="140"
                          height="16"
                          fill="rgba(26, 26, 26, 0.92)"
                          rx="4"
                          filter="url(#labelGlow)"
                        />
                        <text
                          x={x}
                          y={y + offsetY}
                          textAnchor="middle"
                          className="font-mono text-[10px] fill-acid"
                          style={{
                            fontWeight: 600,
                            letterSpacing: '0.5px',
                          }}
                        >
                          {label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            }

            // Regular transitions: stack all labels in one box above the arrow
            const x1 = fromPos.x + DEFAULT_NODE_WIDTH / 2;
            const y1 = fromPos.y + DEFAULT_NODE_HEIGHT / 2;
            const x2 = toPos.x + DEFAULT_NODE_WIDTH / 2;
            const y2 = toPos.y + DEFAULT_NODE_HEIGHT / 2;

            const dx = x2 - x1;
            const dy = y2 - y1;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Calculate perpendicular offset for label positioning
            const perpX = -dy / distance;
            const perpY = dx / distance;

            // Center label above the arrow
            const labelX = (x1 + x2) / 2;
            const labelY = (y1 + y2) / 2;
            const offsetDistance = 40;

            const labels = transitionsBetween.map(t => 
              `${t.read || 'ε'}, ${t.pop || 'ε'} → ${t.push.join('') || 'ε'}`
            );

            return (
              <g key={`labels-${pair}`}>
                <rect
                  x={labelX - 80}
                  y={labelY + perpY * offsetDistance - (labels.length * 8 + 4)}
                  width="160"
                  height={labels.length * 16 + 8}
                  fill="rgba(26, 26, 26, 0.92)"
                  rx="4"
                  filter="url(#labelGlow)"
                />
                {labels.map((label, idx) => (
                  <text
                    key={`label-${pair}-${idx}`}
                    x={labelX}
                    y={labelY + perpY * offsetDistance + (idx - Math.floor(labels.length / 2)) * 16}
                    textAnchor="middle"
                    className="font-mono text-[10px] fill-acid"
                    style={{
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                    }}
                  >
                    {label}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>

        {/* Node Layer - Draggable States */}
        {Object.keys(positions).length > 0 && (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: 2,
              top: 0,
              left: 0,
            }}
          >
            {pda.states.map(state => {
              const pos = positions[state];
              const isCurrent = currentStep?.state === state;
              const isFinal = pda.finalStates.includes(state);

              if (!pos) return null;

              return (
                <motion.div
                  key={state}
                  onMouseDown={(e) => handleMouseDown(state, e)}
                  animate={{
                    x: pos.x,
                    y: pos.y,
                    scale: dragging === state ? 1.2 : isCurrent ? 1.15 : 1,
                    boxShadow:
                      dragging === state
                        ? '0 0 30px rgba(204, 255, 0, 0.9)'
                        : isCurrent
                          ? '0 0 25px rgba(204, 255, 0, 0.7)'
                          : 'none',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="absolute"
                  style={{
                    width: DEFAULT_NODE_WIDTH,
                    height: DEFAULT_NODE_HEIGHT,
                    cursor: 'grab',
                  }}
                >
                  {/* Double circle for final states */}
                  {isFinal && (
                    <div className="absolute inset-0 w-20 h-20 border-[2px] border-matte-black rounded-full -top-2 -left-2" />
                  )}

                  <div
                    className={cn(
                      'w-16 h-16 rounded-full border-[2.5px] flex items-center justify-center font-black text-lg transition-all cursor-grab active:cursor-grabbing',
                      dragging === state || isCurrent
                        ? 'bg-acid border-matte-black text-matte-black'
                        : 'bg-white border-matte-black text-matte-black hover:shadow-lg'
                    )}
                  >
                    {state}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reset Button */}
      <div className="flex justify-end">
        <button
          onClick={handleResetPositions}
          className="flex items-center gap-2 px-4 py-2 bg-acid/10 text-acid rounded-lg hover:bg-acid/20 transition-colors text-sm font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Layout
        </button>
      </div>
    </div>
  );
}
