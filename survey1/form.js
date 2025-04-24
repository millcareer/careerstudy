// アンケート1のフォームを作成（既存のフォーム）
function createSurvey1Form(container) {
    // 既存のフォームHTMLを生成
    container.innerHTML = `
    <div class="form">
        <!-- 既存のフォーム内容をそのまま流用 -->
        <p class="form-text">メールアドレス</p>
        <input type="email" name="email" id="form_answer01" pattern=".+@.+\\..+" required="required" placeholder="例：example@example.com">
        <div class="form-group">
            <label for="form_answer20" class="form-text">パスワード設定</label>
            <input type="password" name="password" id="form_answer20" required="required" minlength="8" placeholder="8文字以上で入力してください">
            <p class="password-hint">・英字／数字を含む8文字以上で設定してください</p>
            <p class="password-hint">・キャリアアプリのログインに用います。忘れずにおぼえておきましょう。</p>
        </div>
        <div class="form-group">
            <label for="form_answer21" class="form-text">パスワード確認</label>
            <input type="password" name="password_confirm" id="form_answer21" required="required" minlength="8" placeholder="確認のため再入力してください">
        </div>
        <p class="form-text">携帯電話番号</p>
        <input type="text" name="telNumber" id="form_answer02" pattern="\\d{1,5}-\\d{1,4}-\\d{4,5}" required="required" placeholder="例：000-0000-0000">
        <p class="form-text">氏名</p>
        <div class="form-name">
            <input type="text" name="last_name" id="form_answer03" required="required" placeholder="姓">
            <input type="text" name="first_name" id="form_answer04" required="required" placeholder="名前">
        </div>
        <p class="form-text">フリガナ</p>
        <div class="form-name">
            <input type="text" name="last_name_read" id="form_answer05" required="required" placeholder="みょうじ">
            <input type="text" name="first_name_read" id="form_answer06" required="required" placeholder="なまえ">
        </div>
        <p class="form-text">生年月日</p>
        <div class="form-select-wrap">
            <select class="birthday-year" id="form_answer07" required="required">
            </select>
            / 
            <select class="birthday-month" id="form_answer08" required="required">
            </select>
            /
            <select class="birthday-day" id="form_answer09" required="required">
            </select>
        </div>
        <p class="form-text">大学名
        <font size="1">※入力すると予測が表示されます。</font></p>
        <input type="text" name="university-name" id="form_answer10" list="university" placeholder="大学名" autocomplete="off" required="required">
        　<datalist id="university">
            <!-- 大学リストはchoices.jsから動的に生成 -->
        </datalist>

        <p class="form-text">部活名</p>
        <select name="club-name" id="form_answer11" required="required">
            <!-- 部活リストはchoices.jsから動的に生成 -->
        </select>

        <p class="form-text">学年</p>
        <select name="grade" id="form_answer12" required="required">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>修1</option>
            <option>修2</option>
        </select>
        <p class="form-text">性別</p>
        <select name="sex" id="form_answer13" required="required">
            <option>男性</option>
            <option>女性</option>
            <option>その他</option>
            <option>回答しない</option>
        </select>
        <p class="form-text">出身地</p>
        <select name="from_area" id="form_answer14" required="required">
            <!-- 出身地リストはchoices.jsから動的に生成 -->
        </select>

        <p class="form-text">役職</p>
        <select name="role" id="form_answer15" required="required">
            <option>主将/主務</option>
            <option>副将</option>
            <option>主将</option>
            <option>副務</option>
            <option>幹事</option>
            <option>三役</option>
            <option>三回</option>
            <option>その他</option>
            <option>特になし</option>
        </select>
        <p class="form-text">学部</p>
        <input type="text" name="faculty" id="form_answer16" required="required" minlength="1">
        <p class="form-text">学科</p>
        <input type="text" name="department" id="form_answer17" required="required" minlength="1">
        <p class="form-text">学習形態</p>
        <select name="role" id="form_answer18" required="required">
            <option>文系</option>
            <option>理系（スポーツ系）</option>
            <option>理系（医歯系）</option>
            <option>理系（情報系）</option>
            <option>理系（工学系）</option>
            <option>理系（その他）</option>
        </select>
        
        <!-- 個人情報同意セクション -->
        <p class="form-text">個人情報同意</p>
 <div style="height: 150px; overflow-y: scroll; border: 1px solid #ccc; padding: 10px;">
     <p style="text-align: left;">
  個人情報取扱指針<br>
 【1】個人情報取扱いに関する基本指針<br>
 株式会社Mill Career（以下「当社」という）は、以下のとおり個人情報取扱指針を定め、個人情報取扱の徹底を図り、全社的に個人情報取扱の重要性の認識と取組みを促進させ、個人情報の保護を推進したします。<br>
 当社は利用目的を明示した上で個人情報を取得し、目的の範囲内に留め、個人情報を利用いたします。また、利用目的の範囲を超えて個人情報の利用を行わないよう、内部の管理体制の整備および外部委託先の監督をもって進めます。<br>
 <br>
 【2】定義<br>
 個人情報とは、個人に関する情報であって、その情報を構成する氏名、住所、電話番号、メールアドレス、所属組織、生年月日その他の記述等により個人を識別できるものを言います。また、その情報のみでは識別できない場合でも、他の情報と照合することで識別できる場合も個人情報に含まれます。<br>
 <br>
 【3】個人情報の利用目的<br>
 個人情報の取得と利用の目的および利用範囲は以下のとおりです。<br>
 当社によるお客様向けのサービス提供 （お客様の情報の収集に基づき、本サービスを通じた利用一部へのご案内（本サービスを通じたマッチング利用一部へのエントリー、イベント参加一般ないしイベント参加一部への個人情報提供とみなします））<br>
 　1.当社およびその関連会社が提供するサービスのご案内や情報<br>
 　2.アンケートのご回答協力やアンケート結果の集計、キャンペーンの告知、プレゼント送付など<br>
 　3.属性情報・履歴情報など基づく商品・コンテンツの最適化・表示<br>
 　4.有料コンテンツ作成の参画対象の選定<br>
 　5.本サービス提供、お客様からのお問合せ、マーケティング対象の確定、商品開発、品質向上 当社サービス提供、お客様からのお問合せへの対応のために必要な業務処理<br>
 　6.利用統計などで特定の個人を識別できない形式による情報の提供<br>
 　7.その他上記に準ずる業務<br>
 <br>
 【4】第三者への個人情報の提供について<br>
 当社は、取得した個人情報の第三者への提供は、法令の定めがある場合を除き、以下の場合に限り行います。<br>
 　1.ユーザ本人または第三者の生命、身体、財産そのほかの権利を保護するおそれがある場合<br>
 　2.本サービスの健全な運営に支障をきたすおそれがある場合 他の法令に反することとなる場合<br>
 なお、上記個人情報の取扱い等に多大の危険を要する場合–その他、個人情報の取扱いの例外を行うことが適当な場合であって、当社の判断により例外の適用を認めると判断した場合は、当社の責任においてこれに関わる情報の取得や開示を行わないことがあります。また、当社は、サイト内で記述した個人情報に関して、多重アカウントを禁止する目的や、当社の業務の遂行に支障をきたす行為などを見出した場合に照らし、これに関わる情報の削除や修正をする場合があります。<br>
 <br>
 【5】個人情報の取扱いに関する例外事項<br>
 以下の場合は、個人情報の取扱いに関する保護対象から除外されるものとします。<br>
 　1.ユーザ本人または第三者の生命、身体、財産そのほかの権利を保護するおそれがある場合<br>
 　2.本サービスの健全な運営に支障をきたすおそれがある場合 他の法令に反することとなる場合<br>
 なお、上記個人情報の取扱い等に多大の危険を要する場合–その他、個人情報の取扱いの例外を行うことが適当な場合であって、当社の判断により例外の適用を認めると判断した場合は、当社の責任においてこれに関わる情報の取得や開示を行わないことがあります。また、当社は、サイト内で記述した個人情報に関して、多重アカウントを禁止する目的や、当社の業務の遂行に支障をきたす行為などを見出した場合に照らし、これに関わる情報の削除や修正をする場合があります。<br>
 <br>
 【6】クッキー<br>
 当社のウェブサイトでは、本サービスの利用規約に関する情報の取得や、よりよいものにマッチング利用一部やイベント参加一部への個人情報提供のためにクッキー情報やウェブビーコンを使用しています。お客様のブラウザからのアクセスおよび、お客様が明示的に当社ウェブサイトを利用したことが分かるかどうかを確認する他、お客様のプライバシやセキュリティ、利用統計データの取得など使用しております。<br>
 なお、ほとんどのブラウザでは、初期設定からクッキーの無効化や削除をすることが可能です。ただし、クッキーの機能の一部は、無効の場合、利用できなくなることがありますので、ご注意ください。<br>
 <br>
 【7】第三者データの取得に関する例外事項<br>
 当社のサービスでは、本サービスの利用規約に関する情報の取得や、よりよいものにマッチング利用一部やイベント参加一部への個人情報提供のためにクッキー情報やウェブビーコンを使用しています。お客様のブラウザからのアクセスおよび、お客様が明示的に当社ウェブサイトを利用したことが分かるかどうかを確認する他、お客様のプライバシやセキュリティ、利用統計データの取得など使用しております。<br>
 なお、ほとんどのブラウザでは、初期設定からクッキーの無効化や削除をすることが可能です。ただし、クッキーの機能の一部は、無効の場合、利用できなくなることがありますので、ご注意ください。<br>
 <br>
 【8】第三者データの取得に関する例外事項<br>
 当社は、個人情報の取扱いに関する保護対象から除外されるものとします。<br>
 　1.ユーザ本人または第三者の生命、身体、財産そのほかの権利を保護するおそれがある場合<br>
 　2.本サービスの健全な運営に支障をきたすおそれがある場合 他の法令に反することとなる場合<br>
 なお、上記個人情報の取扱い等に多大の危険を要する場合–その他、個人情報の取扱いの例外を行うことが適当な場合であって、当社の判断により例外の適用を認めると判断した場合は、当社の責任においてこれに関わる情報の取得や開示を行わないことがあります。また、当社は、サイト内で記述した個人情報に関して、多重アカウントを禁止する目的や、当社の業務の遂行に支障をきたす行為などを見出した場合に照らし、これに関わる情報の削除や修正をする場合があります。<br>
 <br>
 【9】個人情報提供の任意性<br>
 当社のサービスでは提供を求める全ての要素についておたずねいただかなくても結構ですが、必要となる情報が不足している場合は、本サービスを受けられないことがあります。<br>
 <br>
 【10】本社が識別できない方法による個人情報の取得について<br>
 本サイトにおいて、サイトの使い勝手を向上させる目的や、アクセス解析などの統計的情報を取得する目的で、クッキーやウェブビーコン、ブラウザからの端末情報など用いることがありますが、そのような情報の使用によって、ユーザが入力していない個人情報を取得することはありません。<br>
 <br>
 【11】プライバシーポリシーの改訂について<br>
 当社は、個人情報の取取扱いに関する法定義務を見直し、随時的な変更に取り組むものとし、必要に応じて、本ポリシーの全部または一部を改訂することがあります。改訂後の内容は、サイト内で告知された時点から適用されるものとしますので、定期的にチェックすることをお勧めします。<br>
 <br>
 【12】個人情報の取扱いに関する同意<br>
 名称 株式会社Mill Career 個人情報取扱責任者 担当 info@millcareer.com<br>
 最終改訂 2023 年 04 月 01 日<br>
   </p>
 </div>
 <p>
    <input type="checkbox" name="agreement" id="form_answer19" value="同意する" required="required">
   <label for="form_answer19">同意する</label>
 </p>

        <!-- イベント選択セクション -->
        <p class="form-text">INTERN QUEST参加予定</p>
        <div style="margin-bottom: 10px;">
            <p>下記から参加する日程を<span style="color: #fcac04; font-weight: bold;">2つ</span>選択してください</p>
        </div>
        
        <!-- イベント選択肢表示エリア -->
        <div id="event-options-list"></div>
        
        <!-- GASから取得したデータを表示するエリア -->
        <div id="gas-data-container" class="mt-3 mb-3 p-3 border rounded bg-light">
            <!-- GASからのデータがここに表示されます -->
        </div>
        
        <!-- 選択済みイベント表示エリア -->
        <div style="margin-top: 20px;">
            <p class="form-text">選択した日程</p>
            <p id="selection_count" style="color: #fcac04; margin-bottom: 10px;">選択数: 0/2</p>
            <div id="selected-events-list"></div>
        </div>
        
        <!-- 送信ボタン -->
        <div style="text-align: center; margin-top: 30px;">
            <button onclick="return onSubmit()" class="btn btn-primary" style="padding: 10px 40px; font-size: 18px;">送信する</button>
        </div>
    </div>
    `;
    
    // 選択肢データの初期化（choices.jsの関数を呼び出し）
    initializeChoices();
    
    // 既存のスクリプトから生年月日セレクトボックスの生成
    setupBirthdaySelects();
    
    // イベント情報の取得とUI作成（共通関数を呼び出し）
    if (typeof fetchUpcomingEvents === 'function') {
        console.log('イベント情報を取得します（survey1/form.js）');
        fetchUpcomingEvents().then(function() {
            // イベント情報の取得後にGASからのデータを取得
            fetchGASData();
        });
    } else {
        console.error('fetchUpcomingEvents関数が見つかりません。common/events.jsが正しく読み込まれているか確認してください。');
        // フォールバック: 初期UIだけでも設定
        if (typeof setupInitialEventUI === 'function') {
            setupInitialEventUI();
            // イベントUI設定後にGASからのデータを取得
            fetchGASData();
        } else {
            // どちらの関数も利用できない場合は直接GASデータを取得
            fetchGASData();
        }
    }
}

