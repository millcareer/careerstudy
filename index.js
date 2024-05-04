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

document.addEventListener('DOMContentLoaded', function() {
    const url = 'https://script.google.com/macros/s/AKfycbwoW8CcTQyku4UgnmBk56lJTOD2gM8200KyzYPBD1yqva0y7_MKJvX0AtY1kLMSKEvx-A/exec';

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const radioGroupDay1 = document.getElementById('radio_group_day1');
        const radioGroupDay2 = document.getElementById('radio_group_day2');

        // 既存の「日程が合わない...」ラジオボタンを取得
        const existingOptionDay1 = radioGroupDay1.querySelector('label');
        const existingOptionDay2 = radioGroupDay2.querySelector('label');

        // 既存のラジオボタンを一時的に除去
        radioGroupDay1.removeChild(existingOptionDay1);
        radioGroupDay2.removeChild(existingOptionDay2);

        // DAY1の選択肢を追加
        data.day1.forEach((option, index) => {
            const container = document.createElement('div');
            container.className = 'radio-container';
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'day1';
            radio.value = option;

            // 「※満員」が含まれている選択肢を無効化
            if (option.includes('※満員')) {
                radio.disabled = true;
                label.style.color = 'grey';
            }

            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));
            container.appendChild(label);
            radioGroupDay1.appendChild(container);
        });

        // 最後に「日程が合わない...」を追加
        radioGroupDay1.appendChild(existingOptionDay1);

        // DAY2の選択肢を追加
        data.day2.forEach((option, index) => {
            const container = document.createElement('div');
            container.className = 'radio-container';
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'day2';
            radio.value = option;

            // 「※満員」が含まれている選択肢を無効化
            if (option.includes('※満員')) {
                radio.disabled = true;
                label.style.color = 'grey';
            }

            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));
            container.appendChild(label);
            radioGroupDay2.appendChild(container);
        });

        // 最後に「日程が合わない...」を追加
        radioGroupDay2.appendChild(existingOptionDay2);
    })
    .catch(error => console.error('Error loading the data:', error));
});
