# Spec ファイルの作成ガイドライン

- 実装を行う際は、必ず spec ファイルを作成し、要件を明確にすること。
- spec ファイルは以下を作成する

## ディレクトリ構成

```txt
.
└── specs/
    ├── models/
    │   └── information_model.yml      # 情報モデル
    ├── features/
    │   └── suc_02_order.feature       # ユースケース
    ├── screens/
    │   └── scr_03_cart.md             # 画面
    └── api/
        └── openapi.yml                 # API 仕様
```

## データ（情報モデル）

ダイアグラムに登場する全ての ENT_xx を抽出し、information_model.yml に変換します。これはシステム全体のデータ定義の基礎となります。

- 元になるRDRAモデル: 情報モデル (information_model.puml)

- 変換ルール:
  - object を Entities の各要素に変換します。
  - ID、名前、および（この段階で定義されていれば）属性を記述します。
  - 成果物: `specs/models/information_model.yml`

    ```yaml
    # Source: ENT_information_model.puml

    Entities:
      - id: ENT_01
        name: 会員
        description: サイトに登録した顧客情報
        attributes:
          - name: user_id
            type: string
            is_primary_key: true
          - name: name
            type: string
          - name: email
            type: string

      - id: ENT_02
        name: 書籍
        description: 販売対象の書籍情報
        attributes:
          - name: book_id
            type: string
            is_primary_key: true
          - name: title
            type: string
          - name: price
            type: integer

      - id: ENT_03
        name: 注文
        description: 顧客からの注文情報
        attributes:
          - name: order_id
            type: string
            is_primary_key: true
          - name: user_id # 外部キー (FK to ENT_01)
            type: string
          - name: order_date
            type: datetime
          - name: status # 状態 (STA_01 を参照)
            type: string
    ```

## 振る舞い（ユースケース）

ダイアグラムの SUC_xx を単位として、Gherkin形式の .feature ファイルを作成します。

- 元になるRDRA モデル: システムユースケースモデル, 業務フロー図, 状態モデル
- 変換ルール:
  - SUC の名前を Feature 名にします。
  - 関連する AFL (業務フロー) の流れを参考に Scenario を記述します。
  - Given (前提条件), When (操作), Then (期待結果) でシナリオを構成します。
  - ENT の参照・更新や STA の状態遷移を Then で明確に記述します。
- 成果物: `specs/features/suc_02_order.feature`

  ```feature
  # specs/features/suc_02_order.feature
  #
  # BUC: BUC_01 オンラインで注文
  # SUC: SUC_02 注文する
  #
  # 関連モデル:
  # - AFL_01 (業務フロー) の ACT_02
  # - ENT_01 (会員), ENT_03 (注文)
  # - STA_01 (注文状態)

  Feature: SUC_02 注文機能
    顧客が商品をカートに入れ、注文を確定させるための機能

    Scenario: 顧客が商品を注文する
      Given "会員 (ENT_01)" がログインしている
      And "書籍 (ENT_02)" がカートに入っている
      When 顧客が "注文を確定する" ボタンを押す
      Then "注文 (ENT_03)" が作成されること
      And 作成された注文のステータスは "STA_01" に従い "注文受付" となること
  ```

## 画面

ダイアグラムに登場する SCR_xx を単位として、Markdown形式の .md ファイルを作成します。

- 元になるRDRAモデル: 画面モデル, 業務フロー図
- 変換ルール:
  - ファイル名は SCR ID に合わせます。
  - その画面がどの SUC を実行するために存在するのかを明記します。
  - 表示すべき情報 (ENT) と、実行可能なアクション（どの SUC をトリガーするか）を記述します。

- 成果物: `specs/screens/scr_03_cart.md`

  ```markdown
  # 画面: カート(SCR_03)

  ## 目的

  - 顧客がカートに入れた商品を確認し、注文プロセス (ACT_02) に進むためのインターフェース。

  ## 関連ユースケース

  - SUC_02: 注文する

  ## 表示情報

  - カートに入っている "書籍 (ENT_02)" の一覧
    - 書籍名
    - 価格
    - 数量
  - 合計金額

  ## アクション

  - [ボタン] **注文手続きへ進む**
    - **トリガー**: `SUC_02` の開始
    - **遷移先**: 注文情報入力画面 (例: SCR_04)
  ```

## API

外部システム連携やフロントエンド・バックエンド分離開発を行う場合、SUC をベースにOpenAPI仕様を作成します。

- 元になるRDRAモデル: システムユースケースモデル, 情報モデル
- 変換ルール:
  - 各 SUC をAPIの path と method に対応させます (例: POST /orders)。
  - APIのリクエストボディやレスポンスのスキーマを、関連する ENT を元に定義します。
- 成果物: `specs/api/openapi.yml`

  ```yaml
  openapi: 3.0.0
  info:
    title: オンライン書店 API
    version: 1.0.0

  paths:
    /orders: # SUC_02: 注文する
      post:
        summary: 新しい注文を作成する
        requestBody:
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/OrderRequest"
        responses:
          "201":
            description: 注文成功
            content:
              application/json:
                schema:
                  $ref: "#/components/schemas/Order" # ENT_03 に基づく

  components:
    schemas:
      Order: # ENT_03
        type: object
        properties:
          order_id:
            type: string
          # ... 他のプロパティ
  ```
