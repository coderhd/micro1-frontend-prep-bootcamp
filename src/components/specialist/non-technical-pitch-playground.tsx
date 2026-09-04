import { useState } from 'react'
import {
	Users,
	Sparkles,
	CheckCircle,
	AlertCircle,
	Send,
	Briefcase,
	Palette,
	TrendingUp,
} from 'lucide-react'

interface AudiencePitchScenario {
	id: string
	title: string
	technicalTerm: string
	targetAudience: 'Product Manager' | 'Product Designer' | 'Executive / VP'
	audienceIcon: typeof Briefcase
	audienceMotivation: string
	analogy: string
	modelPitch: string
	bannedJargon: string[]
}

const AUDIENCE_SCENARIOS: AudiencePitchScenario[] = [
	{
		id: 'inp-pm',
		title: 'Explaining Interaction to Next Paint (INP) to a Product Manager',
		technicalTerm: 'Interaction to Next Paint (INP) & Main-Thread Long Tasks',
		targetAudience: 'Product Manager',
		audienceIcon: Briefcase,
		audienceMotivation: 'Concerned about user drop-off during mobile checkout and sprint timelines.',
		analogy: 'The Elevator Button Light response delay.',
		modelPitch:
			'Think of INP like pressing an elevator button. If the light turns on in under 100ms, you know your press registered. But if there is a 500ms lag, you tap it 3 more times wondering if it works. On our mobile checkout, heavy scripts delay button responses by half a second, causing user frustration. Fixing this responsiveness directly increases mobile checkout conversion by an estimated 6%.',
		bannedJargon: ['reconciliation', 'scheduler', 'fiber', 'microtask', 'v8 turbofan'],
	},
	{
		id: 'hydration-designer',
		title: 'Explaining Hydration Mismatch to a Product Designer',
		technicalTerm: 'React SSR Hydration Discrepancy',
		targetAudience: 'Product Designer',
		audienceIcon: Palette,
		audienceMotivation: 'Noticed a brief visual flicker on initial page load and wants layout stability.',
		analogy: 'A printed architectural drawing vs installing moving windows.',
		modelPitch:
			'Server rendering sends users a fast printed snapshot of the layout so they see it instantly. Hydration is the process of attaching interactive digital buttons onto that snapshot. When the snapshot shows one font size but the interactive code arrives with a different margin, the browser has to quickly redraw the card, causing that visual flicker. We are standardizing our shared token values to eliminate the flash.',
		bannedJargon: ['dom diffing', 'virtual dom', 'ast', 'useSyncExternalStore'],
	},
	{
		id: 'tech-debt-exec',
		title: 'Pitching Technical Debt Refactoring to an Executive / VP',
		technicalTerm: 'State Architecture Refactoring & Legacy Monolith Decoupling',
		targetAudience: 'Executive / VP',
		audienceIcon: TrendingUp,
		audienceMotivation: 'Wants faster feature delivery and lower infrastructure spending.',
		analogy: 'Clearing traffic gridlock on a highway to increase delivery speed.',
		modelPitch:
			'Right now, our engineers spend 35% of every sprint untangling legacy state bugs instead of building revenue-generating features. Investing 2 sprints into our state architecture refactor will clear this operational bottleneck, accelerating future feature delivery speed by 40% while preventing customer-facing checkout outages during peak Q4 sales.',
		bannedJargon: ['redux thunks', 'immutable data structures', 'monads', 'currying'],
	},
]

