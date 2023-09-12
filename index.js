let formInputValues = [];  
let isFormValid = true;    

function collectFormValues() {
    formInputValues = [];  
    for(let i = 1; i <= 19; i++) {
        formInputValues.push(document.getElementById(`form_answer${i.toString().padStart(2, '0')}`).value);
    }
}

function checkFormValidity() {
    isFormValid = formInputValues.every(value => value.trim() !== '');
}

function onSubmit() {
    collectFormValues();
    checkFormValidity();
    
    if (isFormValid) {
        window.sendMessageToLine(formInputValues.join(', ')); 
    } else {
        window.alert("フォームに無効な入力があります。");
    }
}

document.getElementById('submit-button').addEventListener('click', onSubmit);

/**
 * ここから下は生年月日のためのjs
*/

let userBirthdayYear = document.getElementById('form_answer07');
let userBirthdayMonth = document.getElementById('form_answer08');
let userBirthdayDay = document.getElementById('form_answer09');

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

function changeTheDay() {
  userBirthdayDay.innerHTML = '';
  let lastDayOfTheMonth = new Date(userBirthdayYear.value, userBirthdayMonth.value, 0).getDate();
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
