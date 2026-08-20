export type InterviewStage = 
	| 'intro'
	| 'javascript'
	| 'typescript'
	| 'react'
	| 'css-cwv'
	| 'debugging-rl'
	| 'live-coding'

export interface InterviewQuestionItem {
	id: string
	stage: InterviewStage
	stageName: string
	question: string
	contextForCandidate: string
	expectedKeywords: string[]
	criticalConcepts: string[]
	drillDownTriggerWords?: {
		triggerWord: string
		drillDownQuestion: string
		drillDownExpectedKeywords: string[]
	}[]
	modelAnswerPoints: string[]
	codingChallenge?: {
		prompt: string
		starterCode: string
		expectedLogic: string
	}
}

export interface AnswerEvaluation {
	scorePercentage: number
	rating: 'Exceptional' | 'Strong' | 'Adequate' | 'Needs Work'
	matchedKeywords: string[]
	missedKeywords: string[]
	feedback: string
	strengths: string[]
	suggestions: string[]
}

export interface InterviewRecord {
	questionId: string
	questionText: string
	stage: InterviewStage
	userAnswer: string
	drillDownAnswer?: string
	evaluation: AnswerEvaluation
}

export interface InterviewFinalReport {
	timestamp: number
	totalScore: number
	hireRecommendation: 'Strong Hire (Top 5%)' | 'Hire (Ready for RL Project)' | 'Borderline (Needs Review)' | 'Not Ready'
	stageScores: Record<InterviewStage, number>
	executiveSummary: string
	topStrengths: string[]
	criticalGaps: string[]
	actionablePrepAdvice: string[]
	records: InterviewRecord[]
}
