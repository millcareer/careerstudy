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
        <input type="text" name="university-name" id="form_answer10" list="university" placeholder="大学名" autocomplete="on" required="required">
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
