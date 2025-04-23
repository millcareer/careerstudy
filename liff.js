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
    
    // 必要な関数が定義されているか確認
    console.log("setupBirthdaySelects関数確認:", typeof setupBirthdaySelects);
    if (typeof setupBirthdaySelects === 'undefined') {
        console.error("setupBirthdaySelects関数が見つかりません。common/birthday.jsが正しく読み込まれているか確認してください。");
        showDebugInfo("setupBirthdaySelects関数が見つかりません");
        
        // setupBirthdaySelects関数がない場合は簡易版を定義
        window.setupBirthdaySelects = function() {
            console.log("簡易版setupBirthdaySelects関数が実行されました");
            const yearSelect = document.querySelector('.birthday-year');
            const monthSelect = document.querySelector('.birthday-month');
            const daySelect = document.querySelector('.birthday-day');
            
            if (yearSelect) {
                // 年を追加（2000年から1950年まで）
                for (let year = 2000; year >= 1950; year--) {
                    const option = document.createElement('option');
                    option.value = year;
                    option.textContent = year;
                    yearSelect.appendChild(option);
                }
            }
            
            if (monthSelect) {
                // 月を追加（1月から12月）
                for (let month = 1; month <= 12; month++) {
                    const option = document.createElement('option');
                    option.value = month;
                    option.textContent = month;
                    monthSelect.appendChild(option);
                }
            }
            
            if (daySelect) {
                // 日を追加（1日から31日）
                for (let day = 1; day <= 31; day++) {
                    const option = document.createElement('option');
                    option.value = day;
                    option.textContent = day;
                    daySelect.appendChild(option);
                }
            }
            
            console.log("簡易版setupBirthdaySelects関数の実行が完了しました");
        };
    }
    
    // initializeChoices関数の確認
    console.log("initializeChoices関数確認:", typeof initializeChoices);
    if (typeof initializeChoices === 'undefined') {
        console.error("initializeChoices関数が見つかりません。survey1/choices.jsが正しく読み込まれているか確認してください。");
        showDebugInfo("initializeChoices関数が見つかりません");
        
        // initializeChoices関数がない場合は簡易版を定義
        window.initializeChoices = function() {
            console.log("簡易版initializeChoices関数が実行されました");
            console.log("簡易版initializeChoices関数の実行が完了しました");
        };
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
        
        try {
            // ローディング表示を非表示にし、フォームコンテナを表示
            document.getElementById('loading').style.display = 'none';
            const formContainer = document.getElementById('form-container');
            if (formContainer) {
                formContainer.style.display = 'block';
                
                // フォームを生成
                console.log("createSurvey1Form関数の存在確認:", typeof createSurvey1Form);
                if (typeof createSurvey1Form === 'function') {
                    console.log("フォームを生成します...");
                    try {
                        createSurvey1Form(formContainer);
                        console.log("フォーム生成完了");
                    } catch (error) {
                        console.error("フォーム生成中にエラーが発生しました:", error);
                        showDebugInfo("フォーム生成エラー: " + error.message);
                        
                        // エラーが発生してもシンプルなフォームを表示
                        showSimpleForm(formContainer);
                    }
                } else {
                    console.error("createSurvey1Form関数が見つかりません。survey1/form.jsが正しく読み込まれているか確認してください。");
                    showDebugInfo("createSurvey1Form関数が見つかりません");
                    
                    // フォーム関数がない場合はシンプルなフォームを表示
                    showSimpleForm(formContainer);
                }
            } else {
                console.error("form-containerが見つかりません");
                showDebugInfo("form-containerが見つかりません");
            }
        } catch (error) {
            console.error("予期せぬエラーが発生しました:", error);
            showDebugInfo("予期せぬエラー: " + error.message);
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
                
                // エラーが発生した場合はシンプルなフォームを表示
                showSimpleForm(formContainer);
            }
        } else {
            // フォーム関数がない場合はシンプルなフォームを表示
            showSimpleForm(formContainer);
        }
    }
}

// シンプルなフォームを表示する関数
function showSimpleForm(container) {
    console.log("シンプルなフォームを表示します");
    container.innerHTML = `
    <div class="container mt-4">
        <div class="alert alert-warning">
            <strong>注意:</strong> 通常のフォームの読み込みに失敗しました。簡易フォームを表示しています。
        </div>
        <form id="simple-form" class="needs-validation" novalidate>
            <div class="mb-3">
                <label for="email" class="form-label">メールアドレス</label>
                <input type="email" class="form-control" id="email" required>
            </div>
            <div class="mb-3">
                <label for="name" class="form-label">お名前</label>
                <input type="text" class="form-control" id="name" required>
            </div>
            <div class="mb-3">
                <label for="tel" class="form-label">電話番号</label>
                <input type="tel" class="form-control" id="tel" required>
            </div>
            <div class="mb-3">
                <label for="university" class="form-label">大学名</label>
                <input type="text" class="form-control" id="university" required>
            </div>
            <div class="mb-3">
                <label for="message" class="form-label">メッセージ</label>
                <textarea class="form-control" id="message" rows="3"></textarea>
            </div>
            <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="agree" required>
                <label class="form-check-label" for="agree">
                    個人情報の取り扱いに同意します
                </label>
            </div>
            <button type="submit" class="btn btn-primary">送信する</button>
        </form>
    </div>
    `;
    
    // フォーム送信イベントのハンドリング
    const form = document.getElementById('simple-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            alert('送信ありがとうございます。担当者からご連絡いたします。');
        });
    }
    
    console.log("シンプルなフォームの表示が完了しました");
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
    
    // デバッグコンテナがあれば表示
    const debugContainer = document.getElementById('debug-container');
    if (debugContainer) {
        debugContainer.style.display = 'block';
        const debugContent = document.getElementById('debug-content');
        if (debugContent) {
            debugContent.innerHTML += '<p>' + message + '</p>';
        }
    }
}
