// デバッグ情報を収集するスクリプト
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
    
    // デバッグ情報をコンソールに出力
    function logDebug(title, info) {
        const message = info !== undefined ? `${title}: ${JSON.stringify(info)}` : title;
        console.log(`[DEBUG] ${message}`);
        appendToDebugDisplay(message);
    }
    
    // エラー情報をコンソールに出力
    function logError(type, message, file, line, col, error) {
        const errorInfo = {
            message: message,
            file: file,
            line: line,
            col: col,
            stack: error && error.stack
        };
        console.error(`[ERROR] ${type}:`, errorInfo);
        appendToDebugDisplay(`ERROR - ${type}: ${message} (${file}:${line}:${col})`);
    }
    
    // デバッグ表示領域に情報を追加
    function appendToDebugDisplay(message) {
        // ローディング終了時にデバッグ表示領域を作成
        setTimeout(function() {
            createDebugDisplay();
            const debugList = document.getElementById('debug-log-list');
            if (debugList) {
                const item = document.createElement('li');
                item.textContent = message;
                debugList.appendChild(item);
            }
        }, 500);
    }
    
    // デバッグ表示領域を作成
    function createDebugDisplay() {
        if (document.getElementById('debug-log-container')) return;
        
        const container = document.createElement('div');
        container.id = 'debug-log-container';
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.right = '10px';
        container.style.width = '300px';
        container.style.maxHeight = '200px';
        container.style.overflow = 'auto';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        container.style.color = '#00ff00';
        container.style.padding = '10px';
        container.style.borderRadius = '5px';
        container.style.fontSize = '12px';
        container.style.zIndex = '9999';
        
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.marginBottom = '5px';
        
        const title = document.createElement('strong');
        title.textContent = 'デバッグログ';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.color = '#ffffff';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = function() {
            container.style.display = 'none';
        };
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        const list = document.createElement('ul');
        list.id = 'debug-log-list';
        list.style.listStyle = 'none';
        list.style.padding = '0';
        list.style.margin = '0';
        
        container.appendChild(header);
        container.appendChild(list);
        
        document.body.appendChild(container);
    }
    
    // グローバルにデバッグ関数を公開
    window.debugLog = logDebug;
    window.debugError = logError;
})();
