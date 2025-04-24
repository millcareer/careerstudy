// Event selection UI functionality
const MAX_EVENTS = 2;

export class EventSelectionUI {
    constructor(container) {
        this.container = container;
        this.selectedEvents = new Set();
        this.errorMessageTimeout = null;
    }

    initialize(events) {
        if (!Array.isArray(events) || events.length === 0) {
            console.error('Invalid events data provided');
            this.showErrorMessage('イベントデータの読み込みに失敗しました');
            return;
        }

        this.createUI(events);
        this.setupEventHandlers();
        this.updateSelectedEventsList(); // 初期状態を反映
    }

    createUI(events) {
        const wrapper = document.createElement('div');
        wrapper.className = 'event-selection-wrapper';

        const header = document.createElement('div');
        header.className = 'event-selection-header';
        header.innerHTML = `
            <h3>参加希望イベントを選択してください（最大${MAX_EVENTS}つまで）</h3>
            <p class="event-selection-counter">選択中: <span>0</span>/${MAX_EVENTS}</p>
            <p class="event-selection-error" style="display: none;"></p>
        `;

        const grid = document.createElement('div');
        grid.className = 'event-selection-grid';

        events.forEach(event => {
            const label = document.createElement('label');
            label.className = 'event-option';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = event.id;
            checkbox.name = 'event-option';
            checkbox.id = `event-${event.id}`;
            
            const eventInfo = document.createElement('span');
            eventInfo.className = 'event-info';
            eventInfo.innerHTML = `
                <strong>${event.name}</strong>
                ${event.description ? `<p class="event-description">${event.description}</p>` : ''}
            `;

            label.appendChild(checkbox);
            label.appendChild(eventInfo);
            grid.appendChild(label);
        });

        wrapper.appendChild(header);
        wrapper.appendChild(grid);

        // Hidden fields for form submission
        const hiddenContainer = document.createElement('div');
        hiddenContainer.style.display = 'none';
        hiddenContainer.innerHTML = `
            <input type="hidden" name="event1" value="">
            <input type="hidden" name="event2" value="">
        `;

        wrapper.appendChild(hiddenContainer);
        this.container.appendChild(wrapper);
    }

    setupEventHandlers() {
        const checkboxes = this.container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleCheckboxChange(e));
            
            // ラベルのホバー効果を強化
            const label = checkbox.closest('.event-option');
            if (label) {
                label.addEventListener('mouseenter', () => {
                    if (!checkbox.checked && this.selectedEvents.size < MAX_EVENTS) {
                        label.classList.add('event-option-hoverable');
                    }
                });
                label.addEventListener('mouseleave', () => {
                    label.classList.remove('event-option-hoverable');
                });
            }
        });
    }

    handleCheckboxChange(event) {
        const checkbox = event.target;
        const eventId = checkbox.value;
        const label = checkbox.closest('.event-option');

        if (checkbox.checked) {
            if (this.selectedEvents.size >= MAX_EVENTS) {
                checkbox.checked = false;
                this.showErrorMessage(`最大${MAX_EVENTS}つまでしか選択できません`);
                return;
            }
            this.selectedEvents.add(eventId);
            label?.classList.add('event-option-selected');
        } else {
            this.selectedEvents.delete(eventId);
            label?.classList.remove('event-option-selected');
        }

        this.updateSelectedEventsList();
        this.updateHiddenFields();
        this.updateCheckboxStates(); // 選択状態に応じてUI更新
    }

    updateSelectedEventsList() {
        const counter = this.container.querySelector('.event-selection-counter span');
        counter.textContent = this.selectedEvents.size.toString();
    }

    updateHiddenFields() {
        const selectedArray = Array.from(this.selectedEvents);
        const hiddenFields = this.container.querySelectorAll('input[type="hidden"]');
        
        hiddenFields.forEach((field, index) => {
            field.value = selectedArray[index] || '';
        });
    }

    updateCheckboxStates() {
        const checkboxes = this.container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const label = checkbox.closest('.event-option');
            if (!checkbox.checked && this.selectedEvents.size >= MAX_EVENTS) {
                checkbox.disabled = true;
                label?.classList.add('event-option-disabled');
            } else {
                checkbox.disabled = false;
                label?.classList.remove('event-option-disabled');
            }
        });
    }

    showErrorMessage(message) {
        const errorElement = this.container.querySelector('.event-selection-error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.classList.add('event-error-animate');

        if (this.errorMessageTimeout) {
            clearTimeout(this.errorMessageTimeout);
        }

        this.errorMessageTimeout = setTimeout(() => {
            errorElement.classList.remove('event-error-animate');
            errorElement.style.display = 'none';
        }, 3000);
    }
} 