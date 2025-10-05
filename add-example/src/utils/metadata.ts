import type { Metadata } from "next";

export default function generateMetadata(title?: string): Metadata {
	return {
		title: title ? `ADD - ${title}` : "ADD",
	};
}
