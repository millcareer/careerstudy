const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();

// ミドルウェアの設定
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // フロントエンドのファイルを配信

// Firebase Admin初期化
// ServiceAccountの内容は環境変数または.envファイルから読み込み
let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (e) {
  // 環境変数が直接JSONでない場合、パスとして扱う
  serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// Firestoreの初期化
const db = admin.firestore();

// Google Sheets API初期化
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const sheets = google.sheets({ version: 'v4' });

// Google API認証
async function authorize() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  
  const authClient = await auth.getClient();
  google.options({ auth: authClient });
  return authClient;
}

// 起動時にGoogle API認証を実行
authorize().catch(console.error);

// /api/register エンドポイント - ユーザー登録処理
app.post('/api/register', async (req, res) => {
  try {
    // リクエストボディから必要なデータを抽出
    const { userId, displayName, answers, rawMessage } = req.body;

    // answers (text_list) の内容とインデックスのマッピング
    // 0: mailadress
    // 1: password
    // 2: phoneNumber
    // 3: lastName
    // 4: firstName
    // 5: lastNameRead
    // 6: firstNameRead
    // 7: birthYear
    // 8: birthMonth
    // 9: birthDay
    // 10: universityName
    // 11: clubActivity
    // 12: grade
    // 13: gender
    // 14: birthPlace
    // 15: position
    // 16: faculty
    // 17: department
    // 18: academicType
    // 19: agreement

    // --- 1. Firebase Auth 書き込み ---
    const auth = admin.auth(); // Firebase Auth のインスタンスを取得

    try {
      // メールアドレスとパスワードで新しいユーザーを作成
      const userRecord = await auth.createUser({
        email: answers[0], // mailadress
        password: answers[1], // password
        displayName: displayName // オプション: Firebase Auth のユーザーにも displayName を設定
      });
      console.log('Successfully created new user in Firebase Auth with UID:', userRecord.uid);
    } catch (authError) {
      console.error('Error creating Firebase Auth user:', authError);
      // Auth 登録に失敗した場合もFirestoreとSheetsへの登録は続行
    }

    // --- 2. Firestore/users 書き込み ---
    // userId をドキュメントIDとし、answers の内容を指定されたフィールド名とデータ型にマッピング
    const firestoreData = {
      // ユーザーから指定されたフィールド名とデータ型に基づいてマッピング
      mailadress: answers[0], // 文字列
      phoneNumber: answers[2], // 文字列
      lastName: answers[3], // 文字列
      firstName: answers[4], // 文字列
      lastNameRead: answers[5], // 文字列
      firstNameRead: answers[6], // 文字列
      birthYear: parseInt(answers[7], 10), // 数値に変換
      birthMonth: parseInt(answers[8], 10), // 数値に変換
      birthDay: parseInt(answers[9], 10), // 数値に変換
      universityName: answers[10], // 文字列
      clubActivity: answers[11], // 文字列
      grade: parseInt(answers[12], 10), // 数値に変換
      gender: answers[13], // 文字列
      birthPlace: answers[14], // 文字列
      position: answers[15], // 文字列
      faculty: answers[16], // 文字列
      department: answers[17], // 文字列
      academicType: answers[18], // 文字列
      // agreement はユーザーが指定した例が boolean (true) なので、文字列 'true' が来た場合に true となるように変換
      agreement: answers[19] === '同意する', // ブール値に変換 (フォームからの入力が '同意する' かどうかで判定)
      // userId, displayName, rawMessage も Firestore ドキュメントに含める
      userId: userId,
      displayName: displayName,
      rawMessage: rawMessage,
      // 作成日時をサーバータイムスタンプとして記録
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // 'users' コレクションに、ドキュメントIDを userId として、firestoreData を保存
    await db.collection('users').doc(userId).set(firestoreData);
    console.log('Successfully wrote to Firestore with doc id:', userId);

    // --- 3. Sheets 書き込み ---
    // スプレッドシートには、["", "", createdAt, userId, displayName, text_list の要素を羅列...] の形式で追記
    const sheetRow = [
      "", // ユーザー指定の形式の最初の空文字列
      "", // ユーザー指定の形式の2番目の空文字列
      new Date().toISOString(), // 現在時刻をISO文字列形式で取得
      userId,
      displayName,
      ...answers // answers (text_list) の各要素を個別の列として展開して追加
    ];

    // スプレッドシートの '一時キュー' シートに新しい行を追記
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: '一時キュー!A1', // 追記なので、データのあるなしに関わらずこの範囲指定で末尾に追加
      valueInputOption: 'RAW', // 値を文字列としてそのまま書き込み
      requestBody: { values: [sheetRow] }, // 書き込むデータは二重配列（行の配列）
    });
    console.log('Successfully appended row to Google Sheets');

    // 全ての処理（Auth, Firestore, Sheets）が成功したら、クライアントに成功レスポンスを返す
    res.json({ success: true });

  } catch (e) {
    // いずれかの処理でエラーが発生した場合の共通エラーハンドリング
    console.error('Error in /api/register endpoint:', e);
    // クライアントには成功ではないステータスコードとエラー情報を返す
    res.status(500).json({ success: false, error: e.message });
  }
});

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});