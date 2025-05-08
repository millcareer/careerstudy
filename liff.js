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

// index.htmlのsubimtで呼び出される関数
function sendText(text) {
    // 登録用としてメッセージを加工
    const prefix = '[登録]';
    const finalText = `${prefix} ${text}`;

    sendMessages(finalText);
}

// LINEトーク画面上でメッセージ送信
function sendMessages(text) {
    console.log('in sendMessages()');
    if (!liff.isInClient()) {
        console.log('外部ブラウザからの実行なのでメッセージ送信をスキップ');
        return;
    }

    liff.sendMessages([{
        'type': 'text',
        'text': text
    }]).then(function () {
        liff.closeWindow();
    }).catch(function (error) {
        window.alert('Failed to send message ' + error);
    });
}

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
        // 単一フォームのため初期化処理は不要
        document.getElementById('register-form').style.display = 'block';
    }
}

function handleLiffInitializationFailure(err) {
    console.error('LIFF Initialization failed: ', err);
    window.alert('アプリケーションの初期化に失敗しました。後ほど再試行してください。');
}
