import { useState } from 'react'
import {
	Code2,
	CheckCircle,
	AlertCircle,
	Send,
	Lightbulb,
	MessageSquare,
	RefreshCw,
} from 'lucide-react'

interface CodeSample {
	id: string
	title: string
	category: string
	difficulty: 'Medium' | 'Hard'
	code: string
	flaws: {
		type: string
		severity: 'Blocker' | 'Major' | 'Minor'
		line: number
		description: string
		fix: string
	}[]
	modelReview: string
}

const REVIEW_SAMPLES: CodeSample[] = [
	{
		id: 'sample-1',
		title: 'Async Autocomplete & Context Provider',
		category: 'Race Conditions & Re-render Cascades',
		difficulty: 'Hard',
		code: `// PR #142: Product Search Autocomplete
import React, { useState, useEffect, createContext } from 'react'

export const SearchContext = createContext<any>(null)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // ❌ Flaw 1: Race Condition (missing AbortController)
  // ❌ Flaw 2: Missing Debounce (fires on every keystroke)
  useEffect(() => {
    if (!query) return
    setIsLoading(true)
    fetch(\`/api/search?q=\${query}\`)
      .then(res => res.json())
      .then(data => {
        setResults(data)
        setIsLoading(false)
      })
  }, [query])

  // ❌ Flaw 3: Unmemoized context value forces all consumers to re-render
  return (
    <SearchContext.Provider value={{ query, setQuery, results, isLoading }}>
      {children}
    </SearchContext.Provider>
  )
}`,
		flaws: [
			{
				type: 'Race Condition',
				severity: 'Blocker',
				line: 12,
				description:
					'No AbortController cleanup. Slower earlier network responses can resolve after newer queries, writing stale search results.',
				fix: 'Attach an AbortController in useEffect cleanup or use TanStack Query.',
			},
			{
				type: 'Unmemoized Context Value',
				severity: 'Major',
				line: 24,
				description:
					'Object literal in Provider value creates a new reference on every render, triggering cascading re-renders across all consumer components.',
				fix: 'Wrap provider value in useMemo(() => ({ query, setQuery, results, isLoading }), [query, results, isLoading]).',
			},
			{
				type: 'Missing Keystroke Debounce',
				severity: 'Major',
				line: 11,
				description: 'Fires network requests on every single character change, overloading backend APIs.',
				fix: 'Add a 200-300ms debounce to the search input.',
			},
		],
		modelReview: `### 💬 Specialist Code Review (PR #142)

**1. [Blocker: Async Race Condition] (Line 12)**
- **Observation**: \`fetch\` runs without request cancellation or cleanup.
- **Impact**: When users type rapidly, an earlier slow response can fulfill AFTER a later fast response, overwriting fresh results with stale data.
- **Fix**: Use \`AbortController\` or adopt \`useQuery\` from TanStack Query.

**2. [Major: Cascading Re-render Cascade] (Line 24)**
- **Observation**: \`SearchContext.Provider\` passes an unmemoized object literal \`value={{ ... }}\`.
- **Impact**: Every keystroke creates a new object reference in heap memory, forcing ALL subscribing components to re-render.
- **Fix**: Memoize the context value with \`useMemo\`.

**3. [Performance: Missing Debounce] (Line 11)**
- **Observation**: Query updates trigger instant API calls.
- **Fix**: Introduce a 250ms debounce before dispatching the request.`,
	},
	{
		id: 'sample-2',
		title: 'Event Listener & Interval Memory Leak',
		category: 'Memory Management & Teardown',
		difficulty: 'Medium',
		code: `// PR #188: Real-time Telemetry Widget
import React, { useState, useEffect } from 'react'

export function TelemetryWidget({ deviceId }: { deviceId: string }) {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    // ❌ Flaw 1: setInterval is never cleared on unmount / deviceId change
    const interval = setInterval(() => {
      fetch(\`/api/telemetry/\${deviceId}\`)
        .then(res => res.json())
        .then(d => setData(d))
    }, 2000)

    // ❌ Flaw 2: Global window resize listener missing removeEventListener
    window.addEventListener('resize', () => {
      console.log('Window resized for device:', deviceId)
    })
  }, [deviceId])

  // ❌ Flaw 3: Inaccessible non-semantic clickable element
  return (
    <div onClick={() => alert('Device status')}>
      <h3>Device: {deviceId}</h3>
      <p>{data ? data.status : 'Connecting...'}</p>
    </div>
  )
}`,
		flaws: [
			{
				type: 'Dangling Interval Memory Leak',
				severity: 'Blocker',
				line: 8,
				description:
					'setInterval continues running indefinitely after unmount, holding references to deviceId and triggering state updates on unmounted component.',
				fix: 'Return () => clearInterval(interval) in useEffect.',
			},
			{
				type: 'Global Event Listener Leak',
				severity: 'Major',
				line: 15,
				description:
					'window.addEventListener accumulates duplicate listeners every time deviceId changes without removeEventListener.',
				fix: 'Return () => window.removeEventListener("resize", handleResize).',
			},
			{
				type: 'Inaccessible Click Target',
				severity: 'Minor',
				line: 21,
				description: 'Non-semantic <div> with onClick lacks keyboard focusability and ARIA role.',
				fix: 'Use a native <button> or add tabIndex="0", role="button", and onKeyDown.',
			},
		],
		modelReview: `### 💬 Specialist Code Review (PR #188)

**1. [Blocker: Memory Leak & Dangling Timer] (Line 8)**
- **Observation**: \`setInterval\` lacks cleanup in \`useEffect\`.
- **Impact**: Timers will accumulate on every prop change and continue running after the widget is unmounted, leaking memory and throwing "setState on unmounted component" warnings.
- **Fix**: Return \`() => clearInterval(interval)\` in the cleanup function.

**2. [Major: Window Event Listener Accumulation] (Line 15)**
- **Observation**: \`window.addEventListener('resize')\` is added without a corresponding \`removeEventListener\`.
- **Fix**: Define a named handler and remove it in the return cleanup.

**3. [Accessibility (a11y)] (Line 21)**
- **Observation**: \`<div onClick={...}>\` is inaccessible to keyboard users.
- **Fix**: Replace with a semantic \`<button type="button">\`.`,
	},
]

