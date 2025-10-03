terraform {
  required_version = "~> 1.12.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.1.1"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# BigQuery データセットの作成
resource "google_bigquery_dataset" "jp_statistics" {
  dataset_id    = "jp_statistics"
  location      = var.region
  friendly_name = "Japan Statistics Data"
  description   = "Dataset for storing various statistics about Japan."
}

# ==============================================================================
# テーブル1: 活動・時間調査データ (activity_survey_jp)
# ==============================================================================
resource "google_bigquery_table" "activity_survey_jp" {
  dataset_id  = google_bigquery_dataset.jp_statistics.dataset_id
  table_id    = "activity_survey_jp"
  description = "日本の社会生活基本調査に基づく活動・時間データ"

  # 外部のJSONファイルからスキーマを読み込む
  schema = file("${path.module}/schemas/activity_survey.json")
}


# ==============================================================================
# テーブル2: 都道府県別統計データ (prefectural_stats_jp)
# ==============================================================================
resource "google_bigquery_table" "prefectural_stats_jp" {
  dataset_id  = google_bigquery_dataset.jp_statistics.dataset_id
  table_id    = "prefectural_stats_jp"
  description = "日本の都道府県別の基本統計データ"

  # 外部のJSONファイルからスキーマを読み込む
  schema = file("${path.module}/schemas/prefectural_stats_jp.json")
}
