export type State = string;

export interface Transition {
  from: State;
  to: State;
  read: string; // Input symbol (empty string for epsilon)
  pop: string;  // Stack symbol to pop (empty string for epsilon)
  push: string[]; // Stack symbols to push (empty string for epsilon)
}

export interface PDA {
  states: State[];
  alphabet: string[];
  stackAlphabet: string[];
  transitions: Transition[];
  initialState: State;
  initialStackSymbol: string;
  finalStates: State[];
}

export interface SimulationStep {
  step: number;
  state: State;
  remainingInput: string;
  stack: string[];
  transition?: Transition;
  action: string;
}

export type AppMode = 'LEARN' | 'SIMULATE' | 'PRACTICE';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'PREDICT_STACK' | 'FILL_TRANSITION' | 'BUILD_PDA';
  pda: PDA;
  input: string;
  targetStep?: number;
  correctAnswer?: any;
}
