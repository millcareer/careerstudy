// DOMが読み込まれたら実行される関数
document.addEventListener('DOMContentLoaded', (event) => {
    // ローディングを確実に非表示にする
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    // イベント情報を取得して選択肢に設定
    fetchUpcomingEvents();
    
    // 生年月日の選択肢を作成
    let yearSelect = document.getElementById('form_answer07');
    let monthSelect = document.getElementById('form_answer08');
    let daySelect = document.getElementById('form_answer09');

    if (yearSelect && monthSelect && daySelect) {
        // 年の選択肢を生成
        for(let i = 1900; i <= new Date().getFullYear(); i++) {
            let option = document.createElement('option');
            option.value = i;
            option.text = i;
            yearSelect.add(option);
        }

        // 月の選択肢を生成
        for(let i = 1; i <= 12; i++) {
            let option = document.createElement('option');
            option.value = i;
            option.text = i;
            monthSelect.add(option);
        }

        // 日数を設定する関数
        function setDayOptions() {
            daySelect.innerHTML = '';
            let year = yearSelect.value;
            let month = monthSelect.value;
            let lastDay = new Date(year, month, 0).getDate();
            for(let i = 1; i <= lastDay; i++) {
                let option = document.createElement('option');
                option.value = i;
                option.text = i;
                daySelect.add(option);
            }
        }

        // イベントリスナーを設定
        yearSelect.addEventListener('change', setDayOptions);
        monthSelect.addEventListener('change', setDayOptions);

        // 初期設定
        setDayOptions();
    }
});

// イベント情報を取得する関数
function fetchUpcomingEvents() {
    // ローディングを表示
    showLoading();
    
    // イベント情報を取得
    fetch("https://script.google.com/macros/s/AKfycbzIzUxkl_eqvUHRjkUA5iKet4pPVx3VdsUD2MHV5UJSHGemP6d9FMd8mUp3D2TzqElsoQ/exec?from=liff")
        .then(response => response.json())
        .then(data => {
            // ローディングを非表示
            hideLoading();
            
            // セレクトボックスに選択肢を設定
            createDatePickerUI(data);
        })
        .catch(error => {
            // ローディングを非表示
            hideLoading();
            console.error("イベント情報の取得に失敗しました:", error);
        });
}

// ドラムロールタイムピッカーUIを作成する関数
function createDatePickerUI(events) {
    // ドラムロール要素を取得
    const drumRoll = document.getElementById('event-drum-roll');
    if (!drumRoll) {
        console.error("ドラムロール要素が見つかりません");
        return;
    }
    
    // 既存のselect要素を非表示
    const originalSelect = document.getElementById('event_multiple_select');
    if (originalSelect) {
        originalSelect.style.display = 'none';
    }
    
    // イベントを日付でグループ化
    const eventsByDate = groupEventsByDate(events);
    
    // イベントリスト作成
    for (const date in eventsByDate) {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-option';
        eventItem.dataset.date = date;
        eventItem.dataset.title = eventsByDate[date].title;
        eventItem.dataset.value = eventsByDate[date].choice_text;
        eventItem.textContent = `${eventsByDate[date].choice_text} - ${eventsByDate[date].title}`;
        
        // クリックイベント
        eventItem.addEventListener('click', function() {
            selectEvent(this);
        });
        
        drumRoll.appendChild(eventItem);
    }
    
    // 選択ボタンのイベントリスナーを設定
    const addButton = document.getElementById('add-event-button');
    if (addButton) {
        addButton.addEventListener('click', function() {
            addSelectedEvent();
        });
    }
    
    // 隠しフィールドを確認
    const choice1Input = document.getElementById('form_answer22');
    const choice2Input = document.getElementById('form_answer23');
    
    if (!choice1Input || !choice2Input) {
        console.error("隠しフィールドが見つかりません");
        return;
    }
    
    // スタイルを追加
    addDatePickerStyles();
    
    // 選択中のイベントを追跡するための変数
    window.selectedEvents = [];
    window.currentSelectedEvent = null;
}

// イベントを日付でグループ化する関数
function groupEventsByDate(events) {
    const grouped = {};
    
    events.forEach(event => {
        const dateKey = event.date;
        grouped[dateKey] = event;
    });
    
    return grouped;
}

