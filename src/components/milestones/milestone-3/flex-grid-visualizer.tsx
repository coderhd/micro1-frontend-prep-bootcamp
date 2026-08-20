import { useState } from 'react'
import { Layout, Sliders, Copy, Check } from 'lucide-react'

export function FlexGridVisualizer () {
	const [mode, setMode] = useState<'flex' | 'grid'>('flex')
	const [copied, setCopied] = useState(false)

	// Flex properties
	const [flexDirection, setFlexDirection] = useState<'row' | 'row-reverse' | 'column'>('row')
	const [justifyContent, setJustifyContent] = useState('space-between')
	const [alignItems, setAlignItems] = useState('center')
	const [flexWrap, setFlexWrap] = useState('wrap')
	const [flexGap, setFlexGap] = useState('1rem')

	// Grid properties
	const [gridCols, setGridCols] = useState('repeat(auto-fit, minmax(140px, 1fr))')
	const [gridGap, setGridGap] = useState('1rem')
	const [itemCount, setItemCount] = useState(6)

	const generatedCss = mode === 'flex'
		? `.container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${flexGap};
}`
		: `.container {
  display: grid;
  grid-template-columns: ${gridCols};
  gap: ${gridGap};
}`

	const handleCopy = () => {
		navigator.clipboard.writeText(generatedCss)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className="rounded-2xl border border-surface-800 bg-surface-900/80 p-5 backdrop-blur-sm">
			{/* Header */}
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-4 mb-4">
				<div>
					<h3 className="text-base font-bold text-white flex items-center gap-2">
						<Layout className="h-4 w-4 text-brand-400" />
						<span>Interactive Flexbox vs CSS Grid Sandbox</span>
					</h3>
					<p className="text-xs text-slate-400">
						Explore CSS layout mechanics, alignment axes, and intrinsic responsiveness.
					</p>
				</div>

				{/* Mode Switcher */}
				<div className="flex rounded-xl bg-surface-950 p-1 border border-surface-800">
					<button
						onClick={() => setMode('flex')}
						className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
							mode === 'flex'
								? 'bg-brand-600 text-white shadow'
								: 'text-slate-400 hover:text-slate-200'
						}`}
					>
						Flexbox (1D)
					</button>
					<button
						onClick={() => setMode('grid')}
						className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
							mode === 'grid'
								? 'bg-purple-600 text-white shadow'
								: 'text-slate-400 hover:text-slate-200'
						}`}
					>
						CSS Grid (2D)
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
				{/* Controls Panel */}
				<div className="lg:col-span-5 flex flex-col gap-3.5 rounded-xl border border-surface-800 bg-surface-950 p-4">
					<div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
						<Sliders className="h-3.5 w-3.5 text-brand-400" />
						<span>{mode === 'flex' ? 'Flexbox Axis & Alignment' : 'CSS Grid Properties'}</span>
					</div>

					{mode === 'flex' ? (
						<>
							<div>
								<label className="text-[11px] text-slate-400 block mb-1">flex-direction</label>
								<select
									value={flexDirection}
									onChange={(e) => setFlexDirection(e.target.value as any)}
									className="w-full rounded-lg border border-surface-700 bg-surface-900 px-2.5 py-1.5 text-xs text-white"
								>
									<option value="row">row (Main Axis: Horizontal →)</option>
									<option value="row-reverse">row-reverse (Main Axis: ←)</option>
									<option value="column">column (Main Axis: Vertical ↓)</option>
								</select>
							</div>

							<div>
								<label className="text-[11px] text-slate-400 block mb-1">justify-content (Main Axis)</label>
								<select
									value={justifyContent}
									onChange={(e) => setJustifyContent(e.target.value)}
									className="w-full rounded-lg border border-surface-700 bg-surface-900 px-2.5 py-1.5 text-xs text-white"
								>
									<option value="flex-start">flex-start</option>
									<option value="center">center</option>
									<option value="flex-end">flex-end</option>
									<option value="space-between">space-between</option>
									<option value="space-around">space-around</option>
									<option value="space-evenly">space-evenly</option>
								</select>
							</div>

							<div>
								<label className="text-[11px] text-slate-400 block mb-1">align-items (Cross Axis)</label>
								<select
									value={alignItems}
									onChange={(e) => setAlignItems(e.target.value)}
									className="w-full rounded-lg border border-surface-700 bg-surface-900 px-2.5 py-1.5 text-xs text-white"
								>
									<option value="stretch">stretch</option>
									<option value="center">center</option>
									<option value="flex-start">flex-start</option>
									<option value="flex-end">flex-end</option>
								</select>
							</div>

							<div>
								<label className="text-[11px] text-slate-400 block mb-1">flex-wrap</label>
								<select
									value={flexWrap}
									onChange={(e) => setFlexWrap(e.target.value)}
									className="w-full rounded-lg border border-surface-700 bg-surface-900 px-2.5 py-1.5 text-xs text-white"
								>
									<option value="wrap">wrap</option>
									<option value="nowrap">nowrap</option>
								</select>
							</div>

							<div>
								<label className="text-[11px] text-slate-400 block mb-1">gap</label>
								<select
									value={flexGap}
									onChange={(e) => setFlexGap(e.target.value)}
									className="w-full rounded-lg border border-surface-700 bg-surface-900 px-2.5 py-1.5 text-xs text-white"
								>
									<option value="0.5rem">0.5rem (8px)</option>
									<option value="1rem">1rem (16px)</option>
									<option value="1.5rem">1.5rem (24px)</option>
								</select>
							</div>
						</>
					) : (
						<>
							<div>
								<label className="text-[11px] text-slate-400 block mb-1">grid-template-columns</label>
								<select
									value={gridCols}
									onChange={(e) => setGridCols(e.target.value)}
									className="w-full rounded-lg border border-surface-700 bg-surface-900 px-2.5 py-1.5 text-xs text-white"
								>
									<option value="repeat(auto-fit, minmax(140px, 1fr))">
										repeat(auto-fit, minmax(140px, 1fr)) [Responsive]
									</option>
									<option value="repeat(3, 1fr)">repeat(3, 1fr) [3 Equal Cols]</option>
									<option value="1fr 2fr 1fr">1fr 2fr 1fr [Featured Center]</option>
									<option value="200px 1fr">200px 1fr [Sidebar + Content]</option>
								</select>
							</div>

							<div>
								<label className="text-[11px] text-slate-400 block mb-1">gap</label>
								<select
									value={gridGap}
									onChange={(e) => setGridGap(e.target.value)}
									className="w-full rounded-lg border border-surface-700 bg-surface-900 px-2.5 py-1.5 text-xs text-white"
								>
									<option value="0.5rem">0.5rem (8px)</option>
									<option value="1rem">1rem (16px)</option>
									<option value="1.5rem">1.5rem (24px)</option>
								</select>
							</div>
						</>
					)}

					<div className="flex items-center justify-between pt-2 border-t border-surface-800">
						<label className="text-[11px] text-slate-400">Total Items ({itemCount})</label>
						<div className="flex gap-1.5">
							<button
								onClick={() => setItemCount(c => Math.max(3, c - 1))}
								className="px-2 py-0.5 rounded bg-surface-800 text-xs text-slate-300 hover:bg-surface-700"
							>
								-
							</button>
							<button
								onClick={() => setItemCount(c => Math.min(12, c + 1))}
								className="px-2 py-0.5 rounded bg-surface-800 text-xs text-slate-300 hover:bg-surface-700"
							>
								+
							</button>
						</div>
					</div>

					{/* Generated CSS Box */}
					<div className="mt-2 rounded-lg bg-surface-900 border border-surface-800 p-2.5">
						<div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
							<span>Generated CSS</span>
							<button
								onClick={handleCopy}
								className="flex items-center gap-1 text-brand-400 hover:text-brand-300"
							>
								{copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
								<span>{copied ? 'Copied' : 'Copy'}</span>
							</button>
						</div>
						<pre className="font-mono text-[11px] text-brand-300 overflow-x-auto">
							<code>{generatedCss}</code>
						</pre>
					</div>
				</div>

				{/* Interactive Live Layout Canvas */}
				<div className="lg:col-span-7 flex flex-col">
					<div className="rounded-xl border border-surface-800 bg-surface-950 p-4 min-h-[300px] flex-1 flex flex-col">
						<div className="text-[10px] uppercase font-bold text-slate-500 mb-3 flex items-center justify-between border-b border-surface-800 pb-2">
							<span>Rendered Viewport Preview</span>
							<span className="text-[9px] text-brand-400">Container ({mode.toUpperCase()})</span>
						</div>

						<div
							className="flex-1 w-full rounded-lg border border-dashed border-surface-800 p-3 min-h-[220px]"
							style={
								mode === 'flex'
									? {
										display: 'flex',
										flexDirection,
										justifyContent,
										alignItems,
										flexWrap: flexWrap as any,
										gap: flexGap,
									}
									: {
										display: 'grid',
										gridTemplateColumns: gridCols,
										gap: gridGap,
									}
							}
						>
							{Array.from({ length: itemCount }).map((_, idx) => (
								<div
									key={idx}
									className={`flex items-center justify-center rounded-xl p-3 text-xs font-bold transition-all shadow-md ${
										mode === 'flex'
											? 'bg-gradient-to-br from-brand-600/30 to-indigo-600/30 border border-brand-500/40 text-brand-200'
											: 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/40 text-purple-200'
									}`}
									style={{ minHeight: '60px' }}
								>
									<span>Item {idx + 1}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
