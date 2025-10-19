# Gemini Project Contribution Guidelines

## 1. プロジェクト概要

シンプルなTodo管理アプリケーション。ユーザーはタスクの追加、完了、削除ができる。

## 2. 技術スタック

- 主要な技術スタック
  - **言語:** TypeScript
  - **フレームワーク:** Next.js 15 (App Router)
  - **状態管理:** useContext + useReducer
  - **スタイリング:** MUI v7
  - **テスト:** Vitest
  - **E2Eテスト:** Playwright
- その他
  - `package.json` を確認すること

## 3. コーディング規約

- `biome lint` に準拠する

```json
// `biome.json`
{
  "$schema": "https://biomejs.dev/schemas/2.2.5/schema.json",
  "vcs": {
    "enabled": false,
    "clientKind": "git",
    "useIgnoreFile": false
  },
  "files": {
    "ignoreUnknown": true,
    "includes": [
      "**",
      "!node_modules",
      "!.next",
      "!dist",
      "!build",
      "!coverage"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab"
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    },
    "domains": {
      "next": "recommended",
      "react": "recommended"
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double"
    }
  },
  "assist": {
    "enabled": true,
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  }
}
```

## 4. ディレクトリ構造

```txt
.
├── docs # ドキュメント
├── playwright-report # E2E テストレポート
├── public
├── src # ソースコード
│   ├── __test__
│   ├── app # Next.js App Router
│   ├── types # 共通型定義
│   ├── repositories # DB やストレージ、 SaaS などに接続しデータの取得や永続化を行う
│   └── utils # 共通関数
└── tests  # E2E テスト
```

## 5. 禁止事項

- インラインスタイルの使用 (`style={{ color: 'red' }}`)
- MUI を使わないスタイリング
- `useEffect` 内での直接的なDOM操作

## 6. 実装方法 (Component)

- Container Presentational Component パターンで実装すること
  - データの取得や状態管理は Container Component で行い、UI は Presentational Component に分離
- Container Component は `page.tsx` で定義すること
- Presentational Component の命名規則は `PascalCase` とし、ファイル名とコンポーネント名を一致させること
- データ取得などのロジックは、 `service.ts` に分離すること
- 可読性を優先して Component の分割を行うこと
  - 1 ファイルに定義するコンポーネントは基本的に 1 つまでとする
- 参考実装
  - `src/app/examples/*`

## 7. ユニットテスト

- Vitest を使用すること
- `src/__test__` フォルダにテストコードを配置すること
- Container Component をのぞく、全ての Component に対してユニットテストを実装すること
  - テストカバレッジは 100% を目指すこと
- 外部接続を行うロジックは `vi.mock` を使用してモック化すること
- 参照実装
  - `src/__test__/app/examples/*`

## 8. E2E テスト

- Playwright を使用すること
- `tests` フォルダに E2E テストコードを配置すること

## 9. 要件定義資料のディレクトリ構成

@./docs/about_rdra.md に準拠して要件定義を行う

rdra に関する定義は以下のように配置する。

```txt
.
└── rdra/
   ├── BUC_01_business_usecase.puml
   ├── AFL_01_activity_flow.puml
   ├── SUC_system_usecase.puml
   ├── ENT_information_model.puml
   └── traceability_buc_01.puml  # トレーサビリティ・ダイアグラム
```

## 10. 実装手順

1. TDD 開発に基づいてユニットテストを先に実装すると
   - テストの実行は `pnpm preflight` で実行する
2. ユニットテストが成功するまでリファクタリングを繰り返す
3. `pnpm preflight` が成功するまで繰り返す
