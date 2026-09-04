import { Milestone } from '../types/curriculum'

export const SPECIALIST_CURRICULUM: Milestone[] = [
	{
		id: 'sp-m1',
		number: 1,
		title: 'Design Decision Rationale & Trade-off Matrices',
		shortTitle: 'Decision Rationales',
		subtitle: 'Rendering Strategies, State Architecture, Bundle Budgets & Trade-offs',
		category: 'specialist-rationale',
		estimatedTime: '25 mins',
		theorySections: [
			{
				id: 'sec-sp1-rendering',
				title: '1. Modern Rendering Architecture Matrix (CSR vs SSR vs SSG vs ISR vs RSC)',
				badge: 'Core Architectural Decision',
				summary: 'Engineering specialists must rigorously defend rendering strategies based on quantitative trade-offs: TTFB, FCP, LCP, server compute costs, dynamic data freshness, and client bundle size.',
				bulletPoints: [
					'CSR (Client-Side Rendering): Zero server compute for pages, but poor initial TTFB/FCP and heavy JS parse/execution penalty. Ideal for authenticated portals/dashboards behind login.',
					'SSR (Server-Side Rendering): Generates dynamic HTML per request on server. Improves SEO and FCP, but increases TTFB under load and incurs continuous server compute costs.',
					'SSG (Static Site Generation): Pre-renders HTML at build time. Ultra-fast TTFB via CDN edge caches, but rebuild times scale linearly with page count O(N).',
					'ISR (Incremental Static Regeneration): Serves stale cached pages while asynchronously revalidating in background (stale-while-revalidate). Solves rebuild bottlenecks but introduces eventual consistency windows.',
					'RSC (React Server Components): Server-only component execution with zero client JS bundle weight. Streaming HTML chunks with selective client island hydration.',
				],
				codeExamples: [
					{
						title: 'Trade-off Comparison Matrix for Architectural Decisions',
						language: 'typescript',
						code: `// Technical Decision Matrix: E-Commerce Product Catalog
// Criteria: SEO, Real-time Pricing, Cache Hit Ratio, Server Load

export const RENDERING_DECISION_MATRIX = {
  CSR: {
    seoScore: 2,        // Poor crawlers support
    ttfbMs: 120,        // Fast initial response (empty shell)
    lcpMs: 2400,       // Slow (waits for JS + client API fetch)
    serverCost: '$',    // Static CDN hosting
    verdict: 'REJECTED: E-commerce requires SEO indexing and sub-1.5s LCP'
  },
  SSR: {
    seoScore: 5,        // Perfect SEO
    ttfbMs: 650,        // High TTFB on database spikes
    lcpMs: 1400,       // Fast once HTML arrives
    serverCost: '$$$$', // Node server execution per request
    verdict: 'CONDITIONAL: Viable for personalized checkout, overkill for static catalog'
  },
  ISR_WITH_ON_DEMAND: {
    seoScore: 5,        // Cached static HTML
    ttfbMs: 45,         // Global Edge CDN cache hit
    lcpMs: 800,        // Blazing fast LCP
    serverCost: '$$',   // Revalidation only on CMS webhook trigger
    verdict: 'SELECTED: Optimal balance of edge speed, SEO, and inventory sync'
  }
}`,
						explanation: 'A senior specialist presents architectural recommendations using structured multi-criteria decision matrices rather than subjective preferences.',
					},
				],
				interviewCheatSheet: {
					whyZaraAsks: 'Zara evaluates whether you can evaluate and defend architectural choices with quantitative metrics (TTFB, LCP, server costs) and business trade-offs.',
					keyPhrasesToSay: [
						'We chose ISR with on-demand webhook revalidation because our catalog has 100k SKUs where full SSG builds were exceeding 45 minutes.',
						'For private dashboard routes, we intentionally stayed on CSR to preserve edge caching on Cloudflare and avoid unnecessary server compute costs.',
						'React Server Components eliminate client bundle overhead for static template nodes while streaming dynamic data progressively.',
					],
					commonCandidateTraps: [
						'Claiming SSR is always superior without acknowledging the TTFB latency penalty and server compute scalability limits.',
						'Failing to mention cache invalidation strategies and eventual consistency risks in ISR/CDN setups.',
					],
				},
			},
			{
				id: 'sec-sp1-state',
				title: '2. State Architecture Rationale (Server State vs Global Client vs Local State)',
				badge: 'State Engineering',
				summary: 'Specialists avoid the anti-pattern of dumping all application data into a single global store. They partition state into Server State, UI State, URL State, and Ephemeral Component State.',
				bulletPoints: [
					'Server State (TanStack Query / RTK Query): Handles caching, deduplication, background polling, and optimistic updates. Removes 70% of boilerplate from Redux.',
					'Global UI State (Zustand / Jotai): Lightweight atomic or slice-based stores for cross-component UI state (modals, active drawer, dark mode, audio player).',
					'URL State (SearchParams / Query Parameters): Single source of truth for filters, pagination, and sorting to guarantee shareability and back/forward browser integrity.',
					'Local Component State (useState / useReducer): Keeps state localized close to the consumer to minimize unnecessary tree re-renders.',
				],
				codeExamples: [
					{
						title: 'State Separation Architecture: Decoupling Server Cache from UI',
						language: 'typescript',
						code: `// Clean State Boundary Architecture

// 1. URL State (Shareable Filters)
export function useProductFilters() {
  const [params, setParams] = useSearchParams()
  const category = params.get('cat') || 'all'
  const page = parseInt(params.get('page') || '1', 10)
  
  const setPage = (newPage: number) => {
    setParams(prev => { prev.set('page', String(newPage)); return prev })
  }
  return { category, page, setPage }
}

// 2. Server State (Deduplicated, Stale-While-Revalidate)
export function useProductList(category: string, page: number) {
  return useQuery({
    queryKey: ['products', category, page],
    queryFn: () => fetchProducts({ category, page }),
    staleTime: 5 * 60 * 1000, // 5 min cache
    placeholderData: keepPreviousData, // smooth pagination
  })
}

// 3. Local UI State (Cart Drawer Visibility)
export const useCartDrawer = create<{ isOpen: boolean; toggle: () => void }>(set => ({
  isOpen: false,
  toggle: () => set(s => ({ isOpen: !s.isOpen }))
}))`,
						explanation: 'Separating Server State (useQuery), URL State (useSearchParams), and UI State (Zustand) prevents massive Redux boilerplates and stale cache synchronization bugs.',
					},
				],
				interviewCheatSheet: {
					whyZaraAsks: 'To test if you can design scalable state models without over-engineering or introducing state synchronization bugs.',
					keyPhrasesToSay: [
						'We treat server data as an async cache rather than client state, leveraging TanStack Query for automatic deduplication, garbage collection, and optimistic rollback.',
						'Search, pagination, and filters belong strictly in URL query params to preserve deep-linking and browser history navigation.',
					],
					commonCandidateTraps: [
						'Replicating server cache manually inside Redux/Zustand with manual useEffect synchronization.',
						'Putting form input keystrokes into a global Redux slice, triggering global application re-renders.',
					],
				},
			},
		],
		quiz: [
			{
				id: 'sp-q1-1',
				question: 'An e-commerce site has 500,000 product pages with frequent price updates from a warehouse API. Which rendering strategy provides sub-100ms TTFB globally while keeping prices fresh without rebuild bottlenecks?',
				options: [
					'Pure Client-Side Rendering (CSR) with client-side price fetching',
					'Static Site Generation (SSG) with full site builds on every price update',
					'Incremental Static Regeneration (ISR) with on-demand tag/path revalidation via webhook',
					'Server-Side Rendering (SSR) without edge caching on every single request',
				],
				correctAnswerIndex: 2,
				explanation: 'On-demand ISR caches pre-rendered HTML on global CDN edge nodes for instant TTFB (<100ms) and triggers targeted revalidation only when the warehouse sends a price update webhook.',
				conceptTag: 'Rendering Architecture',
			},
			{
				id: 'sp-q1-2',
				question: 'What is the primary architectural flaw of storing server-fetched API payloads inside a standard Redux Toolkit slice instead of using RTK Query or TanStack Query?',
				options: [
					'Redux cannot serialize JSON objects returned from fetch requests',
					'Manual state slices require custom boilerplate for request deduplication, cache expiry, stale revalidation, and race condition management',
					'Redux slices cannot be connected to React components using hooks',
					'Redux store memory is limited to 1MB total payload size in modern browsers',
				],
				correctAnswerIndex: 1,
				explanation: 'Manual Redux slices force engineers to build bespoke loading states, cache invalidation, request deduplication, and cancelation logic, which dedicated server-state libraries solve out of the box.',
				conceptTag: 'State Architecture',
			},
			{
				id: 'sp-q1-3',
				question: 'When designing a dashboard with complex filter queries, why is storing active filter criteria in URL search parameters superior to local component state?',
				options: [
					'URL search parameters can store larger payloads than JavaScript heap memory',
					'It automatically enables deep linking, bookmarks, browser back/forward navigation, and seamless page refreshes without state loss',
					'Search parameters bypass browser security sandbox restrictions',
					'URL search parameters execute faster than React useState hooks',
				],
				correctAnswerIndex: 1,
				explanation: 'Storing filters in URL query parameters ensures that users can share URLs with team members, bookmark filtered views, and navigate history without losing application state.',
				conceptTag: 'URL State & UX',
			},
			{
				id: 'sp-q1-4',
				question: 'What is the primary trade-off of adopting React Server Components (RSC) compared to traditional client-side component trees?',
				options: [
					'RSC requires WebAssembly and cannot run JavaScript code on the server',
					'RSC components cannot use client interactivity hooks (useState, useEffect, event listeners) or browser APIs directly',
					'RSC components increase the total JavaScript bundle downloaded to the client browser',
					'RSC completely prevents database access and backend API calls',
				],
				correctAnswerIndex: 1,
				explanation: 'Server Components run exclusively on the server and produce a serialized JSX stream, so they cannot attach DOM event listeners or use client lifecycle hooks like useState/useEffect without marking child components with "use client".',
				conceptTag: 'RSC Architectural Boundaries',
			},
			{
				id: 'sp-q1-5',
				question: 'When evaluating CSS-in-JS (e.g. styled-components) vs utility-first CSS (Tailwind CSS) for a high-performance web app, what is the main performance drawback of runtime CSS-in-JS?',
				options: [
					'Tailwind CSS requires larger JavaScript bundle parse times than runtime styled-components',
					'Runtime CSS-in-JS generates styles on the fly in the JS thread during component renders, increasing INP and blocking the main thread',
					'Runtime CSS-in-JS cannot support responsive media queries or pseudo-classes',
					'Tailwind CSS cannot be purged during production builds',
				],
				correctAnswerIndex: 1,
				explanation: 'Runtime CSS-in-JS parses, hashes, and injects `<style>` tags dynamically into the DOM during React render passes, causing CPU spikes, style recalculation overhead, and poor Interaction to Next Paint (INP).',
				conceptTag: 'Styling & Performance',
			},
		],
		codeChallenges: [
			{
				id: 'sp-lab-1',
				title: 'Architectural Trade-off Decision Framework',
				difficulty: 'Medium',
				prompt: 'Implement an evaluateRenderingStrategy function that scores rendering strategies (CSR, SSR, SSG, ISR) based on project constraints (isSeoCritical, hasLargeDynamicCatalog, requiresInstantLcp, serverCostBudget) and returns the optimal recommendation.',
				starterCode: `interface ProjectRequirements {
  isSeoCritical: boolean
  hasLargeDynamicCatalog: boolean // > 50k pages
  requiresInstantLcp: boolean    // LCP < 1.0s
  serverCostBudget: 'low' | 'flexible'
}

export function evaluateRenderingStrategy(req: ProjectRequirements): {
  recommended: 'CSR' | 'SSR' | 'SSG' | 'ISR'
  rationale: string
} {
  // TODO: Return optimal recommendation and structured rationale
  return { recommended: 'CSR', rationale: '' }
}`,
				solutionCode: `interface ProjectRequirements {
  isSeoCritical: boolean
  hasLargeDynamicCatalog: boolean
  requiresInstantLcp: boolean
  serverCostBudget: 'low' | 'flexible'
}

export function evaluateRenderingStrategy(req: ProjectRequirements): {
  recommended: 'CSR' | 'SSR' | 'SSG' | 'ISR'
  rationale: string
} {
  if (!req.isSeoCritical && req.serverCostBudget === 'low') {
    return {
      recommended: 'CSR',
      rationale: 'Private app without SEO needs; saves server compute by serving static SPA bundle.'
    }
  }

  if (req.isSeoCritical && req.hasLargeDynamicCatalog) {
    return {
      recommended: 'ISR',
      rationale: 'Large catalog exceeds SSG build limits; ISR delivers sub-100ms edge TTFB with background revalidation.'
    }
  }

  if (req.isSeoCritical && req.requiresInstantLcp && req.serverCostBudget === 'low') {
    return {
      recommended: 'SSG',
      rationale: 'Small page footprint allows pre-rendering all pages at build time for optimal CDN edge caching.'
    }
  }

  return {
    recommended: 'SSR',
    rationale: 'Dynamic personalized data requiring real-time server rendering with dynamic request headers.'
  }
}`,
				explanation: 'Systematically evaluates requirements against rendering trade-offs to produce deterministic architectural recommendations.',
				testCases: [
					{
						description: 'Recommends ISR for large dynamic catalog with SEO requirements',
						assertion: "evaluateRenderingStrategy({ isSeoCritical: true, hasLargeDynamicCatalog: true, requiresInstantLcp: true, serverCostBudget: 'low' }).recommended === 'ISR'",
					},
					{
						description: 'Recommends CSR for internal authenticated portal without SEO requirements',
						assertion: "evaluateRenderingStrategy({ isSeoCritical: false, hasLargeDynamicCatalog: false, requiresInstantLcp: false, serverCostBudget: 'low' }).recommended === 'CSR'",
					},
				],
			},
		],
	},
	{
		id: 'sp-m2',
		number: 2,
		title: 'Design Critique, Code Review & Architecture Evaluation',
		shortTitle: 'Code & Design Critique',
		subtitle: 'Anti-Pattern Identification, Review Taxonomy & Constructive Feedback',
		category: 'specialist-critique',
		estimatedTime: '30 mins',
		theorySections: [
			{
				id: 'sec-sp2-taxonomy',
				title: '1. The 5-Pillar Specialist Code Review Taxonomy',
				badge: 'Review Methodology',
				summary: 'Senior specialists evaluate code through a structured, multi-dimensional rubric rather than superficial style nits: Correctness, Architecture & State, Performance, Accessibility, and Maintainability.',
				bulletPoints: [
					'Pillar 1 • Correctness & Edge Cases: Race conditions in async effects, missing error boundaries, null pointer exceptions, unhandled Promise rejections, and stale closures.',
					'Pillar 2 • Architecture & Component Boundaries: Single Responsibility Principle (SRP), prop drilling vs compound components, business logic separated into custom hooks.',
					'Pillar 3 • Performance & Render Budget: Unnecessary top-level Context re-renders, layout thrashing / reflows, missing virtualization on large lists, missing dynamic imports.',
					'Pillar 4 • Accessibility (a11y): Keyboard tab traps, missing ARIA live regions for async changes, color contrast violations, semantic HTML landmarks (`<main>`, `<nav>`).',
					'Pillar 5 • Maintainability & Type Safety: Overuse of `any`, unsafe type assertions (`as unknown as T`), missing unit test coverage for complex edge cases.',
				],
				codeExamples: [
					{
						title: 'Example: Identifying 4 Hidden Bugs in a Flawed Code Sample',
						language: 'typescript',
						code: `// ❌ FLAWED CODE UNDER REVIEW:
export function UserDashboard({ userId }: { userId: string }) {
  const [data, setData] = useState<any>(null)
  const [count, setCount] = useState(0)

  // Bug 1: Missing cleanup & race condition if userId changes rapidly
  // Bug 2: Stale closure referencing count without dependency
  useEffect(() => {
    fetch(\`/api/user/\${userId}\`)
      .then(res => res.json())
      .then(d => {
        setData(d)
        console.log('Fetched user with count:', count)
      })
  }, [userId]) // count is missing!

  // Bug 3: Inefficient inline event handler creating new callback reference
  // Bug 4: Inaccessible clickable div without keyboard handlers or ARIA role
  return (
    <div onClick={() => setCount(count + 1)}>
      <h1>{data.name}</h1>
    </div>
  )
}`,
						explanation: 'A specialist review flags the unhandled async race condition with AbortController, the unsafe any typing, the stale closure, and the inaccessible non-semantic element.',
					},
				],
				interviewCheatSheet: {
					whyZaraAsks: 'To test if you can quickly spot deep architectural bugs and articulate why they degrade scalability or user experience.',
					keyPhrasesToSay: [
						'In this PR, the async fetch lacks an AbortController cleanup, leading to a race condition where stale responses from a previous userId overwrite newer data.',
						'Using an unmemoized Context Provider value at the root forces all consuming descendants to re-render whenever any unrelated state updates.',
						'The custom dropdown relies on a `<div>` with `onClick`, violating WCAG 2.1 by lacking keyboard focusability (`tabIndex=0`) and `onKeyDown` handlers.',
					],
					commonCandidateTraps: [
						'Focusing only on formatting, indentation, or variable naming instead of fundamental architecture and performance defects.',
						'Giving vague feedback like "this is slow" without explaining the root cause (e.g. cascading reconciliation or layout reflow).',
					],
				},
			},
			{
				id: 'sec-sp2-constructive',
				title: '2. Delivering Actionable, Constructive Written Feedback',
				badge: 'Written Communication',
				summary: 'Technical feedback must balance rigor with empathy. Specialists structure critique with clear observations, technical rationale, and concrete code alternatives.',
				bulletPoints: [
					'Observation: Clearly state the specific pattern observed with line references.',
					'Impact / Why: Explain the concrete consequence (e.g. memory leak, race condition, layout shift).',
					'Recommendation: Provide a clean, idiomatic code snippet showing the solution.',
					'Tone: Use collaborative language ("Consider...", "What if we...", "To avoid...") rather than confrontational directives.',
				],
				codeExamples: [
					{
						title: 'Model Specialist Code Review Comment',
						language: 'markdown',
						code: `### 💬 Code Review Feedback Example

**Observation**: On line 24, \`fetchData\` is invoked in \`useEffect\` without request cancellation or error boundary handling.

**Impact**: If the user switches tabs or changes the filter rapidly, out-of-order network responses will cause a race condition, writing stale data to the UI. Additionally, a 500 error will cause an unhandled promise rejection.

**Suggested Solution**:
\`\`\`typescript
useEffect(() => {
  const controller = new AbortController()
  
  async function load() {
    try {
      const result = await fetchUserData(userId, { signal: controller.signal })
      setUserData(result)
    } catch (err: any) {
      if (err.name !== 'AbortError') setError(err)
    }
  }

  load()
  return () => controller.abort()
}, [userId])
\`\`\`
`,
						explanation: 'Constructive review comments explain the failure mode and provide a drop-in reference solution.',
					},
				],
				interviewCheatSheet: {
					whyZaraAsks: 'Zara looks for high-level emotional intelligence and technical clarity in written feedback, vital for AI dataset quality and senior engineering mentorship.',
					keyPhrasesToSay: [
						'I format review comments by stating the exact mechanism of failure, the user-facing impact, and a drop-in code snippet.',
						'Categorizing comments into [Blocker], [Suggestion], and [Nit] helps teams distinguish between critical architectural flaws and subjective preferences.',
					],
					commonCandidateTraps: [
						'Using harsh or dismissive language ("This code is terrible").',
						'Not providing an actionable code example to illustrate the fix.',
					],
				},
			},
		],
		quiz: [
			{
				id: 'sp-q2-1',
				question: 'In a React component, a search input rapidly dispatches API requests via an effect whenever the user types. What critical defect occurs if request cancellation is omitted?',
				options: [
					'The browser HTTP cache runs out of memory and crashes the tab',
					'A network race condition where a slower, older request resolves AFTER a faster, newer request, rendering stale search results',
					'The React Fiber engine permanently halts the JavaScript call stack',
					'The search input value is cleared after every keystroke',
				],
				correctAnswerIndex: 1,
				explanation: 'Without AbortController or query key deduplication, slower earlier network requests can fulfill after newer requests, overwriting current data with outdated search results.',
				conceptTag: 'Async Race Conditions',
			},
			{
				id: 'sp-q2-2',
				question: 'You review a PR where a root-level ThemeContext.Provider passes `value={{ theme, setTheme, user, setUser, notifications }}` without useMemo. What is the architectural impact?',
				options: [
					'The browser will throw a fatal JavaScript reference error',
					'A new object reference is created on every single root render, forcing ALL components consuming ThemeContext to re-render even if their specific slice did not change',
					'The theme colors will fail to apply to CSS stylesheets',
					'The React DevTools Profiler will disable component inspection',
				],
				correctAnswerIndex: 1,
				explanation: 'Passing an unmemoized object literal into a Context Provider generates a new memory reference on every render, triggering cascading re-renders across all context subscribers.',
				conceptTag: 'Context Performance',
			},
			{
				id: 'sp-q2-3',
				question: 'Which of the following is considered an anti-pattern when designing reusable React component libraries?',
				options: [
					'Using TypeScript discriminated unions for polymorphic component variants',
					'Passing 30+ optional boolean props to customize layout instead of using Compound Components or Composition (children / slots)',
					'Supporting accessibility via WAI-ARIA attributes and keyboard handlers',
					'Exporting components as tree-shakeable ES modules',
				],
				correctAnswerIndex: 1,
				explanation: 'Creating "god components" with dozens of configuration props causes brittle, bloated components. Compound components and composition provide far superior flexibility.',
				conceptTag: 'Component Design Patterns',
			},
			{
				id: 'sp-q2-4',
				question: 'A pull request modifies a list item click handler to update state, but uses `<div onClick={handleClick}>` without `tabIndex="0"` or `onKeyDown`. What standard does this violate?',
				options: [
					'W3C CSS3 Layout Grid Specification',
					'WCAG 2.1 Principle of Operability (Keyboard Accessibility)',
					'ECMAScript 2024 Strict Mode Syntax Rules',
					'React 19 Server Actions Specification',
				],
				correctAnswerIndex: 1,
				explanation: 'Non-semantic elements with click handlers are invisible to keyboard-only and screen reader users unless equipped with semantic button tags or proper ARIA role and keyboard listeners.',
				conceptTag: 'Accessibility (a11y)',
			},
			{
				id: 'sp-q2-5',
				question: 'What is the most constructive way for a Senior Specialist to classify and communicate feedback on a team pull request?',
				options: [
					'Reject the PR immediately without explanations until the author figures out the issues',
					'Prefix comments with severity tags (e.g. [Blocker: Race Condition], [Performance], [Nit]) with clear rationale and code recommendations',
					'Rewrite the author’s branch silently without leaving any comments',
					'Approve the PR and fix the bugs directly in production later',
				],
				correctAnswerIndex: 1,
				explanation: 'Explicit severity tags with rationale and code examples provide clear prioritization, enabling the author to fix critical blockers while understanding architectural context.',
				conceptTag: 'Review Communication',
			},
		],
		codeChallenges: [
			{
				id: 'sp-lab-2',
				title: 'Automated Code Review Anti-Pattern Detector',
				difficulty: 'Medium',
				prompt: 'Write an analyzeComponentIssues function that inspects a code string and detects anti-patterns: "UNMEMOIZED_CONTEXT", "MISSING_ABORT_CONTROLLER", and "ANY_TYPE_USAGE", returning a list of identified issues.',
				starterCode: `export function analyzeComponentIssues(code: string): {
  issueCode: string
  severity: 'high' | 'medium' | 'low'
  message: string
}[] {
  const issues: any[] = []
  // TODO: Inspect code for anti-patterns and return structured critique
  return issues
}`,
				solutionCode: `export function analyzeComponentIssues(code: string): {
  issueCode: string
  severity: 'high' | 'medium' | 'low'
  message: string
}[] {
  const issues: { issueCode: string; severity: 'high' | 'medium' | 'low'; message: string }[] = []

  if (code.includes('.Provider') && code.includes('value={{') && !code.includes('useMemo')) {
    issues.push({
      issueCode: 'UNMEMOIZED_CONTEXT',
      severity: 'high',
      message: 'Context Provider value is an unmemoized object literal, causing cascading child re-renders.'
    })
  }

  if (code.includes('useEffect') && code.includes('fetch(') && !code.includes('AbortController')) {
    issues.push({
      issueCode: 'MISSING_ABORT_CONTROLLER',
      severity: 'high',
      message: 'Async fetch in useEffect lacks AbortController cancellation, creating network race conditions.'
    })
  }

  if (code.includes(': any') || code.includes('<any>')) {
    issues.push({
      issueCode: 'ANY_TYPE_USAGE',
      severity: 'medium',
      message: 'Avoid "any" type; use strict interfaces, unknown with type guards, or generics.'
    })
  }

  return issues
}`,
				explanation: 'Scans source code for common architectural anti-patterns and generates structured code review findings.',
				testCases: [
					{
						description: 'Detects unmemoized context provider value',
						assertion: "analyzeComponentIssues('<Theme.Provider value={{ a: 1 }}>').some(i => i.issueCode === 'UNMEMOIZED_CONTEXT')",
					},
					{
						description: 'Detects fetch without AbortController in useEffect',
						assertion: "analyzeComponentIssues('useEffect(() => { fetch(\"/api\"); }, [])').some(i => i.issueCode === 'MISSING_ABORT_CONTROLLER')",
					},
				],
			},
		],
	},
	{
		id: 'sp-m3',
		number: 3,
		title: 'Synthesis, Problem Framing & Technical Writing (RFCs & ADRs)',
		shortTitle: 'RFCs & ADRs Under Ambiguity',
		subtitle: 'Decomposing Ambiguity, Architecture Decision Records & System Design Notes',
		category: 'specialist-rfcs',
		estimatedTime: '30 mins',
		theorySections: [
			{
				id: 'sec-sp3-adr',
				title: '1. The Anatomy of an Architecture Decision Record (ADR)',
				badge: 'Technical Documentation',
				summary: 'ADRs capture critical architectural choices, preserving institutional knowledge. A senior specialist authors ADRs with clear context, options evaluated, decision rationale, and negative consequences.',
				bulletPoints: [
					'Title & Metadata: Short title (e.g. ADR-007: Migration from Redux to Zustand), Status (Draft / Accepted / Superceded), Date, Authors.',
					'Context & Problem Statement: What problem are we solving? What are the business and technical constraints?',
					'Decision Drivers: Key criteria (e.g. Bundle size < 5kB, TypeScript inference, zero boilerplate, SSR hydration compatibility).',
					'Considered Options: Pros/Cons of 2-3 realistic alternatives evaluated.',
					'Decision Outcome: The chosen solution and explicit justification.',
					'Consequences: Both positive benefits AND acknowledged trade-offs / migration costs.',
				],
				codeExamples: [
					{
						title: 'Standard Industry ADR Template (Markdown)',
						language: 'markdown',
						code: `# ADR-014: Adoption of Server State Management with TanStack Query

## Status
Accepted (2026-09-04)

## Context
Our dashboard application previously synchronized API responses into global Redux slices. As the application grew to 45 endpoints, engineers spent 40% of sprint capacity writing boilerplate reducers, loading flags, and manual cache invalidations. Several production bugs were caused by race conditions during tab navigation.

## Decision Drivers
1. Eliminate manual loading/error/success boilerplate.
2. Provide built-in request deduplication and background cache revalidation.
3. Reduce client JavaScript bundle size.
4. Support optimistic UI updates with automatic rollback.

## Considered Options
- **Option 1**: Retain Redux Toolkit + RTK Query.
- **Option 2**: Adopt TanStack Query + lightweight Zustand for UI state.
- **Option 3**: Build internal fetch hook wrapper with SWR.

## Decision Outcome
Adopt **Option 2 (TanStack Query + Zustand)**. TanStack Query specializes exclusively in async server cache management, while Zustand handles purely local UI state without Redux Provider overhead.

## Consequences
- **Positive**: 65% reduction in state-related boilerplate; eliminates manual race condition bugs.
- **Negative**: Requires team training on cache key management and query invalidation patterns; 12kB addition to bundle.
`,
						explanation: 'A complete ADR documents context, alternatives, and trade-offs so future engineers understand why the decision was made.',
					},
				],
				interviewCheatSheet: {
					whyZaraAsks: 'To evaluate your ability to formulate structured technical documentation and synthesize ambiguous requirements into concrete architectural standards.',
					keyPhrasesToSay: [
						'An ADR is incomplete without documenting the negative consequences and trade-offs of the chosen solution.',
						'When framing ambiguous requirements, I start by defining data contracts, error budgets, and boundary constraints before writing UI components.',
					],
					commonCandidateTraps: [
						'Writing an ADR that reads like a promotional pitch without acknowledging drawbacks, migration overhead, or risks.',
					],
				},
			},
			{
				id: 'sec-sp3-ambiguity',
				title: '2. Decomposing Ambiguity into Concrete Technical Specs (RFCs)',
				badge: 'Problem Framing',
				summary: 'When product requirements are vague ("make the search experience faster and real-time"), specialists clarify constraints, define measurable SLOs, and write RFCs outlining phased implementation milestones.',
				bulletPoints: [
					'Step 1 • Establish Quantifiable SLOs: Convert "fast" into "P95 keystroke-to-render latency under 50ms, LCP under 1.2s".',
					'Step 2 • Define Component Hierarchy & Data Flow: Diagram data ownership and network protocol (REST, GraphQL, WebSockets, SSE).',
					'Step 3 • Edge Cases & Failure Modes: Specify offline behavior, rate-limiting HTTP 429 backoff, network timeouts, and fallback UI states.',
					'Step 4 • Rollout & Migration Strategy: Feature flags, A/B canary testing, and deterministic rollback criteria.',
				],
				codeExamples: [
					{
						title: 'RFC Feature Flag & Rollback Specification',
						language: 'typescript',
						code: `// RFC Phased Rollout Specification
export interface FeatureRolloutPlan {
  featureKey: 'realtime_search_v2'
  phases: [
    { phase: 1, trafficPercent: 5, targetGroup: 'internal_employees', durationDays: 3 },
    { phase: 2, trafficPercent: 25, targetGroup: 'beta_users', durationDays: 5 },
    { phase: 3, trafficPercent: 100, targetGroup: 'general_public', durationDays: 0 }
  ]
  abortTriggers: {
    maxErrorRatePercent: 0.5,       // Roll back if error rate > 0.5%
    p95LatencyThresholdMs: 250,      // Roll back if P95 latency > 250ms
    clientCrashRatePercent: 0.05
  }
}`,
						explanation: 'Production RFCs include measurable abort triggers and phased rollout plans to mitigate risk.',
					},
				],
				interviewCheatSheet: {
					whyZaraAsks: 'Zara checks whether you can take underspecified prompts and create disciplined engineering execution plans.',
					keyPhrasesToSay: [
						'When facing ambiguous requirements, I lead by defining the boundary data contracts and establishing measurable latency and error SLOs.',
						'Every architectural RFC must define feature-flag rollback triggers and telemetry metrics before writing implementation code.',
					],
					commonCandidateTraps: [
						'Jumping immediately into coding before defining data boundaries, edge cases, and success metrics.',
					],
				},
			},
		],
		quiz: [
			{
				id: 'sp-q3-1',
				question: 'What is the primary purpose of an Architecture Decision Record (ADR) in a scaling engineering organization?',
				options: [
					'To replace unit tests and end-to-end test suites',
					'To capture the context, evaluated alternatives, decision rationale, and accepted trade-offs of a significant architectural choice for future engineering reference',
					'To auto-generate React component boilerplate using AI',
					'To serve as legal documentation for customer privacy agreements',
				],
				correctAnswerIndex: 1,
				explanation: 'ADRs capture why decisions were made, what trade-offs were accepted, and what alternatives were rejected, preventing recurring circular debates.',
				conceptTag: 'ADR Purpose & Structure',
			},
			{
				id: 'sp-q3-2',
				question: 'A Product Manager asks to "make the checkout experience real-time". As a Specialist framing this ambiguous request, what is the FIRST step you should take?',
				options: [
					'Immediately install Socket.io and rewrite the entire backend in WebSockets',
					'Clarify user value, define concrete latency/freshness requirements (e.g. SSE vs polling vs WebSockets), and document data contracts and failure modes in an RFC',
					'Tell the PM that real-time features are impossible on the web',
					'Build a prototype without consulting backend or design teams',
				],
				correctAnswerIndex: 1,
				explanation: 'Specialists clarify ambiguity by defining user requirements, comparing transport protocols against real needs, and writing an RFC outlining contracts and failure modes.',
				conceptTag: 'Problem Framing Under Ambiguity',
			},
			{
				id: 'sp-q3-3',
				question: 'Which section of an ADR is frequently omitted by junior engineers but is considered CRITICAL by senior technical specialists?',
				options: [
					'The document title',
					'The date of writing',
					'Consequences and negative trade-offs (e.g. bundle size overhead, migration costs, learning curve)',
					'The name of the company',
				],
				correctAnswerIndex: 2,
				explanation: 'Documenting negative consequences and trade-offs ensures the team makes decisions with full awareness of costs, maintenance burdens, and limitations.',
				conceptTag: 'ADR Rigor',
			},
			{
				id: 'sp-q3-4',
				question: 'When writing a technical RFC for migrating a legacy monolithic frontend to a modular architecture, how should the migration strategy be structured to minimize risk?',
				options: [
					'Big-Bang migration: Rewrite the entire application in a separate branch for 6 months and switch traffic all at once',
					'Incremental Strangler Fig Pattern: Migrate routes or sub-features incrementally behind feature flags with automated telemetry and rollback criteria',
					'Delete all legacy code immediately and rebuild from scratch in production',
					'Only migrate if all backend APIs are completely rewritten first',
				],
				correctAnswerIndex: 1,
				explanation: 'The Strangler Fig pattern allows teams to incrementally replace legacy routes with new implementations behind feature flags, maintaining zero downtime and instant rollback capability.',
				conceptTag: 'Migration Patterns (Strangler Fig)',
			},
			{
				id: 'sp-q3-5',
				question: 'What metric should be included in an RFC to establish clear objective success criteria for a frontend performance optimization initiative?',
				options: [
					'Lines of code deleted from the repository',
					'P75 / P95 Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1) measured via Real User Monitoring (RUM)',
					'Total number of GitHub stars on external dependencies',
					'The speed of the developer’s local laptop CPU',
				],
				correctAnswerIndex: 1,
				explanation: 'Objective performance criteria rely on industry-standard Core Web Vitals (LCP, INP, CLS) tracked in production across real user devices (RUM).',
				conceptTag: 'SLOs & Success Metrics',
			},
		],
		codeChallenges: [
			{
				id: 'sp-lab-3',
				title: 'ADR Document Formatter & Validator',
				difficulty: 'Medium',
				prompt: 'Implement a validateAndFormatADR function that inspects an ADR object, verifies all required sections ("title", "status", "context", "decision", "consequences", "tradeoffs") exist and are non-empty, and returns formatted markdown or an error message.',
				starterCode: `interface ADRInput {
  title: string
  status: 'Draft' | 'Accepted' | 'Rejected'
  context: string
  decision: string
  consequences: string
  tradeoffs: string[]
}

export function validateAndFormatADR(adr: ADRInput): {
  isValid: boolean
  markdown: string
  validationErrors: string[]
} {
  // TODO: Validate ADR fields and produce standard markdown
  return { isValid: false, markdown: '', validationErrors: [] }
}`,
				solutionCode: `interface ADRInput {
  title: string
  status: 'Draft' | 'Accepted' | 'Rejected'
  context: string
  decision: string
  consequences: string
  tradeoffs: string[]
}

export function validateAndFormatADR(adr: ADRInput): {
  isValid: boolean
  markdown: string
  validationErrors: string[]
} {
  const errors: string[] = []

  if (!adr.title.trim()) errors.push('Title is required')
  if (!adr.context.trim()) errors.push('Context & Problem Statement is required')
  if (!adr.decision.trim()) errors.push('Decision Outcome is required')
  if (!adr.consequences.trim()) errors.push('Consequences are required')
  if (!adr.tradeoffs || adr.tradeoffs.length === 0) errors.push('At least one trade-off must be documented')

  if (errors.length > 0) {
    return { isValid: false, markdown: '', validationErrors: errors }
  }

  const md = \`# \${adr.title}

## Status
\${adr.status}

## Context
\${adr.context}

## Decision Outcome
\${adr.decision}

## Consequences & Trade-offs
\${adr.consequences}

### Documented Trade-offs:
\${adr.tradeoffs.map(t => \`- \${t}\`).join('\\n')}
\`

  return { isValid: true, markdown: md, validationErrors: [] }
}`,
				explanation: 'Validates ADR structural completeness and formats a clean markdown document.',
				testCases: [
					{
						description: 'Rejects incomplete ADR missing tradeoffs',
						assertion: "validateAndFormatADR({ title: 'T', status: 'Draft', context: 'C', decision: 'D', consequences: 'Q', tradeoffs: [] }).isValid === false",
					},
					{
						description: 'Accepts and formats complete ADR',
						assertion: "validateAndFormatADR({ title: 'ADR-1', status: 'Accepted', context: 'Ctx', decision: 'Dec', consequences: 'Cons', tradeoffs: ['Cost'] }).isValid === true",
					},
				],
			},
		],
	},
	{
		id: 'sp-m4',
		number: 4,
		title: 'Communication for Non-Technical Audiences & Stakeholder Disagreement',
		shortTitle: 'Stakeholders & Communication',
		subtitle: 'Technical Analogies, Managing Disagreements & Influence Without Authority',
		category: 'specialist-communication',
		estimatedTime: '25 mins',
		theorySections: [
			{
				id: 'sec-sp4-analogies',
				title: '1. Explaining Deep Frontend Concepts to Non-Technical Audiences',
				badge: 'Jargon Translation',
				summary: 'Specialists bridge the communication gap between engineering and business. They translate complex technical mechanisms into intuitive analogies and quantifiable business outcomes (conversion rates, retention, bounce rates).',
				bulletPoints: [
					'Hydration Mismatch Analogy: "Think of SSR as delivering a printed book (fast to see), and hydration as binding interactive digital buttons onto each page. If the printed text doesn’t match what the digital overlay expects, the page flashes and freezes."',
					'Interaction to Next Paint (INP) Analogy: "INP is like the physical delay between pressing an elevator button and the light turning on. If the elevator takes 500ms to illuminate, users smash the button repeatedly, thinking the system is broken."',
					'Bundle Size & Tree Shaking: "Tree shaking is packing for a flight by bringing only the clothes you will actually wear, rather than checking your entire bedroom wardrobe into the cargo hold."',
					'Accessibility (a11y) & Focus Traps: "A keyboard focus trap without an escape key is like entering a revolving door that locks from the outside—users cannot exit without restarting the building."',
				],
				codeExamples: [
					{
						title: 'Translating Technical Jargon to Executive Business Impact',
						language: 'typescript',
						code: `// Jargon Translation Reference Matrix

export const STAKEHOLDER_COMMUNICATION_GUIDE = {
  concept: 'Reducing JavaScript Bundle by 400kB & Improving INP from 450ms to 90ms',
  
  technicalExplanation:
    'Code-splitting vendor chunks and deferring non-critical analytics scripts reduces main-thread long tasks exceeding 50ms during user interaction reconciliation.',
    
  executiveSummary:
    'By streamlining our web page code, user button clicks and filters will respond instantly (under 100ms) instead of lagging half a second. Industry data shows this responsiveness directly decreases cart abandonment by 8-12% on mobile networks.'
}`,
						explanation: 'Framing technical improvements in terms of latency, mobile experience, and conversion metrics creates alignment with product managers and executives.',
					},
				],
				interviewCheatSheet: {
					whyZaraAsks: 'To test if you can communicate complex engineering concepts without alienating non-technical colleagues, a core specialist requirement.',
					keyPhrasesToSay: [
						'When explaining technical debt to product managers, I quantify it in terms of feature velocity drag and user conversion impact rather than abstract code beauty.',
						'I use concrete everyday analogies (like blueprint vs construction, or baggage weight) to explain hydration and main-thread blocking.',
					],
					commonCandidateTraps: [
						'Dumping raw technical jargon (AST, microtasks, V8 Turbofan, monads) on non-technical stakeholders without explaining why it matters.',
					],
				},
			},
			{
				id: 'sec-sp4-conflict',
				title: '2. Navigating Technical Disagreements & Influence Without Authority',
				badge: 'Conflict & Influence',
				summary: 'Senior specialists resolve engineering deadlocks through objective data, prototype spikes, and structured trade-off reviews rather than dogmatic arguments.',
				bulletPoints: [
					'Separate Preferences from Requirements: Differentiate between personal aesthetic taste and measurable performance/maintainability constraints.',
					'Spike Prototypes & Benchmarks: When teammates disagree on two competing libraries (e.g. Tailwind vs Vanilla Extract), build a 1-day proof-of-concept benchmark measuring bundle size, developer velocity, and build times.',
					'Agree and Commit (Disagree and Commit): Once an architectural decision is documented in an ADR, rally behind the decision fully to prevent fractured codebases.',
					'Empathy in Code Reviews: Validate the author’s intent before critiquing the implementation ("I see what you are aiming to accomplish here...").',
				],
				codeExamples: [
					{
						title: 'Structured Engineering Dispute Resolution Framework',
						language: 'markdown',
						code: `### Dispute Resolution Framework: "Zustand vs Redux Toolkit"

1. **Acknowledge Shared Goals**: Both sides want clean state management with high developer velocity and zero re-render bugs.
2. **Define Objective Evaluation Criteria**:
   - Bundle footprint (< 5kB vs 30kB)
   - TypeScript boilerplate overhead (lines of code per action)
   - DevTools inspection capability
   - Team familiarity & onboarding curve
3. **Execute a Timeboxed Spike**: Build the identical complex shopping cart slice in both libraries.
4. **Present Data to the Team**:
   - Zustand: 1.2kB bundle, 24 lines of code, zero context provider wrapper.
   - Redux Toolkit: 28kB bundle, 78 lines of code with slice/action boilerplate.
5. **Team Consensus / ADR Recording**: Record decision in ADR-009 with team sign-off.
`,
						explanation: 'Resolving disputes with timeboxed spikes and objective criteria eliminates subjective arguments.',
					},
				],
				interviewCheatSheet: {
					whyZaraAsks: 'Zara evaluates your leadership maturity, emotional intelligence, and ability to unite engineering teams behind sound architectural decisions.',
					keyPhrasesToSay: [
						'When engineers disagree, I de-escalate subjective debates by establishing shared evaluation criteria and running a timeboxed spike benchmark.',
						'I practice "disagree and commit"—once a decision is finalized in an ADR, I support it 100% to ensure code consistency.',
					],
					commonCandidateTraps: [
						'Claiming you never have disagreements or that you always force your way through authority.',
						'Being passive-aggressive when your preferred library or pattern is not chosen.',
					],
				},
			},
		],
		quiz: [
			{
				id: 'sp-q4-1',
				question: 'How should a Senior Frontend Specialist explain "Hydration Mismatch" to a Product Manager who noticed a brief visual glitch on page load?',
				options: [
					'Tell the PM that the React Fiber reconciler threw an unhandled hydration exception during DOM mutation diffing',
					'Explain that server-rendered HTML delivered a static preview first, but when the browser downloaded the interactive code, it noticed a difference (e.g. timestamps or user state) and had to redraw the element to ensure button clicks work accurately',
					'Blame the backend database team for sending invalid JSON',
					'State that hydration mismatches are normal and cannot be fixed in modern web development',
				],
				correctAnswerIndex: 1,
				explanation: 'Translating the issue into clear, visual terms (static preview vs interactive code synchronization) helps non-technical stakeholders understand the cause without drowning in AST jargon.',
				conceptTag: 'Non-Technical Communication',
			},
			{
				id: 'sp-q4-2',
				question: 'Two senior engineers on your team are deadlocked in a heated debate over adopting Tailwind CSS vs CSS Modules. What is the most effective way to resolve the disagreement?',
				options: [
					'Let the engineers argue until the louder one wins',
					'Establish objective criteria (build times, bundle size, onboarding speed, design system integration), run a 1-day prototype spike on a sample feature, and evaluate the data collectively in an ADR',
					'Choose a third completely unrelated library without consulting either engineer',
					'Ban CSS styling from the codebase entirely',
				],
				correctAnswerIndex: 1,
				explanation: 'Timeboxed prototype spikes with objective criteria depersonalize the decision, replacing emotional attachment with empirical data.',
				conceptTag: 'Dispute Resolution & Influence',
			},
			{
				id: 'sp-q4-3',
				question: 'A Product Manager wants to skip technical debt refactoring and push 5 new features immediately. How should you frame the rationale for addressing the technical debt?',
				options: [
					'Complain that the existing codebase looks messy and unappealing',
					'Translate the tech debt into business risk: show how unresolved architecture debt currently adds 3 days to every feature sprint and increases mobile checkout crash rates by 4%',
					'Refuse to write any new code until all debt is resolved',
					'Quietly work overtime without telling the product team',
				],
				correctAnswerIndex: 1,
				explanation: 'Framing technical debt as a drag on sprint velocity, customer conversion, and reliability directly aligns engineering needs with business priorities.',
				conceptTag: 'Stakeholder Influence',
			},
			{
				id: 'sp-q4-4',
				question: 'What does the principle of "Disagree and Commit" mean in professional software engineering?',
				options: [
					'Pretending to agree in meetings while secretly writing your preferred code pattern',
					'Vigorously debating ideas during the decision phase, but once a decision is agreed upon and documented in an ADR, fully committing to its successful execution without lingering friction',
					'Refusing to commit any git code if you disagree with the team lead',
					'Submitting a formal complaint whenever a vote does not go your way',
				],
				correctAnswerIndex: 1,
				explanation: '"Disagree and commit" allows passionate technical debates during planning, while guaranteeing team cohesion and code consistency once an architectural direction is chosen.',
				conceptTag: 'Engineering Teamwork & Culture',
			},
			{
				id: 'sp-q4-5',
				question: 'When communicating Core Web Vitals performance improvements (reducing INP from 400ms to 80ms) to marketing stakeholders, which explanation is most compelling?',
				options: [
					'We eliminated main-thread long tasks exceeding the 50ms scheduler threshold during fiber reconciliation',
					'Buttons and interactive filters now respond instantly when tapped on mobile devices, preventing rage-clicks and directly improving checkout conversion rates',
					'We upgraded our webpack compilation pipeline to use esbuild',
					'We increased the JavaScript heap memory allocation limit',
				],
				correctAnswerIndex: 1,
				explanation: 'Marketing and product stakeholders value user experience metrics, mobile responsiveness, and conversion rate impact over compiler details.',
				conceptTag: 'Business Value Translation',
			},
		],
		codeChallenges: [
			{
				id: 'sp-lab-4',
				title: 'Non-Technical Jargon Score & Translation Engine',
				difficulty: 'Medium',
				prompt: 'Implement a translateJargonToValue function that replaces technical buzzwords with clear stakeholder-friendly explanations and returns an audience-appropriate summary.',
				starterCode: `export function translateJargonToValue(technicalPitch: string): {
  translatedText: string
  jargonFound: string[]
  clarityScore: number // 0-100
} {
  // TODO: Detect technical jargon and produce stakeholder-friendly text
  return { translatedText: '', jargonFound: [], clarityScore: 100 }
}`,
				solutionCode: `export function translateJargonToValue(technicalPitch: string): {
  translatedText: string
  jargonFound: string[]
  clarityScore: number
} {
  const dictionary: Record<string, string> = {
    'hydration mismatch': 'visual discrepancy between initial page load and interactive buttons',
    'layout thrashing': 'page stutter caused by rapid screen recalculations',
    'INP': 'tap-to-response interaction delay',
    'tree shaking': 'removing unused code to lighten mobile downloads',
    'reconciliation': 'smart UI update diffing'
  }

  const jargonFound: string[] = []
  let translated = technicalPitch

  Object.entries(dictionary).forEach(([jargon, plain]) => {
    const regex = new RegExp(jargon, 'gi')
    if (regex.test(technicalPitch)) {
      jargonFound.push(jargon)
      translated = translated.replace(regex, plain)
    }
  })

  const penalty = jargonFound.length * 15
  const clarityScore = Math.max(20, 100 - penalty)

  return {
    translatedText: translated,
    jargonFound,
    clarityScore
  }
}`,
				explanation: 'Translates technical jargon terms into plain stakeholder value statements.',
				testCases: [
					{
						description: 'Detects and translates hydration mismatch and tree shaking',
						assertion: "translateJargonToValue('Fixing hydration mismatch and tree shaking').jargonFound.length === 2",
					},
				],
			},
		],
	},
]
