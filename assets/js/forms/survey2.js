/**
 * Survey2 フォームクラス
 * フィードバックフォームの実装
 */
class Survey2Form {
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
            id: 'survey2-form',
            className: 'survey-form'
        });

        // 送信ボタン
        const submitButton = DOMHelper.createElement('button', {
            type: 'submit',
            className: 'submit-button'
        }, '送信する');

        this.form.appendChild(submitButton);
        this.container.appendChild(this.form);
        
        // FormComponentの初期化
        this.formComponent = new FormComponent(this.form);
    }

    /**
     * バリデーションを設定
     */
    setupValidation() {
        // バリデーションルールをここに追加
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
            const response = await apiClient.post('/survey2', formData);
            
            if (response.success) {
                alert('送信が完了しました');
                this.form.reset();
            } else {
                throw new Error(response.message || '送信に失敗しました');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert(error.message);
        }
    }
}

// グローバルスコープに公開
window.Survey2Form = Survey2Form;
