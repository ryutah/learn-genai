import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "ADD Sample App",
	description: "This is ADD Sample App",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body>
				<AppRouterCacheProvider>
					<CssBaseline />
					{children}
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
