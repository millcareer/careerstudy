// イベント情報の取得と表示を管理するための共通関数

// イベント情報を取得する関数
function fetchUpcomingEvents() {
    // 初期のUI設定 - エラーが発生しても最低限の操作ができるように
    setupInitialEventUI();

    // モック用のデフォルトデータを設定
    const defaultEvents = [
        {
            choice_text: "イベント参加不可（日程が合わない）",
            title: "参加できません"
        }
    ];

    // イベント情報を取得するためのJSONPリクエスト
    return new Promise((resolve, reject) => {
        const url = 'https://script.google.com/macros/s/AKfycbzZemROe3jxhKdsvKqUwlLK6lRqrKk4DPTUMn5yyKwK4fp9r-ewqItfautobpWsT7LO2g/exec?from=liff';
        
        // JSONPコールバックを使用してCORS制限を回避
        const callbackName = 'jsonpCallback_' + Date.now();
        
        // グローバルコールバック関数を作成
        window[callbackName] = function(data) {
            // スクリプトタグをクリーンアップ
            document.body.removeChild(scriptTag);
            // グローバルコールバック関数を削除
            delete window[callbackName];
            
            // データを解決
            if (data && Array.isArray(data) && data.length > 0) {
                // JSONデータをコンソールに出力（デバッグ用）
                console.log('取得したイベントデータ:', JSON.stringify(data, null, 2));
                
                // 取得したJSONデータを表示
                displayJsonPicker(data);
                
                resolve(data);
            } else {
                console.warn("イベントデータが空か、予期しない形式です。デフォルトデータを使用します。");
                console.log('デフォルトデータを使用:', JSON.stringify(defaultEvents, null, 2));
                
                // デフォルトJSONデータを表示
                displayJsonPicker(defaultEvents);
                
                resolve(defaultEvents);
            }
        };
        
        // スクリプトタグを作成
        const scriptTag = document.createElement('script');
        scriptTag.src = `${url}&callback=${callbackName}`;
        
        // エラー処理
        scriptTag.onerror = function() {
            // クリーンアップ
            document.body.removeChild(scriptTag);
            delete window[callbackName];
            
            console.error("イベント情報の取得に失敗しました。デフォルトデータを使用します。");
            console.log('エラー時のデフォルトデータ:', JSON.stringify(defaultEvents, null, 2));
            
            // エラー時もデフォルトJSONデータを表示
            displayJsonPicker(defaultEvents);
            
            resolve(defaultEvents);
        };
        
        // スクリプトタグをドキュメントに追加
        document.body.appendChild(scriptTag);
    })
    .then(data => {
        // イベント選択UIを作成
        createEventSelectionUI(data);
        return data;
    })
    .catch(error => {
        console.error("イベント情報の取得に失敗しました:", error);
        // エラー時にデフォルトデータでUIを作成
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

// JSONデータを選択ピッカー形式で表示する関数
function displayJsonPicker(jsonData) {
    // JSON表示用コンテナを探す、なければ作成
    let jsonContainer = document.getElementById('json-picker-container');
    if (!jsonContainer) {
        jsonContainer = document.createElement('div');
        jsonContainer.id = 'json-picker-container';
        jsonContainer.className = 'mt-3 mb-3 p-3 border rounded bg-light';
        
        // 説明テキスト
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
        pre.textContent = '← 上のリストから選択すると詳細が表示されます';
        
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
                document.getElementById('json-detail-content').textContent = '← 上のリストから選択すると詳細が表示されます';
            }
        });
        
        // コンテナを適切な位置に挿入
        // イベント選択と選択済みアイテムの間に配置
        const eventOptionsContainer = document.getElementById('event-options-list');
        if (eventOptionsContainer) {
            eventOptionsContainer.parentNode.insertBefore(jsonContainer, document.getElementById('selected-events-list'));
        }
    }
    
    return jsonContainer;
}

