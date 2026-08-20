import { useState } from 'react'
import { Bug, RefreshCw, ShieldCheck, AlertTriangle } from 'lucide-react'

export function MemoryLeakVisualizer () {
	const [isMounted, setIsMounted] = useState(false)
	const [hasCleanup, setHasCleanup] = useState(false)
	const [activeListenersCount, setActiveListenersCount] = useState(0)
	const [simulatedHeapMb, setSimulatedHeapMb] = useState(24.5)
	const [mountCycleCount, setMountCycleCount] = useState(0)

	const handleMountToggle = () => {
		if (!isMounted) {
			// Mounting
			setIsMounted(true)
			setMountCycleCount(c => c + 1)
			setActiveListenersCount(prev => prev + 1)
			setSimulatedHeapMb(prev => +(prev + 4.2).toFixed(1))
		} else {
			// Unmounting
			setIsMounted(false)
			if (hasCleanup) {
				// Cleaned up
				setActiveListenersCount(0)
				setSimulatedHeapMb(24.5)
			} else {
				// Leak retained!
				setSimulatedHeapMb(prev => +(prev + 1.8).toFixed(1))
			}
		}
	}

	const handleReset = () => {
		setIsMounted(false)
		setActiveListenersCount(0)
		setSimulatedHeapMb(24.5)
		setMountCycleCount(0)
	}

	return (
		<div className="rounded-2xl border border-surface-800 bg-surface-900/80 p-5 backdrop-blur-sm">
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-4 mb-4">
				<div>
					<h3 className="text-base font-bold text-white flex items-center gap-2">
						<Bug className="h-4 w-4 text-rose-400" />
						<span>Interactive Memory Leak & Detached Listener Simulator</span>
					</h3>
					<p className="text-xs text-slate-400">
						See how omitting cleanup in useEffect traps closures and balloons Heap memory across mount cycles.
					</p>
				</div>

				<div className="flex items-center gap-2">
					<button
						onClick={() => setHasCleanup(!hasCleanup)}
						className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
							hasCleanup
								? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
								: 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
						}`}
					>
						{hasCleanup ? (
							<>
								<ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
								<span>Cleanup: ENABLED (removeEventListener)</span>
							</>
						) : (
							<>
								<AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
								<span>Cleanup: MISSING (Leaking)</span>
							</>
						)}
					</button>

					<button
						onClick={handleReset}
						className="flex items-center rounded-lg border border-surface-700 bg-surface-800 p-1.5 text-slate-400 hover:text-white"
						title="Reset Sandbox"
					>
						<RefreshCw className="h-3.5 w-3.5" />
					</button>
				</div>
			</div>

			{/* Metrics Dashboard */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
				<div className="rounded-xl border border-surface-800 bg-surface-950 p-3.5">
					<div className="text-[11px] text-slate-400">Mount / Unmount Cycles</div>
					<div className="text-2xl font-black text-white mt-0.5">{mountCycleCount}</div>
				</div>

				<div className="rounded-xl border border-surface-800 bg-surface-950 p-3.5">
					<div className="text-[11px] text-slate-400">Retained Window Listeners</div>
					<div className={`text-2xl font-black mt-0.5 ${activeListenersCount > 3 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
						{activeListenersCount}
					</div>
				</div>

				<div className="rounded-xl border border-surface-800 bg-surface-950 p-3.5">
					<div className="text-[11px] text-slate-400">Simulated JS Heap Size</div>
					<div className={`text-2xl font-black mt-0.5 ${simulatedHeapMb > 40 ? 'text-rose-400' : 'text-indigo-300'}`}>
						{simulatedHeapMb} MB
					</div>
				</div>
			</div>

			{/* Component Mount Controller */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
				<div className="rounded-xl border border-surface-800 bg-surface-950 p-4">
					<div className="flex items-center justify-between mb-3">
						<span className="text-xs font-bold text-white uppercase tracking-wider">
							Component Lifecycle Trigger
						</span>
						<span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isMounted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-surface-800 text-slate-500'}`}>
							{isMounted ? 'MOUNTED' : 'UNMOUNTED'}
						</span>
					</div>

					<p className="text-xs text-slate-400 mb-4 leading-relaxed">
						Repeatedly mount and unmount the component with <strong>Cleanup: MISSING</strong> to observe memory leak buildup.
					</p>

					<button
						onClick={handleMountToggle}
						className={`w-full rounded-xl py-2.5 text-xs font-bold text-white transition shadow-md ${
							isMounted
								? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20'
								: 'bg-brand-600 hover:bg-brand-500 shadow-brand-500/20'
						}`}
					>
						{isMounted ? 'Unmount Component' : 'Mount Component'}
					</button>
				</div>

				{/* Code Structure Preview */}
				<div className="rounded-xl border border-surface-800 bg-surface-950 p-3 font-mono text-xs text-slate-300">
					<div className="text-slate-500 text-[11px] mb-2 border-b border-surface-800 pb-1">
						<span>Active Code Implementation</span>
					</div>
					<pre className="overflow-x-auto text-brand-300">
						<code>
							{hasCleanup
								? `useEffect(() => {
  const handler = () => console.log('scroll')
  window.addEventListener('scroll', handler)
  // ✅ Cleanup properly removes listener
  return () => window.removeEventListener('scroll', handler)
}, [])`
								: `useEffect(() => {
  const handler = () => console.log('scroll')
  window.addEventListener('scroll', handler)
  // ❌ Missing return cleanup! Listener remains trapped on heap forever.
}, [])`}
						</code>
					</pre>
				</div>
			</div>
		</div>
	)
}
