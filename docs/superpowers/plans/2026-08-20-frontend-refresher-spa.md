# Frontend Mastery: Micro1 AI Interview Bootcamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive, milestone-oriented single-page application (SPA) that guides the candidate through interactive theory, interactive visualizers, code labs, quizzes, and a realistic 25-minute "Zara" AI mock interview simulation tailored for micro1 Frontend Engineer evaluation.

**Architecture:** Standalone Vite + React 19 / 18 + TypeScript + Tailwind CSS application. Progress and quiz scores are managed through a centralized state store with `localStorage` persistence. Features interactive sandbox visualizers (Event Loop stepper, React Re-render Profiler, Flex/Grid builder, Memory leak demo) and an automated AI interviewer simulator with Web Speech API audio.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Lucide React, Canvas Confetti.

## Global Constraints
- Code style: Tabs for indentation, single quotes for strings, omit semicolons, camelCase for functions/vars, PascalCase for components/types.
- Responsive, dark-mode-first aesthetic with modern developer UI.
- All 5 milestones must function seamlessly with progressive unlock logic.

---

### Task 1: Project Scaffolding & Configuration
**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/index.css`, `src/main.tsx`

- [ ] **Step 1: Initialize Vite React TypeScript project and install dependencies**
- [ ] **Step 2: Configure Tailwind CSS and modern styling tokens**
- [ ] **Step 3: Setup App entry point and verify initial build**

---

### Task 2: Core Data Models & Progress Store
**Files:**
- Create: `src/types/curriculum.ts`
- Create: `src/types/interview.ts`
- Create: `src/store/use-progress-store.tsx`
- Create: `src/components/layout/header.tsx`
- Create: `src/components/layout/milestone-nav.tsx`
- Create: `src/components/layout/app-shell.tsx`

- [ ] **Step 1: Define TypeScript interfaces for Milestones, Quizzes, Code Labs, and Mock Interview evaluations**
- [ ] **Step 2: Implement reactive state context with LocalStorage persistence and reset capabilities**
- [ ] **Step 3: Build responsive sidebar navigation showing locked/unlocked milestones and overall readiness percentage**

---

### Task 3: Milestone 1 — JavaScript Engine & Asynchronous Architecture
**Files:**
- Create: `src/data/milestone-1-data.ts`
- Create: `src/components/milestones/milestone-1/event-loop-visualizer.tsx`
- Create: `src/components/milestones/milestone-1/code-lab.tsx`
- Create: `src/components/milestones/milestone-1/index.tsx`
- Create: `src/components/common/quiz-engine.tsx`

- [ ] **Step 1: Populate comprehensive theory data (Event loop, Microtasks, Closures, Prototypes, Event delegation)**
- [ ] **Step 2: Implement interactive step-by-step Event Loop execution visualizer**
- [ ] **Step 3: Build interactive coding challenges for `debounce`, `throttle`, and `Promise.allSettled`**
- [ ] **Step 4: Integrate Milestone 1 Quiz with instant feedback and unlock trigger**

---

### Task 4: Milestone 2 — React Internals, Hooks & Performance
**Files:**
- Create: `src/data/milestone-2-data.ts`
- Create: `src/components/milestones/milestone-2/rerender-visualizer.tsx`
- Create: `src/components/milestones/milestone-2/code-lab.tsx`
- Create: `src/components/milestones/milestone-2/index.tsx`

- [ ] **Step 1: Populate theory on Fiber architecture, reconciliation, hook closures, and state batching**
- [ ] **Step 2: Build interactive Re-render Profiler & Memoization sandbox**
- [ ] **Step 3: Implement Stale Closure countdown bug fix & `useDebounce` code lab**
- [ ] **Step 4: Connect Milestone 2 Quiz with unlock validation**

---

### Task 5: Milestone 3 — HTML, CSS Layouts, Web Vitals & Accessibility
**Files:**
- Create: `src/data/milestone-3-data.ts`
- Create: `src/components/milestones/milestone-3/flex-grid-visualizer.tsx`
- Create: `src/components/milestones/milestone-3/modal-code-lab.tsx`
- Create: `src/components/milestones/milestone-3/index.tsx`

- [ ] **Step 1: Populate theory on Box model, CSS specificity, Flexbox vs Grid, Reflow/Repaint, CWV, and a11y ARIA**
- [ ] **Step 2: Build live Flexbox vs Grid visual playground**
- [ ] **Step 3: Implement accessible Modal code lab with keyboard trap verification**
- [ ] **Step 4: Connect Milestone 3 Quiz**

---

### Task 6: Milestone 4 — Root-Cause Debugging, Testing & RL Environments
**Files:**
- Create: `src/data/milestone-4-data.ts`
- Create: `src/components/milestones/milestone-4/memory-leak-visualizer.tsx`
- Create: `src/components/milestones/milestone-4/rtl-testing-lab.tsx`
- Create: `src/components/milestones/milestone-4/index.tsx`

- [ ] **Step 1: Populate theory on DevTools heap profiling, RTL query hierarchy, and RL environment golden solution design**
- [ ] **Step 2: Build interactive memory leak simulation demo with uncleaned event listeners**
- [ ] **Step 3: Implement RTL component test suite lab**
- [ ] **Step 4: Connect Milestone 4 Quiz**

---

### Task 7: Milestone 5 — The "Zara" Micro1 AI Recruiter Mock Interview Simulator
**Files:**
- Create: `src/data/interview-questions.ts`
- Create: `src/components/interview/speech-engine.ts`
- Create: `src/components/interview/interview-evaluator.ts`
- Create: `src/components/interview/interview-interface.tsx`
- Create: `src/components/interview/interview-scorecard.tsx`
- Create: `src/components/milestones/milestone-5/index.tsx`

- [ ] **Step 1: Implement questions dataset covering background, JS, React, CSS, Debugging, and rapid coding**
- [ ] **Step 2: Build Web Speech API integration for Zara's voice synthesizer and candidate audio/speech recognition**
- [ ] **Step 3: Build automated evaluation engine that scores technical precision, keywords, and reasoning**
- [ ] **Step 4: Build interactive 25-minute interview screen with avatar visualizer, live transcript, timer, and drill-down prompts**
- [ ] **Step 5: Implement final Performance Scorecard with radar score, strengths, and actionable feedback**

---

### Task 8: App Integration, Verification & Polish
**Files:**
- Modify: `src/App.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Connect all milestones into the unified App router/view switcher**
- [ ] **Step 2: Verify milestone completion progression and celebration animations**
- [ ] **Step 3: Build and test application with TypeScript compiler and Vite production build**
