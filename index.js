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
    setupBirthdaySelects();
    
    // 日程が合わないボタンのイベントリスナー設定
    setupNoScheduleButton();
});

// 日程が合わないボタンの設定
function setupNoScheduleButton() {
    const noScheduleButton = document.getElementById('no-schedule-button');
    if (noScheduleButton) {
        noScheduleButton.addEventListener('click', function() {
            toggleNoSchedule();
        });
    }
}

// 日程が合わないの切り替え
function toggleNoSchedule() {
    const noScheduleButton = document.getElementById('no-schedule-button');
    if (!noScheduleButton) return;
    
    // 日程が合わないモードかどうか
    const isNoSchedule = noScheduleButton.classList.contains('active');
    
    if (isNoSchedule) {
        // 日程が合わないモードを解除
        noScheduleButton.classList.remove('active');
        noScheduleButton.style.backgroundColor = '#f0f0f0';
        noScheduleButton.style.color = '#000';
        
        // イベント選択を有効にする
        enableEventSelection();
        
        // 「日程が合わない」を選択リストから削除
        window.selectedEvents = window.selectedEvents.filter(event => event.value !== '日程が合わない');
    } else {
        // 日程が合わないモードを有効にする
        noScheduleButton.classList.add('active');
        noScheduleButton.style.backgroundColor = '#007bff';
        noScheduleButton.style.color = '#fff';
        
        // すべての選択をクリア
        clearAllEventSelections();
        
        // イベント選択を無効にする
        disableEventSelection();
        
        // 「日程が合わない」を選択リストに追加
        window.selectedEvents = [{
            value: '日程が合わない',
            title: '特になし'
        }];
    }
    
    // 選択状態を更新
    updateSelectedEvents();
    updateSelectionCount();
    updateHiddenFields();
}

// イベント選択を無効にする
function disableEventSelection() {
    const options = document.querySelectorAll('.event-option');
    options.forEach(option => {
        option.style.opacity = '0.5';
        option.style.pointerEvents = 'none';
    });
}

// イベント選択を有効にする
function enableEventSelection() {
    const options = document.querySelectorAll('.event-option');
    options.forEach(option => {
        option.style.opacity = '1';
        option.style.pointerEvents = 'auto';
    });
}

// すべての選択をクリア
function clearAllEventSelections() {
    const selectedOptions = document.querySelectorAll('.event-option.selected');
    selectedOptions.forEach(option => {
        option.classList.remove('selected');
        option.style.backgroundColor = '#f5f5f5';
        option.style.color = '#000';
    });
    
    window.selectedEvents = [];
}

// 生年月日選択セットアップ
function setupBirthdaySelects() {
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
}

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
            
            // イベント選択UIを作成
            createEventSelectionUI(data);
        })
        .catch(error => {
            // ローディングを非表示
            hideLoading();
            console.error("イベント情報の取得に失敗しました:", error);
        });
}

// イベント選択UIを作成する関数
function createEventSelectionUI(events) {
    // 選択肢リストを取得
    const optionsList = document.getElementById('event-options-list');
    if (!optionsList) return;
    
    // 選択したイベントを追跡する配列
    window.selectedEvents = [];
    
    // イベントの選択肢を表示
    events.forEach((event, index) => {
        const option = document.createElement('div');
        option.className = 'event-option';
        option.style.padding = '10px';
        option.style.margin = '5px 0';
        option.style.backgroundColor = '#f5f5f5';
        option.style.borderRadius = '4px';
        option.style.cursor = 'pointer';
        
        option.dataset.value = event.choice_text;
        option.dataset.title = event.title;
        option.textContent = `${event.choice_text} - ${event.title}`;
        
        // クリックイベント
        option.addEventListener('click', function() {
            // 日程が合わないモードなら何もしない
            const noScheduleButton = document.getElementById('no-schedule-button');
            if (noScheduleButton && noScheduleButton.classList.contains('active')) return;
            
            toggleEventSelection(this, event);
        });
        
        optionsList.appendChild(option);
    });
    
    // 選択数表示を初期化
    updateSelectionCount();
}

