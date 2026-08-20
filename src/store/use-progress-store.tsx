import React, { createContext, useContext, useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { InterviewFinalReport } from '../types/interview'

interface QuizResult {
	score: number
	total: number
	passed: boolean
	completedAt: number
}

interface ProgressState {
	activeMilestoneId: string
	unlockedMilestones: string[]
	completedMilestones: string[]
	quizResults: Record<string, QuizResult>
	completedLabs: Record<string, boolean>
	interviewReports: InterviewFinalReport[]
	isAllUnlocked: boolean
}

interface ProgressContextType extends ProgressState {
	setActiveMilestone: (id: string) => void
	recordQuizResult: (milestoneId: string, score: number, total: number) => boolean
	markLabComplete: (labId: string) => void
	saveInterviewReport: (report: InterviewFinalReport) => void
	resetAllProgress: () => void
	toggleUnlockAll: () => void
	triggerConfetti: () => void
	getOverallReadiness: () => number
}

const STORAGE_KEY = 'frontend_mastery_bootcamp_progress_v1'

const initialDefaultState: ProgressState = {
	activeMilestoneId: 'm1',
	unlockedMilestones: ['m1'],
	completedMilestones: [],
	quizResults: {},
	completedLabs: {},
	interviewReports: [],
	isAllUnlocked: false,
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

const MILESTONE_SEQUENCE = ['m1', 'm-ts', 'm2', 'm3', 'm4', 'm5']

export function ProgressProvider ({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<ProgressState>(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY)
			if (saved) {
				const parsed = JSON.parse(saved)
				return {
					...initialDefaultState,
					...parsed,
					unlockedMilestones: parsed.unlockedMilestones || ['m1'],
				}
			}
		} catch (e) {
			console.error('Failed to load progress from localStorage', e)
		}
		return initialDefaultState
	})

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
		} catch (e) {
			console.error('Failed to persist progress to localStorage', e)
		}
	}, [state])

	const triggerConfetti = () => {
		try {
			confetti({
				particleCount: 80,
				spread: 70,
				origin: { y: 0.6 },
				colors: ['#6366f1', '#818cf8', '#10b981', '#f59e0b', '#ec4899'],
			})
		} catch {
			// ignore confetti errors
		}
	}

	const setActiveMilestone = (id: string) => {
		setState(prev => ({
			...prev,
			activeMilestoneId: id,
		}))
	}

	const recordQuizResult = (
		milestoneId: string,
		score: number,
		total: number,
	): boolean => {
		const passed = score / total >= 0.8
		const currentIndex = MILESTONE_SEQUENCE.indexOf(milestoneId)
		const nextMilestoneId =
			currentIndex >= 0 && currentIndex < MILESTONE_SEQUENCE.length - 1
				? MILESTONE_SEQUENCE[currentIndex + 1]
				: null

		setState(prev => {
			const newUnlocked = new Set(prev.unlockedMilestones)
			const newCompleted = new Set(prev.completedMilestones)

			if (passed) {
				newCompleted.add(milestoneId)
				if (nextMilestoneId) {
					newUnlocked.add(nextMilestoneId)
				}
			}

			return {
				...prev,
				unlockedMilestones: Array.from(newUnlocked),
				completedMilestones: Array.from(newCompleted),
				quizResults: {
					...prev.quizResults,
					[milestoneId]: {
						score,
						total,
						passed,
						completedAt: Date.now(),
					},
				},
			}
		})

		if (passed) {
			triggerConfetti()
		}

		return passed
	}

	const markLabComplete = (labId: string) => {
		setState(prev => ({
			...prev,
			completedLabs: {
				...prev.completedLabs,
				[labId]: true,
			},
		}))
		triggerConfetti()
	}

	const saveInterviewReport = (report: InterviewFinalReport) => {
		setState(prev => ({
			...prev,
			completedMilestones: Array.from(
				new Set([...prev.completedMilestones, 'm5']),
			),
			interviewReports: [report, ...prev.interviewReports],
		}))
		triggerConfetti()
	}

	const resetAllProgress = () => {
		setState({
			...initialDefaultState,
			activeMilestoneId: 'm1',
		})
	}

	const toggleUnlockAll = () => {
		setState(prev => {
			const nextUnlocked = !prev.isAllUnlocked
			return {
				...prev,
				isAllUnlocked: nextUnlocked,
				unlockedMilestones: nextUnlocked
					? [...MILESTONE_SEQUENCE]
					: prev.completedMilestones.length > 0
						? ['m1', ...prev.completedMilestones]
						: ['m1'],
			}
		})
	}

	const getOverallReadiness = (): number => {
		let points = 0
		const maxPoints = 100

		// Milestones passed (up to 5 * 12 = 60 points)
		const milestoneScores = ['m1', 'm-ts', 'm2', 'm3', 'm4'].reduce((acc, mId) => {
			const res = state.quizResults[mId]
			if (res && res.passed) return acc + 12
			return acc
		}, 0)
		points += milestoneScores

		// Completed labs (up to 15 points)
		const labCount = Object.keys(state.completedLabs).length
		points += Math.min(15, labCount * 5)

		// Interview completed (25 points)
		if (state.interviewReports.length > 0) {
			const latest = state.interviewReports[0]
			points += Math.round((latest.totalScore / 100) * 25)
		}

		return Math.min(maxPoints, points)
	}

	return (
		<ProgressContext.Provider
			value={{
				...state,
				setActiveMilestone,
				recordQuizResult,
				markLabComplete,
				saveInterviewReport,
				resetAllProgress,
				toggleUnlockAll,
				triggerConfetti,
				getOverallReadiness,
			}}
		>
			{children}
		</ProgressContext.Provider>
	)
}

export function useProgressStore () {
	const context = useContext(ProgressContext)
	if (!context) {
		throw new Error('useProgressStore must be used within a ProgressProvider')
	}
	return context
}
