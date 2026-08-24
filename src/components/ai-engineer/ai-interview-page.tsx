import { useState } from 'react'
import { useProgressStore } from '../../store/use-progress-store'
import { InterviewInterface } from '../interview/interview-interface'
import { InterviewScorecard } from '../interview/interview-scorecard'
import { AI_ZARA_INTERVIEW_QUESTIONS } from '../../data/ai-interview-questions'
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

export function AiInterviewPage () {
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
				customQuestions={AI_ZARA_INTERVIEW_QUESTIONS}
				durationMinutes={30}
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
			<div className="rounded-2xl border border-brand-500/40 bg-gradient-to-r from-surface-900 via-surface-900 to-purple-950/40 p-6 backdrop-blur-md shadow-xl shadow-brand-500/10">
				<div className="flex flex-wrap items-center justify-between gap-4 mb-2">
					<div className="flex items-center gap-2">
						<span className="rounded-md bg-brand-500/20 px-2.5 py-1 text-xs font-bold text-brand-300 border border-brand-500/30">
							Milestone 5 • Final Boss
						</span>
						<span className="flex items-center gap-1 text-xs text-slate-400">
							<Clock className="h-3.5 w-3.5" />
							30 Minutes
						</span>
					</div>
					<span className="text-xs text-brand-300 font-semibold bg-brand-500/10 border border-brand-500/20 px-2.5 py-0.5 rounded-full">
						Simulated micro1 AI Engineer Screening
					</span>
				</div>

				<h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
					<Bot className="h-8 w-8 text-brand-400" />
					<span>The &quot;Zara&quot; AI Recruiter Mock Interview (AI Engineer & MCP)</span>
				</h1>
				<p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
					Test your mastery across MCP architecture (JSON-RPC 2.0, stdio/SSE), ReAct loop orchestration, tool debugging, and SWE-bench deterministic verification in a live, 30-minute simulated screening.
				</p>

				{/* Pre-Interview Readiness Checklist */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 border-t border-surface-800 pt-4">
					<div className="rounded-xl bg-surface-950/80 border border-surface-800 p-3">
						<div className="flex items-center gap-2 text-xs font-bold text-brand-300 mb-1">
							<Mic className="h-3.5 w-3.5" />
							<span>Speech & Voice Enabled</span>
						</div>
						<p className="text-[11px] text-slate-400">
							Includes Web Speech API for Zara voice prompts and candidate microphone input.
						</p>
					</div>

					<div className="rounded-xl bg-surface-950/80 border border-surface-800 p-3">
						<div className="flex items-center gap-2 text-xs font-bold text-purple-300 mb-1">
							<ShieldCheck className="h-3.5 w-3.5" />
							<span>7 Dedicated AI Rounds</span>
						</div>
						<p className="text-[11px] text-slate-400">
							Evaluates MCP protocol, agent state machines, tool validation, Docker sandboxes, and FAIL_TO_PASS matrices.
						</p>
					</div>

					<div className="rounded-xl bg-surface-950/80 border border-surface-800 p-3">
						<div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-1">
							<Award className="h-3.5 w-3.5" />
							<span>Instant AI Evaluation</span>
						</div>
						<p className="text-[11px] text-slate-400">
							Provides hiring recommendation, key strengths, missed terms, and actionable coaching advice.
						</p>
					</div>
				</div>

				{/* Start Button CTA */}
				<div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-surface-800 pt-4">
					<div className="flex items-center gap-2 text-xs text-slate-400">
						<AlertCircle className="h-4 w-4 text-amber-400" />
						<span>You can type or speak your responses. You can exit or pause anytime.</span>
					</div>

					<button
						onClick={handleStartInterview}
						className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 hover:brightness-110 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-brand-500/25 transition active:scale-98"
					>
						<Play className="h-4 w-4 fill-current" />
						<span>Launch 30-Min AI Engineer Mock Interview</span>
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
								className="flex items-center justify-between rounded-xl bg-surface-950 p-3 border border-surface-800 hover:border-brand-500/40 cursor-pointer transition"
							>
								<div className="flex items-center gap-3">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400 font-bold text-xs">
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
									<span className="text-sm font-black text-brand-400">{rep.totalScore}%</span>
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
