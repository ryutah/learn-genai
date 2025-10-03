#!/usr/bin/env bash

set -eux

BUCKET_NAME="sandbox-harar-tmp"
PROJECT_ID="sandbox-harar"
BIGQUERY_DATASET_ID="jp_statistics"

# activity_survey.csv をアップロード
gcloud storage cp ./activity_survey.csv gs://${BUCKET_NAME}/
# prefectural_stats_jp.csv をアップロード
gcloud storage cp ./prefectural_stats_jp.csv gs://${BUCKET_NAME}/

bq load \
  --project_id=${PROJECT_ID} \
  --source_format=CSV \
  --skip_leading_rows=1 \
  --autodetect \
  ${BIGQUERY_DATASET_ID}.activity_survey_jp \
  gs://${BUCKET_NAME}/activity_survey.csv

# 2. prefectural_stats_jp テーブルへのインポート
bq load \
  --project_id=${PROJECT_ID} \
  --source_format=CSV \
  --skip_leading_rows=1 \
  --autodetect \
  ${BIGQUERY_DATASET_ID}.prefectural_stats_jp \
  gs://${BUCKET_NAME}/prefectural_stats_jp.csv
