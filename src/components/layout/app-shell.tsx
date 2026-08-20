import { Header } from './header'
import { MilestoneNav } from './milestone-nav'

interface AppShellProps {
	children: React.ReactNode
}

export function AppShell ({ children }: AppShellProps) {
	return (
		<div className="flex min-h-screen flex-col bg-surface-950 text-slate-100 antialiased">
			<Header />
			<main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
				<MilestoneNav />
				<section className="flex-1 min-w-0">
					{children}
				</section>
			</main>
		</div>
	)
}
