import { useState } from 'react'
import { MILESTONE_2_DATA } from '../../../data/milestone-2-data'
import { RerenderVisualizer } from './rerender-visualizer'
import { Milestone2CodeLab } from './code-lab'
import { QuizEngine } from '../../common/quiz-engine'
import {
	BookOpen,
	Layers,
	Terminal,
	HelpCircle,
	Sparkles,
	AlertTriangle,
	CheckCircle2,
	Clock,
} from 'lucide-react'

export function Milestone2Page () {
	const [activeTab, setActiveTab] = useState<'theory' | 'sandbox' | 'labs' | 'quiz'>('theory')

	return (
		<div className="flex flex-col gap-6">
			{/* Banner */}
			<div className="rounded-2xl border border-surface-800 bg-gradient-to-r from-surface-900 via-surface-900 to-indigo-950/40 p-6 backdrop-blur-md">
				<div className="flex flex-wrap items-center justify-between gap-4 mb-2">
					<div className="flex items-center gap-2">
						<span className="rounded-md bg-indigo-500/20 px-2.5 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
							Milestone 2
						</span>
						<span className="flex items-center gap-1 text-xs text-slate-400">
							<Clock className="h-3.5 w-3.5" />
							{MILESTONE_2_DATA.estimatedTime}
						</span>
					</div>
					<span className="text-xs text-slate-400 font-medium">
						Pass quiz with &ge; 80% to unlock Milestone 3
					</span>
				</div>

				<h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
					{MILESTONE_2_DATA.title}
				</h1>
				<p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
					{MILESTONE_2_DATA.subtitle}
				</p>

				{/* Tab Bar */}
				<div className="flex flex-wrap items-center gap-2 mt-6 border-t border-surface-800 pt-4">
					<button
						onClick={() => setActiveTab('theory')}
						className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
							activeTab === 'theory'
								? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
								: 'bg-surface-950/80 text-slate-400 hover:text-slate-200 border border-surface-800'
						}`}
					>
						<BookOpen className="h-4 w-4" />
						<span>1. Theory & Cheat Sheet</span>
					</button>

					<button
						onClick={() => setActiveTab('sandbox')}
						className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
							activeTab === 'sandbox'
								? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
								: 'bg-surface-950/80 text-slate-400 hover:text-slate-200 border border-surface-800'
						}`}
					>
						<Layers className="h-4 w-4" />
						<span>2. Re-render Sandbox</span>
					</button>

					<button
						onClick={() => setActiveTab('labs')}
						className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
							activeTab === 'labs'
								? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
								: 'bg-surface-950/80 text-slate-400 hover:text-slate-200 border border-surface-800'
						}`}
					>
						<Terminal className="h-4 w-4" />
						<span>3. Code Labs</span>
					</button>

					<button
						onClick={() => setActiveTab('quiz')}
						className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
							activeTab === 'quiz'
								? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
								: 'bg-surface-950/80 text-slate-400 hover:text-slate-200 border border-surface-800'
						}`}
					>
						<HelpCircle className="h-4 w-4" />
						<span>4. Diagnostic Quiz</span>
					</button>
				</div>
			</div>

			{/* Tab Content */}
			{activeTab === 'theory' && (
				<div className="flex flex-col gap-6">
					{MILESTONE_2_DATA.theorySections.map((section) => (
						<div
							key={section.id}
							className="rounded-2xl border border-surface-800 bg-surface-900/60 p-6 backdrop-blur-sm"
						>
							<div className="flex items-center gap-2 mb-2">
								<span className="rounded bg-indigo-500/15 text-indigo-300 text-[10px] font-bold px-2 py-0.5 border border-indigo-500/20">
									{section.badge}
								</span>
								<h3 className="text-lg font-bold text-white">
									{section.title}
								</h3>
							</div>

							<p className="text-sm text-slate-300 mb-4 leading-relaxed">
								{section.summary}
							</p>

							<div className="space-y-2 mb-6">
								{section.bulletPoints.map((pt, i) => (
									<div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
										<CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
										<span className="leading-relaxed">{pt}</span>
									</div>
								))}
							</div>

							{section.codeExamples.map((ex, i) => (
								<div key={i} className="mb-6 rounded-xl border border-surface-800 bg-surface-950 p-4">
									<div className="text-xs font-bold text-indigo-300 mb-2">{ex.title}</div>
									<pre className="overflow-x-auto font-mono text-xs text-indigo-200">
										<code>{ex.code}</code>
									</pre>
									<p className="text-xs text-slate-400 mt-2 italic">{ex.explanation}</p>
								</div>
							))}

							<div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4">
								<div className="flex items-center gap-2 font-bold text-purple-300 text-xs mb-3">
									<Sparkles className="h-4 w-4 text-purple-400" />
									<span>Micro1 AI Evaluation Strategy (Zara Rubric)</span>
								</div>

								<div className="space-y-3 text-xs">
									<div>
										<span className="font-semibold text-purple-200">Why Zara evaluates this:</span>
										<p className="text-slate-300 mt-0.5">{section.interviewCheatSheet.whyZaraAsks}</p>
									</div>

									<div>
										<span className="font-semibold text-emerald-300">Golden Keyphrases to verbalize:</span>
										<ul className="list-disc list-inside text-slate-300 mt-1 space-y-1">
											{section.interviewCheatSheet.keyPhrasesToSay.map((phrase, pi) => (
												<li key={pi}><span className="text-emerald-200 font-mono text-[11px]">&quot;{phrase}&quot;</span></li>
											))}
										</ul>
									</div>

									<div>
										<span className="font-semibold text-rose-300 flex items-center gap-1">
											<AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
											<span>Common Candidate Traps to Avoid:</span>
										</span>
										<ul className="list-disc list-inside text-slate-400 mt-1 space-y-1">
											{section.interviewCheatSheet.commonCandidateTraps.map((trap, ti) => (
												<li key={ti}>{trap}</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{activeTab === 'sandbox' && <RerenderVisualizer />}
			{activeTab === 'labs' && <Milestone2CodeLab />}
			{activeTab === 'quiz' && (
				<QuizEngine
					milestoneId={MILESTONE_2_DATA.id}
					milestoneTitle={MILESTONE_2_DATA.shortTitle}
					nextMilestoneId="m3"
					questions={MILESTONE_2_DATA.quiz}
				/>
			)}
		</div>
	)
}
