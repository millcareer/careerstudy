# キャリアスタディアプリ

LINE LIFF（LINE Front-end Framework）を利用した学生向けキャリア情報登録アプリケーションです。

## 機能概要

- LINE LIFFアプリとして動作
- ユーザー情報を登録フォームから収集
- 登録情報をFirebase Authentication、Firestore、Google Sheetsに保存

## 技術スタック

- フロントエンド: HTML, CSS, JavaScript
- バックエンド: Node.js, Express
- データベース: Firebase Firestore
- 認証: Firebase Authentication
- 外部連携: Google Sheets API

## セットアップ手順

### 前提条件

- Node.js (v14以上)
- Firebase プロジェクト
- Google Cloud Platformプロジェクト (Google Sheets APIが有効化されていること)
- LINE Developersアカウント（LIFFアプリ作成）

### インストール

1. リポジトリをクローン:
```
git clone https://github.com/millcareer/careerstudy.git
cd careerstudy
```

2. 必要なパッケージをインストール:
```
npm install
```

3. 環境変数の設定:
`.env.example`ファイルを`.env`としてコピーし、必要な情報を設定します。

```
cp .env.example .env
```

以下の情報を`.env`ファイルに設定してください:
- Firebase Serviceアカウント情報
- Firebase DatabaseURL
- Google SpreadsheetのID
- Google API認証情報

### 起動方法

開発モード:
```
npm run dev
```

本番モード:
```
npm start
```

## LINE LIFF設定

1. LINE Developersコンソールでプロバイダーとチャネルを作成
2. LIFFアプリを追加し、エンドポイントURLを設定
3. `liff.js`内の`liffId`を作成したLIFF IDに更新

## Firebase/Firestore設定

1. Firebaseコンソールでプロジェクトを作成
2. Authenticationを有効化し、メール/パスワード認証を有効に
3. Firestoreデータベースを作成
4. サービスアカウントの認証情報をダウンロードし、`.env`ファイルに設定

## Google Sheets設定

1. Google Sheets APIを有効化
2. サービスアカウントを作成し、認証情報をダウンロード
3. スプレッドシートを作成し、「一時キュー」というシートを追加
4. サービスアカウントにスプレッドシートへのアクセス権を付与

## デプロイメント

### ローカル開発環境

1. Expressサーバーを起動する
```
npm start
```
2. ngrokなどのトンネリングツールを使用して一時的な公開URLを作成
```
ngrok http 3000
```
3. 生成されたURLをLINE LIFFのエンドポイントURLとして設定

### 本番環境

1. GCPのApp Engine、Firebase Hosting、Herokuなどの適切なクラウドプラットフォームにデプロイ
2. 環境変数を本番環境に設定
3. LINE LIFFのエンドポイントURLを本番URLに更新

## アプリケーション構造

```
careerstudy/
├── .env.example        # 環境変数テンプレート
├── .gitignore          # Gitが無視するファイル設定
├── index.css           # フロントエンドのスタイル
├── index.html          # フロントエンドのHTML
├── index.js            # フロントエンドのスクリプト
├── liff.js             # LINE LIFF関連のスクリプト
├── package.json        # プロジェクト設定と依存関係
├── README.md           # プロジェクトの説明
├── server.js           # バックエンドサーバースクリプト
└── TODO.md             # 開発タスクリスト
```

## 動作フロー

1. ユーザーがLINE上でLIFFアプリを開く
2. ユーザー情報の入力フォームが表示される
3. フォーム送信時に、入力データがLINEプロフィール情報と合わせてサーバーに送信される
4. サーバーサイドで以下の処理を実行:
   - Firebase Authenticationでユーザーアカウントを作成
   - Firestoreにユーザーデータを保存
   - Google Sheetsの「一時キュー」シートにデータを追記
5. 処理結果をフロントエンドに返却
6. 成功時、LINEトークルームにメッセージを送信し、アプリを閉じる

## 注意事項

- 本番環境ではFirebaseやGoogle Cloud Platformの認証情報を適切に管理し、リポジトリにはコミットしないでください
- LINE LIFFのセキュリティ設定を確認し、適切なスコープと権限を設定してください
- 個人情報の取り扱いには十分注意し、プライバシーポリシーを遵守してください

## 貢献方法

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/awesome-feature`)
3. 変更をコミット (`git commit -m 'Add awesome feature'`)
4. ブランチをプッシュ (`git push origin feature/awesome-feature`)
5. プルリクエストを作成

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。