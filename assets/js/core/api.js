// common/api.js - API通信機能をカプセル化したモジュール

/**
 * Fetch APIを使ってHTTP通信を行う共通関数
 * 
 * @param {string} url - アクセスするURL
 * @param {Object} options - fetchオプション（デフォルト値あり）
 * @returns {Promise} - レスポンスデータで解決するPromise
 */
async function fetchData(url, options = {}) {
    // デフォルトのオプション
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'  // CORSモードを明示的に設定
    };
    
    // オプションをマージ
    const fetchOptions = { ...defaultOptions, ...options };
    
    try {
        // fetch APIでリクエスト
        const response = await fetch(url, fetchOptions);
        
        // レスポンスのステータスコードをチェック
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
        }
        
        // JSONデータを取得
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("API通信エラー:", error);
        throw error;
    }
}

/**
 * イベント情報をGASから取得する
 * 
 * @param {string} url - イベント情報取得API（GAS）のURL
 * @param {Object} options - オプション（パラメータなど）
 * @returns {Promise} - イベントデータで解決するPromise
 */
async function fetchEvents(url, options = {}) {
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
    
    try {
        // Fetch APIでデータ取得
        const data = await fetchData(apiUrl);
        
        // データがない場合はデフォルトデータを返す
        if (!data || !Array.isArray(data) || data.length === 0) {
            console.warn("イベントデータが空か、予期しない形式です。デフォルトデータを使用します。");
            return defaultEvents;
        }
        
        return data;
    } catch (error) {
        // エラーログ
        console.error("イベントデータの取得に失敗しました:", error);
        
        // デフォルトデータを返す
        return defaultEvents;
    }
}

/**
 * フォームデータをGASに送信する
 * 
 * @param {string} url - データ送信先API（GAS）のURL
 * @param {Object} formData - 送信するフォームデータ
 * @returns {Promise} - 送信結果で解決するPromise
 */
async function submitFormData(url, formData) {
    try {
        const response = await fetchData(url, {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        return { success: true, data: response };
    } catch (error) {
        console.error("データ送信に失敗しました:", error);
        throw error;
    }
}

/**
 * GASからその他のデータを取得する（汎用メソッド）
 * 
 * @param {string} url - データ取得API（GAS）のURL
 * @param {Object} options - オプション（パラメータなど）
 * @returns {Promise} - 取得データで解決するPromise
 */
async function fetchGasData(url, options = {}) {
    // パラメータを追加したURLを作成
    let apiUrl = url;
    
    // オプションのパラメータがある場合はURLに追加
    if (options.params) {
        const params = new URLSearchParams(options.params);
        apiUrl += (apiUrl.includes('?') ? '&' : '?') + params.toString();
    }
    
    try {
        // Fetch APIでデータ取得
        return await fetchData(apiUrl);
    } catch (error) {
        console.error("GASデータの取得に失敗しました:", error);
        throw error;
    }
}

// グローバルスコープにエクスポート
window.api = {
    fetchData,
    fetchEvents,
    submitFormData,
    fetchGasData
};
