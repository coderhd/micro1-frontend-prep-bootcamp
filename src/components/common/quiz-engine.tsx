import { useState } from 'react'
import { QuizQuestion } from '../../types/curriculum'
import { useProgressStore } from '../../store/use-progress-store'
import {
	HelpCircle,
	CheckCircle,
	XCircle,
	ArrowRight,
	RotateCcw,
	Award,
	Sparkles,
	ChevronRight,
} from 'lucide-react'

interface QuizEngineProps {
	milestoneId: string
	milestoneTitle: string
	nextMilestoneId?: string
	questions: QuizQuestion[]
}

export function QuizEngine ({
	milestoneId,
	milestoneTitle,
	nextMilestoneId,
	questions,
}: QuizEngineProps) {
	const { recordQuizResult, setActiveMilestone, quizResults } = useProgressStore()

	const existingResult = quizResults[milestoneId]

	const [currentIndex, setCurrentIndex] = useState(0)
	const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [score, setScore] = useState<number | null>(existingResult ? existingResult.score : null)
	const [showExplanation, setShowExplanation] = useState(false)

	const currentQuestion = questions[currentIndex]
	const isCurrentAnswered = selectedAnswers[currentIndex] !== undefined

	const handleSelectOption = (optionIndex: number) => {
		if (isSubmitted) return
		setSelectedAnswers(prev => ({
			...prev,
			[currentIndex]: optionIndex,
		}))
		setShowExplanation(true)
	}

	const handleNext = () => {
		if (currentIndex < questions.length - 1) {
			setCurrentIndex(prev => prev + 1)
			setShowExplanation(selectedAnswers[currentIndex + 1] !== undefined)
		} else {
			// Grade the quiz
			let totalScore = 0
			questions.forEach((q, idx) => {
				if (selectedAnswers[idx] === q.correctAnswerIndex) {
					totalScore += 1
				}
			})
			setScore(totalScore)
			setIsSubmitted(true)
			recordQuizResult(milestoneId, totalScore, questions.length)
		}
	}

	const handleRetake = () => {
		setSelectedAnswers({})
		setCurrentIndex(0)
		setIsSubmitted(false)
		setScore(null)
		setShowExplanation(false)
	}

	const isPassed = score !== null && score / questions.length >= 0.8
	const percentage = score !== null ? Math.round((score / questions.length) * 100) : 0

	return (
		<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-6 backdrop-blur-sm">
			{/* Header */}
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-surface-800 pb-4">
				<div className="flex items-center gap-2.5">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30">
						<HelpCircle className="h-5 w-5" />
					</div>
					<div>
						<h3 className="text-base font-bold text-white">
							{milestoneTitle} Diagnostic Quiz
						</h3>
						<p className="text-xs text-slate-400">
							Passing criteria: 80% (4 / 5 correct) to unlock next milestone
						</p>
					</div>
				</div>

				{!isSubmitted && (
					<div className="flex items-center gap-2">
						<span className="text-xs font-semibold text-slate-400">
							Question {currentIndex + 1} of {questions.length}
						</span>
						<div className="h-2 w-24 overflow-hidden rounded-full bg-surface-800">
							<div
								className="h-full rounded-full bg-brand-500 transition-all duration-300"
								style={{
									width: `${((currentIndex + 1) / questions.length) * 100}%`,
								}}
							/>
						</div>
					</div>
				)}
			</div>

			{/* Completed Result View */}
			{isSubmitted ? (
				<div className="flex flex-col items-center justify-center py-6 text-center">
					<div
						className={`flex h-20 w-20 items-center justify-center rounded-2xl border mb-4 ${
							isPassed
								? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/20'
								: 'bg-rose-500/20 text-rose-400 border-rose-500/30 shadow-lg shadow-rose-500/20'
						}`}
					>
						<Award className="h-10 w-10" />
					</div>

					<h4 className="text-xl font-bold text-white mb-1">
						{isPassed ? 'Milestone Cleared!' : 'Keep Practicing!'}
					</h4>
					<p className="text-sm text-slate-400 max-w-md mb-4">
						{isPassed
							? 'Outstanding! You demonstrated solid mastery of these core concepts. The next milestone has been unlocked.'
							: 'You scored below the 80% passing threshold. Review the theory and try again to reinforce your understanding.'}
					</p>

					{/* Score breakdown badge */}
					<div className="mb-6 flex items-center gap-6 rounded-xl bg-surface-950 border border-surface-800 px-6 py-3">
						<div className="text-center">
							<div className="text-2xl font-black text-brand-400">{score} / {questions.length}</div>
							<div className="text-[11px] uppercase tracking-wider text-slate-400">Score</div>
						</div>
						<div className="h-8 w-px bg-surface-800" />
						<div className="text-center">
							<div className={`text-2xl font-black ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
								{percentage}%
							</div>
							<div className="text-[11px] uppercase tracking-wider text-slate-400">Accuracy</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-wrap items-center justify-center gap-3">
						<button
							onClick={handleRetake}
							className="flex items-center gap-2 rounded-xl border border-surface-700 bg-surface-800 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-surface-700 transition"
						>
							<RotateCcw className="h-4 w-4" />
							<span>Review & Retake</span>
						</button>

						{isPassed && nextMilestoneId && (
							<button
								onClick={() => setActiveMilestone(nextMilestoneId)}
								className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:brightness-110 transition"
							>
								<span>Proceed to Next Milestone</span>
								<ChevronRight className="h-4 w-4" />
							</button>
						)}
					</div>
				</div>
			) : (
				/* Question Active View */
				<div>
					<div className="mb-4 flex items-center justify-between">
						<span className="rounded-md bg-brand-500/10 px-2.5 py-1 text-xs font-semibold text-brand-400 border border-brand-500/20">
							{currentQuestion.conceptTag}
						</span>
						<span className="text-xs text-slate-400">
							Question {currentIndex + 1} of {questions.length}
						</span>
					</div>

					<h4 className="text-base font-medium text-slate-100 mb-4 leading-relaxed">
						{currentQuestion.question}
					</h4>

					{currentQuestion.codeSnippet && (
						<pre className="mb-5 rounded-xl border border-surface-800 bg-surface-950 p-4 font-mono text-xs text-brand-300 overflow-x-auto">
							<code>{currentQuestion.codeSnippet}</code>
						</pre>
					)}

					{/* Options */}
					<div className="flex flex-col gap-2.5 mb-6">
						{currentQuestion.options.map((option, optIdx) => {
							const isSelected = selectedAnswers[currentIndex] === optIdx
							const isCorrect = currentQuestion.correctAnswerIndex === optIdx
							const hasAnsweredThis = selectedAnswers[currentIndex] !== undefined

							let optionStyles = 'border-surface-800 bg-surface-950/70 hover:bg-surface-800/80 text-slate-200'
							if (hasAnsweredThis) {
								if (isCorrect) {
									optionStyles = 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
								} else if (isSelected && !isCorrect) {
									optionStyles = 'border-rose-500/50 bg-rose-500/15 text-rose-300'
								} else {
									optionStyles = 'border-surface-800 bg-surface-950/40 text-slate-500 opacity-60'
								}
							} else if (isSelected) {
								optionStyles = 'border-brand-500 bg-brand-500/15 text-white'
							}

							return (
								<button
									key={optIdx}
									onClick={() => handleSelectOption(optIdx)}
									className={`flex items-start gap-3 rounded-xl border p-3.5 text-left text-sm transition-all ${optionStyles}`}
								>
									<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-xs font-semibold mt-0.5">
										{String.fromCharCode(65 + optIdx)}
									</span>
									<span className="flex-1">{option}</span>
									{hasAnsweredThis && isCorrect && (
										<CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
									)}
									{hasAnsweredThis && isSelected && !isCorrect && (
										<XCircle className="h-5 w-5 shrink-0 text-rose-400" />
									)}
								</button>
							)
						})}
					</div>

					{/* Instant Explanation on Selection */}
					{showExplanation && (
						<div className="mb-6 rounded-xl border border-brand-500/20 bg-brand-500/5 p-4 text-xs leading-relaxed text-slate-300 animate-fadeIn">
							<div className="flex items-center gap-1.5 font-bold text-brand-400 mb-1.5">
								<Sparkles className="h-3.5 w-3.5" />
								<span>Why this is correct:</span>
							</div>
							<p>{currentQuestion.explanation}</p>
						</div>
					)}

					{/* Next / Submit Button */}
					<div className="flex items-center justify-end">
						<button
							disabled={!isCurrentAnswered}
							onClick={handleNext}
							className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition ${
								isCurrentAnswered
									? 'bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/25'
									: 'bg-surface-800 text-slate-500 cursor-not-allowed'
							}`}
						>
							<span>{currentIndex === questions.length - 1 ? 'Finish & Grade Quiz' : 'Next Question'}</span>
							<ArrowRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
