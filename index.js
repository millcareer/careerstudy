// script.js
// 必要要素:
//   - form_answer01 (メール), form_answer20 (パスワード), form_answer21 (確認用パスワード)
//   - form_answer02 (電話番号), form_answer03 (苗字), form_answer04 (名前),
//   - form_answer05 (苗字ふりがな), form_answer06 (名前ふりがな),
//   - form_answer07 (生年), form_answer08 (生月), form_answer09 (生日),
//   - form_answer10 (大学名), form_answer11 (部活名), form_answer12 (学年),
//   - form_answer13 (性別), form_answer14 (出身地), form_answer15 (役職),
//   - form_answer16 (学部), form_answer17 (学科), form_answer18 (学業種別),
//   - form_answer19 (個人情報同意のチェックボックス)
//   - #loading 要素（初期ローディング用）
//   - ボタンに onclick="onSubmit()" を設定
//   - liff.init() を完了してあること

// index.js
// GASのエンドポイントURL
// const EVENT_API_URL = 'https://script.google.com/macros/s/AKfycbxLqd8hE-hbU_1ezOaKZjZrpsYtZVE4tZcjc855Cr-LaE-GAZME9trg8dnO-4r9c0bSBg/exec'; ←一時的に不使用にする、後で戻す

// 一時使用のGASエンドポイント　後で戻す
const EVENT_API_URL = 'https://script.google.com/macros/s/AKfycbx_uEMi2DkZzn6ZOgASVBOrMwoewVVdNvtKcHrOYNed1x2RYb5hap7qgnbuNCSKMUhWCw/exec';
const API_ENDPOINT = 'https://backend-service-694729750061.asia-northeast1.run.app';

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', () => {
  // 初期ローディング要素を隠す
  const loadingElem = document.getElementById('loading');
  if (loadingElem) loadingElem.style.display = 'none';
  
  // 生年月日プルダウン設定
  setupBirthdaySelects();
  
  // イベントデータを取得して選択エリアを初期化
  fetchEventOptions();
  
  // パスワード入力フィールドのイベントリスナー設定
  const passwordInput = document.getElementById('form_answer20');
  const confirmPasswordInput = document.getElementById('form_answer21');
  
  if (passwordInput && confirmPasswordInput) {
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validatePassword);
  }
});

// ローディングインジケーター作成
function createLoadingIndicator() {
  if (document.getElementById('custom-loading')) return;
  const container = document.createElement('div');
  container.id = 'custom-loading';
  Object.assign(container.style, {
    display: 'none', position: 'fixed', top: 0, left: 0,
    width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.8)',
    zIndex: 9999, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', display: 'flex'
  });
  const spinner = document.createElement('div');
  Object.assign(spinner.style, {
    width: '40px', height: '40px', border: '4px solid #f3f3f3',
    borderTop: '4px solid #fcac04', borderRadius: '50%', animation: 'spin 1s linear infinite'
  });
  const style = document.createElement('style');
  style.textContent = `@keyframes spin {0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`;
  document.head.appendChild(style);
  const msg = document.createElement('p');
  msg.id = 'loading-message'; msg.textContent = '送信中...';
  Object.assign(msg.style, { marginTop: '10px', fontWeight: 'bold', color: '#333' });
  container.append(spinner, msg);
  document.body.appendChild(container);
}

// ローディング表示
function showLoading(message = '送信中...') {
  const container = document.getElementById('custom-loading');
  if (!container) return;
  const msgElem = document.getElementById('loading-message'); if (msgElem) msgElem.textContent = message;
  container.style.display = 'flex';
}

// ローディング非表示
function hideLoading() {
  const c = document.getElementById('custom-loading'); if (c) c.style.display = 'none';
}

