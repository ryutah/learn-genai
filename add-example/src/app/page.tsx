import { Link as MuiLink, Typography } from "@mui/material";
import NextLink from "next/link";

export default function Home() {
	return (
		<main>
			<Typography variant="h1">Welcome</Typography>
			<MuiLink component={NextLink} href="/examples">
				Go to Example Page
			</MuiLink>
			<br />
			<MuiLink component={NextLink} href="/tasks">
				Go to Tasks Page
			</MuiLink>
		</main>
	);
}
