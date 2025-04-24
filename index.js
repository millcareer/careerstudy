// イベント情報を取得する関数（ローディング表示なし）
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
        const url = 'https://script.google.com/macros/s/AKfycbxZemROe3jxhKdsvKqUwlLK6lRqrKk4DPTUMn5yyKwK4fp9r-ewqItfautobpWsT7LO2g/exec?from=liff';
        
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
                resolve(data);
            } else {
                console.warn("イベントデータが空か、予期しない形式です。デフォルトデータを使用します。");
                resolve(defaultEvents);
            }
        };
        
        // スクリプトタグを作成
        const scriptTag = document.createElement('script');
        scriptTag.src = `${url}?from=liff&callback=${callbackName}`;
        
        // エラー処理
        scriptTag.onerror = function() {
            // クリーンアップ
            document.body.removeChild(scriptTag);
            delete window[callbackName];
            
            console.error("イベント情報の取得に失敗しました。デフォルトデータを使用します。");
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

// イベント選択UI生成関数 - 新しく追加
function createEventSelectionUI(events) {
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
            updateSelectedEvents();
        });
    });
    
    eventContainer.appendChild(optionsList);
    
    // 選択済みイベントリスト
    const selectedList = document.getElementById('selected-events-list') || document.createElement('div');
    selectedList.id = 'selected-events-list';
    selectedList.className = 'mb-4';
    selectedList.innerHTML = '';
    
    const initialMessage = document.createElement('p');
    initialMessage.style.color = '#666';
    initialMessage.textContent = 'イベントが選択されていません';
    selectedList.appendChild(initialMessage);
    
    eventContainer.appendChild(selectedList);
    
    // 選択イベント更新関数
    window.updateSelectedEvents = function() {
        const checkboxes = document.querySelectorAll('.event-option:checked');
        const selectedList = document.getElementById('selected-events-list');
        const selectionCount = document.getElementById('selection_count');
        
        // 選択リストをクリア
        selectedList.innerHTML = '';
        
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
                    updateSelectedEvents();
                };
                
                eventItem.appendChild(eventTitle);
                eventItem.appendChild(removeBtn);
                selectedList.appendChild(eventItem);
            });
        }
        
        // 選択数表示を更新
        if (selectionCount) {
            selectionCount.textContent = `選択数: ${checkboxes.length}/2`;
            selectionCount.style.color = checkboxes.length > 2 ? '#dc3545' : '#fcac04';
        }
    };
    
    return eventContainer;
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