export function NonTechnicalPitchPlayground () {
	const [activeScenarioId, setActiveScenarioId] = useState('inp-pm')
	const [userPitchText, setUserPitchText] = useState('')
	const [pitchScore, setPitchScore] = useState<{
		score: number
		detectedJargon: string[]
		feedback: string
	} | null>(null)

	const currentScenario = AUDIENCE_SCENARIOS.find((s) => s.id === activeScenarioId) || AUDIENCE_SCENARIOS[0]
	const Icon = currentScenario.audienceIcon

	const handleEvaluatePitch = () => {
		if (!userPitchText.trim()) return

		const textLower = userPitchText.toLowerCase()
		const foundJargon: string[] = []

		currentScenario.bannedJargon.forEach((j) => {
			if (textLower.includes(j.toLowerCase())) {
				foundJargon.push(j)
			}
		})

		const hasAnalogy =
			textLower.includes('like') ||
			textLower.includes('think of') ||
			textLower.includes('imagine') ||
			textLower.includes('analogy') ||
			textLower.includes('elevator') ||
			textLower.includes('snapshot')

		const hasBusinessImpact =
			textLower.includes('conversion') ||
			textLower.includes('user') ||
			textLower.includes('revenue') ||
			textLower.includes('mobile') ||
			textLower.includes('speed') ||
			textLower.includes('velocity')

		let score = 100 - foundJargon.length * 20
		if (!hasAnalogy) score -= 25
		if (!hasBusinessImpact) score -= 25
		score = Math.max(10, Math.min(100, score))

		let feedback = ''
		if (score >= 85) {
			feedback = 'Outstanding! You used an intuitive analogy, avoided alienating technical jargon, and anchored the message to business value.'
		} else if (score >= 60) {
			feedback = 'Good explanation. Ensure you include a relatable physical analogy and explicitly mention the impact on users or business metrics.'
		} else {
			feedback = 'High jargon density detected. Translate engineering terms into relatable everyday concepts and business outcomes.'
		}

		setPitchScore({
			score,
			detectedJargon: foundJargon,
			feedback,
		})
	}

	const handleInsertModelPitch = () => {
		setUserPitchText(currentScenario.modelPitch)
	}

	return (
		<div className="flex flex-col gap-6 rounded-2xl border border-surface-800 bg-surface-900/60 p-6 backdrop-blur-sm">
			{/* Header */}
			<div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-800 pb-4">
				<div>
					<div className="flex items-center gap-2">
						<span className="rounded bg-pink-500/20 px-2.5 py-0.5 text-[11px] font-bold text-pink-300 border border-pink-500/30">
							Communication Lab
						</span>
						<span className="text-xs text-slate-400">Jargon Translation & Influence Simulator</span>
					</div>
					<h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
						<Users className="h-5 w-5 text-pink-400" />
						<span>Non-Technical Pitch Playground & Jargon Detector</span>
					</h3>
				</div>

				{/* Scenario Select */}
				<div className="flex flex-wrap gap-1.5 rounded-xl bg-surface-950 p-1 border border-surface-800">
					{AUDIENCE_SCENARIOS.map((scenario) => (
						<button
							key={scenario.id}
							onClick={() => {
								setActiveScenarioId(scenario.id)
								setUserPitchText('')
								setPitchScore(null)
							}}
							className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
								activeScenarioId === scenario.id
									? 'bg-pink-600 text-white shadow-md'
									: 'text-slate-400 hover:text-white'
							}`}
						>
							<span>{scenario.targetAudience}</span>
						</button>
					))}
				</div>
			</div>

			{/* Target Audience Persona Card */}
			<div className="rounded-xl border border-surface-800 bg-surface-950 p-4">
				<div className="flex flex-wrap items-center justify-between gap-3 mb-2">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/20 text-pink-400">
							<Icon className="h-4 w-4" />
						</div>
						<div>
							<h4 className="font-bold text-sm text-white">
								Target Audience: {currentScenario.targetAudience}
							</h4>
							<span className="text-xs text-slate-400">
								Concept to Explain: <strong className="text-pink-300">{currentScenario.technicalTerm}</strong>
							</span>
						</div>
					</div>

					<span className="rounded bg-surface-900 border border-surface-800 px-2.5 py-1 text-xs text-slate-300">
						Analogy Seed: <em>&quot;{currentScenario.analogy}&quot;</em>
					</span>
				</div>

				<p className="text-xs text-slate-300 mt-2 bg-surface-900 p-2.5 rounded-lg border border-surface-800">
					<strong>Stakeholder Motivation:</strong> {currentScenario.audienceMotivation}
				</p>
			</div>

			{/* Candidate Pitch Editor */}
			<div className="flex flex-col gap-3 rounded-xl border border-surface-800 bg-surface-950 p-4">
				<div className="flex items-center justify-between">
					<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
						Your Non-Technical Explanation
					</span>
					<button
						onClick={handleInsertModelPitch}
						className="text-xs text-pink-400 hover:text-pink-300 underline"
					>
						Insert Model Analogy Pitch
					</button>
				</div>

				<textarea
					rows={5}
					value={userPitchText}
					onChange={(e) => setUserPitchText(e.target.value)}
					placeholder={`Write how you would explain ${currentScenario.technicalTerm} to this ${currentScenario.targetAudience}. Use relatable analogies and connect directly to business impact (conversion, release speed)...`}
					className="w-full rounded-xl border border-surface-800 bg-surface-900 p-3 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:border-pink-500 focus:outline-none resize-none leading-relaxed"
				/>

				<div className="flex items-center justify-between pt-2">
					<div className="flex items-center gap-2 text-[11px] text-slate-500">
						<Sparkles className="h-3 w-3 text-pink-400" />
						<span>Jargon Detector scans for terms like: {currentScenario.bannedJargon.join(', ')}</span>
					</div>

					<button
						disabled={!userPitchText.trim()}
						onClick={handleEvaluatePitch}
						className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold text-white transition ${
							userPitchText.trim()
								? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110 shadow-lg shadow-pink-500/20'
								: 'bg-surface-800 text-slate-600 cursor-not-allowed'
						}`}
					>
						<span>Evaluate Pitch Clarity</span>
						<Send className="h-3.5 w-3.5" />
					</button>
				</div>
			</div>

			{/* Scorecard */}
			{pitchScore && (
				<div className="rounded-xl border border-pink-500/40 bg-pink-950/20 p-4 animate-fadeIn">
					<div className="flex items-center justify-between border-b border-pink-500/20 pb-2 mb-2">
						<div className="flex items-center gap-2">
							<CheckCircle className="h-4 w-4 text-emerald-400" />
							<span className="font-bold text-sm text-white">
								Audience Clarity Score: {pitchScore.score}%
							</span>
						</div>

						{pitchScore.detectedJargon.length === 0 ? (
							<span className="text-xs text-emerald-400 font-bold">0 Jargon Words Detected (Clean!)</span>
						) : (
							<span className="text-xs text-amber-400 font-semibold">
								{pitchScore.detectedJargon.length} Jargon Terms Found
							</span>
						)}
					</div>

					<p className="text-xs text-slate-300">{pitchScore.feedback}</p>

					{pitchScore.detectedJargon.length > 0 && (
						<div className="mt-2 flex items-center gap-2 text-xs">
							<AlertCircle className="h-3.5 w-3.5 text-amber-400" />
							<span className="text-slate-400">Jargon to simplify:</span>
							<div className="flex flex-wrap gap-1">
								{pitchScore.detectedJargon.map((j, i) => (
									<span key={i} className="rounded bg-rose-500/20 px-1.5 py-0.5 font-mono text-[10px] text-rose-300">
										{j}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
