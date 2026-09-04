import { useState } from 'react'
import {
	FileEdit,
	CheckCircle,
	AlertTriangle,
	Copy,
	Check,
	BookOpen,
} from 'lucide-react'

interface ADRTemplatePreset {
	id: string
	name: string
	title: string
	status: 'Draft' | 'Accepted' | 'Under Review'
	context: string
	decisionDrivers: string[]
	options: { name: string; pros: string; cons: string }[]
	decision: string
	consequences: { positive: string[]; negative: string[] }
}

const ADR_PRESETS: ADRTemplatePreset[] = [
	{
		id: 'preset-tanstack',
		name: 'ADR: Server State with TanStack Query',
		title: 'ADR-014: Adoption of TanStack Query for Server State Management',
		status: 'Accepted',
		context:
			'Our application currently synchronizes 40+ REST endpoints into global Redux slices. Developers spend 35% of sprint velocity writing reducers, action creators, and manual loading flags. Numerous production bugs stem from async race conditions and stale cache invalidation.',
		decisionDrivers: [
			'Eliminate manual loading/error/success boilerplate across 40+ endpoints',
			'Provide automatic request deduplication and background cache revalidation',
			'Support optimistic UI updates with automatic error rollback',
			'Keep client JavaScript bundle under 15kB for state libraries',
		],
		options: [
			{
				name: 'Redux Toolkit + RTK Query',
				pros: 'Keeps state within Redux ecosystem, leverages existing Redux DevTools',
				cons: 'Adds 28kB to bundle; tight coupling to Redux store Provider architecture',
			},
			{
				name: 'TanStack Query + Zustand for UI',
				pros: 'Dedicated async server cache engine; 12kB bundle; decoupled from UI state; built-in window focus revalidation',
				cons: 'Team must establish queryKey conventions and cache invalidation rules',
			},
			{
				name: 'Custom fetch hooks with SWR',
				pros: 'Lightweight (4kB)',
				cons: 'Lacks advanced mutation rollbacks, query cancellation, and offline persistence plugins',
			},
		],
		decision:
			'Adopt TanStack Query (v5) for all asynchronous server state, paired with a lightweight Zustand store for client-only UI state (drawers, modals, toast notifications).',
		consequences: {
			positive: [
				'Eliminates ~65% of state management boilerplate across components',
				'Automatic query deduplication prevents redundant network calls during rapid navigation',
				'Built-in optimistic mutation rollbacks improve perceived user latency',
			],
			negative: [
				'Requires team training on query key hierarchy and manual invalidation triggers',
				'Adds 12kB gzipped to the client bundle',
			],
		},
	},
	{
		id: 'preset-strangler',
		name: 'ADR: Strangler Fig Checkout Migration',
		title: 'ADR-022: Incremental Strangler Fig Migration of Legacy Checkout',
		status: 'Accepted',
		context:
			'Our legacy 6-year-old jQuery/Rails checkout monolith is brittle and causes frequent payment drop-offs. A complete big-bang rewrite poses high revenue risk during Q4 peak season.',
		decisionDrivers: [
			'Zero downtime during migration',
			'P95 checkout step transitions under 100ms',
			'Instant feature-flag rollback capability if payment conversion dips by > 0.5%',
		],
		options: [
			{
				name: 'Big-Bang Full Rewrite',
				pros: 'Clean slate architecture with zero legacy compatibility code',
				cons: 'High business risk; 6-month delay without incremental value delivery',
			},
			{
				name: 'Incremental Strangler Fig Pattern with Feature Flags',
				pros: 'Deploys step-by-step behind edge routing proxy; continuous value delivery; instant rollback',
				cons: 'Requires session cookie bridge and shared cart synchronization layer',
			},
		],
		decision:
			'Adopt the Incremental Strangler Fig Pattern: Route checkout steps individually to a Next.js micro-frontend using Cloudflare Workers edge proxy routing with launchdarkly feature flags.',
		consequences: {
			positive: [
				'Allows testing new React payment flows on 5% of beta traffic with zero downtime',
				'Decreases P95 checkout latency from 1.8s to 450ms',
			],
			negative: [
				'Requires maintaining a temporary session bridge between legacy backend and new React components for 60 days',
			],
		},
	},
]

