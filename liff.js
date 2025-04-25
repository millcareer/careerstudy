// LIFFの基本情報
document.addEventListener('DOMContentLoaded', function() {
    // liffId: LIFF URL "https://liff.line.me/xxx"のxxxに該当する箇所
    // LINE DevelopersのLIFF画面より確認可能
    var liffId = "1660795452-nYx391B8";
    console.log(`init liff, ID : ${liffId}`);
    
    // 初期化は一度だけ行う
    let initialized = false;
    
    if (!initialized) {
        initialized = true;
        initializeLiff(liffId);
    }
});

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

async function handleLiffInitializationSuccess() {
    if (!liff.isInClient() && !liff.isLoggedIn()) {
        window.alert("LINEアカウントにログインしてください。");
        // パラメータを保持するようにリダイレクトURLを作成
        const currentUrl = new URL(location.href);
        liff.login({ redirectUri: currentUrl.toString() });
    } else {
        console.log('Login Success');
        // フォームの初期化
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
    console.log('initializeFormUI called with formType:', formType);
    console.log('URL parameters:', new URL(window.location.href).searchParams.toString());
    
    const registerForm = document.querySelector('.form.register-only');
    const surveyForm = document.querySelector('.form.survey-only');
    
    console.log('Forms found:', {
        registerForm: {
            found: !!registerForm,
            classList: registerForm?.classList.toString()
        },
        surveyForm: {
            found: !!surveyForm,
            classList: surveyForm?.classList.toString()
        }
    });
    
    if (!registerForm || !surveyForm) {
        console.error('Required form elements not found!');
        console.log('All forms:', Array.from(document.querySelectorAll('.form')).map(form => ({
            classList: form.classList.toString(),
            id: form.id,
            display: window.getComputedStyle(form).display
        })));
        return;
    }
    
    // まずすべてのフォームからshowクラスを削除
    registerForm.classList.remove('show');
    surveyForm.classList.remove('show');
    
    if (formType === 'register') {
        // 登録フォームを表示
        console.log('Showing register form');
        registerForm.classList.add('show');
        document.getElementById('formTitle').textContent = 'イベント参加登録';
    } else if (formType === 'survey') {
        // アンケートフォームを表示
        console.log('Showing survey form');
        surveyForm.classList.add('show');
        document.getElementById('formTitle').textContent = 'イベント完了後アンケート';
    }
    
    // 表示後の状態を確認
    console.log('Form visibility after update:', {
        register: {
            display: window.getComputedStyle(registerForm).display,
            classList: registerForm.classList.toString(),
            computedVisibility: window.getComputedStyle(registerForm).visibility
        },
        survey: {
            display: window.getComputedStyle(surveyForm).display,
            classList: surveyForm.classList.toString(),
            computedVisibility: window.getComputedStyle(surveyForm).visibility
        }
    });
}

// フォーム送信処理
async function onSubmit(event) {
    event.preventDefault();
    console.log('Form submission started');

    const formType = getFormType();
    console.log('Form type:', formType);

    let data = {};
    let missingFields = [];

    if (formType === 'register') {
        // 登録フォームの処理
        const fields = {
            email: 'form_answer01',
            password: 'form_answer20',
            password_confirm: 'form_answer21',
            telNumber: 'form_answer02',
            lastName: 'form_answer03',
            firstName: 'form_answer04',
            lastNameRead: 'form_answer05',
            firstNameRead: 'form_answer06',
            birthYear: 'form_answer07',
            birthMonth: 'form_answer08',
            birthDay: 'form_answer09',
            university: 'form_answer10'
        };

        // パスワード確認
        const password = document.getElementById(fields.password).value;
        const passwordConfirm = document.getElementById(fields.password_confirm).value;

        if (password !== passwordConfirm) {
            alert('パスワードが一致しません。');
            return;
        }

        // 必須フィールドの確認と値の取得
        for (const [key, id] of Object.entries(fields)) {
            const element = document.getElementById(id);
            if (!element || !element.value.trim()) {
                missingFields.push(key);
            } else {
                data[key] = element.value.trim();
            }
        }
    } else if (formType === 'survey') {
        // アンケートフォームの処理
        const satisfaction = document.getElementById('form_satisfaction');
        const feedback = document.getElementById('form_feedback');

        if (!satisfaction || !satisfaction.value) {
            missingFields.push('satisfaction');
        } else {
            data.satisfaction = satisfaction.value;
        }

        if (!feedback || !feedback.value.trim()) {
            missingFields.push('feedback');
        } else {
            data.feedback = feedback.value.trim();
        }
    }

    if (missingFields.length > 0) {
        alert(`以下の必須項目が未入力です：\n${missingFields.join('\n')}`);
        return;
    }

    try {
        console.log('Sending data:', data);
        await sendData(data, formType);
        console.log('Data sent successfully');
        
        // フォーム送信成功後の処理
        if (formType === 'register') {
            alert('登録が完了しました。');
        } else {
            alert('アンケートの回答ありがとうございました。');
        }
        
        // LINEメッセージの送信
        const message = formType === 'register' ? 
            'イベントの登録が完了しました。' : 
            'アンケートの回答ありがとうございました。';
        
        await sendText(message);
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('送信中にエラーが発生しました。もう一度お試しください。');
    }
}

// データをサーバーに送信する関数
async function sendData(data, formType) {
    try {
        console.log('Sending data:', { formType, data });
        
        // APIエンドポイントの設定
        const endpoint = formType === 'register' ? 
            'https://script.google.com/macros/s/YOUR_REGISTER_DEPLOYMENT_ID/exec' :
            'https://script.google.com/macros/s/YOUR_SURVEY_DEPLOYMENT_ID/exec';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: formType,
                ...data
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Server response:', result);

        // フォームのリセット
        const form = document.querySelector(`.form.${formType}-only`);
        if (form) {
            form.reset();
        }

        return result;
    } catch (error) {
        console.error('Error in sendData:', error);
        throw error;
    }
}

// フォーム送信のイベントリスナーを設定
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('.form.register-only');
    const surveyForm = document.querySelector('.form.survey-only');

    if (registerForm) {
        registerForm.addEventListener('submit', onSubmit);
    }
    if (surveyForm) {
        surveyForm.addEventListener('submit', onSubmit);
    }
});
