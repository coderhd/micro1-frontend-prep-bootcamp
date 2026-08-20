import { Milestone } from '../types/curriculum'

export const MILESTONE_4_DATA: Milestone = {
	id: 'm4',
	number: 4,
	title: 'Root-Cause Debugging, Testing & RL Environment Design',
	shortTitle: 'Debugging & Testing',
	subtitle: 'Memory Profiling, React Testing Library, DevTools & Reinforcement Learning Benchmarks',
	category: 'debugging-testing',
	estimatedTime: '25 mins',
	theorySections: [
		{
			id: 'devtools-memory-profiling',
			title: 'Chrome DevTools & Memory Heap Leak Diagnosis',
			badge: 'Production Debugging',
			summary: 'Diagnosing frontend memory leaks, performance bottlenecks, and rendering anomalies using Chrome DevTools Performance & Memory Heap Profiler.',
			bulletPoints: [
				'Memory Heap Snapshots: Take baseline snapshot -> perform action -> take snapshot 2. Compare with "Objects allocated between Snapshot 1 and 2" to spot detached DOM trees.',
				'Detached DOM Nodes: Occur when a DOM node is removed from the DOM tree, but a JavaScript closure or global event listener still holds a reference to it.',
				'Common SPA Leak Patterns: Uncleared setInterval/setTimeout, missing window.removeEventListener in useEffect return cleanups, and non-cancelled async fetch callbacks.',
				'Network Waterfall Optimization: Identifying render-blocking script chains, large uncompressed payloads, and missing Cache-Control headers.',
			],
			codeExamples: [
				{
					title: 'Preventing Event Listener Memory Leak',
					code: `useEffect(() => {
	const handleResize = () => {
		console.log(window.innerWidth)
	}

	window.addEventListener('resize', handleResize)

	// ✅ Mandatory Cleanup: Disposes listener when component unmounts
	return () => {
		window.removeEventListener('resize', handleResize)
	}
}, [])`,
					explanation: 'Without the cleanup function, each mount cycle attaches an orphaned handler referencing the component lexical scope forever.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Crucial for micro1 RL benchmark engineering where reproducible bug environments must be diagnosed deterministically.',
				keyPhrasesToSay: [
					'A memory leak in JavaScript happens when unused heap memory cannot be reclaimed by the garbage collector due to surviving root references.',
					'React Profiler flame charts highlight committed render durations and exact prop changes triggering updates.',
				],
				commonCandidateTraps: [
					'Thinking garbage collection immediately deletes variables when they are no longer in active use (it runs periodically based on engine heuristics).',
				],
			},
		},
		{
			id: 'rtl-testing-rl-environments',
			title: 'React Testing Library & Designing RL Benchmark Tasks',
			badge: 'Testing & AI Benchmarks',
			summary: 'Writing deterministic user-centric test suites using React Testing Library and understanding the structure of Reinforcement Learning (RL) coding environments.',
			bulletPoints: [
				'RTL Philosophy: "The more your tests resemble the way your software is used, the more confidence they can give you."',
				'Query Hierarchy Priority: getByRole -> getByLabelText -> getByPlaceholderText -> getByText -> getByTestId (last resort).',
				'UserEvent vs FireEvent: Prefer @testing-library/user-event as it dispatches full realistic browser event sequences (hover, focus, keydown, keypress, input, change).',
				'RL Environment Construction: Creating a reproducible repository sandbox with failing test cases, setting strict pass/fail criteria, and supplying an indisputable golden reference solution.',
			],
			codeExamples: [
				{
					title: 'Idiomatic React Testing Library Test Suite',
					code: `import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserSearch } from './UserSearch'

test('filters user list on debounced input', async () => {
	const user = userEvent.setup()
	render(<UserSearch />)

	const input = screen.getByRole('textbox', { name: /search engineers/i })
	await user.type(input, 'Alex')

	await waitFor(() => {
		expect(screen.getByRole('listitem')).toHaveTextContent('Alex Rivera')
	})
})`,
					explanation: 'Uses accessible getByRole queries and async waitFor to model true user behavior.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Micro1 candidates directly build RL environments that test AI models on software engineering problems (golden reference solutions + deterministic test suites).',
				keyPhrasesToSay: [
					'We test behavior rather than internal implementation state to ensure refactoring resilience.',
					'An RL environment requires an isolated reproducible harness, clear bug reproduction steps, and complete test assertion coverage.',
				],
				commonCandidateTraps: [
					'Querying DOM by CSS classes or internal React state in tests rather than accessible roles.',
				],
			},
		},
	],
	quiz: [
		{
			id: 'q4-1',
			question: 'According to React Testing Library best practices, which query method should always be your FIRST choice?',
			options: [
				'screen.getByTestId',
				'screen.getByRole',
				'document.querySelector',
				'screen.getByClassName',
			],
			correctAnswerIndex: 1,
			conceptTag: 'RTL Query Priority',
			explanation: 'getByRole queries elements as they are exposed in the accessibility tree (e.g. button, heading, textbox), ensuring tests validate accessible user interactions.',
		},
		{
			id: 'q4-2',
			question: 'What is a "Detached DOM Node" in the context of browser memory heap profiling?',
			options: [
				'A DOM node created inside an iframe.',
				'A DOM element removed from the active document tree that cannot be garbage collected because JavaScript references still point to it.',
				'A CSS pseudo-element that has display: none.',
				'A React Portal rendering outside the root element.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Memory Leaks & DevTools',
			explanation: 'When an element is removed from the DOM, but a variable, array, or event listener callback in JS retains a reference to it, it becomes a "detached DOM node" causing memory leaks.',
		},
		{
			id: 'q4-3',
			question: 'Why is @testing-library/user-event preferred over fireEvent?',
			options: [
				'fireEvent is deprecated in JavaScript.',
				'userEvent simulates complete realistic browser event sequences (focus, pointer events, key presses), whereas fireEvent only dispatches raw synthetic events.',
				'userEvent is much faster than fireEvent.',
				'fireEvent cannot test React components.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Testing Best Practices',
			explanation: 'userEvent accurately models real browser interactions by triggering focus changes, hover effects, and keyboard event sequences in full fidelity.',
		},
		{
			id: 'q4-4',
			question: 'In Reinforcement Learning (RL) benchmark creation for frontend tasks, what constitutes a "Golden Reference Solution"?',
			options: [
				'A compressed zip archive of the node_modules folder.',
				'A clean, minimal, and fully-tested implementation that deterministically passes all unit and visual regression tests without introducing side-effects.',
				'An AI-generated draft code without test cases.',
				'A Figma design screenshot.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'RL Benchmark Design',
			explanation: 'A golden reference solution serves as the definitive ground-truth fix against which AI model candidate solutions are evaluated for correctness, performance, and style.',
		},
		{
			id: 'q4-5',
			question: 'How do you prevent a memory leak when an asynchronous fetch promise resolves after the React component has already unmounted?',
			options: [
				'Delete the window.fetch API.',
				'Use an AbortController signal passed to fetch and call controller.abort() in the useEffect cleanup function.',
				'Wrap the setState in a setTimeout(fn, 10000).',
				'Disable React Strict Mode.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Async Cleanup & Memory',
			explanation: 'Using AbortController cancels the in-flight network request when the component unmounts, preventing state updates on unmounted components and freeing associated closure memory.',
		},
	],
	codeChallenges: [],
}
