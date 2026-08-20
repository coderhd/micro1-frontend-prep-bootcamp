import { useState } from 'react'
import { useProgressStore } from '../../../store/use-progress-store'
import { Code2, CheckCircle, Eye } from 'lucide-react'

export function Milestone1CodeLab () {
	const { markLabComplete, completedLabs } = useProgressStore()

	// Challenge 1: Debounce live sandbox
	const [clickCount, setClickCount] = useState(0)
	const [debouncedExecutionCount, setDebouncedExecutionCount] = useState(0)
	const [debounceTimerId, setDebounceTimerId] = useState<any>(null)
	const [showSolution1, setShowSolution1] = useState(false)

	// Challenge 2: Promise.allSettled simulator
	const [allSettledResults, setAllSettledResults] = useState<any[] | null>(null)
	const [isRunningAllSettled, setIsRunningAllSettled] = useState(false)
	const [showSolution2, setShowSolution2] = useState(false)

	const isLab1Completed = completedLabs['lab-debounce']
	const isLab2Completed = completedLabs['lab-allsettled']

	const handleRapidClick = () => {
		setClickCount(prev => prev + 1)
		if (debounceTimerId) {
			clearTimeout(debounceTimerId)
		}
		const newTimer = setTimeout(() => {
			setDebouncedExecutionCount(prev => {
				const nextVal = prev + 1
				if (nextVal >= 2 && !isLab1Completed) {
					markLabComplete('lab-debounce')
				}
				return nextVal
			})
		}, 600)
		setDebounceTimerId(newTimer)
	}

	const handleRunAllSettledSim = async () => {
		setIsRunningAllSettled(true)
		setAllSettledResults(null)

		// Mock promises
		const p1 = new Promise((resolve) => setTimeout(() => resolve('User Profile Loaded'), 400))
		const p2 = new Promise((_, reject) => setTimeout(() => reject(new Error('Network 500 Failure')), 700))
		const p3 = new Promise((resolve) => setTimeout(() => resolve('Preferences Cached'), 300))

		const customAllSettled = (promises: Promise<any>[]) => {
			return Promise.all(
				promises.map((p) =>
					p
						.then((value) => ({ status: 'fulfilled', value }))
						.catch((reason) => ({ status: 'rejected', reason: reason.message || reason }))
				)
			)
		}

		const results = await customAllSettled([p1, p2, p3])
		setAllSettledResults(results)
		setIsRunningAllSettled(false)

		if (!isLab2Completed) {
			markLabComplete('lab-allsettled')
		}
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Lab 1: Debounce */}
			<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-3 mb-4">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400">
							<Code2 className="h-4 w-4" />
						</div>
						<div>
							<h4 className="text-sm font-bold text-white">
								Lab 1: Custom Debounce Implementation & Live Verification
							</h4>
							<p className="text-xs text-slate-400">
								Delay target invocation until 600ms of user idle time.
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
					{/* Code Preview */}
					<div className="rounded-xl border border-surface-800 bg-surface-950 p-3 font-mono text-xs text-slate-300">
						<div className="flex justify-between items-center text-slate-500 text-[11px] mb-2 border-b border-surface-800 pb-1">
							<span>TypeScript Reference</span>
							<button
								onClick={() => setShowSolution1(!showSolution1)}
								className="flex items-center gap-1 text-brand-400 hover:text-brand-300"
							>
								<Eye className="h-3 w-3" />
								<span>{showSolution1 ? 'Hide Solution' : 'View Golden Solution'}</span>
							</button>
						</div>
						<pre className="overflow-x-auto text-brand-200">
							<code>
								{showSolution1
									? `function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}`
									: `// Click "View Golden Solution" to review implementation`}
							</code>
						</pre>
					</div>

					{/* Live Interactive Sandbox */}
					<div className="flex flex-col justify-between rounded-xl border border-surface-800 bg-surface-950 p-4">
						<div>
							<span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
								Interactive Trigger Simulator
							</span>
							<p className="text-xs text-slate-400 mt-1 mb-4">
								Click rapidly 5 times in a row. The debounced handler should only fire ONCE after you pause.
							</p>

							<div className="grid grid-cols-2 gap-3 mb-4">
								<div className="rounded-lg bg-surface-900 border border-surface-800 p-3 text-center">
									<div className="text-xs text-slate-400">Total User Clicks</div>
									<div className="text-xl font-bold text-white mt-0.5">{clickCount}</div>
								</div>
								<div className="rounded-lg bg-surface-900 border border-surface-800 p-3 text-center">
									<div className="text-xs text-emerald-400">Debounced Invocations</div>
									<div className="text-xl font-bold text-emerald-400 mt-0.5">{debouncedExecutionCount}</div>
								</div>
							</div>
						</div>

						<button
							onClick={handleRapidClick}
							className="w-full rounded-xl bg-brand-600 hover:bg-brand-500 py-2.5 text-xs font-bold text-white transition shadow-md shadow-brand-500/20 active:scale-98"
						>
							Click Rapidly! (600ms Debounce)
						</button>
					</div>
				</div>
			</div>

			{/* Lab 2: Promise.allSettled */}
			<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-3 mb-4">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
							<Code2 className="h-4 w-4" />
						</div>
						<div>
							<h4 className="text-sm font-bold text-white">
								Lab 2: Custom Promise.allSettled Polyfill
							</h4>
							<p className="text-xs text-slate-400">
								Ensure non-short-circuiting resolution across mixed fulfilled and rejected promises.
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
							<span>Implementation Logic</span>
							<button
								onClick={() => setShowSolution2(!showSolution2)}
								className="flex items-center gap-1 text-brand-400 hover:text-brand-300"
							>
								<Eye className="h-3 w-3" />
								<span>{showSolution2 ? 'Hide Solution' : 'View Golden Solution'}</span>
							</button>
						</div>
						<pre className="overflow-x-auto text-purple-200">
							<code>
								{showSolution2
									? `function allSettled<T>(promises: Promise<T>[]) {
  return Promise.all(
    promises.map((p) =>
      Promise.resolve(p)
        .then((value) => ({ status: 'fulfilled' as const, value }))
        .catch((reason) => ({ status: 'rejected' as const, reason }))
    )
  )
}`
									: `// Click "View Golden Solution" to inspect polyfill logic`}
							</code>
						</pre>
					</div>

					<div className="flex flex-col justify-between rounded-xl border border-surface-800 bg-surface-950 p-4">
						<div>
							<span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
								Live Async Concurrent Dispatch
							</span>
							<p className="text-xs text-slate-400 mt-1 mb-3">
								Executes 3 concurrent promises (2 resolve, 1 deliberately rejects).
							</p>

							{allSettledResults && (
								<div className="space-y-1.5 mb-3 font-mono text-xs">
									{allSettledResults.map((res, i) => (
										<div
											key={i}
											className={`p-2 rounded border text-[11px] ${
												res.status === 'fulfilled'
													? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
													: 'bg-rose-500/10 border-rose-500/30 text-rose-300'
											}`}
										>
											<strong>[{res.status.toUpperCase()}]</strong> {res.status === 'fulfilled' ? res.value : res.reason}
										</div>
									))}
								</div>
							)}
						</div>

						<button
							disabled={isRunningAllSettled}
							onClick={handleRunAllSettledSim}
							className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 text-xs font-bold text-white transition shadow-md shadow-purple-500/20 active:scale-98 disabled:opacity-50"
						>
							{isRunningAllSettled ? 'Resolving Promises...' : 'Dispatch Concurrent Test'}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
