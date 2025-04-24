/**
 * イベント選択コンポーネント
 */
class EventSelectionComponent {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            maxSelection: options.maxSelection || 2,
            required: options.required || true,
            onChange: options.onChange || (() => {}),
            events: options.events || []
        };
        
        this.selectedEvents = new Set();
        this.init();
    }

    /**
     * 初期化
     */
    init() {
        this.createElements();
        this.setupEventListeners();
        this.updateCounter();
    }

    /**
     * 要素を作成
     */
    createElements() {
        const wrapper = DOMHelper.createElement('div', {
            className: 'event-selection-wrapper'
        });

        // ヘッダー部分
        const header = DOMHelper.createElement('div', {
            className: 'event-selection-header'
        });

        const title = DOMHelper.createElement('h3', {}, 'イベント選択');
        
        this.counter = DOMHelper.createElement('div', {
            className: 'event-selection-counter'
        });

        this.errorMessage = DOMHelper.createElement('div', {
            className: 'event-selection-error'
        });

        [title, this.counter].forEach(element => header.appendChild(element));

        // イベントグリッド
        this.grid = DOMHelper.createElement('div', {
            className: 'event-selection-grid'
        });

        // イベントオプションの作成
        this.options.events.forEach(event => {
            const option = this.createEventOption(event);
            this.grid.appendChild(option);
        });

        // 隠しフィールドの作成（フォーム送信用）
        this.hiddenInput = DOMHelper.createElement('input', {
            type: 'hidden',
            name: 'selectedEvents',
            value: ''
        });

        [header, this.grid, this.errorMessage, this.hiddenInput].forEach(element => {
            wrapper.appendChild(element);
        });

        this.container.appendChild(wrapper);
    }

    /**
     * イベントオプションを作成
     */
    createEventOption(event) {
        const option = DOMHelper.createElement('div', {
            className: 'event-option'
        });

        const checkbox = DOMHelper.createElement('input', {
            type: 'checkbox',
            id: `event-${event.id}`,
            value: event.id
        });

        const label = DOMHelper.createElement('label', {
            htmlFor: `event-${event.id}`,
            className: 'event-label'
        });

        const title = DOMHelper.createElement('div', {
            className: 'event-title'
        }, event.title);

        const info = DOMHelper.createElement('div', {
            className: 'event-info'
        });

        // 日時情報
        const dateTime = DOMHelper.createElement('div', {
            className: 'event-datetime'
        }, `${event.date} ${event.time}`);

        // 場所情報
        const location = DOMHelper.createElement('div', {
            className: 'event-location'
        }, event.location);

        [dateTime, location].forEach(element => info.appendChild(element));
        [title, info].forEach(element => label.appendChild(element));
        [checkbox, label].forEach(element => option.appendChild(element));

        return option;
    }

    /**
     * イベントリスナーを設定
     */
    setupEventListeners() {
        this.grid.addEventListener('change', (event) => {
            if (event.target.type === 'checkbox') {
                const eventId = event.target.value;
                
                if (event.target.checked) {
                    if (this.selectedEvents.size >= this.options.maxSelection) {
                        event.target.checked = false;
                        this.showError(`最大${this.options.maxSelection}つまで選択できます`);
                        return;
                    }
                    this.selectedEvents.add(eventId);
                } else {
                    this.selectedEvents.delete(eventId);
                }

                this.updateCounter();
                this.updateHiddenField();
                this.validateSelection();
                this.options.onChange(Array.from(this.selectedEvents));
            }
        });
    }

    /**
     * カウンターを更新
     */
    updateCounter() {
        this.counter.textContent = `${this.selectedEvents.size}/${this.options.maxSelection}つ選択中`;
    }

    /**
     * 隠しフィールドを更新
     */
    updateHiddenField() {
        this.hiddenInput.value = Array.from(this.selectedEvents).join(',');
    }

    /**
     * エラーメッセージを表示
     */
    showError(message) {
        this.errorMessage.textContent = message;
        setTimeout(() => {
            this.errorMessage.textContent = '';
        }, 3000);
    }

    /**
     * 選択の検証
     */
    validateSelection() {
        let errorMessage = '';

        if (this.options.required && this.selectedEvents.size === 0) {
            errorMessage = 'イベントを選択してください';
        }

        this.errorMessage.textContent = errorMessage;
        return !errorMessage;
    }

    /**
     * 選択されたイベントを取得
     */
    getSelectedEvents() {
        return Array.from(this.selectedEvents);
    }

    /**
     * イベントを選択
     */
    setSelectedEvents(eventIds) {
        this.selectedEvents.clear();
        const checkboxes = this.grid.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            checkbox.checked = eventIds.includes(checkbox.value);
            if (checkbox.checked) {
                this.selectedEvents.add(checkbox.value);
            }
        });

        this.updateCounter();
        this.updateHiddenField();
        this.validateSelection();
    }

    /**
     * リセット
     */
    reset() {
        this.selectedEvents.clear();
        const checkboxes = this.grid.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.checked = false);
        this.updateCounter();
        this.updateHiddenField();
        this.errorMessage.textContent = '';
    }
}

// グローバルスコープに公開
window.EventSelectionComponent = EventSelectionComponent; 