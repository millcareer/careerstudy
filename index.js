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

    for(let i = 1; i <= 31; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = i;
        daySelect.add(option);
    }
});


let formInputValues = [];  // 名前を変更して、何を格納しているかを明確に示します。
let isFormValid = true;    // 名前を変更して、目的をより明確に示します。

function collectFormValues() {
    formInputValues = [];  // 関数が呼ばれるたびに配列をリセットします。
    for(let i = 1; i <= 19; i++) {
        formInputValues.push(document.getElementById(`form_answer${i.toString().padStart(2, '0')}`).value);
    }
}

function checkFormValidity() {
    // ここでフォームの検証を行います。
    // 例: 空の入力値がある場合、isFormValidをfalseに設定します。
    isFormValid = formInputValues.every(value => value.trim() !== '');
}

function onSubmit() {
    collectFormValues();
    checkFormValidity();
    
    if (isFormValid) {
        window.sendMessageToLine(formInputValues.join(', ')); // formInputValuesをカンマで結合して送信します
    } else {
        window.alert("フォームに無効な入力があります。");
    }
}

document.getElementById('submit-button').addEventListener('click', onSubmit);

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
