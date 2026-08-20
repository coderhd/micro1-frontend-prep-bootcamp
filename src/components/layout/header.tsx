import { useProgressStore } from '../../store/use-progress-store'
import { RotateCcw, LockOpen, Bot, Trophy } from 'lucide-react'

export function Header () {
	const {
		getOverallReadiness,
		resetAllProgress,
		toggleUnlockAll,
		isAllUnlocked,
		interviewReports,
	} = useProgressStore()

	const readiness = getOverallReadiness()
	const latestInterview = interviewReports[0]

	return (
		<header className="sticky top-0 z-40 border-b border-surface-800 bg-surface-950/80 backdrop-blur-md">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
				{/* Logo / Brand */}
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 shadow-lg shadow-brand-500/20">
						<Bot className="h-5 w-5 text-white" />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<span className="font-bold text-white tracking-tight text-lg">
								Frontend Mastery
							</span>
							<span className="rounded-md bg-brand-500/20 px-2 py-0.5 text-xs font-semibold text-brand-300 border border-brand-500/30">
								Micro1 AI Prep
							</span>
						</div>
						<p className="text-xs text-slate-400">
							RL Benchmarks & AI Recruiter Interview Accelerator
						</p>
					</div>
				</div>

				{/* Readiness Meter & Utility Controls */}
				<div className="flex items-center gap-4">
					{/* Interview Badge if completed */}
					{latestInterview && (
						<div className="hidden md:flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-400">
							<Trophy className="h-3.5 w-3.5 text-emerald-400" />
							<span>Mock Score: {latestInterview.totalScore}% ({latestInterview.hireRecommendation.split(' ')[0]} {latestInterview.hireRecommendation.split(' ')[1]})</span>
						</div>
					)}

					{/* Readiness Progress Bar */}
					<div className="flex items-center gap-2.5 bg-surface-900 border border-surface-800 px-3.5 py-1.5 rounded-lg">
						<div className="flex flex-col text-right">
							<span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
								Interview Readiness
							</span>
							<span className="text-xs font-bold text-brand-400">
								{readiness}%
							</span>
						</div>
						<div className="h-2 w-20 sm:w-28 overflow-hidden rounded-full bg-surface-800">
							<div
								className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500"
								style={{ width: `${readiness}%` }}
							/>
						</div>
					</div>

					{/* Quick Controls */}
					<div className="flex items-center gap-1.5">
						<button
							onClick={toggleUnlockAll}
							title={isAllUnlocked ? 'Re-lock milestones' : 'Unlock all milestones for testing'}
							className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
								isAllUnlocked
									? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
									: 'bg-surface-900 text-slate-400 border border-surface-800 hover:text-slate-200'
							}`}
						>
							<LockOpen className="h-3.5 w-3.5" />
							<span className="hidden sm:inline">
								{isAllUnlocked ? 'Unlocked' : 'Free Mode'}
							</span>
						</button>

						<button
							onClick={() => {
								if (window.confirm('Reset all progress, quiz scores, and interview records?')) {
									resetAllProgress()
								}
							}}
							title="Reset all progress"
							className="flex items-center rounded-lg bg-surface-900 p-2 text-slate-400 border border-surface-800 hover:text-rose-400 hover:border-rose-500/30 transition"
						>
							<RotateCcw className="h-3.5 w-3.5" />
						</button>
					</div>
				</div>
			</div>
		</header>
	)
}
