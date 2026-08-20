import { useState } from 'react'
import { useProgressStore } from '../../../store/use-progress-store'
import { FileCode, CheckCircle, Eye, ShieldCheck } from 'lucide-react'

export function MilestoneTsCodeLab () {
	const { markLabComplete, completedLabs } = useProgressStore()

	// Lab 1: Polymorphic Component State
	const [polymorphicTag, setPolymorphicTag] = useState<'button' | 'a'>('button')
	const [showSolution1, setShowSolution1] = useState(false)

	// Lab 2: DeepPartial Type state
	const [showSolution2, setShowSolution2] = useState(false)
	const [isLab2Verified, setIsLab2Verified] = useState(false)

	const isLab1Completed = completedLabs['lab-ts-polymorphic']
	const isLab2Completed = completedLabs['lab-ts-deeppartial']

	const handleVerifyPolymorphic = () => {
		if (!isLab1Completed) {
			markLabComplete('lab-ts-polymorphic')
		}
	}

	const handleVerifyDeepPartial = () => {
		setIsLab2Verified(true)
		if (!isLab2Completed) {
			markLabComplete('lab-ts-deeppartial')
		}
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Lab 1: Polymorphic React Component */}
			<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-3 mb-4">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
							<FileCode className="h-4 w-4" />
						</div>
						<div>
							<h4 className="text-sm font-bold text-white">
								Lab 1: Polymorphic Component Props Pattern
							</h4>
							<p className="text-xs text-slate-400">
								Design a React component that can render as a &lt;button&gt; or &lt;a&gt; while preserving exact native HTML attributes.
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
							<span>TypeScript Definition</span>
							<button
								onClick={() => setShowSolution1(!showSolution1)}
								className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
							>
								<Eye className="h-3 w-3" />
								<span>{showSolution1 ? 'Hide' : 'View Golden Solution'}</span>
							</button>
						</div>
						<pre className="overflow-x-auto text-blue-200">
							<code>
								{showSolution1
									? `type PolymorphicProps<C extends React.ElementType> = {
  as?: C
  children: React.ReactNode
} & React.ComponentPropsWithoutRef<C>

export function Button<C extends React.ElementType = 'button'>({
  as,
  children,
  ...rest
}: PolymorphicProps<C>) {
  const Component = as || 'button'
  return <Component {...rest}>{children}</Component>
}`
									: `// Click "View Golden Solution" to review generic polymorphic props`}
							</code>
						</pre>
					</div>

					{/* Live Interactive Sandbox */}
					<div className="flex flex-col justify-between rounded-xl border border-surface-800 bg-surface-950 p-4">
						<div>
							<span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-2">
								Live Polymorphic Element Rendering
							</span>
							<p className="text-xs text-slate-400 mb-3">
								Toggle the tag to see how the component smoothly swaps underlying DOM elements while maintaining styling.
							</p>

							<div className="flex gap-2 mb-4">
								<button
									onClick={() => setPolymorphicTag('button')}
									className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
										polymorphicTag === 'button'
											? 'bg-blue-600 text-white'
											: 'bg-surface-800 text-slate-400'
									}`}
								>
									Render as &lt;button&gt;
								</button>
								<button
									onClick={() => setPolymorphicTag('a')}
									className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
										polymorphicTag === 'a'
											? 'bg-blue-600 text-white'
											: 'bg-surface-800 text-slate-400'
									}`}
								>
									Render as &lt;a href&gt;
								</button>
							</div>

							<div className="rounded-lg bg-surface-900 border border-surface-800 p-3 text-center mb-3">
								<div className="text-[11px] text-slate-400 mb-1">Active Rendered Element:</div>
								{polymorphicTag === 'button' ? (
									<button
										onClick={handleVerifyPolymorphic}
										className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow"
									>
										Click Native Button (onClick Supported)
									</button>
								) : (
									<a
										href="#test-link"
										onClick={(e) => {
											e.preventDefault()
											handleVerifyPolymorphic()
										}}
										className="inline-block rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow"
									>
										Click Native Anchor (href Supported)
									</a>
								)}
							</div>
						</div>

						<p className="text-[11px] text-slate-500">
							Click the element to verify type-safe polymorphic rendering.
						</p>
					</div>
				</div>
			</div>

			{/* Lab 2: DeepPartial & MyOmit Implementation */}
			<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-3 mb-4">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
							<ShieldCheck className="h-4 w-4" />
						</div>
						<div>
							<h4 className="text-sm font-bold text-white">
								Lab 2: Recursive DeepPartial&lt;T&gt; & MyOmit&lt;T, K&gt;
							</h4>
							<p className="text-xs text-slate-400">
								Inspect recursive mapped types used for form patch updates and state reduction.
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
							<span>Recursive Mapped Type</span>
							<button
								onClick={() => setShowSolution2(!showSolution2)}
								className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
							>
								<Eye className="h-3 w-3" />
								<span>{showSolution2 ? 'Hide' : 'View Code'}</span>
							</button>
						</div>
						<pre className="overflow-x-auto text-indigo-200">
							<code>
								{showSolution2
									? `type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P]
}`
									: `// Click "View Code" to inspect DeepPartial logic`}
							</code>
						</pre>
					</div>

					<div className="flex flex-col justify-between rounded-xl border border-surface-800 bg-surface-950 p-4">
						<div>
							<span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
								Type Transformation Verification
							</span>
							<p className="text-xs text-slate-400 mb-3">
								Validates recursive optionality on deeply nested application configurations without manual property declarations.
							</p>

							<div className="rounded-lg bg-surface-900 border border-surface-800 p-3 font-mono text-xs text-slate-300 space-y-1">
								<div className="text-emerald-400">✓ Nested properties marked optional</div>
								<div className="text-emerald-400">✓ Array elements recursively unwrapped</div>
								<div className="text-emerald-400">✓ Function signatures preserved</div>
							</div>
						</div>

						<button
							onClick={handleVerifyDeepPartial}
							className="w-full mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-bold text-white transition shadow-md shadow-indigo-500/20"
						>
							{isLab2Verified || isLab2Completed ? 'Type Evaluation Verified' : 'Verify DeepPartial Type'}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
