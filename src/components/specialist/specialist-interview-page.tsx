import { useState } from 'react'
import { useProgressStore } from '../../store/use-progress-store'
import { InterviewInterface } from '../interview/interview-interface'
import { InterviewScorecard } from '../interview/interview-scorecard'
import { SPECIALIST_ZARA_QUESTIONS } from '../../data/specialist-interview-questions'
import { InterviewFinalReport } from '../../types/interview'
import {
	Bot,
	Play,
	AlertCircle,
	Clock,
	Award,
	ShieldCheck,
	Mic,
} from 'lucide-react'

export function SpecialistInterviewPage () {
	const { interviewReports } = useProgressStore()

	const [isInterviewActive, setIsInterviewActive] = useState(false)
	const [activeReport, setActiveReport] = useState<InterviewFinalReport | null>(
		interviewReports.length > 0 ? interviewReports[0] : null,
	)

	const handleStartInterview = () => {
		setIsInterviewActive(true)
		setActiveReport(null)
	}

	const handleFinishInterview = (report: InterviewFinalReport) => {
		setIsInterviewActive(false)
		setActiveReport(report)
	}

	const handleCancelInterview = () => {
		setIsInterviewActive(false)
	}

	if (isInterviewActive) {
		return (
			<InterviewInterface
				onFinish={handleFinishInterview}
				onCancel={handleCancelInterview}
				customQuestions={SPECIALIST_ZARA_QUESTIONS}
				durationMinutes={28}
			/>
		)
	}

	if (activeReport) {
		return (
			<InterviewScorecard
				report={activeReport}
				onRetake={handleStartInterview}
			/>
		)
	}

	return (
		<div className="flex flex-col gap-6 animate-fadeIn">
			{/* Hero Header */}
			<div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-r from-surface-900 via-surface-900 to-indigo-950/40 p-6 backdrop-blur-md shadow-xl shadow-indigo-500/10">
				<div className="flex flex-wrap items-center justify-between gap-4 mb-2">
					<div className="flex items-center gap-2">
						<span className="rounded-md bg-indigo-500/20 px-2.5 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
							Milestone 5 • Final Boss
						</span>
						<span className="flex items-center gap-1 text-xs text-slate-400">
							<Clock className="h-3.5 w-3.5" />
							28 Minutes
						</span>
					</div>
					<span className="text-xs text-indigo-300 font-semibold bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
						Simulated micro1 Frontend Specialist AI Screening
					</span>
				</div>

				<h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
					<Bot className="h-8 w-8 text-indigo-400" />
					<span>The &quot;Zara&quot; AI Recruiter Mock Interview (Frontend Specialist)</span>
				</h1>
				<p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
					Put your technical reasoning, architectural trade-off defenses, live code review critiques, RFCs/ADRs authoring, non-technical communication, and stakeholder influence skills to the test in a 28-minute conversational interview.
				</p>

				{/* Pre-Interview Readiness Checklist */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 border-t border-surface-800 pt-4">
					<div className="rounded-xl bg-surface-950/80 border border-surface-800 p-3">
						<div className="flex items-center gap-2 text-xs font-bold text-indigo-300 mb-1">
							<Mic className="h-3.5 w-3.5" />
							<span>Voice & Audio Ready</span>
						</div>
						<p className="text-[11px] text-slate-400">
							Features Web Speech API for Zara voice prompts and voice-to-text candidate microphone input.
						</p>
					</div>

					<div className="rounded-xl bg-surface-950/80 border border-surface-800 p-3">
						<div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-1">
							<ShieldCheck className="h-3.5 w-3.5" />
							<span>7 Specialist Screening Rounds</span>
						</div>
						<p className="text-[11px] text-slate-400">
							Evaluates decision rationales, code reviews, RFCs, non-technical analogies, and conflict resolution.
						</p>
					</div>

					<div className="rounded-xl bg-surface-950/80 border border-surface-800 p-3">
						<div className="flex items-center gap-2 text-xs font-bold text-purple-300 mb-1">
							<Award className="h-3.5 w-3.5" />
							<span>Automated Specialist Scorecard</span>
						</div>
						<p className="text-[11px] text-slate-400">
							Generates hiring recommendations, identified strengths, missed concepts, and coaching advice.
						</p>
					</div>
				</div>

				{/* Start Button CTA */}
				<div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-surface-800 pt-4">
					<div className="flex items-center gap-2 text-xs text-slate-400">
						<AlertCircle className="h-4 w-4 text-amber-400" />
						<span>You can type or speak your responses. You can pause or exit anytime.</span>
					</div>

					<button
						onClick={handleStartInterview}
						className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 transition active:scale-98"
					>
						<Play className="h-4 w-4 fill-current" />
						<span>Launch 28-Min Specialist AI Interview</span>
					</button>
				</div>
			</div>

			{/* Previous Interview History if any */}
			{interviewReports.length > 0 && (
				<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
					<h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
						Previous Simulation Records ({interviewReports.length})
					</h3>
					<div className="space-y-2">
						{interviewReports.map((rep, idx) => (
							<div
								key={idx}
								onClick={() => setActiveReport(rep)}
								className="flex items-center justify-between rounded-xl bg-surface-950 p-3 border border-surface-800 hover:border-indigo-500/40 cursor-pointer transition"
							>
								<div className="flex items-center gap-3">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs">
										#{interviewReports.length - idx}
									</div>
									<div>
										<span className="text-xs font-semibold text-slate-200">
											{rep.hireRecommendation}
										</span>
										<div className="text-[10px] text-slate-500">
											{new Date(rep.timestamp).toLocaleString()}
										</div>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<span className="text-sm font-black text-indigo-400">{rep.totalScore}%</span>
									<span className="text-xs text-slate-400 hover:text-white">View Scorecard &rarr;</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
