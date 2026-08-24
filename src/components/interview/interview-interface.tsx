import { useState, useEffect, useRef } from 'react'
import { ZARA_INTERVIEW_QUESTIONS } from '../../data/interview-questions'
import {
	speakZaraVoice,
	stopZaraVoice,
	createSpeechRecognizer,
} from './speech-engine'
import {
	evaluateCandidateAnswer,
	generateFinalInterviewReport,
} from './interview-evaluator'
import { InterviewRecord, InterviewFinalReport } from '../../types/interview'
import { useProgressStore } from '../../store/use-progress-store'
import {
	Bot,
	Mic,
	MicOff,
	Volume2,
	VolumeX,
	Send,
	Clock,
	Lightbulb,
} from 'lucide-react'

interface InterviewInterfaceProps {
	onFinish: (report: InterviewFinalReport) => void
	onCancel: () => void
	customQuestions?: typeof ZARA_INTERVIEW_QUESTIONS
	durationMinutes?: number
}

export function InterviewInterface ({
	onFinish,
	onCancel,
	customQuestions,
	durationMinutes = 25,
}: InterviewInterfaceProps) {
	const { saveInterviewReport } = useProgressStore()

	const questions = customQuestions || ZARA_INTERVIEW_QUESTIONS
	const [questionIndex, setQuestionIndex] = useState(0)
	const [timeLeftSeconds, setTimeLeftSeconds] = useState(durationMinutes * 60)
	const [isMuted, setIsMuted] = useState(false)
	const [isSpeaking, setIsSpeaking] = useState(false)
	const [isListening, setIsListening] = useState(false)
	const [userAnswerText, setUserAnswerText] = useState('')
	const [interviewRecords, setInterviewRecords] = useState<InterviewRecord[]>([])
	const [showModelHint, setShowModelHint] = useState(false)

	const recognitionRef = useRef<any>(null)
	const currentQuestion = questions[questionIndex] || questions[0]

	// 25-minute Timer
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeftSeconds((prev) => {
				if (prev <= 1) {
					clearInterval(timer)
					handleFinalize()
					return 0
				}
				return prev - 1
			})
		}, 1000)

		return () => clearInterval(timer)
	}, [])

	// Speak current Zara question
	useEffect(() => {
		if (currentQuestion) {
			setIsSpeaking(true)
			speakZaraVoice(
				currentQuestion.question,
				() => setIsSpeaking(true),
				() => setIsSpeaking(false),
				isMuted,
			)
		}
		return () => {
			stopZaraVoice()
		}
	}, [questionIndex, isMuted])

	// Speech-to-Text Setup
	const handleToggleMic = () => {
		if (isListening) {
			if (recognitionRef.current) {
				recognitionRef.current.stop()
			}
			setIsListening(false)
		} else {
			const recognizer = createSpeechRecognizer(
				(transcript: string) => {
					setUserAnswerText(transcript)
				},
				() => setIsListening(false),
			)

			if (recognizer) {
				recognitionRef.current = recognizer
				try {
					recognizer.start()
					setIsListening(true)
				} catch (e) {
					console.warn('Recognition start error', e)
				}
			} else {
				alert('Speech recognition is not supported in this browser. You can type your answers directly!')
			}
		}
	}

	const handleFinalize = (updatedRecords?: InterviewRecord[]) => {
		stopZaraVoice()
		if (recognitionRef.current) recognitionRef.current.stop()

		const finalRecords = updatedRecords || interviewRecords
		const report = generateFinalInterviewReport(finalRecords)
		saveInterviewReport(report)
		onFinish(report)
	}

	const handleSubmitAnswer = () => {
		if (!userAnswerText.trim()) return

		stopZaraVoice()
		if (recognitionRef.current) recognitionRef.current.stop()
		setIsListening(false)

		// Evaluate answer
		const evaluation = evaluateCandidateAnswer(currentQuestion, userAnswerText)
		const newRecord: InterviewRecord = {
			questionId: currentQuestion.id,
			questionText: currentQuestion.question,
			stage: currentQuestion.stage,
			userAnswer: userAnswerText,
			evaluation,
		}

		const updated = [...interviewRecords, newRecord]
		setInterviewRecords(updated)
		setUserAnswerText('')
		setShowModelHint(false)

		if (questionIndex < questions.length - 1) {
			setQuestionIndex(prev => prev + 1)
		} else {
			handleFinalize(updated)
		}
	}

	const handleInsertSampleAnswer = () => {
		const sample = currentQuestion.modelAnswerPoints.join(' ')
		setUserAnswerText(sample)
	}

	const minutes = Math.floor(timeLeftSeconds / 60)
	const seconds = timeLeftSeconds % 60
	const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

	return (
		<div className="flex flex-col gap-6 animate-fadeIn">
			{/* Top Bar: Timer, Voice Toggles, Stage */}
			<div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-surface-800 bg-surface-900/80 p-4 backdrop-blur-md">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 shadow-md text-white">
						<Bot className="h-5 w-5" />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<span className="font-bold text-white text-sm">Zara (micro1 AI Recruiter)</span>
							<span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
						</div>
						<span className="text-[11px] text-slate-400 font-mono">
							Round {questionIndex + 1} of {questions.length}: {currentQuestion.stageName}
						</span>
					</div>
				</div>

				<div className="flex items-center gap-3">
					{/* Timer */}
					<div className="flex items-center gap-2 rounded-xl bg-surface-950 border border-surface-800 px-3.5 py-1.5 font-mono text-xs">
						<Clock className="h-3.5 w-3.5 text-brand-400" />
						<span className={`font-bold ${timeLeftSeconds < 300 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
							{formattedTime}
						</span>
					</div>

					{/* Mute Voice Toggle */}
					<button
						onClick={() => {
							setIsMuted(!isMuted)
							if (!isMuted) stopZaraVoice()
						}}
						className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
							isMuted
								? 'border-surface-700 bg-surface-950 text-slate-400'
								: 'border-brand-500/40 bg-brand-500/20 text-brand-300'
						}`}
					>
						{isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
						<span className="hidden sm:inline">{isMuted ? 'Voice Muted' : 'Voice Enabled'}</span>
					</button>

					<button
						onClick={onCancel}
						className="text-xs text-slate-500 hover:text-slate-300 px-2 py-1"
					>
						Exit
					</button>
				</div>
			</div>

			{/* Main Interface Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
				{/* Zara Recruiter Avatar & Question Pane */}
				<div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-950/20 to-surface-900/80 p-5 backdrop-blur-sm">
					<div>
						{/* Avatar Visualizer */}
						<div className="flex flex-col items-center justify-center py-6">
							<div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 shadow-xl shadow-purple-500/20">
								<Bot className="h-12 w-12 text-white" />
								{isSpeaking && (
									<span className="absolute -inset-1.5 rounded-3xl border-2 border-pink-400/60 animate-ping" />
								)}
							</div>

							<div className="mt-3 text-center">
								<h3 className="font-bold text-white text-sm">Zara</h3>
								<div className="flex items-center justify-center gap-1.5 mt-0.5">
									<span className={`h-1.5 w-1.5 rounded-full ${isSpeaking ? 'bg-pink-400 animate-pulse' : 'bg-slate-500'}`} />
									<span className="text-[11px] text-slate-400 font-mono">
										{isSpeaking ? 'Speaking prompt...' : 'Listening to candidate...'}
									</span>
								</div>
							</div>
						</div>

						{/* Question Speech Bubble */}
						<div className="rounded-2xl border border-purple-500/20 bg-surface-950/80 p-4 relative">
							<p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
								&quot;{currentQuestion.question}&quot;
							</p>
						</div>
					</div>

					{/* Interview Tip / Context Helper */}
					<div className="mt-4 pt-3 border-t border-surface-800/80">
						<div className="flex items-center justify-between text-xs">
							<button
								onClick={() => setShowModelHint(!showModelHint)}
								className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 font-medium"
							>
								<Lightbulb className="h-3.5 w-3.5" />
								<span>{showModelHint ? 'Hide Strategy Guide' : 'View Scoring Strategy Guide'}</span>
							</button>

							<button
								onClick={handleInsertSampleAnswer}
								className="text-[11px] text-slate-500 hover:text-slate-300 underline"
							>
								Insert Model Answer
							</button>
						</div>

						{showModelHint && (
							<div className="mt-3 rounded-xl border border-brand-500/30 bg-brand-950/30 p-3 text-xs text-slate-300 space-y-2">
								<div>
									<strong className="text-brand-300">Target Keywords:</strong>
									<div className="flex flex-wrap gap-1 mt-1">
										{currentQuestion.expectedKeywords.map((kw, i) => (
											<span key={i} className="rounded bg-brand-500/20 px-1.5 py-0.5 font-mono text-[10px] text-brand-200">
												{kw}
											</span>
										))}
									</div>
								</div>
								<p className="text-[11px] text-slate-400 italic">
									{currentQuestion.contextForCandidate}
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Candidate Response Workspace */}
				<div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-surface-800 bg-surface-900/80 p-5 backdrop-blur-sm">
					<div>
						<div className="flex items-center justify-between border-b border-surface-800 pb-3 mb-4">
							<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
								Your Candidate Response
							</span>
							<button
								onClick={handleToggleMic}
								className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
									isListening
										? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
										: 'bg-surface-800 border border-surface-700 text-slate-300 hover:text-white'
								}`}
							>
								{isListening ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
								<span>{isListening ? 'Listening (Mic Active)...' : 'Enable Voice Input'}</span>
							</button>
						</div>

						<textarea
							rows={9}
							value={userAnswerText}
							onChange={(e) => setUserAnswerText(e.target.value)}
							placeholder="Speak into your microphone or type your technical response here. Aim to clearly explain the underlying architecture, engine mechanics, and edge cases..."
							className="w-full rounded-xl border border-surface-700 bg-surface-950 p-4 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:border-brand-500 focus:outline-none leading-relaxed resize-none font-sans"
						/>

						<div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
							<span>Word Count: {userAnswerText.split(/\s+/).filter(Boolean).length}</span>
							<span>Recommended: 35-150 words for optimal AI evaluation score</span>
						</div>
					</div>

					<div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-surface-800">
						<button
							disabled={!userAnswerText.trim()}
							onClick={handleSubmitAnswer}
							className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-white transition ${
								userAnswerText.trim()
									? 'bg-gradient-to-r from-brand-600 to-purple-600 hover:brightness-110 shadow-lg shadow-brand-500/25 cursor-pointer'
									: 'bg-surface-800 text-slate-500 cursor-not-allowed'
							}`}
						>
							<span>{questionIndex === questions.length - 1 ? 'Submit & Finalize Interview' : 'Submit Response to Zara'}</span>
							<Send className="h-3.5 w-3.5" />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
