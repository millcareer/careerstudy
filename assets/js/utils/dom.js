/**
 * DOM操作のユーティリティクラス
 */
class DOMHelper {
    /**
     * 要素を作成
     * @param {string} tag - タグ名
     * @param {Object} attributes - 属性
     * @param {string|Node} content - コンテンツ
     * @returns {HTMLElement} 作成した要素
     */
    static createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        // 属性を設定
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });

        // コンテンツを設定
        if (content instanceof Node) {
            element.appendChild(content);
        } else if (content) {
            element.textContent = content;
        }

        return element;
    }

    /**
     * 要素を空にする
     * @param {HTMLElement} element - 対象要素
     */
    static empty(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    /**
     * クラスの切り替え
     * @param {HTMLElement} element - 対象要素
     * @param {string} className - クラス名
     * @param {boolean} force - 強制的に追加/削除
     */
    static toggleClass(element, className, force) {
        element.classList.toggle(className, force);
    }

    /**
     * 要素の表示/非表示を切り替え
     * @param {HTMLElement} element - 対象要素
     * @param {boolean} show - 表示するかどうか
     */
    static toggleVisibility(element, show) {
        element.style.display = show ? '' : 'none';
    }

    /**
     * イベントリスナーを追加
     * @param {HTMLElement} element - 対象要素
     * @param {string} eventType - イベントタイプ
     * @param {Function} handler - ハンドラー関数
     * @param {Object} options - オプション
     */
    static addEvent(element, eventType, handler, options = {}) {
        element.addEventListener(eventType, handler, options);
    }

    /**
     * イベントリスナーを削除
     * @param {HTMLElement} element - 対象要素
     * @param {string} eventType - イベントタイプ
     * @param {Function} handler - ハンドラー関数
     * @param {Object} options - オプション
     */
    static removeEvent(element, eventType, handler, options = {}) {
        element.removeEventListener(eventType, handler, options);
    }

    /**
     * 要素の位置を取得
     * @param {HTMLElement} element - 対象要素
     * @returns {Object} 位置情報
     */
    static getPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
        };
    }

    /**
     * 要素をフェードイン
     * @param {HTMLElement} element - 対象要素
     * @param {number} duration - アニメーション時間（ミリ秒）
     */
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = '';
        element.style.transition = `opacity ${duration}ms`;
        
        // リフロー
        element.offsetHeight;
        
        element.style.opacity = '1';
    }

    /**
     * 要素をフェードアウト
     * @param {HTMLElement} element - 対象要素
     * @param {number} duration - アニメーション時間（ミリ秒）
     */
    static fadeOut(element, duration = 300) {
        element.style.opacity = '1';
        element.style.transition = `opacity ${duration}ms`;
        
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }

    /**
     * フォーム要素の値を取得
     * @param {HTMLElement} form - フォーム要素
     * @returns {Object} フォームデータ
     */
    static getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (!Array.isArray(data[key])) {
                    data[key] = [data[key]];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }
        
        return data;
    }

    /**
     * フォーム要素に値を設定
     * @param {HTMLElement} form - フォーム要素
     * @param {Object} data - フォームデータ
     */
    static setFormData(form, data) {
        Object.entries(data).forEach(([key, value]) => {
            const element = form.elements[key];
            if (!element) return;

            if (element instanceof RadioNodeList) {
                Array.from(element).forEach(radio => {
                    radio.checked = radio.value === value;
                });
            } else if (element instanceof HTMLSelectElement) {
                element.value = value;
            } else if (element.type === 'checkbox') {
                element.checked = Array.isArray(value) 
                    ? value.includes(element.value)
                    : value === element.value;
            } else {
                element.value = value;
            }
        });
    }
}

// グローバルスコープに公開
window.DOMHelper = DOMHelper; 