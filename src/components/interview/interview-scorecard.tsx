import { useState } from 'react'
import { InterviewFinalReport } from '../../types/interview'
import {
	Trophy,
	CheckCircle,
	RotateCcw,
	Copy,
	Check,
	ChevronDown,
	ChevronUp,
	Star,
	Sparkles,
} from 'lucide-react'

interface InterviewScorecardProps {
	report: InterviewFinalReport
	onRetake: () => void
}

export function InterviewScorecard ({ report, onRetake }: InterviewScorecardProps) {
	const [copied, setCopied] = useState(false)
	const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

	const isStrongHire = report.hireRecommendation.includes('Strong Hire')
	const isHire = report.hireRecommendation.includes('Hire')

	const handleCopyReport = () => {
		const text = `=== MICRO1 AI INTERVIEW REPORT ===
Overall Score: ${report.totalScore}%
Recommendation: ${report.hireRecommendation}
Date: ${new Date(report.timestamp).toLocaleDateString()}

EXECUTIVE SUMMARY:
${report.executiveSummary}

TOP STRENGTHS:
${report.topStrengths.map((s) => `• ${s}`).join('\n')}

AREAS TO REFINE:
${report.criticalGaps.map((g) => `• ${g}`).join('\n')}
`
		navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className="flex flex-col gap-6 animate-fadeIn">
			{/* Executive Banner */}
			<div
				className={`rounded-2xl border p-6 backdrop-blur-md ${
					isStrongHire
						? 'border-emerald-500/40 bg-gradient-to-r from-surface-900 via-surface-900 to-emerald-950/40 shadow-xl shadow-emerald-500/10'
						: isHire
							? 'border-brand-500/40 bg-gradient-to-r from-surface-900 via-surface-900 to-brand-950/40 shadow-xl shadow-brand-500/10'
							: 'border-amber-500/40 bg-gradient-to-r from-surface-900 via-surface-900 to-amber-950/30'
				}`}
			>
				<div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-800 pb-4 mb-4">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
							<Trophy className="h-6 w-6 text-brand-400" />
						</div>
						<div>
							<span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
								Micro1 AI Interview Scorecard
							</span>
							<h2 className="text-2xl font-black text-white tracking-tight">
								{report.hireRecommendation}
							</h2>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<div className="text-right">
							<div className="text-3xl font-black text-brand-400">{report.totalScore}%</div>
							<div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overall Match</div>
						</div>
					</div>
				</div>

				<p className="text-sm text-slate-300 leading-relaxed mb-6">
					{report.executiveSummary}
				</p>

				{/* Quick Actions */}
				<div className="flex flex-wrap items-center justify-between gap-3 pt-2">
					<div className="flex items-center gap-2">
						<button
							onClick={onRetake}
							className="flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 px-4 py-2 text-xs font-bold text-white transition shadow-md shadow-brand-500/20"
						>
							<RotateCcw className="h-3.5 w-3.5" />
							<span>Retake Mock Interview</span>
						</button>

						<button
							onClick={handleCopyReport}
							className="flex items-center gap-2 rounded-xl border border-surface-700 bg-surface-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-surface-700 transition"
						>
							{copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
							<span>{copied ? 'Copied to Clipboard' : 'Copy Performance Report'}</span>
						</button>
					</div>

					<span className="text-xs text-slate-500">
						Completed on {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
					</span>
				</div>
			</div>

			{/* Strengths & Gaps Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Top Strengths */}
				<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
					<div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
						<CheckCircle className="h-4 w-4" />
						<span>Top Demonstrated Strengths</span>
					</div>
					<div className="space-y-2 text-xs text-slate-300">
						{report.topStrengths.map((str, idx) => (
							<div key={idx} className="flex items-start gap-2 rounded-lg bg-surface-950 p-2.5 border border-surface-800">
								<Star className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
								<span>{str}</span>
							</div>
						))}
					</div>
				</div>

				{/* High-Impact Advice */}
				<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
					<div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
						<Sparkles className="h-4 w-4" />
						<span>Actionable micro1 AI Tips</span>
					</div>
					<div className="space-y-2 text-xs text-slate-300">
						{report.actionablePrepAdvice.map((tip, idx) => (
							<div key={idx} className="flex items-start gap-2 rounded-lg bg-surface-950 p-2.5 border border-surface-800">
								<span className="text-amber-400 font-bold">•</span>
								<span>{tip}</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Question by Question Detailed Drilldown */}
			<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
				<h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-surface-800 pb-3">
					Round-by-Round Diagnostic Breakdown ({report.records.length} Questions)
				</h3>

				<div className="space-y-3">
					{report.records.map((rec, idx) => {
						const isExpanded = expandedQuestion === rec.questionId
						return (
							<div
								key={idx}
								className="rounded-xl border border-surface-800 bg-surface-950 overflow-hidden transition"
							>
								<button
									onClick={() => setExpandedQuestion(isExpanded ? null : rec.questionId)}
									className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-900/50 transition"
								>
									<div className="flex items-center gap-3">
										<span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-800 text-xs font-bold text-slate-300">
											{idx + 1}
										</span>
										<div>
											<span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">
												{rec.stage}
											</span>
											<h4 className="text-xs font-semibold text-slate-200 line-clamp-1">
												{rec.questionText}
											</h4>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<span
											className={`text-xs font-bold px-2 py-0.5 rounded ${
												rec.evaluation.scorePercentage >= 80
													? 'bg-emerald-500/20 text-emerald-400'
													: rec.evaluation.scorePercentage >= 60
														? 'bg-brand-500/20 text-brand-300'
														: 'bg-rose-500/20 text-rose-400'
											}`}
										>
											{rec.evaluation.scorePercentage}%
										</span>
										{isExpanded ? (
											<ChevronUp className="h-4 w-4 text-slate-400" />
										) : (
											<ChevronDown className="h-4 w-4 text-slate-400" />
										)}
									</div>
								</button>

								{isExpanded && (
									<div className="border-t border-surface-800 p-4 space-y-3 text-xs bg-surface-900/40">
										<div>
											<span className="text-slate-400 font-semibold block mb-1">Your Spoken Answer:</span>
											<p className="rounded-lg bg-surface-950 p-3 text-slate-300 leading-relaxed font-sans border border-surface-800 italic">
												&quot;{rec.userAnswer || 'No response recorded'}&quot;
											</p>
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
											<div className="rounded-lg bg-emerald-950/20 border border-emerald-500/30 p-2.5">
												<span className="text-[11px] font-bold text-emerald-400 block mb-1">
													Matched Keywords:
												</span>
												<div className="flex flex-wrap gap-1">
													{rec.evaluation.matchedKeywords.length > 0 ? (
														rec.evaluation.matchedKeywords.map((kw, ki) => (
															<span
																key={ki}
																className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono text-emerald-300"
															>
																{kw}
															</span>
														))
													) : (
														<span className="text-slate-500 text-[11px]">None detected</span>
													)}
												</div>
											</div>

											<div className="rounded-lg bg-rose-950/20 border border-rose-500/30 p-2.5">
												<span className="text-[11px] font-bold text-rose-400 block mb-1">
													Missed Keyphrases to Include:
												</span>
												<div className="flex flex-wrap gap-1">
													{rec.evaluation.missedKeywords.length > 0 ? (
														rec.evaluation.missedKeywords.slice(0, 5).map((kw, ki) => (
															<span
																key={ki}
																className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-mono text-rose-300"
															>
																{kw}
															</span>
														))
													) : (
														<span className="text-emerald-400 text-[11px]">All key terms hit!</span>
													)}
												</div>
											</div>
										</div>

										<div className="rounded-lg bg-surface-950 p-3 border border-surface-800">
											<span className="font-bold text-brand-400 block mb-1">Zara&apos;s Feedback:</span>
											<p className="text-slate-300 leading-relaxed">{rec.evaluation.feedback}</p>
										</div>
									</div>
								)}
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
