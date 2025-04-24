/**
 * 選択肢コンポーネント
 * ラジオボタンやチェックボックスの選択肢を管理するクラス
 */
class ChoicesComponent extends FormComponent {
    /**
     * @param {HTMLElement} container - コンポーネントを配置するコンテナ要素
     * @param {Object} options - 設定オプション
     */
    constructor(container, options = {}) {
        super(container, {
            ...options,
            validateOnChange: true
        });

        this.selectedValues = new Set();
        this.maxSelections = options.maxSelections || Infinity;
    }

    /**
     * 選択肢グループを作成
     * @param {string} id - グループのID
     * @param {Object} options - グループのオプション
     * @returns {HTMLElement} 作成された選択肢グループ要素
     */
    createChoiceGroup(id, options = {}) {
        const group = document.createElement('div');
        group.classList.add('choices-container');

        if (options.label) {
            const label = document.createElement('div');
            label.classList.add('choices-label');
            label.textContent = options.label;
            if (options.required) {
                label.classList.add('required');
            }
            group.appendChild(label);
        }

        const choicesWrapper = document.createElement('div');
        choicesWrapper.classList.add('choices-wrapper');

        if (options.choices) {
            options.choices.forEach((choice, index) => {
                const choiceElement = this._createChoiceElement(id, choice, options.type || 'radio', index);
                choicesWrapper.appendChild(choiceElement);
            });
        }

        group.appendChild(choicesWrapper);

        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error-message');
        group.appendChild(errorDiv);

        this.formGroups.set(id, {
            group,
            choicesWrapper,
            errorDiv,
            options
        });

        this.form.appendChild(group);
        return group;
    }

    /**
     * 個別の選択肢要素を作成
     * @private
     * @param {string} groupId - グループのID
     * @param {Object} choice - 選択肢の設定
     * @param {string} type - 入力タイプ（radio/checkbox）
     * @param {number} index - 選択肢のインデックス
     * @returns {HTMLElement} 作成された選択肢要素
     */
    _createChoiceElement(groupId, choice, type, index) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('choice-option');

        const input = document.createElement('input');
        input.type = type;
        input.id = `${groupId}_${index}`;
        input.name = groupId;
        input.value = choice.value;
        
        if (choice.checked) {
            input.checked = true;
            if (type === 'checkbox') {
                this.selectedValues.add(choice.value);
            }
        }

        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.textContent = choice.label;

        if (choice.description) {
            const description = document.createElement('div');
            description.classList.add('choice-description');
            description.textContent = choice.description;
            label.appendChild(description);
        }

        wrapper.appendChild(input);
        wrapper.appendChild(label);

        // イベントリスナーの設定
        input.addEventListener('change', () => this._handleChoiceChange(groupId, choice.value, input));

        return wrapper;
    }

    /**
     * 選択肢の変更を処理
     * @private
     * @param {string} groupId - グループのID
     * @param {string} value - 選択された値
     * @param {HTMLElement} input - 入力要素
     */
    _handleChoiceChange(groupId, value, input) {
        const group = this.formGroups.get(groupId);
        if (!group) return;

        if (input.type === 'checkbox') {
            if (input.checked) {
                if (this.selectedValues.size >= this.maxSelections) {
                    input.checked = false;
                    this._showMaxSelectionError(groupId);
                    return;
                }
                this.selectedValues.add(value);
            } else {
                this.selectedValues.delete(value);
            }
        }

        this._updateSelectionCounter(groupId);
        this.validateField(groupId);

        // 変更イベントの発火
        if (this.options.onChange) {
            this.options.onChange({
                groupId,
                value,
                type: input.type,
                checked: input.checked,
                selectedValues: Array.from(this.selectedValues)
            });
        }
    }

    /**
     * 選択数カウンターを更新
     * @private
     * @param {string} groupId - グループのID
     */
    _updateSelectionCounter(groupId) {
        const group = this.formGroups.get(groupId);
        if (!group || !group.options.showCounter) return;

        let counter = group.group.querySelector('.selection-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.classList.add('selection-counter');
            group.group.appendChild(counter);
        }

        const selected = this.selectedValues.size;
        counter.textContent = `選択中: ${selected}/${this.maxSelections}`;
    }

    /**
     * 最大選択数エラーを表示
     * @private
     * @param {string} groupId - グループのID
     */
    _showMaxSelectionError(groupId) {
        const group = this.formGroups.get(groupId);
        if (!group) return;

        const errorDiv = group.errorDiv;
        errorDiv.textContent = `最大${this.maxSelections}個まで選択できます`;
        errorDiv.style.display = 'block';

        // エラーメッセージを一定時間後に消す
        setTimeout(() => {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }, 3000);
    }

    /**
     * 選択された値を取得
     * @param {string} groupId - グループのID
     * @returns {string|string[]} 選択された値（複数選択の場合は配列）
     */
    getSelectedValues(groupId) {
        const group = this.formGroups.get(groupId);
        if (!group) return null;

        const inputs = group.choicesWrapper.querySelectorAll('input:checked');
        const values = Array.from(inputs).map(input => input.value);

        return group.options.type === 'checkbox' ? values : values[0];
    }

    /**
     * 選択肢の値を設定
     * @param {string} groupId - グループのID
     * @param {string|string[]} values - 設定する値
     */
    setSelectedValues(groupId, values) {
        const group = this.formGroups.get(groupId);
        if (!group) return;

        const valueArray = Array.isArray(values) ? values : [values];
        
        // 既存の選択をクリア
        this.selectedValues.clear();
        group.choicesWrapper.querySelectorAll('input').forEach(input => {
            input.checked = valueArray.includes(input.value);
            if (input.checked && input.type === 'checkbox') {
                this.selectedValues.add(input.value);
            }
        });

        this._updateSelectionCounter(groupId);
        this.validateField(groupId);
    }

    /**
     * フィールドの検証をオーバーライド
     * @param {string} groupId - グループのID
     * @returns {boolean} 検証結果
     */
    validateField(groupId) {
        const group = this.formGroups.get(groupId);
        if (!group) return true;

        const selectedInputs = group.choicesWrapper.querySelectorAll('input:checked');
        const isValid = !group.options.required || selectedInputs.length > 0;

        this._updateFieldValidationState(groupId, isValid, isValid ? '' : '選択は必須です');
        return isValid;
    }
}

// グローバルスコープに公開
window.ChoicesComponent = ChoicesComponent;
