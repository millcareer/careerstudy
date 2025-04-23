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
            <p class="password-hint">※英字＋数字を含む8文字以上で設定してください</p>
            <p class="password-hint">※キャリアアプリのログインに用います。忘れずに覚えておきましょう。</p>
        </div>
        <div class="form-group">
            <label for="form_answer21" class="form-text">パスワード確認</label>
            <input type="password" name="password_confirm" id="form_answer21" required="required" minlength="8" placeholder="確認のため再入力してください">
        </div>
        <p class="form-text">携帯番号</p>
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
            <!-- 大学リストは既存のものを流用 -->
        </datalist>

        <p class="form-text">部活名</p>
        <select name="club-name" id="form_answer11" required="required">
            <!-- 部活リストは既存のものを流用 -->
        </select>

        <p class="form-text">学年</p>
        <select name="grade" id="form_answer12" required="required">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>院1</option>
            <option>院2</option>
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
            <!-- 出身地リストは既存のものを流用 -->
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
        <p class="form-text">学問系統</p>
        <select name="role" id="form_answer18" required="required">
            <option>文系</option>
            <option>理系（スポーツ系）</option>
            <option>理系（環境系）</option>
            <option>理系（医歯薬系）</option>
            <option>理系（化学系）</option>
            <option>理系（その他）</option>
        </select>
        
        <!-- イベント選択セクション -->
        <p class="form-text">INTERN QUEST参加予定</p>
        <div style="margin-bottom: 10px;">
            <p>下記から参加する日程を<span style="color: #fcac04; font-weight: bold;">2つ</span>選択してください</p>
        </div>
        
        <!-- イベント選択肢表示エリア -->
        <div id="event-options-list"></div>
        
        <!-- 選択済みイベント表示エリア -->
        <div style="margin-top: 20px;">
            <p class="form-text">選択した日程</p>
            <p id="selection_count" style="color: #fcac04; margin-bottom: 10px;">選択数: 0/2</p>
            <div id="selected-events-list"></div>
        </div>
        
        <!-- 個人情報同意セクション -->
        <p class="form-text">個人情報同意</p>
        <div style="height: 150px; overflow-y: scroll; border: 1px solid #ccc; padding: 10px;">
            <p style="text-align: left;">
              個人情報保護方針<br>
              【1】個人情報取り扱いに関する基本方針<br>
              <!-- 個人情報保護方針は既存のものを流用 -->
            </p>
        </div>
        <p>
            <input type="checkbox" name="agreement" id="form_answer19" value="同意する" required="required">
            <label for="form_answer19">同意する</label>
        </p>
        
        <!-- 送信ボタン -->
        <div style="text-align: center; margin-top: 30px;">
            <button onclick="return onSubmit()" class="btn btn-primary" style="padding: 10px 40px; font-size: 18px;">送信する</button>
        </div>
    </div>
    `;
    
    // 既存のスクリプトから生年月日セレクトボックスの生成
    setupBirthdaySelects();
    
    // イベント情報の取得とUI作成（既存の処理を呼び出し）
    fetchUpcomingEvents();
}

// 生年月日セレクトボックスを設定する関数（既存のスクリプトから流用）
function setupBirthdaySelects() {
    let yearSelect = document.getElementById('form_answer07');
    let monthSelect = document.getElementById('form_answer08');
    let daySelect = document.getElementById('form_answer09');

    if (yearSelect && monthSelect && daySelect) {
        // 年のセレクトオプションを生成
        for(let i = 1900; i <= new Date().getFullYear(); i++) {
            let option = document.createElement('option');
            option.value = i;
            option.text = i;
            yearSelect.add(option);
        }

        // 月のセレクトオプションを生成
        for(let i = 1; i <= 12; i++) {
            let option = document.createElement('option');
            option.value = i;
            option.text = i;
            monthSelect.add(option);
        }

        // 日数を設定する関数
        function setDayOptions() {
            daySelect.innerHTML = '';
            let year = yearSelect.value;
            let month = monthSelect.value;
            let lastDay = new Date(year, month, 0).getDate();
            for(let i = 1; i <= lastDay; i++) {
                let option = document.createElement('option');
                option.value = i;
                option.text = i;
                daySelect.add(option);
            }
        }

        // イベントリスナーを設定
        yearSelect.addEventListener('change', setDayOptions);
        monthSelect.addEventListener('change', setDayOptions);

        // 初期設定
        setDayOptions();
    }
}

// イベント情報を取得する関数（既存の関数を流用）
function fetchUpcomingEvents() {
    // イベント情報を取得
    fetch("https://script.google.com/macros/s/AKfycbzIzUxkl_eqvUHRjkUA5iKet4pPVx3VdsUDMHV5UJSHGemP6d9FMd8mUp3D2TzqElsoQ/exec?from=liff")
        .then(response => response.json())
        .then(data => {
            // イベント選択UIを作成
            createEventSelectionUI(data);
        })
        .catch(error => {
            console.error("イベント情報の取得に失敗しました:", error);
        });
}

// イベント選択UIを作成する関数（既存の関数を流用）
function createEventSelectionUI(events) {
    // 既存のイベント選択UI作成ロジックをそのまま流用

    // 選択肢リストを取得
    const optionsList = document.getElementById('event-options-list');
    if (!optionsList) return;
    
    // 選択したイベントを保持する配列
    window.selectedEvents = [];
    
    // イベントの選択肢を表示
    events.forEach((event, index) => {
        const option = document.createElement('div');
        option.className = 'event-option';
        option.style.padding = '10px';
        option.style.margin = '5px 0';
        option.style.backgroundColor = '#f5f5f5';
        option.style.borderRadius = '4px';
        option.style.cursor = 'pointer';
        
        option.dataset.value = event.choice_text;
        option.dataset.title = event.title;
        option.textContent = `${event.choice_text} - ${event.title}`;
        
        // クリックイベント
        option.addEventListener('click', function() {
            toggleEventSelection(this, event);
        });
        
        optionsList.appendChild(option);
    });
    
    // 日程が合わないオプションを追加
    const noScheduleOption = document.createElement('div');
    noScheduleOption.className = 'event-option no-schedule';
    noScheduleOption.style.padding = '10px';
    noScheduleOption.style.margin = '10px 0 5px';
    noScheduleOption.style.backgroundColor = '#f5f5f5';
    noScheduleOption.style.borderRadius = '4px';
    noScheduleOption.style.cursor = 'pointer';
    noScheduleOption.style.borderTop = '1px solid #ddd';
    
    noScheduleOption.dataset.value = '日程が合わない';
    noScheduleOption.dataset.title = '特になし';
    noScheduleOption.textContent = '日程が合わない';
    
    // クリックイベント
    noScheduleOption.addEventListener('click', function() {
        toggleNoScheduleOption(this);
    });
    
    optionsList.appendChild(noScheduleOption);
    
    // 選択数表示を初期化
    updateSelectionCount();
}

// 以下、既存の関数をそのまま流用

// 日程が合わないの選択を切り替える関数
function toggleNoScheduleOption(element) {
    // 既存のロジックをそのまま流用
}

// イベント選択を切り替える関数
function toggleEventSelection(element, event) {
    // 既存のロジックをそのまま流用
}

// 選択したイベントを表示する関数
function updateSelectedEvents() {
    // 既存のロジックをそのまま流用
}

// 選択数を更新する関数
function updateSelectionCount() {
    // 既存のロジックをそのまま流用
}

// 隠しフィールドを更新する関数
function updateHiddenFields() {
    // 既存のロジックをそのまま流用
}

// フォーム送信関数
function onSubmit() {
    // 既存のロジックをそのまま流用
}