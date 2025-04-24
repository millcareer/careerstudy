import { DOMHelper } from '../utils/helpers.js';

/**
 * 認証とユーザー情報を管理するクラス
 */
export class Auth {
    constructor() {
        this.isInitialized = false;
        this.profile = null;
    }

    /**
     * LIFFの初期化
     * @returns {Promise<void>}
     */
    async initialize() {
        try {
            // LIFFが利用可能か確認
            if (!window.liff) {
                throw new Error('LIFF SDKが読み込まれていません');
            }

            // LIFF初期化
            await liff.init({ liffId: process.env.LIFF_ID || '' });
            this.isInitialized = true;

            // ログイン状態を確認
            if (liff.isLoggedIn()) {
                await this.loadUserProfile();
            }

        } catch (error) {
            console.error('LIFF初期化エラー:', error);
            DOMHelper.showError('LINEの初期化に失敗しました。ページを再読み込みしてください。');
            throw error;
        }
    }

    /**
     * ユーザープロフィールの読み込み
     * @returns {Promise<void>}
     */
    async loadUserProfile() {
        try {
            if (!this.isInitialized) {
                throw new Error('LIFFが初期化されていません');
            }

            if (!liff.isLoggedIn()) {
                throw new Error('ログインしていません');
            }

            this.profile = await liff.getProfile();

        } catch (error) {
            console.error('プロフィール取得エラー:', error);
            DOMHelper.showError('LINEプロフィールの取得に失敗しました');
            throw error;
        }
    }

    /**
     * LINEログイン
     * @returns {Promise<void>}
     */
    async login() {
        if (!this.isInitialized) {
            throw new Error('LIFFが初期化されていません');
        }

        if (!liff.isLoggedIn()) {
            liff.login();
        }
    }

    /**
     * LINEログアウト
     */
    logout() {
        if (this.isInitialized && liff.isLoggedIn()) {
            liff.logout();
            this.profile = null;
        }
    }

    /**
     * ユーザープロフィールの取得
     * @returns {Object|null} ユーザープロフィール
     */
    getProfile() {
        return this.profile;
    }

    /**
     * ログイン状態の確認
     * @returns {boolean} ログイン状態
     */
    isLoggedIn() {
        return this.isInitialized && liff.isLoggedIn();
    }

    /**
     * LINEアプリ内での実行かどうかを確認
     * @returns {boolean} LINEアプリ内での実行かどうか
     */
    isInClient() {
        return this.isInitialized && liff.isInClient();
    }

    /**
     * LINEアプリを閉じる
     */
    closeWindow() {
        if (this.isInitialized && this.isInClient()) {
            liff.closeWindow();
        }
    }
}

// シングルトンインスタンスをエクスポート
export const auth = new Auth(); 