export function CodeCritiqueSimulator () {
	const [activeSampleId, setActiveSampleId] = useState('sample-1')
	const [candidateReviewText, setCandidateReviewText] = useState('')
	const [evaluationResult, setEvaluationResult] = useState<{
		score: number
		matchedFlaws: string[]
		missedFlaws: string[]
		feedback: string
	} | null>(null)

	const currentSample = REVIEW_SAMPLES.find((s) => s.id === activeSampleId) || REVIEW_SAMPLES[0]

	const handleEvaluateReview = () => {
		if (!candidateReviewText.trim()) return

		const textLower = candidateReviewText.toLowerCase()
		const matched: string[] = []
		const missed: string[] = []

		currentSample.flaws.forEach((flaw) => {
			const typeMatch = textLower.includes(flaw.type.toLowerCase())
			const descKeywords = flaw.description.toLowerCase().split(' ').slice(0, 3)
			const keywordMatch = descKeywords.some((k) => k.length > 4 && textLower.includes(k))

			if (typeMatch || keywordMatch) {
				matched.push(flaw.type)
			} else {
				missed.push(flaw.type)
			}
		})

		const hasCodeSnippet = candidateReviewText.includes('```') || candidateReviewText.includes('const') || candidateReviewText.includes('function')
		const hasStructure = textLower.includes('observation') || textLower.includes('impact') || textLower.includes('fix') || textLower.includes('solution') || textLower.includes('[blocker]')

		let score = Math.round((matched.length / currentSample.flaws.length) * 60)
		if (hasCodeSnippet) score += 20
		if (hasStructure) score += 20

		let feedback = ''
		if (score >= 85) feedback = 'Exceptional review! You identified all critical flaws, explained user impact, and provided concrete code solutions.'
		else if (score >= 60) feedback = 'Strong review. You caught the primary architectural defects. Consider adding structured [Severity] tags and drop-in code snippets.'
		else feedback = 'Good start. Ensure you address async race conditions, memory leaks, and accessibility standards with code solutions.'

		setEvaluationResult({
			score: Math.min(100, score),
			matchedFlaws: matched,
			missedFlaws: missed,
			feedback,
		})
	}

	const handleInsertModelReview = () => {
		setCandidateReviewText(currentSample.modelReview)
	}

	return (
		<div className="flex flex-col gap-6 rounded-2xl border border-surface-800 bg-surface-900/60 p-6 backdrop-blur-sm">
			{/* Top Bar */}
			<div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-800 pb-4">
				<div>
					<div className="flex items-center gap-2">
						<span className="rounded bg-purple-500/20 px-2.5 py-0.5 text-[11px] font-bold text-purple-300 border border-purple-500/30">
							Review Sandbox
						</span>
						<span className="text-xs text-slate-400">Pull Request Code Critique Simulator</span>
					</div>
					<h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
						<Code2 className="h-5 w-5 text-purple-400" />
						<span>Code Review & Anti-Pattern Diagnostic Studio</span>
					</h3>
				</div>

				{/* Sample Selector */}
				<div className="flex gap-2">
					{REVIEW_SAMPLES.map((sample) => (
						<button
							key={sample.id}
							onClick={() => {
								setActiveSampleId(sample.id)
								setEvaluationResult(null)
								setCandidateReviewText('')
							}}
							className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
								activeSampleId === sample.id
									? 'bg-purple-600 text-white shadow-md'
									: 'bg-surface-950 text-slate-400 hover:text-white border border-surface-800'
							}`}
						>
							{sample.title}
						</button>
					))}
				</div>
			</div>

			{/* Main Grid: Code to Review vs Candidate Review Workspace */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
				{/* Left: Code Snippet */}
				<div className="lg:col-span-6 flex flex-col justify-between rounded-xl border border-surface-800 bg-surface-950 p-4">
					<div>
						<div className="flex items-center justify-between border-b border-surface-800 pb-2 mb-3">
							<span className="font-mono text-xs text-brand-300 font-semibold">
								{currentSample.title} ({currentSample.category})
							</span>
							<span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300">
								{currentSample.flaws.length} Flaws Hidden
							</span>
						</div>

						<pre className="text-xs font-mono text-slate-300 bg-surface-900/90 p-3.5 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed border border-surface-800">
							{currentSample.code}
						</pre>
					</div>

					{/* Hidden Flaw Guide Hint */}
					<div className="mt-4 pt-3 border-t border-surface-800">
						<details className="text-xs text-slate-400 group">
							<summary className="cursor-pointer text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1">
								<Lightbulb className="h-3.5 w-3.5" />
								<span>Reveal Hidden Flaws & Solution Cheatsheet</span>
							</summary>
							<div className="mt-3 space-y-2 bg-surface-900 p-3 rounded-lg border border-surface-800">
								{currentSample.flaws.map((flaw, i) => (
									<div key={i} className="text-[11px] border-b border-surface-800 last:border-0 pb-1.5 last:pb-0">
										<div className="flex items-center gap-2">
											<span className="font-bold text-rose-400">[{flaw.severity}]</span>
											<span className="font-semibold text-slate-200">{flaw.type} (Line {flaw.line})</span>
										</div>
										<p className="text-slate-400 mt-0.5">{flaw.description}</p>
										<p className="text-emerald-400 mt-0.5"><strong>Fix:</strong> {flaw.fix}</p>
									</div>
								))}
							</div>
						</details>
					</div>
				</div>

				{/* Right: Candidate Review Editor */}
				<div className="lg:col-span-6 flex flex-col justify-between rounded-xl border border-surface-800 bg-surface-950 p-4">
					<div>
						<div className="flex items-center justify-between border-b border-surface-800 pb-2 mb-3">
							<span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
								<MessageSquare className="h-3.5 w-3.5 text-brand-400" />
								<span>Your Specialist Code Review</span>
							</span>
							<button
								onClick={handleInsertModelReview}
								className="text-[11px] text-slate-500 hover:text-brand-300 underline"
							>
								Insert Model Critique
							</button>
						</div>

						<textarea
							rows={10}
							value={candidateReviewText}
							onChange={(e) => setCandidateReviewText(e.target.value)}
							placeholder="Write your constructive code review comment. Include:
1. [Severity] and Line reference (e.g. [Blocker: Race Condition])
2. Observation: What pattern was observed?
3. Impact: What breaks for the user or system?
4. Code Solution: Drop-in fix snippet..."
							className="w-full rounded-xl border border-surface-800 bg-surface-900 p-3 text-xs font-mono text-white placeholder:text-slate-600 focus:border-purple-500 focus:outline-none resize-none leading-relaxed"
						/>
					</div>

					<div className="mt-4 flex items-center justify-between pt-3 border-t border-surface-800">
						<button
							onClick={() => {
								setCandidateReviewText('')
								setEvaluationResult(null)
							}}
							className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300"
						>
							<RefreshCw className="h-3 w-3" /> Clear
						</button>

						<button
							disabled={!candidateReviewText.trim()}
							onClick={handleEvaluateReview}
							className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold text-white transition ${
								candidateReviewText.trim()
									? 'bg-gradient-to-r from-purple-600 to-brand-600 hover:brightness-110 shadow-lg shadow-purple-500/20'
									: 'bg-surface-800 text-slate-600 cursor-not-allowed'
							}`}
						>
							<span>Evaluate Review Quality</span>
							<Send className="h-3.5 w-3.5" />
						</button>
					</div>
				</div>
			</div>

			{/* Evaluation Result Scorecard */}
			{evaluationResult && (
				<div className="rounded-xl border border-purple-500/40 bg-purple-950/20 p-4 animate-fadeIn">
					<div className="flex items-center justify-between border-b border-purple-500/20 pb-2 mb-3">
						<div className="flex items-center gap-2">
							<CheckCircle className="h-4 w-4 text-emerald-400" />
							<span className="font-bold text-sm text-white">
								Critique Evaluation Score: {evaluationResult.score}%
							</span>
						</div>
						<span className="text-xs text-purple-300 font-mono">
							{evaluationResult.matchedFlaws.length} of {currentSample.flaws.length} Flaws Caught
						</span>
					</div>

					<p className="text-xs text-slate-300 mb-3">{evaluationResult.feedback}</p>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
						<div className="rounded-lg bg-surface-950 p-2.5 border border-emerald-500/20">
							<strong className="text-emerald-400 block mb-1">Identified Flaws:</strong>
							{evaluationResult.matchedFlaws.length > 0 ? (
								<ul className="space-y-0.5 text-slate-300 text-[11px]">
									{evaluationResult.matchedFlaws.map((f, i) => (
										<li key={i} className="flex items-center gap-1">
											<CheckCircle className="h-3 w-3 text-emerald-400" /> {f}
										</li>
									))}
								</ul>
							) : (
								<span className="text-slate-500 italic text-[11px]">None identified yet</span>
							)}
						</div>

						<div className="rounded-lg bg-surface-950 p-2.5 border border-rose-500/20">
							<strong className="text-rose-400 block mb-1">Missed Flaws:</strong>
							{evaluationResult.missedFlaws.length > 0 ? (
								<ul className="space-y-0.5 text-slate-300 text-[11px]">
									{evaluationResult.missedFlaws.map((f, i) => (
										<li key={i} className="flex items-center gap-1">
											<AlertCircle className="h-3 w-3 text-rose-400" /> {f}
										</li>
									))}
								</ul>
							) : (
								<span className="text-emerald-400 italic text-[11px]">All flaws successfully caught!</span>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
