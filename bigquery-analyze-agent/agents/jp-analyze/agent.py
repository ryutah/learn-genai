from google.adk.agents import Agent
from google.cloud import bigquery
import json

PROJECT_ID = "sandbox-harar"
DATASET_ID = "jp_statistics"


def get_all_table_schemas_in_dataset() -> dict:
    """BigQueryデータセット内のすべてのテーブルのスキーマを取得する"""
    client = bigquery.Client(project=PROJECT_ID)
    dataset_ref = client.dataset(DATASET_ID)
    tables = client.list_tables(dataset_ref)
    if not tables:
        return {}

    all_schemas = {}
    for table in tables:
        table_ref = dataset_ref.table(table.table_id)
        table_full_info = client.get_table(table_ref)
        all_schemas[f"{table_full_info.dataset_id}.{table_full_info.table_id}"] = [
            field.to_api_repr() for field in table_full_info.schema
        ]
    return all_schemas


def run_query(quety: str) -> list:
    """BigQueryでクエリを実行し、結果を返す"""
    client = bigquery.Client(project=PROJECT_ID, location="asia-northeast1")
    query_job = client.query(quety)
    results = query_job.result()
    tmp = [dict(row) for row in results]
    dump = json.dumps(tmp, default=str)
    return json.loads(dump)


root_agent = Agent(
    name="bgqury_analyze",
    model="gemini-2.5-pro",
    description="BigQuery のデータを分析するエージェント",
    instruction="""
    あなたはデータアナリストです。以下の制約条件と入力文をもとに、BigQueryのデータセットを分析し、質問に答えてください。
    """,
    tools=[get_all_table_schemas_in_dataset, run_query],
)
