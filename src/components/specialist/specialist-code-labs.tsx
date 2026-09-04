import { useState } from 'react'
import { useProgressStore } from '../../store/use-progress-store'
import { Layers, CheckCircle, Eye, FileText, Code2, Users } from 'lucide-react'

export function SpecialistCodeLabs () {
	const { markLabComplete, completedLabs } = useProgressStore()

	// Lab 1: Architecture Decision Matrix
	const [showSolution1, setShowSolution1] = useState(false)
	const isLab1Completed = completedLabs['sp-lab-decision-matrix']

	// Lab 2: Code Critique Scanner
	const [showSolution2, setShowSolution2] = useState(false)
	const isLab2Completed = completedLabs['sp-lab-critique-scanner']

	// Lab 3: ADR Validator
	const [showSolution3, setShowSolution3] = useState(false)
	const isLab3Completed = completedLabs['sp-lab-adr-validator']

	// Lab 4: Jargon Translator
	const [showSolution4, setShowSolution4] = useState(false)
	const isLab4Completed = completedLabs['sp-lab-jargon-translator']

	return (
		<div className="flex flex-col gap-6">
			{/* Lab 1: Architectural Trade-off Decision Framework */}
			<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-3 mb-4">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400">
							<Layers className="h-4 w-4" />
						</div>
						<div>
							<h4 className="text-sm font-bold text-white">
								Lab 1: Quantitative Architecture Decision Engine (Rendering & State)
							</h4>
							<p className="text-xs text-slate-400">
								Programmatically score rendering strategies based on SEO, catalog size, LCP targets, and server cost budgets.
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
							<span>Decision Logic</span>
							<button
								onClick={() => setShowSolution1(!showSolution1)}
								className="flex items-center gap-1 text-brand-400 hover:text-brand-300"
							>
								<Eye className="h-3 w-3" />
								<span>{showSolution1 ? 'Hide' : 'View Specialist Solution'}</span>
							</button>
						</div>
						<pre className="overflow-x-auto text-brand-200">
							<code>
								{showSolution1
									? `export function evaluateArchitecture(req: {
  isSeoCritical: boolean
  catalogSize: number
  budget: 'low' | 'high'
}): { recommended: string; rationale: string } {
  if (!req.isSeoCritical) {
    return {
      recommended: 'CSR',
      rationale: 'Private app without SEO requirements; saves compute by hosting static SPA on CDN.'
    }
  }

  if (req.catalogSize > 50000) {
    return {
      recommended: 'ISR with On-Demand Tags',
      rationale: 'Large catalog prevents static builds O(N); ISR provides sub-80ms edge TTFB with background revalidation.'
    }
  }

  return {
    recommended: 'SSG',
    rationale: 'Small catalog allows build-time HTML generation for maximum edge cache hit ratio.'
  }
}`
									: `// Click "View Specialist Solution" to inspect decision scoring logic`}
							</code>
						</pre>
					</div>

					<div className="flex flex-col justify-between rounded-xl border border-surface-800 bg-surface-950 p-4">
						<div>
							<span className="text-xs font-bold text-brand-400 uppercase tracking-wider block mb-1">
								Architectural Checklist
							</span>
							<div className="space-y-1 text-xs text-slate-300 font-mono mt-2">
								<div className="text-emerald-400">✓ Evaluates SEO vs Server Compute constraints</div>
								<div className="text-emerald-400">✓ Recommends on-demand ISR for large SKU catalogs</div>
								<div className="text-emerald-400">✓ Generates structured technical rationales</div>
							</div>
						</div>

						<button
							onClick={() => markLabComplete('sp-lab-decision-matrix')}
							className="w-full mt-4 rounded-xl bg-brand-600 hover:bg-brand-500 py-2.5 text-xs font-bold text-white transition shadow-md shadow-brand-500/20"
						>
							{isLab1Completed ? 'Decision Framework Verified' : 'Verify Decision Framework'}
						</button>
					</div>
				</div>
			</div>

			{/* Lab 2: Code Review Anti-pattern Scanner */}
			<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-3 mb-4">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
							<Code2 className="h-4 w-4" />
						</div>
						<div>
							<h4 className="text-sm font-bold text-white">
								Lab 2: Automated Anti-Pattern & Review Scanner
							</h4>
							<p className="text-xs text-slate-400">
								Inspect pull requests for unmemoized Context values, missing AbortControllers, and memory leaks.
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
							<span>Anti-Pattern Scanner</span>
							<button
								onClick={() => setShowSolution2(!showSolution2)}
								className="flex items-center gap-1 text-purple-400 hover:text-purple-300"
							>
								<Eye className="h-3 w-3" />
								<span>{showSolution2 ? 'Hide' : 'View Specialist Solution'}</span>
							</button>
						</div>
						<pre className="overflow-x-auto text-purple-200">
							<code>
								{showSolution2
									? `export function scanPullRequest(code: string) {
  const findings: { severity: string; issue: string; fix: string }[] = []

  if (code.includes('.Provider') && code.includes('value={{') && !code.includes('useMemo')) {
    findings.push({
      severity: '[Major: Re-render Cascade]',
      issue: 'Unmemoized object literal in Provider value forces all consumers to re-render.',
      fix: 'Wrap Provider value in useMemo(() => ({ ... }), [deps]).'
    })
  }

  if (code.includes('useEffect') && code.includes('fetch(') && !code.includes('AbortController')) {
    findings.push({
      severity: '[Blocker: Race Condition]',
      issue: 'Async fetch in useEffect missing AbortController cancellation.',
      fix: 'Attach const ctrl = new AbortController() and return () => ctrl.abort().'
    })
  }

  return findings
}`
									: `// Click "View Specialist Solution" to inspect review scanner`}
							</code>
						</pre>
					</div>

					<div className="flex flex-col justify-between rounded-xl border border-surface-800 bg-surface-950 p-4">
						<div>
							<span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1">
								Review Criteria
							</span>
							<div className="space-y-1 text-xs text-slate-300 font-mono mt-2">
								<div className="text-emerald-400">✓ Detects Context Provider reference changes</div>
								<div className="text-emerald-400">✓ Catches async race conditions without cleanup</div>
								<div className="text-emerald-400">✓ Formats constructive severity tags and fixes</div>
							</div>
						</div>

						<button
							onClick={() => markLabComplete('sp-lab-critique-scanner')}
							className="w-full mt-4 rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 text-xs font-bold text-white transition shadow-md shadow-purple-500/20"
						>
							{isLab2Completed ? 'Critique Scanner Verified' : 'Verify Code Critique Scanner'}
						</button>
					</div>
				</div>
			</div>

			{/* Lab 3: ADR Validator & Completeness Checker */}
			<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-3 mb-4">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
							<FileText className="h-4 w-4" />
						</div>
						<div>
							<h4 className="text-sm font-bold text-white">
								Lab 3: Architecture Decision Record (ADR) Structural Validator
							</h4>
							<p className="text-xs text-slate-400">
								Verify that architectural RFCs and ADRs document negative trade-offs and rollback criteria before approval.
							</p>
						</div>
					</div>
					{isLab3Completed && (
						<span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
							<CheckCircle className="h-3.5 w-3.5" />
							<span>Verified</span>
						</span>
					)}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="rounded-xl border border-surface-800 bg-surface-950 p-3 font-mono text-xs text-slate-300">
						<div className="flex justify-between items-center text-slate-500 text-[11px] mb-2 border-b border-surface-800 pb-1">
							<span>ADR Validator</span>
							<button
								onClick={() => setShowSolution3(!showSolution3)}
								className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
							>
								<Eye className="h-3 w-3" />
								<span>{showSolution3 ? 'Hide' : 'View Specialist Solution'}</span>
							</button>
						</div>
						<pre className="overflow-x-auto text-indigo-200">
							<code>
								{showSolution3
									? `export function validateADRDoc(doc: {
  title: string
  context: string
  decision: string
  tradeoffs: string[]
}) {
  const errors: string[] = []
  if (!doc.title) errors.push('Title missing')
  if (!doc.context) errors.push('Context missing')
  if (!doc.decision) errors.push('Decision missing')
  if (!doc.tradeoffs || doc.tradeoffs.length === 0) {
    errors.push('Specialist requirement: Must document at least one negative consequence or trade-off')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}`
									: `// Click "View Specialist Solution" to inspect ADR validator`}
							</code>
						</pre>
					</div>

					<div className="flex flex-col justify-between rounded-xl border border-surface-800 bg-surface-950 p-4">
						<div>
							<span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
								Documentation Standards
							</span>
							<div className="space-y-1 text-xs text-slate-300 font-mono mt-2">
								<div className="text-emerald-400">✓ Context & problem statement verified</div>
								<div className="text-emerald-400">✓ Enforces negative trade-offs documentation</div>
								<div className="text-emerald-400">✓ Validates decision outcome and rollback path</div>
							</div>
						</div>

						<button
							onClick={() => markLabComplete('sp-lab-adr-validator')}
							className="w-full mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-bold text-white transition shadow-md shadow-indigo-500/20"
						>
							{isLab3Completed ? 'ADR Validator Verified' : 'Verify ADR Validator'}
						</button>
					</div>
				</div>
			</div>

			{/* Lab 4: Jargon Translator & Stakeholder Value Pitcher */}
			<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-3 mb-4">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/20 text-pink-400">
							<Users className="h-4 w-4" />
						</div>
						<div>
							<h4 className="text-sm font-bold text-white">
								Lab 4: Non-Technical Jargon Translation & Stakeholder Pitch Engine
							</h4>
							<p className="text-xs text-slate-400">
								Translate frontend engineering jargon into business value metrics (conversion, mobile latency, sprint velocity).
							</p>
						</div>
					</div>
					{isLab4Completed && (
						<span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
							<CheckCircle className="h-3.5 w-3.5" />
							<span>Verified</span>
						</span>
					)}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="rounded-xl border border-surface-800 bg-surface-950 p-3 font-mono text-xs text-slate-300">
						<div className="flex justify-between items-center text-slate-500 text-[11px] mb-2 border-b border-surface-800 pb-1">
							<span>Jargon Translator</span>
							<button
								onClick={() => setShowSolution4(!showSolution4)}
								className="flex items-center gap-1 text-pink-400 hover:text-pink-300"
							>
								<Eye className="h-3 w-3" />
								<span>{showSolution4 ? 'Hide' : 'View Specialist Solution'}</span>
							</button>
						</div>
						<pre className="overflow-x-auto text-pink-200">
							<code>
								{showSolution4
									? `export function pitchPerformanceFixToPM(technicalMetric: 'INP' | 'LCP') {
  if (technicalMetric === 'INP') {
    return {
      analogy: 'Like elevator button light delay.',
      businessImpact: 'Reducing button tap latency below 100ms prevents rage-clicks and increases mobile checkout conversion by 6%.'
    }
  }
  return {
    analogy: 'Like store doors opening immediately upon arrival.',
    businessImpact: 'Delivering the main hero image in under 1.2s reduces initial bounce rates by 14%.'
  }
}`
									: `// Click "View Specialist Solution" to inspect pitch translation logic`}
							</code>
						</pre>
					</div>

					<div className="flex flex-col justify-between rounded-xl border border-surface-800 bg-surface-950 p-4">
						<div>
							<span className="text-xs font-bold text-pink-400 uppercase tracking-wider block mb-1">
								Communication Criteria
							</span>
							<div className="space-y-1 text-xs text-slate-300 font-mono mt-2">
								<div className="text-emerald-400">✓ Employs relatable everyday analogies</div>
								<div className="text-emerald-400">✓ Connects performance to user conversion metrics</div>
								<div className="text-emerald-400">✓ Avoids alienating compiler/AST terminology</div>
							</div>
						</div>

						<button
							onClick={() => markLabComplete('sp-lab-jargon-translator')}
							className="w-full mt-4 rounded-xl bg-pink-600 hover:bg-pink-500 py-2.5 text-xs font-bold text-white transition shadow-md shadow-pink-500/20"
						>
							{isLab4Completed ? 'Communication Engine Verified' : 'Verify Communication Engine'}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
