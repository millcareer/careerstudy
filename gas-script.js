// Google Apps Script code sample - Code.gs
// This is a reference file to be copied to Google Apps Script

function doGet(e) {
  // サンプルイベントデータ
  const events = [
    {
      id: "event1",
      title: "キャリア相談会",
      date: "2025-05-10",
      choice_text: "キャリア相談会 (5/10 オンライン)",
      description: "キャリアについての相談会です。",
      location: "オンライン"
    },
    {
      id: "event2",
      title: "就職セミナー",
      date: "2025-05-20",
      choice_text: "就職セミナー (5/20 東京)",
      description: "就職活動についてのセミナーです。",
      location: "東京オフィス"
    },
    {
      id: "event3",
      title: "イベント参加不可",
      choice_text: "イベント参加不可（日程が合わない）",
      date: "",
      description: "参加できません",
      location: ""
    }
  ];
  
  // JSONPリクエストかどうかをチェック
  if (e.parameter.callback) {
    // JSONPレスポンスを返す
    return ContentService.createTextOutput(e.parameter.callback + "(" + JSON.stringify(events) + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    // 通常のJSONレスポンスを返す
    return ContentService.createTextOutput(JSON.stringify(events))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// サーバーサイドでイベント登録を処理する関数
function doPost(e) {
  try {
    // POSTデータを処理
    const data = JSON.parse(e.postData.contents);
    
    // ここでスプレッドシートへの保存やその他の処理を行う
    // 例：スプレッドシートに保存
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Registrations');
    sheet.appendRow([
      new Date(), // タイムスタンプ
      data.userId || 'Unknown',
      data.displayName || 'Unknown',
      data.selectedEvents ? JSON.stringify(data.selectedEvents) : 'None',
      data.age || '',
      data.gender || '',
      data.email || ''
    ]);
    
    // 成功レスポンス
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: '登録が完了しました'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // エラーレスポンス
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'エラーが発生しました: ' + error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// デプロイ方法：
// 1. Google Apps Script エディタでこのコードを作成
// 2. デプロイ > 新しいデプロイ > ウェブアプリケーション
// 3. 実行するユーザー：自分（スクリプト所有者）
// 4. アクセスできるユーザー：全員（匿名を含む）
// 5. デプロイボタンをクリック
// 6. 生成されたウェブアプリURLをコピーして、LIFF.jsのfetchUpcomingEvents関数内のURLを更新