// イベント選択UI生成関数
function createEventSelectionUI(events) {
    // コンソールにイベントデータを表示（デバッグ用）
    console.log('createEventSelectionUIに渡されたデータ:', JSON.stringify(events, null, 2));
    
    // イベント選択用のコンテナを作成
    const eventContainer = document.getElementById('event-selection-container') || 
                         document.createElement('div');
    
    if (!document.getElementById('event-selection-container')) {
        eventContainer.id = 'event-selection-container';
        const formContainer = document.getElementById('form-container');
        if (formContainer) {
            formContainer.appendChild(eventContainer);
        }
    } else {
        // 既存のコンテンツをクリア
        eventContainer.innerHTML = '';
    }
    
    // イベントセクションの見出しを作成
    const heading = document.createElement('h3');
    heading.textContent = 'イベント選択';
    heading.className = 'mb-3';
    eventContainer.appendChild(heading);
    
    // イベント配列が有効かつ項目があるかチェック
    if (!events || !Array.isArray(events) || events.length === 0) {
        const noEvents = document.createElement('p');
        noEvents.textContent = '現在予定されているイベントはありません。';
        eventContainer.appendChild(noEvents);
        return eventContainer;
    }
    
    // イベント選択前の説明テキスト
    const description = document.createElement('p');
    description.textContent = '下記から参加する日程を2つ選択してください';
    description.className = 'mb-3';
    eventContainer.appendChild(description);
    
    // 選択数表示
    const selectionCount = document.createElement('p');
    selectionCount.id = 'selection_count';
    selectionCount.textContent = '選択数: 0/2';
    selectionCount.style.color = '#fcac04';
    selectionCount.style.fontWeight = 'bold';
    selectionCount.className = 'mb-2';
    eventContainer.appendChild(selectionCount);
    
    // イベント選択リストを作成
    const optionsList = document.getElementById('event-options-list') || document.createElement('div');
    optionsList.id = 'event-options-list';
    optionsList.className = 'mb-3';
    optionsList.innerHTML = '';
    
    // イベントオプションを追加
    events.forEach((event, index) => {
        const option = document.createElement('div');
        option.className = 'form-check mb-2';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'form-check-input event-option';
        input.id = `event-option-${index}`;
        input.value = event.id || index;
        input.dataset.title = event.title || '';
        input.dataset.index = index;
        
        const label = document.createElement('label');
        label.className = 'form-check-label';
        label.htmlFor = `event-option-${index}`;
        label.textContent = event.choice_text || event.title || 'イベント名なし';
        
        option.appendChild(input);
        option.appendChild(label);
        optionsList.appendChild(option);
        
        // イベント選択時の処理
        input.addEventListener('change', function() {
            updateSelectedEvents(events);
        });
    });
    
    eventContainer.appendChild(optionsList);
    
    // ここでJSONピッカーを表示（displayJsonPicker関数はfetchUpcomingEventsで呼ばれるので二重表示を防ぐため不要）
    
    // 選択済みイベントリスト
    const selectedList = document.getElementById('selected-events-list') || document.createElement('div');
    selectedList.id = 'selected-events-list';
    selectedList.className = 'mb-4';
    selectedList.innerHTML = '';
    
    const selectedHeading = document.createElement('h5');
    selectedHeading.textContent = '選択した日程';
    selectedHeading.className = 'mt-3 mb-2';
    selectedList.appendChild(selectedHeading);
    
    const initialMessage = document.createElement('p');
    initialMessage.style.color = '#666';
    initialMessage.textContent = 'イベントが選択されていません';
    selectedList.appendChild(initialMessage);
    
    eventContainer.appendChild(selectedList);
    
    return eventContainer;
}

// 選択されたイベントを更新する関数
function updateSelectedEvents(events) {
    const checkboxes = document.querySelectorAll('.event-option:checked');
    const selectedList = document.getElementById('selected-events-list');
    const selectionCount = document.getElementById('selection_count');
    
    // 選択リストをクリア
    selectedList.innerHTML = '';
    
    // 見出しを再追加
    const selectedHeading = document.createElement('h5');
    selectedHeading.textContent = '選択した日程';
    selectedHeading.className = 'mt-3 mb-2';
    selectedList.appendChild(selectedHeading);
    
    // 選択したイベントを配列に保存
    window.selectedEvents = [];
    
    if (checkboxes.length === 0) {
        const noSelection = document.createElement('p');
        noSelection.style.color = '#666';
        noSelection.textContent = 'イベントが選択されていません';
        selectedList.appendChild(noSelection);
    } else {
        checkboxes.forEach(checkbox => {
            const eventIndex = checkbox.dataset.index;
            const event = events[eventIndex];
            
            // 選択イベントを配列に追加
            window.selectedEvents.push(event);
            
            // 選択イベント表示
            const eventItem = document.createElement('div');
            eventItem.className = 'alert alert-info mb-2 d-flex justify-content-between align-items-center';
            
            const eventTitle = document.createElement('span');
            eventTitle.textContent = event.title || 'イベント名なし';
            
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'btn-close';
            removeBtn.setAttribute('aria-label', '選択解除');
            removeBtn.onclick = function() {
                document.getElementById(`event-option-${eventIndex}`).checked = false;
                updateSelectedEvents(events);
            };
            
            eventItem.appendChild(eventTitle);
            eventItem.appendChild(removeBtn);
            selectedList.appendChild(eventItem);
        });
        
        // 選択したイベントをコンソールに表示（デバッグ用）
        console.log('選択されたイベント:', JSON.stringify(window.selectedEvents, null, 2));
    }
    
    // 選択数表示を更新
    if (selectionCount) {
        selectionCount.textContent = `選択数: ${checkboxes.length}/2`;
        selectionCount.style.color = checkboxes.length > 2 ? '#dc3545' : '#fcac04';
    }
}

// 初期イベントUI設定関数（エラー防止）
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
    titleElement.textContent = '参加希望イベントの選択';
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
window.updateSelectedEvents = updateSelectedEvents;
window.setupInitialEventUI = setupInitialEventUI;
window.displayJsonPicker = displayJsonPicker;