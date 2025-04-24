// common/api.js - API通信機能をカプセル化したモジュール

/**
 * JSONP方式でGoogleスプレッドシート（Google Apps Script）からデータを取得する
 * CORS問題を回避するためにscriptタグを使用
 * 
 * @param {string} url - アクセスするURL
 * @param {string} callbackParam - コールバックパラメータ名（デフォルト: 'callback'）
 * @param {number} timeout - タイムアウト時間（ミリ秒、デフォルト: 10000ms）
 * @returns {Promise} - 取得したデータで解決するPromise
 */
function fetchJsonp(url, callbackParam = 'callback', timeout = 10000) {
    return new Promise((resolve, reject) => {
        // タイムスタンプを含む一意のコールバック名を作成
        const callbackName = 'jsonpCallback_' + Date.now();
        
        // タイムアウト処理のためのタイマーID
        let timeoutId;
        
        // グローバルコールバック関数を定義
        window[callbackName] = function(data) {
            // タイムアウトをクリア
            clearTimeout(timeoutId);
            
            // スクリプトタグをクリーンアップ
            if (scriptTag.parentNode) {
                document.body.removeChild(scriptTag);
            }
            
            // グローバルコールバック関数を削除
            delete window[callbackName];
            
            // データを返す
            resolve(data);
        };
        
        // URLにコールバックパラメータを追加
        const urlWithCallback = url + (url.includes('?') ? '&' : '?') + 
                              callbackParam + '=' + callbackName;
        
        // スクリプトタグを作成
        const scriptTag = document.createElement('script');
        scriptTag.src = urlWithCallback;
        
        // エラーハンドリング
        scriptTag.onerror = function(error) {
            // タイムアウトをクリア
            clearTimeout(timeoutId);
            
            // スクリプトタグをクリーンアップ
            if (scriptTag.parentNode) {
                document.body.removeChild(scriptTag);
            }
            
            // グローバルコールバック関数を削除
            delete window[callbackName];
            
            // エラーを返す
            reject(new Error('JSONPリクエストに失敗しました: ' + error.message));
        };
        
        // タイムアウト処理
        timeoutId = setTimeout(function() {
            // スクリプトタグをクリーンアップ
            if (scriptTag.parentNode) {
                document.body.removeChild(scriptTag);
            }
            
            // グローバルコールバック関数を削除
            delete window[callbackName];
            
            // タイムアウトエラーを返す
            reject(new Error('JSONPリクエストがタイムアウトしました'));
        }, timeout);
        
        // スクリプトタグをドキュメントに追加して実行
        document.body.appendChild(scriptTag);
    });
}

/**
 * イベント情報をGoogle Apps Scriptから取得する
 * 
 * @param {string} url - イベント情報取得API（GAS）のURL
 * @param {Object} options - オプション（パラメータなど）
 * @returns {Promise} - イベントデータで解決するPromise
 */
function fetchEvents(url, options = {}) {
    // パラメータを追加したURLを作成
    let apiUrl = url;
    
    // オプションのパラメータがある場合はURLに追加
    if (options.params) {
        const params = new URLSearchParams(options.params);
        apiUrl += (apiUrl.includes('?') ? '&' : '?') + params.toString();
    }
    
    // デフォルトのイベントデータ（API取得に失敗した場合のフォールバック）
    const defaultEvents = [
        {
            choice_text: "イベント参加不可（日程が合わない）",
            title: "参加できません"
        }
    ];
    
    // JSONP APIを呼び出す
    return fetchJsonp(apiUrl)
        .then(data => {
            // データがない場合はデフォルトデータを返す
            if (!data || !Array.isArray(data) || data.length === 0) {
                console.warn("イベントデータが空か、予期しない形式です。デフォルトデータを使用します。");
                return defaultEvents;
            }
            return data;
        })
        .catch(error => {
            // エラーログ
            console.error("イベントデータの取得に失敗しました:", error);
            
            // デフォルトデータを返す
            return defaultEvents;
        });
}

/**
 * フォームデータをGoogle Apps Scriptに送信する
 * 
 * @param {string} url - データ送信先API（GAS）のURL
 * @param {Object} formData - 送信するフォームデータ
 * @returns {Promise} - 送信結果で解決するPromise
 */
function submitFormData(url, formData) {
    return fetch(url, {
        method: 'POST',
        mode: 'no-cors', // CORS対策
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        // no-corsモードではレスポンスが空になるため、成功したとみなす
        return { success: true };
    })
    .catch(error => {
        console.error("データ送信に失敗しました:", error);
        throw error;
    });
}

/**
 * Google Apps Scriptからその他のデータを取得する（汎用メソッド）
 * 
 * @param {string} url - データ取得API（GAS）のURL
 * @param {Object} options - オプション（パラメータなど）
 * @returns {Promise} - 取得データで解決するPromise
 */
function fetchGasData(url, options = {}) {
    // パラメータを追加したURLを作成
    let apiUrl = url;
    
    // オプションのパラメータがある場合はURLに追加
    if (options.params) {
        const params = new URLSearchParams(options.params);
        apiUrl += (apiUrl.includes('?') ? '&' : '?') + params.toString();
    }
    
    // JSONP APIを呼び出す
    return fetchJsonp(apiUrl)
        .catch(error => {
            console.error("GASデータの取得に失敗しました:", error);
            throw error;
        });
}

// グローバルスコープにエクスポート
window.api = {
    fetchJsonp,
    fetchEvents,
    submitFormData,
    fetchGasData
};
