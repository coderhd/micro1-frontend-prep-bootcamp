import { Milestone } from '../types/curriculum'

export const MILESTONE_TS_DATA: Milestone = {
	id: 'm-ts',
	number: 2,
	title: 'Advanced TypeScript & Type-Safe Architecture',
	shortTitle: 'TypeScript Deep Dive',
	subtitle: 'Generics, Conditional Types, Infer Keyword, Mapped Types, Discriminated Unions & Polymorphism',
	category: 'typescript',
	estimatedTime: '25 mins',
	theorySections: [
		{
			id: 'generics-constraints',
			title: 'Generics, Type Constraints & Generic React Components',
			badge: 'Type System Fundamentals',
			summary: 'Generics introduce type parameters that allow functions, interfaces, and React components to operate over a variety of types while preserving complete type safety and return-type relationships.',
			bulletPoints: [
				'Type Constraints (extends): Constrains what types can be passed to a generic parameter (e.g. <T extends Record<string, unknown>> or <K extends keyof T>).',
				'keyof Operator: Produces a string/number literal union of an object\'s keys.',
				'Generic Lookup Types: T[K] retrieves the exact property type associated with key K on type T.',
				'Generic React Components: Allows UI components like Dropdowns, Tables, and Lists to infer item types directly from passed props without type casting.',
			],
			codeExamples: [
				{
					title: 'Type-Safe Property Getter with keyof & Generic Constraints',
					code: `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
	return obj[key]
}

interface User {
	id: string
	age: number
	email: string
}

const user: User = { id: 'u123', age: 28, email: 'alex@example.com' }

const age = getProperty(user, 'age')     // Inferred as number
const email = getProperty(user, 'email') // Inferred as string
// getProperty(user, 'invalidKey')       // ❌ Compile Error!`,
					explanation: 'Using K extends keyof T guarantees at compile-time that "key" is a valid property on "obj", and the return type matches T[K] perfectly.',
				},
				{
					title: 'Generic Type-Safe React Select Component',
					code: `interface SelectProps<T> {
	items: T[]
	value: T
	getLabel: (item: T) => string
	onChange: (selected: T) => void
}

export function Select<T>({ items, value, getLabel, onChange }: SelectProps<T>) {
	return (
		<select
			value={getLabel(value)}
			onChange={(e) => {
				const found = items.find((item) => getLabel(item) === e.target.value)
				if (found) onChange(found)
			}}
		>
			{items.map((item, idx) => (
				<option key={idx} value={getLabel(item)}>
					{getLabel(item)}
				</option>
			))}
		</select>
	)
}`,
					explanation: 'When consuming <Select items={users} ... />, TypeScript automatically binds T to User without requiring manual type assertions.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Micro1 evaluates whether you can write clean, bulletproof enterprise TypeScript and design reproducible RL environments that test AI models on complex generic codebases.',
				keyPhrasesToSay: [
					'Generics establish a direct type relationship between inputs and outputs.',
					'Using "extends keyof" guarantees compile-time property safety and autocomplete.',
					'Generic React components prevent redundant type casting in consumers.',
				],
				commonCandidateTraps: [
					'Falling back to "any" when a generic constraint <T extends BaseType> should have been used.',
				],
			},
		},
		{
			id: 'conditional-types-infer',
			title: 'Conditional Types, the "infer" Keyword & Template Literal Types',
			badge: 'Advanced Meta-Programming',
			summary: 'Conditional types enable non-uniform type mapping based on a type relationship check (T extends U ? X : Y), while the "infer" keyword allows dynamic type extraction inside conditional expressions.',
			bulletPoints: [
				'Conditional Type Syntax: T extends U ? TrueBranch : FalseBranch. Evaluates to TrueBranch if T is assignable to U.',
				'Distributive Conditional Types: When applied to a naked generic union (T extends any), the condition distributes across each member of the union automatically.',
				'The "infer" Keyword: Introduces a type variable to be deduced within the true branch of a conditional type (e.g. extracting function return types or Promise resolution types).',
				'Template Literal Types: Allows building literal string unions dynamically (\`on\${Capitalize<EventName>}\`).',
			],
			codeExamples: [
				{
					title: 'Custom ReturnType<T> and UnwrapPromise<T> using "infer"',
					code: `// Extract return type of any function
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never

// Extract unwrapped value from a Promise (Awaited<T>)
type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T

// Example usage:
type FetchUserFn = () => Promise<{ name: string; age: number }>

type Ret = MyReturnType<FetchUserFn> // Promise<{ name: string; age: number }>
type Unwrapped = MyAwaited<Ret>     // { name: string; age: number }`,
					explanation: 'The infer keyword captures the inner Promise resolution type U and recursively unwraps nested promises.',
				},
				{
					title: 'Dynamic Event Handler Generator with Template Literals',
					code: `type BaseEvents = 'click' | 'change' | 'submit'

// Produces: 'onClick' | 'onChange' | 'onSubmit'
type EventHandlerNames = \`on\${Capitalize<BaseEvents>}\`

type EventListeners = {
	[K in EventHandlerNames]?: (e: Event) => void
}`,
					explanation: 'Template literal types enable type-safe metaprogramming for event dictionaries, router paths, and internationalization keys.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Assesses whether you can build and debug framework-level utilities, Redux Toolkit slices, and type-safe API clients.',
				keyPhrasesToSay: [
					'The "infer" keyword pattern-matches within a conditional type to extract nested types dynamically.',
					'Distributive conditional types operate element-wise over union members.',
					'Never is the bottom type in TypeScript, representing unreachable or filtered-out branches.',
				],
				commonCandidateTraps: [
					'Trying to use "infer" outside of the "extends" clause of a conditional type.',
				],
			},
		},
		{
			id: 'mapped-types-utilities',
			title: 'Mapped Types, Key Remapping ("as") & Built-in Utility Types',
			badge: 'Type Transformations',
			summary: 'Mapped types transform existing object types by iterating over keys using [K in keyof T], allowing modifiers like readonly, ?, and key remapping using the "as" keyword.',
			bulletPoints: [
				'Mapped Type Syntax: { [K in keyof T]: T[K] }. Modifiers like +readonly, -readonly, +?, and -? add or strip flags.',
				'Key Remapping with "as": Filter or rename keys during mapping ({ [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K] }).',
				'Exclude vs Omit: Exclude<Union, Members> operates on unions; Omit<Object, Keys> operates on object property keys using Pick<T, Exclude<keyof T, K>>.',
				'Deep Partial / Deep Readonly: Recursive mapped types that traverse nested object structures.',
			],
			codeExamples: [
				{
					title: 'Implementing DeepReadonly<T> and MyOmit<T, K>',
					code: `// Custom DeepReadonly implementation
type DeepReadonly<T> = {
	readonly [K in keyof T]: T[K] extends Function
		? T[K]
		: T[K] extends object
			? DeepReadonly<T[K]>
			: T[K]
}

// Custom Omit implementation
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

interface State {
	user: {
		profile: {
			name: string
		}
	}
	token: string
}

type ReadonlyState = DeepReadonly<State>
// ReadonlyState.user.profile.name is completely immutable!`,
					explanation: 'DeepReadonly recursively traverses nested object trees, ensuring complete immutability for Redux state slices.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Tests deep mastery of immutability and clean architecture in modern React and Redux codebases.',
				keyPhrasesToSay: [
					'Mapped types transform types like map() transforms arrays.',
					'Key remapping with "as" can filter keys out by mapping them to "never".',
					'Pick and Omit are duals: Pick retains specified keys, Omit discards specified keys.',
				],
				commonCandidateTraps: [
					'Confusing Exclude (which operates on union types) with Omit (which operates on object keys).',
				],
			},
		},
		{
			id: 'narrowing-discriminated-unions',
			title: 'Type Narrowing, Discriminated Unions & the "satisfies" Operator',
			badge: 'Type Safety & Control Flow',
			summary: 'Type narrowing refines broad types into specific types through control flow analysis, type guards (typeof, instanceof, custom user-defined guards), discriminated unions, and the satisfies operator.',
			bulletPoints: [
				'Discriminated Unions: A pattern where each type in a union has a shared literal property (the discriminant/tag like kind: "success" | "error"), enabling exhaustive type narrowing in switch statements.',
				'Exhaustiveness Checking: Using the "never" type in default switch cases to ensure all union variants are handled at compile time.',
				'User-Defined Type Guards: Functions with a return type predicate of "val is TargetType" that inform TypeScript\'s compiler of type refinement.',
				'"satisfies" Operator (TS 4.9+): Validates that an expression matches a type WITHOUT widening the expression\'s inferred literal types (unlike "as" or type annotations).',
				'unknown vs any: "any" turns off type checking; "unknown" is the type-safe counterpart requiring narrowing before operations can be performed.',
			],
			codeExamples: [
				{
					title: 'Discriminated Union with Compile-Time Exhaustiveness Checking',
					code: `type NetworkState =
	| { status: 'idle' }
	| { status: 'loading' }
	| { status: 'success'; data: string[] }
	| { status: 'error'; error: Error }

function handleState(state: NetworkState): string {
	switch (state.status) {
		case 'idle':
			return 'Ready to fetch'
		case 'loading':
			return 'Fetching data...'
		case 'success':
			return \`Loaded \${state.data.length} items\` // data safely accessible
		case 'error':
			return \`Error: \${state.error.message}\`     // error safely accessible
		default: {
			// Exhaustiveness check: If a new state is added, this triggers a compile error!
			const _exhaustiveCheck: never = state
			return _exhaustiveCheck
		}
	}
}`,
					explanation: 'The discriminant property "status" allows TypeScript to narrow state into the exact payload type inside each switch case. The never assertion catches missing cases at compile time.',
				},
				{
					title: '"satisfies" vs Type Annotation vs Type Assertion ("as")',
					code: `type ThemeConfig = {
	colors: Record<string, string>
	spacing: Record<string, string | number>
}

// ❌ Problem with Type Annotation: Widens properties (spacing.sm is string | number)
// const theme: ThemeConfig = { colors: { primary: '#6366f1' }, spacing: { sm: 8 } }

// ✅ Golden: "satisfies" validates structure while preserving exact literal types!
const theme = {
	colors: {
		primary: '#6366f1',
		secondary: '#ec4899',
	},
	spacing: {
		sm: 8,
		md: 16,
	},
} satisfies ThemeConfig

theme.colors.primary.toUpperCase() // ✅ Perfectly safe! Knows it is a string
const margin = theme.spacing.sm * 2 // ✅ Knows it is a number (no casting needed!)`,
					explanation: 'The satisfies operator verifies that theme conforms to ThemeConfig while preserving exact literal types like primary: "#6366f1" and sm: 8.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Crucial for writing robust, type-safe API handlers, Redux actions, and preventing runtime type exceptions.',
				keyPhrasesToSay: [
					'Discriminated unions provide exhaustiveness safety via control flow analysis.',
					'"satisfies" enables type checking without type widening.',
					'Always prefer "unknown" over "any" when handling dynamic external payloads.',
				],
				commonCandidateTraps: [
					'Overusing type assertions ("as SomeType") which silence the compiler and mask potential runtime bugs.',
				],
			},
		},
	],
	quiz: [
		{
			id: 'q-ts-1',
			question: 'What is the key difference between the "satisfies" operator (TS 4.9+) and standard type annotations (e.g. const x: Type)?',
			options: [
				'satisfies compiles code into JavaScript classes at runtime.',
				'satisfies validates that an object matches a contract without widening or losing the inferred specific literal types of its properties.',
				'satisfies converts any object into an immutable Proxy.',
				'satisfies only works on functions, not objects.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'satisfies Operator',
			explanation: 'Type annotations (const x: T) widen properties to their general types (e.g. string | number). The "satisfies" operator ensures compatibility with type T while preserving exact literal member types.',
		},
		{
			id: 'q-ts-2',
			question: 'What does the "infer" keyword do in a TypeScript conditional type?',
			options: [
				'It creates a runtime variable in JavaScript.',
				'It introduces a type variable within the condition to deduce and capture an internal type dynamically.',
				'It automatically casts any variable to "unknown".',
				'It forces TypeScript to ignore compile errors.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'infer Keyword',
			explanation: 'The "infer" keyword allows pattern-matching inside conditional types (e.g. T extends Promise<infer U> ? U : T) to extract and bind inner types dynamically.',
		},
		{
			id: 'q-ts-3',
			question: 'What is the difference between Exclude<T, U> and Omit<T, K>?',
			options: [
				'Exclude operates on union types to remove members; Omit operates on object types to remove property keys.',
				'Exclude is deprecated; Omit is the modern replacement.',
				'Exclude operates on interfaces; Omit operates on classes.',
				'There is no difference; they are exact aliases.',
			],
			correctAnswerIndex: 0,
			conceptTag: 'Utility Types',
			explanation: 'Exclude<"a" | "b" | "c", "a"> removes "a" from a union, resulting in "b" | "c". Omit<{ a: number; b: string }, "a"> creates a new object type with key "a" removed ({ b: string }).',
		},
		{
			id: 'q-ts-4',
			question: 'How do you guarantee compile-time exhaustiveness checking for a discriminated union in a switch statement?',
			options: [
				'By setting noImplicitAny: true in tsconfig.json.',
				'By assigning the unhandled state to a variable of type "never" in the default case.',
				'By returning null in the default case.',
				'By wrapping the switch statement in a try/catch block.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Discriminated Unions',
			explanation: 'Because "never" represents the empty type, if any union member is omitted from the switch cases, TypeScript flags a compile-time type error when trying to assign the unhandled variant to "never".',
		},
		{
			id: 'q-ts-5',
			question: 'Why is "unknown" strictly preferred over "any" when accepting dynamic or third-party input?',
			options: [
				'"unknown" takes up less memory in the compiled JavaScript bundle.',
				'"unknown" forces developers to perform explicit type narrowing or validation before invoking methods on it, preventing runtime exceptions.',
				'"unknown" automatically parses JSON strings.',
				'"any" is deprecated in modern TypeScript.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Type Narrowing & Safety',
			explanation: '"any" bypasses all type checking, re-introducing runtime type errors. "unknown" represents any value safely by requiring type guards (typeof, instanceof, custom type predicate) before properties or methods can be accessed.',
		},
	],
	codeChallenges: [
		{
			id: 'challenge-ts-omit',
			title: 'Custom MyOmit<T, K> Implementation',
			difficulty: 'Medium',
			prompt: 'Implement TypeScript utility type MyOmit<T, K> from scratch using Pick and Exclude (or mapped types with key remapping "as").',
			starterCode: `// Implement MyOmit without using the built-in Omit utility
export type MyOmit<T, K extends keyof any> = {
	// TODO: Implement type transformation
}`,
			solutionCode: `export type MyOmit<T, K extends keyof any> = {
	[P in keyof T as P extends K ? never : P]: T[P]
}

// Alternative standard implementation:
// export type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>`,
			explanation: 'Key remapping with "as" iterates over all keys P in keyof T and maps matching keys K to "never", effectively stripping them from the resulting object type.',
			testCases: [
				{
					description: 'Strips specified keys from object type',
					assertion: 'MyOmit<{ id: string; name: string; age: number }, "id"> results in { name: string; age: number }',
				},
			],
		},
	],
}
