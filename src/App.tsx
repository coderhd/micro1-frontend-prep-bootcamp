import { ProgressProvider, useProgressStore } from './store/use-progress-store'
import { AppShell } from './components/layout/app-shell'
import { Milestone1Page } from './components/milestones/milestone-1'
import { MilestoneTsPage } from './components/milestones/milestone-ts'
import { Milestone2Page } from './components/milestones/milestone-2'
import { Milestone3Page } from './components/milestones/milestone-3'
import { Milestone4Page } from './components/milestones/milestone-4'
import { Milestone5Page } from './components/milestones/milestone-5'
import { AiMilestonePage } from './components/ai-engineer/ai-milestone-page'
import { AiInterviewPage } from './components/ai-engineer/ai-interview-page'

function MilestoneRouter () {
	const { activeTrack, activeMilestoneId } = useProgressStore()

	if (activeTrack === 'ai-engineer') {
		switch (activeMilestoneId) {
			case 'ai-m1':
			case 'ai-m2':
			case 'ai-m3':
			case 'ai-m4':
				return <AiMilestonePage milestoneId={activeMilestoneId} />
			case 'ai-m5':
				return <AiInterviewPage />
			default:
				return <AiMilestonePage milestoneId="ai-m1" />
		}
	}

	switch (activeMilestoneId) {
		case 'm1':
			return <Milestone1Page />
		case 'm-ts':
			return <MilestoneTsPage />
		case 'm2':
			return <Milestone2Page />
		case 'm3':
			return <Milestone3Page />
		case 'm4':
			return <Milestone4Page />
		case 'm5':
			return <Milestone5Page />
		default:
			return <Milestone1Page />
	}
}

export default function App () {
	return (
		<ProgressProvider>
			<AppShell>
				<MilestoneRouter />
			</AppShell>
		</ProgressProvider>
	)
}
