// LIFFの基本情報
$(document).ready(function () {
    // liffId: LIFF URL "https://liff.line.me/xxx"のxxxに該当する箇所
    // LINE DevelopersのLIFF画面より確認可能
    var liffId = "1660795452-nYx391B8";
    console.log(`init liff, ID : ${liffId}`);
    initializeLiff(liffId);
})

// フォームタイプの判定
function getFormType() {
    const url = new URL(window.location.href);
    const formType = url.searchParams.get('type') || 'register';
    return formType;
}

// index.htmlのsubimtで呼び出される関数
function sendText(text) {
    // フォームタイプに基づいてメッセージを加工
    const formType = getFormType();
    const prefix = formType === 'register' ? '[登録]' : '[アンケート]';
    const finalText = `${prefix} ${text}`;

    if (!liff.isInClient()) {
        shareTargetPicker(finalText);
    } else {
        sendMessages(finalText);
    }
}

// LINEトーク画面上でメッセージ送信
function sendMessages(text) {
    console.log('in sendMessages()');
    liff.sendMessages([{
        'type': 'text',
        'text': text
    }]).then(function () {
        liff.closeWindow();
    }).catch(function (error) {
        window.alert('Failed to send message ' + error);
    });
}

// Webブラウザからメッセージ送信
function shareTargetPicker(text) {
    console.log('in shareTargetPicker');
    liff.shareTargetPicker([{
        'type': 'text',
        'text': text
    }]).catch((error) => {
        console.log(error);
        window.alert('Failed to send message ' + error);
    });
}

// function sendMessageToLine(text) {
//     if (!liff.isInClient()) {
//         openShareTargetPicker(text);
//     } else {
//         sendTextMessage(text);
//     }
// }
// window.sendMessageToLine = sendMessageToLine;

function initializeLiff(liffId) {
    liff
        .init({ liffId })
        .then(() => {
            handleLiffInitializationSuccess();
        })
        .catch((err) => {
            handleLiffInitializationFailure(err);
        });
}

function handleLiffInitializationSuccess() {
    if (!liff.isInClient() && !liff.isLoggedIn()) {
        window.alert("LINEアカウントにログインしてください。");
        liff.login({ redirectUri: location.href });
    } else {
        console.log('Login Success');
        // フォームタイプに基づいてUIを初期化
        initializeFormUI(getFormType());
    }
}

function handleLiffInitializationFailure(err) {
    console.error('LIFF Initialization failed: ', err);
    window.alert('アプリケーションの初期化に失敗しました。後ほど再試行してください。');
}

// function sendTextMessage(text) {
//     console.log('Sending message...');
//     liff.sendMessages([{ type: 'text', text }])
//         .then(() => {
//             liff.closeWindow();
//         })
//         .catch((error) => {
//             console.error('Failed to send message: ', error);
//             window.alert('メッセージの送信に失敗しました。');
//         });
// }

// function openShareTargetPicker(text) {
//     console.log('Opening Share Target Picker...');
//     liff.shareTargetPicker([{ type: 'text', text }])
//         .catch((error) => {
//             console.error('Failed to open Share Target Picker: ', error);
//             window.alert('シェアターゲットピッカーの開始に失敗しました。');
//         });
// }

// フォームタイプに基づいてUIを初期化する関数
function initializeFormUI(formType) {
    const registerForm = document.querySelector('.form.register-only');
    const surveyForm = document.querySelector('.form.survey-only');
    
    // 全てのフォームからshowクラスを削除
    registerForm.classList.remove('show');
    surveyForm.classList.remove('show');
    
    if (formType === 'register') {
        // 登録フォームを表示
        registerForm.classList.add('show');
        document.getElementById('formTitle').textContent = 'イベント参加登録';
    } else if (formType === 'survey') {
        // アンケートフォームを表示
        surveyForm.classList.add('show');
        document.getElementById('formTitle').textContent = 'イベント終了後アンケート';
    }
    
    // デバッグ用のログ
    console.log('Form type:', formType);
    console.log('Register form display:', registerForm.style.display);
    console.log('Survey form display:', surveyForm.style.display);
}
