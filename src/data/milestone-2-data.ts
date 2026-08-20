import { Milestone } from '../types/curriculum'

export const MILESTONE_2_DATA: Milestone = {
	id: 'm2',
	number: 2,
	title: 'React Internals, Hooks Architecture & Performance Optimization',
	shortTitle: 'React Internals & Perf',
	subtitle: 'Fiber Reconciliation, Stale Closures, Custom Hooks, & Memoization Trade-offs',
	category: 'react',
	estimatedTime: '25 mins',
	theorySections: [
		{
			id: 'fiber-reconciliation',
			title: 'Reconciliation, Virtual DOM & Fiber Architecture',
			badge: 'Engine Mechanics',
			summary: 'React uses a dual-phase rendering architecture (Render Phase & Commit Phase) organized around a tree of Fibers (mutable units of work with return, child, and sibling pointers).',
			bulletPoints: [
				'Render Phase (Asynchronous / Interruptible): React traverses JSX to generate a work-in-progress Fiber tree and computes the minimal diff against the current tree.',
				'Commit Phase (Synchronous / Non-interruptible): React applies DOM mutations, invokes useLayoutEffect synchronously, and schedules useEffect asynchronously.',
				'The Key Prop: Allows React to preserve DOM element and Fiber state identity across renders. Using array indices as keys causes subtle state corruption during re-ordering/deletion.',
				'Automatic Batching (React 18+): Multiple state updates within promises, timeouts, and native event handlers are automatically batched into a single render pass.',
			],
			codeExamples: [
				{
					title: 'Fiber Tree Structure Conceptualization',
					code: `// Fiber Unit of Work Interface
interface Fiber {
	tag: WorkTag          // FunctionComponent, HostComponent, etc.
	key: null | string
	stateNode: any        // Reference to DOM element or Class instance
	child: Fiber | null   // First child
	sibling: Fiber | null // Next sibling
	return: Fiber | null  // Parent fiber
	memoizedState: any    // Linked list of hooks
	flags: Flags          // Placement, Update, Deletion flags
}`,
					explanation: 'Fiber transforms the recursive call stack into a singly-linked list tree structure that React can pause, resume, or abort.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Assesses whether you understand component lifecycles at an engine level rather than just superficial syntax.',
				keyPhrasesToSay: [
					'The Render phase is purely computational and side-effect free; the Commit phase mutates the actual DOM.',
					'Fibers allow cooperative scheduling via concurrent rendering.',
					'Stable unique keys avoid unmounting and remounting DOM elements during list reconciliation.',
				],
				commonCandidateTraps: [
					'Saying that React re-renders mutate the real DOM on every render (React only applies calculated diffs during the commit phase).',
				],
			},
		},
		{
			id: 'hooks-closures-memo',
			title: 'Hooks Internals, Stale Closures & Memoization Optimization',
			badge: 'Performance & Architecture',
			summary: 'Hooks maintain their state as a singly-linked list attached to the host Fiber. Closures capture state snapshots per render, requiring dependency arrays or functional updaters to prevent stale states.',
			bulletPoints: [
				'Stale Closure Bug: When a callback created in render N references state variables from render N, but executes in render N+k without updated dependencies.',
				'Functional Updates: setCount(prev => prev + 1) reads the latest committed state without requiring count in dependency arrays.',
				'React.memo: Shallowly compares incoming props with previous props. Skips re-render if identical references are passed.',
				'useCallback & useMemo: Preserve referential equality of functions and objects across render cycles. Avoid over-memoizing trivial primitives.',
			],
			codeExamples: [
				{
					title: 'Stale Closure Fix in useEffect Timer',
					code: `// ❌ Buggy (Stale Closure)
useEffect(() => {
	const timer = setInterval(() => {
		setCount(count + 1) // Always reads initial count = 0!
	}, 1000)
	return () => clearInterval(timer)
}, []) // Missing count in deps

// ✅ Fixed with Functional State Updater
useEffect(() => {
	const timer = setInterval(() => {
		setCount(prev => prev + 1) // Reads latest state deterministically
	}, 1000)
	return () => clearInterval(timer)
}, []) // Stable empty deps`,
					explanation: 'Functional updater retrieves the latest committed state directly from React internal Fiber queue without closing over stale outer variables.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Top source of bugs in frontend coding benchmarks and RL training tasks.',
				keyPhrasesToSay: [
					'Hooks rely on call order consistency because state is stored as an ordered linked list on the Fiber.',
					'Memoization trades memory allocation and comparison CPU cycles for reduced child reconciliation.',
				],
				commonCandidateTraps: [
					'Wrapping every single function in useCallback without measuring whether child components are memoized with React.memo.',
				],
			},
		},
	],
	quiz: [
		{
			id: 'q2-1',
			question: 'Why must React Hooks only be called at the top level and never inside loops, conditions, or nested functions?',
			options: [
				'Because JavaScript engines cannot compile nested hooks.',
				'Because React relies on the exact invocation order of hooks to link hook state to the current Fiber.',
				'Because hooks require global window access only available at top level.',
				'To prevent React from using excessive CPU threads.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Hooks Architecture',
			explanation: 'React maintains hook state as a singly-linked list on the Fiber. Skipping a hook inside a conditional statement shifts the hook pointer index and corrupts all subsequent hook states.',
		},
		{
			id: 'q2-2',
			question: 'What is the primary benefit of wrapping a child component in React.memo?',
			options: [
				'It forces the child component to render on a Web Worker.',
				'It performs a shallow comparison of current and previous props to skip re-rendering if props are referentially identical.',
				'It prevents child components from having state.',
				'It automatically memoizes all internal helper functions.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Performance Optimization',
			explanation: 'React.memo wraps a component in a Higher Order Component that performs shallow equality comparison (Object.is) on props to bypass reconciliation when props have not changed.',
		},
		{
			id: 'q2-3',
			question: 'In React 18+, what is Automatic Batching?',
			options: [
				'Combining multiple npm packages into one bundle at build time.',
				'Batching multiple setState calls within promises, setTimeout, or native event handlers into a single re-render.',
				'Automatically memoizing all components without React.memo.',
				'Running all network fetch calls simultaneously.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'React 18 Concurrency',
			explanation: 'Prior to React 18, state updates inside async callbacks (like setTimeout or fetch) caused separate renders. React 18 batches all state updates across all contexts by default.',
		},
		{
			id: 'q2-4',
			question: 'What happens if you use the array index as the "key" prop on a dynamic list where items can be re-ordered or deleted?',
			options: [
				'React throws a compile-time fatal exception.',
				'React incorrectly matches component local state to DOM positions, causing input focus bugs and visual corruption.',
				'The list is automatically converted into a Map.',
				'Browser CSS styles fail to apply.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Reconciliation & Keys',
			explanation: 'When keys are indices, removing the first item makes item 1 take key=0. React assumes the first element remained unchanged and simply updated its props, causing unmounted child state to persist incorrectly.',
		},
		{
			id: 'q2-5',
			question: 'What is the key difference between useEffect and useLayoutEffect?',
			options: [
				'useEffect is only for server components, useLayoutEffect is for client components.',
				'useLayoutEffect fires synchronously after DOM mutations but before the browser repaints the screen; useEffect fires asynchronously after paint.',
				'useLayoutEffect cannot access DOM references.',
				'useEffect runs before component render, useLayoutEffect runs after.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Hook Lifecycles',
			explanation: 'useLayoutEffect runs synchronously immediately after DOM mutations, blocking screen repaint until execution completes. It is used for measuring DOM dimensions or synchronous scroll repositioning to prevent visual flickering.',
		},
	],
	codeChallenges: [
		{
			id: 'challenge-stale-closure',
			title: 'Fixing Stale Closure in React Hook',
			difficulty: 'Medium',
			prompt: 'A countdown timer component stops incrementing because setInterval captured the initial count. Refactor the setState call to use a deterministic functional updater.',
			starterCode: `// ❌ Broken
function useTimer() {
	const [seconds, setSeconds] = useState(0)
	useEffect(() => {
		const interval = setInterval(() => {
			setSeconds(seconds + 1)
		}, 1000)
		return () => clearInterval(interval)
	}, [])
	return seconds
}`,
			solutionCode: `// ✅ Fixed
function useTimer() {
	const [seconds, setSeconds] = useState(0)
	useEffect(() => {
		const interval = setInterval(() => {
			setSeconds(prev => prev + 1)
		}, 1000)
		return () => clearInterval(interval)
	}, [])
	return seconds
}`,
			explanation: 'Functional updater setSeconds(prev => prev + 1) retrieves the live Fiber state without capturing stale closures in the timer callback.',
			testCases: [
				{
					description: 'Timer increments reliably beyond 1',
					assertion: 'Seconds counter continues increasing every second',
				},
			],
		},
	],
}
