import { useState } from 'react'
import { CheckCircle2, XCircle, FileCode, Layers, Play, RefreshCw, ShieldAlert, Cpu } from 'lucide-react'

interface TaskScenario {
	id: string
	instanceId: string
	repo: string
	bugDescription: string
	baseCommit: string
	failToPassTests: string[]
	passToPassTests: string[]
	candidates: {
		id: string
		name: string
		type: 'golden' | 'overfitted' | 'broken'
		patchDiff: string
		f2pResult: boolean
		p2pResult: boolean
		verdict: 'RESOLVED' | 'REJECTED'
		explanation: string
	}[]
}

const SCENARIOS: TaskScenario[] = [
	{
		id: 'django-auth-lock',
		instanceId: 'django__django-15284',
		repo: 'django/django',
		bugDescription: 'Atomic transaction rollback retains stale model cache during nested exception handling.',
		baseCommit: 'd4e5f6a1b2c3...',
		failToPassTests: [
			'tests.transactions.test_atomic.AtomicRollbackCacheTests.test_nested_stale_cache_invalidation',
		],
		passToPassTests: [
			'tests.transactions.test_atomic.AtomicRollbackCacheTests.test_standard_commit',
			'tests.transactions.test_atomic.AtomicRollbackCacheTests.test_multi_db_savepoint',
			'tests.transactions.test_atomic.AtomicRollbackCacheTests.test_savepoint_rollback',
		],
		candidates: [
			{
				id: 'cand-golden',
				name: 'Candidate 1: Golden Reference Solution (Minimal & General)',
				type: 'golden',
				patchDiff: `diff --git a/django/db/transaction.py b/django/db/transaction.py
--- a/django/db/transaction.py
+++ b/django/db/transaction.py
@@ -142,6 +142,7 @@ def on_commit(using, func):
     def rollback(self):
+        self.connection._clear_local_model_cache()
         self.connection.rollback()`,
				f2pResult: true,
				p2pResult: true,
				verdict: 'RESOLVED',
				explanation: 'Cleanly invalidates the local connection cache on rollback without introducing side effects. Passes both reproduction test and full regression suite.',
			},
			{
				id: 'cand-overfit',
				name: 'Candidate 2: Overfitted / Reward-Hacked Patch',
				type: 'overfitted',
				patchDiff: `diff --git a/django/db/transaction.py b/django/db/transaction.py
--- a/django/db/transaction.py
+++ b/django/db/transaction.py
@@ -142,6 +142,7 @@ def rollback(self):
+        if 'test_nested_stale_cache' in sys.argv: return None`,
				f2pResult: true,
				p2pResult: false,
				verdict: 'REJECTED',
				explanation: 'Hardcoded test bypass! Passes FAIL_TO_PASS through reward hacking but catastrophically breaks PASS_TO_PASS regression tests.',
			},
			{
				id: 'cand-broken',
				name: 'Candidate 3: Incomplete Patch',
				type: 'broken',
				patchDiff: `diff --git a/django/db/transaction.py b/django/db/transaction.py
--- a/django/db/transaction.py
+++ b/django/db/transaction.py
@@ -142,6 +142,7 @@ def rollback(self):
+        self.is_active = False`,
				f2pResult: false,
				p2pResult: true,
				verdict: 'REJECTED',
				explanation: 'Fails to address the model cache invalidation bug. FAIL_TO_PASS test continues to fail with AssertionError.',
			},
		],
	},
]

