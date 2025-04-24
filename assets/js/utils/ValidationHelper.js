/**
 * フォームバリデーションヘルパークラス
 */
class ValidationHelper {
    /**
     * メールアドレスの検証
     * @param {string} email - 検証するメールアドレス
     * @returns {boolean} 検証結果
     */
    static isValidEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    /**
     * パスワードの検証
     * @param {string} password - 検証するパスワード
     * @returns {boolean} 検証結果
     */
    static isValidPassword(password) {
        // 8文字以上、英数字を含む
        const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return pattern.test(password);
    }

    /**
     * 電話番号の検証
     * @param {string} phone - 検証する電話番号
     * @returns {boolean} 検証結果
     */
    static isValidPhone(phone) {
        // ハイフンありなしどちらも許容
        const pattern = /^(0\d{1,4}-?\d{1,4}-?\d{4})$/;
        return pattern.test(phone);
    }

    /**
     * 必須項目の検証
     * @param {string} value - 検証する値
     * @returns {boolean} 検証結果
     */
    static isRequired(value) {
        return value !== null && value !== undefined && value.trim() !== '';
    }

    /**
     * 最小文字数の検証
     * @param {string} value - 検証する値
     * @param {number} min - 最小文字数
     * @returns {boolean} 検証結果
     */
    static minLength(value, min) {
        return value.length >= min;
    }

    /**
     * 最大文字数の検証
     * @param {string} value - 検証する値
     * @param {number} max - 最大文字数
     * @returns {boolean} 検証結果
     */
    static maxLength(value, max) {
        return value.length <= max;
    }

    /**
     * 数値範囲の検証
     * @param {number} value - 検証する値
     * @param {number} min - 最小値
     * @param {number} max - 最大値
     * @returns {boolean} 検証結果
     */
    static isInRange(value, min, max) {
        const num = Number(value);
        return !isNaN(num) && num >= min && num <= max;
    }

    /**
     * カタカナの検証
     * @param {string} value - 検証する値
     * @returns {boolean} 検証結果
     */
    static isKatakana(value) {
        const pattern = /^[\u30A0-\u30FF\u3099\u309A\s]+$/;
        return pattern.test(value);
    }

    /**
     * ひらがなの検証
     * @param {string} value - 検証する値
     * @returns {boolean} 検証結果
     */
    static isHiragana(value) {
        const pattern = /^[\u3040-\u309F\s]+$/;
        return pattern.test(value);
    }
}

// グローバルスコープに公開
window.ValidationHelper = ValidationHelper; 