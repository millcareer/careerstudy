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
    //自己分析CAMPの選択肢を form_answer19とform_answer20 に　同意のチェックボックスを form_answer21に定義
    text_list.push(document.getElementById('form_answer19').value);
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
  const url = 'http://localhost:3000/api'; // ローカルのプロキシサーバーを指定


  fetch(url)
    .then(response => response.json())
    .then(data => {
      const selectDay1 = document.getElementById('form_answer19');
      const selectDay2 = document.getElementById('form_answer20');

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
    })
    .catch(error => console.error('Error loading the data:', error));
});

