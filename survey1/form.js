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
        <p class="form-text">学歴系統</p>
        <select name="role" id="form_answer18" required="required">
            <option>文系</option>
            <option>理系（スポーツ系）</option>
            <option>理系（医療系）</option>
            <option>理系（情報系）</option>
            <option>理系（工学系）</option>
            <option>理系（その他）</option>
        </select>
        
        <!-- 個人情報同意セクション -->
        <p class="form-text">個人情報同意</p>
 <div style="height: 150px; overflow-y: scroll; border: 1px solid #ccc; padding: 10px;">
     <p style="text-align: left;">
  個人情報保護方針<br>
 【1】個人情報取り扱いに関する基本方針<br>
 株式会社Mill Career（以下「当社」という）は、以下のとおり個人情報保護方針を定め、個人情報保護の仕組みを構築し、全従業員に個人情報保護の重要性の認識と取り組みを徹底させることにより、個人情報の保護を推進いたします。<br>
 当社は利用目的を明確にした上で個人情報を取得し、目的の範囲内に留め、個人情報を利用いたします。また、利用目的の範囲を超えて個人情報の利用を行わないよう、内部の管理体制の整備および専門管理部署の設置をもじます。当社は、当社の保有する個人情報に関するお問い合わせやご相談に誠実に対応させていただきます。<br>
 当社は、個人情報の取り扱いに関する法令、主務官庁のガイドラインその他の規範を遵守いたします。<br>
 <br>
 【2】定義<br>
 個人情報とは、個人に関する情報であって、その情報を構成する氏名、住所、電話番号、メールアドレス、所属団体、生年月日その他の記録等により個人を識別できるものをいいます。また、その情報のみでは識別できない場合でも、他の情報と容易に照合することができ、結果的に個人を識別できるものも個人情報に含まれます。<br>
 <br>
 【3】個人情報の利用目的<br>
 個人情報の取得と利用の目的および利用範囲は以下の通りです。<br>
 当社によるお客様へのサービス提供 （お客様の情報の収集に基づく、本サービスを通じた利用企業へのご紹介（本サービスを通じたマッチング利用企業へのエントリー、イベント参加企業ないしイベント参加企業への個人情報提供とみなします））<br>
 　1.当社および当社の協力企業が提供するサービスのご案内や広報<br>
 　2.アンケートのご協力依頼やアンケート結果の集計、キャンペーンの告知、プレゼント送付など<br>
 　3.属性情報・嗜好情報・行動履歴等に基づく広告・コンテンツの最適化・表示<br>
 　4.有益コンテンツ作成の参考対象の取得<br>
 　5.マーケティング対象の選定、商品開発、新市場開拓 当社サービス提供、お客様からのお問合せへの対応のために必要な業務処理<br>
 　6.利用統計などで特定の個人を識別できない形態による情報の提供<br>
 　7.その他上記に付随・関連する業務<br>
 <br>
 【4】第三者への個人情報の提供について<br>
 当社は、取得した個人情報の第三者への提供は、法令の定めがある場合を除き、必要な保護措置を講じた上で、以下の場合に限り行います。<br>
 　1.当社および当社の協力企業が提供するサービスのご案内や広報<br>
 　2.アンケートのご協力依頼やアンケート結果の集計、キャンペーンの告知、プレゼント送付など<br>
 　3.属性情報・嗜好情報・行動履歴等に基づく広告・コンテンツの最適化・表示<br>
 　4.有益コンテンツ作成の参考対象の取得<br>
 　5.本サービスの改良・新規サービスの開発および マーケティング 当社サービス提供、お客様からのお問合せへの対応のために必要な業務処理<br>
 　6.利用統計などで特定の個人を識別できない形態による情報の提供<br>
 　7.その他上記に付随・関連する業務<br>
 <br>
 【5】個人情報の取り扱いに関する例外や留意事項<br>
 以下の場合は、個人情報の取り扱いに関する保護対象から除外されるものとします。<br>
 　1.ユーザー本人または第三者の生命、身体、財産そのほかの権利利益を保護するおそれがある場合<br>
 　2.本サービスの運営に支障をきたすおそれがある場合 他の法律に反することとなる場合<br>
 なお、上記個人情報の取扱い等に多大の負担を要する場合—その他、個人情報の取扱いの例外を行うことが妥当な場合であって、当社の裁量により例外の適用を認めると判断した場合は、個人情報の取扱い等を行わないことがあります。また、当社は、サイト内で記録した個人情報に関して、多重アカウントを防止する目的や、当社の業務の遂行に支障をきたす行為などを発見した場合に限定し、これに関わる情報の調査や開示をする場合があります。<br>
 <br>
 【6】クッキー<br>
 当社のウェブサイトでは、本サービスの利用状況に関する情報の取得や、より良いものにマッチング利用企業やイベント参加企業への個人情報提供のためにクッキー情報やウェブビーコンをはじめとする技術を使用しています。お客様のブラウザからのアクセスおよび、お客様が過去に当社ウェブサイトを利用したことがあるかどうかを確認するほか、お客様の好みや利用状況に合わせた コンテンツや広告を表示したり、サービスのカスタマイズやセキュリティ維持、統計データの取得などに利用しております。<br>
 なお、ほとんどのブラウザでは、設定からクッキーの無効化や拒否をすることが可能です。ただし、当サイトの機能の一部は、クッキーが無効の場合、利用できなくなることがありますので、ご確認ください。<br>
 <br>
 【7】第三者データの取得に関する例外や留意事項<br>
 当社のサービスでは、提供を受けたお客様の個人情報に関して、お客様ご本人の同意を得た上でこれに加え、自ら判断する場合は、以下のような場合は、個人情報の取扱い等の例外を行うことが妥当な場合であって、当社の裁量により例外の適用を認めると判断した場合は、個人情報の取扱い等を行わないことがあります。<br>
 　1.ユーザー本人または第三者の生命、身体、財産そのほかの権利利益を保護するおそれがある場合<br>
 　2.本サービスの運営に支障をきたすおそれがある場合 他の法律に反することとなる場合<br>
 なお、上記個人情報の取扱い等に多大の負担を要する場合—その他、個人情報の取扱いの例外を行うことが妥当な場合であって、当社の裁量により例外の適用を認めると判断した場合は、個人情報の取扱い等を行わないことがあります。<br>
 <br>
 【8】個人情報の開示、訂正などの手続きについて<br>
 当社は、保有する個人データに関して、本サービスを受けられる方からの開示・訂正・追加・削除・利用の停止・消去及び第三者への提供の停止（「開示等」といいます。）の申し出があった場合、本人確認を行った上で、適切かつ迅速に対応いたします。ただし、法令により個人情報の開示等をしない場合がありますので予めご了承下さい。<br>
 <br>
 【9】個人情報提供の任意性<br>
 当社が提供を求める全ての要素についてお答えいただかなくても結構ですが、必要となる情報が不足している場合は、本サービスを受けられないことがあります。<br>
 <br>
 【10】本人が容易に認識できない方法による個人情報の取得について<br>
 本サイトにおいて、サイトの使い勝手を向上させる目的や、アクセス解析などの統計的情報を取得する目的で、クッキーやウェブビーコン、携帯電話番号の暗号 化などの技術を使用することがありますが、そのような技術の使用によって、ユーザーが入力していない個人情報を取得することはありません。<br>
 <br>
 【11】プライバシーポリシーの変更について<br>
 当社は、個人情報の取り扱いに関する運用状況を見直し、継続的な改善に取り組むものとし、必要に応じて、本ポリシーの全部または一部を変更することがあります。変更後の内容は、当サイトでお知らせした時点から適用されるものとします。 なお、法令に特段の定めがある場合を除き、変更によって個人情報の取扱い等の一部制限をする場合で、お客様ご本人の同意を得ることが困難 な場合については、当サイトにおいて周知させていただきます。<br>
 <br>
 【12】個人情報の取り扱いに関する問合せ<br>
 名称 株式会社Mill Career 個人情報対応窓口 連絡先 info@millcareer.com<br>
 最終変更 2023 年 04 月 01 日<br>
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
        fetchUpcomingEvents();
    } else {
        console.error('fetchUpcomingEvents関数が見つかりません。common/events.jsが正しく読み込まれているか確認してください。');
        // フォールバック: 初期UIだけでも設定
        if (typeof setupInitialEventUI === 'function') {
            setupInitialEventUI();
        }
    }
}
