function onSubmit(){
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
        sendText(msg);
    }
    return false;
}

/**
 * ここから下は生年月日のためのjs
*/

let userBirthdayYear = document.querySelector('.birthday-year');
let userBirthdayMonth = document.querySelector('.birthday-month');
let userBirthdayDay = document.querySelector('.birthday-day');

/**
 * selectのoptionタグを生成するための関数
 * @param {Element} elem 変更したいselectの要素
 * @param {Number} val 表示される文字と値の数値
 */
function createOptionForElements(elem, val) {
  let option = document.createElement('option');
  option.text = val;
  option.value = val;
  elem.appendChild(option);
}

//年の生成
for(let i = 1990; i <= 2020; i++) {
  createOptionForElements(userBirthdayYear, i);
}
//月の生成
for(let i = 1; i <= 12; i++) {
  createOptionForElements(userBirthdayMonth, i);
}
//日の生成
for(let i = 1; i <= 31; i++) {
  createOptionForElements(userBirthdayDay, i);
}

/**
 * 日付を変更する関数
 */
function changeTheDay() {
  //日付の要素を削除
  userBirthdayDay.innerHTML = '';

  //選択された年月の最終日を計算
  let lastDayOfTheMonth = new Date(userBirthdayYear.value, userBirthdayMonth.value, 0).getDate();

  //選択された年月の日付を生成
  for(let i = 1; i <= lastDayOfTheMonth; i++) {
    createOptionForElements(userBirthdayDay, i);
  }
}

userBirthdayYear.addEventListener('change', function() {
  changeTheDay();
});

userBirthdayMonth.addEventListener('change', function() {
  changeTheDay();
});
