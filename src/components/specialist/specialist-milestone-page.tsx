import { useState } from 'react'
import { SPECIALIST_CURRICULUM } from '../../data/specialist-curriculum'
import { useProgressStore } from '../../store/use-progress-store'
import { TradeoffMatrixVisualizer } from './tradeoff-matrix-visualizer'
import { CodeCritiqueSimulator } from './code-critique-simulator'
import { AdrRfcStudio } from './adr-rfc-studio'
import { NonTechnicalPitchPlayground } from './non-technical-pitch-playground'
import { SpecialistCodeLabs } from './specialist-code-labs'
import {
	BookOpen,
	Code2,
	HelpCircle,
	CheckCircle,
	AlertCircle,
	Clock,
	Layers,
	Bot,
	Terminal,
} from 'lucide-react'

interface SpecialistMilestonePageProps {
	milestoneId: string
}

export function SpecialistMilestonePage ({ milestoneId }: SpecialistMilestonePageProps) {
	const { recordQuizResult, quizResults } = useProgressStore()

	const milestone =
		SPECIALIST_CURRICULUM.find((m) => m.id === milestoneId) || SPECIALIST_CURRICULUM[0]

	const [activeTab, setActiveTab] = useState<'theory' | 'sandbox' | 'labs' | 'quiz'>('theory')
	const [userAnswers, setUserAnswers] = useState<Record<string, number>>({})
	const [submittedQuiz, setSubmittedQuiz] = useState(false)

	const quizScoreRecord = quizResults[milestone.id]

	const handleSelectOption = (questionId: string, optionIndex: number) => {
		if (submittedQuiz) return
		setUserAnswers((prev) => ({
			...prev,
			[questionId]: optionIndex,
		}))
	}

	const handleQuizSubmit = () => {
		let score = 0
		milestone.quiz.forEach((q) => {
			if (userAnswers[q.id] === q.correctAnswerIndex) {
				score += 1
			}
		})
		recordQuizResult(milestone.id, score, milestone.quiz.length)
		setSubmittedQuiz(true)
	}

	const handleResetQuiz = () => {
		setUserAnswers({})
		setSubmittedQuiz(false)
	}

	return (
		<div className="flex flex-col gap-6 animate-fadeIn">
			{/* Milestone Hero Header */}
			<div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-surface-900 via-surface-900 to-indigo-950/40 p-6 backdrop-blur-md shadow-xl shadow-indigo-500/10">
				<div className="flex flex-wrap items-center justify-between gap-4 mb-2">
					<div className="flex items-center gap-2">
						<span className="rounded-md bg-indigo-500/20 px-2.5 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
							Milestone {milestone.number} • Specialist Track
						</span>
						<span className="flex items-center gap-1 text-xs text-slate-400">
							<Clock className="h-3.5 w-3.5" />
							{milestone.estimatedTime}
						</span>
					</div>
					{quizScoreRecord && quizScoreRecord.passed && (
						<span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
							<CheckCircle className="h-3.5 w-3.5" />
							<span>Passed ({quizScoreRecord.score}/{quizScoreRecord.total})</span>
						</span>
					)}
				</div>

				<h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
					<span>{milestone.title}</span>
				</h1>
				<p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
					{milestone.subtitle}
				</p>

				{/* 4-Tab Navigation */}
				<div className="flex flex-wrap gap-2 mt-6 border-t border-surface-800 pt-4">
					<button
						onClick={() => setActiveTab('theory')}
						className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
							activeTab === 'theory'
								? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
								: 'bg-surface-950 text-slate-400 hover:text-white border border-surface-800'
						}`}
					>
						<BookOpen className="h-3.5 w-3.5" />
						<span>1. Theory & Reasoning Cheatsheet</span>
					</button>

					<button
						onClick={() => setActiveTab('sandbox')}
						className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
							activeTab === 'sandbox'
								? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
								: 'bg-surface-950 text-slate-400 hover:text-white border border-surface-800'
						}`}
					>
						<Layers className="h-3.5 w-3.5" />
						<span>2. Interactive Specialist Sandbox</span>
					</button>

					<button
						onClick={() => setActiveTab('labs')}
						className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
							activeTab === 'labs'
								? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
								: 'bg-surface-950 text-slate-400 hover:text-white border border-surface-800'
						}`}
					>
						<Terminal className="h-3.5 w-3.5" />
						<span>3. Code & Writing Labs</span>
					</button>

					<button
						onClick={() => setActiveTab('quiz')}
						className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
							activeTab === 'quiz'
								? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
								: 'bg-surface-950 text-slate-400 hover:text-white border border-surface-800'
						}`}
					>
						<HelpCircle className="h-3.5 w-3.5" />
						<span>4. Diagnostic Checkpoint ({milestone.quiz.length} Qs)</span>
					</button>
				</div>
			</div>

			{/* Tab 1: Theory */}
			{activeTab === 'theory' && (
				<div className="flex flex-col gap-6">
					{milestone.theorySections.map((sec) => (
						<div
							key={sec.id}
							className="rounded-2xl border border-surface-800 bg-surface-900/60 p-6 backdrop-blur-sm"
						>
							<div className="flex items-center justify-between gap-3 mb-2">
								<h2 className="text-lg font-bold text-white tracking-tight">
									{sec.title}
								</h2>
								{sec.badge && (
									<span className="rounded-md bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
										{sec.badge}
									</span>
								)}
							</div>

							<p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
								{sec.summary}
							</p>

							{/* Key Principles List */}
							<div className="space-y-2 mb-6 bg-surface-950/70 p-4 rounded-xl border border-surface-800">
								<h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
									Key Architectural Principles
								</h3>
								<ul className="space-y-1.5 text-xs text-slate-300">
									{sec.bulletPoints.map((bp, i) => (
										<li key={i} className="flex items-start gap-2">
											<span className="text-indigo-400 font-bold">•</span>
											<span>{bp}</span>
										</li>
									))}
								</ul>
							</div>

							{/* Code Examples */}
							{sec.codeExamples.map((ex, i) => (
								<div
									key={i}
									className="mb-6 rounded-xl border border-surface-800 bg-surface-950 p-4"
								>
									<div className="flex items-center justify-between border-b border-surface-800 pb-2 mb-3 text-xs">
										<span className="font-semibold text-indigo-300 flex items-center gap-1.5">
											<Code2 className="h-4 w-4" /> {ex.title}
										</span>
										<span className="text-slate-500 uppercase font-mono text-[10px]">
											{ex.language || 'typescript'}
										</span>
									</div>
									<pre className="text-xs font-mono text-slate-300 bg-surface-900 p-3.5 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed">
										<code>{ex.code}</code>
									</pre>
									<p className="text-xs text-slate-400 mt-2.5 italic">
										{ex.explanation}
									</p>
								</div>
							))}

							{/* Zara Interview Cheat Sheet */}
							<div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-5">
								<div className="flex items-center gap-2 mb-3">
									<Bot className="h-5 w-5 text-indigo-400" />
									<h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
										Zara AI Interview Cheatsheet: What to Say
									</h3>
								</div>

								<div className="space-y-3 text-xs">
									<div>
										<strong className="text-slate-200">Why micro1 evaluates this:</strong>
										<p className="text-slate-400 mt-0.5 leading-relaxed">
											{sec.interviewCheatSheet.whyZaraAsks}
										</p>
									</div>

									<div>
										<strong className="text-emerald-400">High-Scoring Phrasing:</strong>
										<ul className="list-disc list-inside text-slate-300 space-y-1 mt-1">
											{sec.interviewCheatSheet.keyPhrasesToSay.map((phrase, i) => (
												<li key={i} className="leading-relaxed">{phrase}</li>
											))}
										</ul>
									</div>

									<div>
										<strong className="text-rose-400">Common Candidate Traps:</strong>
										<ul className="list-disc list-inside text-slate-400 space-y-1 mt-1">
											{sec.interviewCheatSheet.commonCandidateTraps.map((trap, i) => (
												<li key={i} className="leading-relaxed">{trap}</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Tab 2: Interactive Sandbox */}
			{activeTab === 'sandbox' && (
				<div>
					{milestone.id === 'sp-m1' && <TradeoffMatrixVisualizer />}
					{milestone.id === 'sp-m2' && <CodeCritiqueSimulator />}
					{milestone.id === 'sp-m3' && <AdrRfcStudio />}
					{milestone.id === 'sp-m4' && <NonTechnicalPitchPlayground />}
				</div>
			)}

			{/* Tab 3: Code & Writing Labs */}
			{activeTab === 'labs' && <SpecialistCodeLabs />}

			{/* Tab 4: Diagnostic Quiz */}
			{activeTab === 'quiz' && (
				<div className="rounded-2xl border border-surface-800 bg-surface-900/60 p-6 backdrop-blur-sm">
					<div className="flex items-center justify-between border-b border-surface-800 pb-4 mb-6">
						<div>
							<h3 className="text-lg font-bold text-white">
								Milestone {milestone.number} Diagnostic Checkpoint
							</h3>
							<p className="text-xs text-slate-400 mt-0.5">
								Score &ge;80% (4/5) to certify this milestone and unlock the next roadmap stage.
							</p>
						</div>

						{submittedQuiz && (
							<button
								onClick={handleResetQuiz}
								className="text-xs text-brand-400 hover:text-brand-300 underline"
							>
								Retake Quiz
							</button>
						)}
					</div>

					<div className="space-y-6">
						{milestone.quiz.map((q, idx) => {
							const selectedOpt = userAnswers[q.id]
							const isCorrect = selectedOpt === q.correctAnswerIndex

							return (
								<div
									key={q.id}
									className="rounded-xl border border-surface-800 bg-surface-950 p-5"
								>
									<div className="flex items-start justify-between gap-4 mb-3">
										<div className="flex items-center gap-2">
											<span className="flex h-6 w-6 items-center justify-center rounded-md bg-surface-800 text-xs font-bold text-slate-300 font-mono">
												{idx + 1}
											</span>
											<span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
												{q.conceptTag}
											</span>
										</div>
									</div>

									<p className="text-sm font-semibold text-white leading-relaxed mb-4">
										{q.question}
									</p>

									<div className="space-y-2">
										{q.options.map((opt, optIdx) => {
											const isThisSelected = selectedOpt === optIdx
											const isThisCorrect = optIdx === q.correctAnswerIndex

											let btnClass = 'border-surface-800 bg-surface-900/80 text-slate-300 hover:bg-surface-800'
											if (submittedQuiz) {
												if (isThisCorrect) {
													btnClass = 'border-emerald-500/50 bg-emerald-950/40 text-emerald-200'
												} else if (isThisSelected && !isThisCorrect) {
													btnClass = 'border-rose-500/50 bg-rose-950/40 text-rose-200'
												}
											} else if (isThisSelected) {
												btnClass = 'border-indigo-500 bg-indigo-950/50 text-white'
											}

											return (
												<button
													key={optIdx}
													disabled={submittedQuiz}
													onClick={() => handleSelectOption(q.id, optIdx)}
													className={`w-full text-left rounded-xl border p-3 text-xs transition flex items-center justify-between ${btnClass}`}
												>
													<span>{opt}</span>
													{submittedQuiz && isThisCorrect && (
														<CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 ml-2" />
													)}
													{submittedQuiz && isThisSelected && !isThisCorrect && (
														<AlertCircle className="h-4 w-4 text-rose-400 shrink-0 ml-2" />
													)}
												</button>
											)
										})}
									</div>

									{submittedQuiz && (
										<div className="mt-4 pt-3 border-t border-surface-800/80 text-xs">
											<strong className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
												{isCorrect ? 'Correct!' : 'Incorrect'}
											</strong>
											<p className="text-slate-400 mt-1 leading-relaxed">
												{q.explanation}
											</p>
										</div>
									)}
								</div>
							)
						})}
					</div>

					{/* Submit Button */}
					<div className="mt-6 flex items-center justify-between border-t border-surface-800 pt-4">
						<span className="text-xs text-slate-400">
							Answered {Object.keys(userAnswers).length} of {milestone.quiz.length} questions
						</span>

						{!submittedQuiz ? (
							<button
								disabled={Object.keys(userAnswers).length < milestone.quiz.length}
								onClick={handleQuizSubmit}
								className={`rounded-xl px-6 py-2.5 text-xs font-bold text-white transition ${
									Object.keys(userAnswers).length === milestone.quiz.length
										? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 shadow-lg shadow-indigo-500/20'
										: 'bg-surface-800 text-slate-500 cursor-not-allowed'
								}`}
							>
								Submit Checkpoint
							</button>
						) : (
							<button
								onClick={() => setActiveTab('sandbox')}
								className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-bold text-white transition"
							>
								Proceed to Next Step &rarr;
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	)
}
