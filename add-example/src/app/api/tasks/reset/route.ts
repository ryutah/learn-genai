import { NextResponse } from "next/server";
import { _resetTasks } from "@/repositories/task";

export const dynamic = "force-dynamic"; // キャッシュを無効化

export async function POST() {
	try {
		_resetTasks();
		return NextResponse.json({ message: "Tasks reset successfully" });
	} catch (error) {
		return NextResponse.json(
			{ message: "Failed to reset tasks", error },
			{ status: 500 },
		);
	}
}
