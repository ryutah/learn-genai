import type { Metadata } from "next";
import generateMetadata from "@/utils/metadata";
import Example from "./Example";
import { getSampleData } from "./service";

export const metadata: Metadata = generateMetadata("Example");

export default async function Page() {
	const posts = await getSampleData();

	return <Example response={posts} />;
}
