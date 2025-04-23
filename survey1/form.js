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
 株式会社Mill Career（以下「当社」という）は、以下のとおり個人情報保護方針を定め、個人情報保護の仕組みを構築し、全従業員に個人情報保護の重要性の認識と取組みを徹底させることにより、個人情報の保護を推進することを宣言いたします。<br>
 当社は利用目的を明確にした上で個人情報を取得し、目的の範囲内に限り、個人情報を利用いたします。また、利用目的の範囲を超えて個人情報の利用を行わないよう、社内の管理体制の整備および安全管理措置を講じます。<br>
 個人情報の管理は、厳重に行うこととし、お客様にご承諾いただいた場合を除き、第三者に対しデータを開示・提供することは原則いたしません。また個人情報 の漏洩、滅失又は毀損を防ぐため、安全管理措置を規定し実施いたします。また問題発生の予防のための手順を設け実施するとともに、万が一の問題発生に対 しては速やかに再発防止のための是正を行います。<br>
 当社は、当社が保有する個人情報の取扱いに関して適用される法令、国が定める指針及びその他の規範を遵守いたします。<br>
 当社は、当社が保有する個人情報に対するお問い合わせや苦情に対して、受付、対応の体制と手順を整備し、迅速に対応いたします。 当社は、個人情報保護に関する管理の体制と仕組みについて継続的改善を実施いたします。<br>
 当社は、下記の方針に従い、個人情報の取り扱いに細心の注意を払います。<br>
 <br>
 【2】定義<br>
 個人情報とは、個人に関する情報であって、その情報を構成する氏名、住所、電話番号、メールアドレス、所属組織、生年月日その他の記述等により個人を識別できるものをいいます。また、その情報のみでは識別できない場合でも、他の情報と容易に照合することができ、結果的に個人を識別できる情報も個人情報に含まれます。<br>
 <br>
 【3】個人情報の利用目的<br>
 個人情報の取得と利用の目的および活用範囲は以下の通りです。<br>
 当社によるお客様への本サービス提供 　お客様の承諾に基づく、本サービス利用企業への個人情報開示(本サービスを通じた利用企業へのエントリー・イベントへの参加をもって、当該利用企業ないしイベント参加企業への個人情報開示の承諾とみなします)<br>
 　1.当社および当社の関係会社が提供するサービスのご案内や資料の送付<br>
 　2.アンケートのご協力依頼やアンケート結果の報告、キャンペーンの告知、モニター等への応募、プレゼント発送等<br>
 　3.属性情報・端末情報・位置情報・行動履歴等に基づく広告・コンテンツの配信・表示<br>
 　4.記事コンテンツ作成の為の取材対象者の募集<br>
 　5.本サービスの改善・新規サービスの開発およびマーケティング 当社サービス提供、お客様からのお問合せへの対応のために必要な業務遂行<br>
 　6.利用規約等で禁じている、商用・転用目的での各種申込行為、各種多重申込、権利譲渡、虚偽情報登録などの調査と、それに基づく当該申込内容の詳細確認。<br>
 　7.その他上記業務に関連・付随する業務<br>
 <br>
 【4】個人情報の第三者提供について<br>
 お客様の個人情報について、お客様ご本人の同意を得ずに第三者に提供することは、原則いたしません。提供先・提供情報内容を特定した上で、お客様ご本人の同意を得た場合に限り、提供いたします。ただし、以下の場合は、お客様の同意なくお客様の個人情報を提供することがあります。<br>
 　1.法令に基づく場合<br>
 　2.人の生命、身体または財産の保護のために必要がある場合であって、お客様ご本人の同意を得ることが困難である場合<br>
 　3.公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、お客様ご本人の同意を得ることが困難である場合<br>
 　4.国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、お客様ご本人の同意を得ることによってその事務の遂行に支障を及ぼすおそれがあると当社が判断した場合<br>
 　5.裁判所、検察庁、警察、弁護士会、消費者センターまたはこれらに準じた権限を有する機関から、お客様の個人情報についての開示を求められた場合<br>
 　6.お客様ご本人から明示的に第三者への提供を求められた場合<br>
 　7.合併その他の事由による事業の承継に伴って個人情報が提供される場合<br>
 <br>
 【5】第三者提供に関する免責事項<br>
 以下の場合は、第三者による個人情報の取得に関し、当社は何らの責任を負いません。<br>
 　1.ユーザー自らが本サービスの機能または別の手段を用いて利用企業等に個人情報を明らかにする場合（なお、利用企業等における個人情報の取扱いについては、各利用企業に直接お問合せください）<br>
 　2.本サービスに入力した情報により、期せずして第三者において本人が特定できてしまった場合<br>
 　3.本サービスからリンクされる外部サイトにおいて、ユーザーより個人情報が提供され、またそれが利用された場合<br>
 <br>
 【6】応募先企業における個人情報管理<br>
 ユーザーがサービスを利用して応募先企業に提供した個人情報については、応募先企業の定める個人情報管理に関する規程に則って取り扱われます。応募先企業における個人情報の取扱いについて、当社は責任を負いかねますので、ユーザご自身のご判断で応募先企業に個人情報を提供していただくようにお願い致します。また、会員の採用選考状況などの情報については、当社が応募先企業等から委託を受け、会員の情報の管理等を行う限度で、これを取り扱うものとします。<br>
 <br>
 【7】統計処理されたデータの利用<br>
 当社は提供を受けたお客様の個人情報をもとに、お客様個人を特定できないよう加工した統計データを作成することがあります。お客様個人を特定できない統計データについては、当社は何ら制限なく利用することができるものとします。<br>
 <br>
 【8】個人データの開示、訂正等の手続きについて<br>
 当社は、保有する個人データ（個人情報の保護に関する法律2条6項に定めるものをいいます。）に関し、法令に従い、ユーザーまたはその代理人からの開示・変更等（内容の訂正、追加または削除）、利用停止等（利用の停止または消去）、第三者への提供の停止、「個人情報の利用目的」の通知の求めに対応させていただきます。 当社は、個人情報の開示・変更等・利用停止等の求めに対し、ユーザ個人を識別できる情報（氏名、住所、電話番号、生年月日、メールアドレス、会員番号、パスワード等）により、本人であることを確認します。ただし、本人確認の正確さを期すため、運転免許証またはパスポートその他の公的書類の写しを求める場合があります。また、当該求めを代理人が行う場合、当社は、以上に定めるところに加え、代理権の存在を証する書類を求める場合があります。 なお、ユーザは、サービス内で登録した個人情報に関し、自らサービス内で確認および訂正することができます。 ただし、以下の場合は個人情報の変更等に応じないことがあります。<br>
 　1.ユーザー本人または第三者の生命、身体、財産その他の権利・利益を害するおそれがある場合<br>
 　2.本サービスの適正な実施に著しい支障を及ぼすおそれがある場合 他の法令に違反することとなる場合<br>
 なお、当該個人情報の変更等に多額の費用を要する場合､その他の、個人情報の変更等を行うことが困難な場合であって、ユーザーの権利・利益を保護するため必要なこれに代わるべき措置をとるときは、個人情報の変更等に応じないことがあります。<br>
 <br>
 【9】個人情報提供の任意性<br>
 当社が提供を求める全ての項目にお答えいただく必要はございませんが、必要となる情報が不足している場合は、本サービスを受けられないことがあります。<br>
 <br>
 【10】本人が容易に認識できない方法による個人情報の取得について<br>
 本サイトにおいて、サイトの使い勝手を向上させる目的や、アクセス状況などの統計的情報を取得する目的で、クッキーやウェブビーコン、携帯端末の個体識別番 号等の技術を使用することがありますが、そのような技術の使用により、ユーザーが入力していない個人情報を取得することはありません。<br>
 (1) クッキー<br>
 ● クッキーとは<br>
 クッキーとは、ウェブページを利用したときに、ブラウザとサーバーとの間で送受信した利用履歴や入力内容などを、お客様のコンピュータにファイルとして保存しておく仕組みです。次回、同じページにアクセスすると、クッキーの情報を使って、ページの運営者はお客様ごとに表示を変えたりすることができます。なお、お客様のブラウザは、プライバシー保護のため、そのウェブサイトのサーバーが送受信したクッキーのみを送信します。<br>
 ● クッキーの設定について<br>
 お客様は、クッキーの送受信に関する設定を「すべてのクッキーを許可する」、「すべてのクッキーを拒否する」、「クッキーを受信したら ユーザーに通知する」などから選択できます。設定方法は、ブラウザにより異なります。クッキーに関する設定方法は、お使いのブラウザの「ヘルプ」メニューでご確認ください。すべてのクッキーを拒否する設定を選択されますと、認証が必要なサービスを受けられなくなる等、インターネット上の各種サービスの利用上、制約を受ける場合がありますのでご注意ください。<br>
 ● クッキーを使用して行っていること<br>
 以下の目的のため、当社はクッキーを利用する可能性があります。<br>
 　1.お客様が認証サービスにログインされるとき、保存されているお客様の登録情報を参照して、お客様ごとにカスタマイズされたサービスを提供できるようにするため<br>
 　2.お客様が興味を持っている内容や、当社のサイト上での利用状況をもとに、最も適切な広告を他社サイト上で表示するため<br>
 　3.本サイトの利用者数やトラフィックを調査するため<br>
 　4.当社のサービスを改善するため<br>
 　5.セキュリティー保持のため、ご利用から一定の時間が経過したお客様に対してパスワードの再入力（再認証）を促すため<br>
 なお、当社は、当社の広告の配信を委託する他社サイトへの委託に基づき、他社サイトを経由して、当社のクッキーを保存し、参照する場合があります。これは、本サイトをより便利にご利用いただく目的で、お客様を 識別するために利用しているデータです。ご利用のインターネット閲覧ソフト（ブラウザ）の設定を変 更することによりクッキーを拒否するように設定することもできますが、その場合には本サービスを正常にご 利用頂けない場合がございます。<br>
 (2) ウェブビーコン<br>
 当社のウェブサイトでは、本サイトの利用状況に関する統計情報の取得や、サービスをより良いものに改 善することを目的として、ウェブビーコンを使用しているページがあります。ウェブビーコンを用いて取得された 情報には、個人を特定するような情報は含まれておりません。<br>
 (3) 携帯端末の個体識別番号<br>
 携帯端末の個体識別番号とは、携帯端末で本サイトにアクセスした際に、携帯端末を区別するためにお 客様の携帯端末が送信する番号のことで、アクセス管理などに利用しております。個体識別番号には、 お客様の携帯電話番号やメールアドレス、氏名など、お客様のプライバシーに関する情報は含まれており ません。また個体識別番号のみでは、お客様個人を特定する事はできません。<br>
 <br>
 【11】プライバシーポリシーの改定について<br>
 当社は、個人情報の取扱いに関する運用状況を適宜見直し、継続的な改善に努めるものとし、法令等の定めがある場合を除き、必要に応じて本ポリシーの全部または一部を改定することがあります。この場合、改定後の内容は、当サイトでお知らせします。本ポリシーの改定は、当サイトに掲載された時点から適用されるものとします。<br>
 <br>
 【12】個人情報の取扱いに関する相談や連絡先<br>
 名称 株式会社Mill Career 個人情報対応窓口 連絡先 info@millcareer.com<br>
 最終改訂 2023 年 04 月 1 日<br>
   </p>
 </div>
 <p>
   <input type="checkbox" name="agreement" id="form_answer19" value="同意する" required="required">
   <label for="form_answer19">同意する</label>
 </p>
            <input type="checkbox" name="agreement" id="form_answer19" value="同意する" required="required">
            <label for="form_answer19">同意する</label>
        </p>
        
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
    
    // イベント情報の取得とUI作成（既存の処理を呼び出し）
    fetchUpcomingEvents();
}
