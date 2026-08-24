import { useProgressStore } from '../../store/use-progress-store'
import {
	Code2,
	FileCode,
	Layers,
	Layout,
	Bug,
	Bot,
	CheckCircle2,
	Lock,
	ChevronRight,
	Sparkles,
	Server,
	Cpu,
	Terminal,
} from 'lucide-react'

export interface MilestoneNavItem {
	id: string
	number: number
	title: string
	subtitle: string
	icon: typeof Code2
	isFinalBoss?: boolean
}

export const FRONTEND_MILESTONES_META: MilestoneNavItem[] = [
	{
		id: 'm1',
		number: 1,
		title: 'JS Engine & Async',
		subtitle: 'Event Loop, Closures, Prototypes',
		icon: Code2,
	},
	{
		id: 'm-ts',
		number: 2,
		title: 'TypeScript Deep Dive',
		subtitle: 'Generics, Infer, Mapped Types, Satisfies',
		icon: FileCode,
	},
	{
		id: 'm2',
		number: 3,
		title: 'React Internals & Perf',
		subtitle: 'Fiber, Stale Closures, Custom Hooks',
		icon: Layers,
	},
	{
		id: 'm3',
		number: 4,
		title: 'CSS Layouts & CWV',
		subtitle: 'Flex/Grid, Reflow, Core Web Vitals, a11y',
		icon: Layout,
	},
	{
		id: 'm4',
		number: 5,
		title: 'Debugging & Testing',
		subtitle: 'DevTools, Leaks, RTL, RL Environments',
		icon: Bug,
	},
	{
		id: 'm5',
		number: 6,
		title: 'Zara AI Interview',
		subtitle: '25-Min Recruiter Simulation + Scorecard',
		icon: Bot,
		isFinalBoss: true,
	},
]

export const AI_MILESTONES_META: MilestoneNavItem[] = [
	{
		id: 'ai-m1',
		number: 1,
		title: 'MCP Protocol & Architecture',
		subtitle: 'JSON-RPC 2.0, Tools/Resources, stdio/SSE',
		icon: Server,
	},
	{
		id: 'ai-m2',
		number: 2,
		title: 'Agentic Loops & Orchestration',
		subtitle: 'ReAct Engine, Cycle Detection, Context Budget',
		icon: Bot,
	},
	{
		id: 'ai-m3',
		number: 3,
		title: 'Tool Integration & Debugging',
		subtitle: 'Zod Validation, Error Recovery, Sandboxing',
		icon: Terminal,
	},
	{
		id: 'ai-m4',
		number: 4,
		title: 'RL Environments & SWE-Bench',
		subtitle: 'FAIL_TO_PASS Matrices, Docker Isolation',
		icon: Cpu,
	},
	{
		id: 'ai-m5',
		number: 5,
		title: 'Zara AI Engineer Interview',
		subtitle: '30-Min AI Recruiter Simulation + Scorecard',
		icon: Bot,
		isFinalBoss: true,
	},
]

export function MilestoneNav () {
	const {
		activeTrack,
		activeMilestoneId,
		setActiveMilestone,
		unlockedMilestones,
		completedMilestones,
		quizResults,
	} = useProgressStore()

	const milestones = activeTrack === 'frontend' ? FRONTEND_MILESTONES_META : AI_MILESTONES_META
	const currentTrackCompletedCount = milestones.filter(m => completedMilestones.includes(m.id)).length

	return (
		<aside className="w-full lg:w-80 shrink-0">
			<div className="rounded-2xl border border-surface-800 bg-surface-900/60 p-4 backdrop-blur-sm sticky top-20">
				<div className="mb-3 flex items-center justify-between px-1">
					<h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
						{activeTrack === 'frontend' ? 'Frontend Roadmap' : 'AI Engineer Roadmap'}
					</h2>
					<span className="text-xs text-brand-400 font-medium">
						{currentTrackCompletedCount} / {milestones.length} Completed
					</span>
				</div>

				<nav className="flex flex-col gap-2">
					{milestones.map((item) => {
						const isUnlocked = unlockedMilestones.includes(item.id)
						const isCompleted = completedMilestones.includes(item.id)
						const isActive = activeMilestoneId === item.id
						const quizResult = quizResults[item.id]
						const Icon = item.icon

						return (
							<button
								key={item.id}
								disabled={!isUnlocked}
								onClick={() => setActiveMilestone(item.id)}
								className={`group relative flex w-full items-center gap-3.5 rounded-xl p-3 text-left transition-all ${
									isActive
										? 'bg-gradient-to-r from-brand-600/20 to-purple-600/10 border border-brand-500/40 shadow-lg shadow-brand-500/10'
										: isUnlocked
											? 'hover:bg-surface-800/80 border border-transparent text-slate-300'
											: 'opacity-50 cursor-not-allowed border border-transparent text-slate-500'
								}`}
							>
								{/* Icon Badge */}
								<div
									className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
										item.isFinalBoss
											? isActive
												? 'bg-gradient-to-tr from-purple-500 to-pink-500 text-white glow-brand'
												: isUnlocked
													? 'bg-purple-950 text-purple-400 border border-purple-800'
													: 'bg-surface-800 text-slate-600'
											: isActive
												? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
												: isCompleted
													? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
													: isUnlocked
														? 'bg-surface-800 text-slate-300 group-hover:bg-surface-700'
														: 'bg-surface-800/50 text-slate-600'
									}`}
								>
									<Icon className="h-5 w-5" />
								</div>

								{/* Info */}
								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-1.5">
										<span className="text-[11px] font-semibold text-slate-400">
											M{item.number}
										</span>
										<h3
											className={`text-sm font-semibold truncate ${
												isActive
													? 'text-white'
													: isUnlocked
														? 'text-slate-200'
														: 'text-slate-500'
											}`}
										>
											{item.title}
										</h3>
									</div>
									<p className="text-xs text-slate-400 truncate mt-0.5">
										{item.subtitle}
									</p>
								</div>

								{/* Status Badges */}
								<div className="shrink-0">
									{isCompleted ? (
										<div className="flex items-center gap-1 text-emerald-400">
											{quizResult && (
												<span className="text-[11px] font-bold">
													{quizResult.score}/{quizResult.total}
												</span>
											)}
											<CheckCircle2 className="h-4 w-4" />
										</div>
									) : !isUnlocked ? (
										<Lock className="h-4 w-4 text-slate-600" />
									) : (
										<ChevronRight
											className={`h-4 w-4 transition ${
												isActive ? 'text-brand-400 translate-x-0.5' : 'text-slate-500'
											}`}
										/>
									)}
								</div>

								{item.isFinalBoss && isUnlocked && !isCompleted && (
									<span className="absolute -top-1 -right-1 flex h-3 w-3">
										<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
										<span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
									</span>
								)}
							</button>
						)
					})}
				</nav>

				{/* Quick Tip Box */}
				<div className="mt-4 rounded-xl border border-surface-800 bg-surface-950/60 p-3 text-xs text-slate-400">
					<div className="flex items-center gap-1.5 font-semibold text-brand-300 mb-1">
						<Sparkles className="h-3.5 w-3.5" />
						<span>Micro1 AI Tip</span>
					</div>
					<p className="leading-relaxed">
						{activeTrack === 'frontend'
							? 'Pass each module diagnostic quiz with >=80% score to unlock the next milestone. Finish all 5 to tackle Zara AI!'
							: 'Master MCP JSON-RPC protocol, ReAct loops, and SWE-bench test matrices to pass the 30-min AI screening!'}
					</p>
				</div>
			</div>
		</aside>
	)
}