// 選択中のイベントを設定する関数
function selectEvent(eventElement) {
    // 現在選択されているイベントの選択を解除
    const currentActive = document.querySelector('.event-option.active');
    if (currentActive) {
        currentActive.classList.remove('active');
    }
    
    // 新しいイベントを選択
    eventElement.classList.add('active');
    
    // 現在選択中のイベントを設定
    window.currentSelectedEvent = {
        date: eventElement.dataset.date,
        title: eventElement.dataset.title,
        value: eventElement.dataset.value,
        text: eventElement.textContent
    };
}

// 選択中のイベントを追加する関数
function addSelectedEvent() {
    // 選択中のイベントがなければ何もしない
    if (!window.currentSelectedEvent) {
        alert('イベントを選択してください');
        return;
    }
    
    // 既に選択済みかチェック
    const isAlreadySelected = window.selectedEvents.some(
        event => event.date === window.currentSelectedEvent.date
    );
    
    if (isAlreadySelected) {
        alert('このイベントは既に選択されています');
        return;
    }
    
    // 選択数が2つを超える場合
    if (window.selectedEvents.length >= 2) {
        alert('イベントは最大2つまで選択できます');
        return;
    }
    
    // 選択したイベントを追加
    window.selectedEvents.push(window.currentSelectedEvent);
    
    // 選択リストを更新
    updateSelectedEventsList();
    
    // 隠しフィールドを更新
    updateHiddenFields();
}

// 選択済みイベントリストを更新する関数
function updateSelectedEventsList() {
    const selectedList = document.getElementById('selected-events-list');
    if (!selectedList) return;
    
    // リストをクリア
    selectedList.innerHTML = '';
    
    // 選択済みイベントを表示
    window.selectedEvents.forEach((event, index) => {
        const eventItem = document.createElement('div');
        eventItem.className = 'selected-event-item';
        
        const eventText = document.createElement('span');
        eventText.textContent = event.text;
        eventItem.appendChild(eventText);
        
        // 削除ボタン
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'remove-event-button';
        removeButton.textContent = '削除';
        removeButton.dataset.index = index;
        removeButton.addEventListener('click', function() {
            removeSelectedEvent(parseInt(this.dataset.index));
        });
        
        eventItem.appendChild(removeButton);
        selectedList.appendChild(eventItem);
    });
    
    // 選択数を表示
    const countDisplay = document.getElementById('selection_count');
    if (countDisplay) {
        countDisplay.textContent = `選択数: ${window.selectedEvents.length}/2`;
        countDisplay.style.color = window.selectedEvents.length === 2 ? '#00cc00' : '#fcac04';
    }
}

// 選択済みイベントを削除する関数
function removeSelectedEvent(index) {
    if (index >= 0 && index < window.selectedEvents.length) {
        // 指定されたインデックスのイベントを削除
        window.selectedEvents.splice(index, 1);
        
        // 選択リストを更新
        updateSelectedEventsList();
        
        // 隠しフィールドを更新
        updateHiddenFields();
    }
}

// 隠しフィールドを更新する関数
function updateHiddenFields() {
    const choice1Input = document.getElementById('form_answer22');
    const choice2Input = document.getElementById('form_answer23');
    const firstInput = document.getElementById('form_answer01');
    
    if (!choice1Input || !choice2Input) return;
    
    // 第一希望と第二希望を設定
    choice1Input.value = window.selectedEvents[0] ? window.selectedEvents[0].value : '';
    choice2Input.value = window.selectedEvents[1] ? window.selectedEvents[1].value : '';
    
    // form_answer01にも設定（互換性のため）
    if (firstInput) {
        const selectedValues = window.selectedEvents.map(event => event.value);
        firstInput.value = selectedValues.join(', ');
    }
}

