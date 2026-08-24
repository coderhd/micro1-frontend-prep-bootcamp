import { useProgressStore } from '../../store/use-progress-store'
import { RotateCcw, LockOpen, Bot, Trophy, Code2, Cpu } from 'lucide-react'

export function Header () {
	const {
		activeTrack,
		setActiveTrack,
		getOverallReadiness,
		resetAllProgress,
		toggleUnlockAll,
		isAllUnlocked,
		interviewReports,
	} = useProgressStore()

	const readiness = getOverallReadiness()
	const latestInterview = interviewReports[0]

	return (
		<header className="sticky top-0 z-40 border-b border-surface-800 bg-surface-950/90 backdrop-blur-md">
			<div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
				{/* Logo / Brand */}
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 shadow-lg shadow-brand-500/20">
						<Bot className="h-5 w-5 text-white" />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<span className="font-bold text-white tracking-tight text-base sm:text-lg">
								Micro1 AI Interview Accelerator
							</span>
						</div>
						<p className="text-[11px] text-slate-400">
							RL Benchmarks & AI Recruiter Preparation Hub
						</p>
					</div>
				</div>

				{/* Role Switcher */}
				<div className="flex items-center rounded-xl bg-surface-900 border border-surface-800 p-1">
					<button
						onClick={() => setActiveTrack('frontend')}
						className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
							activeTrack === 'frontend'
								? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
								: 'text-slate-400 hover:text-slate-200'
						}`}
					>
						<Code2 className="h-3.5 w-3.5" />
						<span>Frontend Track</span>
					</button>

					<button
						onClick={() => setActiveTrack('ai-engineer')}
						className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
							activeTrack === 'ai-engineer'
								? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20'
								: 'text-slate-400 hover:text-slate-200'
						}`}
					>
						<Cpu className="h-3.5 w-3.5" />
						<span>AI Engineer & MCP Track</span>
					</button>
				</div>

				{/* Readiness Meter & Quick Controls */}
				<div className="flex items-center gap-3">
					{/* Interview Badge if completed */}
					{latestInterview && (
						<div className="hidden lg:flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-medium text-emerald-400">
							<Trophy className="h-3.5 w-3.5 text-emerald-400" />
							<span>Mock: {latestInterview.totalScore}%</span>
						</div>
					)}

					{/* Readiness Progress Bar */}
					<div className="flex items-center gap-2 bg-surface-900 border border-surface-800 px-3 py-1 rounded-lg">
						<div className="flex flex-col text-right">
							<span className="text-[9px] uppercase font-semibold tracking-wider text-slate-400">
								Readiness
							</span>
							<span className="text-xs font-bold text-brand-400">
								{readiness}%
							</span>
						</div>
						<div className="h-1.5 w-16 sm:w-20 overflow-hidden rounded-full bg-surface-800">
							<div
								className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500"
								style={{ width: `${readiness}%` }}
							/>
						</div>
					</div>

					{/* Free Mode & Reset */}
					<div className="flex items-center gap-1">
						<button
							onClick={toggleUnlockAll}
							title={isAllUnlocked ? 'Re-lock milestones' : 'Unlock all milestones for testing'}
							className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
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
							className="flex items-center rounded-lg bg-surface-900 p-1.5 text-slate-400 border border-surface-800 hover:text-rose-400 hover:border-rose-500/30 transition"
						>
							<RotateCcw className="h-3.5 w-3.5" />
						</button>
					</div>
				</div>
			</div>
		</header>
	)
}
