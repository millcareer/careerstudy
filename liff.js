function sendMessageToLine(text) {
    if (!liff.isInClient()) {
        openShareTargetPicker(text);
    } else {
        sendTextMessage(text);
    }
}
window.sendMessageToLine = sendMessageToLine;

$(document).ready(function () {
    // liffId: LIFF URL "https://liff.line.me/xxx"のxxxに該当する箇所
    // LINE DevelopersのLIFF画面より確認可能
    const LIFF_ID = "YOUR_LIFF_ID_HERE"; 
    initializeLiff(LIFF_ID);

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
    }
}

function handleLiffInitializationFailure(err) {
    console.error('LIFF Initialization failed: ', err);
    window.alert('アプリケーションの初期化に失敗しました。後ほど再試行してください。');
}

function sendMessageToLine(text) {
    if (!liff.isInClient()) {
        openShareTargetPicker(text);
    } else {
        sendTextMessage(text);
    }
}

function sendTextMessage(text) {
    console.log('Sending message...');
    liff.sendMessages([{ type: 'text', text }])
        .then(() => {
            liff.closeWindow();
        })
        .catch((error) => {
            console.error('Failed to send message: ', error);
            window.alert('メッセージの送信に失敗しました。');
        });
}

function openShareTargetPicker(text) {
    console.log('Opening Share Target Picker...');
    liff.shareTargetPicker([{ type: 'text', text }])
        .catch((error) => {
            console.error('Failed to open Share Target Picker: ', error);
            window.alert('シェアターゲットピッカーの開始に失敗しました。');
        });
}

