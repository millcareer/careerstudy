// デバッグ情報を収集・管理するスクリプト
(function() {
    // ページロード時にデバッグ情報を収集
    window.addEventListener('DOMContentLoaded', collectDebugInfo);
    // エラー発生時にデバッグ情報を収集
    window.addEventListener('error', function(event) {
        logError('JavaScript Error', event.message, event.filename, event.lineno, event.colno, event.error);
    });
    
    // 未処理のPromise拒否をキャッチ
    window.addEventListener('unhandledrejection', function(event) {
        logError('Unhandled Promise Rejection', event.reason);
    });
    
    // デバッグ情報を収集する関数
    function collectDebugInfo() {
        logDebug('Page loaded');
        
        // ブラウザ情報
        logDebug('User Agent', navigator.userAgent);
        
        // 読み込まれたスクリプト
        const scripts = Array.from(document.scripts).map(s => s.src || 'inline script');
        logDebug('Loaded Scripts', scripts);
        
        // LIFF SDKのステータス
        logDebug('LIFF SDK Status', typeof liff !== 'undefined' ? 'loaded' : 'not loaded');
        
        // カスタム関数のステータス
        logDebug('createSurvey1Form', typeof createSurvey1Form !== 'undefined' ? 'defined' : 'undefined');
        logDebug('setupBirthdaySelects', typeof setupBirthdaySelects !== 'undefined' ? 'defined' : 'undefined');
        logDebug('initializeChoices', typeof initializeChoices !== 'undefined' ? 'defined' : 'undefined');
        
        // DOM要素のチェック
        checkElement('loading');
        checkElement('form-container');
        checkElement('title-career');
    }
    
    // 指定したIDの要素をチェック
    function checkElement(id) {
        const element = document.getElementById(id);
        logDebug(`Element #${id}`, element ? 'found' : 'not found');
    }
    
    // デバッグ情報をコンソールに出力（画面表示なし）
    function logDebug(title, info) {
        const message = info !== undefined ? `${title}: ${JSON.stringify(info)}` : title;
        console.log(`[DEBUG] ${message}`);
        // 画面表示は行わない
    }
    
    // エラー情報をコンソールに出力（画面表示なし）
    function logError(type, message, file, line, col, error) {
        const errorInfo = {
            message: message,
            file: file,
            line: line,
            col: col,
            stack: error && error.stack
        };
        console.error(`[ERROR] ${type}:`, errorInfo);
        // 画面表示は行わない
    }
    
    // グローバルにデバッグ関数を公開
    window.debugLog = logDebug;
    window.debugError = logError;
})();
