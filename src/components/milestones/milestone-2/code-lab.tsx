import { useState, useEffect } from 'react'
import { useProgressStore } from '../../../store/use-progress-store'
import { CheckCircle, Eye, Timer, Search } from 'lucide-react'

// Custom useDebounce hook implementation
function useDebounceValue<T> (value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

	return debouncedValue
}

export function Milestone2CodeLab () {
	const { markLabComplete, completedLabs } = useProgressStore()

	// Lab 1: Timer state
	const [timerMode, setTimerMode] = useState<'buggy' | 'fixed'>('buggy')
	const [timerCount, setTimerCount] = useState(0)
	const [isTimerRunning, setIsTimerRunning] = useState(false)
	const [showSolution1, setShowSolution1] = useState(false)

	// Lab 2: Debounced search state
	const [searchTerm, setSearchTerm] = useState('')
	const debouncedQuery = useDebounceValue(searchTerm, 500)
	const [showSolution2, setShowSolution2] = useState(false)

	const isLab1Completed = completedLabs['lab-react-timer']
	const isLab2Completed = completedLabs['lab-react-usedebounce']

	// Timer effect demonstration
	useEffect(() => {
		let interval: any = null
		if (isTimerRunning) {
			interval = setInterval(() => {
				if (timerMode === 'buggy') {
					// ❌ Buggy: reads stale closure value
					setTimerCount(timerCount + 1)
				} else {
					// ✅ Fixed: reads live state via functional updater
					setTimerCount(prev => prev + 1)
				}
			}, 300)
		}
		return () => clearInterval(interval)
	}, [isTimerRunning, timerMode])

	useEffect(() => {
		if (timerMode === 'fixed' && timerCount >= 5 && !isLab1Completed) {
			markLabComplete('lab-react-timer')
		}
	}, [timerCount, timerMode, isLab1Completed, markLabComplete])

	useEffect(() => {
		if (debouncedQuery.length >= 3 && !isLab2Completed) {
			markLabComplete('lab-react-usedebounce')
		}
	}, [debouncedQuery, isLab2Completed, markLabComplete])

	return (
		<div className="flex flex-col gap-6">
			{/* Lab 1: Stale Closure Fix */}
			<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-3 mb-4">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400">
							<Timer className="h-4 w-4" />
						</div>
						<div>
							<h4 className="text-sm font-bold text-white">
								Lab 1: Diagnosing & Fixing the Stale Closure Timer Bug
							</h4>
							<p className="text-xs text-slate-400">
								Observe how setInterval closures freeze updates, then apply the functional updater fix.
							</p>
						</div>
					</div>
					{isLab1Completed && (
						<span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
							<CheckCircle className="h-3.5 w-3.5" />
							<span>Verified</span>
						</span>
					)}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="rounded-xl border border-surface-800 bg-surface-950 p-3 font-mono text-xs text-slate-300">
						<div className="flex justify-between items-center text-slate-500 text-[11px] mb-2 border-b border-surface-800 pb-1">
							<span>Fix Architecture</span>
							<button
								onClick={() => setShowSolution1(!showSolution1)}
								className="flex items-center gap-1 text-brand-400 hover:text-brand-300"
							>
								<Eye className="h-3 w-3" />
								<span>{showSolution1 ? 'Hide' : 'View Code Comparison'}</span>
							</button>
						</div>
						<pre className="overflow-x-auto text-brand-200">
							<code>
								{showSolution1
									? `// ❌ Broken (Stale Closure):
setCount(count + 1) // Always 0 + 1 = 1

// ✅ Golden Fix (Functional Updater):
setCount(prev => prev + 1) // Increments 1, 2, 3...`
									: `// Toggle mode in the simulator to test live execution`}
							</code>
						</pre>
					</div>

					<div className="flex flex-col justify-between rounded-xl border border-surface-800 bg-surface-950 p-4">
						<div>
							<div className="flex items-center justify-between mb-3">
								<span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
									Live Hook Sandbox
								</span>
								<div className="flex gap-2">
									<button
										onClick={() => {
											setTimerMode('buggy')
											setTimerCount(0)
										}}
										className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
											timerMode === 'buggy'
												? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
												: 'bg-surface-800 text-slate-400'
										}`}
									>
										Buggy Mode (Stale)
									</button>
									<button
										onClick={() => {
											setTimerMode('fixed')
											setTimerCount(0)
										}}
										className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
											timerMode === 'fixed'
												? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
												: 'bg-surface-800 text-slate-400'
										}`}
									>
										Fixed Mode (Functional)
									</button>
								</div>
							</div>

							<div className="rounded-xl bg-surface-900 border border-surface-800 p-4 text-center mb-3">
								<div className="text-xs text-slate-400">Current Timer Count</div>
								<div className={`text-3xl font-black mt-1 ${timerMode === 'fixed' ? 'text-emerald-400' : 'text-rose-400'}`}>
									{timerCount}
								</div>
								<div className="text-[11px] text-slate-500 mt-1">
									{timerMode === 'buggy' ? 'Frozen at 1 due to closure over count=0' : 'Incrementing cleanly without stale references'}
								</div>
							</div>
						</div>

						<button
							onClick={() => {
								setIsTimerRunning(!isTimerRunning)
								if (!isTimerRunning) setTimerCount(0)
							}}
							className={`w-full rounded-xl py-2.5 text-xs font-bold text-white transition ${
								isTimerRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-brand-600 hover:bg-brand-500'
							}`}
						>
							{isTimerRunning ? 'Stop Timer' : 'Start Timer Simulation'}
						</button>
					</div>
				</div>
			</div>

			{/* Lab 2: useDebounce Custom Hook */}
			<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-3 mb-4">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
							<Search className="h-4 w-4" />
						</div>
						<div>
							<h4 className="text-sm font-bold text-white">
								Lab 2: Custom useDebounce Hook Verification
							</h4>
							<p className="text-xs text-slate-400">
								Build and test a reusable TypeScript custom hook for API search debouncing.
							</p>
						</div>
					</div>
					{isLab2Completed && (
						<span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
							<CheckCircle className="h-3.5 w-3.5" />
							<span>Verified</span>
						</span>
					)}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="rounded-xl border border-surface-800 bg-surface-950 p-3 font-mono text-xs text-slate-300">
						<div className="flex justify-between items-center text-slate-500 text-[11px] mb-2 border-b border-surface-800 pb-1">
							<span>Hook Implementation</span>
							<button
								onClick={() => setShowSolution2(!showSolution2)}
								className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
							>
								<Eye className="h-3 w-3" />
								<span>{showSolution2 ? 'Hide' : 'View Code'}</span>
							</button>
						</div>
						<pre className="overflow-x-auto text-emerald-200">
							<code>
								{showSolution2
									? `export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}`
									: `// Type in the search box to see useDebounce in action`}
							</code>
						</pre>
					</div>

					<div className="flex flex-col justify-between rounded-xl border border-surface-800 bg-surface-950 p-4">
						<div>
							<span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
								Live Search Input (500ms Delay)
							</span>
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Type e.g. 'React' to trigger debounced query..."
								className="w-full rounded-xl border border-surface-700 bg-surface-900 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none mb-3"
							/>

							<div className="rounded-lg bg-surface-900/80 border border-surface-800 p-3 space-y-1 text-xs">
								<div className="flex justify-between text-slate-400">
									<span>Immediate Input State:</span>
									<span className="font-mono text-white font-semibold">&quot;{searchTerm}&quot;</span>
								</div>
								<div className="flex justify-between text-emerald-400">
									<span>Debounced State (Hook Output):</span>
									<span className="font-mono font-bold">&quot;{debouncedQuery}&quot;</span>
								</div>
							</div>
						</div>

						<p className="text-[11px] text-slate-500 mt-3">
							Type at least 3 characters to complete verification.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