export function AdrRfcStudio () {
	const [activePreset, setActivePreset] = useState<ADRTemplatePreset>(ADR_PRESETS[0])
	const [title, setTitle] = useState(activePreset.title)
	const [status, setStatus] = useState(activePreset.status)
	const [context, setContext] = useState(activePreset.context)
	const [decision, setDecision] = useState(activePreset.decision)
	const [positiveConsequences, setPositiveConsequences] = useState(
		activePreset.consequences.positive.join('\n'),
	)
	const [negativeConsequences, setNegativeConsequences] = useState(
		activePreset.consequences.negative.join('\n'),
	)
	const [copied, setCopied] = useState(false)

	const handleLoadPreset = (preset: ADRTemplatePreset) => {
		setActivePreset(preset)
		setTitle(preset.title)
		setStatus(preset.status)
		setContext(preset.context)
		setDecision(preset.decision)
		setPositiveConsequences(preset.consequences.positive.join('\n'))
		setNegativeConsequences(preset.consequences.negative.join('\n'))
	}

	const hasNegativeConsequences = negativeConsequences.trim().length > 10
	const isAdrComplete = title.trim() && context.trim() && decision.trim() && hasNegativeConsequences

	const generatedMarkdown = `# ${title}

## Status
${status} (Date: ${new Date().toISOString().split('T')[0]})

## Context & Problem Statement
${context}

## Decision Drivers
${activePreset.decisionDrivers.map((d) => `- ${d}`).join('\n')}

## Considered Options
${activePreset.options.map((o) => `### Option: ${o.name}\n- **Pros**: ${o.pros}\n- **Cons**: ${o.cons}`).join('\n\n')}

## Decision Outcome
${decision}

## Consequences & Trade-offs
### Positive Impact:
${positiveConsequences.split('\n').filter(Boolean).map((p) => `- ${p}`).join('\n')}

### Acknowledged Negative Consequences & Trade-offs:
${negativeConsequences.split('\n').filter(Boolean).map((n) => `- ${n}`).join('\n')}
`

	const handleCopy = () => {
		navigator.clipboard.writeText(generatedMarkdown)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className="flex flex-col gap-6 rounded-2xl border border-surface-800 bg-surface-900/60 p-6 backdrop-blur-sm">
			{/* Top Header */}
			<div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-800 pb-4">
				<div>
					<div className="flex items-center gap-2">
						<span className="rounded bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-bold text-indigo-300 border border-indigo-500/30">
							Architecture Documentation
						</span>
						<span className="text-xs text-slate-400">RFC & ADR Authoring Studio</span>
					</div>
					<h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
						<FileEdit className="h-5 w-5 text-indigo-400" />
						<span>Interactive ADR & RFC Builder with Completeness Validator</span>
					</h3>
				</div>

				{/* Presets */}
				<div className="flex gap-2">
					{ADR_PRESETS.map((preset) => (
						<button
							key={preset.id}
							onClick={() => handleLoadPreset(preset)}
							className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
								activePreset.id === preset.id
									? 'bg-indigo-600 text-white shadow-md'
									: 'bg-surface-950 text-slate-400 hover:text-white border border-surface-800'
							}`}
						>
							{preset.name.split(': ')[1]}
						</button>
					))}
				</div>
			</div>

			{/* Form Inputs Grid vs Live Preview */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
				{/* Left: Input Editor */}
				<div className="lg:col-span-6 flex flex-col gap-3 rounded-xl border border-surface-800 bg-surface-950 p-4">
					<div>
						<label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
							ADR Title & Identifier
						</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full rounded-lg border border-surface-800 bg-surface-900 px-3 py-1.5 text-xs font-semibold text-white focus:border-indigo-500 focus:outline-none"
						/>
					</div>

					<div>
						<label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
							Context & Problem Statement
						</label>
						<textarea
							rows={3}
							value={context}
							onChange={(e) => setContext(e.target.value)}
							className="w-full rounded-lg border border-surface-800 bg-surface-900 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
						/>
					</div>

					<div>
						<label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
							Decision Outcome
						</label>
						<textarea
							rows={2}
							value={decision}
							onChange={(e) => setDecision(e.target.value)}
							className="w-full rounded-lg border border-surface-800 bg-surface-900 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none resize-none"
						/>
					</div>

					<div>
						<label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
							Positive Consequences (One per line)
						</label>
						<textarea
							rows={2}
							value={positiveConsequences}
							onChange={(e) => setPositiveConsequences(e.target.value)}
							className="w-full rounded-lg border border-surface-800 bg-surface-900 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none resize-none"
						/>
					</div>

					<div>
						<div className="flex items-center justify-between mb-1">
							<label className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
								Acknowledged Negative Consequences & Trade-offs (Mandatory for Specialists)
							</label>
							{!hasNegativeConsequences && (
								<span className="flex items-center gap-1 text-[10px] text-amber-400">
									<AlertTriangle className="h-3 w-3" /> Required
								</span>
							)}
						</div>
						<textarea
							rows={2}
							value={negativeConsequences}
							onChange={(e) => setNegativeConsequences(e.target.value)}
							placeholder="Document bundle overhead, migration costs, team learning curve..."
							className="w-full rounded-lg border border-surface-800 bg-surface-900 p-2 text-xs text-white focus:border-rose-500 focus:outline-none resize-none"
						/>
					</div>
				</div>

				{/* Right: Markdown Live Preview */}
				<div className="lg:col-span-6 flex flex-col justify-between rounded-xl border border-surface-800 bg-surface-950 p-4">
					<div>
						<div className="flex items-center justify-between border-b border-surface-800 pb-2 mb-3">
							<span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
								<BookOpen className="h-3.5 w-3.5 text-indigo-400" />
								<span>Live Markdown Output</span>
							</span>

							<button
								onClick={handleCopy}
								className="flex items-center gap-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 px-3 py-1 text-xs font-semibold text-white transition"
							>
								{copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
								<span>{copied ? 'Copied' : 'Copy ADR'}</span>
							</button>
						</div>

						<pre className="text-xs font-mono text-slate-300 bg-surface-900 p-3 rounded-lg overflow-y-auto max-h-[340px] whitespace-pre-wrap leading-relaxed border border-surface-800">
							{generatedMarkdown}
						</pre>
					</div>

					{/* Validation Badge */}
					<div className="mt-4 pt-3 border-t border-surface-800 flex items-center justify-between text-xs">
						<div className="flex items-center gap-2">
							{isAdrComplete ? (
								<span className="flex items-center gap-1.5 text-emerald-400 font-bold">
									<CheckCircle className="h-4 w-4" />
									<span>Specialist ADR Quality: 100% Complete & Verified</span>
								</span>
							) : (
								<span className="flex items-center gap-1.5 text-amber-400 font-semibold">
									<AlertTriangle className="h-4 w-4" />
									<span>Incomplete: Must document negative consequences/trade-offs</span>
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
