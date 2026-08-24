import { useState } from 'react'
import { Server, ArrowRight, CheckCircle2, Terminal, Network, ShieldCheck, Sparkles } from 'lucide-react'

interface ProtocolStep {
	id: string
	title: string
	badge: string
	method: string
	direction: 'Client -> Server' | 'Server -> Client'
	requestPayload: string
	responsePayload: string
	transportDetails: string
	protocolInsight: string
}

const MCP_STEPS: ProtocolStep[] = [
	{
		id: 'handshake',
		title: '1. Protocol Handshake & Capabilities Negotiation',
		badge: 'Lifecycle Init',
		method: 'initialize',
		direction: 'Client -> Server',
		requestPayload: `{\n  "jsonrpc": "2.0",\n  "id": 1,\n  "method": "initialize",\n  "params": {\n    "protocolVersion": "2024-11-05",\n    "capabilities": {\n      "roots": { "listChanged": true },\n      "sampling": {}\n    },\n    "clientInfo": {\n      "name": "micro1-agent-harness",\n      "version": "2.1.0"\n    }\n  }\n}`,
		responsePayload: `{\n  "jsonrpc": "2.0",\n  "id": 1,\n  "result": {\n    "protocolVersion": "2024-11-05",\n    "capabilities": {\n      "tools": { "listChanged": true },\n      "resources": { "subscribe": true }\n    },\n    "serverInfo": {\n      "name": "docker-sandbox-mcp",\n      "version": "1.0.4"\n    }\n  }\n}`,
		transportDetails: 'stdio / SSE Handshake: Exchanging protocol version and supported feature flags.',
		protocolInsight: 'Capabilities negotiation ensures the host knows whether the server supports dynamic tool notifications and resource subscriptions before making queries.',
	},
	{
		id: 'tools-list',
		title: '2. Dynamic Tool Discovery (tools/list)',
		badge: 'Schema Registration',
		method: 'tools/list',
		direction: 'Client -> Server',
		requestPayload: `{\n  "jsonrpc": "2.0",\n  "id": 2,\n  "method": "tools/list",\n  "params": {}\n}`,
		responsePayload: `{\n  "jsonrpc": "2.0",\n  "id": 2,\n  "result": {\n    "tools": [\n      {\n        "name": "run_sandbox_command",\n        "description": "Executes shell commands in isolated Docker container",\n        "inputSchema": {\n          "type": "object",\n          "properties": {\n            "command": { "type": "string", "description": "Shell command to run" },\n            "timeoutMs": { "type": "number", "default": 5000 }\n          },\n          "required": ["command"]\n        }\n      }\n    ]\n  }\n}`,
		transportDetails: 'Tools are queried dynamically or on-demand, preventing context window saturation.',
		protocolInsight: 'Tools return strict JSON Schema definitions that models consume to format structured function calls with zero hallucination.',
	},
	{
		id: 'tools-call',
		title: '3. Tool Execution (tools/call)',
		badge: 'Action Execution',
		method: 'tools/call',
		direction: 'Client -> Server',
		requestPayload: `{\n  "jsonrpc": "2.0",\n  "id": 3,\n  "method": "tools/call",\n  "params": {\n    "name": "run_sandbox_command",\n    "arguments": {\n      "command": "pytest tests/test_auth.py -k test_jwt_expiry",\n      "timeoutMs": 5000\n    }\n  }\n}`,
		responsePayload: `{\n  "jsonrpc": "2.0",\n  "id": 3,\n  "result": {\n    "content": [\n      {\n        "type": "text",\n        "text": "=== 1 failed in 0.42s ===\\nAssertionError: Token expired at timestamp 1724500000"\n      }\n    ],\n    "isError": false\n  }\n}`,
		transportDetails: 'stdio execution: Process writes JSON-RPC result to stdout. Diagnostic logs route to stderr.',
		protocolInsight: 'Even if the command returns a failing test or exit code 1, isError is false at the protocol level—the tool output is passed to the LLM observation channel for reasoning.',
	},
	{
		id: 'resources-read',
		title: '4. Reading Static Context (resources/read)',
		badge: 'Resource Feed',
		method: 'resources/read',
		direction: 'Client -> Server',
		requestPayload: `{\n  "jsonrpc": "2.0",\n  "id": 4,\n  "method": "resources/read",\n  "params": {\n    "uri": "repo:///config/environment.json"\n  }\n}`,
		responsePayload: `{\n  "jsonrpc": "2.0",\n  "id": 4,\n  "result": {\n    "contents": [\n      {\n        "uri": "repo:///config/environment.json",\n        "mimeType": "application/json",\n        "text": "{\\n  \\"node_env\\": \\"test\\",\\n  \\"auth_secret\\": \\"dev_secret_key_123\\"\\n}"\n      }\n    ]\n  }\n}`,
		transportDetails: 'Resources provide URI-addressed read-only context streams without executing side effects.',
		protocolInsight: 'Resources are application-controlled data feeds that agents reference directly by URI, ideal for documentation, database schemas, and configuration snapshots.',
	},
]

