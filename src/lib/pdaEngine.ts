import { PDA, SimulationStep, Transition } from '../types';

export class PDAEngine {
  private pda: PDA;
  private input: string;
  private history: SimulationStep[] = [];

  constructor(pda: PDA, input: string) {
    this.pda = pda;
    this.input = input;
    this.reset();
  }

  reset() {
    this.history = [{
      step: 0,
      state: this.pda.initialState,
      remainingInput: this.input,
      stack: [this.pda.initialStackSymbol],
      action: 'Initial configuration'
    }];
  }

  getCurrentStep(): SimulationStep {
    return this.history[this.history.length - 1];
  }

  getHistory(): SimulationStep[] {
    return this.history;
  }

  getNextPossibleTransitions(): Transition[] {
    const current = this.getCurrentStep();
    const nextChar = current.remainingInput[0] || '';
    const topOfStack = current.stack[0] || '';

    return this.pda.transitions.filter(t => {
      const charMatch = t.read === nextChar || t.read === '';
      const stackMatch = t.pop === topOfStack || t.pop === '';
      return t.from === current.state && charMatch && stackMatch;
    });
  }

  step(transition?: Transition): boolean {
    const current = this.getCurrentStep();
    const possible = this.getNextPossibleTransitions();
    
    const t = transition || possible[0];
    if (!t) return false;

    const newRemainingInput = t.read === '' ? current.remainingInput : current.remainingInput.slice(1);
    
    // Handle stack
    let newStack = [...current.stack];
    if (t.pop !== '') {
      newStack.shift();
    }
    if (t.push.length > 0) {
      newStack = [...t.push, ...newStack];
    }

    const action = t.read === '' 
      ? `Epsilon transition: pop ${t.pop || 'ε'}, push ${t.push.join('') || 'ε'}`
      : `Read '${t.read}': pop ${t.pop || 'ε'}, push ${t.push.join('') || 'ε'}`;

    this.history.push({
      step: this.history.length,
      state: t.to,
      remainingInput: newRemainingInput,
      stack: newStack,
      transition: t,
      action
    });

    return true;
  }

  stepBackward(): boolean {
    if (this.history.length <= 1) return false; // Can't go back from initial state
    this.history.pop();
    return true;
  }

  isAccepted(): boolean {
    const current = this.getCurrentStep();
    return current.remainingInput === '' && 
           (this.pda.finalStates.includes(current.state) || current.stack.length === 0);
  }

  isStuck(): boolean {
    return this.getNextPossibleTransitions().length === 0 && !this.isAccepted();
  }
}
