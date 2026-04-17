import { PDA } from './types';

export interface ExampleConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  concept: string;
  sampleInput: string;
  pda: PDA;
}

export const EXAMPLES: Record<string, ExampleConfig> = {
  balanced_parentheses: {
    id: 'balanced_parentheses',
    name: 'Balanced Parentheses',
    description: 'Accepts strings of balanced parentheses. Push on "(", pop on ")".',
    category: 'Classic Problems',
    concept: 'Stack matching & pairing',
    sampleInput: '(())',
    pda: {
      states: ['q0', 'q1'],
      alphabet: ['(', ')'],
      stackAlphabet: ['(', 'Z'],
      initialState: 'q0',
      initialStackSymbol: 'Z',
      finalStates: ['q1'],
      transitions: [
        { from: 'q0', to: 'q0', read: '(', pop: 'Z', push: ['(', 'Z'] },
        { from: 'q0', to: 'q0', read: '(', pop: '(', push: ['(', '('] },
        { from: 'q0', to: 'q1', read: ')', pop: '(', push: [] },
        { from: 'q1', to: 'q1', read: ')', pop: '(', push: [] },
        { from: 'q1', to: 'q1', read: '', pop: 'Z', push: ['Z'] },
      ],
    },
  },
  anbn: {
    id: 'anbn',
    name: 'aⁿbⁿ (Equal a and b)',
    description: 'Accepts strings with exactly n "a"s followed by n "b"s (a^n b^n). Example: "aabb", "aaabbb".',
    category: 'Classic Problems',
    concept: 'Counting with stack',
    sampleInput: 'aabb',
    pda: {
      states: ['q0', 'q1', 'q2'],
      alphabet: ['a', 'b'],
      stackAlphabet: ['A', 'Z'],
      initialState: 'q0',
      initialStackSymbol: 'Z',
      finalStates: ['q2'],
      transitions: [
        { from: 'q0', to: 'q0', read: 'a', pop: 'Z', push: ['A', 'Z'] },
        { from: 'q0', to: 'q0', read: 'a', pop: 'A', push: ['A', 'A'] },
        { from: 'q0', to: 'q1', read: 'b', pop: 'A', push: [] },
        { from: 'q1', to: 'q1', read: 'b', pop: 'A', push: [] },
        { from: 'q1', to: 'q2', read: '', pop: 'Z', push: ['Z'] },
      ],
    },
  },
  palindrome_wwr: {
    id: 'palindrome_wwr',
    name: 'Palindrome (ww^R)',
    description: 'Accepts strings where the second half is the reverse of the first half. Example: "abba", "aabaa".',
    category: 'Palindromes',
    concept: 'Nondeterministic stack-based matching',
    sampleInput: 'abba',
    pda: {
      states: ['q0', 'q1', 'q2'],
      alphabet: ['a', 'b'],
      stackAlphabet: ['a', 'b', 'Z'],
      initialState: 'q0',
      initialStackSymbol: 'Z',
      finalStates: ['q2'],
      transitions: [
        // Push phase: push all characters
        { from: 'q0', to: 'q0', read: 'a', pop: 'Z', push: ['a', 'Z'] },
        { from: 'q0', to: 'q0', read: 'b', pop: 'Z', push: ['b', 'Z'] },
        { from: 'q0', to: 'q0', read: 'a', pop: 'a', push: ['a', 'a'] },
        { from: 'q0', to: 'q0', read: 'a', pop: 'b', push: ['a', 'b'] },
        { from: 'q0', to: 'q0', read: 'b', pop: 'a', push: ['b', 'a'] },
        { from: 'q0', to: 'q0', read: 'b', pop: 'b', push: ['b', 'b'] },
        // Epsilon transitions to guess middle
        { from: 'q0', to: 'q1', read: '', pop: 'a', push: ['a'] },
        { from: 'q0', to: 'q1', read: '', pop: 'b', push: ['b'] },
        { from: 'q0', to: 'q1', read: '', pop: 'Z', push: ['Z'] },
        // Pop phase: match and pop
        { from: 'q1', to: 'q1', read: 'a', pop: 'a', push: [] },
        { from: 'q1', to: 'q1', read: 'b', pop: 'b', push: [] },
        { from: 'q1', to: 'q2', read: '', pop: 'Z', push: ['Z'] },
      ],
    },
  },
};
