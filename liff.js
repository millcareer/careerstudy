// LIFFの基本情報
$(document).ready(function () {
    // liffId: LIFF URL "https://liff.line.me/xxx"のxxxに該当する箇所
    // LINE DevelopersのLIFF画面より確認可能
    var liffId = "1660795452-nYx391B8";
    console.log(`init liff, ID : ${liffId}`);
    initializeLiff(liffId);
})

// index.htmlのsubimtで呼び出される関数
function sendText(text) {
    if (!liff.isInClient()) {
        shareTargetPicker(text);
    } else {
        sendMessages(text);
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