// 生年月日セレクトの設定
function setupBirthdaySelects() {
  const yearEl = document.getElementById('form_answer07');
  const monthEl = document.getElementById('form_answer08');
  const dayEl = document.getElementById('form_answer09');
  if (!yearEl || !monthEl || !dayEl) return;
  
  // 年の選択肢を設定
  for (let y = 1900; y <= new Date().getFullYear(); y++) yearEl.add(new Option(y, y));
  
  // 月の選択肢を設定
  for (let m = 1; m <= 12; m++) monthEl.add(new Option(m, m));
  
  // 日の更新関数
  function updateDays() {
    dayEl.innerHTML = '';
    const y = parseInt(yearEl.value) || new Date().getFullYear();
    const m = parseInt(monthEl.value) || 1;
    const last = new Date(y, m, 0).getDate();
    for (let d = 1; d <= last; d++) dayEl.add(new Option(d, d));
  }
  
  // イベントリスナーを追加
  yearEl.addEventListener('change', updateDays);
  monthEl.addEventListener('change', updateDays);
  
  // 初期実行
  updateDays();
}

async function fetchEventOptions() {
  try {
    // イベント選択エリアのローディング表示
    const optionsList = document.getElementById('event-options-list');
    if (!optionsList) return;
    
    optionsList.innerHTML = '<div style="padding: 15px; text-align: center;">イベント日程を読み込み中...</div>';
    
    // イベントデータを取得（パラメータ追加：type=events）
    const response = await fetch(`${EVENT_API_URL}?from=liff`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // APIからのレスポンス形式に応じて調整
    let eventOptions = [];
    
    if (Array.isArray(data)) {
      // 各イベントからdate_strだけを抽出して選択肢として使用
      eventOptions = data.map(event => event.date_str || '日程情報なし');
    } else if (data && typeof data === 'object') {
      // オブジェクトの場合（以前のバージョンとの互換性のため）
      if (data.events && Array.isArray(data.events)) {
        eventOptions = data.events.map(event => {
          if (typeof event === 'object' && event !== null) {
            return event.date_str || '日程情報なし';
          }
          return String(event);
        });
      } else {
        console.error('予期しないAPIレスポンス形式:', data);
        eventOptions = [];
      }
    } else {
      console.error('予期しないAPIレスポンス形式:', data);
      eventOptions = [];
    }
    
    // "日程が合わない"オプションを追加
    if (!eventOptions.includes("日程が合わない")) {
      eventOptions.push("日程が合わない");
    }
    
    // イベント選択エリアの初期化
    initializeEventSelection(eventOptions);
    
  } catch (error) {
    console.error('イベントデータ取得エラー:', error);
    
    // エラーメッセージのみを表示
    const optionsList = document.getElementById('event-options-list');
    if (optionsList) {
      optionsList.innerHTML = '<div style="padding: 15px; text-align: center; color: #d9534f;">イベント日程の読み込みに失敗しました。<br>ページを再読み込みするか、しばらく経ってからお試しください。</div>';
    }
  }
}

// イベント選択エリアの初期化
function initializeEventSelection(eventOptions) {
  const optionsList = document.getElementById('event-options-list');
  const selectedList = document.getElementById('selected-events-list');
  const selectionCount = document.getElementById('selection_count');
  const choice1Input = document.getElementById('form_answer22');
  const choice2Input = document.getElementById('form_answer23');
  
  if (!optionsList || !selectedList || !selectionCount || !choice1Input || !choice2Input) return;
  
  // 選択済みイベント配列
  let selectedEvents = [];
  
  // 選択リストをクリア
  optionsList.innerHTML = '';
  
  // イベントオプションを表示
  eventOptions.forEach((eventOption) => {
    const optionItem = document.createElement('div');
    optionItem.style.padding = '8px 12px';
    optionItem.style.cursor = 'pointer';
    optionItem.style.borderBottom = '1px solid #eee';
    optionItem.textContent = eventOption;
    
    // すべてのイベントオプションで同じクリックハンドラを使用
    optionItem.addEventListener('click', function() {
      const eventIndex = selectedEvents.indexOf(eventOption);
      
      if (eventIndex === -1) {
        // 選択されていない場合は追加（最大2つまで）
        if (selectedEvents.length < 2) {
          // 「日程が合わない」と通常の日程を組み合わせ可能に
          selectedEvents.push(eventOption);
        } else {
          alert('最大2つまで選択できます。別の選択をするには、まず選択済みの項目をクリックして解除してください。');
        }
      } else {
        // すでに選択されている場合は解除
        selectedEvents.splice(eventIndex, 1);
      }
      
      // 選択状態を更新
      updateSelectedEvents();
      
      // hidden入力に値を設定
      updateHiddenInputs();
    });
    
    optionsList.appendChild(optionItem);
  });
  
  // hidden入力を更新する関数
  function updateHiddenInputs() {
    // 選択がない場合は空にする
    if (selectedEvents.length === 0) {
      choice1Input.value = "";
      choice2Input.value = "";
      return;
    }
    
    // 「日程が合わない」が含まれる場合は常に1番目に設定
    if (selectedEvents.includes("日程が合わない")) {
      const otherEvent = selectedEvents.find(event => event !== "日程が合わない") || "";
      choice1Input.value = "日程が合わない";
      choice2Input.value = otherEvent;
    } else {
      // 通常の日程のみの場合
      choice1Input.value = selectedEvents[0] || "";
      choice2Input.value = selectedEvents[1] || "";
    }
  }
  
  // 選択状態を更新する関数
  function updateSelectedEvents() {
    // 選択リストをクリア
    selectedList.innerHTML = '';
    
    // 選択された各イベントを表示
    selectedEvents.forEach(event => {
      const selectedItem = document.createElement('div');
      selectedItem.style.padding = '8px 12px';
      selectedItem.style.backgroundColor = '#fcac04';
      selectedItem.style.color = 'white';
      selectedItem.style.borderRadius = '4px';
      selectedItem.style.marginBottom = '5px';
      selectedItem.textContent = event;
      
      // クリックでこの選択を解除
      selectedItem.addEventListener('click', function() {
        const index = selectedEvents.indexOf(event);
        if (index !== -1) {
          selectedEvents.splice(index, 1);
          updateSelectedEvents();
          updateHiddenInputs();
        }
      });
      
      selectedList.appendChild(selectedItem);
    });
    
    // 選択数を表示
    selectionCount.textContent = `選択数: ${selectedEvents.length}/2`;
    
    // オプションリストの項目のスタイルを更新
    Array.from(optionsList.children).forEach(option => {
      const isSelected = selectedEvents.includes(option.textContent);
      option.style.opacity = "1";
      option.style.backgroundColor = isSelected ? "#fcac04" : "transparent";
      option.style.color = isSelected ? "white" : "inherit";
    });
  }
  
  // 初期状態で選択数を表示
  updateSelectedEvents();
}

// パスワード検証
function validatePassword() {
  const passwordInput = document.getElementById('form_answer20');
  const confirmPasswordInput = document.getElementById('form_answer21');
  
  if (!passwordInput || !confirmPasswordInput) return true;
  
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  
  // エラーメッセージ要素を取得または作成
  let passwordError = document.getElementById('password-error');
  if (!passwordError) {
    passwordError = document.createElement('p');
    passwordError.id = 'password-error';
    passwordError.style.color = 'red';
    passwordError.style.fontSize = '14px';
    passwordInput.parentNode.appendChild(passwordError);
  }
  
  let confirmError = document.getElementById('confirm-password-error');
  if (!confirmError) {
    confirmError = document.createElement('p');
    confirmError.id = 'confirm-password-error';
    confirmError.style.color = 'red';
    confirmError.style.fontSize = '14px';
    confirmPasswordInput.parentNode.appendChild(confirmError);
  }
  
  // エラーメッセージをリセット
  passwordError.textContent = '';
  confirmError.textContent = '';
  
  // パスワード長さチェック
  if (password.length < 8) {
    passwordError.textContent = 'パスワードは8文字以上で入力してください';
    return false;
  }
  
  // 英字と数字を含むかチェック
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasLetter || !hasNumber) {
    passwordError.textContent = 'パスワードは英字と数字を含む必要があります';
    return false;
  }
  
  // パスワード一致チェック
  if (password !== confirmPassword && confirmPassword.length > 0) {
    confirmError.textContent = 'パスワードが一致しません';
    return false;
  }
  
  return true;
}