export function SweBenchMatrixVisualizer () {
	const [activeScenarioIndex] = useState(0)
	const [selectedCandidateId, setSelectedCandidateId] = useState('cand-golden')
	const [isEvaluating, setIsEvaluating] = useState(false)
	const [evalStep, setEvalStep] = useState<number>(4) // 4 = fully evaluated

	const scenario = SCENARIOS[activeScenarioIndex]
	const currentCandidate = scenario.candidates.find(c => c.id === selectedCandidateId) || scenario.candidates[0]

	const handleRunEvaluation = () => {
		setIsEvaluating(true)
		setEvalStep(1)

		setTimeout(() => setEvalStep(2), 300)
		setTimeout(() => setEvalStep(3), 600)
		setTimeout(() => {
			setEvalStep(4)
			setIsEvaluating(false)
		}, 900)
	}

	return (
		<div className="rounded-2xl border border-surface-800 bg-surface-900/80 p-5 backdrop-blur-sm">
			{/* Header */}
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-4 mb-4">
				<div>
					<h3 className="text-base font-bold text-white flex items-center gap-2">
						<Cpu className="h-4 w-4 text-emerald-400" />
						<span>SWE-Bench Deterministic Test Matrix & Verification Harness</span>
					</h3>
					<p className="text-xs text-slate-400">
						Explore how FAIL_TO_PASS and PASS_TO_PASS test matrices evaluate candidate patches without test leakage.
					</p>
				</div>

				<div className="flex items-center gap-2">
					<button
						onClick={handleRunEvaluation}
						disabled={isEvaluating}
						className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition"
					>
						{isEvaluating ? (
							<RefreshCw className="h-3.5 w-3.5 animate-spin" />
						) : (
							<Play className="h-3.5 w-3.5 fill-current" />
						)}
						<span>Run Verification Pipeline</span>
					</button>
				</div>
			</div>

			{/* Task Summary Banner */}
			<div className="rounded-xl border border-surface-800 bg-surface-950 p-4 mb-5 text-xs">
				<div className="flex flex-wrap items-center justify-between gap-2 mb-2">
					<div className="flex items-center gap-2">
						<span className="rounded bg-brand-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-brand-300">
							{scenario.instanceId}
						</span>
						<span className="text-slate-400 font-mono">repo: {scenario.repo}</span>
					</div>
					<span className="text-slate-500 font-mono text-[11px]">base: {scenario.baseCommit}</span>
				</div>
				<p className="text-slate-300 font-medium">{scenario.bugDescription}</p>
			</div>

			{/* Candidate Selection Buttons */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
				{scenario.candidates.map((cand) => {
					const isSelected = cand.id === selectedCandidateId
					return (
						<button
							key={cand.id}
							onClick={() => {
								setSelectedCandidateId(cand.id)
								setEvalStep(4)
							}}
							className={`rounded-xl p-3 text-left transition border ${
								isSelected
									? 'bg-surface-950 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
									: 'bg-surface-950/60 border-surface-800 text-slate-400 hover:text-slate-200'
							}`}
						>
							<div className="flex items-center justify-between mb-1">
								<span
									className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
										cand.type === 'golden'
											? 'bg-emerald-500/20 text-emerald-300'
											: cand.type === 'overfitted'
												? 'bg-rose-500/20 text-rose-300'
												: 'bg-amber-500/20 text-amber-300'
									}`}
								>
									{cand.type}
								</span>
								<span className="text-xs font-bold text-slate-300 font-mono">
									{cand.verdict}
								</span>
							</div>
							<div className="text-xs font-semibold text-white truncate">{cand.name}</div>
						</button>
					)
				})}
			</div>

			{/* Two Column Grid: Patch Diff vs Test Matrix Results */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{/* Patch Diff */}
				<div className="rounded-xl border border-surface-800 bg-surface-950 p-4 font-mono text-xs">
					<div className="flex items-center justify-between border-b border-surface-800 pb-2 mb-2 text-slate-400">
						<span className="flex items-center gap-1.5 text-blue-400 font-bold">
							<FileCode className="h-3.5 w-3.5" />
							<span>Candidate Patch Diff</span>
						</span>
						<span className="text-[10px] uppercase text-slate-500">git apply</span>
					</div>
					<pre className="overflow-x-auto text-slate-300 leading-relaxed text-[11px]">
						<code>{currentCandidate.patchDiff}</code>
					</pre>
					<div className="mt-3 pt-2 border-t border-surface-800 text-[11px] text-slate-400 italic">
						{currentCandidate.explanation}
					</div>
				</div>

				{/* Deterministic Test Matrix Evaluation */}
				<div className="rounded-xl border border-surface-800 bg-surface-950 p-4 flex flex-col justify-between">
					<div>
						<div className="flex items-center justify-between border-b border-surface-800 pb-2 mb-3">
							<span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase">
								<Layers className="h-3.5 w-3.5" />
								<span>Grading Harness Matrix</span>
							</span>
							<span
								className={`text-xs font-bold px-2 py-0.5 rounded ${
									currentCandidate.verdict === 'RESOLVED'
										? 'bg-emerald-500/20 text-emerald-300'
										: 'bg-rose-500/20 text-rose-300'
								}`}
							>
								{evalStep >= 4 ? currentCandidate.verdict : 'RUNNING...'}
							</span>
						</div>

						{/* FAIL_TO_PASS Status */}
						<div className="mb-4">
							<div className="flex items-center justify-between text-xs font-bold mb-1">
								<span className="text-slate-300">1. FAIL_TO_PASS (Bug Fix Verification)</span>
								{evalStep >= 3 ? (
									currentCandidate.f2pResult ? (
										<span className="flex items-center gap-1 text-emerald-400 text-[11px]">
											<CheckCircle2 className="h-3.5 w-3.5" /> PASSED
										</span>
									) : (
										<span className="flex items-center gap-1 text-rose-400 text-[11px]">
											<XCircle className="h-3.5 w-3.5" /> FAILED
										</span>
									)
								) : (
									<span className="text-slate-500 text-[11px]">Pending...</span>
								)}
							</div>
							<div className="space-y-1 font-mono text-[11px]">
								{scenario.failToPassTests.map((t, idx) => (
									<div key={idx} className="rounded bg-surface-900 px-2 py-1 text-slate-400 truncate">
										{t}
									</div>
								))}
							</div>
						</div>

						{/* PASS_TO_PASS Status */}
						<div className="mb-2">
							<div className="flex items-center justify-between text-xs font-bold mb-1">
								<span className="text-slate-300">2. PASS_TO_PASS (Regression Safety)</span>
								{evalStep >= 4 ? (
									currentCandidate.p2pResult ? (
										<span className="flex items-center gap-1 text-emerald-400 text-[11px]">
											<CheckCircle2 className="h-3.5 w-3.5" /> 3/3 PASSED
										</span>
									) : (
										<span className="flex items-center gap-1 text-rose-400 text-[11px]">
											<XCircle className="h-3.5 w-3.5" /> REGRESSION DETECTED
										</span>
									)
								) : (
									<span className="text-slate-500 text-[11px]">Pending...</span>
								)}
							</div>
							<div className="space-y-1 font-mono text-[11px]">
								{scenario.passToPassTests.map((t, idx) => (
									<div key={idx} className="rounded bg-surface-900 px-2 py-1 text-slate-400 truncate">
										{t}
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="mt-3 pt-2 border-t border-surface-900 text-[11px] text-slate-500 flex items-center gap-1.5">
						<ShieldAlert className="h-3.5 w-3.5 text-brand-400 shrink-0" />
						<span>Evaluation test patches remain strictly hidden during agent reasoning.</span>
					</div>
				</div>
			</div>
		</div>
	)
}
