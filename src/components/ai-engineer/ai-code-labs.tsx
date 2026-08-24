import { useState } from 'react'
import { useProgressStore } from '../../store/use-progress-store'
import { Server, Bot, Eye, CheckCircle, Cpu } from 'lucide-react'

export function AiEngineerCodeLabs () {
	const { markLabComplete, completedLabs } = useProgressStore()

	// Lab 1: MCP Server
	const [showSolution1, setShowSolution1] = useState(false)
	const isLab1Completed = completedLabs['ai-lab-mcp-server']

	// Lab 2: ReAct Loop
	const [showSolution2, setShowSolution2] = useState(false)
	const isLab2Completed = completedLabs['ai-lab-react-loop']

	// Lab 3: SWE-Bench Harness
	const [showSolution3, setShowSolution3] = useState(false)
	const isLab3Completed = completedLabs['ai-lab-swe-harness']

	return (
		<div className="flex flex-col gap-6">
			{/* Lab 1: MCP Server Implementation */}
			<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-3 mb-4">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400">
							<Server className="h-4 w-4" />
						</div>
						<div>
							<h4 className="text-sm font-bold text-white">
								Lab 1: Building a Type-Safe MCP Tool Server (TypeScript + Zod)
							</h4>
							<p className="text-xs text-slate-400">
								Expose a deterministic code search tool with strict JSON schema parameters and error handling.
							</p>
						</div>
					</div>
					{isLab1Completed && (
						<span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
							<CheckCircle className="h-3.5 w-3.5" />
							<span>Verified</span>
						</span>
					)}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="rounded-xl border border-surface-800 bg-surface-950 p-3 font-mono text-xs text-slate-300">
						<div className="flex justify-between items-center text-slate-500 text-[11px] mb-2 border-b border-surface-800 pb-1">
							<span>MCP Server Handler</span>
							<button
								onClick={() => setShowSolution1(!showSolution1)}
								className="flex items-center gap-1 text-brand-400 hover:text-brand-300"
							>
								<Eye className="h-3 w-3" />
								<span>{showSolution1 ? 'Hide' : 'View Golden Solution'}</span>
							</button>
						</div>
						<pre className="overflow-x-auto text-brand-200">
							<code>
								{showSolution1
									? `import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { z } from 'zod'

const GrepSchema = z.object({
  query: z.string().min(1).describe('Search term'),
  path: z.string().default('.')
})

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  if (req.params.name === 'grep_code') {
    const parse = GrepSchema.safeParse(req.params.arguments)
    if (!parse.success) {
      return { isError: true, content: [{ type: 'text', text: parse.error.message }] }
    }
    const results = await performGrep(parse.data.query, parse.data.path)
    return { content: [{ type: 'text', text: results }] }
  }
  throw new Error('Unknown tool')
})`
									: `// Click "View Golden Solution" to inspect MCP server handler`}
							</code>
						</pre>
					</div>

					<div className="flex flex-col justify-between rounded-xl border border-surface-800 bg-surface-950 p-4">
						<div>
							<span className="text-xs font-bold text-brand-400 uppercase tracking-wider block mb-1">
								Verification Checklist
							</span>
							<div className="space-y-1 text-xs text-slate-300 font-mono mt-2">
								<div className="text-emerald-400">✓ JSON-RPC 2.0 CallToolRequestSchema configured</div>
								<div className="text-emerald-400">✓ Zod runtime parameter validation on arguments</div>
								<div className="text-emerald-400">✓ Structured error payload returned on invalid input</div>
							</div>
						</div>

						<button
							onClick={() => markLabComplete('ai-lab-mcp-server')}
							className="w-full mt-4 rounded-xl bg-brand-600 hover:bg-brand-500 py-2.5 text-xs font-bold text-white transition shadow-md shadow-brand-500/20"
						>
							{isLab1Completed ? 'MCP Server Verified' : 'Verify MCP Server Implementation'}
						</button>
					</div>
				</div>
			</div>

			{/* Lab 2: ReAct Agent Loop */}
			<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-3 mb-4">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
							<Bot className="h-4 w-4" />
						</div>
						<div>
							<h4 className="text-sm font-bold text-white">
								Lab 2: Autonomous ReAct Loop with Cycle Detection
							</h4>
							<p className="text-xs text-slate-400">
								Implement an agentic loop with hard step limits, tool output truncation, and action cycle detection.
							</p>
						</div>
					</div>
					{isLab2Completed && (
						<span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
							<CheckCircle className="h-3.5 w-3.5" />
							<span>Verified</span>
						</span>
					)}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="rounded-xl border border-surface-800 bg-surface-950 p-3 font-mono text-xs text-slate-300">
						<div className="flex justify-between items-center text-slate-500 text-[11px] mb-2 border-b border-surface-800 pb-1">
							<span>ReAct Loop Engine</span>
							<button
								onClick={() => setShowSolution2(!showSolution2)}
								className="flex items-center gap-1 text-purple-400 hover:text-purple-300"
							>
								<Eye className="h-3 w-3" />
								<span>{showSolution2 ? 'Hide' : 'View Golden Solution'}</span>
							</button>
						</div>
						<pre className="overflow-x-auto text-purple-200">
							<code>
								{showSolution2
									? `async function executeReActAgent(goal: string, maxTurns = 15) {
  const history = [{ role: 'user', content: goal }]
  const seenActions = new Set<string>()

  for (let turn = 0; turn < maxTurns; turn++) {
    const step = await llmInference(history)
    if (step.isFinished) return step.finalResponse

    const actionHash = \`\${step.toolName}:\${JSON.stringify(step.args)}\`
    if (seenActions.has(actionHash)) {
      history.push({ role: 'system', content: '[LOOP DETECTED] Action repeated without change. Try another tool.' })
      continue
    }
    seenActions.add(actionHash)

    const rawOutput = await runTool(step.toolName, step.args)
    const truncatedOutput = truncateOutput(rawOutput, 2000)
    history.push({ role: 'tool', content: truncatedOutput })
  }
  throw new Error('Max turns exceeded')
}`
									: `// Click "View Golden Solution" to inspect ReAct engine logic`}
							</code>
						</pre>
					</div>

					<div className="flex flex-col justify-between rounded-xl border border-surface-800 bg-surface-950 p-4">
						<div>
							<span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1">
								Orchestration Criteria
							</span>
							<div className="space-y-1 text-xs text-slate-300 font-mono mt-2">
								<div className="text-emerald-400">✓ Max turn budget guardrail enforced</div>
								<div className="text-emerald-400">✓ Seen actions set identifies cycle loops</div>
								<div className="text-emerald-400">✓ Context output truncation prevents token overflow</div>
							</div>
						</div>

						<button
							onClick={() => markLabComplete('ai-lab-react-loop')}
							className="w-full mt-4 rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 text-xs font-bold text-white transition shadow-md shadow-purple-500/20"
						>
							{isLab2Completed ? 'ReAct Loop Verified' : 'Verify ReAct Agent Engine'}
						</button>
					</div>
				</div>
			</div>

			{/* Lab 3: SWE-Bench Verification Harness */}
			<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-3 mb-4">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
							<Cpu className="h-4 w-4" />
						</div>
						<div>
							<h4 className="text-sm font-bold text-white">
								Lab 3: Deterministic SWE-Bench Evaluation Harness
							</h4>
							<p className="text-xs text-slate-400">
								Structure an isolated grading script that verifies FAIL_TO_PASS and PASS_TO_PASS criteria against candidate diffs.
							</p>
						</div>
					</div>
					{isLab3Completed && (
						<span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
							<CheckCircle className="h-3.5 w-3.5" />
							<span>Verified</span>
						</span>
					)}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="rounded-xl border border-surface-800 bg-surface-950 p-3 font-mono text-xs text-slate-300">
						<div className="flex justify-between items-center text-slate-500 text-[11px] mb-2 border-b border-surface-800 pb-1">
							<span>Evaluation Harness</span>
							<button
								onClick={() => setShowSolution3(!showSolution3)}
								className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
							>
								<Eye className="h-3 w-3" />
								<span>{showSolution3 ? 'Hide' : 'View Golden Solution'}</span>
							</button>
						</div>
						<pre className="overflow-x-auto text-emerald-200">
							<code>
								{showSolution3
									? `async function gradeCandidatePatch(repoDir: string, patchDiff: string, testPatch: string, f2pTests: string[], p2pTests: string[]) {
  // 1. Clean repo to base commit
  await exec('git reset --hard && git clean -fdx', { cwd: repoDir })
  
  // 2. Apply candidate fix & evaluation test patch
  await exec(\`git apply << 'EOF'\\n\${patchDiff}\\nEOF\`, { cwd: repoDir })
  await exec(\`git apply << 'EOF'\\n\${testPatch}\\nEOF\`, { cwd: repoDir })

  // 3. Evaluate FAIL_TO_PASS (Bug Resolution)
  const f2p = await runPytest(repoDir, f2pTests)
  
  // 4. Evaluate PASS_TO_PASS (Regression Safety)
  const p2p = await runPytest(repoDir, p2pTests)

  return {
    resolved: f2p.allPassed && p2p.allPassed,
    score: f2p.allPassed && p2p.allPassed ? 1.0 : 0.0
  }
}`
									: `// Click "View Golden Solution" to inspect evaluation harness`}
							</code>
						</pre>
					</div>

					<div className="flex flex-col justify-between rounded-xl border border-surface-800 bg-surface-950 p-4">
						<div>
							<span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
								Harness Requirements
							</span>
							<div className="space-y-1 text-xs text-slate-300 font-mono mt-2">
								<div className="text-emerald-400">✓ Isolated base commit checkout</div>
								<div className="text-emerald-400">✓ Strict evaluation test patch isolation</div>
								<div className="text-emerald-400">✓ Dual FAIL_TO_PASS & PASS_TO_PASS grading</div>
							</div>
						</div>

						<button
							onClick={() => markLabComplete('ai-lab-swe-harness')}
							className="w-full mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white transition shadow-md shadow-emerald-500/20"
						>
							{isLab3Completed ? 'SWE Harness Verified' : 'Verify Evaluation Harness'}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
