// common/events.js - イベント情報の取得と表示を管理するための共通関数

/**
 * イベント情報を取得する関数
 * 
 * @param {string} url - イベント情報を取得するAPI URL（省略時はデフォルトURL）
 * @returns {Promise} - イベントデータで解決するPromise
 */
function fetchUpcomingEvents(url) {
    // 初期UIを設定 - エラーが発生しても最低限のUIが表示されるように
    setupInitialEventUI();

    // APIのURL（指定がなければデフォルト値）
    const apiUrl = url || 'https://script.google.com/macros/s/AKfycbw5gvosHHQQbTKL5UDdcI6OrPfXw_DY4IXSTgV2ADkyuvbLoT1AqoXHoPkhBuyo6_1RBQ/exec';

    // api.jsが読み込まれているか確認
    if (!window.api || typeof window.api.fetchEvents !== 'function') {
        console.error("API通信機能が初期化されていません。api.jsが正しく読み込まれているか確認してください。");
        
        // エラー時のデフォルトデータ
        const defaultEvents = [
            {
                choice_text: "イベント参加不可（日程が合わない）",
                title: "参加できません"
            }
        ];
        
        // エラー時にもデフォルトデータでUIを作成
        createEventSelectionUI(defaultEvents);
        
        // エラー通知
        const formContainer = document.getElementById('form-container');
        if (formContainer) {
            const errorNotice = document.createElement('div');
            errorNotice.className = 'alert alert-warning';
            errorNotice.style.marginTop = '10px';
            errorNotice.innerHTML = 'API通信機能が初期化されていません。ページを再読み込みしてください。';
            formContainer.prepend(errorNotice);
        }
        
        return Promise.resolve(defaultEvents);
    }

    // api.jsの関数を使ってデータ取得
    return window.api.fetchEvents(apiUrl)
        .then(data => {
            // イベント選択UIを作成
            createEventSelectionUI(data);
            return data;
        })
        .catch(error => {
            console.error("イベント情報の取得に失敗しました:", error);
            
            // エラー時のデフォルトデータ
            const defaultEvents = [
                {
                    choice_text: "イベント参加不可（日程が合わない）",
                    title: "参加できません"
                }
            ];
            
            // エラー時にもデフォルトデータでUIを作成
            createEventSelectionUI(defaultEvents);
            
            // エラー通知
            const formContainer = document.getElementById('form-container');
            if (formContainer) {
                const errorNotice = document.createElement('div');
                errorNotice.className = 'alert alert-warning';
                errorNotice.style.marginTop = '10px';
                errorNotice.innerHTML = 'イベント情報の取得に失敗しました。ネットワーク接続を確認し、ページを再読み込みしてください。';
                formContainer.prepend(errorNotice);

                // ローディング表示を非表示にし、フォームコンテナを表示
                document.getElementById('loading').style.display = 'none';
                formContainer.style.display = 'block';
                
                // フォームを生成
                if (typeof createSurvey1Form === 'function') {
                    createSurvey1Form(formContainer);
                }
            }
            
            return defaultEvents;
        });
}

/**
 * JSONデータを選択ピッカー形式で表示する関数
 * 
 * @param {Array} jsonData - 表示するJSONデータ
 * @returns {HTMLElement} - 作成されたJSON選択UIコンテナ要素
 */
function displayJsonPicker(jsonData) {
    // JSONコンテナを探す、なければ作成
    let jsonContainer = document.getElementById('json-picker-container');
    if (!jsonContainer) {
        jsonContainer = document.createElement('div');
        jsonContainer.id = 'json-picker-container';
        jsonContainer.className = 'mt-3 mb-3 p-3 border rounded bg-light';
        
        // 見出しテキスト
        const title = document.createElement('h5');
        title.textContent = '利用可能な日程一覧 (JSONデータ)';
        title.className = 'mb-2';
        jsonContainer.appendChild(title);
        
        // JSON選択用のセレクトボックスを作成
        const select = document.createElement('select');
        select.id = 'json-picker-select';
        select.className = 'form-select mb-2';
        select.multiple = true;
        select.size = 5; // 5行表示
        select.style.fontFamily = 'monospace';
        
        // イベントデータをオプションとして追加
        jsonData.forEach((item, index) => {
            const option = document.createElement('option');
            option.value = index;
            
            // 表示用にJSONをフォーマット
            const displayText = item.choice_text || item.title || '名称なし';
            const detailText = item.date ? ` (${item.date})` : '';
            option.textContent = `${displayText}${detailText} - ID: ${item.id || index}`;
            
            select.appendChild(option);
        });
        
        jsonContainer.appendChild(select);
        
        // 選択されたJSONデータの詳細表示エリア
        const detailContainer = document.createElement('div');
        detailContainer.id = 'json-detail-container';
        detailContainer.className = 'mt-2 p-2 border rounded bg-white';
        detailContainer.style.maxHeight = '150px';
        detailContainer.style.overflowY = 'auto';
        
        const pre = document.createElement('pre');
        pre.id = 'json-detail-content';
        pre.style.margin = '0';
        pre.style.fontSize = '0.8rem';
        pre.textContent = '↑ 上のリストから選択すると詳細が表示されます';
        
        detailContainer.appendChild(pre);
        jsonContainer.appendChild(detailContainer);
        
        // 選択リスナーを追加
        select.addEventListener('change', function() {
            const selectedOptions = Array.from(this.selectedOptions);
            if (selectedOptions.length > 0) {
                const selectedIndices = selectedOptions.map(option => parseInt(option.value));
                const selectedItems = selectedIndices.map(index => jsonData[index]);
                
                // 選択したアイテムの詳細をJSONとして表示
                document.getElementById('json-detail-content').textContent = JSON.stringify(selectedItems, null, 2);
            } else {
                document.getElementById('json-detail-content').textContent = '↑ 上のリストから選択すると詳細が表示されます';
            }
        });
        
        // コンテナを適切な位置に追加
        const eventOptionsContainer = document.getElementById('event-options-list');
        if (eventOptionsContainer) {
            eventOptionsContainer.parentNode.insertBefore(jsonContainer, document.getElementById('selected-events-list'));
        }
    }
    
    return jsonContainer;
}

