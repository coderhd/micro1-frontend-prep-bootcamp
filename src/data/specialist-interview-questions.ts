import { InterviewQuestionItem } from '../types/interview'

export const SPECIALIST_ZARA_QUESTIONS: InterviewQuestionItem[] = [
	{
		id: 'sp-round-1',
		stage: 'specialist-intro',
		stageName: 'Candidate Background & Technical Reasoning Focus',
		question:
			"Hi! I'm Zara, your AI recruiter at micro1. To kick off our Frontend Engineer Specialist interview, could you summarize your background in frontend architecture, and explain why technical reasoning, architectural decision-making, and clear written documentation are essential in high-impact engineering teams?",
		contextForCandidate:
			'Highlight 3+ years of professional React/TypeScript engineering, explaining how architectural clarity, ADRs, and disciplined technical writing prevent tech debt and scale engineering teams.',
		expectedKeywords: [
			'architecture',
			'trade-offs',
			'RFC',
			'ADR',
			'documentation',
			'TypeScript',
			'React',
			'maintainability',
			'scalability',
			'technical writing',
		],
		criticalConcepts: [
			'Clear technical reasoning prevents recurring architectural mistakes',
			'Written documentation (ADRs/RFCs) preserves institutional knowledge',
			'Bridging high-level system design with code-level precision',
		],
		drillDownTriggerWords: [
			{
				triggerWord: 'ADR',
				drillDownQuestion:
					'How do you ensure teams actually follow and maintain Architecture Decision Records over time?',
				drillDownExpectedKeywords: ['version control', 'code review', 'living document', 'superceded'],
			},
		],
		modelAnswerPoints: [
			'I bring over 4 years of experience architecting large-scale React and TypeScript web applications.',
			'In complex systems, writing code is only half the job; the real leverage comes from technical reasoning—evaluating trade-offs (like CSR vs SSR or state boundaries) before building.',
			'I advocate for lightweight Architecture Decision Records (ADRs) and RFCs because they document context, evaluated alternatives, and trade-offs, enabling asynchronous alignment across distributed teams.',
		],
	},
	{
		id: 'sp-round-2',
		stage: 'specialist-rationale',
		stageName: 'Design Decision Rationale & Trade-off Matrices',
		question:
			"Imagine your team is building a global e-commerce platform with 200,000 product SKUs, personalized user recommendations, and real-time inventory counts. Walk me through your design decision rationale for choosing the rendering strategy and state architecture. How do you weigh the trade-offs?",
		contextForCandidate:
			'Contrast CSR, SSR, SSG, and ISR/RSC using metrics (TTFB, LCP, server costs). Separate Server State (TanStack Query) from URL State and local UI state.',
		expectedKeywords: [
			'ISR',
			'RSC',
			'TTFB',
			'LCP',
			'TanStack Query',
			'Server State',
			'URL state',
			'edge cache',
			'on-demand revalidation',
			'trade-offs',
		],
		criticalConcepts: [
			'Quantitative trade-offs: TTFB vs LCP vs compute cost',
			'On-demand ISR for large product catalogs (avoiding O(N) build bottlenecks)',
			'State decoupling: Server cache vs UI state vs URL query parameters',
		],
		drillDownTriggerWords: [
			{
				triggerWord: 'SSR',
				drillDownQuestion:
					'How do you prevent high TTFB and database bottlenecks on cold SSR requests under traffic surges?',
				drillDownExpectedKeywords: ['edge caching', 'stale-while-revalidate', 'CDN', 'streaming'],
			},
		],
		modelAnswerPoints: [
			'For 200k SKUs, full SSG build times are prohibitive, while pure SSR incurs heavy TTFB and server compute costs under traffic spikes.',
			'I would select Incremental Static Regeneration (ISR) with on-demand webhook revalidation, caching static product pages at the CDN edge for sub-80ms TTFB and optimal SEO.',
			'For real-time inventory and personalized badges, I would leverage React Server Component streaming or client-side TanStack Query hooks with stale-while-revalidate caching.',
			'State is strictly partitioned: URL query params for filters/search, TanStack Query for server data cache, and a lightweight Zustand store for client UI state (cart drawer, checkout modal).',
		],
	},
	{
		id: 'sp-round-3',
		stage: 'specialist-critique',
		stageName: 'Design Critique & Code Review Evaluation',
		question:
			"During a code review, you encounter a pull request where an engineer implemented a search autocomplete dropdown by placing a `fetch` call inside a `useEffect` on every keystroke, storing results in a root-level React Context provider with an unmemoized object literal. How do you evaluate and critique this implementation in written feedback?",
		contextForCandidate:
			'Identify the async race condition, missing AbortController, debouncing necessity, unmemoized Context causing cascading re-renders, and provide constructive written feedback.',
		expectedKeywords: [
			'race condition',
			'AbortController',
			'debounce',
			'unmemoized Context',
			'cascading re-renders',
			'useMemo',
			'actionable feedback',
			'TanStack Query',
			'keyboard accessibility',
		],
		criticalConcepts: [
			'Async race conditions (older requests resolving after newer ones)',
			'Context provider re-render cascade due to object reference inequality',
			'Constructive feedback structure: Observation, Impact, and Code Solution',
		],
		drillDownTriggerWords: [
			{
				triggerWord: 'debounce',
				drillDownQuestion:
					'Why is debouncing alone insufficient to prevent network race conditions without an AbortController?',
				drillDownExpectedKeywords: ['network latency variance', 'out-of-order resolution', 'stale response'],
			},
		],
		modelAnswerPoints: [
			'I would structure the review comment into Observation, Impact, and Solution with code snippets.',
			'First, the effect creates a critical race condition: if the user types quickly, an earlier slow request can resolve after a faster newer request, rendering stale search results. We must attach an AbortController cleanup.',
			'Second, passing an unmemoized object into a root Context provider creates a new object reference on every keystroke, triggering cascading re-renders across the entire component tree.',
			'Third, I would recommend adding a 250ms debounce and moving server state into TanStack Query to gain deduplication, caching, and automatic cancellation out of the box, while ensuring the dropdown supports WCAG keyboard navigation.',
		],
	},
	{
		id: 'sp-round-4',
		stage: 'specialist-rfcs',
		stageName: 'Synthesis & Problem Framing Under Ambiguity',
		question:
			"A Product Manager gives you an ambiguous requirement: 'We need to make our slow, monolithic checkout flow feel instantaneous and modular for international markets.' How do you frame this problem, break down ambiguity, and author a technical RFC / ADR?",
		contextForCandidate:
			'Break vague requirements into measurable SLOs (P95 LCP < 1.2s, INP < 100ms), define data contracts, evaluate Strangler Fig migration, and structure the RFC/ADR with rollback criteria.',
		expectedKeywords: [
			'SLO',
			'Core Web Vitals',
			'Strangler Fig',
			'ADR',
			'RFC',
			'data contract',
			'feature flags',
			'rollback criteria',
			'phased rollout',
			'code splitting',
		],
		criticalConcepts: [
			'Translating ambiguous prompts into concrete quantifiable engineering SLOs',
			'Documenting ADRs with context, considered alternatives, and negative consequences',
			'Incremental migration strategies (Strangler Fig) with automated rollback triggers',
		],
		drillDownTriggerWords: [
			{
				triggerWord: 'Strangler Fig',
				drillDownQuestion:
					'How do you handle shared session state and authentication tokens between legacy and newly migrated routes?',
				drillDownExpectedKeywords: ['shared cookies', 'token bridge', 'session storage', 'BFF gateway'],
			},
		],
		modelAnswerPoints: [
			'I begin by decomposing ambiguity into measurable engineering SLOs: defining "instantaneous" as P95 LCP < 1.2s, INP < 80ms, and total initial JS bundle under 150kB.',
			'I author an RFC outlining the system architecture: decomposing the monolith via the Strangler Fig pattern, where checkout steps are isolated into modular lazy-loaded sub-apps.',
			'The RFC specifies strict data contracts between steps using Zod schemas and defines internationalization strategies (currency formatting, RTL layouts, localized tax engines).',
			'Finally, I document rollback criteria: feature flags with automated canary monitoring that automatically abort if the payment failure rate exceeds 0.2%.',
		],
	},
	{
		id: 'sp-round-5',
		stage: 'specialist-non-tech-comm',
		stageName: 'Communication for Non-Technical Audiences',
		question:
			"How would you explain the concepts of 'React Hydration Mismatch' and 'Interaction to Next Paint (INP)' to a non-technical Product Manager who is concerned about a visual flicker and button delay reported by beta users?",
		contextForCandidate:
			'Use clear, non-jargon analogies (e.g. static blueprint vs interactive machinery, elevator button light response) and connect technical issues to conversion and user experience.',
		expectedKeywords: [
			'analogy',
			'static preview',
			'interactive machinery',
			'tap delay',
			'responsiveness',
			'conversion rate',
			'mobile users',
			'main thread',
			'business impact',
		],
		criticalConcepts: [
			'Translating technical mechanisms into relatable physical analogies',
			'Explaining the user-facing consequences without confusing jargon',
			'Connecting performance optimizations to business metrics (cart abandonment, retention)',
		],
		drillDownTriggerWords: [
			{
				triggerWord: 'analogy',
				drillDownQuestion:
					'How would you explain why mobile users experience higher delay than desktop users to an executive?',
				drillDownExpectedKeywords: ['CPU throttling', 'single-core speed', 'network latency', 'battery constraints'],
			},
		],
		modelAnswerPoints: [
			'For Hydration: I explain that server rendering is like sending users a printed photograph of a car—it loads instantly so they can see it. Hydration is the engine and steering wheel being installed in the background. A hydration mismatch happens when the printed picture shows a blue seat but the engine arrives with a red seat; the browser has to quickly redraw the car, causing that visual flicker.',
			'For INP: I use the elevator button analogy. When you press an elevator button, you expect the light to illuminate immediately. If there is a 500ms delay, you wonder if it registered and press it multiple times. On our site, heavy background scripts delay the button feedback, causing frustration and lower checkout completion.',
			'I frame our fix in business terms: reducing button lag under 100ms increases mobile checkout conversion by an estimated 5–8%.',
		],
	},
	{
		id: 'sp-round-6',
		stage: 'specialist-stakeholders',
		stageName: 'Stakeholder Disagreement & Influence Without Authority',
		question:
			"Two senior engineers on your team are divided over whether to adopt a strict design system component library or build custom CSS for every feature to move faster. Meanwhile, the PM is pressing to ship next week. How do you resolve this conflict and influence the team toward consensus?",
		contextForCandidate:
			'Describe a structured dispute resolution framework: establishing shared criteria, building a quick prototype spike, quantifying technical debt vs speed, and practicing "Disagree and Commit".',
		expectedKeywords: [
			'shared criteria',
			'prototype spike',
			'trade-offs',
			'design system',
			'technical debt',
			'ADR',
			'Disagree and Commit',
			'velocity',
			'consistency',
		],
		criticalConcepts: [
			'Depersonalizing technical disputes with objective evaluation metrics',
			'Short timeboxed spikes to gather empirical benchmark data',
			'Balancing short-term product deadlines with long-term maintainability',
			'Recording team alignment in an ADR and practicing Disagree and Commit',
		],
		drillDownTriggerWords: [
			{
				triggerWord: 'Disagree and Commit',
				drillDownQuestion:
					'What do you do if an engineer continues to push back after a team decision has been finalized in an ADR?',
				drillDownExpectedKeywords: ['1-on-1 discussion', 'reiterate shared goals', 'code review standards', 'retrospective'],
			},
		],
		modelAnswerPoints: [
			'I start by aligning both sides around the shared goal: delivering this urgent release on time while avoiding a maintenance nightmare 3 months from now.',
			'I propose a phased pragmatic compromise: for the immediate launch next week, we utilize headless unstyled primitives (like Radix UI / Tailwind) to ship rapidly without bespoke CSS sprawl.',
			'To resolve the long-term direction, I run a 1-day timeboxed spike comparing component consistency, accessibility compliance, and onboarding speed.',
			'We evaluate the data together, document the agreed standard in an ADR, and adopt "Disagree and Commit"—ensuring all engineers follow the unified architecture once finalized.',
		],
	},
	{
		id: 'sp-round-7',
		stage: 'specialist-live-synthesis',
		stageName: 'Live Technical Reasoning & Architecture Synthesis',
		question:
			"To conclude, synthesize an end-to-end frontend architecture for a real-time collaborative document editor with offline support, presence avatars, and multi-tenant permission controls. How do you ensure high performance, reliable synchronization, and clear documentation for onboarding new engineers?",
		contextForCandidate:
			'Synthesize WebSockets/CRDTs (Yjs) for synchronization, IndexedDB for offline persistence, Web Workers for heavy diffing, and comprehensive ADR documentation.',
		expectedKeywords: [
			'CRDT',
			'Yjs',
			'WebSockets',
			'IndexedDB',
			'Web Workers',
			'optimistic updates',
			'presence',
			'ADR',
			'data boundaries',
			'conflict resolution',
		],
		criticalConcepts: [
			'Conflict-free Replicated Data Types (CRDTs) for offline-first real-time collaboration',
			'Offloading heavy diffing/parsing calculations to Web Workers to keep main thread at 60 FPS',
			'Comprehensive ADRs and architecture diagrams for seamless developer onboarding',
		],
		drillDownTriggerWords: [
			{
				triggerWord: 'CRDT',
				drillDownQuestion:
					'Why choose CRDTs over Operational Transformation (OT) for an offline-first collaborative architecture?',
				drillDownExpectedKeywords: ['peer-to-peer capability', 'serverless sync', 'deterministic convergence', 'offline replay'],
			},
		],
		modelAnswerPoints: [
			'For real-time multi-user editing with offline capabilities, I architecture the system around CRDTs (like Yjs) paired with WebSockets for peer presence and server synchronization.',
			'Offline storage is backed by IndexedDB, allowing users to edit without internet and deterministically merge changes upon reconnecting without data loss.',
			'To maintain a buttery 60 FPS main thread during large document diffing, I offload document parsing and syntax highlighting into background Web Workers.',
			'Permission state and tenant controls are validated via JWT scopes at the WebSocket handshake level and enforced on each operational patch.',
			'Finally, I document the system with C4 architecture diagrams and ADRs covering the synchronization lifecycle, providing new engineers with clear onboarding roadmaps and runbooks.',
		],
	},
]
