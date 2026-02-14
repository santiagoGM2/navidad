export default function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div
			className="min-h-screen"
			style={{
				background: 'linear-gradient(180deg, #0f0a15 0%, #1a0f2e 30%, #1e1b4b 100%)',
			}}
		>
			{children}
		</div>
	)
}
