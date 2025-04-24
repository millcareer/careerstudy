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
    const container = document.createElement('div');
    container.className = 'event-selection-container';

    // Add header
    const header = document.createElement('div');
    header.className = 'event-selection-header';
    header.innerHTML = '<h3>イベント選択 (最大2つまで)</h3>';
    container.appendChild(header);

    // Create options container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'event-options';

    // Add event options
    events.forEach(event => {
        const option = document.createElement('label');
        option.className = 'event-option';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = event.id;
        checkbox.dataset.eventName = event.name;
        
        checkbox.addEventListener('change', function() {
            const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
            
            if (this.checked && selectedCheckboxes.length > 2) {
                this.checked = false;
                const errorMsg = document.querySelector('.error-message');
                errorMsg.classList.add('visible');
                setTimeout(() => errorMsg.classList.remove('visible'), 3000);
                return;
            }
            
            updateSelectedEventsList();
            updateHiddenFields();
        });
        
        option.appendChild(checkbox);
        option.appendChild(document.createTextNode(event.name));
        optionsContainer.appendChild(option);
    });
    
    container.appendChild(optionsContainer);

    // Add error message container
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = '最大2つまでしか選択できません。';
    container.appendChild(errorMessage);

    // Add selected events display
    const selectedEventsContainer = document.createElement('div');
    selectedEventsContainer.innerHTML = `
        <h4 class="selected-events-header">選択したイベント (<span id="selected-count">0</span>/2)</h4>
        <div id="selected-events-list"></div>
    `;
    container.appendChild(selectedEventsContainer);

    // Add hidden fields
    const hiddenFields = document.createElement('div');
    hiddenFields.style.display = 'none';
    hiddenFields.innerHTML = `
        <input type="hidden" name="form_answer22" id="form_answer22" value="">
        <input type="hidden" name="form_answer23" id="form_answer23" value="">
    `;
    container.appendChild(hiddenFields);

    return container;
}

function updateSelectedEventsList() {
    const selectedCheckboxes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
    const container = document.getElementById('selected-events-list');
    const countElement = document.getElementById('selected-count');
    
    countElement.textContent = selectedCheckboxes.length;
    
    if (selectedCheckboxes.length === 0) {
        container.innerHTML = '<div class="no-selection">イベントが選択されていません</div>';
        return;
    }
    
    const list = document.createElement('ul');
    list.className = 'selected-events';
    
    selectedCheckboxes.forEach(checkbox => {
        const li = document.createElement('li');
        li.textContent = checkbox.dataset.eventName;
        list.appendChild(li);
    });
    
    container.innerHTML = '';
    container.appendChild(list);
}

function updateHiddenFields() {
    const selectedCheckboxes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
    const values = selectedCheckboxes.map(cb => cb.value);
    
    document.getElementById('form_answer22').value = values[0] || '';
    document.getElementById('form_answer23').value = values[1] || '';
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
