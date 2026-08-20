import { useState, useEffect, useRef } from 'react'
import { Play, RotateCcw, FastForward, CheckCircle2, Terminal } from 'lucide-react'

interface TraceStep {
	line: number
	explanation: string
	callStack: string[]
	webApis: string[]
	microtasks: string[]
	macrotasks: string[]
	consoleOutput: string[]
}

const TRACE_STEPS: TraceStep[] = [
	{
		line: 1,
		explanation: 'Step 1: Execute synchronous line 1. Push console.log("1: Sync Start") to Call Stack.',
		callStack: ['console.log("1: Sync Start")'],
		webApis: [],
		microtasks: [],
		macrotasks: [],
		consoleOutput: ['1: Sync Start'],
	},
	{
		line: 3,
		explanation: 'Step 2: Encounter setTimeout(..., 0). Hand off timer to Browser Web APIs.',
		callStack: ['setTimeout(cb, 0)'],
		webApis: ['Timer (0ms)'],
		microtasks: [],
		macrotasks: [],
		consoleOutput: ['1: Sync Start'],
	},
	{
		line: 4,
		explanation: 'Step 3: Timer expires immediately in Web API and pushes its callback to Macrotask Queue.',
		callStack: [],
		webApis: [],
		microtasks: [],
		macrotasks: ['setTimeout Callback: () => console.log("2: Timeout")'],
		consoleOutput: ['1: Sync Start'],
	},
	{
		line: 7,
		explanation: 'Step 4: Execute Promise.resolve().then(...). Callback enqueued into Microtask Queue.',
		callStack: ['Promise.resolve().then(...)'],
		webApis: [],
		microtasks: ['Microtask 1: () => console.log("3: Promise")'],
		macrotasks: ['setTimeout Callback: () => console.log("2: Timeout")'],
		consoleOutput: ['1: Sync Start'],
	},
	{
		line: 11,
		explanation: 'Step 5: Execute queueMicrotask(...). Enqueue callback directly into Microtask Queue.',
		callStack: ['queueMicrotask(...)'],
		webApis: [],
		microtasks: [
			'Microtask 1: () => console.log("3: Promise")',
			'Microtask 2: () => console.log("4: queueMicrotask")',
		],
		macrotasks: ['setTimeout Callback: () => console.log("2: Timeout")'],
		consoleOutput: ['1: Sync Start'],
	},
	{
		line: 15,
		explanation: 'Step 6: Execute synchronous line 15. Output "5: Sync End". Call stack is now empty!',
		callStack: ['console.log("5: Sync End")'],
		webApis: [],
		microtasks: [
			'Microtask 1: () => console.log("3: Promise")',
			'Microtask 2: () => console.log("4: queueMicrotask")',
		],
		macrotasks: ['setTimeout Callback: () => console.log("2: Timeout")'],
		consoleOutput: ['1: Sync Start', '5: Sync End'],
	},
	{
		line: 8,
		explanation: 'Step 7: Event loop prioritizes Microtask Queue! Dequeue and execute Microtask 1.',
		callStack: ['() => console.log("3: Promise")'],
		webApis: [],
		microtasks: ['Microtask 2: () => console.log("4: queueMicrotask")'],
		macrotasks: ['setTimeout Callback: () => console.log("2: Timeout")'],
		consoleOutput: ['1: Sync Start', '5: Sync End', '3: Promise'],
	},
	{
		line: 12,
		explanation: 'Step 8: Dequeue and execute Microtask 2. Microtask queue is now completely drained!',
		callStack: ['() => console.log("4: queueMicrotask")'],
		webApis: [],
		microtasks: [],
		macrotasks: ['setTimeout Callback: () => console.log("2: Timeout")'],
		consoleOutput: ['1: Sync Start', '5: Sync End', '3: Promise', '4: queueMicrotask'],
	},
	{
		line: 5,
		explanation: 'Step 9: Microtasks empty $\\rightarrow$ Event loop picks the first pending Macrotask (setTimeout callback).',
		callStack: ['() => console.log("2: Timeout")'],
		webApis: [],
		microtasks: [],
		macrotasks: [],
		consoleOutput: ['1: Sync Start', '5: Sync End', '3: Promise', '4: queueMicrotask', '2: Timeout'],
	},
	{
		line: 0,
		explanation: 'Step 10: Execution complete! All stacks and queues are clear.',
		callStack: [],
		webApis: [],
		microtasks: [],
		macrotasks: [],
		consoleOutput: ['1: Sync Start', '5: Sync End', '3: Promise', '4: queueMicrotask', '2: Timeout'],
	},
]

