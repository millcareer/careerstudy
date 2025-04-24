/**
 * Survey1 フォームクラス
 * 登録フォームの実装
 */
class Survey1Form {
    constructor(container) {
        this.container = container;
        this.form = null;
        this.formComponent = null;
        this.init();
    }

    /**
     * 初期化
     */
    init() {
        this.createForm();
        this.setupValidation();
        this.setupEventHandlers();
    }

    /**
     * フォームを作成
     */
    createForm() {
        this.form = DOMHelper.createElement('form', {
            id: 'survey1-form',
            className: 'survey-form'
        });

        // 基本情報セクション
        const basicSection = this.createBasicInfoSection();
        
        // 大学情報セクション
        const universitySection = this.createUniversitySection();
        
        // 個人情報セクション
        const personalSection = this.createPersonalSection();

        // イベント選択セクション
        const eventSection = this.createEventSection();

        // 送信ボタン
        const submitButton = DOMHelper.createElement('button', {
            type: 'submit',
            className: 'submit-button'
        }, '登録する');

        // フォームに追加
        [basicSection, universitySection, personalSection, eventSection, submitButton]
            .forEach(element => this.form.appendChild(element));

        this.container.appendChild(this.form);
        
        // FormComponentの初期化
        this.formComponent = new FormComponent(this.form);
    }

    /**
     * 基本情報セクションを作成
     */
    createBasicInfoSection() {
        const section = DOMHelper.createElement('section', {
            className: 'form-section'
        });

        const title = DOMHelper.createElement('h2', {}, '基本情報');

        const fields = [
            {
                type: 'email',
                name: 'email',
                label: 'メールアドレス',
                required: true
            },
            {
                type: 'tel',
                name: 'phone',
                label: '電話番号',
                required: true
            },
            {
                type: 'password',
                name: 'password',
                label: 'パスワード',
                required: true
            }
        ];

        [title, ...fields.map(field => this.createFormGroup(field))]
            .forEach(element => section.appendChild(element));

        return section;
    }

    /**
     * 大学情報セクションを作成
     */
    createUniversitySection() {
        const section = DOMHelper.createElement('section', {
            className: 'form-section'
        });

        const title = DOMHelper.createElement('h2', {}, '大学情報');

        const fields = [
            {
                type: 'text',
                name: 'university',
                label: '大学名',
                required: true
            },
            {
                type: 'text',
                name: 'faculty',
                label: '学部',
                required: true
            },
            {
                type: 'text',
                name: 'department',
                label: '学科',
                required: true
            },
            {
                type: 'select',
                name: 'grade',
                label: '学年',
                options: [
                    { value: '', label: '選択してください' },
                    { value: '1', label: '1年' },
                    { value: '2', label: '2年' },
                    { value: '3', label: '3年' },
                    { value: '4', label: '4年' }
                ],
                required: true
            }
        ];

        [title, ...fields.map(field => this.createFormGroup(field))]
            .forEach(element => section.appendChild(element));

        return section;
    }

    /**
     * 個人情報セクションを作成
     */
    createPersonalSection() {
        const section = DOMHelper.createElement('section', {
            className: 'form-section'
        });

        const title = DOMHelper.createElement('h2', {}, '個人情報');

        // 名前（漢字）
        const nameKanji = DOMHelper.createElement('div', {
            className: 'form-group-row'
        });
        
        const nameKanjiFields = [
            {
                type: 'text',
                name: 'lastName',
                label: '姓',
                required: true
            },
            {
                type: 'text',
                name: 'firstName',
                label: '名',
                required: true
            }
        ];

        nameKanjiFields.forEach(field => {
            nameKanji.appendChild(this.createFormGroup(field));
        });

        // 名前（カナ）
        const nameKana = DOMHelper.createElement('div', {
            className: 'form-group-row'
        });
        
        const nameKanaFields = [
            {
                type: 'text',
                name: 'lastNameKana',
                label: 'セイ',
                required: true
            },
            {
                type: 'text',
                name: 'firstNameKana',
                label: 'メイ',
                required: true
            }
        ];

        nameKanaFields.forEach(field => {
            nameKana.appendChild(this.createFormGroup(field));
        });

        // 生年月日
        const birthdayContainer = DOMHelper.createElement('div', {
            id: 'birthday-container',
            className: 'form-group'
        });

        // 性別
        const genderGroup = this.createFormGroup({
            type: 'radio',
            name: 'gender',
            label: '性別',
            options: [
                { value: 'male', label: '男性' },
                { value: 'female', label: '女性' },
                { value: 'other', label: 'その他' }
            ],
            required: true
        });

        [title, nameKanji, nameKana, birthdayContainer, genderGroup]
            .forEach(element => section.appendChild(element));

        return section;
    }

    /**
     * イベントセクションを作成
     */
    createEventSection() {
        const section = DOMHelper.createElement('section', {
            className: 'form-section'
        });

        const title = DOMHelper.createElement('h2', {}, 'イベント選択');
        
        const eventContainer = DOMHelper.createElement('div', {
            id: 'event-selection-container'
        });

        [title, eventContainer].forEach(element => section.appendChild(element));

        return section;
    }

    /**
     * フォームグループを作成
     */
    createFormGroup(field) {
        return this.formComponent.createFormGroup(field);
    }

    /**
     * バリデーションを設定
     */
    setupValidation() {
        // メールアドレスのバリデーション
        this.formComponent.addValidator('email', (value) => {
            if (!ValidationHelper.isValidEmail(value)) {
                return '有効なメールアドレスを入力してください';
            }
            return '';
        });

        // 電話番号のバリデーション
        this.formComponent.addValidator('phone', (value) => {
            if (!ValidationHelper.isValidPhone(value)) {
                return '有効な電話番号を入力してください';
            }
            return '';
        });

        // パスワードのバリデーション
        this.formComponent.addValidator('password', (value) => {
            if (!ValidationHelper.isValidPassword(value)) {
                return 'パスワードは8文字以上で、英字と数字を含める必要があります';
            }
            return '';
        });

        // カタカナのバリデーション
        ['lastNameKana', 'firstNameKana'].forEach(field => {
            this.formComponent.addValidator(field, (value) => {
                if (!ValidationHelper.isKatakana(value)) {
                    return 'カタカナで入力してください';
                }
                return '';
            });
        });
    }

    /**
     * イベントハンドラーを設定
     */
    setupEventHandlers() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    /**
     * 送信処理
     */
    async handleSubmit(event) {
        event.preventDefault();

        if (!this.formComponent.validateAll()) {
            return;
        }

        try {
            const formData = this.formComponent.getFormData();
            
            // APIクライアントを初期化
            const apiClient = new APIClient('/api');
            
            // フォームデータを送信
            const response = await apiClient.post('/survey1', formData);
            
            if (response.success) {
                alert('登録が完了しました');
                this.form.reset();
            } else {
                throw new Error(response.message || '登録に失敗しました');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert(error.message);
        }
    }
}

// グローバルスコープに公開
window.Survey1Form = Survey1Form;