export function McpProtocolInspector () {
	const [activeStepIndex, setActiveStepIndex] = useState(0)
	const [transportMode, setTransportMode] = useState<'stdio' | 'sse'>('stdio')

	const currentStep = MCP_STEPS[activeStepIndex]

	return (
		<div className="rounded-2xl border border-surface-800 bg-surface-900/80 p-5 backdrop-blur-sm">
			{/* Header */}
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-4 mb-4">
				<div>
					<h3 className="text-base font-bold text-white flex items-center gap-2">
						<Server className="h-4 w-4 text-brand-400" />
						<span>Interactive MCP Protocol Inspector & JSON-RPC 2.0 Packet Analyzer</span>
					</h3>
					<p className="text-xs text-slate-400">
						Trace the step-by-step bidirectional message exchange between the MCP Host/Client and Server.
					</p>
				</div>

				{/* Transport Toggle */}
				<div className="flex items-center gap-2 rounded-xl bg-surface-950 p-1 border border-surface-800">
					<button
						onClick={() => setTransportMode('stdio')}
						className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
							transportMode === 'stdio'
								? 'bg-brand-600 text-white'
								: 'text-slate-400 hover:text-slate-200'
						}`}
					>
						<Terminal className="h-3.5 w-3.5" />
						<span>stdio (Process Pipes)</span>
					</button>
					<button
						onClick={() => setTransportMode('sse')}
						className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
							transportMode === 'sse'
								? 'bg-purple-600 text-white'
								: 'text-slate-400 hover:text-slate-200'
						}`}
					>
						<Network className="h-3.5 w-3.5" />
						<span>SSE / HTTP Streaming</span>
					</button>
				</div>
			</div>

			{/* Steps Progress Bar */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-5">
				{MCP_STEPS.map((step, idx) => {
					const isActive = idx === activeStepIndex
					const isPast = idx < activeStepIndex
					return (
						<button
							key={step.id}
							onClick={() => setActiveStepIndex(idx)}
							className={`flex items-center justify-between rounded-xl p-3 text-left transition border ${
								isActive
									? 'bg-brand-600/20 border-brand-500/50 shadow-md shadow-brand-500/10 text-white'
									: isPast
										? 'bg-surface-950/80 border-surface-800 text-slate-300'
										: 'bg-surface-950/40 border-surface-800/60 text-slate-500'
							}`}
						>
							<div className="min-w-0 flex-1">
								<span className="text-[10px] uppercase font-bold text-brand-400 block mb-0.5">
									{step.badge}
								</span>
								<div className="text-xs font-bold truncate">
									{step.method}
								</div>
							</div>
							{isPast ? (
								<CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
							) : (
								<ArrowRight
									className={`h-4 w-4 shrink-0 transition ${
										isActive ? 'text-brand-400 translate-x-0.5' : 'text-slate-600'
									}`}
								/>
							)}
						</button>
					)
				})}
			</div>

			{/* Protocol Insight Banner */}
			<div className="mb-5 rounded-xl border border-brand-500/30 bg-brand-950/20 p-3.5 text-xs text-brand-200 flex items-start gap-2.5">
				<Sparkles className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
				<div>
					<strong className="text-white">Protocol Insight:</strong> {currentStep.protocolInsight}
					<div className="mt-1 text-[11px] text-slate-400 font-mono">
						Transport Note ({transportMode}): {currentStep.transportDetails}
					</div>
				</div>
			</div>

			{/* Packet Inspection Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{/* Client -> Server Request */}
				<div className="rounded-xl border border-surface-800 bg-surface-950 p-4 font-mono text-xs flex flex-col justify-between">
					<div>
						<div className="flex items-center justify-between border-b border-surface-800 pb-2 mb-3">
							<span className="text-[11px] font-bold uppercase text-blue-400 flex items-center gap-1.5">
								<Terminal className="h-3.5 w-3.5" />
								<span>Client Request &rarr; JSON-RPC 2.0</span>
							</span>
							<span className="text-[10px] rounded bg-blue-500/20 px-2 py-0.5 text-blue-300">
								method: {currentStep.method}
							</span>
						</div>
						<pre className="overflow-x-auto text-blue-200 leading-relaxed text-xs">
							<code>{currentStep.requestPayload}</code>
						</pre>
					</div>
					<div className="mt-3 pt-2 border-t border-surface-900 text-[11px] text-slate-500">
						Payload serialized as standard JSON-RPC 2.0 object with unique incremental id.
					</div>
				</div>

				{/* Server -> Client Response */}
				<div className="rounded-xl border border-surface-800 bg-surface-950 p-4 font-mono text-xs flex flex-col justify-between">
					<div>
						<div className="flex items-center justify-between border-b border-surface-800 pb-2 mb-3">
							<span className="text-[11px] font-bold uppercase text-emerald-400 flex items-center gap-1.5">
								<ShieldCheck className="h-3.5 w-3.5" />
								<span>Server Response &larr; JSON-RPC 2.0</span>
							</span>
							<span className="text-[10px] rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-300">
								result: 200 OK
							</span>
						</div>
						<pre className="overflow-x-auto text-emerald-300 leading-relaxed text-xs">
							<code>{currentStep.responsePayload}</code>
						</pre>
					</div>
					<div className="mt-3 pt-2 border-t border-surface-900 text-[11px] text-slate-500">
						Server responds on standard output matching the incoming request id.
					</div>
				</div>
			</div>
		</div>
	)
}
