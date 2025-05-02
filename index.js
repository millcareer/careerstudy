// LIFF → バックエンドのベースURL（末尾にスラッシュ不要）
const API_ENDPOINT = 'https://backend-service-694729750061.asia-northeast1.run.app';

// DOM読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
  // 既存ローディング要素を隠す
  const loadingElem = document.getElementById('loading');
  if (loadingElem) loadingElem.style.display = 'none';

  // カスタムローディングを準備
  createLoadingIndicator();

  // 生年月日セレクトを生成
  setupBirthdaySelects();
});

// カスタムローディング作成
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
  style.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
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
  const msgElem = document.getElementById('loading-message');
  if (msgElem) msgElem.textContent = message;
  container.style.display = 'flex';
}

function hideLoading() {
  const container = document.getElementById('custom-loading');
  if (container) container.style.display = 'none';
}

// 生年月日プルダウン生成
function setupBirthdaySelects() {
  const yearEl  = document.getElementById('form_answer07');
  const monthEl = document.getElementById('form_answer08');
  const dayEl   = document.getElementById('form_answer09');
  if (!yearEl || !monthEl || !dayEl) return;
  for (let y = 1900; y <= new Date().getFullYear(); y++) {
    yearEl.add(new Option(y, y));
  }
  for (let m = 1; m <= 12; m++) {
    monthEl.add(new Option(m, m));
  }
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

// フォーム送信関数
function onSubmit() {
  // ローディング要素非表示確認
  hideLoading();

  // 必須項目を個別取得
  const academicType   = document.getElementById('form_answer01')?.value || '';
  const mailadress     = document.getElementById('form_answer20')?.value.trim() || '';
  const password       = document.getElementById('form_answer21')?.value || '';
  const agreement      = document.getElementById('form_answer02')?.checked === true;
  const birthDay       = document.getElementById('form_answer03')?.value || '';
  const birthMonth     = document.getElementById('form_answer04')?.value || '';
  const birthYear      = document.getElementById('form_answer05')?.value || '';
  const birthPlace     = document.getElementById('form_answer06')?.value || '';
  const clubActivity   = document.getElementById('form_answer07')?.value || '';
  const department     = document.getElementById('form_answer08')?.value || '';
  const faculty        = document.getElementById('form_answer09')?.value || '';
  const firstName      = document.getElementById('form_answer10')?.value || '';
  const firstNameRead  = document.getElementById('form_answer11')?.value || '';
  const gender         = document.getElementById('form_answer12')?.value || '';
  const grade          = document.getElementById('form_answer13')?.value || '';
  const lastName       = document.getElementById('form_answer14')?.value || '';
  const lastNameRead   = document.getElementById('form_answer15')?.value || '';
  const phoneNumber    = document.getElementById('form_answer16')?.value || '';
  const position       = document.getElementById('form_answer17')?.value || '';
  const universityName = document.getElementById('form_answer18')?.value || '';
  const extraField     = document.getElementById('form_answer19')?.value || '';

  // バリデーション
  if (!mailadress || !password || !academicType) {
    alert('メールアドレス、パスワード、学科などの必須項目を入力してください。');
    return false;
  }
  if (!agreement) {
    alert('利用規約への同意が必要です。');
    return false;
  }

  // 入力チェック＆rawMessage作成
  const fields = [academicType, mailadress, password, agreement, birthDay, birthMonth, birthYear,
                  birthPlace, clubActivity, department, faculty, firstName, firstNameRead,
                  gender, grade, lastName, lastNameRead, phoneNumber, position, universityName];
  let msg = '【送信内容】';
  for (const val of fields) {
    msg += '\n' + val;
  }

  // ローディング表示
  showLoading('送信中...しばらくお待ちください');

  // LIFFプロファイル取得＆API呼び出し
  liff.getProfile()
    .then(profile => {
      const answers = {
        mailadress,
        password,
        academicType,
        agreement,
        birthDay: Number(birthDay),
        birthMonth: Number(birthMonth),
        birthYear: Number(birthYear),
        birthPlace,
        clubActivity,
        department,
        faculty,
        firstName,
        firstNameRead,
        gender,
        grade: Number(grade),
        lastName,
        lastNameRead,
        phoneNumber,
        position,
        universityName
      };
      return fetch(`${API_ENDPOINT}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.userId, displayName: profile.displayName, answers })
      });
    })
    .then(res => res.json().then(body => {
      if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);
      return body;
    }))
    .then(() => {
      showLoading('送信完了！');
      if (liff.isInClient()) {
        liff.sendMessages([{ type: 'text', text: msg }])
          .then(() => setTimeout(() => { hideLoading(); liff.closeWindow(); }, 1000))
          .catch(() => setTimeout(() => { hideLoading(); alert('送信が完了しました。'); liff.closeWindow(); }, 1000));
      } else {
        setTimeout(() => { hideLoading(); alert('送信が完了しました。'); window.close(); }, 1000);
      }
    })
    .catch(err => {
      hideLoading();
      alert('送信に失敗しました: ' + err.message);
    });

  return false;
}
