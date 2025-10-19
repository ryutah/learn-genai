import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

// jest-domのマッチャーをvitestのexpectに拡張
expect.extend(matchers);

// 各テストケースの後にDOMのクリーンアップを実行
afterEach(() => {
	cleanup();
});
