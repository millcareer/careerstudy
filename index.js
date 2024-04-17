document.addEventListener('DOMContentLoaded', (event) => {
    let yearSelect = document.getElementById('form_answer07');
    let monthSelect = document.getElementById('form_answer08');
    let daySelect = document.getElementById('form_answer09');

    for(let i = 1900; i <= new Date().getFullYear(); i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = i;
        yearSelect.add(option);
    }

    for(let i = 1; i <= 12; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = i;
        monthSelect.add(option);
    }

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

    yearSelect.addEventListener('change', setDayOptions);
    monthSelect.addEventListener('change', setDayOptions);
    
    setDayOptions();  // Initial call to populate the day select options based on the current year and month
});

function onSubmit() {
    // Your existing onSubmit function here
    let text_list = [];
    text_list.push(document.getElementById('form_answer01').value);
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
     //自己分析CAMPの選択肢を form_answer20とform_answer21 に定義
    text_list.push(document.getElementById('form_answer20').value);
    text_list.push(document.getElementById('form_answer21').value);
    
    
    let msg = "【送信内容】";
    let form_check_flag = 1;
    for (let i = 0; i < text_list.length; i++) {
        if ( text_list[i] == "") {
            form_check_flag = 0;
            window . alert( '入力項目に漏れがあります。全ての項目への入力をお願い致します。' );
            break;
        }
        msg = msg + "\n" + text_list[i];
    }
    if (form_check_flag == 1) {
        // 231008 別のLINE送信関数が存在していたが、元のLINEメッセージ送信で利用する関数に変更
        sendText(msg);
        // sendMessageToLine(msg);
    }
    return false;
}

//スプレッドシートから選択肢を取得し動的にテキストボックスへ追加(2024年4月17日追加)
document.addEventListener('DOMContentLoaded', function() {
  const url = 'https://script.google.com/macros/s/AKfycbw7QpLXfctwu4ZmDNDckXkGWr2VnvsKlCKTF-ikM17hPF-N5mtaHkPmKGWxrGCt2yhZuA/exec';

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const selectDay1 = document.getElementById('form_answer20');
      const selectDay2 = document.getElementById('form_answer21');

      // 最後の選択肢 "日程が合わない..." を一時的に取り除く
      const lastOptionDay1 = selectDay1.lastElementChild;
      const lastOptionDay2 = selectDay2.lastElementChild;
      selectDay1.removeChild(lastOptionDay1);
      selectDay2.removeChild(lastOptionDay2);

      // DAY1の選択肢を追加
      data.day1.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        selectDay1.appendChild(opt);
      });

      // DAY2の選択肢を追加
      data.day2.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        selectDay2.appendChild(opt);
      });

      // "日程が合わない..." を最後に追加
      selectDay1.appendChild(lastOptionDay1);
      selectDay2.appendChild(lastOptionDay2);
    })
    .catch(error => console.error('Error loading the data:', error));
});

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('myForm');
  const errorMessage = document.getElementById('error-message');
  const selectDay1 = document.getElementById('form_answer20');
  const selectDay2 = document.getElementById('form_answer21');

  form.addEventListener('submit', function(event) {
    // デフォルトのフォーム送信を防止
    event.preventDefault();

    // 選択肢のバリデーション
    if (selectDay1.value === "" || selectDay2.value === "") {
      // エラーメッセージを表示
      errorMessage.style.display = 'block';
    } else {
      // エラーメッセージを非表示
      errorMessage.style.display = 'none';
      // フォーム送信など、次のステップを実行
      console.log("フォームが正常に送信されました");
      // form.submit(); // 実際にフォームを送信する場合はこれをアンコメント
    }
  });
});
