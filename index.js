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

const API_ENDPOINT = 'https://backend-service-694729750061.asia-northeast1.run.app';

document.addEventListener('DOMContentLoaded', () => {
  // 初期ローディング要素を隠す
  const loadingElem = document.getElementById('loading');
  if (loadingElem) loadingElem.style.display = 'none';
  // 生年月日プルダウン
  setupBirthdaySelects();
});

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

function showLoading(message = '送信中...') {
  const container = document.getElementById('custom-loading');
  if (!container) return;
  const msgElem = document.getElementById('loading-message'); if (msgElem) msgElem.textContent = message;
  container.style.display = 'flex';
}

function hideLoading() {
  const c = document.getElementById('custom-loading'); if (c) c.style.display = 'none';
}

function setupBirthdaySelects() {
  const yearEl = document.getElementById('form_answer07');
  const monthEl = document.getElementById('form_answer08');
  const dayEl = document.getElementById('form_answer09');
  if (!yearEl || !monthEl || !dayEl) return;
  for (let y = 1900; y <= new Date().getFullYear(); y++) yearEl.add(new Option(y, y));
  for (let m = 1; m <= 12; m++) monthEl.add(new Option(m, m));
  function updateDays() {
    dayEl.innerHTML = '';
    const y = parseInt(yearEl.value), m = parseInt(monthEl.value);
    const last = new Date(y, m, 0).getDate();
    for (let d = 1; d <= last; d++) dayEl.add(new Option(d, d));
  }
  yearEl.addEventListener('change', updateDays);
  monthEl.addEventListener('change', updateDays);
  updateDays();
}

function onSubmit() {
  createLoadingIndicator();
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
  if (!mailadress || !password) { alert('メールアドレス・パスワードは必須です'); return false; }
  if (password !== confirmPass) { alert('パスワードが一致しません'); return false; }
  if (!agreement) { alert('個人情報同意が必要です'); return false; }

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
