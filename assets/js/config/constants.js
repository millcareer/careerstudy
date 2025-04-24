/**
 * アプリケーション全体で使用する定数
 */

// API エンドポイント
export const API_ENDPOINTS = {
    FORM_SUBMISSION: 'https://script.google.com/macros/s/AKfycbyMCenjhw8xznFjWpYpIL0SDXdSns_9hbU92ZiucboJqzJhXJuItSKMhJ36W1ylZP2k/exec',
};

// フォームフィールドID
export const FORM_FIELDS = {
    EMAIL: 'form_answer01',
    PASSWORD: 'form_answer20',
    PASSWORD_CONFIRM: 'form_answer21',
    PHONE: 'form_answer02',
    LAST_NAME: 'form_answer03',
    FIRST_NAME: 'form_answer04',
    LAST_NAME_KANA: 'form_answer05',
    FIRST_NAME_KANA: 'form_answer06',
    BIRTH_YEAR: 'form_answer07',
    BIRTH_MONTH: 'form_answer08',
    BIRTH_DAY: 'form_answer09',
    UNIVERSITY: 'form_answer10',
    CLUB: 'form_answer11',
    GRADE: 'form_answer12',
    GENDER: 'form_answer13',
    HOMETOWN: 'form_answer14',
    ROLE: 'form_answer15',
    FACULTY: 'form_answer16',
    DEPARTMENT: 'form_answer17',
    EDUCATION_TYPE: 'form_answer18',
    AGREEMENT: 'form_answer19',
    EVENT_CHOICE1: 'form_answer22',
    EVENT_CHOICE2: 'form_answer23'
};

// バリデーション用の正規表現
export const VALIDATION_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\d{1,5}-\d{1,4}-\d{4,5}$/,
    PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
};

// エラーメッセージ
export const ERROR_MESSAGES = {
    REQUIRED: '必須項目が入力されていません',
    INVALID_EMAIL: '有効なメールアドレスを入力してください',
    INVALID_PHONE: '電話番号は正しい形式で入力してください（例：000-0000-0000）',
    INVALID_PASSWORD: 'パスワードは英字と数字を含む8文字以上で設定してください',
    PASSWORD_MISMATCH: 'パスワードと確認用パスワードが一致しません',
    NO_EVENT_SELECTED: 'イベントを選択してください'
};

// 学年選択肢
export const GRADE_OPTIONS = ['1', '2', '3', '4', '修1', '修2'];

// 性別選択肢
export const GENDER_OPTIONS = ['男性', '女性', 'その他', '回答しない'];

// 役職選択肢
export const ROLE_OPTIONS = [
    '主将/主務',
    '副将',
    '主将',
    '副務',
    '幹事',
    '三役',
    '三回',
    'その他',
    '特になし'
];

// 学習形態選択肢
export const EDUCATION_TYPES = [
    '文系',
    '理系（スポーツ系）',
    '理系（医歯系）',
    '理系（情報系）',
    '理系（工学系）',
    '理系（その他）'
];

/**
 * フォームの設定値を定義する定数
 */
export const FORM_CONFIG = {
    // バリデーションメッセージ
    validationMessages: {
        required: '必須項目です',
        emailFormat: '有効なメールアドレスを入力してください',
        phoneFormat: '有効な電話番号を入力してください',
        eventSelection: 'イベントは1つ以上2つ以下で選択してください',
    },

    // フォームのフィールド設定
    fields: {
        name: {
            label: 'お名前',
            required: true,
            type: 'text',
            placeholder: '山田 太郎',
        },
        email: {
            label: 'メールアドレス',
            required: true,
            type: 'email',
            placeholder: 'example@example.com',
        },
        phone: {
            label: '電話番号',
            required: true,
            type: 'tel',
            placeholder: '090-1234-5678',
        },
        reason: {
            label: '参加理由',
            required: true,
            type: 'select',
            options: [
                { value: '', label: '選択してください' },
                { value: 'interest', label: '興味があるから' },
                { value: 'career', label: 'キャリアアップのため' },
                { value: 'networking', label: '人脈作りのため' },
                { value: 'other', label: 'その他' },
            ],
        },
    },

    // イベント選択の設定
    eventSelection: {
        minSelect: 1,
        maxSelect: 2,
        containerClass: 'event-selection',
        headerClass: 'event-selection__header',
        gridClass: 'event-selection__grid',
        itemClass: 'event-selection__item',
        selectedClass: 'event-selection__item--selected',
        errorClass: 'event-selection__error',
        counterClass: 'event-selection__counter',
    },

    // 生年月日の設定
    birthday: {
        yearRange: {
            start: 1950,
            end: new Date().getFullYear() - 15,
        },
        containerClass: 'birthday-selection',
        selectClass: 'birthday-selection__select',
        labelClass: 'birthday-selection__label',
    },

    // フォームのスタイル設定
    styles: {
        formClass: 'registration-form',
        fieldClass: 'form-field',
        labelClass: 'form-label',
        inputClass: 'form-input',
        selectClass: 'form-select',
        errorClass: 'form-error',
        buttonClass: 'form-button',
    },
};

export default FORM_CONFIG; 