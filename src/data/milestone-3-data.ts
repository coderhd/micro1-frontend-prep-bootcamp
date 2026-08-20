import { Milestone } from '../types/curriculum'

export const MILESTONE_3_DATA: Milestone = {
	id: 'm3',
	number: 3,
	title: 'HTML, CSS Layouts, Core Web Vitals & Accessibility',
	shortTitle: 'CSS Layouts & CWV',
	subtitle: 'Flexbox, Grid, Specificity, Reflow/Repaint, Core Web Vitals & a11y Standards',
	category: 'css-a11y',
	estimatedTime: '25 mins',
	theorySections: [
		{
			id: 'css-layouts-engine',
			title: 'Box Model, Stacking Context & Browser Layout Engines',
			badge: 'Layout Architecture',
			summary: 'Modern CSS layouts rely on the CSS Box Model, the Stacking Context cascade, and differentiating 1D Flexbox content distribution from 2D CSS Grid templates.',
			bulletPoints: [
				'Box Model: Always use "box-sizing: border-box" so padding and borders are calculated inside the specified width/height rather than expanding it.',
				'Flexbox (1D): Excellent for single-axis alignment (rows or columns), distributing remaining space with flex-grow, flex-shrink, and flex-basis.',
				'CSS Grid (2D): Explicit two-dimensional layout system. "repeat(auto-fit, minmax(240px, 1fr))" creates intrinsically responsive card grids without media queries.',
				'Stacking Context: Formed by root, position: relative/absolute with z-index, opacity < 1, transform, filter, or will-change. Child z-index is strictly bounded by its parent stacking context.',
			],
			codeExamples: [
				{
					title: 'Intrinsically Responsive CSS Grid Without Media Queries',
					code: `.responsive-card-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 1.5rem;
}`,
					explanation: 'auto-fit collapses empty tracks while minmax ensures columns never shrink below 280px, auto-wrapping smoothly across mobile and desktop.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Tests if you can fix real UI bugs and write clean, maintainable responsive CSS without hacky fixed pixel heights.',
				keyPhrasesToSay: [
					'CSS Grid is layout-first (defining rows and columns first), while Flexbox is content-first (distributing space around items).',
					'Z-index bugs almost always stem from competing parent stacking contexts rather than missing z-index numbers.',
				],
				commonCandidateTraps: [
					'Confusing justify-content (main axis) with align-items (cross axis) in flexbox.',
				],
			},
		},
		{
			id: 'web-vitals-a11y',
			title: 'Core Web Vitals (CWV) & Web Accessibility (a11y)',
			badge: 'Web Performance & Compliance',
			summary: 'High-performing web applications meet strict Core Web Vitals thresholds (LCP, INP, CLS) and WCAG accessibility standards (semantic markup, ARIA roles, and keyboard navigation).',
			bulletPoints: [
				'Largest Contentful Paint (LCP < 2.5s): Optimize by preloading hero assets (<link rel="preload">), using WebP/AVIF images, and eliminating render-blocking stylesheets.',
				'Interaction to Next Paint (INP < 200ms): Replaced FID. Measures latency of all user interactions throughout the page lifecycle. Break long JS tasks using scheduler.yield() or web workers.',
				'Cumulative Layout Shift (CLS < 0.1): Prevent layout jumps by defining explicit width/height or aspect-ratio on images and embedding ads into reserved skeleton containers.',
				'Accessibility & ARIA: Use semantic elements (<main>, <nav>, <button> instead of <div onClick>). Ensure ARIA live regions (aria-live="polite") announce dynamic updates to screen readers.',
			],
			codeExamples: [
				{
					title: 'Accessible Button with ARIA & Keyboard Support',
					code: `<button
	type="button"
	aria-expanded={isOpen}
	aria-controls="menu-dropdown"
	onClick={toggleMenu}
	onKeyDown={(e) => {
		if (e.key === 'Escape') setIsOpen(false)
	}}
>
	Menu
</button>`,
					explanation: 'Provides screen readers and keyboard users complete visibility into menu expansion state and dismissibility.',
				},
			],
			interviewCheatSheet: {
				whyZaraAsks: 'Evaluating enterprise frontend engineering capabilities and user-centric engineering quality.',
				keyPhrasesToSay: [
					'The browser rendering pipeline moves through DOM/CSSOM construction -> Layout (Reflow) -> Paint -> Composite.',
					'GPU-accelerated properties (transform, opacity) bypass reflow and repaint for 60fps animations.',
					'Semantic HTML is the foundation of accessibility; ARIA is an enhancement, not a replacement.',
				],
				commonCandidateTraps: [
					'Using <div> with an onClick handler without adding role="button", tabIndex={0}, and onKeyDown handlers.',
				],
			},
		},
	],
	quiz: [
		{
			id: 'q3-1',
			question: 'What is the specificity calculation of the CSS selector "div.container ul > li.active a:hover"?',
			options: [
				'0, 0, 4, 3',
				'0, 0, 3, 4',
				'0, 1, 2, 3',
				'0, 0, 2, 5',
			],
			correctAnswerIndex: 1,
			conceptTag: 'CSS Specificity',
			explanation: 'Classes and Pseudo-classes: .container, .active, :hover (3). Elements: div, ul, li, a (4). No IDs (0). Therefore, the specificity tuple is 0, 0, 3, 4.',
		},
		{
			id: 'q3-2',
			question: 'Which CSS properties can be animated without triggering browser Reflow (Layout) or Repaint?',
			options: [
				'width and height',
				'margin and padding',
				'transform and opacity',
				'top and left',
			],
			correctAnswerIndex: 2,
			conceptTag: 'Browser Rendering Pipeline',
			explanation: 'Transform and opacity are processed directly on the GPU compositor thread, bypassing both Layout (Reflow) and Paint phases, allowing smooth 60fps animations.',
		},
		{
			id: 'q3-3',
			question: 'In Core Web Vitals, what does Interaction to Next Paint (INP) measure?',
			options: [
				'The time taken to download the initial HTML document.',
				'The latency of all user interactions (clicks, taps, key presses) throughout the full page lifecycle.',
				'The time taken to render the first image on the viewport.',
				'The total size of JavaScript bundles.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Core Web Vitals',
			explanation: 'INP measures overall UI responsiveness by tracking the longest interaction latency (input delay + processing time + presentation delay) across all interactions on the page.',
		},
		{
			id: 'q3-4',
			question: 'Why does setting an extremely high z-index (e.g. z-index: 999999) sometimes fail to bring an element above another element?',
			options: [
				'Browsers cap z-index at 1000.',
				'The element is trapped inside a parent Stacking Context that has a lower stacking order than the sibling element.',
				'z-index only works on <div> tags.',
				'The browser is running in dark mode.',
			],
			correctAnswerIndex: 1,
			conceptTag: 'Stacking Context',
			explanation: 'z-index values are evaluated only relative to other elements within the same Stacking Context. If the parent container forms a stacking context with lower priority, child z-index cannot escape it.',
		},
		{
			id: 'q3-5',
			question: 'When creating an accessible modal dialog, which ARIA attributes and focus behaviors are strictly required?',
			options: [
				'role="dialog", aria-modal="true", an aria-labelledby title, and trapping keyboard Tab focus inside the modal.',
				'Only role="alert" and window.alert().',
				'display: flex and aria-hidden="false".',
				'Adding 100px padding to the body.',
			],
			correctAnswerIndex: 0,
			conceptTag: 'Accessibility & ARIA',
			explanation: 'Accessible modals require role="dialog", aria-modal="true", an accessible title linked via aria-labelledby, trapping keyboard tab navigation within the modal, and returning focus to the trigger on close.',
		},
	],
	codeChallenges: [],
}
