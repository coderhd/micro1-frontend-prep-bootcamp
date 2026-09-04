import React, { createContext, useContext, useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { InterviewFinalReport } from '../types/interview'
import { TrackType } from '../types/curriculum'

interface QuizResult {
	score: number
	total: number
	passed: boolean
	completedAt: number
}

interface ProgressState {
	activeTrack: TrackType
	activeMilestoneId: string
	unlockedMilestones: string[]
	completedMilestones: string[]
	quizResults: Record<string, QuizResult>
	completedLabs: Record<string, boolean>
	interviewReports: InterviewFinalReport[]
	isAllUnlocked: boolean
}

interface ProgressContextType extends ProgressState {
	setActiveTrack: (track: TrackType) => void
	setActiveMilestone: (id: string) => void
	recordQuizResult: (milestoneId: string, score: number, total: number) => boolean
	markLabComplete: (labId: string) => void
	saveInterviewReport: (report: InterviewFinalReport) => void
	resetAllProgress: () => void
	toggleUnlockAll: () => void
	triggerConfetti: () => void
	getOverallReadiness: () => number
}

const STORAGE_KEY = 'frontend_mastery_bootcamp_progress_v3'

const FRONTEND_SEQUENCE = ['m1', 'm-ts', 'm2', 'm3', 'm4', 'm5']
const AI_SEQUENCE = ['ai-m1', 'ai-m2', 'ai-m3', 'ai-m4', 'ai-m5']
const SPECIALIST_SEQUENCE = ['sp-m1', 'sp-m2', 'sp-m3', 'sp-m4', 'sp-m5']

const initialDefaultState: ProgressState = {
	activeTrack: 'frontend',
	activeMilestoneId: 'm1',
	unlockedMilestones: ['m1', 'ai-m1', 'sp-m1'],
	completedMilestones: [],
	quizResults: {},
	completedLabs: {},
	interviewReports: [],
	isAllUnlocked: false,
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider ({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<ProgressState>(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY)
			if (saved) {
				const parsed = JSON.parse(saved)
				return {
					...initialDefaultState,
					...parsed,
					unlockedMilestones: parsed.unlockedMilestones || ['m1', 'ai-m1', 'sp-m1'],
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
				colors: ['#6366f1', '#818cf8', '#10b981', '#f59e0b', '#ec4899', '#a855f7'],
			})
		} catch {
			// ignore confetti errors
		}
	}

	const setActiveTrack = (track: TrackType) => {
		setState(prev => {
			let defaultMilestone = 'm1'
			let sequence = FRONTEND_SEQUENCE
			if (track === 'ai-engineer') {
				defaultMilestone = 'ai-m1'
				sequence = AI_SEQUENCE
			} else if (track === 'frontend-specialist') {
				defaultMilestone = 'sp-m1'
				sequence = SPECIALIST_SEQUENCE
			}

			const currentBelongs = sequence.includes(prev.activeMilestoneId)
			return {
				...prev,
				activeTrack: track,
				activeMilestoneId: currentBelongs ? prev.activeMilestoneId : defaultMilestone,
			}
		})
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
		let sequence = FRONTEND_SEQUENCE
		if (milestoneId.startsWith('ai-')) {
			sequence = AI_SEQUENCE
		} else if (milestoneId.startsWith('sp-')) {
			sequence = SPECIALIST_SEQUENCE
		}

		const currentIndex = sequence.indexOf(milestoneId)
		const nextMilestoneId =
			currentIndex >= 0 && currentIndex < sequence.length - 1
				? sequence[currentIndex + 1]
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
		let finalMilestone = 'm5'
		if (state.activeTrack === 'ai-engineer') finalMilestone = 'ai-m5'
		else if (state.activeTrack === 'frontend-specialist') finalMilestone = 'sp-m5'

		setState(prev => ({
			...prev,
			completedMilestones: Array.from(
				new Set([...prev.completedMilestones, finalMilestone]),
			),
			interviewReports: [report, ...prev.interviewReports],
		}))
		triggerConfetti()
	}

	const resetAllProgress = () => {
		let defaultMilestone = 'm1'
		if (state.activeTrack === 'ai-engineer') defaultMilestone = 'ai-m1'
		else if (state.activeTrack === 'frontend-specialist') defaultMilestone = 'sp-m1'

		setState({
			...initialDefaultState,
			activeTrack: state.activeTrack,
			activeMilestoneId: defaultMilestone,
		})
	}

	const toggleUnlockAll = () => {
		setState(prev => {
			const nextUnlocked = !prev.isAllUnlocked
			const fullSequence = [...FRONTEND_SEQUENCE, ...AI_SEQUENCE, ...SPECIALIST_SEQUENCE]
			return {
				...prev,
				isAllUnlocked: nextUnlocked,
				unlockedMilestones: nextUnlocked
					? fullSequence
					: prev.completedMilestones.length > 0
						? ['m1', 'ai-m1', 'sp-m1', ...prev.completedMilestones]
						: ['m1', 'ai-m1', 'sp-m1'],
			}
		})
	}

	const getOverallReadiness = (): number => {
		let points = 0
		const maxPoints = 100

		if (state.activeTrack === 'frontend') {
			// Frontend milestones (5 * 12 = 60 points)
			const milestoneScores = ['m1', 'm-ts', 'm2', 'm3', 'm4'].reduce((acc, mId) => {
				const res = state.quizResults[mId]
				if (res && res.passed) return acc + 12
				return acc
			}, 0)
			points += milestoneScores

			// Completed labs (up to 15 points)
			const labCount = Object.keys(state.completedLabs).filter(
				k => !k.startsWith('ai-') && !k.startsWith('sp-'),
			).length
			points += Math.min(15, labCount * 5)
		} else if (state.activeTrack === 'ai-engineer') {
			// AI Engineer milestones (4 * 15 = 60 points)
			const milestoneScores = ['ai-m1', 'ai-m2', 'ai-m3', 'ai-m4'].reduce((acc, mId) => {
				const res = state.quizResults[mId]
				if (res && res.passed) return acc + 15
				return acc
			}, 0)
			points += milestoneScores

			// Completed AI labs (up to 15 points)
			const labCount = Object.keys(state.completedLabs).filter(k => k.startsWith('ai-')).length
			points += Math.min(15, labCount * 5)
		} else {
			// Frontend Specialist milestones (4 * 15 = 60 points)
			const milestoneScores = ['sp-m1', 'sp-m2', 'sp-m3', 'sp-m4'].reduce((acc, mId) => {
				const res = state.quizResults[mId]
				if (res && res.passed) return acc + 15
				return acc
			}, 0)
			points += milestoneScores

			// Completed Specialist labs (up to 15 points)
			const labCount = Object.keys(state.completedLabs).filter(k => k.startsWith('sp-')).length
			points += Math.min(15, labCount * 5)
		}

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
				setActiveTrack,
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
