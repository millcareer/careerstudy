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
    
    // マルチセレクトの変更を監視
    const eventMultiSelect = document.getElementById('event_multiple_select');
    if (eventMultiSelect) {
        eventMultiSelect.addEventListener('change', updateSelectedCount);
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
            populateEventSelect(data);
        })
        .catch(error => {
            // ローディングを非表示
            hideLoading();
            console.error("イベント情報の取得に失敗しました:", error);
        });
}

// セレクトボックスにイベント選択肢を設定する関数
function populateEventSelect(events) {
    const selectElement = document.getElementById('event_multiple_select');
    if (!selectElement) {
        console.error("セレクトボックスが見つかりません");
        return;
    }
    
    // 選択肢をクリア
    selectElement.innerHTML = '';
    
    // イベント選択肢を追加
    events.forEach((event, index) => {
        const option = document.createElement('option');
        option.value = event.choice_text;
        option.text = `${event.choice_text} - ${event.title}`;
        option.dataset.date = event.date;
        option.dataset.title = event.title;
        selectElement.appendChild(option);
    });
    
    // 変更イベントを設定
    selectElement.addEventListener('change', updateSelectedCount);
    
    // 初期状態を設定
    updateSelectedCount();
}

// 選択数を更新する関数
function updateSelectedCount() {
    const selectElement = document.getElementById('event_multiple_select');
    const countDisplay = document.getElementById('selection_count');
    const choice1Input = document.getElementById('form_answer20');
    const choice2Input = document.getElementById('form_answer21');
    
    if (!selectElement || !countDisplay || !choice1Input || !choice2Input) return;
    
    // 選択されたオプションを取得
    const selectedOptions = Array.from(selectElement.selectedOptions);
    const selectedCount = selectedOptions.length;
    
    // 選択数を表示
    countDisplay.textContent = `選択数: ${selectedCount}/2`;
    
    // 選択数が2より多い場合は警告色に
    countDisplay.style.color = selectedCount > 2 ? '#ff0000' : '#fcac04';
    
    // 選択された値を隠しフィールドに設定
    choice1Input.value = selectedOptions[0] ? selectedOptions[0].value : '';
    choice2Input.value = selectedOptions[1] ? selectedOptions[1].value : '';
    
    // 選択肢を第一希望と第二希望としてform_answer01にも設定
    const firstInput = document.getElementById('form_answer01');
    if (firstInput) {
        const selectedValues = selectedOptions.map(opt => opt.value);
        firstInput.value = selectedValues.join(', ');
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
    // 選択数をチェック
    const selectElement = document.getElementById('event_multiple_select');
    if (selectElement && selectElement.selectedOptions.length !== 2) {
        window.alert('イベントは必ず2つ選択してください。');
        return false;
    }
    
    // フォームの値を配列に格納
    let text_list = [];
    text_list.push(document.getElementById('form_answer01').value);
    text_list.push(document.getElementById('form_answer20').value);
    text_list.push(document.getElementById('form_answer21').value);
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