// スタイルを追加する関数
function addDatePickerStyles() {
    // 既存のスタイル要素を探す
    let styleElem = document.getElementById('date-picker-styles');
    
    // なければ作成
    if (!styleElem) {
        styleElem = document.createElement('style');
        styleElem.id = 'date-picker-styles';
        document.head.appendChild(styleElem);
    }
    
    // スタイルを設定
    styleElem.textContent = `
        .date-picker-container {
            margin: 20px 0;
            padding: 15px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .selected-events {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 6px;
        }
        
        .selected-heading {
            margin-top: 0;
            color: #333;
            font-weight: bold;
        }
        
        .selected-events-list {
            min-height: 60px;
        }
        
        .selected-event-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding: 8px 12px;
            background-color: #fff;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .remove-event-button {
            background-color: #ff6b6b;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 12px;
        }
        
        .event-picker {
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 6px;
        }
        
        .drum-roll {
            max-height: 200px;
            overflow-y: auto;
            margin: 10px 0;
            padding: 5px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .event-option {
            padding: 12px;
            margin: 5px 0;
            background-color: #f0f0f0;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .event-option:hover {
            background-color: #e0e0e0;
        }
        
        .event-option.active {
            background-color: #007bff;
            color: white;
            font-weight: bold;
        }
        
        .add-event-button {
            display: block;
            width: 100%;
            padding: 10px;
            margin-top: 10px;
            background-color: #fcac04;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.2s;
        }
        
        .add-event-button:hover {
            background-color: #e69500;
        }
    `;
}

// ローディングインジケーターの表示・非表示を制御する関数
function showLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
}

function hideLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// フォーム送信関数
function onSubmit() {
    // 選択数をチェック
    if (window.selectedEvents.length !== 2) {
        window.alert('イベントは必ず2つ選択してください。');
        return false;
    }
    
    // フォームの値を配列に格納
    let text_list = [];
    text_list.push(document.getElementById('form_answer01').value);
    text_list.push(document.getElementById('form_answer20').value);
    text_list.push(document.getElementById('form_answer02').value);
    text_list.push(document.getElementById('form_answer03').value);
    text_list.push(document.getElementById('form_answer04').value);
    text_list.push(document.getElementById('form_answer05').value);
    text_list.push(document.getElementById('form_answer06').value);
    text_list.push(document.getElementById('form_answer07').value);
    text_list.push(document.getElementById('form_answer08').value);
    text_list.push(document.getElementById('form_answer09').value);
    text_list.push(document.getElementById('form_answer10').value);
    text_list.push(document.getElementById('form_answer11').value);
    text_list.push(document.getElementById('form_answer12').value);
    text_list.push(document.getElementById('form_answer13').value);
    text_list.push(document.getElementById('form_answer14').value);
    text_list.push(document.getElementById('form_answer15').value);
    text_list.push(document.getElementById('form_answer16').value);
    text_list.push(document.getElementById('form_answer17').value);
    text_list.push(document.getElementById('form_answer18').value);
    text_list.push(document.getElementById('form_answer19').value);
    text_list.push(document.getElementById('form_answer22').value);
    text_list.push(document.getElementById('form_answer23').value);
    
    // 入力チェック
    let msg = "【送信内容】";
    let form_check_flag = 1;
    for (let i = 0; i < text_list.length; i++) {
        if (text_list[i] == "") {
            form_check_flag = 0;
            window.alert('入力項目に漏れがあります。全ての項目への入力をお願い致します。');
            break;
        }
        msg = msg + "\n" + text_list[i];
    }

    if (form_check_flag == 1) {
        // 送信中の表示を開始
        showLoading();

        // LINEプロフィールを取得
        liff.getProfile().then(profile => {
            const payload = {
                userId: profile.userId,
                displayName: profile.displayName,
                answers: text_list,
                rawMessage: msg
            };

            // データ送信を実行
            fetch("https://script.google.com/macros/s/AKfycby0JVVEv0J8bxgNdx02KJMc_cNJCb9sABPstTeQ-1bOhs5kiDSFhqlDYSro9fVFz1LJnw/exec", {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }).then(() => {
                // データ送信完了後、LINEメッセージを送信
                return liff.sendMessages([
                    {
                        type: "text",
                        text: msg
                    }
                ]);
            }).then(() => {
                // メッセージ送信完了後、LIFFを閉じる
                hideLoading();
                liff.closeWindow();
            }).catch((err) => {
                hideLoading();
                alert("送信に失敗しました。" + err);
            });
        }).catch(err => {
            hideLoading();
            alert("LINEプロフィールの取得に失敗しました。" + err);
        });
    }
    return false;
}

// LINEメッセージ送信関数
function sendText(text) {
    liff.sendMessages([
        {
            type: "text",
            text: text
        }
    ]).then(() => {
        liff.closeWindow(); // メッセージ送信後にLIFFを閉じる
    }).catch((err) => {
        console.error("送信失敗", err);
    });
}
