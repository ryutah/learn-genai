# ==============================================================================
# Stage 1: Builder Stage
# - 依存関係のインストールなど、ビルドに必要な処理を行う
# ==============================================================================
FROM python:3.13-slim AS builder

# uv をインストール
RUN pip install uv

# アプリケーション用の非rootユーザーを作成
RUN useradd --system --create-home appuser
WORKDIR /home/appuser/app

# プロジェクト定義ファイルをコピーし、オーナーを変更
COPY --chown=appuser:appuser pyproject.toml uv.lock ./

# 仮想環境を作成し、依存関係をインストール
# chown でカレントディレクトリのオーナーを appuser に変更してから実行
RUN chown appuser:appuser .
USER appuser
RUN uv venv
RUN . .venv/bin/activate && uv sync

# アプリケーションコードをコピー
COPY --chown=appuser:appuser agents/ ./agents/

# ==============================================================================
# Stage 2: Final Stage
# - 実行に必要な最小限のファイルのみを builder からコピーする
# ==============================================================================
FROM python:3.13-slim

# アプリケーション用の非rootユーザーを作成
RUN useradd --system --create-home appuser
USER appuser
WORKDIR /home/appuser/app

# Builder Stage から仮想環境とアプリケーションコードをコピー
COPY --from=builder --chown=appuser:appuser /home/appuser/app/.venv ./.venv
COPY --from=builder --chown=appuser:appuser /home/appuser/app/agents ./agents

# 環境変数を設定
ENV PYTHONUNBUFFERED=1
ENV PATH="/home/appuser/app/.venv/bin:$PATH"
# PORT は Cloud Run によって自動的に設定されるが、デフォルト値を設定
ENV PORT=8080

# ポートを公開
EXPOSE 8080

WORKDIR /home/appuser/app/agents

# アプリケーションを起動
# sh -c を使って環境変数 $PORT を展開する
CMD ["sh", "-c", "adk web --host 0.0.0.0 --port ${PORT}"]
