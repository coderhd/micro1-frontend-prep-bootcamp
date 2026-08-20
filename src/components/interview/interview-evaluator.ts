import {
	InterviewQuestionItem,
	AnswerEvaluation,
	InterviewRecord,
	InterviewFinalReport,
	InterviewStage,
} from '../../types/interview'

export function evaluateCandidateAnswer (
	question: InterviewQuestionItem,
	answerText: string,
): AnswerEvaluation {
	const lower = answerText.toLowerCase().trim()
	const words = lower.split(/\s+/).filter(Boolean)

	// 1. Keyword analysis
	const matchedKeywords: string[] = []
	const missedKeywords: string[] = []

	question.expectedKeywords.forEach((kw) => {
		const kwLower = kw.toLowerCase()
		if (lower.includes(kwLower)) {
			matchedKeywords.push(kw)
		} else {
			missedKeywords.push(kw)
		}
	})

	const keywordMatchRatio =
		question.expectedKeywords.length > 0
			? matchedKeywords.length / question.expectedKeywords.length
			: 1

	// 2. Length and structure bonus/penalty
	let lengthScore = 1.0
	if (words.length < 15) {
		lengthScore = 0.45 // Too terse for AI evaluator
	} else if (words.length < 35) {
		lengthScore = 0.75
	} else if (words.length >= 35 && words.length <= 250) {
		lengthScore = 1.0 // Sweet spot
	} else {
		lengthScore = 0.9 // Overly verbose
	}

	// 3. Composite score (0 - 100)
	let rawScore = Math.round(
		keywordMatchRatio * 65 + lengthScore * 35,
	)
	rawScore = Math.min(100, Math.max(10, rawScore))

	let rating: AnswerEvaluation['rating'] = 'Needs Work'
	if (rawScore >= 85) rating = 'Exceptional'
	else if (rawScore >= 70) rating = 'Strong'
	else if (rawScore >= 50) rating = 'Adequate'

	// 4. Strengths & Suggestions
	const strengths: string[] = []
	const suggestions: string[] = []

	if (matchedKeywords.length >= 3) {
		strengths.push(
			`Strong technical vocabulary: correctly utilized [${matchedKeywords.slice(0, 4).join(', ')}].`,
		)
	}
	if (words.length >= 35) {
		strengths.push('Articulate, structured explanation with good technical depth.')
	}

	if (missedKeywords.length > 0) {
		suggestions.push(
			`Verbalize these key phrases in your response: [${missedKeywords.slice(0, 3).join(', ')}] to boost AI keyword matching.`,
		)
	}
	if (words.length < 25) {
		suggestions.push(
			'Expand on architectural trade-offs and edge-case handling rather than giving brief one-sentence answers.',
		)
	}

	let feedback = `Demonstrated solid conceptual familiarity. Matched ${matchedKeywords.length} of ${question.expectedKeywords.length} targeted evaluation signals.`
	if (rating === 'Exceptional') {
		feedback = 'Outstanding technical mastery and clear chain-of-thought communication.'
	} else if (rating === 'Needs Work') {
		feedback = 'Answer was missing key technical terminology and architectural explanations.'
	}

	return {
		scorePercentage: rawScore,
		rating,
		matchedKeywords,
		missedKeywords,
		feedback,
		strengths,
		suggestions,
	}
}

export function generateFinalInterviewReport (
	records: InterviewRecord[],
): InterviewFinalReport {
	let totalScoreAccumulator = 0
	const stageScores: Record<InterviewStage, number> = {
		intro: 0,
		javascript: 0,
		typescript: 0,
		react: 0,
		'css-cwv': 0,
		'debugging-rl': 0,
		'live-coding': 0,
	}

	records.forEach((rec) => {
		totalScoreAccumulator += rec.evaluation.scorePercentage
		stageScores[rec.stage] = rec.evaluation.scorePercentage
	})

	const avgScore = records.length > 0 ? Math.round(totalScoreAccumulator / records.length) : 0

	let hireRecommendation: InterviewFinalReport['hireRecommendation'] = 'Not Ready'
	if (avgScore >= 85) hireRecommendation = 'Strong Hire (Top 5%)'
	else if (avgScore >= 70) hireRecommendation = 'Hire (Ready for RL Project)'
	else if (avgScore >= 55) hireRecommendation = 'Borderline (Needs Review)'

	const topStrengths: string[] = []
	const criticalGaps: string[] = []

	records.forEach((rec) => {
		if (rec.evaluation.scorePercentage >= 75 && rec.evaluation.strengths.length > 0) {
			topStrengths.push(`${rec.stage.toUpperCase()}: ${rec.evaluation.strengths[0]}`)
		} else if (rec.evaluation.scorePercentage < 65 && rec.evaluation.suggestions.length > 0) {
			criticalGaps.push(`${rec.stage.toUpperCase()}: ${rec.evaluation.suggestions[0]}`)
		}
	})

	return {
		timestamp: Date.now(),
		totalScore: avgScore,
		hireRecommendation,
		stageScores,
		executiveSummary:
			avgScore >= 70
				? 'Candidate demonstrated strong command of frontend architecture, engine internals, and clear verbal communication. Well qualified for micro1 RL benchmark engineering.'
				: 'Candidate shows good foundational knowledge but needs more technical precision and explicit keyword articulation when answering rapid-fire AI recruiter prompts.',
		topStrengths: topStrengths.length > 0 ? topStrengths : ['Consistent problem-solving attitude and effort.'],
		criticalGaps: criticalGaps.length > 0 ? criticalGaps : ['Continue refining rapid explanations for complex asynchronous race conditions.'],
		actionablePrepAdvice: [
			'Keep speaking out loud continuously during live coding tasks.',
			'Structure answers: High-level concept -> Internal engine mechanics -> Edge-case mitigation.',
			'Ensure browser DevTools terminology (Heap snapshots, Network waterfall, Long tasks) is naturally woven into your explanations.',
		],
		records,
	}
}
