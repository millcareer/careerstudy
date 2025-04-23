// LIFFの基本情報
document.addEventListener('DOMContentLoaded', function() {
    // liffId: LIFF URL "https://liff.line.me/xxx"のxxxに相当する記号
    // LINE DevelopersのLIFF画面より認証可能
    var liffId = "1660795452-nYx391B8";
    console.log(`init liff, ID : ${liffId}`);
    
    // グローバル変数にLIFF SDKが読み込まれているか確認するデバッグコード
    console.log("LIFF SDK確認:", typeof liff);
    if (typeof liff === 'undefined') {
        console.error("LIFF SDKが読み込まれていません。index.htmlでSDKのscriptタグが正しく設定されているか確認してください。");
        showDebugInfo("LIFF SDKが読み込まれていません");
        return;
    }
    
    // LIFF初期化（ここでエラーが発生する可能性がある）
    initializeLiff(liffId);
});

// index.htmlのsubimtで呼び出される関数
function sendText(text) {
    console.log("sendText関数が呼び出されました:", text);
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
        console.error('メッセージ送信エラー:', error);
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
        console.error('シェアターゲットピッカーエラー:', error);
        window.alert('Failed to send message ' + error);
    });
}

function initializeLiff(liffId) {
    console.log("LIFF初期化を開始します...");
    liff
        .init({ liffId })
        .then(() => {
            console.log("LIFF初期化成功!");
            handleLiffInitializationSuccess();
        })
        .catch((err) => {
            console.error("LIFF初期化失敗:", err);
            handleLiffInitializationFailure(err);
        });
}

function handleLiffInitializationSuccess() {
    console.log("LIFF初期化成功ハンドラーが呼び出されました");
    console.log("isInClient:", liff.isInClient());
    console.log("isLoggedIn:", liff.isLoggedIn());
    
    if (!liff.isInClient() && !liff.isLoggedIn()) {
        console.log("LINEアカウントへのログインが必要です");
        window.alert("LINEアカウントにログインしてください。");
        liff.login({ redirectUri: location.href });
    } else {
        console.log('Login Success');
        
        // ローディング表示を非表示にし、フォームコンテナを表示
        document.getElementById('loading').style.display = 'none';
        const formContainer = document.getElementById('form-container');
        if (formContainer) {
            formContainer.style.display = 'block';
            
            // フォームを生成
            console.log("createSurvey1Form関数の存在確認:", typeof createSurvey1Form);
            if (typeof createSurvey1Form === 'function') {
                console.log("フォームを生成します...");
                createSurvey1Form(formContainer);
                console.log("フォーム生成完了");
            } else {
                console.error("createSurvey1Form関数が見つかりません。survey1/form.jsが正しく読み込まれているか確認してください。");
                showDebugInfo("createSurvey1Form関数が見つかりません");
            }
        } else {
            console.error("form-containerが見つかりません");
            showDebugInfo("form-containerが見つかりません");
        }
    }
}

function handleLiffInitializationFailure(err) {
    console.error('LIFF Initialization failed: ', err);
    window.alert('アプリケーションの初期化に失敗しました。後ほど再実行してください。');
    
    // エラーが発生してもフォームを表示する試み
    document.getElementById('loading').style.display = 'none';
    const formContainer = document.getElementById('form-container');
    if (formContainer) {
        formContainer.style.display = 'block';
        
        // エラー情報を表示
        showDebugInfo("LIFF初期化失敗: " + JSON.stringify(err));
        
        // フォームの表示を試みる
        if (typeof createSurvey1Form === 'function') {
            try {
                createSurvey1Form(formContainer);
            } catch (formError) {
                console.error("フォーム生成エラー:", formError);
                showDebugInfo("フォーム生成エラー: " + formError.message);
            }
        }
    }
}

// デバッグ情報表示関数
function showDebugInfo(message) {
    console.log("デバッグ情報:", message);
    const formContainer = document.getElementById('form-container');
    if (formContainer) {
        const debugDiv = document.createElement('div');
        debugDiv.style.background = '#ffeeee';
        debugDiv.style.color = '#ff0000';
        debugDiv.style.padding = '10px';
        debugDiv.style.margin = '10px 0';
        debugDiv.style.border = '1px solid #ff0000';
        debugDiv.innerHTML = '<h3>デバッグ情報</h3><p>' + message + '</p>';
        formContainer.prepend(debugDiv);
    }
    
    // ローディング表示を非表示に
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}
