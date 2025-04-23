// 大学名や部活動、出身地などの選択肢データを管理するファイル

// 大学名の選択肢リスト
const universityChoices = [
    "青山学院大学",
    "慶應義塾大学",
    "早稲田大学",
    "東京大学",
    "東京工業大学",
    "一橋大学",
    "京都大学",
    "大阪大学",
    "名古屋大学",
    "北海道大学",
    "東北大学",
    "九州大学",
    "立教大学",
    "上智大学",
    "明治大学",
    "法政大学",
    "中央大学",
    "同志社大学",
    "関西大学",
    "関西学院大学",
    "立命館大学",
    "東京理科大学",
    "国際基督教大学",
    "お茶の水女子大学",
    "東京外国語大学",
    "横浜国立大学",
    "神戸大学",
    "広島大学",
    // ここに他の大学を追加
];

// 部活動の選択肢リスト
const clubChoices = [
    "野球部",
    "サッカー部",
    "バスケットボール部",
    "バレーボール部",
    "ラグビー部",
    "テニス部",
    "ソフトテニス部",
    "卓球部",
    "バドミントン部",
    "陸上競技部",
    "水泳部",
    "剣道部",
    "柔道部",
    "空手部",
    "弓道部",
    "アメリカンフットボール部",
    "ハンドボール部",
    "ゴルフ部",
    "スキー部",
    "ダンス部",
    "チアリーディング部",
    "軽音楽部",
    "吹奏楽部",
    "合唱部",
    "オーケストラ部",
    "写真部",
    "美術部",
    "演劇部",
    "茶道部",
    "華道部",
    "書道部",
    "囲碁部",
    "将棋部",
    "文芸部",
    "新聞部",
    "放送部",
    "天文部",
    "生物部",
    "化学部",
    "物理部",
    "コンピュータ部",
    "ボランティア部",
    "英会話部",
    // ここに他の部活動を追加
];

// 出身地の選択肢リスト
const fromAreaChoices = [
    "北海道",
    "青森県",
    "岩手県",
    "宮城県",
    "秋田県",
    "山形県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
    "鳥取県",
    "島根県",
    "岡山県",
    "広島県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県",
    "海外"
];

// 大学名のデータリストを生成する関数
function createUniversityDatalist(containerId) {
    const datalist = document.getElementById(containerId);
    if (!datalist) return;
    
    // データリストをクリア
    datalist.innerHTML = '';
    
    // 選択肢を追加
    universityChoices.forEach(university => {
        const option = document.createElement('option');
        option.value = university;
        datalist.appendChild(option);
    });
}

// 部活動のセレクトボックスを生成する関数
function createClubSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    // セレクトボックスをクリア
    select.innerHTML = '';
    
    // 空のオプションを追加
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.text = '-- 選択してください --';
    select.add(emptyOption);
    
    // 選択肢を追加
    clubChoices.forEach(club => {
        const option = document.createElement('option');
        option.value = club;
        option.text = club;
        select.add(option);
    });
}

// 出身地のセレクトボックスを生成する関数
function createFromAreaSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    // セレクトボックスをクリア
    select.innerHTML = '';
    
    // 空のオプションを追加
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.text = '-- 選択してください --';
    select.add(emptyOption);
    
    // 選択肢を追加
    fromAreaChoices.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.text = area;
        select.add(option);
    });
}

// 選択肢の初期化関数（すべての選択肢を一度に設定）
function initializeChoices() {
    createUniversityDatalist('university');
    createClubSelect('form_answer11');
    createFromAreaSelect('form_answer14');
}
