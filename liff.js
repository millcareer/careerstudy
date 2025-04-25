// LIFFの基本情報
$(document).ready(function () {
    // liffId: LIFF URL "https://liff.line.me/xxx"のxxxに該当する箇所
    // LINE DevelopersのLIFF画面より確認可能
    var liffId = "1660795452-nYx391B8";
    console.log(`init liff, ID : ${liffId}`);
    
    // 初期化は一度だけ行う
    let initialized = false;
    
    initializeLiff(liffId);
})

// フォームタイプの判定
function getFormType() {
    try {
        const url = new URL(window.location.href);
        const formType = url.searchParams.get('type');
        console.log('URL parameters:', {
            full_url: window.location.href,
            type: formType
        });
        // typeパラメータが'survey'の場合のみsurveyを返し、それ以外は全てregisterとする
        return formType === 'survey' ? 'survey' : 'register';
    } catch (error) {
        console.error('Error getting form type:', error);
        return 'register'; // エラーの場合はデフォルトとしてregisterを返す
    }
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
        // フォームの初期化は一度だけ行う
        const formType = getFormType();
        console.log('Initializing with form type:', formType);
        initializeFormUI(formType);
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
    console.log('Initializing UI with form type:', formType);
    
    const registerForm = document.querySelector('.form.register-only');
    const surveyForm = document.querySelector('.form.survey-only');
    
    if (!registerForm || !surveyForm) {
        console.error('Forms not found:', {
            registerForm: !!registerForm,
            surveyForm: !!surveyForm
        });
        return;
    }
    
    // まずすべてのフォームを非表示に
    registerForm.style.display = 'none';
    surveyForm.style.display = 'none';
    
    if (formType === 'register') {
        // 登録フォームを表示
        console.log('Showing register form');
        registerForm.style.display = 'block';
        document.getElementById('formTitle').textContent = 'イベント参加登録';
    } else if (formType === 'survey') {
        // アンケートフォームを表示
        console.log('Showing survey form');
        surveyForm.style.display = 'block';
        document.getElementById('formTitle').textContent = 'イベント終了後アンケート';
    }
    
    // 現在の表示状態を確認
    console.log('Form visibility after update:', {
        register: {
            display: window.getComputedStyle(registerForm).display,
            classList: registerForm.classList.toString()
        },
        survey: {
            display: window.getComputedStyle(surveyForm).display,
            classList: surveyForm.classList.toString()
        }
    });
}

// フォーム送信処理
async function onSubmit(event) {
    event.preventDefault();
    
    // 現在のフォームタイプを取得
    const formType = getFormType();
    console.log('Form submission for type:', formType);
    
    if (formType === 'register') {
        // 登録フォームの処理
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        
        if (!name || !email || !phone) {
            alert('全ての項目を入力してください。');
            return;
        }
        
        const data = {
            type: 'register',
            name: name,
            email: email,
            phone: phone
        };
        
        await sendData(data);
    } else if (formType === 'survey') {
        // アンケートフォームの処理
        const satisfaction = document.getElementById('satisfaction').value;
        const feedback = document.getElementById('feedback').value;
        
        if (!satisfaction || !feedback) {
            alert('全ての項目を入力してください。');
            return;
        }
        
        const data = {
            type: 'survey',
            satisfaction: satisfaction,
            feedback: feedback
        };
        
        await sendData(data);
    }
}

// データをサーバーに送信する関数
async function sendData(data) {
    try {
        console.log('Sending data:', data);
        
        // LIFFのコンテキスト情報を取得
        const context = liff.getContext();
        const idToken = await liff.getIDToken();
        
        // データにLINE情報を追加
        const payload = {
            ...data,
            userId: context.userId,
            idToken: idToken
        };
        
        // サーバーにデータを送信
        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error('送信に失敗しました');
        }
        
        const result = await response.json();
        console.log('Server response:', result);
        
        // 送信成功メッセージを表示
        alert('送信が完了しました！');
        
        // フォームをリセット
        if (data.type === 'register') {
            document.getElementById('registerForm').reset();
        } else if (data.type === 'survey') {
            document.getElementById('surveyForm').reset();
        }
        
    } catch (error) {
        console.error('Error sending data:', error);
        alert('エラーが発生しました: ' + error.message);
    }
}
