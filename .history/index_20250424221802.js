// index.js - メインページのJavaScript
// イベント関連の機能はcommon/events.jsに移動済み
// API通信機能はcommon/api.jsに移動済み
import { createSurvey1Form, onSubmitSurvey1 } from './survey1/form.js';

// 初期化時に必要なセットアップを実行
document.addEventListener('DOMContentLoaded', function() {
    console.log('メインページの初期化を開始します');
    
    // フォームコンテナの取得
    const formContainer = document.getElementById('form-container');
    if (formContainer) {
        // survey1のフォームを作成
        createSurvey1Form(formContainer);
        formContainer.style.display = 'block';
    }
    
    // ローディング表示を非表示
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
});

// フォームデータの送信
function submitFormData(formData) {
    console.log('フォームデータを送信します');
    
    // LINEが利用可能な場合はLINEプロフィール情報も追加
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
    // API通信機能を使用
    const url = 'https://script.google.com/macros/s/AKfycbyMCenjhw8xznFjWpYpIL0SDXdSns_9hbU92ZiucboJqzJhXJuItSKMhJ36W1ylZP2k/exec';
    
    window.api.submitFormData(url, formData)
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

// グローバルスコープに必要な関数を公開
window.onSubmitSurvey1 = onSubmitSurvey1;
window.submitFormData = submitFormData;
