# キャリアスタディアプリ - TODOリスト

## 完了済み
- [x] **サーバーサイド実装**: `/api/register` エンドポイントの実装
- [x] **Firebase Auth連携**: ユーザー登録時にFirebase Authにアカウントを作成する機能を実装
- [x] **Firestore連携**: ユーザーデータをFirestoreに保存する機能を実装
- [x] **Google Sheets連携**: ユーザーデータをスプレッドシートに追記する機能を実装
- [x] **API_ENDPOINTの設定**: index.jsファイル内の`API_ENDPOINT`変数を`/api/register`エンドポイントに修正

## 緊急対応事項
- [ ] **環境変数の設定**: `.env`ファイルを作成し、必要な認証情報を設定する
- [ ] **サービスアカウント認証**: Firebase AdminとGoogle Sheets APIの認証用サービスアカウントを準備
- [ ] **動作確認**: LINE LIFFアプリとして正常に動作するか確認する
- [ ] **バックエンド連携**: GCP側で登録データの受け取りとFirebaseへの保存が正しく機能することを確認

## 今後の改善事項
- [ ] **エラーハンドリングの強化**: フォーム入力のバリデーションとエラー表示の改善
- [ ] **ユーザビリティの向上**: フォーム入力項目の順序や表示方法の最適化
- [ ] **レスポンシブデザインの改善**: モバイル端末での表示・操作性の向上
- [ ] **パフォーマンス最適化**: ページ読み込み速度の改善
- [ ] **セキュリティ強化**: CSRFトークンの実装やデータ検証の追加

## 長期計画
- [ ] **管理画面の開発**: 登録データの管理・閲覧機能
- [ ] **多言語対応**: 日本語以外の言語サポート
- [ ] **アクセス解析**: ユーザー行動の把握と分析
- [ ] **ユーザーダッシュボード**: 登録ユーザーがログインして自分の情報を管理できるUI
- [ ] **LINE Messaging API連携**: 定期的な情報配信やリマインダー機能

## 技術的な負債
- [ ] **コードリファクタリング**: index.jsとliff.jsの機能整理と重複排除
- [ ] **テスト導入**: 自動テストの導入によるQA効率化
- [ ] **セキュリティ強化**: データ送受信の暗号化とセキュリティ対策
- [ ] **ログ記録**: 詳細なログ記録と監視機能の実装
- [ ] **エラー通知**: 重大なエラー発生時の自動通知システムの構築
