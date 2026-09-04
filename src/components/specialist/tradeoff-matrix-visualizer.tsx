import { useState } from 'react'
import {
	Layers,
	CheckCircle,
	XCircle,
	AlertTriangle,
	Sparkles,
	FileText,
	Zap,
	DollarSign,
	Search,
	Copy,
	Check,
} from 'lucide-react'

interface ArchitectureScenario {
	id: string
	name: string
	description: string
	options: {
		name: string
		ttfbScore: number // 1-5
		lcpScore: number // 1-5
		devVelocity: number // 1-5
		serverCost: number // 1-5 (5 = lowest cost, 1 = highest cost)
		seoScore: number // 1-5
		pros: string[]
		cons: string[]
		bestFor: string
		verdict: string
	}[]
}

const SCENARIOS: ArchitectureScenario[] = [
	{
		id: 'rendering',
		name: 'Rendering Strategy (Global Catalog • 200k SKUs)',
		description:
			'Evaluate rendering paradigms for an e-commerce catalog requiring global sub-100ms TTFB, SEO indexing, and real-time inventory updates.',
		options: [
			{
				name: 'Client-Side Rendering (CSR)',
				ttfbScore: 5,
				lcpScore: 2,
				devVelocity: 5,
				serverCost: 5,
				seoScore: 2,
				pros: ['Zero server infrastructure', 'Fast initial HTML byte response', 'Simple deployment on static CDNs'],
				cons: ['Poor SEO indexing on weaker crawlers', 'Slow LCP on low-tier mobile devices', 'High client CPU execution'],
				bestFor: 'Internal authenticated SaaS portals & dashboards',
				verdict: 'REJECTED: Fails e-commerce SEO and mobile LCP thresholds.',
			},
			{
				name: 'Server-Side Rendering (SSR)',
				ttfbScore: 2,
				lcpScore: 4,
				devVelocity: 4,
				serverCost: 2,
				seoScore: 5,
				pros: ['Guaranteed 100% SEO crawlers compatibility', 'Fresh dynamic data on every request', 'Fast FCP'],
				cons: ['High TTFB under traffic spikes', 'Heavy server compute costs', 'Single point of infrastructure failure'],
				bestFor: 'Personalized checkout, user accounts, and real-time feeds',
				verdict: 'CONDITIONAL: Excessive server costs for 200k static catalog pages.',
			},
			{
				name: 'Incremental Static Regeneration (ISR)',
				ttfbScore: 5,
				lcpScore: 5,
				devVelocity: 4,
				serverCost: 4,
				seoScore: 5,
				pros: ['Sub-50ms TTFB from global Edge CDN', 'Fastest LCP', 'Background revalidation on webhook', 'Zero build-time scaling bottlenecks'],
				cons: ['Eventual consistency window before cache purge', 'Requires edge cache invalidation strategy'],
				bestFor: 'Large e-commerce catalogs, marketing blogs, documentation',
				verdict: 'RECOMMENDED: Optimal balance of edge speed, SEO, and inventory sync.',
			},
			{
				name: 'React Server Components (RSC)',
				ttfbScore: 4,
				lcpScore: 5,
				devVelocity: 3,
				serverCost: 3,
				seoScore: 5,
				pros: ['Zero client JS bundle for server components', 'Progressive streaming HTML chunks', 'Direct backend database access'],
				cons: ['Mental model shift for component boundaries', 'Tooling maturity overhead'],
				bestFor: 'Modern full-stack Next.js/Remix applications',
				verdict: 'ALTERNATIVE: Ideal for Greenfield Next.js 15 apps.',
			},
		],
	},
	{
		id: 'state',
		name: 'State Management Architecture (High-Scale Dashboard)',
		description:
			'Partition state across Server Cache, Global UI, URL search parameters, and Local component state.',
		options: [
			{
				name: 'All in Global Redux Store',
				ttfbScore: 4,
				lcpScore: 3,
				devVelocity: 2,
				serverCost: 5,
				seoScore: 4,
				pros: ['Single centralized state tree', 'Time-travel debugging'],
				cons: ['Heavy boilerplate (actions, reducers, thunks)', 'Manual cache invalidation and race condition bugs', 'Unnecessary global re-renders'],
				bestFor: 'Legacy apps with deeply coupled client-only data pipelines',
				verdict: 'REJECTED: Over-engineered; manual async cache replication is an anti-pattern.',
			},
			{
				name: 'TanStack Query + Zustand UI Slice',
				ttfbScore: 5,
				lcpScore: 5,
				devVelocity: 5,
				serverCost: 5,
				seoScore: 4,
				pros: ['Automatic async deduplication, caching, and garbage collection', 'Minimal Zustand boilerplate for modals/drawers', 'Optimistic UI rollback'],
				cons: ['Requires team alignment on query key naming conventions'],
				bestFor: 'Modern high-performance React applications',
				verdict: 'RECOMMENDED: Eliminates 70% state boilerplate with clean separation of concerns.',
			},
			{
				name: 'React Context API Only',
				ttfbScore: 4,
				lcpScore: 2,
				devVelocity: 4,
				serverCost: 5,
				seoScore: 4,
				pros: ['Built into React with zero extra bundle weight'],
				cons: ['Cascading re-renders on unmemoized consumers', 'No built-in async caching or deduplication', 'Context hell nesting'],
				bestFor: 'Static low-frequency theme/auth metadata',
				verdict: 'CONDITIONAL: Good for themes/auth; unacceptable for dynamic server data.',
			},
		],
	},
	{
		id: 'styling',
		name: 'Styling & CSS Architecture',
		description: 'Evaluate CSS paradigms for team velocity, build times, runtime performance, and design tokens.',
		options: [
			{
				name: 'Tailwind CSS (Utility-First)',
				ttfbScore: 5,
				lcpScore: 5,
				devVelocity: 5,
				serverCost: 5,
				seoScore: 5,
				pros: ['Zero runtime JS overhead', 'Tiny purged CSS bundle (< 15kB)', 'Eliminates naming debates', 'Instant responsive modifiers'],
				cons: ['HTML class string clutter', 'Requires team onboarding'],
				bestFor: 'Rapid product development and scalable design systems',
				verdict: 'RECOMMENDED: Industry standard for web performance and velocity.',
			},
			{
				name: 'Runtime CSS-in-JS (styled-components)',
				ttfbScore: 3,
				lcpScore: 2,
				devVelocity: 4,
				serverCost: 5,
				seoScore: 4,
				pros: ['Component-scoped styles', 'Dynamic props interpolation'],
				cons: ['Runtime CSS parsing blocks JS main thread (high INP)', 'Increases client bundle by 20-30kB', 'SSR hydration style flickering'],
				bestFor: 'Legacy design systems requiring runtime theme calculations',
				verdict: 'REJECTED: Runtime performance penalty degrades Core Web Vitals (INP).',
			},
			{
				name: 'CSS Modules + PostCSS',
				ttfbScore: 5,
				lcpScore: 4,
				devVelocity: 3,
				serverCost: 5,
				seoScore: 5,
				pros: ['Zero runtime JS cost', 'Native CSS syntax with automatic local scoping'],
				cons: ['Context switching between .tsx and .module.css files', 'Boilerplate class name imports'],
				bestFor: 'Traditional teams preferring standard CSS files',
				verdict: 'VIABLE ALTERNATIVE: Solid zero-runtime baseline.',
			},
		],
	},
]

