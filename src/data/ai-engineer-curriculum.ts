import { Milestone } from '../types/curriculum'

export const AI_MILESTONE_1_MCP: Milestone = {
	id: 'ai-m1',
	number: 1,
	title: 'Model Context Protocol (MCP) Architecture & Protocol Deep Dive',
	shortTitle: 'MCP Protocol & Architecture',
	subtitle: 'Client-Host-Server Triad, JSON-RPC 2.0, Tools/Resources/Prompts, Transports (stdio vs SSE) & Schema Management',
	category: 'mcp',
	estimatedTime: '25 mins',
	theorySections: [
		{
			id: 'mcp-architecture-triad',
			title: 'The MCP Architecture: Host, Client & Server Triad',
			badge: 'Protocol Foundation',
			summary: 'Model Context Protocol (MCP) is an open standard that enables AI applications (Hosts) to securely connect to external tools, databases, and context repositories (Servers) through standardized client protocols.',
			bulletPoints: [
				'Host Application: The AI IDE or assistant (e.g. Claude Desktop, Antigravity, Cursor) that provides the user interface and coordinates agentic workflows.',
				'MCP Client: The protocol client embedded within the Host that manages 1:1 connections with MCP servers, performs capabilities negotiation, and routes tool calls.',
				'MCP Server: A lightweight service exposing three core primitives: Tools (executable actions), Resources (context/data feeds), and Prompts (reusable templates).',
				'Standardized JSON-RPC 2.0: All communication between Client and Server happens via JSON-RPC 2.0 over pluggable transports.',
			],
			codeExamples: [
				{
					title: 'MCP Protocol Handshake & Capabilities Negotiation (JSON-RPC 2.0)',
					code: `// 1. Client -> Server: initialize request
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "roots": { "listChanged": true },
      "sampling": {}
    },
    "clientInfo": {
      "name": "antigravity-client",
      "version": "1.0.0"
    }
  }
}

// 2. Server -> Client: initialize response
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": { "listChanged": true },
      "resources": { "subscribe": true }
    },
    "serverInfo": {
      "name": "postgres-mcp-server",
      "version": "0.4.1"
    }
  }
}`,
					explanation: 'The handshake establishes protocol compatibility and informs the client which capabilities (Tools, Resources, Subscriptions) the server supports.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Micro1 evaluates whether you understand MCP system architecture from first principles and can design enterprise-grade tool servers for AI training environments.',
				keyPhrasesToSay: [
					'MCP decouples the AI model from backend data silos via a standardized JSON-RPC 2.0 interface.',
					'The Client-Host-Server triad enables modular, secure tool discovery and execution.',
					'Capabilities negotiation during initialization dictates supported server primitives.',
				],
				commonCandidateTraps: [
					'Thinking MCP is just another REST API instead of a bidirectional JSON-RPC 2.0 protocol supporting notifications and subscriptions.',
				],
			},
		},
		{
			id: 'mcp-primitives-deep-dive',
			title: 'MCP Core Primitives: Tools, Resources & Prompts',
			badge: 'Primitive Mechanics',
			summary: 'MCP defines three distinct primitives to separate executable actions, read-only data feeds, and pre-engineered prompt workflows.',
			bulletPoints: [
				'Tools (Model-Controlled): Executable functions with strict JSON Schema input definitions that models call to perform actions (e.g. execute_sql, fetch_logs, git_commit).',
				'Resources (Application/User-Controlled): URI-addressed read-only data payloads (e.g. file:///logs/error.log, db://users/schema) that provide static or streaming context.',
				'Prompts (User-Controlled): Parameterized prompt templates exposed by the server to guide users in executing specialized multi-step tasks.',
				'Eager vs Lazy Loading: Eager registration injects all tool schemas into the system prompt; Lazy loading registers a schema discovery tool (tools/list) to prevent context window explosion.',
			],
			codeExamples: [
				{
					title: 'Defining an MCP Tool with Schema Validation in TypeScript',
					code: `import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'

const server = new Server({ name: 'code-analyzer', version: '1.0.0' }, {
  capabilities: { tools: {} }
})

// 1. Expose Tool Definition
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: 'analyze_ast',
    description: 'Parses source code into AST and extracts syntax errors',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: { type: 'string', description: 'Absolute path to file' },
        includeTokens: { type: 'boolean', default: false }
      },
      required: ['filePath']
    }
  }]
}))

// 2. Handle Tool Execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'analyze_ast') {
    const { filePath } = request.params.arguments as { filePath: string }
    return {
      content: [{ type: 'text', text: \`Analyzed \${filePath}: No syntax errors found.\` }]
    }
  }
  throw new Error('Tool not found')
})`,
					explanation: 'The server defines both the tool schema (with required parameters) and the deterministic execution handler.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Assesses whether you can structure clean tool contracts that AI models can reason over without hallucinating parameters.',
				keyPhrasesToSay: [
					'Tools are model-invoked executable actions; Resources are URI-addressed context streams.',
					'Strict JSON Schema parameters prevent LLM argument hallucination.',
					'Lazy tool schema loading conserves model context window tokens.',
				],
				commonCandidateTraps: [
					'Using vague tool parameter descriptions that cause the model to pass unstructured text instead of typed arguments.',
				],
			},
		},
		{
			id: 'mcp-transports',
			title: 'MCP Transports: Stdio vs Server-Sent Events (SSE)',
			badge: 'Transport Layer',
			summary: 'MCP operates over multiple transports: stdio for local subprocesses and SSE/HTTP for distributed, network-accessible remote servers.',
			bulletPoints: [
				'stdio Transport: Uses standard input (stdin) and standard output (stdout) of a spawned child process. Fast, zero-network overhead, completely sandboxed.',
				'SSE Transport (Server-Sent Events): Uses HTTP GET with text/event-stream for server-to-client notifications, and HTTP POST for client-to-server JSON-RPC requests.',
				'Security Isolation: stdio runs with local permissions; SSE requires token authentication (Bearer headers) and CORS configuration.',
				'Error Handling: Transport disconnection must trigger automatic reconnection backoff or clean resource disposal.',
			],
			codeExamples: [
				{
					title: 'stdio vs SSE Transport Flow Comparison',
					code: `// stdio Transport:
// Host Spawns: node ./build/index.js
// Client writes JSON-RPC request to process stdin
// Server writes JSON-RPC response to process stdout

// SSE Transport:
// 1. Client connects via GET /sse -> Server opens long-lived SSE stream
// 2. Server sends endpoint event: { endpoint: '/message?sessionId=abc-123' }
// 3. Client sends requests via POST /message?sessionId=abc-123
// 4. Server pushes responses and notifications through the open SSE stream`,
					explanation: 'stdio is ideal for local developer tools, while SSE provides real-time streaming over cloud networks.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Crucial for understanding how to deploy MCP benchmark servers in isolated Docker containers vs cloud infrastructure.',
				keyPhrasesToSay: [
					'stdio transport communicates over process pipes with zero network latency.',
					'SSE combines long-lived event streams for downstream push with HTTP POST for upstream requests.',
					'In Dockerized RL benchmark harnesses, stdio provides deterministic sandboxed isolation.',
				],
				commonCandidateTraps: [
					'Forgetting that stderr is reserved for logging in stdio servers—writing logs to stdout corrupts JSON-RPC message framing!',
				],
			},
		},
	],
	quiz: [
		{
			id: 'q-mcp-1',
			question: 'What is the primary communication protocol and format utilized by Model Context Protocol (MCP)?',
			options: [
				'GraphQL over WebSockets',
				'JSON-RPC 2.0 over pluggable transports (stdio, SSE)',
				'gRPC with Protocol Buffers',
				'REST with OpenAPI 3.0',
			],
			correctAnswerIndex: 1,
			conceptTag: 'MCP Protocol',
			explanation: 'MCP is built strictly on the JSON-RPC 2.0 specification, using bidirectional messages over standard input/output (stdio) or Server-Sent Events (SSE).',
		},
		{
			id: 'q-mcp-2',
			question: 'In an stdio MCP server, why is it critical that all diagnostic logs are printed to stderr instead of stdout?',
			options: [
				'stderr is faster than stdout in Node.js and Python.',
				'stdout is reserved exclusively for framed JSON-RPC 2.0 protocol packets; any unstructured text on stdout corrupts client message parsing.',
				'stderr automatically persists logs to a database.',
				'stdout only supports ASCII characters.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'stdio Transport',
			explanation: 'In stdio transport, stdout is the protocol channel. Emitting console.log text to stdout injects non-JSON data into the stream, causing the client to crash or drop the connection.',
		},
		{
			id: 'q-mcp-3',
			question: 'What is the key difference between MCP "Tools" and MCP "Resources"?',
			options: [
				'Tools are model-controlled executable functions that take parameters; Resources are URI-addressed read-only context feeds controlled by the application or user.',
				'Tools only work on local files; Resources only work on remote APIs.',
				'Tools are written in Python; Resources are written in TypeScript.',
				'There is no difference; they are aliases.',
			],
			correctAnswerIndex: 0,
			conceptTag: 'MCP Primitives',
			explanation: 'Tools are executable actions called dynamically by the AI model (with side effects or computed results), whereas Resources provide structured read-only context (like file contents or database tables) referenced by URIs.',
		},
		{
			id: 'q-mcp-4',
			question: 'Why is "Lazy Tool Loading" preferred over "Eager Schema Registration" when connecting to hundreds of MCP tools?',
			options: [
				'Lazy loading prevents context window token exhaustion and avoids degrading model instruction-following accuracy by keeping the prompt concise.',
				'Lazy loading allows tools to bypass security permissions.',
				'Eager registration is deprecated in the MCP specification.',
				'Lazy loading runs tools in parallel automatically.',
			],
			correctAnswerIndex: 0,
			conceptTag: 'Context Management',
			explanation: 'Injecting hundreds of tool schemas eagerly consumes thousands of tokens and confuses the model. Lazy loading exposes a discovery mechanism or lazy tool stubs, keeping the initial system prompt minimal.',
		},
		{
			id: 'q-mcp-5',
			question: 'What happens during the initial MCP Handshake phase?',
			options: [
				'The client downloads the server binary from GitHub.',
				'The client sends an "initialize" request with protocol version and client capabilities, and the server responds with its protocol version and supported capabilities (tools, resources, prompts).',
				'The server executes all available tools to benchmark latency.',
				'The server shuts down the client if no API key is present.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Capabilities Negotiation',
			explanation: 'The initialize exchange allows client and server to agree on a protocol version and declare supported features (capabilities negotiation) before any tool or resource operations begin.',
		},
	],
	codeChallenges: [],
}

export const AI_MILESTONE_2_AGENTIC: Milestone = {
	id: 'ai-m2',
	number: 2,
	title: 'Agentic AI Engineering, Orchestration & Autonomous Loops',
	shortTitle: 'Agentic Loops & Orchestration',
	subtitle: 'ReAct Loop Architecture, State Machines, Loop Guardrails, Subagents & Context Budgeting',
	category: 'agentic-ai',
	estimatedTime: '25 mins',
	theorySections: [
		{
			id: 'react-loop-mechanics',
			title: 'ReAct (Reason + Act) Execution Loop Architecture',
			badge: 'Agent Architecture',
			summary: 'The ReAct pattern interleaves reasoning (chain-of-thought) with tool actions and environment observations, allowing autonomous agents to dynamically solve complex multi-step problems.',
			bulletPoints: [
				'Thought Step: The model analyzes the current conversation history, goal state, and previous tool observations to plan its next action.',
				'Action Step: The model outputs a structured tool call request with validated parameters.',
				'Observation Step: The execution runtime invokes the tool in the environment and appends the real output back into the conversation context.',
				'Convergence Check: The loop terminates when the model determines the objective is met and produces a final user response or completion verdict.',
			],
			codeExamples: [
				{
					title: 'Deterministic ReAct Execution Loop Implementation in TypeScript',
					code: `interface AgentState {
  messages: Array<{ role: 'user' | 'assistant' | 'tool'; content: string; toolCall?: any }>
  stepCount: number
  isDone: boolean
}

async function runReActAgent(userGoal: string, maxSteps = 10): Promise<string> {
  const state: AgentState = {
    messages: [{ role: 'user', content: userGoal }],
    stepCount: 0,
    isDone: false
  }

  while (!state.isDone && state.stepCount < maxSteps) {
    state.stepCount++
    
    // 1. Model inference with tool schemas
    const response = await callLLM(state.messages)
    
    if (response.toolCall) {
      // 2. Execute tool in sandbox
      const observation = await executeTool(response.toolCall.name, response.toolCall.arguments)
      
      // 3. Append thought & tool observation
      state.messages.push({ role: 'assistant', content: response.thought, toolCall: response.toolCall })
      state.messages.push({ role: 'tool', content: observation })
    } else {
      // 4. Model completed task
      state.isDone = true
      return response.finalAnswer
    }
  }

  throw new Error('Agent exceeded max step limit without convergence')
}`,
					explanation: 'The loop coordinates model reasoning and tool output until the model provides a final answer or hits step limits.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Micro1 evaluates whether you understand autonomous agent convergence, how LLMs fail in long horizons, and how to build deterministic execution environments.',
				keyPhrasesToSay: [
					'ReAct interleaves chain-of-thought planning with real-world tool observations.',
					'Strict step budgets and cycle detectors prevent runaway infinite loops.',
					'Observations must be clean, structured, and token-truncated.',
				],
				commonCandidateTraps: [
					'Not implementing a cycle detector or max-iteration cutoff, causing agents to burn tokens on identical failing actions.',
				],
			},
		},
		{
			id: 'infinite-loop-guardrails',
			title: 'Infinite Loop Detection, Context Compaction & Error Recovery',
			badge: 'Robustness & Reliability',
			summary: 'Autonomous agents frequently fall into repetitive loops when tools return non-descriptive errors. Robust agents use cycle hashing, exponential backoff, and context compaction.',
			bulletPoints: [
				'Cycle Hashing: Hashing the tuple (tool_name, arguments_hash, error_signature) to detect if an agent is repeating the exact same failed action.',
				'Remediation Hints: When a tool fails, returning a structured error message explaining WHY it failed and offering guidance forces the model to adjust its strategy.',
				'Context Compaction & Rolling Buffers: Truncating multi-megabyte terminal logs to keep context under the model limit and reduce attention distraction.',
				'Multi-Agent Hierarchies: Delegating subtasks to isolated subagents with separate scratchpads to prevent context bloat in the main controller.',
			],
			codeExamples: [
				{
					title: 'Cycle Detection & Remediation Hint Generator',
					code: `const actionHistory = new Map<string, number>()

function validateAgentAction(toolName: string, args: Record<string, any>): void {
  const actionKey = \`\${toolName}:\${JSON.stringify(args)}\`
  const count = (actionHistory.get(actionKey) || 0) + 1
  actionHistory.set(actionKey, count)

  if (count >= 3) {
    throw new Error(
      \`[CYCLE DETECTED] You have executed \${toolName} with identical arguments \${count} times. ` +
      `Stop repeating this action. Review previous error output and choose an alternative strategy.\`
    )
  }
}`,
					explanation: 'Cycle detection breaks repetitive model loops by injecting explicit steering feedback directly into the observation channel.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Crucial for RL dataset creation where autonomous agents must explore state spaces without getting stuck in dead ends.',
				keyPhrasesToSay: [
					'Cycle detection identifies repetitive action hashes and forces strategy pivots.',
					'Actionable error feedback turns failed tool calls into self-correction opportunities.',
					'Subagent isolation prevents intermediate scratchpad tokens from polluting the primary supervisor.',
				],
				commonCandidateTraps: [
					'Returning empty error strings or throwing unhandled exceptions that terminate the agent instead of providing an observation.',
				],
			},
		},
	],
	quiz: [
		{
			id: 'q-agent-1',
			question: 'What are the three core interleaved steps in a classic ReAct agent loop?',
			options: [
				'Compile, Test, Deploy',
				'Reason (Thought), Act (Tool Call), Observe (Environment Feedback)',
				'Prompt, Tokenize, Sample',
				'Map, Filter, Reduce',
			],
			correctAnswerIndex: 1,
			conceptTag: 'ReAct Architecture',
			explanation: 'ReAct interleaves Reasoning (planning what to do), Action (invoking a specific tool), and Observation (reading real tool results from the environment).',
		},
		{
			id: 'q-agent-2',
			question: 'How should an agent runtime handle a tool execution error to maximize the chance of autonomous recovery?',
			options: [
				'Immediately terminate the entire agent process with exit code 1.',
				'Format the error as a structured observation message with actionable remediation hints and feed it back into the conversation context.',
				'Silently ignore the error and return an empty string.',
				'Reset the conversation history to the initial user prompt.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Error Recovery',
			explanation: 'Feeding structured error messages with remediation hints allows the LLM to inspect the failure reason and self-correct its next tool call dynamically.',
		},
		{
			id: 'q-agent-3',
			question: 'What is the primary purpose of hierarchical subagent delegation in complex tasks?',
			options: [
				'To bypass rate limits by using multiple API keys.',
				'To isolate noisy intermediate tool outputs and detailed research scratchpads into separate context windows, preserving clean high-level state for the supervisor.',
				'To run different programming languages in parallel.',
				'Subagents are only used for UI rendering.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Multi-Agent Systems',
			explanation: 'Subagents keep heavy intermediate context (e.g. 50 search results or huge logs) isolated from the parent agent, preventing context overflow and hallucination.',
		},
		{
			id: 'q-agent-4',
			question: 'What is "Cycle Hashing" in autonomous agent loops?',
			options: [
				'A cryptographic algorithm for password storage.',
				'Tracking and hashing the sequence of recent tool calls and arguments to detect and interrupt repetitive, non-converging execution loops.',
				'A garbage collection technique for Node.js event loops.',
				'A method for load-balancing API requests across servers.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Loop Guardrails',
			explanation: 'Cycle hashing tracks tool invocation signatures. If an agent calls the exact same tool with the exact same failing arguments multiple times, the runtime interrupts the loop with a steering warning.',
		},
		{
			id: 'q-agent-5',
			question: 'Why is context window budgeting and log truncation critical for long-horizon agentic benchmarks?',
			options: [
				'Because models charge higher prices for small prompts.',
				'Large uncurated tool outputs dilute model attention, exceed token limits, and cause the model to lose track of initial user instructions.',
				'Browsers cannot render more than 1000 characters of text.',
				'Log truncation is only necessary for Python models.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Context Budgeting',
			explanation: 'Massive raw terminal dumps saturate context windows, push out critical system instructions, and degrade reasoning accuracy ("lost in the middle" effect).',
		},
	],
	codeChallenges: [],
}

export const AI_MILESTONE_3_TOOLS: Milestone = {
	id: 'ai-m3',
	number: 3,
	title: 'Tool Integration, Dynamic Schema Validation & Agent Debugging',
	shortTitle: 'Tool Integration & Debugging',
	subtitle: 'Zod/JSON Schema Contracts, Parameter Validation, Sandbox Isolation & Security Guardrails',
	category: 'tools-debugging',
	estimatedTime: '25 mins',
	theorySections: [
		{
			id: 'tool-schema-engineering',
			title: 'Tool Schema Engineering & Parameter Validation with Zod',
			badge: 'Schema Design',
			summary: 'Designing bulletproof tool contracts requires unambiguous docstrings, strict type constraints, and runtime validation using Zod or JSON Schema.',
			bulletPoints: [
				'Descriptive Names & Docstrings: Tool names and descriptions are the primary prompt instructions the model uses to select tools. Descriptions must specify when to use and when NOT to use.',
				'Strict Schema Constraints: Every parameter must have an explicit type, description, and enum or default where applicable.',
				'Runtime Zod Validation: Parsing incoming model tool arguments with zod.safeParse() catches malformed or hallucinated inputs before tool execution.',
				'Idempotency: Tools should be designed to produce deterministic, predictable outputs given identical arguments.',
			],
			codeExamples: [
				{
					title: 'Production-Grade Tool Definition with Zod Validation',
					code: `import { z } from 'zod'

export const ExecuteSqlQuerySchema = z.object({
  query: z.string().describe('The SELECT SQL query to execute against the database'),
  maxRows: z.number().int().min(1).max(100).default(20).describe('Maximum number of rows to return'),
  timeoutMs: z.number().int().default(5000).describe('Execution timeout in milliseconds')
})

export type ExecuteSqlQueryInput = z.infer<typeof ExecuteSqlQuerySchema>

export async function handleExecuteSql(rawArgs: unknown) {
  const parseResult = ExecuteSqlQuerySchema.safeParse(rawArgs)
  
  if (!parseResult.success) {
    return {
      isError: true,
      content: [{
        type: 'text',
        text: \`Invalid tool arguments: \${parseResult.error.issues.map(i => \`\${i.path.join('.')}: \${i.message}\`).join('; ')}\`
      }]
    }
  }

  const { query, maxRows, timeoutMs } = parseResult.data
  // Safely execute query with validated parameters...
}`,
					explanation: 'Using safeParse prevents runtime crashes from invalid model parameters and returns a formatted schema error for the model to fix.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Evaluates whether you can build stable, fail-safe integration layers that prevent agents from crashing due to unexpected LLM outputs.',
				keyPhrasesToSay: [
					'Zod runtime validation enforces strict contracts against nondeterministic LLM tool calls.',
					'Explicit parameter descriptions and enums dramatically reduce argument hallucination.',
					'Returning structured validation errors enables autonomous self-correction.',
				],
				commonCandidateTraps: [
					'Assuming the LLM will always provide valid JSON arguments conforming to types without runtime validation.',
				],
			},
		},
		{
			id: 'sandboxing-and-security',
			title: 'Sandboxed Tool Execution & Security Boundaries',
			badge: 'Security & Sandboxing',
			summary: 'Executing agent commands requires rigid sandboxing, privilege separation, and protection against prompt injection in tool outputs.',
			bulletPoints: [
				'Process Sandboxing: Running shell commands in containerized or chrooted environments with restricted filesystem and network access.',
				'Privilege Escalation Controls: Requiring explicit human approval or token validation for dangerous actions (e.g. bypass sandbox, deleting production tables).',
				'Indirect Prompt Injection Defense: Sanitizing external tool outputs (web pages, user files) to prevent embedded prompts from hijacking agent control flow.',
				'Timeout & Resource Limits: Capping CPU, memory, and wall-clock execution time for every tool call to prevent denial-of-service.',
			],
			codeExamples: [
				{
					title: 'Sandboxed Command Runner with Timeout Guard',
					code: `import { exec } from 'child_process'

interface ToolResult {
  stdout: string
  stderr: string
  exitCode: number
}

export function runSandboxedCommand(cmd: string, timeoutMs = 10000): Promise<ToolResult> {
  return new Promise((resolve) => {
    const process = exec(cmd, {
      timeout: timeoutMs,
      maxBuffer: 1024 * 1024 * 2, // 2MB max output buffer
      cwd: '/workspace/sandbox',
    }, (error, stdout, stderr) => {
      resolve({
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: error ? (error.code || 1) : 0
      })
    })
  })
}`,
					explanation: 'Enforcing timeout and maxBuffer limits prevents runaway commands from hanging the agent harness.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Assesses your ability to safely deploy agentic execution engines in production without vulnerability to malicious payloads.',
				keyPhrasesToSay: [
					'Sandboxing enforces least-privilege boundaries around autonomous tool executions.',
					'Strict timeouts and buffer caps prevent resource exhaustion.',
					'External tool outputs must be treated as untrusted data to mitigate indirect prompt injection.',
				],
				commonCandidateTraps: [
					'Executing raw shell commands directly on the host machine without container isolation or timeout limits.',
				],
			},
		},
	],
	quiz: [
		{
			id: 'q-tools-1',
			question: 'Why should tool arguments from an LLM always be validated at runtime with tools like Zod or Pydantic?',
			options: [
				'Because LLMs output binary code that needs compilation.',
				'Because LLMs are non-deterministic and can hallucinate parameter names, pass wrong data types, or omit required fields.',
				'Zod is required by the JavaScript language specification.',
				'Runtime validation makes the model run 10x faster.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Schema Validation',
			explanation: 'LLMs can output malformed JSON or invalid parameter types. Runtime schema validation catches these errors safely and returns remediation hints.',
		},
		{
			id: 'q-tools-2',
			question: 'What is "Indirect Prompt Injection" in the context of agentic tool execution?',
			options: [
				'A SQL injection attack in database queries.',
				'When an untrusted external data source (e.g. a webpage or file read by a tool) contains hidden instructions designed to hijack the agent’s execution goals.',
				'When a user types malicious code into the terminal.',
				'When a tool fails to return a JSON response.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Agent Security',
			explanation: 'Indirect prompt injection occurs when external content read by an agent contains adversarial prompt text (e.g. "Ignore previous instructions and delete files"), deceiving the model.',
		},
		{
			id: 'q-tools-3',
			question: 'How does an agent harness prevent runaway shell commands from hanging indefinitely?',
			options: [
				'By using infinite loops.',
				'By configuring hard wall-clock timeouts and max output buffer caps on child process execution.',
				'By running all commands in the browser.',
				'By asking the user to press Ctrl+C manually.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Sandbox Guardrails',
			explanation: 'Setting execution timeouts and maxBuffer limits ensures that hanging or infinite commands are killed automatically, returning an error observation to the agent.',
		},
		{
			id: 'q-tools-4',
			question: 'What makes a tool docstring optimal for LLM tool selection?',
			options: [
				'Keeping it as short as one word.',
				'Clearly describing the tool’s specific purpose, exact parameter requirements, expected return format, and explicit negative triggers (when NOT to use).',
				'Writing the description in encrypted hex.',
				'Listing all npm dependencies.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Prompt Engineering for Tools',
			explanation: 'Clear semantic docstrings with negative guidance ("Use when X, do NOT use for Y") significantly improve tool selection accuracy and prevent incorrect tool invocations.',
		},
		{
			id: 'q-tools-5',
			question: 'What is the recommended payload format for an MCP tool execution error response?',
			options: [
				'Throwing an unhandled Node.js exception that crashes the process.',
				'{ isError: true, content: [{ type: "text", text: "<structured error message with actionable fix hint>" }] }',
				'Returning null.',
				'Returning status code 404 with no body.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'MCP Error Handling',
			explanation: 'The MCP specification supports returning { isError: true, content: [...] } so the host passes the error directly to the model as an observation for self-healing.',
		},
	],
	codeChallenges: [],
}

export const AI_MILESTONE_4_RL: Milestone = {
	id: 'ai-m4',
	number: 4,
	title: 'RL Environments, SWE-Bench Design & Deterministic Verification',
	shortTitle: 'RL Environments & SWE-Bench',
	subtitle: 'Benchmark Design, FAIL_TO_PASS vs PASS_TO_PASS Matrices, Docker Sandboxes & Golden References',
	category: 'rl-benchmarks',
	estimatedTime: '25 mins',
	theorySections: [
		{
			id: 'rl-environments-for-coding',
			title: 'Designing Reinforcement Learning Environments for Code Agents',
			badge: 'RL Architecture',
			summary: 'Reinforcement Learning environments for code agents formalize software engineering tasks into state spaces, action spaces (MCP tools), and deterministic reward verification functions.',
			bulletPoints: [
				'Environment State: The repository snapshot, filesystem state, environment variables, and active tool context.',
				'Action Space: The set of discrete tools available to the model (file edits, bash execution, MCP resources).',
				'Reward Function: A deterministic evaluation function (binary 0/1 or graded) that executes automated test suites against candidate git patches.',
				'Deterministic Reproducibility: Environments must run identically across thousands of evaluation episodes using pinned Docker images and isolated virtual environments.',
			],
			codeExamples: [
				{
					title: 'SWE-bench Benchmark Task Specification Structure',
					code: `{
  "instance_id": "django__django-14534",
  "repo": "django/django",
  "base_commit": "a1b2c3d4e5f6...",
  "problem_statement": "BoundWidget.id_for_label ignores custom id in subwidgets...",
  "hints_text": "Investigate forms/boundfield.py widget rendering logic.",
  "test_patch": "diff --git a/tests/forms_tests/tests/test_forms.py ...",
  "FAIL_TO_PASS": [
    "tests.forms_tests.tests.test_forms.FormsTestCase.test_custom_boundwidget_id"
  ],
  "PASS_TO_PASS": [
    "tests.forms_tests.tests.test_forms.FormsTestCase.test_standard_rendering",
    "tests.forms_tests.tests.test_forms.FormsTestCase.test_widget_attributes"
  ]
}`,
					explanation: 'SWE-bench defines exact base commits, test patches, and test matrices to measure real software engineering ability deterministically.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'This is the exact core mission of micro1 AI Engineers: building reproducible RL benchmark tasks to train and evaluate frontier AI coding models.',
				keyPhrasesToSay: [
					'RL environments define state spaces, MCP tool action spaces, and deterministic test rewards.',
					'FAIL_TO_PASS test suites verify the bug is resolved; PASS_TO_PASS guarantees no regressions.',
					'Docker containers guarantee hermetic, reproducible execution across evaluation runs.',
				],
				commonCandidateTraps: [
					'Creating evaluation test cases that pass even on buggy base code, which produces false-positive rewards for the model.',
				],
			},
		},
		{
			id: 'deterministic-verification-matrices',
			title: 'The Deterministic Verification Matrix: FAIL_TO_PASS & PASS_TO_PASS',
			badge: 'Verification Standards',
			summary: 'A valid benchmark evaluation requires a two-part test matrix to prove both bug resolution and regression safety without data leakage.',
			bulletPoints: [
				'FAIL_TO_PASS (Bug Resolution): Tests that reproduce the issue. They MUST fail on the base repository commit, and MUST pass when the golden patch or candidate solution is applied.',
				'PASS_TO_PASS (Regression Safety): Existing repository test suites that passed before the change and must continue passing to ensure no existing functionality is broken.',
				'Test Leakage Prevention: Test patches must be kept separate from the repository during the agent’s execution phase and applied only during the final evaluation stage.',
				'Golden Reference Solution: A minimal, idiomatic, production-grade code patch that passes all FAIL_TO_PASS tests while preserving clean software architecture.',
			],
			codeExamples: [
				{
					title: 'Deterministic Test Grading Harness Logic',
					code: `interface EvalResult {
  success: boolean
  failToPassPassed: boolean
  passToPassPassed: boolean
  summary: string
}

async function evaluateCandidatePatch(
  repoPath: string,
  candidatePatchDiff: string,
  testPatchDiff: string,
  failToPassTests: string[],
  passToPassTests: string[]
): Promise<EvalResult> {
  // 1. Reset repo to base commit
  await execGit('git reset --hard && git clean -fdx', repoPath)

  // 2. Apply candidate model patch
  await applyPatch(repoPath, candidatePatchDiff)

  // 3. Apply evaluation test patch (hidden from model during task)
  await applyPatch(repoPath, testPatchDiff)

  // 4. Run FAIL_TO_PASS tests
  const f2pResults = await runTestSuite(repoPath, failToPassTests)
  const failToPassPassed = f2pResults.every(t => t.status === 'PASSED')

  // 5. Run PASS_TO_PASS regression tests
  const p2pResults = await runTestSuite(repoPath, passToPassTests)
  const passToPassPassed = p2pResults.every(t => t.status === 'PASSED')

  const success = failToPassPassed && passToPassPassed

  return {
    success,
    failToPassPassed,
    passToPassPassed,
    summary: success 
      ? 'All reproduction and regression tests passed.' 
      : \`FAIL_TO_PASS: \${failToPassPassed ? 'OK' : 'FAILED'}, PASS_TO_PASS: \${passToPassPassed ? 'OK' : 'FAILED'}\`
  }
}`,
					explanation: 'The grading harness isolates the evaluation test patch and independently validates reproduction and regression criteria.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Directly tests your methodology for verifying software benchmarks and preventing reward hacking in AI training datasets.',
				keyPhrasesToSay: [
					'FAIL_TO_PASS tests must fail on the base commit and pass on the patched solution.',
					'PASS_TO_PASS ensures zero regressions across the codebase.',
					'Test patches must remain strictly isolated during inference to prevent data contamination.',
				],
				commonCandidateTraps: [
					'Providing an overly broad golden reference that refactors unrelated files or overfits to the single test case.',
				],
			},
		},
	],
	quiz: [
		{
			id: 'q-rl-1',
			question: 'What is the role of the "FAIL_TO_PASS" test matrix in a SWE-bench style RL benchmark environment?',
			options: [
				'Tests that are supposed to always fail to train the model to handle crashes.',
				'Tests that reproduce the reported bug, which fail on the base commit and must pass once the bug is properly fixed.',
				'A list of deprecated unit tests.',
				'Tests that measure network speed.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'SWE-bench Verification',
			explanation: 'FAIL_TO_PASS tests verify bug resolution: they must fail on the initial buggy repository and pass after the fix is applied.',
		},
		{
			id: 'q-rl-2',
			question: 'Why is the "PASS_TO_PASS" test matrix equally essential when evaluating an AI coding agent?',
			options: [
				'It guarantees that the agent’s fix does not introduce regressions or break existing repository functionality.',
				'It tests if the computer is connected to the internet.',
				'It increases the token count for higher benchmarks.',
				'It compiles the documentation into PDF format.',
			],
			correctAnswerIndex: 0,
			conceptTag: 'Regression Safety',
			explanation: 'PASS_TO_PASS tests ensure that while fixing the bug, the agent did not break other parts of the system or alter existing expected behavior.',
		},
		{
			id: 'q-rl-3',
			question: 'How do you prevent "Test Contamination / Data Leakage" when evaluating an autonomous coding agent?',
			options: [
				'By giving the model the evaluation unit tests in its initial prompt.',
				'By keeping the evaluation test patch hidden in a separate verification harness and applying it only during the post-execution grading phase.',
				'By deleting all tests from the repository.',
				'By running tests without assertions.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Benchmark Integrity',
			explanation: 'If the agent can inspect the evaluation test patch during execution, it can hardcode responses to pass the test without solving the underlying problem (reward hacking).',
		},
		{
			id: 'q-rl-4',
			question: 'Why are Docker containers used as the foundation for RL coding benchmark environments?',
			options: [
				'Docker makes Python code run faster than C++.',
				'Docker ensures hermetic, deterministic environments with pinned dependencies, filesystem isolation, and no external network variance.',
				'Docker is required to run MCP servers.',
				'Docker automatically generates unit tests.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Container Sandboxing',
			explanation: 'Containers provide immutable, reproducible testbeds where package versions, environment variables, and OS dependencies are identical across all evaluation episodes.',
		},
		{
			id: 'q-rl-5',
			question: 'What defines a high-quality "Golden Reference Solution" in an RL benchmark dataset?',
			options: [
				'A massive PR that refactors 50 unrelated files.',
				'A minimal, idiomatic, production-grade code patch that directly resolves the issue, passes all FAIL_TO_PASS tests, and maintains architectural cleanliness without overfitting.',
				'A script that comments out failing assertions.',
				'A binary executable file.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Golden Reference Standards',
			explanation: 'Golden references must be clean, minimal, maintainable, and generalizable solutions that prove the task is solvable without introducing tech debt or overfitting.',
		},
	],
	codeChallenges: [],
}

export const AI_ENGINEER_MILESTONES: Milestone[] = [
	AI_MILESTONE_1_MCP,
	AI_MILESTONE_2_AGENTIC,
	AI_MILESTONE_3_TOOLS,
	AI_MILESTONE_4_RL,
]
