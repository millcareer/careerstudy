// DOMが読み込まれたら実行される関数
document.addEventListener('DOMContentLoaded', (event) => {
    // ローディングを確実に非表示にする
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    // カスタムローディングインジケーターを準備（非表示で）
    createLoadingIndicator();
    
    // 生年月日の選択肢を作成
    setupBirthdaySelects();
});

// ローディングインジケーターを作成する関数
function createLoadingIndicator() {
    // すでに存在する場合は作成しない
    if (document.getElementById('custom-loading')) return;
    
    // ローディングインジケーター要素の作成
    const loadingContainer = document.createElement('div');
    loadingContainer.id = 'custom-loading';
    loadingContainer.style.display = 'none'; // 初期状態は非表示
    loadingContainer.style.position = 'fixed';
    loadingContainer.style.top = '0';
    loadingContainer.style.left = '0';
    loadingContainer.style.width = '100%';
    loadingContainer.style.height = '100%';
    loadingContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    loadingContainer.style.zIndex = '9999';
    loadingContainer.style.flexDirection = 'column';
    loadingContainer.style.justifyContent = 'center';
    loadingContainer.style.alignItems = 'center';
    
    // スピナー要素の作成
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.style.width = '40px';
    spinner.style.height = '40px';
    spinner.style.border = '4px solid #f3f3f3';
    spinner.style.borderTop = '4px solid #fcac04';
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'spin 1s linear infinite';
    
    // スピナーのアニメーションスタイルを追加
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // メッセージ要素の作成
    const message = document.createElement('p');
    message.id = 'loading-message';
    message.textContent = '送信中...';
    message.style.marginTop = '10px';
    message.style.color = '#333';
    message.style.fontWeight = 'bold';
    
    // 要素を組み合わせる
    loadingContainer.appendChild(spinner);
    loadingContainer.appendChild(message);
    document.body.appendChild(loadingContainer);
}

// ローディングインジケーターの表示・非表示を制御する関数
function showLoading(message = '送信中...') {
    const loadingElement = document.getElementById('custom-loading');
    if (loadingElement) {
        // メッセージを更新
        const messageElement = document.getElementById('loading-message');
        if (messageElement) {
            messageElement.textContent = message;
        }
        
        // 表示設定
        loadingElement.style.display = 'flex';
    }
}

function hideLoading() {
    const loadingElement = document.getElementById('custom-loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// 生年月日選択セットアップ関数
function setupBirthdaySelects() {
    let yearSelect = document.getElementById('form_answer07');
    let monthSelect = document.getElementById('form_answer08');
    let daySelect = document.getElementById('form_answer09');

    if (yearSelect && monthSelect && daySelect) {
        // 年の選択肢を生成
        for(let i = 1900; i <= new Date().getFullYear(); i++) {
            let option = document.createElement('option');
            option.value = i;
            option.text = i;
            yearSelect.add(option);
        }

        // 月の選択肢を生成
        for(let i = 1; i <= 12; i++) {
            let option = document.createElement('option');
            option.value = i;
            option.text = i;
            monthSelect.add(option);
        }

        // 日数を設定する関数
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

        // イベントリスナーを設定
        yearSelect.addEventListener('change', setDayOptions);
        monthSelect.addEventListener('change', setDayOptions);

        // 初期設定
        setDayOptions();
    }
}

// APIエンドポイント
// 注意: 実際のGCPエンドポイントURLに置き換える必要があります
const API_ENDPOINT = "https://backend-service-694729750061.asia-northeast1.run.app/api/register";

// フォーム送信関数
function onSubmit() {
    // フォームの値を配列に格納
    let text_list = [];
    const form01 = document.getElementById('form_answer01');
    if (form01) text_list.push(form01.value);
    
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
    
    // パスワード確認
    const password = document.getElementById('form_answer20').value;
    const confirmPassword = document.getElementById('form_answer21').value;
    
    if (password !== confirmPassword) {
        window.alert('パスワードと確認用パスワードが一致しません。');
        return false;
    }
    
    // 入力チェック＆rawMessage作成
  let msg = "【送信内容】";
  for (let i = 0; i < text_list.length; i++) {
    if (!text_list[i]) {
      alert('入力項目に漏れがあります。全ての項目への入力をお願い致します。');
      return false;
    }
    msg += "\n" + text_list[i];
  }

  // ローディング表示
  showLoading('送信中...しばらくお待ちください');

  // LINEプロフィール取得＆送信
  liff.getProfile()
    .then(profile => {
      // text_list をキー付きオブジェクトにマッピング
      const [
        academicType,    // form_answer01
        mailadress,      // form_answer20
        passwordValue,   // form_answer21
        agreement,       // form_answer02
        birthDay,        // form_answer03
        birthMonth,      // form_answer04
        birthYear,       // form_answer05
        birthPlace,      // form_answer06
        clubActivity,    // form_answer07
        department,      // form_answer08
        faculty,         // form_answer09
        firstName,       // form_answer10
        firstNameRead,   // form_answer11
        gender,          // form_answer12
        grade,           // form_answer13
        lastName,        // form_answer14
        lastNameRead,    // form_answer15
        phoneNumber,     // form_answer16
        position,        // form_answer17
        universityName   // form_answer18
      ] = text_list;

      const answers = {
        mailadress,
        password: passwordValue,
        academicType,
        agreement:       Boolean(agreement),
        birthDay:        Number(birthDay),
        birthMonth:      Number(birthMonth),
        birthYear:       Number(birthYear),
        birthPlace,
        clubActivity,
        department,
        faculty,
        firstName,
        firstNameRead,
        gender,
        grade:           Number(grade),
        lastName,
        lastNameRead,
        phoneNumber,
        position,
        universityName
      };

      const payload = {
        userId:      profile.userId,
        displayName: profile.displayName,
        answers
      };

      // APIコール
      return fetch(API_ENDPOINT + '/api/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });
    })
    .then(res => res.json())
    .then(data => {
      showLoading('送信完了！');
      // LINEメッセージ送信 or 終了
      if (liff.isInClient()) {
        return liff.sendMessages([{ type: 'text', text: msg }])
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
}
