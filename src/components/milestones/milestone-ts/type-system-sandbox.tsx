import { useState } from 'react'
import { FileCode, Sparkles } from 'lucide-react'

interface TypePreset {
	id: string
	name: string
	badge: string
	inputCode: string
	transformationCode: string
	evaluatedTypeOutput: string
	insight: string
}

const TYPE_PRESETS: TypePreset[] = [
	{
		id: 'pick-omit',
		name: 'Pick<T, K> vs Omit<T, K>',
		badge: 'Utility Types',
		inputCode: `interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'member'
  metadata: {
    lastLogin: Date
  }
}`,
		transformationCode: `// Pick retains specified keys
type UserPreview = Pick<User, 'id' | 'name'>

// Omit strips specified keys
type UserWithoutMeta = Omit<User, 'metadata'>`,
		evaluatedTypeOutput: `type UserPreview = {
  id: string
  name: string
}

type UserWithoutMeta = {
  id: string
  name: string
  email: string
  role: 'admin' | 'member'
}`,
		insight: 'Pick and Omit create clean decoupled DTOs without maintaining duplicate interface declarations.',
	},
	{
		id: 'conditional-infer',
		name: 'infer Keyword & Awaited<T>',
		badge: 'Conditional Types',
		inputCode: `type AsyncFunction = () => Promise<{
  status: 200
  payload: {
    items: string[]
  }
}>`,
		transformationCode: `// Extract return type with infer R
type Ret = ReturnType<AsyncFunction>

// Recursively unwrap Promise with infer U
type DeepUnwrap<T> = T extends Promise<infer U> 
  ? DeepUnwrap<U> 
  : T

type ResultPayload = DeepUnwrap<Ret>`,
		evaluatedTypeOutput: `type Ret = Promise<{
  status: 200
  payload: {
    items: string[]
  }
}>

type ResultPayload = {
  status: 200
  payload: {
    items: string[]
  }
}`,
		insight: 'The infer keyword pattern-matches and captures the inner Promise resolution type without runtime evaluation.',
	},
	{
		id: 'discriminated-unions',
		name: 'Discriminated Unions & Exhaustiveness',
		badge: 'Type Narrowing',
		inputCode: `type AuthState =
  | { status: 'unauthenticated' }
  | { status: 'authenticating'; method: 'oauth' | 'password' }
  | { status: 'authenticated'; user: { id: string; name: string }; token: string }
  | { status: 'error'; message: string }`,
		transformationCode: `function getAuthDisplay(state: AuthState): string {
  switch (state.status) {
    case 'unauthenticated':
      return 'Please sign in'
    case 'authenticating':
      return \`Signing in via \${state.method}...\`
    case 'authenticated':
      return \`Welcome, \${state.user.name}\` // state.user is safely available!
    case 'error':
      return \`Auth Error: \${state.message}\`
    default: {
      const _check: never = state // Compile-time exhaustiveness check!
      return _check
    }
  }
}`,
		evaluatedTypeOutput: `// In 'authenticated' branch, state narrows to:
type NarrowedState = {
  status: 'authenticated'
  user: { id: string; name: string }
  token: string
}`,
		insight: 'The common literal property "status" allows TypeScript\'s control flow analyzer to eliminate impossible states.',
	},
	{
		id: 'satisfies-operator',
		name: 'satisfies Operator vs Type Annotations',
		badge: 'TS 4.9+ Features',
		inputCode: `type ColorPalette = {
  primary: string | { hex: string; rgb: [number, number, number] }
  accent: string
}`,
		transformationCode: `// ✅ satisfies validates structure WITHOUT widening!
const palette = {
  primary: { hex: '#6366f1', rgb: [99, 102, 241] },
  accent: '#ec4899',
} satisfies ColorPalette

// TypeScript retains exact shape:
const [r, g, b] = palette.primary.rgb // ✅ Perfectly valid! No casting!`,
		evaluatedTypeOutput: `// Inferred type of palette:
const palette: {
  primary: {
    hex: string
    rgb: [number, number, number]
  }
  accent: string
}`,
		insight: 'Unlike "as" (which silences the compiler) or annotations (which widen types), satisfies ensures strict conformity while preserving literal types.',
	},
	{
		id: 'template-literals',
		name: 'Key Remapping with "as" & Template Literals',
		badge: 'Metaprogramming',
		inputCode: `interface Person {
  name: string
  age: number
  location: string
}`,
		transformationCode: `// Generate type-safe getter methods automatically
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}

type PersonGetters = Getters<Person>`,
		evaluatedTypeOutput: `type PersonGetters = {
  getName: () => string
  getAge: () => number
  getLocation: () => string
}`,
		insight: 'Template literal types dynamically construct mapped property names, creating type-safe builder and proxy patterns.',
	},
]

