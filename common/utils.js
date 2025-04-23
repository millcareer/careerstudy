// 共通ユーティリティ関数

// URLパラメータを取得する関数
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 日付フォーマット関数
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

// ランダムなIDを生成する関数
function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// スマートフォンかどうか判定する関数
function isSmartphone() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// エラーハンドリング関数
function handleError(error, message = 'エラーが発生しました') {
    console.error(error);
    alert(message);
    return false;
}

// 配列をシャッフルする関数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// HTMLをエスケープする関数
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// スプレッドシートのデータからJavaScriptオブジェクトに変換する関数
function convertSheetDataToObjects(data) {
    const headers = data[0];
    const result = [];
    
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const obj = {};
        
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = row[j];
        }
        
        result.push(obj);
    }
    
    return result;
}