// GASからデータを取得し表示する関数
function fetchGASData() {
    // データコンテナの取得
    const gasDataContainer = document.getElementById('gas-data-container');
    if (!gasDataContainer) return;
    
    // タイトル追加
    const title = document.createElement('h5');
    title.textContent = 'GASから取得したデータ';
    title.className = 'mb-2';
    
    // 説明文追加
    const description = document.createElement('p');
    description.textContent = '下記は利用可能な日程のJSONデータです。上の選択肢から実際に参加したい日程を選択してください。';
    description.className = 'mb-2';
    
    // ローディング表示
    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'text-center';
    loadingContainer.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p>データ取得中...</p>';
    
    // コンテナをクリアして新しい要素を追加
    gasDataContainer.innerHTML = '';
    gasDataContainer.appendChild(title);
    gasDataContainer.appendChild(description);
    gasDataContainer.appendChild(loadingContainer);
    
    // JSONPリクエスト用のコールバック名を生成
    const callbackName = 'gasJsonCallback_' + Date.now();
    
    // グローバルコールバック関数を設定
    window[callbackName] = function(data) {
        // ローディング表示を削除
        loadingContainer.remove();
        
        // データが正常に取得できたかチェック
        if (data && (Array.isArray(data) || typeof data === 'object')) {
            console.log('GASから取得したデータ:', JSON.stringify(data, null, 2));
            
            // 既存のdisplayJsonPicker関数を使用してデータを表示
            if (typeof displayJsonPicker === 'function') {
                // 配列でない場合は配列に変換
                const dataArray = Array.isArray(data) ? data : [data];
                
                // JSONデータをピッカーで表示
                const jsonContainer = displayJsonPicker(dataArray);
                
                // 既存のjson-picker-containerがある場合はそれを利用
                const existingContainer = document.getElementById('json-picker-container');
                if (existingContainer) {
                    // 既存のコンテナを新しいものに置き換え
                    existingContainer.parentNode.replaceChild(jsonContainer, existingContainer);
                } else {
                    // なければGASデータコンテナに追加
                    gasDataContainer.appendChild(jsonContainer);
                }
            } else {
                // displayJsonPicker関数がない場合は独自に表示
                const jsonDisplay = document.createElement('div');
                jsonDisplay.className = 'p-3 border rounded bg-light';
                
                // JSONデータ表示用のセレクトボックス
                const select = document.createElement('select');
                select.className = 'form-select mb-2';
                select.multiple = true;
                select.size = 5; // 5行表示
                
                // データをオプションとして追加
                const dataArray = Array.isArray(data) ? data : [data];
                dataArray.forEach((item, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = item.choice_text || item.title || JSON.stringify(item).substring(0, 50) + '...';
                    select.appendChild(option);
                });
                
                // 選択肢表示エリア
                const detailContainer = document.createElement('div');
                detailContainer.className = 'mt-2 p-2 border rounded bg-white';
                detailContainer.style.maxHeight = '150px';
                detailContainer.style.overflowY = 'auto';
                
                const pre = document.createElement('pre');
                pre.style.margin = '0';
                pre.style.fontSize = '0.8rem';
                pre.textContent = '← 上のリストから選択すると詳細が表示されます';
                
                // 選択した項目の詳細を表示するイベントリスナー
                select.addEventListener('change', function() {
                    const selectedOptions = Array.from(this.selectedOptions);
                    if (selectedOptions.length > 0) {
                        const selectedIndices = selectedOptions.map(option => parseInt(option.value));
                        const selectedItems = selectedIndices.map(index => dataArray[index]);
                        pre.textContent = JSON.stringify(selectedItems, null, 2);
                    } else {
                        pre.textContent = '← 上のリストから選択すると詳細が表示されます';
                    }
                });
                
                detailContainer.appendChild(pre);
                jsonDisplay.appendChild(select);
                jsonDisplay.appendChild(detailContainer);
                gasDataContainer.appendChild(jsonDisplay);
            }
        } else {
            // データがない、またはエラーの場合
            const errorMsg = document.createElement('div');
            errorMsg.className = 'alert alert-warning';
            errorMsg.textContent = 'GASからデータを取得できませんでした。デフォルトの選択肢から選んでください。';
            gasDataContainer.appendChild(errorMsg);
        }
    };
    
    // エラーハンドラ
    const handleError = function() {
        loadingContainer.remove();
        const errorMsg = document.createElement('div');
        errorMsg.className = 'alert alert-danger';
        errorMsg.textContent = 'GASからのデータ取得中にエラーが発生しました。デフォルトの選択肢から選んでください。';
        gasDataContainer.appendChild(errorMsg);
    };
    
    // JSONPリクエスト用のscriptタグを作成
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://script.google.com/macros/s/AKfycbzZemROe3jxhKdsvKqUwlLK6lRqrKk4DPTUMn5yyKwK4fp9r-ewqItfautobpWsT7LO2g/exec?from=json_picker&callback=' + callbackName;
    scriptTag.onerror = handleError;
    
    // スクリプトタグをドキュメントに追加してリクエスト実行
    document.body.appendChild(scriptTag);
}
