import { Milestone } from '../types/curriculum'

export const MILESTONE_1_DATA: Milestone = {
	id: 'm1',
	number: 1,
	title: 'JavaScript Engine & Asynchronous Architecture',
	shortTitle: 'JS Engine & Async',
	subtitle: 'Event Loop, Microtasks, Closures, Prototypes, & Event Delegation',
	category: 'javascript',
	estimatedTime: '20 mins',
	theorySections: [
		{
			id: 'event-loop',
			title: 'The Event Loop & Task Queues Mechanics',
			badge: 'Core Architectural Concept',
			summary: 'JavaScript is single-threaded and non-blocking via a concurrent event loop model managing the Call Stack, Microtask Queue, and Macrotask Queue.',
			bulletPoints: [
				'Call Stack: Synchronous execution frame stack. When a function is called, its frame is pushed; when it returns, it pops.',
				'Microtask Queue (High Priority): Contains Promise callbacks (.then, .catch, .finally, await continuations), queueMicrotask(), and MutationObserver.',
				'Macrotask Queue (Standard Priority): Contains setTimeout, setInterval, setImmediate (Node.js), and I/O callbacks.',
				'Event Loop Rule: The engine empties the call stack, then processes ALL pending microtasks until the microtask queue is completely drained, before yielding to the browser rendering pipeline and picking the next single macrotask.',
			],
			codeExamples: [
				{
					title: 'Async Execution Order Breakdown',
					code: `console.log('1: Sync Start')

setTimeout(() => {
	console.log('2: Macrotask (setTimeout)')
}, 0)

Promise.resolve().then(() => {
	console.log('3: Microtask 1 (Promise)')
}).then(() => {
	console.log('4: Microtask 2 (Chained Promise)')
})

queueMicrotask(() => {
	console.log('5: Microtask 3 (queueMicrotask)')
})

console.log('6: Sync End')

// Output Order:
// 1: Sync Start
// 6: Sync End
// 3: Microtask 1 (Promise)
// 5: Microtask 3 (queueMicrotask)
// 4: Microtask 2 (Chained Promise)
// 2: Macrotask (setTimeout)`,
					explanation: 'Synchronous statements run first. All microtasks drain completely before the single macrotask (setTimeout) executes.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Micro1 tests if you can diagnose UI race conditions, batch async updates, and write deterministic Reinforcement Learning environment benchmarks without unhandled async timing bugs.',
				keyPhrasesToSay: [
					'The call stack must run to completion before the event loop inspects task queues.',
					'Microtask starvation can occur if microtasks continuously enqueue more microtasks, blocking the UI rendering cycle.',
					'Async/await is syntactic sugar over Promises, meaning code after "await" resumes in the microtask queue.',
				],
				commonCandidateTraps: [
					'Thinking setTimeout(fn, 0) runs immediately after the current line (it must wait for the current stack AND all microtasks to clear).',
					'Confusing requestAnimationFrame (which executes before the next browser repaint) with macrotasks.',
				],
			},
		},
		{
			id: 'closures-prototypes',
			title: 'Closures, Lexical Scope & Prototype Chain',
			badge: 'Language Fundamentals',
			summary: 'A closure is the combination of a function bundled together with references to its surrounding lexical environment, allowing an inner function to remember variables from its outer scope even after the outer function has executed.',
			bulletPoints: [
				'Lexical Scope: Scope is determined at write/parse time by where functions and blocks are written in source code.',
				'Closure Memory: Variables referenced by closures are allocated on the heap rather than popping off the call stack.',
				'Prototype Delegation: When a property is accessed on an object, the JS engine traverses up the __proto__ chain to Object.prototype before returning undefined.',
				'Event Delegation: Attaching a single event listener to a common parent to handle events on dynamic child elements using Event.target and Event.currentTarget.',
			],
			codeExamples: [
				{
					title: 'Classic Closure & Stale Reference Pitfall',
					code: `function createCounter() {
	let count = 0
	return {
		increment: () => ++count,
		getCount: () => count,
	}
}

const counter = createCounter()
console.log(counter.increment()) // 1
console.log(counter.increment()) // 2
console.log(counter.getCount())  // 2`,
					explanation: 'The inner arrow functions preserve a lexical closure reference to the mutable "count" variable on the heap.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Crucial for understanding why React hooks suffer from stale closures if dependency arrays are omitted.',
				keyPhrasesToSay: [
					'Closures capture references, not snapshots of values at invocation time.',
					'Event delegation leverages event bubbling to optimize memory usage when handling large dynamic lists.',
				],
				commonCandidateTraps: [
					'Confusing event.target (the exact element clicked) with event.currentTarget (the element holding the listener).',
				],
			},
		},
	],
	quiz: [
		{
			id: 'q1-1',
			question: 'What is the exact console output order of the following script?',
			codeSnippet: `console.log('A')

setTimeout(() => console.log('B'), 0)

Promise.resolve()
  .then(() => console.log('C'))
  .then(() => console.log('D'))

console.log('E')`,
			options: [
				'A, E, B, C, D',
				'A, E, C, D, B',
				'A, C, D, E, B',
				'A, B, C, D, E',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Event Loop',
			explanation: 'Synchronous "A" and "E" log first. Then the Microtask Queue processes "C", which enqueues "D", processing "D". Finally, the Macrotask Queue runs "B". Thus: A, E, C, D, B.',
		},
		{
			id: 'q1-2',
			question: 'In modern JavaScript engines, where are variables captured by active closures stored?',
			options: [
				'On the CPU register stack',
				'In the Call Stack activation record (frame)',
				'On the Heap memory space',
				'In the Global Window object',
			],
			correctAnswerIndex: 2,
			conceptTag: 'Memory & Closures',
			explanation: 'Call stack frames are popped when the outer function returns. Any variable retained by an active inner closure is preserved on the Heap.',
		},
		{
			id: 'q1-3',
			question: 'When implementing Event Delegation on a <ul> with dynamic <li> items, which property reliably identifies the exact <li> that was clicked?',
			options: [
				'event.currentTarget',
				'event.target',
				'event.delegateTarget',
				'event.relatedTarget',
			],
			correctAnswerIndex: 1,
			conceptTag: 'DOM & Events',
			explanation: 'event.target refers to the innermost DOM element that dispatched the event, whereas event.currentTarget refers to the element to which the event handler has been attached (the <ul>).',
		},
		{
			id: 'q1-4',
			question: 'What is the key difference between Promise.all() and Promise.allSettled()?',
			options: [
				'Promise.all is asynchronous, while Promise.allSettled is synchronous.',
				'Promise.all short-circuits immediately upon the first rejection, whereas Promise.allSettled waits for all promises to either resolve or reject.',
				'Promise.allSettled only handles macro-tasks, while Promise.all handles micro-tasks.',
				'Promise.allSettled throws an unhandled rejection error if any promise fails.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Async Patterns',
			explanation: 'Promise.all rejects immediately if any input promise rejects (fail-fast). Promise.allSettled never short-circuits and always resolves with an array of result objects with status "fulfilled" or "rejected".',
		},
		{
			id: 'q1-5',
			question: 'Consider the classic loop closure issue. What does this code print?',
			codeSnippet: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 10)
}`,
			options: [
				'0, 1, 2',
				'3, 3, 3',
				'undefined, undefined, undefined',
				'0, 0, 0',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Scoping & Closures',
			explanation: 'Because "var" is function-scoped (not block-scoped), all three timer callbacks close over the exact same variable "i". By the time the callbacks run after 10ms, the loop has finished and "i" equals 3.',
		},
	],
	codeChallenges: [
		{
			id: 'challenge-debounce',
			title: 'Custom Debounce Function Implementation',
			difficulty: 'Medium',
			prompt: 'Implement a reusable debounce(fn, delay) utility in TypeScript/JavaScript that delays invoking fn until after delay milliseconds have elapsed since the last time it was invoked. It must support passing arguments and proper timer cancellation.',
			starterCode: `export function debounce<T extends (...args: any[]) => any>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timer: any = null

	return function (...args: Parameters<T>) {
		// TODO: Implement timer clearing and execution
	}
}`,
			solutionCode: `export function debounce<T extends (...args: any[]) => any>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timer: ReturnType<typeof setTimeout> | null = null

	return function (this: any, ...args: Parameters<T>) {
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(() => {
			fn.apply(this, args)
		}, delay)
	}
}`,
			explanation: 'Each invocation clears any pending timer and sets a new timeout. When the delay elapses without further calls, the target function executes with the latest arguments.',
			testCases: [
				{
					description: 'Cancels prior invocations within delay window',
					assertion: 'Only 1 execution occurs when called 3 times in rapid succession',
				},
				{
					description: 'Passes latest arguments accurately',
					assertion: 'Receives the parameters of the most recent call',
				},
			],
		},
	],
}