const SAMPLE_CODE = [
	'1:  console.log("1: Sync Start")',
	'2:  ',
	'3:  setTimeout(() => {',
	'4:    console.log("2: Timeout")',
	'5:  }, 0)',
	'6:  ',
	'7:  Promise.resolve().then(() => {',
	'8:    console.log("3: Promise")',
	'9:  })',
	'10: ',
	'11: queueMicrotask(() => {',
	'12:   console.log("4: queueMicrotask")',
	'13: })',
	'14: ',
	'15: console.log("5: Sync End")',
]

export function EventLoopVisualizer () {
	const [stepIndex, setStepIndex] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
	const timerRef = useRef<any>(null)

	const currentStep = TRACE_STEPS[stepIndex]

	useEffect(() => {
		if (isPlaying) {
			timerRef.current = setInterval(() => {
				setStepIndex((prev) => {
					if (prev >= TRACE_STEPS.length - 1) {
						setIsPlaying(false)
						return prev
					}
					return prev + 1
				})
			}, 1800)
		} else {
			if (timerRef.current) clearInterval(timerRef.current)
		}
		return () => {
			if (timerRef.current) clearInterval(timerRef.current)
		}
	}, [isPlaying])

	const handleNext = () => {
		if (stepIndex < TRACE_STEPS.length - 1) {
			setStepIndex(prev => prev + 1)
		}
	}

	const handleReset = () => {
		setIsPlaying(false)
		setStepIndex(0)
	}

	return (
		<div className="rounded-2xl border border-surface-800 bg-surface-900/80 p-5 backdrop-blur-sm">
			{/* Controls Header */}
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-4 mb-4">
				<div>
					<h3 className="text-base font-bold text-white flex items-center gap-2">
						<span>Interactive Event Loop Sandbox</span>
						<span className="rounded bg-brand-500/20 text-brand-300 text-[10px] px-2 py-0.5 font-mono">
							Step {stepIndex + 1} / {TRACE_STEPS.length}
						</span>
					</h3>
					<p className="text-xs text-slate-400">
						Observe call stack execution, microtask queue priority, and macrotask dispatch in action.
					</p>
				</div>

				<div className="flex items-center gap-2">
					<button
						onClick={() => setIsPlaying(!isPlaying)}
						className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
							isPlaying
								? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
								: 'bg-brand-600 text-white hover:bg-brand-500'
						}`}
					>
						<Play className="h-3.5 w-3.5" />
						<span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
					</button>

					<button
						onClick={handleNext}
						disabled={stepIndex >= TRACE_STEPS.length - 1}
						className="flex items-center gap-1.5 rounded-lg bg-surface-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-surface-700 disabled:opacity-40 transition"
					>
						<FastForward className="h-3.5 w-3.5" />
						<span>Next Step</span>
					</button>

					<button
						onClick={handleReset}
						className="flex items-center gap-1.5 rounded-lg border border-surface-700 bg-surface-800 p-1.5 text-slate-400 hover:text-slate-200 transition"
						title="Reset Sandbox"
					>
						<RotateCcw className="h-3.5 w-3.5" />
					</button>
				</div>
			</div>

			{/* Explanation Banner */}
			<div className="mb-5 rounded-xl border border-brand-500/30 bg-brand-500/10 p-3.5 text-xs text-brand-200">
				<p className="font-mono">{currentStep.explanation}</p>
			</div>

			{/* Grid Layout: Code & Visual Queues */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
				{/* Code Viewer */}
				<div className="lg:col-span-5 rounded-xl border border-surface-800 bg-surface-950 p-3 font-mono text-xs overflow-x-auto">
					<div className="text-[10px] uppercase font-bold text-slate-500 mb-2 border-b border-surface-800 pb-1 flex items-center justify-between">
						<span>Script Code</span>
						<span>Target</span>
					</div>
					<div className="space-y-1">
						{SAMPLE_CODE.map((codeLine, idx) => {
							const lineNum = idx + 1
							const isCurrent = currentStep.line === lineNum
							return (
								<div
									key={idx}
									className={`px-2 py-0.5 rounded transition ${
										isCurrent
											? 'bg-brand-500/30 text-white font-bold border-l-2 border-brand-400'
											: 'text-slate-400'
									}`}
								>
									{codeLine}
								</div>
							)
						})}
					</div>
				</div>

				{/* Visual Engine Pipeline */}
				<div className="lg:col-span-7 flex flex-col gap-3">
					{/* Call Stack & Web APIs */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{/* Call Stack */}
						<div className="rounded-xl border border-surface-800 bg-surface-950 p-3">
							<div className="text-[10px] uppercase font-bold text-indigo-400 mb-2 flex items-center justify-between">
								<span>Call Stack</span>
								<span className="text-[9px] text-slate-500">LIFO</span>
							</div>
							<div className="min-h-[50px] flex flex-col gap-1">
								{currentStep.callStack.length === 0 ? (
									<span className="text-xs italic text-slate-600">Empty</span>
								) : (
									currentStep.callStack.map((item, i) => (
										<div
											key={i}
											className="rounded bg-indigo-500/20 border border-indigo-500/40 px-2 py-1 text-xs text-indigo-200 font-mono animate-pulse"
										>
											{item}
										</div>
									))
								)}
							</div>
						</div>

						{/* Web APIs */}
						<div className="rounded-xl border border-surface-800 bg-surface-950 p-3">
							<div className="text-[10px] uppercase font-bold text-amber-400 mb-2 flex items-center justify-between">
								<span>Browser Web APIs</span>
								<span className="text-[9px] text-slate-500">Timers / IO</span>
							</div>
							<div className="min-h-[50px] flex flex-col gap-1">
								{currentStep.webApis.length === 0 ? (
									<span className="text-xs italic text-slate-600">Idle</span>
								) : (
									currentStep.webApis.map((item, i) => (
										<div
											key={i}
											className="rounded bg-amber-500/20 border border-amber-500/40 px-2 py-1 text-xs text-amber-200 font-mono"
										>
											{item}
										</div>
									))
								)}
							</div>
						</div>
					</div>

					{/* Task Queues */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{/* Microtask Queue */}
						<div className="rounded-xl border border-surface-800 bg-surface-950 p-3">
							<div className="text-[10px] uppercase font-bold text-emerald-400 mb-2 flex items-center justify-between">
								<span>Microtask Queue</span>
								<span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">
									High Priority
								</span>
							</div>
							<div className="min-h-[60px] flex flex-col gap-1">
								{currentStep.microtasks.length === 0 ? (
									<span className="text-xs italic text-slate-600">Empty</span>
								) : (
									currentStep.microtasks.map((item, i) => (
										<div
											key={i}
											className="rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-1 text-xs text-emerald-200 font-mono"
										>
											{item}
										</div>
									))
								)}
							</div>
						</div>

						{/* Macrotask Queue */}
						<div className="rounded-xl border border-surface-800 bg-surface-950 p-3">
							<div className="text-[10px] uppercase font-bold text-purple-400 mb-2 flex items-center justify-between">
								<span>Macrotask Queue</span>
								<span className="text-[9px] text-slate-500">Standard</span>
							</div>
							<div className="min-h-[60px] flex flex-col gap-1">
								{currentStep.macrotasks.length === 0 ? (
									<span className="text-xs italic text-slate-600">Empty</span>
								) : (
									currentStep.macrotasks.map((item, i) => (
										<div
											key={i}
											className="rounded bg-purple-500/20 border border-purple-500/40 px-2 py-1 text-xs text-purple-200 font-mono"
										>
											{item}
										</div>
									))
								)}
							</div>
						</div>
					</div>

					{/* Console Output */}
					<div className="rounded-xl border border-surface-800 bg-surface-950 p-3">
						<div className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1.5">
							<Terminal className="h-3 w-3 text-brand-400" />
							<span>Console Output</span>
						</div>
						<div className="flex flex-wrap gap-2 min-h-[32px] items-center">
							{currentStep.consoleOutput.length === 0 ? (
								<span className="text-xs italic text-slate-600">No output yet...</span>
							) : (
								currentStep.consoleOutput.map((out, i) => (
									<span
										key={i}
										className="rounded bg-surface-800 border border-surface-700 px-2 py-0.5 font-mono text-xs text-emerald-400 flex items-center gap-1"
									>
										<CheckCircle2 className="h-3 w-3" />
										{out}
									</span>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
