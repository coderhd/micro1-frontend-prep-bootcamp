import { useState, useEffect, useRef } from 'react'
import { useProgressStore } from '../../../store/use-progress-store'
import { CheckCircle, Eye, Shield, X } from 'lucide-react'

export function ModalCodeLab () {
	const { markLabComplete, completedLabs } = useProgressStore()
	const [isOpen, setIsOpen] = useState(false)
	const [showSolution, setShowSolution] = useState(false)
	const [hasClosedWithEscape, setHasClosedWithEscape] = useState(false)
	const modalRef = useRef<HTMLDivElement>(null)

	const isCompleted = completedLabs['lab-a11y-modal']

	// Escape key dismissal and focus trap listener
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				setIsOpen(false)
				setHasClosedWithEscape(true)
				if (!isCompleted) {
					markLabComplete('lab-a11y-modal')
				}
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown)
			document.body.style.overflow = 'hidden'
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = 'unset'
		}
	}, [isOpen, isCompleted, markLabComplete])

	return (
		<div className="rounded-2xl border border-surface-800 bg-surface-900/70 p-5 backdrop-blur-sm">
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800 pb-3 mb-4">
				<div className="flex items-center gap-2.5">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/20 text-pink-400">
						<Shield className="h-4 w-4" />
					</div>
					<div>
						<h4 className="text-sm font-bold text-white">
							Lab: Accessible Modal with Keyboard Trap & ARIA Attributes
						</h4>
						<p className="text-xs text-slate-400">
							Implements WAI-ARIA Modal pattern, body scroll locking, and Escape key handling.
						</p>
					</div>
				</div>
				{isCompleted && (
					<span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
						<CheckCircle className="h-3.5 w-3.5" />
						<span>Verified</span>
					</span>
				)}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{/* Code Preview */}
				<div className="rounded-xl border border-surface-800 bg-surface-950 p-3 font-mono text-xs text-slate-300">
					<div className="flex justify-between items-center text-slate-500 text-[11px] mb-2 border-b border-surface-800 pb-1">
						<span>ARIA Component Pattern</span>
						<button
							onClick={() => setShowSolution(!showSolution)}
							className="flex items-center gap-1 text-pink-400 hover:text-pink-300"
						>
							<Eye className="h-3 w-3" />
							<span>{showSolution ? 'Hide' : 'View Golden Solution'}</span>
						</button>
					</div>
					<pre className="overflow-x-auto text-pink-200">
						<code>
							{showSolution
								? `<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  className="modal-container"
>
  <h2 id="modal-title">Settings Dialog</h2>
  <button aria-label="Close dialog" onClick={onClose}>×</button>
</div>`
								: `// Open the modal and press 'Escape' on your keyboard to verify accessibility flow`}
						</code>
					</pre>
				</div>

				{/* Live Interactive Trigger */}
				<div className="flex flex-col justify-between rounded-xl border border-surface-800 bg-surface-950 p-4">
					<div>
						<span className="text-xs font-bold text-pink-400 uppercase tracking-wider block mb-1">
							Live Accessibility Test
						</span>
						<p className="text-xs text-slate-400 mb-4">
							Click below to trigger the accessible modal, then press the <kbd className="rounded bg-surface-800 px-1.5 py-0.5 border border-surface-700 font-mono text-white text-[11px]">Escape</kbd> key to verify keyboard dismissal.
						</p>

						<div className="space-y-2 text-xs">
							<div className="flex items-center gap-2 text-slate-300">
								<span className={`h-2 w-2 rounded-full ${hasClosedWithEscape ? 'bg-emerald-400' : 'bg-slate-600'}`} />
								<span>Keyboard Escape dismiss event detected: {hasClosedWithEscape ? '✅ Yes' : '❌ Not yet'}</span>
							</div>
						</div>
					</div>

					<button
						onClick={() => setIsOpen(true)}
						className="w-full mt-4 rounded-xl bg-pink-600 hover:bg-pink-500 py-2.5 text-xs font-bold text-white transition shadow-md shadow-pink-500/20"
					>
						Launch Accessible Modal
					</button>
				</div>
			</div>

			{/* Modal Dialog Overlay */}
			{isOpen && (
				<div
					role="presentation"
					onClick={() => setIsOpen(false)}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fadeIn"
				>
					<div
						ref={modalRef}
						role="dialog"
						aria-modal="true"
						aria-labelledby="modal-title"
						onClick={(e) => e.stopPropagation()}
						className="w-full max-w-md rounded-2xl border border-surface-700 bg-surface-900 p-6 shadow-2xl animate-scaleUp"
					>
						<div className="flex items-center justify-between border-b border-surface-800 pb-3 mb-4">
							<h3 id="modal-title" className="text-base font-bold text-white">
								Accessible Dialog
							</h3>
							<button
								onClick={() => setIsOpen(false)}
								aria-label="Close dialog"
								className="rounded-lg p-1 text-slate-400 hover:bg-surface-800 hover:text-white"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<p className="text-xs text-slate-300 leading-relaxed mb-6">
							Notice that background scrolling is locked and focus is restricted to this dialog. Press <kbd className="rounded bg-surface-800 px-1.5 py-0.5 border border-surface-700 font-mono text-white text-[11px]">Escape</kbd> or the button below to close.
						</p>

						<div className="flex justify-end gap-2">
							<button
								onClick={() => setIsOpen(false)}
								className="rounded-xl border border-surface-700 bg-surface-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-surface-700"
							>
								Cancel
							</button>
							<button
								onClick={() => setIsOpen(false)}
								className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-500"
							>
								Confirm & Dismiss
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
