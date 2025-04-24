// index.js - メインページのJavaScript
// イベント関連の機能はcommon/events.jsに移動しました

// 初期化時に必要なセットアップを実行
document.addEventListener('DOMContentLoaded', function() {
    console.log('メインページの初期化を開始します');
    
    // イベント情報を取得
    if (typeof fetchUpcomingEvents === 'function') {
        console.log('イベント情報を取得します');
        fetchUpcomingEvents();
    } else {
        console.error('fetchUpcomingEvents関数が見つかりません');
    }
    
    // その他のページ特有の初期化処理をここに記述
});

// フォーム送信処理
function onSubmit() {
    // 送信前のバリデーション
    if (!validateForm()) {
        return false;
    }
    
    // フォームデータの収集
    const formData = collectFormData();
    
    // データ送信処理
    submitFormData(formData);
    
    return false; // フォームのデフォルト送信を防止
}

// フォームバリデーション
function validateForm() {
    // 必須項目の確認
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value && field.type !== 'checkbox') {
            console.error(`必須項目が入力されていません: ${field.name}`);
            field.classList.add('is-invalid');
            isValid = false;
        } else if (field.type === 'checkbox' && !field.checked) {
            console.error(`必須チェックボックスが選択されていません: ${field.name}`);
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    // イベント選択の確認
    if (window.selectedEvents && window.selectedEvents.length === 0) {
        console.error('イベントが選択されていません');
        const eventContainer = document.getElementById('event-selection-container');
        if (eventContainer) {
            eventContainer.classList.add('is-invalid');
            const errorMsg = document.createElement('p');
            errorMsg.className = 'text-danger';
            errorMsg.textContent = 'イベントを選択してください';
            eventContainer.appendChild(errorMsg);
        }
        isValid = false;
    }
    
    return isValid;
}

// フォームデータの収集
function collectFormData() {
    const formData = {
        email: document.getElementById('form_answer01')?.value,
        password: document.getElementById('form_answer20')?.value,
        telNumber: document.getElementById('form_answer02')?.value,
        lastName: document.getElementById('form_answer03')?.value,
        firstName: document.getElementById('form_answer04')?.value,
        lastNameRead: document.getElementById('form_answer05')?.value,
        firstNameRead: document.getElementById('form_answer06')?.value,
        birthYear: document.getElementById('form_answer07')?.value,
        birthMonth: document.getElementById('form_answer08')?.value,
        birthDay: document.getElementById('form_answer09')?.value,
        universityName: document.getElementById('form_answer10')?.value,
        clubName: document.getElementById('form_answer11')?.value,
        grade: document.getElementById('form_answer12')?.value,
        sex: document.getElementById('form_answer13')?.value,
        fromArea: document.getElementById('form_answer14')?.value,
        role: document.getElementById('form_answer15')?.value,
        faculty: document.getElementById('form_answer16')?.value,
        department: document.getElementById('form_answer17')?.value,
        educationType: document.getElementById('form_answer18')?.value,
        agreement: document.getElementById('form_answer19')?.checked,
        selectedEvents: window.selectedEvents || []
    };
    
    console.log('収集したフォームデータ:', formData);
    return formData;
}

// フォームデータの送信
function submitFormData(formData) {
    console.log('フォームデータを送信します');
    
    // LIFFが利用可能な場合はLINEプロフィール情報も追加
    if (window.liff && liff.isLoggedIn()) {
        liff.getProfile()
            .then(profile => {
                formData.lineUserId = profile.userId;
                formData.lineDisplayName = profile.displayName;
                sendData(formData);
            })
            .catch(err => {
                console.error('LINEプロフィールの取得に失敗しました:', err);
                sendData(formData);
            });
    } else {
        sendData(formData);
    }
}

// サーバーへのデータ送信
function sendData(formData) {
    // 実際のAPIエンドポイントに送信
    fetch('https://script.google.com/macros/s/AKfycbzZemROe3jxhKdsvKqUwlLK6lRqrKk4DPTUMn5yyKwK4fp9r-ewqItfautobpWsT7LO2g/exec', {
        method: 'POST',
        mode: 'no-cors', // CORS対策
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(() => {
        // 送信成功の処理
        showSuccessMessage();
    })
    .catch(error => {
        // 送信失敗の処理
        console.error('データ送信に失敗しました:', error);
        showErrorMessage();
    });
}

// 送信成功メッセージの表示
function showSuccessMessage() {
    const formContainer = document.getElementById('form-container');
    if (formContainer) {
        formContainer.innerHTML = `
            <div class="alert alert-success">
                <h4>送信完了</h4>
                <p>フォームの送信が完了しました。ご協力ありがとうございました。</p>
                <p>LINEメッセージで確認のご連絡をお送りいたしますので、ご確認ください。</p>
            </div>
        `;
    }
    
    // LIFFが利用可能ならLINEアプリを閉じる
    if (window.liff && liff.isInClient()) {
        setTimeout(() => {
            liff.closeWindow();
        }, 3000);
    }
}

// エラーメッセージの表示
function showErrorMessage() {
    const formContainer = document.getElementById('form-container');
    if (formContainer) {
        const errorNotice = document.createElement('div');
        errorNotice.className = 'alert alert-danger';
        errorNotice.innerHTML = `
            <h4>エラーが発生しました</h4>
            <p>フォームの送信中にエラーが発生しました。インターネット接続を確認し、再度お試しください。</p>
            <button class="btn btn-outline-secondary mt-2" onclick="location.reload()">ページを再読み込み</button>
        `;
        formContainer.prepend(errorNotice);
    }
}
