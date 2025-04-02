// DOMが読み込まれたら確実にローディングを非表示にする
document.addEventListener('DOMContentLoaded', function() {
    // 初期状態で確実に非表示にする
    document.getElementById('loading').style.display = 'none';
});

// showLoadingとhideLoading関数
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// onSubmit関数を修正
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
            fetch("https://script.google.com/macros/s/AKfycbwuliim0T6v4mKVUSs7AKbwasGMS6O3tWv-7fyLYvB2SRkaEH7-GYAQ55bslR4O-b13EA/exec", {
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
