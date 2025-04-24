/**
 * セレクターコンポーネント
 * セレクトボックスとデータリストを管理するクラス
 */
class SelectorComponent extends FormComponent {
    /**
     * @param {HTMLElement} container - コンポーネントを配置するコンテナ要素
     * @param {Object} options - 設定オプション
     */
    constructor(container, options = {}) {
        super(container, {
            ...options,
            validateOnChange: true
        });

        this.datalists = new Map();
    }

    /**
     * セレクトグループを作成
     * @param {string} id - グループのID
     * @param {Object} options - グループのオプション
     * @returns {HTMLElement} 作成されたセレクトグループ要素
     */
    createSelectGroup(id, options = {}) {
        const group = document.createElement('div');
        group.classList.add('select-container');

        if (options.label) {
            const label = document.createElement('label');
            label.htmlFor = id;
            label.classList.add('select-label');
            label.textContent = options.label;
            if (options.required) {
                label.classList.add('required');
            }
            group.appendChild(label);
        }

        const selectWrapper = document.createElement('div');
        selectWrapper.classList.add('select-wrapper');

        const select = document.createElement('select');
        select.id = id;
        select.name = id;
        select.classList.add('form-select');

        if (options.required) {
            select.required = true;
        }

        // デフォルトオプションの追加
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = options.placeholder || '選択してください';
        select.appendChild(defaultOption);

        // 選択肢の追加
        if (options.options) {
            this._addSelectOptions(select, options.options);
        }

        selectWrapper.appendChild(select);
        group.appendChild(selectWrapper);

        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error-message');
        group.appendChild(errorDiv);

        this.formGroups.set(id, {
            group,
            select,
            errorDiv,
            options
        });

        // 変更イベントの設定
        select.addEventListener('change', () => {
            this.validateField(id);
            if (options.onChange) {
                options.onChange({
                    id,
                    value: select.value,
                    selectedOption: select.options[select.selectedIndex]
                });
            }
        });

        this.form.appendChild(group);
        return group;
    }

    /**
     * データリストグループを作成
     * @param {string} id - グループのID
     * @param {Object} options - グループのオプション
     * @returns {HTMLElement} 作成されたデータリストグループ要素
     */
    createDatalistGroup(id, options = {}) {
        const group = document.createElement('div');
        group.classList.add('datalist-container');

        if (options.label) {
            const label = document.createElement('label');
            label.htmlFor = id;
            label.classList.add('datalist-label');
            label.textContent = options.label;
            if (options.required) {
                label.classList.add('required');
            }
            group.appendChild(label);
        }

        const inputWrapper = document.createElement('div');
        inputWrapper.classList.add('datalist-wrapper');

        const input = document.createElement('input');
        input.type = 'text';
        input.id = id;
        input.name = id;
        input.classList.add('form-control');
        
        if (options.required) {
            input.required = true;
        }
        
        if (options.placeholder) {
            input.placeholder = options.placeholder;
        }

        // データリストの作成
        const datalistId = `${id}_list`;
        const datalist = document.createElement('datalist');
        datalist.id = datalistId;
        
        if (options.options) {
            this._addDatalistOptions(datalist, options.options);
        }

        input.setAttribute('list', datalistId);
        
        inputWrapper.appendChild(input);
        inputWrapper.appendChild(datalist);
        group.appendChild(inputWrapper);

        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error-message');
        group.appendChild(errorDiv);

        this.formGroups.set(id, {
            group,
            input,
            datalist,
            errorDiv,
            options
        });

        this.datalists.set(id, options.options || []);

        // 入力イベントの設定
        input.addEventListener('input', () => {
            this.validateField(id);
            if (options.onInput) {
                options.onInput({
                    id,
                    value: input.value
                });
            }
        });

        this.form.appendChild(group);
        return group;
    }

    /**
     * セレクトボックスに選択肢を追加
     * @private
     * @param {HTMLSelectElement} select - セレクト要素
     * @param {Array} options - 選択肢の配列
     */
    _addSelectOptions(select, options) {
        options.forEach(option => {
            const optElement = document.createElement('option');
            if (typeof option === 'object') {
                optElement.value = option.value;
                optElement.textContent = option.label;
                if (option.disabled) optElement.disabled = true;
                if (option.selected) optElement.selected = true;
            } else {
                optElement.value = option;
                optElement.textContent = option;
            }
            select.appendChild(optElement);
        });
    }

    /**
     * データリストに選択肢を追加
     * @private
     * @param {HTMLDataListElement} datalist - データリスト要素
     * @param {Array} options - 選択肢の配列
     */
    _addDatalistOptions(datalist, options) {
        options.forEach(option => {
            const optElement = document.createElement('option');
            if (typeof option === 'object') {
                optElement.value = option.value;
                if (option.label) optElement.label = option.label;
            } else {
                optElement.value = option;
            }
            datalist.appendChild(optElement);
        });
    }

    /**
     * 選択肢を更新
     * @param {string} id - グループのID
     * @param {Array} newOptions - 新しい選択肢の配列
     */
    updateOptions(id, newOptions) {
        const group = this.formGroups.get(id);
        if (!group) return;

        if (group.select) {
            // セレクトボックスの場合
            const currentValue = group.select.value;
            group.select.innerHTML = '';
            
            // デフォルトオプションの再追加
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = group.options.placeholder || '選択してください';
            group.select.appendChild(defaultOption);

            this._addSelectOptions(group.select, newOptions);
            
            // 以前の値が新しい選択肢に存在する場合は復元
            if (newOptions.some(opt => opt.value === currentValue || opt === currentValue)) {
                group.select.value = currentValue;
            }
        } else if (group.datalist) {
            // データリストの場合
            group.datalist.innerHTML = '';
            this._addDatalistOptions(group.datalist, newOptions);
            this.datalists.set(id, newOptions);
        }
    }

    /**
     * 選択された値を取得
     * @param {string} id - グループのID
     * @returns {string} 選択された値
     */
    getSelectedValue(id) {
        const group = this.formGroups.get(id);
        if (!group) return null;

        return group.select ? group.select.value : group.input.value;
    }

    /**
     * 値を設定
     * @param {string} id - グループのID
     * @param {string} value - 設定する値
     */
    setSelectedValue(id, value) {
        const group = this.formGroups.get(id);
        if (!group) return;

        if (group.select) {
            group.select.value = value;
        } else if (group.input) {
            group.input.value = value;
        }

        this.validateField(id);
    }

    /**
     * フィールドの検証をオーバーライド
     * @param {string} id - グループのID
     * @returns {boolean} 検証結果
     */
    validateField(id) {
        const group = this.formGroups.get(id);
        if (!group) return true;

        let isValid = true;
        let errorMessage = '';

        const value = this.getSelectedValue(id);

        if (group.options.required && !value) {
            isValid = false;
            errorMessage = '選択は必須です';
        } else if (group.input && group.options.validateInput) {
            // データリストの場合、入力値が選択肢に存在するかチェック
            const options = this.datalists.get(id) || [];
            const isValidOption = options.some(opt => 
                (typeof opt === 'object' ? opt.value === value : opt === value)
            );

            if (!isValidOption) {
                isValid = false;
                errorMessage = '有効な選択肢を入力してください';
            }
        }

        this._updateFieldValidationState(id, isValid, errorMessage);
        return isValid;
    }
}

// グローバルスコープに公開
window.SelectorComponent = SelectorComponent;