// フォーム送信処理
function onSubmit() {
  createLoadingIndicator();
  showLoading('送信中...'); // ここでローディング表示を開始
  
  // 各フォーム値取得
  const mailadress     = document.getElementById('form_answer01')?.value.trim() || '';
  const password       = document.getElementById('form_answer20')?.value || '';
  const confirmPass    = document.getElementById('form_answer21')?.value || '';
  const phoneNumber    = document.getElementById('form_answer02')?.value || '';
  const lastName       = document.getElementById('form_answer03')?.value || '';
  const firstName      = document.getElementById('form_answer04')?.value || '';
  const lastNameRead   = document.getElementById('form_answer05')?.value || '';
  const firstNameRead  = document.getElementById('form_answer06')?.value || '';
  const birthYear      = document.getElementById('form_answer07')?.value || '';
  const birthMonth     = document.getElementById('form_answer08')?.value || '';
  const birthDay       = document.getElementById('form_answer09')?.value || '';
  const universityName = document.getElementById('form_answer10')?.value || '';
  const clubActivity   = document.getElementById('form_answer11')?.value || '';
  const grade          = document.getElementById('form_answer12')?.value || '';
  const gender         = document.getElementById('form_answer13')?.value || '';
  const birthPlace     = document.getElementById('form_answer14')?.value || '';
  const position       = document.getElementById('form_answer15')?.value || '';
  const faculty        = document.getElementById('form_answer16')?.value || '';
  const department     = document.getElementById('form_answer17')?.value || '';
  const academicType   = document.getElementById('form_answer18')?.value || '';
  const agreement      = document.getElementById('form_answer19')?.checked === true;
  const reservation1   = document.getElementById('form_answer22')?.value || '';
  const reservation2   = document.getElementById('form_answer23')?.value || '';

  // バリデーション
  if (!mailadress || !password) { 
    hideLoading(); // エラー時にローディングを非表示
    alert('メールアドレス・パスワードは必須です'); 
    return false; 
  }
  if (password !== confirmPass) { 
    hideLoading(); // エラー時にローディングを非表示
    alert('パスワードが一致しません'); 
    return false; 
  }
  if (!agreement) { 
    hideLoading(); // エラー時にローディングを非表示
    alert('個人情報同意が必要です'); 
    return false; 
  }
  if (!validatePassword()) { 
    hideLoading(); // エラー時にローディングを非表示
    return false; 
  }
  // イベント選択のバリデーション - "日程が合わない"のみの場合は許可
  if ((!reservation1 && !reservation2) || 
      (reservation1 !== "日程が合わない" && !reservation2) || 
      (!reservation1 && reservation2)) {
    hideLoading(); // エラー時にローディングを非表示
    alert('イベントを2つ選択するか、"日程が合わない"を選択してください');
    return false;
  }

  // rawMessage作成
  const fields = [mailadress, phoneNumber, lastName, firstName, lastNameRead, firstNameRead,
                birthYear+'-'+birthMonth+'-'+birthDay, universityName, clubActivity, grade,
                gender, birthPlace, position, faculty, department, academicType, reservation1, reservation2, "同意する"];
  let msg = '【送信内容】';
  fields.forEach(v=> msg += '\n'+v);

  showLoading('送信中...');
  liff.getProfile()
    .then(profile => {
      const answers = { mailadress, password, phoneNumber, lastName, firstName, lastNameRead, firstNameRead,
                      birthYear: Number(birthYear), birthMonth: Number(birthMonth), birthDay: Number(birthDay),
                      universityName, clubActivity, grade, gender, birthPlace, position, faculty, department, academicType, reservation1, reservation2 };
      return fetch(`${API_ENDPOINT}/api/register`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ userId:profile.userId, displayName:profile.displayName, answers })
      });
    })
    .then(res=> res.json().then(b=>{ if(!res.ok) throw new Error(b.error||`HTTP${res.status}`); return b;}))
    .then(_=>{
      showLoading('登録完了！');
      const finish = ()=>{ hideLoading(); if(liff.isInClient()){ liff.closeWindow(); } else { window.close(); }};
      if(liff.isInClient()){ liff.sendMessages([{type:'text',text:msg}]).then(finish).catch(finish); }
      else { setTimeout(finish,1000); }
    })
    .catch(err=>{ hideLoading(); alert('送信失敗: '+err.message); });
  return false;
}
