import axios from 'axios';
import router from "../router";
import https from 'https';

export default {
    install(Vue) {
        /**
         * 基本設定
         * @type {AxiosInstance}
         */
        const http = axios.create({
            baseURL: "https://8.2.shino.app.discore.jp/api/v1/manager",
            //baseURL: "https://app.discore.jp/api/v1/manager",
            timeout: 100000,
            httpsAgent: new https.Agent({keepAlive: true})
        });

        /**
         * リクエスト時のオプション
         */
        http.interceptors.request.use((request) => {
            var headers = {};
            // アクセストークンをセット
            if (Vue.$cookies.isKey("manager.access_token")) {
                headers["Authorization"] = "Bearer " + Vue.$cookies.get("manager.access_token");
            }

            request.headers = headers;
            return request;
        });

        /**
         * レスポンスハンドラ
         */
        http.interceptors.response.use(
            /**
             * 通常レスポンスハンドラ
             * @param res
             * @return {AxiosResponse}
             */
            function(res)
            {
                return res;
            },

            /**
             * エラーレスポンスハンドラ
             * @param e
             * @return {Promise<*>}
             */
            function(e)
            {
                var isErrorFromAuthorization = false;
                for (var i in e.response.data.errors) {
                    var error = e.response.data.errors[i];
                    // エラーの原因がアクセストークンかチェック
                    if (error.parameter === "Authorization") {
                        isErrorFromAuthorization = true;
                    }
                }

                // エラーの原因が認証の場合、ログイン画面に戻る
                if (isErrorFromAuthorization) {
                    Vue.$cookies.remove("manager.access_token");
                    Vue.$cookies.remove("manager.admin_id");
                    router.push("/login");

                } else {
                    // 認証以外のエラーの場合は普通に例外を投げる
                    throw e;
                }
            });

        Vue.prototype.$axios = http;
    }
}
