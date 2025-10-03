# bigquery-analyze-agent

## 概要

このプロジェクトは、Google ADK (Agent Development Kit) を利用して、BigQuery上のデータを分析するAIエージェントです。
自然言語による問い合わせに対して、BigQueryのテーブルを検索・分析し、結果を返します。

## 主な機能

（ここに、このエージェントが持つ具体的な機能を記述します。例：）

- **自然言語でのデータ問い合わせ**: 「昨年の売上が最も高かった商品は？」といった自然言語での質問に回答します。
- **データ分析**: 指定された条件に基づき、データの集計や分析を実行します。
- **レポート生成**: 分析結果を元に、簡単なレポートを生成します。

## セットアップ方法

### 前提条件

- Python 3.13 以上
- `uv` (Pythonパッケージインストーラー)
- Google Cloud SDK

### 環境構築

1. **リポジトリのクローン:**

   ```bash
   git clone <repository-url>
   cd bigquery-analyze-agent
   ```

2. **仮想環境の作成と有効化:**

   ```bash
   uv venv
   source .venv/bin/activate
   ```

3. **依存関係のインストール:**

   ```bash
   uv sync
   ```

4. **Google Cloud 認証:**

   ```bash
   gcloud auth application-default login
   ```

## 使い方

エージェントを実行するには、以下のコマンドを実行します。

```bash
uv run adk web
```

## ディレクトリ構成

```txt
.
├── agents/              # エージェントのロジック
│   └── jp-analyze/
│       └── agent.py
├── main.py              # アプリケーションのエントリーポイント
├── pyproject.toml       # プロジェクト定義と依存関係
├── README.md            # プロジェクトの簡単な説明
└── resources/           # Terraform定義やサンプルデータ
    ├── infra/
    └── sample-datas/
```
