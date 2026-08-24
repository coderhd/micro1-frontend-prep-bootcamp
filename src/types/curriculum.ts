export type TrackType = 'frontend' | 'ai-engineer'

export type CategoryType = 
	| 'javascript' 
	| 'typescript'
	| 'react' 
	| 'css-a11y' 
	| 'debugging-testing' 
	| 'mcp'
	| 'agentic-ai'
	| 'tools-debugging'
	| 'rl-benchmarks'
	| 'interview'

export interface CodeExample {
	title: string
	code: string
	language?: string
	explanation: string
}

export interface TheorySection {
	id: string
	title: string
	badge?: string
	summary: string
	bulletPoints: string[]
	codeExamples: CodeExample[]
	interviewCheatSheet: {
		whyZaraAsks: string
		keyPhrasesToSay: string[]
		commonCandidateTraps: string[]
	}
}

export interface QuizQuestion {
	id: string
	question: string
	codeSnippet?: string
	options: string[]
	correctAnswerIndex: number
	explanation: string
	conceptTag: string
}

export interface CodeChallenge {
	id: string
	title: string
	difficulty: 'Easy' | 'Medium' | 'Hard'
	prompt: string
	starterCode: string
	solutionCode: string
	explanation: string
	testCases: {
		description: string
		assertion: string
	}[]
}

export interface Milestone {
	id: string
	number: number
	title: string
	shortTitle: string
	subtitle: string
	category: CategoryType
	estimatedTime: string
	theorySections: TheorySection[]
	quiz: QuizQuestion[]
	codeChallenges: CodeChallenge[]
}
