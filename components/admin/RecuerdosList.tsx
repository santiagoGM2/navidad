import { listDailyMemories } from '@/lib/admin-db'
import RecuerdosGrid from './RecuerdosGrid'

export default async function RecuerdosList() {
	const memories = await listDailyMemories({ limit: 100 })
	return (
		<div className="backdrop-blur-md bg-white/5 border border-white/15 rounded-2xl p-4 md:p-6">
			<RecuerdosGrid initialMemories={memories} />
		</div>
	)
}