// イベント選択を切り替える関数
function toggleEventSelection(element, event) {
    // 現在の選択状態を確認
    const isSelected = element.classList.contains('selected');
    
    if (isSelected) {
        // 選択を解除
        element.classList.remove('selected');
        element.style.backgroundColor = '#f5f5f5';
        element.style.color = '#000';
        
        // 選択リストから削除
        window.selectedEvents = window.selectedEvents.filter(e => e.value !== event.choice_text);
    } else {
        // 選択数チェック
        if (window.selectedEvents.length >= 2) {
            alert('イベントは最大2つまで選択できます');
            return;
        }
        
        // 選択を追加
        element.classList.add('selected');
        element.style.backgroundColor = '#007bff';
        element.style.color = '#fff';
        
        // 選択リストに追加
        window.selectedEvents.push({
            value: event.choice_text,
            title: event.title
        });
    }
    
    // 選択状態を更新
    updateSelectedEvents();
    updateSelectionCount();
    updateHiddenFields();
}

// 選択したイベントを表示する関数
function updateSelectedEvents() {
    const selectedList = document.getElementById('selected-events-list');
    if (!selectedList) return;
    
    // リストをクリア
    selectedList.innerHTML = '';
    
    // 選択がなければメッセージを表示
    if (window.selectedEvents.length === 0) {
        const message = document.createElement('p');
        message.style.color = '#666';
        message.textContent = 'イベントが選択されていません';
        selectedList.appendChild(message);
        return;
    }
    
    // 選択済みイベントを表示
    window.selectedEvents.forEach((event, index) => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.padding = '8px';
        item.style.marginBottom = '5px';
        item.style.backgroundColor = '#e6f2ff';
        item.style.borderRadius = '4px';
        
        const text = document.createElement('span');
        text.textContent = `${index + 1}. ${event.value}`;
        
        // 「日程が合わない」の場合は削除ボタンを表示しない
        if (event.value === '日程が合わない') {
            item.appendChild(text);
            selectedList.appendChild(item);
            return;
        }
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '削除';
        removeBtn.style.backgroundColor = '#ff6b6b';
        removeBtn.style.color = 'white';
        removeBtn.style.border = 'none';
        removeBtn.style.borderRadius = '4px';
        removeBtn.style.padding = '3px 8px';
        removeBtn.style.cursor = 'pointer';
        
        // 削除ボタンのクリックイベント
        removeBtn.addEventListener('click', function() {
            // 選択を解除
            const optionElement = document.querySelector(`.event-option[data-value="${event.value}"]`);
            if (optionElement) {
                optionElement.classList.remove('selected');
                optionElement.style.backgroundColor = '#f5f5f5';
                optionElement.style.color = '#000';
            }
            
            // リストから削除
            window.selectedEvents = window.selectedEvents.filter((_, i) => i !== index);
            
            // 表示を更新
            updateSelectedEvents();
            updateSelectionCount();
            updateHiddenFields();
        });
        
        item.appendChild(text);
        item.appendChild(removeBtn);
        selectedList.appendChild(item);
    });
}

// 選択数を更新する関数
function updateSelectionCount() {
    const countDisplay = document.getElementById('selection_count');
    if (!countDisplay) return;
    
    // 日程が合わないモードかどうか
    const noScheduleButton = document.getElementById('no-schedule-button');
    const isNoSchedule = noScheduleButton && noScheduleButton.classList.contains('active');
    
    if (isNoSchedule) {
        countDisplay.textContent = '日程が合わないを選択中';
        countDisplay.style.color = '#00cc00';
        return;
    }
    
    // 選択数を表示
    const count = window.selectedEvents.length;
    countDisplay.textContent = `選択数: ${count}/2`;
    
    // 選択数に応じて色を変更
    countDisplay.style.color = count === 2 ? '#00cc00' : '#fcac04';
}

// 隠しフィールドを更新する関数
function updateHiddenFields() {
    const choice1Input = document.getElementById('form_answer22');
    const choice2Input = document.getElementById('form_answer23');
    
    if (!choice1Input || !choice2Input) return;
    
    // 日程が合わないモードの場合
    if (window.selectedEvents.length === 1 && window.selectedEvents[0].value === '日程が合わない') {
        choice1Input.value = '日程が合わない';
        choice2Input.value = '日程が合わない';
        return;
    }
    
    // 通常の選択の場合
    choice1Input.value = window.selectedEvents[0] ? window.selectedEvents[0].value : '';
    choice2Input.value = window.selectedEvents[1] ? window.selectedEvents[1].value : '';
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
    // 日程が合わないモードかどうか
    const noScheduleButton = document.getElementById('no-schedule-button');
    const isNoSchedule = noScheduleButton && noScheduleButton.classList.contains('active');
    
    // 日程が合わないモードでなければ選択数をチェック
    if (!isNoSchedule && window.selectedEvents.length !== 2) {
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
