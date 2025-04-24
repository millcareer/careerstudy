/**
 * フォームの基本機能を提供するクラス
 */
class FormComponent {
    /**
     * @param {HTMLElement} container - フォームを配置するコンテナ要素
     * @param {Object} options - フォームの設定オプション
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            validateOnChange: true,
            showErrorsImmediately: true,
            ...options
        };
        
        this.form = document.createElement('form');
        this.form.classList.add('form');
        this.formGroups = new Map();
        this.validators = new Map();
        
        this._setupForm();
    }

    /**
     * フォームの初期設定
     * @private
     */
    _setupForm() {
        this.form.noValidate = true; // ブラウザのデフォルトバリデーションを無効化
        this.form.addEventListener('submit', this._handleSubmit.bind(this));
        this.container.appendChild(this.form);
    }

    /**
     * フォームグループを作成
     * @param {string} id - フォームグループのID
     * @param {Object} options - グループのオプション
     * @returns {HTMLElement} 作成されたフォームグループ要素
     */
    createFormGroup(id, options = {}) {
        const group = document.createElement('div');
        group.classList.add('form-group');
        
        if (options.label) {
            const label = document.createElement('label');
            label.htmlFor = id;
            label.classList.add('form-label');
            label.textContent = options.label;
            if (options.required) {
                label.classList.add('required');
            }
            group.appendChild(label);
        }

        const input = this._createInput(id, options);
        group.appendChild(input);

        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error-message');
        group.appendChild(errorDiv);

        this.formGroups.set(id, {
            group,
            input,
            errorDiv,
            options
        });

        this.form.appendChild(group);
        
        if (this.options.validateOnChange) {
            input.addEventListener('change', () => this.validateField(id));
            input.addEventListener('blur', () => this.validateField(id));
        }

        return group;
    }

    /**
     * 入力要素を作成
     * @private
     * @param {string} id - 入力要素のID
     * @param {Object} options - 入力要素のオプション
     * @returns {HTMLElement} 作成された入力要素
     */
    _createInput(id, options) {
        let input;
        
        switch (options.type) {
            case 'select':
                input = document.createElement('select');
                if (options.options) {
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = options.placeholder || '選択してください';
                    input.appendChild(defaultOption);

                    options.options.forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt.value;
                        option.textContent = opt.label;
                        input.appendChild(option);
                    });
                }
                break;
            
            case 'textarea':
                input = document.createElement('textarea');
                break;
            
            default:
                input = document.createElement('input');
                input.type = options.type || 'text';
        }

        input.id = id;
        input.name = id;
        input.classList.add('form-control');
        
        if (options.required) {
            input.required = true;
        }
        
        if (options.placeholder) {
            input.placeholder = options.placeholder;
        }

        return input;
    }

    /**
     * バリデーターを追加
     * @param {string} id - フィールドID
     * @param {Function} validator - バリデーション関数
     */
    addValidator(id, validator) {
        this.validators.set(id, validator);
    }

    /**
     * フィールドの値を取得
     * @param {string} id - フィールドID
     * @returns {string} フィールドの値
     */
    getValue(id) {
        const group = this.formGroups.get(id);
        return group ? group.input.value : null;
    }

    /**
     * フィールドの値を設定
     * @param {string} id - フィールドID
     * @param {string} value - 設定する値
     */
    setValue(id, value) {
        const group = this.formGroups.get(id);
        if (group) {
            group.input.value = value;
            if (this.options.validateOnChange) {
                this.validateField(id);
            }
        }
    }

    /**
     * 特定のフィールドを検証
     * @param {string} id - フィールドID
     * @returns {boolean} 検証結果
     */
    validateField(id) {
        const group = this.formGroups.get(id);
        if (!group) return true;

        const validator = this.validators.get(id);
        const value = group.input.value;
        
        let isValid = true;
        let errorMessage = '';

        if (group.options.required && !value) {
            isValid = false;
            errorMessage = '必須項目です';
        } else if (validator) {
            const result = validator(value);
            isValid = result === true;
            errorMessage = isValid ? '' : result;
        }

        this._updateFieldValidationState(id, isValid, errorMessage);
        return isValid;
    }

    /**
     * フォーム全体を検証
     * @returns {boolean} 検証結果
     */
    validateForm() {
        let isValid = true;
        for (const [id] of this.formGroups) {
            if (!this.validateField(id)) {
                isValid = false;
            }
        }
        return isValid;
    }

    /**
     * フィールドのバリデーション状態を更新
     * @private
     * @param {string} id - フィールドID
     * @param {boolean} isValid - 検証結果
     * @param {string} errorMessage - エラーメッセージ
     */
    _updateFieldValidationState(id, isValid, errorMessage) {
        const group = this.formGroups.get(id);
        if (!group) return;

        const { input, errorDiv } = group;

        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            errorDiv.textContent = errorMessage;
            errorDiv.style.display = 'block';
        }
    }

    /**
     * フォーム送信時の処理
     * @private
     * @param {Event} event - イベントオブジェクト
     */
    _handleSubmit(event) {
        event.preventDefault();
        
        if (this.validateForm()) {
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());
            
            if (this.options.onSubmit) {
                this.options.onSubmit(data);
            }
        }
    }

    /**
     * 送信ハンドラーを設定
     * @param {Function} handler - 送信時のコールバック関数
     */
    onSubmit(handler) {
        this.options.onSubmit = handler;
    }

    /**
     * フォームをリセット
     */
    reset() {
        this.form.reset();
        for (const [id, group] of this.formGroups) {
            group.input.classList.remove('is-valid', 'is-invalid');
            group.errorDiv.textContent = '';
            group.errorDiv.style.display = 'none';
        }
    }
}

// グローバルスコープに公開
window.FormComponent = FormComponent;
