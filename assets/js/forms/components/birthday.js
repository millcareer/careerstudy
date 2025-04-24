/**
 * 生年月日コンポーネント
 * 年月日の選択を管理するクラス
 */
class BirthdayComponent {
    /**
     * @param {HTMLElement} container - コンポーネントを配置するコンテナ要素
     * @param {Object} options - 設定オプション
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            yearRange: options.yearRange || 80,
            startYear: options.startYear || new Date().getFullYear() - 18,
            required: options.required || true,
            onChange: options.onChange || (() => {})
        };
        
        this.init();
    }

    /**
     * 初期化
     */
    init() {
        this.createElements();
        this.setupEventListeners();
        this.populateOptions();
    }

    /**
     * 要素を作成
     */
    createElements() {
        const label = DOMHelper.createElement('label', {
            className: 'form-label' + (this.options.required ? ' required' : '')
        }, '生年月日');

        this.yearSelect = DOMHelper.createElement('select', {
            name: 'birthYear',
            className: 'birthday-select',
            required: this.options.required
        });

        this.monthSelect = DOMHelper.createElement('select', {
            name: 'birthMonth',
            className: 'birthday-select',
            required: this.options.required
        });

        this.daySelect = DOMHelper.createElement('select', {
            name: 'birthDay',
            className: 'birthday-select',
            required: this.options.required
        });

        const selectContainer = DOMHelper.createElement('div', {
            className: 'birthday-select-container'
        });

        // 年月日のラベルと選択ボックスを追加
        const yearWrapper = DOMHelper.createElement('div', { className: 'birthday-select-wrapper' });
        yearWrapper.appendChild(this.yearSelect);
        yearWrapper.appendChild(DOMHelper.createElement('span', { className: 'birthday-unit' }, '年'));

        const monthWrapper = DOMHelper.createElement('div', { className: 'birthday-select-wrapper' });
        monthWrapper.appendChild(this.monthSelect);
        monthWrapper.appendChild(DOMHelper.createElement('span', { className: 'birthday-unit' }, '月'));

        const dayWrapper = DOMHelper.createElement('div', { className: 'birthday-select-wrapper' });
        dayWrapper.appendChild(this.daySelect);
        dayWrapper.appendChild(DOMHelper.createElement('span', { className: 'birthday-unit' }, '日'));

        [yearWrapper, monthWrapper, dayWrapper].forEach(wrapper => {
            selectContainer.appendChild(wrapper);
        });

        this.errorMessage = DOMHelper.createElement('div', {
            className: 'error-message'
        });

        [label, selectContainer, this.errorMessage].forEach(element => {
            this.container.appendChild(element);
        });
    }

    /**
     * オプションを設定
     */
    populateOptions() {
        // 年の選択肢を生成
        const endYear = this.options.startYear;
        const startYear = endYear - this.options.yearRange;

        this.addOption(this.yearSelect, '', '年');
        for (let year = endYear; year >= startYear; year--) {
            this.addOption(this.yearSelect, year, year);
        }

        // 月の選択肢を生成
        this.addOption(this.monthSelect, '', '月');
        for (let month = 1; month <= 12; month++) {
            this.addOption(this.monthSelect, month, month);
        }

        // 日の選択肢を更新
        this.updateDays();
    }

    /**
     * 選択肢を追加
     */
    addOption(select, value, label) {
        const option = DOMHelper.createElement('option', {
            value: value
        }, label);
        select.appendChild(option);
    }

    /**
     * 日の選択肢を更新
     */
    updateDays() {
        const year = parseInt(this.yearSelect.value);
        const month = parseInt(this.monthSelect.value);
        const currentDay = this.daySelect.value;

        // 現在の日付をクリア
        DOMHelper.empty(this.daySelect);
        this.addOption(this.daySelect, '', '日');

        if (year && month) {
            const daysInMonth = new Date(year, month, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                this.addOption(this.daySelect, day, day);
            }
        }

        // 以前選択されていた日付が有効な場合は再選択
        if (currentDay && currentDay <= this.daySelect.options.length - 1) {
            this.daySelect.value = currentDay;
        }
    }

    /**
     * イベントリスナーを設定
     */
    setupEventListeners() {
        // 年または月が変更されたら日の選択肢を更新
        this.yearSelect.addEventListener('change', () => this.updateDays());
        this.monthSelect.addEventListener('change', () => this.updateDays());

        // 値が変更されたら通知
        [this.yearSelect, this.monthSelect, this.daySelect].forEach(select => {
            select.addEventListener('change', () => {
                this.validateDate();
                this.options.onChange(this.getValue());
            });
        });
    }

    /**
     * 日付の検証
     */
    validateDate() {
        const { year, month, day } = this.getValue();
        let errorMessage = '';

        if (this.options.required) {
            if (!year || !month || !day) {
                errorMessage = '生年月日を選択してください';
            }
        }

        if (year && month && day) {
            const date = new Date(year, month - 1, day);
            const now = new Date();
            
            if (date > now) {
                errorMessage = '未来の日付は選択できません';
            }
        }

        this.errorMessage.textContent = errorMessage;
        return !errorMessage;
    }

    /**
     * 値を取得
     */
    getValue() {
        return {
            year: this.yearSelect.value ? parseInt(this.yearSelect.value) : null,
            month: this.monthSelect.value ? parseInt(this.monthSelect.value) : null,
            day: this.daySelect.value ? parseInt(this.daySelect.value) : null
        };
    }

    /**
     * 値を設定
     */
    setValue(year, month, day) {
        this.yearSelect.value = year || '';
        this.monthSelect.value = month || '';
        this.updateDays();
        this.daySelect.value = day || '';
        this.validateDate();
    }

    /**
     * リセット
     */
    reset() {
        this.yearSelect.value = '';
        this.monthSelect.value = '';
        this.daySelect.value = '';
        this.errorMessage.textContent = '';
    }
}

// グローバルスコープに公開
window.BirthdayComponent = BirthdayComponent; 