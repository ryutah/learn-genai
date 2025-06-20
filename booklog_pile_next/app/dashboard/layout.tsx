import Link from "next/link";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="sticky top-0 z-10 border-b border-solid border-black/[.08] bg-background/80 backdrop-blur-sm dark:border-white/[.145]">
				<div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
					<div className="flex items-center gap-6">
						<Link
							href="/dashboard"
							className="text-lg font-bold tracking-tight"
						>
							Booklog Pile
						</Link>
						<nav className="hidden items-center gap-4 text-sm md:flex">
							<Link
								href="/dashboard/log"
								className="text-foreground/80 hover:text-foreground"
							>
								読書ログ
							</Link>
							<Link
								href="/dashboard/settings"
								className="text-foreground/80 hover:text-foreground"
							>
								設定
							</Link>
						</nav>
					</div>
					<div>
						<Link
							href="/"
							className="flex h-9 items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
						>
							ログアウト
						</Link>
					</div>
				</div>
			</header>
			<main className="flex-1">{children}</main>
		</div>
	);
}