export function TypeSystemSandbox () {
	const [activePresetId, setActivePresetId] = useState('pick-omit')
	const currentPreset = TYPE_PRESETS.find(p => p.id === activePresetId) || TYPE_PRESETS[0]

	return (
		<div className="rounded-2xl border border-surface-800 bg-surface-900/80 p-5 backdrop-blur-sm">
			{/* Header */}
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-4 mb-4">
				<div>
					<h3 className="text-base font-bold text-white flex items-center gap-2">
						<FileCode className="h-4 w-4 text-blue-400" />
						<span>Interactive TypeScript Type Solver & Utility Explorer</span>
					</h3>
					<p className="text-xs text-slate-400">
						Explore generic transformations, conditional type inference, and compile-time narrowing mechanics.
					</p>
				</div>
			</div>

			{/* Presets Navigation Bar */}
			<div className="flex flex-wrap gap-2 mb-5">
				{TYPE_PRESETS.map((preset) => {
					const isActive = preset.id === activePresetId
					return (
						<button
							key={preset.id}
							onClick={() => setActivePresetId(preset.id)}
							className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
								isActive
									? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
									: 'bg-surface-950 border border-surface-800 text-slate-400 hover:text-slate-200'
							}`}
						>
							<span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-surface-900 border border-surface-700">
								{preset.badge}
							</span>
							<span>{preset.name}</span>
						</button>
					)
				})}
			</div>

			{/* Educational Takeaway Banner */}
			<div className="mb-5 rounded-xl border border-blue-500/30 bg-blue-950/20 p-3.5 text-xs text-blue-200 flex items-start gap-2.5">
				<Sparkles className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
				<div>
					<strong className="text-white">Compiler Insight:</strong> {currentPreset.insight}
				</div>
			</div>

			{/* Code Transformation Flow Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
				{/* Step 1: Input Type */}
				<div className="lg:col-span-4 rounded-xl border border-surface-800 bg-surface-950 p-3.5 flex flex-col font-mono text-xs">
					<div className="text-[10px] uppercase font-bold text-slate-500 mb-2 border-b border-surface-800 pb-1 flex items-center justify-between">
						<span>1. Input Interface / Type</span>
						<span className="text-blue-400 font-sans">Source</span>
					</div>
					<pre className="overflow-x-auto text-slate-300 leading-relaxed">
						<code>{currentPreset.inputCode}</code>
					</pre>
				</div>

				{/* Step 2: Transformation */}
				<div className="lg:col-span-4 rounded-xl border border-surface-800 bg-surface-950 p-3.5 flex flex-col font-mono text-xs">
					<div className="text-[10px] uppercase font-bold text-slate-500 mb-2 border-b border-surface-800 pb-1 flex items-center justify-between">
						<span>2. Generic Type Operation</span>
						<span className="text-purple-400 font-sans">Transform</span>
					</div>
					<pre className="overflow-x-auto text-purple-200 leading-relaxed">
						<code>{currentPreset.transformationCode}</code>
					</pre>
				</div>

				{/* Step 3: Evaluated Output */}
				<div className="lg:col-span-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 flex flex-col font-mono text-xs">
					<div className="text-[10px] uppercase font-bold text-emerald-400 mb-2 border-b border-emerald-500/30 pb-1 flex items-center justify-between">
						<span>3. Evaluated Type Output</span>
						<span className="text-emerald-300 font-sans">Resolved</span>
					</div>
					<pre className="overflow-x-auto text-emerald-300 leading-relaxed">
						<code>{currentPreset.evaluatedTypeOutput}</code>
					</pre>
				</div>
			</div>
		</div>
	)
}
