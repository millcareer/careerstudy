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

/**
document.addEventListener('DOMContentLoaded', function() {
    const url = 'https://script.google.com/macros/s/AKfycbze0vBfKEmpZq8vKtnrRtl8U1DWNgjQeQM8fwhhVYUTHqdy4ALG74x8eumT622MD5X7bQ/exec'; // 日程取得用のウェブアプリURL

   const radioGroup = document.getElementById('radio_group'); // ラジオグループのDIV

    // ラジオボタンの選択変更時にIDを動的に割り当てる関数
    function handleRadioChange(event) {
        const selectedRadio = event.target;

        // 他のラジオボタンからIDを削除
        radioGroup.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.removeAttribute('id');
        });

        // 選択されたラジオボタンにIDを設定
        selectedRadio.id = `form_answer20`; // IDを form_answer20 に設定
    }

    fetch(url)
    .then(response => response.json())
    .then(data => {
        // ラジオボタンのグループをクリア
        radioGroup.innerHTML = '';

        // 一意に日程を取得して追加
        data.forEach((option, index) => {
            const container = document.createElement('div');
            container.className = 'radio-container';
            container.style.marginBottom = '10px';
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'day';
            radio.value = option;
            radio.addEventListener('change', handleRadioChange);

            // 「※満員」が含まれている選択肢を無効化
            if (option.includes('※満員')) {
                radio.disabled = true;
                label.style.color = 'grey';
            }

            label.style.display = 'block';
            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));
            container.appendChild(label);
            radioGroup.appendChild(container);
        });

        // 最後に「日程が合わない...」を追加
        const noOptionLabel = document.createElement('label');
        noOptionLabel.style.display = 'block';
        noOptionLabel.style.marginBottom = '10px';
        const noOptionRadio = document.createElement('input');
        noOptionRadio.type = 'radio';
        noOptionRadio.name = 'day';
        noOptionRadio.value = '日程が合わない…';
        noOptionRadio.id = 'form_answer20'; // こちらにも ID を設定
        noOptionRadio.addEventListener('change', handleRadioChange);

        // テキストの冒頭にノンブレーキングスペース（&nbsp;）を追加
        noOptionLabel.appendChild(noOptionRadio);
        noOptionLabel.innerHTML += '&nbsp;&nbsp;日程が合わない…'; // 先頭にノンブレーキングスペースを追加
        radioGroup.appendChild(noOptionLabel);
    })
    .catch(error => console.error('Error loading the data:', error));
});
*/
