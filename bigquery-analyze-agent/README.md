# BigQuery Analyze Agent

## 概要

このプロジェクトは、 Google ADK ( Agent Development Kit ) を利用して、 BigQuery 上のデータを分析するAIエージェントです。
自然言語による問い合わせに対して、 BigQuery のテーブルを検索・分析し、結果を返します。

## 主な機能

- **自然言語でのデータ問い合わせ**: 「昨年の売上が最も高かった商品は？」といった自然言語での質問に回答します。
- **データ分析**: 指定された条件に基づき、データの集計や分析を実行します。
- **レポート生成**: 分析結果を元に、簡単なレポートを生成します。

## アーキテクチャ

### システム構成図

![image](./images/architecture.png)

<details>
<summary>PlantUML Code</summary>

```plantuml
@startuml C4_BigQuery_Agent_Architecture
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

title Container diagram for BigQuery Analyze Agent

Person(user, "User/Data Analyst", "BigQueryのデータを分析したい人")

System_Ext(gemini, "Google Gemini Pro", "LLM for reasoning and response generation")
System_Ext(bigquery, "Google BigQuery", "Data warehouse containing the target dataset")

System_Boundary(agent_system, "BigQuery Analyze Agent") {
    Container(agent_core, "Agent Core", "Python (Google ADK)", "自然言語を解釈し、ツール呼び出しや応答生成を判断するオーケストレーター")
    Container(bq_tools, "BigQuery Tools", "Python", "BigQueryとの実際のやり取り（スキーマ取得、クエリ実行）を行う関数群")
}

Rel(user, agent_core, "Analyzes data via natural language queries", "HTTPS")
Rel(agent_core, gemini, "Uses for reasoning and generation", "HTTPS/API Call")
Rel(agent_core, bq_tools, "Uses", "Function Call")
Rel(bq_tools, bigquery, "Connects to", "gRPC/API Call")

@enduml
```

</details>

### 処理の流れ

1. **User** が自然言語で **Agent Core** に質問します。
1. **Agent Core** は **Gemini Pro** の能力を使って質問を解釈し、どの **BigQuery Tool** を使うべきか判断します。
1. **Agent Core** が適切な **BigQuery Tool**（例: `get_all_table_schemas_in_dataset`）を呼び出します。
1. **BigQuery Tool** は **Google BigQuery** にスキーマ取得やクエリ実行のリクエストを送信します。
1. **BigQuery** は結果を **BigQuery Tool** に返します。
1. **Agent Core** はツールから受け取った結果を元に、再度 **Gemini Pro** を使って最終的な回答を生成します。
1. 生成された回答が **User** に返されます。

## セットアップ方法

### 前提条件

- Python 3.13 以上
- `uv` ( Python パッケージインストーラー)
- Google Cloud SDK

### 環境構築

1.  **リポジトリのクローン:**

    ```bash
    git clone <repository-url>
    cd bigquery-analyze-agent
    ```

1.  **依存関係のインストール:**

    ```bash
    uv sync
    ```

1.  **Google Cloud 認証:**

    ```bash
    gcloud auth application-default login
    ```

1.  **Terraformによるインフラ構築:**

    ```bash
    cd resources/infra
    terraform init
    terraform apply -var="project_id=<gcp-project-id>"
    ```

    > [!NOTE]
    > `<gcp-project-id>` は、ご自身の GCP プロジェクト ID に置き換えてください。

1.  **サンプルデータのロード:**

    BigQuery にサンプルデータをロードします。

    > [!WARNING]
    > 事前に、ファイルをアップロードするための一時的な GCS バケットを作成してください。

    ```bash
    cd ../sample-datas
    ./load.sh <gcp-project-id> <gcs-bucket-name>
    ```

    > [!NOTE]
    > `<gcp-project-id>` と `<gcs-bucket-name>` は、ご自身の GCP プロジェクト ID と作成した GCS バケット名に置き換えてください。

## 使い方

エージェントを実行するには、以下のコマンドを実行します。

```bash
uv run adk web
```

## コンテナを使った実行 (Docker / Cloud Run)

コンテナを利用してエージェントを実行することも可能です。

### ローカルでの実行 (Docker)

> [!NOTE]
> Docker がインストールされている必要があります。

1.  **Docker イメージのビルド:**

    ```bash
    docker build -t bigquery-analyze-agent .
    ```

2.  **Docker コンテナの実行:**

    ローカルの GCP 認証情報をコンテナにマウントすることで、コンテナ内から BigQuery へのアクセスを可能にします。

    ```bash
    docker run -p 8080:8080 \
      -v ~/.config/gcloud:/home/appuser/.config/gcloud \
      bigquery-analyze-agent
    ```

    > [!NOTE]
    > GCP の認証情報が `~/.config/gcloud` 以外の場所にある場合は、マウントするパスを適宜修正してください。

### Cloud Run へのデプロイ

1.  **Cloud Build を使ってイメージをビルド & Artifact Registry に登録:**

    ```bash
    gcloud builds submit --tag asia-northeast1-docker.pkg.dev/<gcp-project-id>/bigquery-analyze-agent/agent
    ```

2.  **Cloud Run にデプロイ:**

    ```bash
    gcloud run deploy bigquery-analyze-agent \
      --image asia-northeast1-docker.pkg.dev/<gcp-project-id>/bigquery-analyze-agent/agent \
      --region asia-northeast1 \
      --allow-unauthenticated
    ```

    > [!NOTE]
    > `<gcp-project-id>` は、ご自身の GCP プロジェクト ID に置き換えてください。
    > デプロイ先のリージョンは適宜変更してください。

## ディレクトリ構成

```txt
.
├── agents/              # エージェントのロジック
│   └── jp-analyze/
│       └── agent.py
├── docs/                # ドキュメント
│   └── senario.md
├── images/              # 画像ファイル
│   └── architecture.png
├── resources/           # Terraform定義やサンプルデータ
│   ├── infra/
│   └── sample-datas/
├── .gitignore
├── architecture.puml    # PlantUMLで記述されたアーキテクチャ定義
├── GEMINI.md            # このプロジェクトに関するGEMINI向けドキュメント
├── pyproject.toml       # プロジェクト定義と依存関係
└── README.md            # プロジェクトの簡単な説明
```
