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

    // イベント情報を取得
    fetch("https://script.google.com/macros/s/AKfycbzIzUxkl_eqvUHRjkUA5iKet4pPVx3VdsUD2MHV5UJSHGemP6d9FMd8mUp3D2TzqElsqQ/exec?from=liff", {
        method: "GET",
        mode: "cors", // CORSモードを指定
        headers: {
            "Accept": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('ネットワークレスポンスが正常ではありません');
        }
        return response.json();
    })
    .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
            // イベント選択UIを作成
            createEventSelectionUI(data);
        } else {
            console.warn("イベントデータが空か、予期しない形式です。デフォルトデータを使用します。");
            createEventSelectionUI(defaultEvents);
        }
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
        }
    });
}

// 初期イベントUI設定関数（エラー対策）
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
