import { Container, CssBaseline } from "@mui/material";
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
					<Container>{children}</Container>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
