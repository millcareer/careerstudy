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
});

// 生年月日選択セットアップ関数
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
            toggleEventSelection(this, event);
        });
        
        optionsList.appendChild(option);
    });
    
    // 日程が合わないオプションを追加
    const noScheduleOption = document.createElement('div');
    noScheduleOption.className = 'event-option no-schedule';
    noScheduleOption.style.padding = '10px';
    noScheduleOption.style.margin = '10px 0 5px';
    noScheduleOption.style.backgroundColor = '#f5f5f5';
    noScheduleOption.style.borderRadius = '4px';
    noScheduleOption.style.cursor = 'pointer';
    noScheduleOption.style.borderTop = '1px solid #ddd';
    
    noScheduleOption.dataset.value = '日程が合わない';
    noScheduleOption.dataset.title = '特になし';
    noScheduleOption.textContent = '日程が合わない';
    
    // クリックイベント
    noScheduleOption.addEventListener('click', function() {
        toggleNoScheduleOption(this);
    });
    
    optionsList.appendChild(noScheduleOption);
    
    // 選択数表示を初期化
    updateSelectionCount();
}

// 日程が合わないの選択を切り替える関数
function toggleNoScheduleOption(element) {
    // 現在の選択状態を確認
    const isSelected = element.classList.contains('selected');
    
    if (isSelected) {
        // 選択を解除
        element.classList.remove('selected');
        element.style.backgroundColor = '#f5f5f5';
        element.style.borderLeft = 'none';
        
        // 「日程が合わない」を選択リストから削除
        window.selectedEvents = window.selectedEvents.filter(e => e.value !== '日程が合わない');
    } else {
        // 選択を追加
        element.classList.add('selected');
        element.style.backgroundColor = '#f0f0f0';
        element.style.borderLeft = '3px solid #fcac04';
        
        // 「日程が合わない」が既に含まれていなければ追加
        if (!window.selectedEvents.some(e => e.value === '日程が合わない')) {
            window.selectedEvents.push({
                value: '日程が合わない',
                title: '特になし'
            });
        }
    }
    
    // 選択状態を更新
    updateSelectedEvents();
    updateSelectionCount();
    updateHiddenFields();
}

// イベント選択を切り替える関数
function toggleEventSelection(element, event) {
    // 現在の選択状態を確認
    const isSelected = element.classList.contains('selected');
    
    if (isSelected) {
        // 選択を解除
        element.classList.remove('selected');
        element.style.backgroundColor = '#f5f5f5';
        element.style.borderLeft = 'none';
        
        // 選択リストから削除
        window.selectedEvents = window.selectedEvents.filter(e => e.value !== event.choice_text);
    } else {
        // 通常のイベント選択数をカウント
        const normalEventCount = window.selectedEvents.filter(e => e.value !== '日程が合わない').length;
        
        // 選択数チェック（「日程が合わない」を除く）
        if (normalEventCount >= 2) {
            alert('通常のイベントは最大2つまで選択できます');
            return;
        }
        
        // 選択を追加
        element.classList.add('selected');
        element.style.backgroundColor = '#f0f0f0';
        element.style.borderLeft = '3px solid #fcac04';
        
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
        item.style.backgroundColor = '#f9f9f9';
        item.style.borderRadius = '4px';
        item.style.borderLeft = '3px solid #fcac04';
        
        const text = document.createElement('span');
        text.textContent = event.value;
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.style.backgroundColor = '#ddd';
        removeBtn.style.color = '#333';
        removeBtn.style.border = 'none';
        removeBtn.style.borderRadius = '4px';
        removeBtn.style.width = '24px';
        removeBtn.style.height = '24px';
        removeBtn.style.lineHeight = '1';
        removeBtn.style.fontSize = '14px';
        removeBtn.style.padding = '0';
        removeBtn.style.cursor = 'pointer';
        
        // 削除ボタンのクリックイベント
        removeBtn.addEventListener('click', function() {
            // 選択を解除
            let optionSelector = '.event-option';
            if (event.value === '日程が合わない') {
                optionSelector += '.no-schedule';
            } else {
                optionSelector += `[data-value="${event.value}"]`;
            }
            
            const optionElement = document.querySelector(optionSelector);
            if (optionElement) {
                optionElement.classList.remove('selected');
                optionElement.style.backgroundColor = '#f5f5f5';
                optionElement.style.borderLeft = 'none';
            }
            
            // リストから削除
            window.selectedEvents = window.selectedEvents.filter((e) => e.value !== event.value);
            
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
    
    // 通常のイベント選択数をカウント
    const normalEventCount = window.selectedEvents.filter(e => e.value !== '日程が合わない').length;
    
    // 「日程が合わない」が選択されているか
    const noScheduleSelected = window.selectedEvents.some(e => e.value === '日程が合わない');
    
    // 選択数を表示
    if (noScheduleSelected) {
        if (normalEventCount > 0) {
            countDisplay.textContent = `選択数: ${normalEventCount}/2 + 日程が合わない`;
        } else {
            countDisplay.textContent = '「日程が合わない」を選択中';
        }
        countDisplay.style.color = '#00cc00';
    } else {
        countDisplay.textContent = `選択数: ${normalEventCount}/2`;
        countDisplay.style.color = normalEventCount === 2 ? '#00cc00' : '#fcac04';
    }
}

// 隠しフィールドを更新する関数
function updateHiddenFields() {
    const choice1Input = document.getElementById('form_answer22');
    const choice2Input = document.getElementById('form_answer23');
    const combinedInput = document.getElementById('form_answer01');
    
    if (!choice1Input || !choice2Input) return;
    
    // 通常のイベントを取得
    const normalEvents = window.selectedEvents.filter(e => e.value !== '日程が合わない');
    
    // 「日程が合わない」が選択されているか
    const noScheduleSelected = window.selectedEvents.some(e => e.value === '日程が合わない');
    
    // 隠しフィールドを更新
    choice1Input.value = normalEvents[0] ? normalEvents[0].value : (noScheduleSelected ? '日程が合わない' : '');
    choice2Input.value = normalEvents[1] ? normalEvents[1].value : (noScheduleSelected ? '日程が合わない' : '');
    
    // 複合フィールドにカンマ区切りで設定
    if (combinedInput) {
        const values = window.selectedEvents.map(event => event.value);
        combinedInput.value = values.join(', ');
    }
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
    // 「日程が合わない」が選択されているか
    const noScheduleSelected = window.selectedEvents.some(e => e.value === '日程が合わない');
    
    // 通常のイベント選択数をカウント
    const normalEventCount = window.selectedEvents.filter(e => e.value !== '日程が合わない').length;
    
    // 日程が合わないが選択されていない場合は、通常のイベントが2つ必要
    if (!noScheduleSelected && normalEventCount !== 2) {
        window.alert('イベントは必ず2つ選択してください。または「日程が合わない」を選択してください。');
        return false;
    }
    
    // 何も選択されていない場合はエラー
    if (window.selectedEvents.length === 0) {
        window.alert('少なくとも1つのイベントか「日程が合わない」を選択してください。');
        return false;
    }
    
    // フォームの値を配列に格納
    let text_list = [];
    const form01 = document.getElementById('form_answer01');
    if (form01) text_list.push(form01.value);
    
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
