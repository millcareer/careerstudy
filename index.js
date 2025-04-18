// DOMが読み込まれたら実行される関数
document.addEventListener('DOMContentLoaded', (event) => {
    // ローディングを確実に非表示にする
    document.getElementById('loading').style.display = 'none';
    
    // イベント情報を取得して表示
    fetchUpcomingEvents();
    
    // 生年月日の選択肢を作成する元の処理を維持
    let yearSelect = document.getElementById('form_answer07');
    let monthSelect = document.getElementById('form_answer08');
    let daySelect = document.getElementById('form_answer09');

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
            
            // イベント情報を表示
            displayEvents(data);
            
            // MultiSelectの選択肢として設定
            setEventChoices(data);
        })
        .catch(error => {
            // ローディングを非表示
            hideLoading();
            console.error("イベント情報の取得に失敗しました:", error);
        });
}

// イベント情報を表示する関数
function displayEvents(events) {
    // イベント情報を表示する要素
    let eventsContainer = document.getElementById('upcoming-events');
    
    // 要素がなければ作成
    if (!eventsContainer) {
        eventsContainer = document.createElement('div');
        eventsContainer.id = 'upcoming-events';
        eventsContainer.className = 'events-container';
        
        // フォームの前に挿入
        const form = document.querySelector('form');
        form.parentNode.insertBefore(eventsContainer, form);
    }
    
    // 内容をクリア
    eventsContainer.innerHTML = '';
    
    // 見出しを追加
    const heading = document.createElement('h3');
    heading.textContent = '今後のイベント';
    eventsContainer.appendChild(heading);
    
    // イベントがなければメッセージを表示
    if (events.length === 0) {
        const noEvents = document.createElement('p');
        noEvents.textContent = '現在予定されているイベントはありません。';
        eventsContainer.appendChild(noEvents);
        return;
    }
    
    // イベント一覧を表示
    const eventList = document.createElement('ul');
    eventList.className = 'event-list';
    
    events.forEach(event => {
        const eventItem = document.createElement('li');
        eventItem.className = 'event-item';
        
        const eventTitle = document.createElement('div');
        eventTitle.className = 'event-title';
        eventTitle.textContent = event.title;
        
        const eventDate = document.createElement('div');
        eventDate.className = 'event-date';
        eventDate.textContent = event.choice_text;
        
        const eventContents = document.createElement('div');
        eventContents.className = 'event-contents';
        eventContents.textContent = event.contents;
        
        eventItem.appendChild(eventTitle);
        eventItem.appendChild(eventDate);
        eventItem.appendChild(eventContents);
        
        eventList.appendChild(eventItem);
    });
    
    eventsContainer.appendChild(eventList);
    
    // スタイルを追加
    const style = document.createElement('style');
    style.textContent = `
        .events-container {
            margin: 20px 0;
            padding: 15px;
            background-color: #f5f5f5;
            border-radius: 8px;
        }
        .events-container h3 {
            margin-top: 0;
            color: #333;
        }
        .event-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .event-item {
            margin-bottom: 15px;
            padding: 10px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .event-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 5px;
        }
        .event-date {
            color: #007bff;
            margin-bottom: 5px;
        }
        .event-contents {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }
        .checkbox-group {
            margin-top: 20px;
        }
        .checkbox-group label {
            display: block;
            margin-bottom: 8px;
            padding: 8px;
            background-color: #f9f9f9;
            border-radius: 4px;
            cursor: pointer;
        }
        .checkbox-group label:hover {
            background-color: #e9e9e9;
        }
        .checkbox-group input[type="checkbox"] {
            margin-right: 8px;
        }
    `;
    document.head.appendChild(style);
}

// イベントの選択肢をMultiSelectとして設定する関数
function setEventChoices(events) {
    // MultiSelect用の要素を取得または作成
    let eventSelectContainer = document.getElementById('event-select-container');
    
    // 要素がなければ作成
    if (!eventSelectContainer) {
        eventSelectContainer = document.createElement('div');
        eventSelectContainer.id = 'event-select-container';
        eventSelectContainer.className = 'checkbox-group';
        
        // 見出し
        const heading = document.createElement('h4');
        heading.textContent = '参加希望のイベントを選択してください';
        eventSelectContainer.appendChild(heading);
        
        // form_answer01の前に挿入（適宜調整してください）
        const targetInput = document.getElementById('form_answer01');
        const parentElement = targetInput.parentElement;
        parentElement.insertBefore(eventSelectContainer, targetInput.parentElement.firstChild);
    }
    
    // コンテナの内容をクリア（見出しを残す）
    while (eventSelectContainer.childNodes.length > 1) {
        eventSelectContainer.removeChild(eventSelectContainer.lastChild);
    }
    
    // 隠しフィールドを作成（選択したイベントを保存するため）
    const hiddenInput = document.getElementById('selected_events') || document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.id = 'selected_events';
    hiddenInput.name = 'selected_events';
    eventSelectContainer.appendChild(hiddenInput);
    
    // 各イベントのチェックボックスを作成
    events.forEach((event, index) => {
        const label = document.createElement('label');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = event.choice_text;
        checkbox.id = `event_${index}`;
        checkbox.dataset.date = event.date;
        checkbox.dataset.title = event.title;
        
        // チェックボックスの変更イベント
        checkbox.addEventListener('change', updateSelectedEvents);
        
        const labelText = document.createTextNode(`${event.choice_text} - ${event.title} (${event.contents})`);
        
        label.appendChild(checkbox);
        label.appendChild(labelText);
        
        eventSelectContainer.appendChild(label);
    });
    
    // スタイルを更新
    updateFormLayout();
}

// 選択されたイベントを更新する関数
function updateSelectedEvents() {
    const checkboxes = document.querySelectorAll('#event-select-container input[type="checkbox"]');
    const hiddenInput = document.getElementById('selected_events');
    
    const selectedEvents = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    hiddenInput.value = selectedEvents.join(', ');
    
    // 最初のフォーム要素に選択したイベントを設定（フォーム送信に含める）
    // form_answer01に設定する場合（適宜調整してください）
    if (selectedEvents.length > 0) {
        document.getElementById('form_answer01').value = selectedEvents.join(', ');
    } else {
        document.getElementById('form_answer01').value = '';
    }
}

// フォームのレイアウトを調整する関数
function updateFormLayout() {
    // form_answer01のラベルを更新（非表示または調整）
    const firstInputLabel = document.querySelector('label[for="form_answer01"]');
    if (firstInputLabel) {
        firstInputLabel.textContent = '選択したイベント'; // または非表示にする
    }
}

// ローディングインジケーターの表示・非表示を制御する関数
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// フォーム送信関数
function onSubmit() {
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
    text_list.push(document.getElementById('form_answer20').value);
    text_list.push(document.getElementById('form_answer21').value);

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
            fetch("https://script.google.com/macros/s/AKfycbzIzUxkl_eqvUHRjkUA5iKet4pPVx3VdsUD2MHV5UJSHGemP6d9FMd8mUp3D2TzqElsoQ/exec?from=liff", {
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
