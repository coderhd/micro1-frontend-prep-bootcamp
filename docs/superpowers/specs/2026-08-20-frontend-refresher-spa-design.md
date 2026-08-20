# Frontend Mastery: Micro1 AI Interview Bootcamp SPA

## Overview
A comprehensive single-page application (SPA) designed to refresh core frontend engineering concepts, test knowledge through milestone-oriented quizzes and coding labs, and simulate the 25-minute micro1 AI interview ("Zara").

---

## 1. Technical Stack
- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS + Lucide Icons + Custom CSS animations
- **State Management**: React State + Context + LocalStorage persistence
- **Interactive Capabilities**:
  - Live Event Loop Queue Visualizer
  - React Memoization & Re-render Counter Sandbox
  - Flexbox / Grid Interactive Playground
  - Live In-Browser Code Runner & RTL-style assertions
  - Web Speech API for voice synthesis and realistic AI recruiter simulation

---

## 2. Milestone Architecture

### Milestone 1: JavaScript Engine & Asynchronous Architecture
- **Theory**:
  - Call stack, Web APIs, Microtask queue vs Macrotask queue.
  - Lexical scoping, Closures, Stale closures, Prototypes & Prototypal inheritance.
  - Event delegation, Bubbling vs Capturing.
- **Interactive Visualizer**: Step-by-step Event Loop execution trace.
- **Code Lab**: Implementing `debounce`, `throttle`, and custom `Promise.allSettled`.
- **Milestone 1 Quiz**: 5 output-prediction and architectural questions.

### Milestone 2: React Internals, Hooks & Performance
- **Theory**:
  - React Fiber Architecture, Reconciliation, Virtual DOM diffing.
  - Hooks deep-dive: `useState`, `useEffect` (cleanups), `useMemo`, `useCallback`, `useRef`.
  - Preventing re-render cascades, React.memo trade-offs.
  - State management strategies: Local vs Context API vs Zustand/Redux.
- **Interactive Visualizer**: Component Re-render Counter & Memoization Inspector.
- **Code Lab**: Fixing stale closure in a countdown timer hook; building `useDebounce`.
- **Milestone 2 Quiz**: 5 deep-dive React questions.

### Milestone 3: HTML, CSS Layouts, Web Vitals & Accessibility
- **Theory**:
  - CSS Box Model, Specificity calculation, Stacking context & z-index.
  - Flexbox (1D) vs CSS Grid (2D) layout mechanics.
  - Browser rendering pipeline: Reflow (Layout) vs Repaint vs Composite.
  - Core Web Vitals (LCP, INP, CLS) optimization strategies.
  - Semantic HTML & ARIA roles, focus management, keyboard trapping.
- **Interactive Visualizer**: Flexbox vs CSS Grid playground.
- **Code Lab**: Building an accessible Modal dialog with focus trap.
- **Milestone 3 Quiz**: 5 layout & performance questions.

### Milestone 4: Root-Cause Debugging, Testing & RL Environment Design
- **Theory**:
  - Chrome DevTools profiling (Network waterfall, React Profiler, Memory Heap Snapshots).
  - Common memory leak patterns in SPAs and mitigation.
  - Unit & Integration testing using Jest & React Testing Library (RTL query priorities).
  - Creating Reinforcement Learning (RL) benchmark tasks: Golden reference solutions, deterministic reproducible test suites.
- **Interactive Visualizer**: Memory leak simulator (retained event listeners).
- **Code Lab**: Writing RTL test assertions with userEvent.
- **Milestone 4 Quiz**: 5 debugging & test strategy questions.

### Milestone 5: The "Zara" AI Recruiter Mock Interview
- **Format**:
  - 25-minute interactive simulation mimicking the micro1 AI screening interface.
  - Text and optional Voice/Speech synthesis via Web Speech API.
  - 6 interview stages:
    1. Background & RL Data Engineering Alignment
    2. Deep JavaScript Architecture
    3. React Internals & Hook Pitfalls
    4. CSS Layouts & Web Performance (CWV)
    5. Root-Cause Debugging & Testing
    6. Rapid Live Coding Challenge
  - Automated dynamic rubric evaluation: Technical Accuracy, Keyword Coverage, Clarity, and Edge-case considerations.
  - Detailed scorecard summary with strengths, gap analysis, and tailored recommendations.

---

## 3. Data Storage & Persistence
- User progression stored in `localStorage`:
  - `completedMilestones: string[]`
  - `quizScores: Record<string, number>`
  - `codeLabStatus: Record<string, boolean>`
  - `interviewHistory: InterviewResult[]`
- Reset / restart button to practice multiple times.
