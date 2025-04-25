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
    console.log('=== Form Initialization Debug ===');
    console.log('1. Initial state');
    console.log('Document ready state:', document.readyState);
    console.log('Current URL:', window.location.href);
    console.log('Form type:', formType);
    
    const registerForm = document.querySelector('.form.register-only');
    const surveyForm = document.querySelector('.form.survey-only');
    
    console.log('2. Form elements found:');
    console.log('Register form:', {
        exists: !!registerForm,
        id: registerForm?.id,
        classList: registerForm?.classList.toString(),
        display: registerForm ? window.getComputedStyle(registerForm).display : null,
        visibility: registerForm ? window.getComputedStyle(registerForm).visibility : null
    });
    console.log('Survey form:', {
        exists: !!surveyForm,
        id: surveyForm?.id,
        classList: surveyForm?.classList.toString(),
        display: surveyForm ? window.getComputedStyle(surveyForm).display : null,
        visibility: surveyForm ? window.getComputedStyle(surveyForm).visibility : null
    });
    
    if (!registerForm || !surveyForm) {
        console.error('3. Error: Required form elements not found!');
        console.log('All form elements:', Array.from(document.querySelectorAll('.form')).map(form => ({
            id: form.id,
            classList: form.classList.toString(),
            display: window.getComputedStyle(form).display,
            visibility: window.getComputedStyle(form).visibility,
            html: form.outerHTML
        })));
        return;
    }
    
    console.log('3. Updating form visibility');
    // まずすべてのフォームからshowクラスを削除
    registerForm.classList.remove('show');
    surveyForm.classList.remove('show');
    
    if (formType === 'register') {
        console.log('4. Showing register form');
        registerForm.classList.add('show');
        document.getElementById('formTitle').textContent = '情報登録フォーム';
    } else if (formType === 'survey') {
        console.log('4. Showing survey form');
        surveyForm.classList.add('show');
        document.getElementById('formTitle').textContent = '終了後アンケート';
    }
    
    // 表示後の状態を確認
    console.log('5. Final form states:');
    console.log('Register form:', {
        classList: registerForm.classList.toString(),
        display: window.getComputedStyle(registerForm).display,
        visibility: window.getComputedStyle(registerForm).visibility,
        offsetHeight: registerForm.offsetHeight,
        clientHeight: registerForm.clientHeight
    });
    console.log('Survey form:', {
        classList: surveyForm.classList.toString(),
        display: window.getComputedStyle(surveyForm).display,
        visibility: window.getComputedStyle(surveyForm).visibility,
        offsetHeight: surveyForm.offsetHeight,
        clientHeight: surveyForm.clientHeight
    });
    console.log('=== End Form Initialization Debug ===');
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
    const feedbackTextarea = document.getElementById('form_feedback');
    const currentCount = document.getElementById('current_count');
    const countMessage = document.getElementById('count_message');
    const minLength = 50;

    // 文字数カウント機能
    if (feedbackTextarea) {
        feedbackTextarea.addEventListener('input', function() {
            const length = this.value.length;
            currentCount.textContent = length;
            
            if (length < minLength) {
                this.classList.remove('valid');
                this.classList.add('invalid');
                countMessage.classList.remove('success');
                countMessage.classList.add('error');
                countMessage.textContent = `あと${minLength - length}文字必要です`;
            } else {
                this.classList.remove('invalid');
                this.classList.add('valid');
                countMessage.classList.remove('error');
                countMessage.classList.add('success');
                countMessage.textContent = '必要文字数を満たしています';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', onSubmit);
    }
    if (surveyForm) {
        surveyForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // フィードバックの文字数チェック
            const feedback = document.getElementById('form_feedback');
            if (feedback && feedback.value.length < minLength) {
                alert(`ご意見・ご感想は${minLength}文字以上で入力してください。`);
                return;
            }
            
            onSubmit(event);
        });
    }
});
