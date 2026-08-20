import { useState, useRef, memo, useCallback } from 'react'
import { Layers, Activity, RefreshCw, Zap, ShieldCheck, AlertCircle } from 'lucide-react'

// Render Counter Helper
function useRenderCount () {
	const count = useRef(0)
	count.current += 1
	return count.current
}

// Child 1: Plain Un-memoized Component
function PlainChild ({ label }: { label: string }) {
	const renderCount = useRenderCount()
	return (
		<div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 transition-all duration-300">
			<div className="flex items-center justify-between text-xs mb-1">
				<span className="font-bold text-rose-300">{label} (Un-memoized)</span>
				<span className="rounded bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 font-mono text-[11px] font-bold text-rose-300 animate-pulse">
					Renders: {renderCount}
				</span>
			</div>
			<p className="text-[11px] text-slate-400">
				Re-renders on EVERY parent state update regardless of props change.
			</p>
		</div>
	)
}

// Child 2: Memoized Component with dynamic prop check
interface MemoProps {
	label: string
	onAction: () => void
	data: { title: string }
}

const MemoizedChild = memo(function MemoizedChild ({ label, data }: MemoProps) {
	const renderCount = useRenderCount()
	return (
		<div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 transition-all duration-300">
			<div className="flex items-center justify-between text-xs mb-1">
				<span className="font-bold text-emerald-300">{label} (React.memo)</span>
				<span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-300">
					Renders: {renderCount}
				</span>
			</div>
			<p className="text-[11px] text-slate-400">
				Payload title: &quot;{data.title}&quot;. Only re-renders when prop references change.
			</p>
		</div>
	)
})

export function RerenderVisualizer () {
	const [parentCount, setParentCount] = useState(0)
	const [textInput, setTextInput] = useState('')
	const [useStableCallbacks, setUseStableCallbacks] = useState(false)

	const parentRenderCount = useRenderCount()

	// Unstable inline callback vs Stable useCallback
	const unstableCallback = () => {
		console.log('Unstable callback invoked')
	}

	const stableCallback = useCallback(() => {
		console.log('Stable callback invoked')
	}, [])

	const activeCallback = useStableCallbacks ? stableCallback : unstableCallback

	// Object references
	const unstableObject = { title: 'Static Topic' }
	const stableObject = useRef({ title: 'Static Topic' }).current
	const activeObject = useStableCallbacks ? stableObject : unstableObject

	return (
		<div className="rounded-2xl border border-surface-800 bg-surface-900/80 p-5 backdrop-blur-sm">
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-4 mb-4">
				<div>
					<h3 className="text-base font-bold text-white flex items-center gap-2">
						<Layers className="h-4 w-4 text-brand-400" />
						<span>React Re-render & Memoization Inspector</span>
					</h3>
					<p className="text-xs text-slate-400">
						Experiment with referential equality, props shallow comparison, and useCallback stabilization.
					</p>
				</div>

				<div className="flex items-center gap-2">
					<button
						onClick={() => setUseStableCallbacks(!useStableCallbacks)}
						className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
							useStableCallbacks
								? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
								: 'bg-surface-800 text-slate-300 border border-surface-700 hover:text-white'
						}`}
					>
						{useStableCallbacks ? <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> : <Zap className="h-3.5 w-3.5" />}
						<span>{useStableCallbacks ? 'useCallback: ON (Stable Props)' : 'useCallback: OFF (Inline Funcs)'}</span>
					</button>
				</div>
			</div>

			{/* Parent Component Box */}
			<div className="rounded-2xl border border-brand-500/40 bg-brand-950/20 p-4 mb-4">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-500/20 pb-3 mb-3">
					<div className="flex items-center gap-2">
						<Activity className="h-4 w-4 text-brand-400" />
						<span className="text-xs font-bold text-white uppercase tracking-wider">
							Parent Component
						</span>
					</div>
					<span className="rounded bg-brand-500/20 border border-brand-500/40 px-2.5 py-0.5 text-xs font-mono font-bold text-brand-300">
						Parent Renders: {parentRenderCount}
					</span>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label className="text-[11px] font-semibold text-slate-300 block mb-1">
							Typing in Parent State (Re-renders Parent):
						</label>
						<input
							type="text"
							value={textInput}
							onChange={(e) => setTextInput(e.target.value)}
							placeholder="Type here to trigger state updates..."
							className="w-full rounded-xl border border-surface-700 bg-surface-950 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-brand-500 focus:outline-none"
						/>
					</div>

					<div className="flex items-end">
						<button
							onClick={() => setParentCount(c => c + 1)}
							className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 py-2 px-3 text-xs font-bold text-white transition shadow-md shadow-brand-500/20"
						>
							<RefreshCw className="h-3.5 w-3.5" />
							<span>Increment Parent Counter ({parentCount})</span>
						</button>
					</div>
				</div>
			</div>

			{/* Child Components Hierarchy */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Plain Child */}
				<PlainChild label="Child Component A" />

				{/* Memoized Child */}
				<MemoizedChild
					label="Child Component B"
					onAction={activeCallback}
					data={activeObject}
				/>
			</div>

			{/* Educational Takeaway */}
			<div className="mt-4 rounded-xl border border-surface-800 bg-surface-950/60 p-3 text-xs text-slate-400 flex items-start gap-2.5">
				<AlertCircle className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
				<div>
					<strong className="text-slate-200">Key Insight for Zara AI:</strong>{' '}
					{useStableCallbacks ? (
						<span className="text-emerald-300">
							With <code>useCallback</code> and stable object references enabled, <code>React.memo</code> detects referentially identical props and skips child reconciliation completely!
						</span>
					) : (
						<span className="text-amber-300">
							Notice that even with <code>React.memo</code>, passing new inline arrow functions <code>{`{() => {}}`}</code> creates a new memory reference on every render, defeating memoization.
						</span>
					)}
				</div>
			</div>
		</div>
	)
}
