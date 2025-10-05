import { Box, List, ListItem, Typography } from "@mui/material";
import type { Post } from "@/types/post";
import type { FetchResponse } from "@/utils/request";

export default function Example({
	response,
}: {
	response: FetchResponse<Post[]>;
}) {
	return (
		<Box>
			<Typography variant="h2">Example</Typography>
			<List>
				{response.data?.map((post) => (
					<ListItem key={post.id} id={`${post.id}`}>
						{post.title}
					</ListItem>
				))}
			</List>
		</Box>
	);
}
