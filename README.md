# Career Study Application

LINEのLIFFアプリケーションを使用したキャリア調査アプリケーション。

## エラー修正内容

以下のエラーを修正しました：

1. **CORS問題の修正**
   - Google Apps Scriptからのデータ取得でCORSエラーが発生していた問題を解決
   - JSONPアプローチを使用して、クロスドメインのデータ取得を可能に

2. **未定義関数の実装**
   - `createEventSelectionUI`関数が未定義だったエラーを修正
   - イベント選択UIを生成する機能を実装

3. **エラーハンドリングの改善**
   - ネットワークエラー発生時のフォールバック実装
   - ユーザーフレンドリーなエラーメッセージ表示

## LIFF設定

LIFFアプリを正しく動作させるには、以下の設定が必要です：

1. LIFF IDの設定
2. Google Apps Scriptのデプロイとエンドポイント設定
3. LINEチャネルの設定

## Google Apps Script設定

`gas-script.js`ファイルにサンプルコードが含まれています。以下の手順で設定してください：

1. Google Apps Scriptエディタでプロジェクトを作成
2. `gas-script.js`のコードをコピー
3. ウェブアプリとしてデプロイし、URLを取得
4. `index.js`の`fetchUpcomingEvents`関数内のURLを更新

## インストール手順

1. リポジトリをクローン
```
git clone https://github.com/millcareer/careerstudy.git
```

2. 必要な設定を行う
   - LIFFのIDを設定
   - Google Apps Scriptのエンドポイントを設定

3. GitHubページにデプロイするか、任意のウェブサーバーにアップロード

4. LINEのLIFFアプリとして登録

## 使用技術

- LINE Front-end Framework (LIFF)
- JavaScript (Vanilla JS)
- Google Apps Script (バックエンド)
- GitHub Pages (ホスティング)
