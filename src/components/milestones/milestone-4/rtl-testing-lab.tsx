import { useState } from 'react'
import { useProgressStore } from '../../../store/use-progress-store'
import { CheckCircle, Play, Eye, Terminal } from 'lucide-react'

interface TestLog {
	title: string
	status: 'passed' | 'running' | 'pending'
	durationMs: number
}

export function RtlTestingLab () {
	const { markLabComplete, completedLabs } = useProgressStore()
	const [isRunning, setIsRunning] = useState(false)
	const [testLogs, setTestLogs] = useState<TestLog[]>([])
	const [showSolution, setShowSolution] = useState(false)

	const isCompleted = completedLabs['lab-rtl-suite']

	const handleRunSuite = () => {
		setIsRunning(true)
		setTestLogs([
			{ title: 'renders SearchInput with accessible textbox role', status: 'running', durationMs: 0 },
			{ title: 'dispatches userEvent typing sequence accurately', status: 'pending', durationMs: 0 },
			{ title: 'waits for debounced results list to appear in DOM', status: 'pending', durationMs: 0 },
		])

		setTimeout(() => {
			setTestLogs(prev => [
				{ ...prev[0], status: 'passed', durationMs: 14 },
				{ ...prev[1], status: 'running' },
				prev[2],
			])
		}, 300)

		setTimeout(() => {
			setTestLogs(prev => [
				prev[0],
				{ ...prev[1], status: 'passed', durationMs: 38 },
				{ ...prev[2], status: 'running' },
			])
		}, 650)

		setTimeout(() => {
			setTestLogs(prev => [
				prev[0],
				prev[1],
				{ ...prev[2], status: 'passed', durationMs: 62 },
			])
			setIsRunning(false)
			if (!isCompleted) {
				markLabComplete('lab-rtl-suite')
			}
		}, 1000)
	}

	return (
		<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-3 mb-4">
				<div className="flex items-center gap-2.5">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
						<Terminal className="h-4 w-4" />
					</div>
					<div>
						<h4 className="text-sm font-bold text-white">
							Lab: React Testing Library User-Centric Test Suite
						</h4>
						<p className="text-xs text-slate-400">
							Validates getByRole accessible query prioritization, userEvent interactions, and async assertions.
						</p>
					</div>
				</div>
				{isCompleted && (
					<span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
						<CheckCircle className="h-3.5 w-3.5" />
						<span>Verified</span>
					</span>
				)}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{/* Test Code */}
				<div className="rounded-xl border border-surface-800 bg-surface-950 p-3 font-mono text-xs text-slate-300">
					<div className="flex justify-between items-center text-slate-500 text-[11px] mb-2 border-b border-surface-800 pb-1">
						<span>RTL Test Suite (Jest / Vitest)</span>
						<button
							onClick={() => setShowSolution(!showSolution)}
							className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
						>
							<Eye className="h-3 w-3" />
							<span>{showSolution ? 'Hide' : 'View RTL Code'}</span>
						</button>
					</div>
					<pre className="overflow-x-auto text-emerald-200">
						<code>
							{showSolution
								? `test('filters user list on debounced input', async () => {
  const user = userEvent.setup()
  render(<UserSearch />)

  // 1. Accessible Role Query
  const input = screen.getByRole('textbox', { name: /search/i })
  await user.type(input, 'Engineering')

  // 2. Async Assertion
  await waitFor(() => {
    expect(screen.getByRole('listitem')).toHaveTextContent('Frontend Lead')
  })
})`
								: `// Click 'View RTL Code' to inspect idiomatic RTL assertions`}
						</code>
					</pre>
				</div>

				{/* Test Runner Simulator */}
				<div className="flex flex-col justify-between rounded-xl border border-surface-800 bg-surface-950 p-4">
					<div>
						<div className="flex items-center justify-between mb-3">
							<span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
								In-Browser RTL Test Execution
							</span>
						</div>

						{testLogs.length > 0 ? (
							<div className="space-y-2 mb-4">
								{testLogs.map((log, idx) => (
									<div
										key={idx}
										className="flex items-center justify-between rounded-lg bg-surface-900 border border-surface-800 px-3 py-2 text-xs"
									>
										<div className="flex items-center gap-2">
											{log.status === 'passed' && <CheckCircle className="h-4 w-4 text-emerald-400" />}
											{log.status === 'running' && <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />}
											{log.status === 'pending' && <span className="h-2 w-2 rounded-full bg-slate-600" />}
											<span className="text-slate-200 font-mono text-[11px]">{log.title}</span>
										</div>
										<span className="font-mono text-[10px] text-slate-500">
											{log.status === 'passed' ? `${log.durationMs}ms` : log.status}
										</span>
									</div>
								))}
							</div>
						) : (
							<p className="text-xs text-slate-400 mb-4 leading-relaxed">
								Click below to dispatch the React Testing Library suite and verify accessible DOM assertions.
							</p>
						)}
					</div>

					<button
						disabled={isRunning}
						onClick={handleRunSuite}
						className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white transition shadow-md shadow-emerald-500/20 disabled:opacity-50"
					>
						<Play className="h-3.5 w-3.5" />
						<span>{isRunning ? 'Running Test Suite...' : 'Execute RTL Test Suite'}</span>
					</button>
				</div>
			</div>
		</div>
	)
}
