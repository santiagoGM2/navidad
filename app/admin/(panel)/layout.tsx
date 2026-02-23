import { redirect } from 'next/navigation'
import { getSessionFromCookie } from '@/lib/auth-server'
import AdminNav from '@/components/admin/AdminNav'

export const dynamic = 'force-dynamic'

export default function PanelLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = getSessionFromCookie()
	if (!session) {
		redirect('/admin/login')
	}

	return (
		<>
			<AdminNav username={session.username} />
			<main className="relative z-10 pt-6 pb-16 px-4 md:px-6 max-w-5xl mx-auto">
				{children}
			</main>
		</>
	)
}