/**
 * イベント選択UI生成関数
 * 
 * @param {Array} events - イベントデータの配列
 * @returns {HTMLElement} - 作成されたイベント選択UIコンテナ要素
 */
function createEventSelectionUI(events) {
    // コンソールにイベントデータを表示（デバッグ用）
    console.log('createEventSelectionUIに渡されたデータ:', JSON.stringify(events, null, 2));
    
    // イベント選択用のコンテナを取得または作成
    const eventContainer = document.getElementById('event-selection-container');
    if (!eventContainer) {
        console.error('event-selection-containerが見つかりません');
        return;
    }
    
    // コンテナをクリア
    eventContainer.innerHTML = '';
    
    // イベントセクションのヘッダーを作成
    const header = document.createElement('div');
    header.innerHTML = `
        <p class="form-text">参加希望イベントの選択</p>
        <div style="margin-bottom: 10px;">
            <p>下記から参加する日程を<span style="color: #fcac04; font-weight: bold;">2つ</span>選択してください</p>
        </div>
    `;
    eventContainer.appendChild(header);

    // イベントオプションリストを作成
    const optionsList = document.createElement('div');
    optionsList.id = 'event-options-list';
    optionsList.className = 'event-options-list';

    // イベントごとにチェックボックスを作成
    events.forEach((event, index) => {
        const eventOption = document.createElement('div');
        eventOption.className = 'event-option';
        eventOption.innerHTML = `
            <input type="checkbox" id="event-${index}" name="event-${index}" value="${event.choice_text || event.title}">
            <label for="event-${index}">${event.choice_text || event.title}</label>
        `;
        optionsList.appendChild(eventOption);
    });

    eventContainer.appendChild(optionsList);

    // 選択されたイベントリストのコンテナを作成
    const selectedList = document.createElement('div');
    selectedList.id = 'selected-events-list';
    selectedList.className = 'selected-events-list mt-3';
    eventContainer.appendChild(selectedList);

    // チェックボックスの変更を監視
    const checkboxes = optionsList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // 選択されたイベントを更新
            const selectedEvents = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            
            // 2つ以上選択された場合、最新の選択を解除
            if (selectedEvents.length > 2) {
                checkbox.checked = false;
                showError('イベントは2つまでしか選択できません。');
                return;
            }
        });
    });
}

/**
 * 初期イベントUI設定関数（エラー防止）
 */
function setupInitialEventUI() {
    const formContainer = document.getElementById('form-container');
    if (!formContainer) return;
    
    // すでに存在する場合は作成しない
    if (document.getElementById('event-selection-container')) return;
    
    // イベント選択コンテナを作成
    const eventContainer = document.createElement('div');
    eventContainer.id = 'event-selection-container';
    eventContainer.className = 'mb-4';
    
    // タイトル
    const titleElement = document.createElement('h3');
    titleElement.textContent = '参加予定イベントの選択';
    titleElement.className = 'mb-3';
    
    // 説明文
    const description = document.createElement('p');
    description.textContent = 'イベントから2つ選択、または「日程が合わない」を選択してください。';
    description.className = 'mb-3';
    
    // 選択数表示
    const selectionCount = document.createElement('p');
    selectionCount.id = 'selection_count';
    selectionCount.textContent = '選択数: 0/2';
    selectionCount.style.color = '#fcac04';
    selectionCount.style.fontWeight = 'bold';
    selectionCount.className = 'mb-2';
    
    // オプションリスト
    const optionsList = document.createElement('div');
    optionsList.id = 'event-options-list';
    optionsList.className = 'mb-3';
    
    // 選択されたイベントリスト
    const selectedList = document.createElement('div');
    selectedList.id = 'selected-events-list';
    selectedList.className = 'mb-4';
    const initialMessage = document.createElement('p');
    initialMessage.style.color = '#666';
    initialMessage.textContent = 'イベントが選択されていません';
    selectedList.appendChild(initialMessage);
    
    // 要素を組み合わせる
    eventContainer.appendChild(titleElement);
    eventContainer.appendChild(description);
    eventContainer.appendChild(selectionCount);
    eventContainer.appendChild(optionsList);
    eventContainer.appendChild(selectedList);
    
    // フォームコンテナに追加
    formContainer.appendChild(eventContainer);
    
    // 選択したイベントを記録する配列を初期化
    window.selectedEvents = [];
}

// 関数をグローバルスコープにエクスポート
window.fetchUpcomingEvents = fetchUpcomingEvents;
window.createEventSelectionUI = createEventSelectionUI;
window.setupInitialEventUI = setupInitialEventUI;
window.displayJsonPicker = displayJsonPicker;