export function TradeoffMatrixVisualizer () {
	const [activeScenarioId, setActiveScenarioId] = useState('rendering')
	const [copiedAdr, setCopiedAdr] = useState(false)

	const currentScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0]

	const generateADRMarkdown = () => {
		const recommended = currentScenario.options.find((o) => o.verdict.includes('RECOMMENDED')) || currentScenario.options[0]
		return `# ADR-001: Architecture Decision for ${currentScenario.name}

## Status
Accepted

## Context & Problem Statement
${currentScenario.description}

## Considered Options
${currentScenario.options.map((o) => `- **${o.name}**: ${o.bestFor} (${o.verdict})`).join('\n')}

## Decision Outcome
Adopt **${recommended.name}**.

### Justification:
${recommended.pros.map((p) => `- ${p}`).join('\n')}

## Acknowledged Trade-offs & Consequences
${recommended.cons.map((c) => `- ${c}`).join('\n')}
`
	}

	const handleCopyADR = () => {
		navigator.clipboard.writeText(generateADRMarkdown())
		setCopiedAdr(true)
		setTimeout(() => setCopiedAdr(false), 2000)
	}

	return (
		<div className="flex flex-col gap-6 rounded-2xl border border-surface-800 bg-surface-900/60 p-6 backdrop-blur-sm">
			{/* Header */}
			<div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-800 pb-4">
				<div>
					<div className="flex items-center gap-2">
						<span className="rounded bg-brand-500/20 px-2.5 py-0.5 text-[11px] font-bold text-brand-300 border border-brand-500/30">
							Architectural Tool
						</span>
						<span className="text-xs text-slate-400">Quantitative Trade-off Analyzer</span>
					</div>
					<h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
						<Layers className="h-5 w-5 text-brand-400" />
						<span>Trade-off Decision Matrix & ADR Generator</span>
					</h3>
				</div>

				{/* Scenario Selector */}
				<div className="flex flex-wrap gap-1.5 rounded-xl bg-surface-950 p-1 border border-surface-800">
					{SCENARIOS.map((scenario) => (
						<button
							key={scenario.id}
							onClick={() => setActiveScenarioId(scenario.id)}
							className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
								activeScenarioId === scenario.id
									? 'bg-brand-600 text-white shadow-md'
									: 'text-slate-400 hover:text-white'
							}`}
						>
							{scenario.name.split(' (')[0]}
						</button>
					))}
				</div>
			</div>

			{/* Description */}
			<p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-surface-950/80 p-3.5 rounded-xl border border-surface-800">
				<strong>Scenario Context:</strong> {currentScenario.description}
			</p>

			{/* Multi-Criteria Matrix Comparison Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{currentScenario.options.map((option, idx) => {
					const isRecommended = option.verdict.includes('RECOMMENDED')
					const isRejected = option.verdict.includes('REJECTED')

					return (
						<div
							key={idx}
							className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
								isRecommended
									? 'border-emerald-500/50 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
									: isRejected
										? 'border-rose-500/30 bg-rose-950/10 opacity-80'
										: 'border-surface-800 bg-surface-950/60'
							}`}
						>
							<div>
								{/* Option Header & Badge */}
								<div className="flex items-center justify-between gap-2 mb-2">
									<h4 className="font-bold text-sm text-white">{option.name}</h4>
									{isRecommended ? (
										<span className="flex items-center gap-1 text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
											<CheckCircle className="h-3 w-3" /> Pick
										</span>
									) : isRejected ? (
										<span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full">
											<XCircle className="h-3 w-3" /> Drop
										</span>
									) : (
										<span className="flex items-center gap-1 text-[10px] font-medium bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
											<AlertTriangle className="h-3 w-3" /> Alt
										</span>
									)}
								</div>

								{/* Metric Rating Bars */}
								<div className="space-y-1.5 my-3 bg-surface-900/80 p-2.5 rounded-lg border border-surface-800 text-[11px]">
									<div className="flex items-center justify-between text-slate-300">
										<span className="flex items-center gap-1">
											<Zap className="h-3 w-3 text-amber-400" /> TTFB Speed:
										</span>
										<div className="flex gap-0.5">
											{[1, 2, 3, 4, 5].map((s) => (
												<span
													key={s}
													className={`h-1.5 w-3 rounded-full ${s <= option.ttfbScore ? 'bg-amber-400' : 'bg-surface-700'}`}
												/>
											))}
										</div>
									</div>

									<div className="flex items-center justify-between text-slate-300">
										<span className="flex items-center gap-1">
											<Sparkles className="h-3 w-3 text-brand-400" /> LCP Speed:
										</span>
										<div className="flex gap-0.5">
											{[1, 2, 3, 4, 5].map((s) => (
												<span
													key={s}
													className={`h-1.5 w-3 rounded-full ${s <= option.lcpScore ? 'bg-brand-400' : 'bg-surface-700'}`}
												/>
											))}
										</div>
									</div>

									<div className="flex items-center justify-between text-slate-300">
										<span className="flex items-center gap-1">
											<Search className="h-3 w-3 text-emerald-400" /> SEO Indexing:
										</span>
										<div className="flex gap-0.5">
											{[1, 2, 3, 4, 5].map((s) => (
												<span
													key={s}
													className={`h-1.5 w-3 rounded-full ${s <= option.seoScore ? 'bg-emerald-400' : 'bg-surface-700'}`}
												/>
											))}
										</div>
									</div>

									<div className="flex items-center justify-between text-slate-300">
										<span className="flex items-center gap-1">
											<DollarSign className="h-3 w-3 text-green-400" /> Cost Efficiency:
										</span>
										<div className="flex gap-0.5">
											{[1, 2, 3, 4, 5].map((s) => (
												<span
													key={s}
													className={`h-1.5 w-3 rounded-full ${s <= option.serverCost ? 'bg-green-400' : 'bg-surface-700'}`}
												/>
											))}
										</div>
									</div>
								</div>

								{/* Pros */}
								<div className="mt-2">
									<strong className="text-[11px] uppercase tracking-wider text-emerald-400">Pros:</strong>
									<ul className="text-xs text-slate-300 space-y-1 mt-1">
										{option.pros.map((p, i) => (
											<li key={i} className="flex items-start gap-1.5">
												<span className="text-emerald-400 font-bold">+</span>
												<span>{p}</span>
											</li>
										))}
									</ul>
								</div>

								{/* Cons */}
								<div className="mt-2.5">
									<strong className="text-[11px] uppercase tracking-wider text-rose-400">Trade-offs / Cons:</strong>
									<ul className="text-xs text-slate-400 space-y-1 mt-1">
										{option.cons.map((c, i) => (
											<li key={i} className="flex items-start gap-1.5">
												<span className="text-rose-400 font-bold">-</span>
												<span>{c}</span>
											</li>
										))}
									</ul>
								</div>
							</div>

							{/* Verdict footer */}
							<div className="mt-4 pt-2.5 border-t border-surface-800 text-[11px]">
								<p className={`font-semibold ${isRecommended ? 'text-emerald-300' : isRejected ? 'text-rose-300' : 'text-amber-300'}`}>
									{option.verdict}
								</p>
							</div>
						</div>
					)
				})}
			</div>

			{/* Auto-Generated ADR Section */}
			<div className="rounded-xl border border-brand-500/30 bg-surface-950 p-4">
				<div className="flex items-center justify-between mb-3 border-b border-surface-800 pb-2.5">
					<div className="flex items-center gap-2">
						<FileText className="h-4 w-4 text-brand-400" />
						<span className="font-bold text-xs uppercase tracking-wider text-slate-200">
							Live Generated Architecture Decision Record (ADR-001)
						</span>
					</div>
					<button
						onClick={handleCopyADR}
						className="flex items-center gap-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 px-3 py-1 text-xs font-semibold text-white transition"
					>
						{copiedAdr ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
						<span>{copiedAdr ? 'Copied to Clipboard!' : 'Copy Markdown'}</span>
					</button>
				</div>

				<pre className="text-xs font-mono text-slate-300 bg-surface-900 p-3.5 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed">
					{generateADRMarkdown()}
				</pre>
			</div>
		</div>
	)
}
