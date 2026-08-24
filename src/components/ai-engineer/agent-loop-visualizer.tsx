import { useState } from 'react'
import { Bot, Play, RotateCcw, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react'

interface ExecutionTurn {
	id: number
	phase: 'thought' | 'action' | 'observation' | 'final'
	title: string
	content: string
	codeSnippet?: string
	isLoopWarning?: boolean
}

const NORMAL_LOOP_TURNS: ExecutionTurn[] = [
	{
		id: 1,
		phase: 'thought',
		title: 'Turn 1 • Thought (Reasoning)',
		content: 'The user reported a flaky test in test_auth.py. I need to first locate the failing test definition and inspect the token expiration tolerance.',
	},
	{
		id: 2,
		phase: 'action',
		title: 'Turn 1 • Action (Tool Call)',
		content: 'Invoking grep_search to inspect test_jwt_expiry in tests/test_auth.py',
		codeSnippet: `grep_search({
  "Query": "test_jwt_expiry",
  "SearchPath": "/workspace/repo/tests/test_auth.py"
})`,
	},
	{
		id: 3,
		phase: 'observation',
		title: 'Turn 1 • Observation (Environment Output)',
		content: 'Line 42: assert token.expires_at == now() + timedelta(seconds=60) [FAIL: Clock drift causes ±1s mismatch]',
	},
	{
		id: 4,
		phase: 'thought',
		title: 'Turn 2 • Thought (Self-Reflection & Plan)',
		content: 'The assertion strictly checks equality (==) on time timestamps, which fails intermittently due to execution latency. I will replace it with a tolerance range of <= 1 second.',
	},
	{
		id: 5,
		phase: 'action',
		title: 'Turn 2 • Action (Tool Call)',
		content: 'Applying fix using replace_file_content to use pytest.approx or delta check',
		codeSnippet: `replace_file_content({
  "TargetFile": "/workspace/repo/tests/test_auth.py",
  "TargetContent": "assert token.expires_at == now() + timedelta(seconds=60)",
  "ReplacementContent": "assert abs(token.expires_at - (now() + timedelta(seconds=60))).total_seconds() < 2"
})`,
	},
	{
		id: 6,
		phase: 'observation',
		title: 'Turn 2 • Observation (Environment Output)',
		content: '✓ File successfully modified. Running test suite: pytest tests/test_auth.py -> 1 passed in 0.12s.',
	},
	{
		id: 7,
		phase: 'final',
		title: 'Turn 3 • Final Synthesis & Verdict',
		content: 'The flaky test was caused by strict timestamp equality comparison susceptible to sub-second clock drift. Replaced strict equality with a 2-second tolerance delta. Verified 100% deterministic test pass.',
	},
]

const CYCLE_LOOP_TURNS: ExecutionTurn[] = [
	{
		id: 1,
		phase: 'thought',
		title: 'Turn 1 • Thought (Reasoning)',
		content: 'I need to run the database migration script to update schemas.',
	},
	{
		id: 2,
		phase: 'action',
		title: 'Turn 1 • Action (Tool Call)',
		content: 'Invoking run_command with python manage.py migrate',
		codeSnippet: `run_command({ "CommandLine": "python manage.py migrate" })`,
	},
	{
		id: 3,
		phase: 'observation',
		title: 'Turn 1 • Observation (Error Output)',
		content: 'OperationalError: database "production_db" is locked by process 4122',
	},
	{
		id: 4,
		phase: 'thought',
		title: 'Turn 2 • Thought (Repetitive Trap)',
		content: 'Migration failed. Let me try running the exact same command again.',
	},
	{
		id: 5,
		phase: 'action',
		title: 'Turn 2 • Action (Repetitive Tool Call)',
		content: 'Repeating run_command with python manage.py migrate',
		codeSnippet: `run_command({ "CommandLine": "python manage.py migrate" })`,
	},
	{
		id: 6,
		phase: 'observation',
		title: 'Turn 2 • Guardrail: Cycle Hashing Interruption',
		content: '[GUARDRAIL INTERRUPT] Cycle detected: identical command executed 2 times with identical failure. Releasing lock via fuser -k 5432/tcp or inspecting active locks before retrying.',
		isLoopWarning: true,
	},
	{
		id: 7,
		phase: 'final',
		title: 'Turn 3 • Pivot Strategy & Resolution',
		content: 'Identified dangling database lock from zombie test process. Terminated holding process, cleared lockfile, and successfully re-ran migrations deterministically.',
	},
]

export function AgentLoopVisualizer () {
	const [isCycleMode, setIsCycleMode] = useState(false)
	const [activeStep, setActiveStep] = useState(0)

	const turns = isCycleMode ? CYCLE_LOOP_TURNS : NORMAL_LOOP_TURNS

	const handleNext = () => {
		if (activeStep < turns.length - 1) {
			setActiveStep(activeStep + 1)
		}
	}

	const handleReset = () => {
		setActiveStep(0)
	}

	return (
		<div className="rounded-2xl border border-surface-800 bg-surface-900/80 p-5 backdrop-blur-sm">
			{/* Header */}
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-4 mb-4">
				<div>
					<h3 className="text-base font-bold text-white flex items-center gap-2">
						<Bot className="h-4 w-4 text-purple-400" />
						<span>Interactive ReAct Loop Stepper & Cycle Detection Guardrails</span>
					</h3>
					<p className="text-xs text-slate-400">
						Visualize autonomous agent reasoning, tool execution state transitions, and automated cycle trap breaks.
					</p>
				</div>

				<div className="flex items-center gap-2">
					<button
						onClick={() => {
							setIsCycleMode(!isCycleMode)
							setActiveStep(0)
						}}
						className={`rounded-xl px-3 py-1.5 text-xs font-bold transition border ${
							isCycleMode
								? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
								: 'bg-surface-950 border-surface-800 text-slate-400 hover:text-slate-200'
						}`}
					>
						{isCycleMode ? 'Mode: Cycle Trap Demo' : 'Mode: Healthy ReAct Flow'}
					</button>

					<button
						onClick={handleReset}
						className="flex items-center gap-1 rounded-xl bg-surface-950 border border-surface-800 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white"
					>
						<RotateCcw className="h-3.5 w-3.5" />
						<span>Reset</span>
					</button>
				</div>
			</div>

			{/* Stepper Timeline Controls */}
			<div className="flex items-center justify-between gap-3 mb-5">
				<div className="text-xs font-bold text-slate-300">
					Step {activeStep + 1} of {turns.length}:{' '}
					<span className="text-purple-300">{turns[activeStep].title}</span>
				</div>

				<button
					onClick={handleNext}
					disabled={activeStep >= turns.length - 1}
					className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-500/25 transition"
				>
					<Play className="h-3.5 w-3.5 fill-current" />
					<span>Step Next Action</span>
				</button>
			</div>

			{/* Turns Stepper Display */}
			<div className="space-y-3">
				{turns.slice(0, activeStep + 1).map((turn, i) => {
					const isCurrent = i === activeStep
					let badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/30'
					if (turn.phase === 'action') badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30'
					if (turn.phase === 'observation') badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
					if (turn.isLoopWarning) badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/50'
					if (turn.phase === 'final') badgeColor = 'bg-pink-500/20 text-pink-300 border-pink-500/30'

					return (
						<div
							key={turn.id}
							className={`rounded-xl border p-4 transition-all duration-300 ${
								isCurrent
									? 'bg-surface-950 border-purple-500/50 shadow-lg shadow-purple-500/5'
									: 'bg-surface-950/60 border-surface-800/80 text-slate-300'
							}`}
						>
							<div className="flex items-center justify-between gap-2 mb-2">
								<div className="flex items-center gap-2">
									<span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badgeColor}`}>
										{turn.phase}
									</span>
									<h4 className="text-xs font-bold text-white">{turn.title}</h4>
								</div>
								{turn.phase === 'final' && (
									<span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
										<CheckCircle2 className="h-3.5 w-3.5" />
										<span>Goal Converged</span>
									</span>
								)}
								{turn.isLoopWarning && (
									<span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
										<AlertTriangle className="h-3.5 w-3.5" />
										<span>Steering Intercept</span>
									</span>
								)}
							</div>

							<p className="text-xs text-slate-300 leading-relaxed">{turn.content}</p>

							{turn.codeSnippet && (
								<div className="mt-2.5 rounded-lg border border-surface-800 bg-surface-900/90 p-2.5 font-mono text-xs text-purple-200">
									<pre className="overflow-x-auto">
										<code>{turn.codeSnippet}</code>
									</pre>
								</div>
							)}
						</div>
					)
				})}
			</div>

			{/* Guardrail Guidance Footer */}
			<div className="mt-5 rounded-xl border border-surface-800 bg-surface-950/80 p-3.5 text-xs text-slate-400 flex items-start gap-2.5">
				<MessageSquare className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
				<div>
					<strong className="text-white">Agentic Orchestration Rule:</strong> High-performance RL harnesses enforce strict cycle hashing (monitoring identical tool call tuples) and structured remediation hints so models do not exhaust tokens in dead-end loops.
				</div>
			</div>
		</div>
	)
}
