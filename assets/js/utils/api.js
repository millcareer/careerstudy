/**
 * API通信を管理するクラス
 */
class APIClient {
    /**
     * @param {string} baseURL - APIのベースURL
     */
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    /**
     * ヘッダーを設定
     * @param {Object} headers - 設定するヘッダー
     */
    setHeaders(headers) {
        this.headers = { ...this.headers, ...headers };
    }

    /**
     * GETリクエスト
     * @param {string} endpoint - エンドポイント
     * @param {Object} params - クエリパラメータ
     * @returns {Promise} レスポンス
     */
    async get(endpoint, params = {}) {
        const url = new URL(this.baseURL + endpoint);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API GET request failed:', error);
            throw error;
        }
    }

    /**
     * POSTリクエスト
     * @param {string} endpoint - エンドポイント
     * @param {Object} data - 送信データ
     * @returns {Promise} レスポンス
     */
    async post(endpoint, data = {}) {
        try {
            const response = await fetch(this.baseURL + endpoint, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API POST request failed:', error);
            throw error;
        }
    }

    /**
     * PUTリクエスト
     * @param {string} endpoint - エンドポイント
     * @param {Object} data - 送信データ
     * @returns {Promise} レスポンス
     */
    async put(endpoint, data = {}) {
        try {
            const response = await fetch(this.baseURL + endpoint, {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API PUT request failed:', error);
            throw error;
        }
    }

    /**
     * DELETEリクエスト
     * @param {string} endpoint - エンドポイント
     * @returns {Promise} レスポンス
     */
    async delete(endpoint) {
        try {
            const response = await fetch(this.baseURL + endpoint, {
                method: 'DELETE',
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API DELETE request failed:', error);
            throw error;
        }
    }

    /**
     * ファイルアップロード
     * @param {string} endpoint - エンドポイント
     * @param {FormData} formData - アップロードするファイルデータ
     * @returns {Promise} レスポンス
     */
    async uploadFile(endpoint, formData) {
        try {
            const headers = { ...this.headers };
            delete headers['Content-Type']; // FormDataの場合は自動設定

            const response = await fetch(this.baseURL + endpoint, {
                method: 'POST',
                headers: headers,
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('File upload failed:', error);
            throw error;
        }
    }
}

// グローバルスコープに公開
window.APIClient = APIClient; 