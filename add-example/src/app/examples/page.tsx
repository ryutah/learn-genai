import Example from "./Example";
import { getSampleData } from "./service";

export default async function Page() {
	const posts = await getSampleData();

	return <Example response={posts} />;
}
