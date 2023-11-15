<template>
    <div class="app">
        <div style="text-align: center">
            <img :src="logoImg" style="width: 200px; margin-top: 50px;">
            <h4>DISCOREマネージャー画面</h4>
        </div>
        <div class="login">
            <v-form class="login form"
                    @submit="login">
                <v-text-field label="メールアドレス"
                              :color="$baseColor1"
                              v-model="form.email.value"
                              :error-messages="form.email.errorMessage"></v-text-field>
                <v-text-field label="パスワード"
                              :color="$baseColor1"
                              type="password"
                              v-model="form.password.value"
                              :error-messages="form.password.errorMessage"></v-text-field>
                <v-btn @click="login"
                       depressed
                       block
                       dark
                       :style="$baseColorStyle">ログイン</v-btn>
                <v-btn text
                       :color="$baseColor1"
                       @click="$router.push('/passwordReminder')">初回ログイン・パスワードを忘れた方はこちら</v-btn>
            </v-form>
        </div>
    </div>
</template>

<script>
import LogoImg from "@/assets/images/logo.png";

export default {
    data () {
        return {
            logoImg: LogoImg,
            form: {
                email: {
                    value: null,
                    errorMessage: null
                },
                password: {
                    value: null,
                    errorMessage: null
                }
            }
        }
    },
    created() {
    },
    methods: {
        /**
         * ログイン処理を実行
         */
        login: function()
        {
            this.form.email.errorMessage = null;
            this.$axios.post("/authentication", {
                email: this.form.email.value,
                password: this.form.password.value,
            })
                .then(res => {
                    this.$cookies.set("access_token", res.data.access_token.token, 60*60*24);
                    this.$cookies.set("dealer_id", res.data.dealer_id, 60*60*24);
                    this.$cookies.set("manager_id", res.data.manager_id, 60*60*24);

                    this.$router.push({
                        path: '/myPage',
                        query: {
                            page: "dealers"
                        }
                    });
                })
                .catch(e => {
                    if (e.response.data.message === "invalid request parameter") {
                        if (e.response.data.errors.length === 0) {
                            this.form.email.errorMessage = "メールアドレスかパスワードかワンタイムパスワードに誤りがあります。";
                        } else {
                            for (var i in e.response.data.errors) {
                                var error = e.response.data.errors[i];
                                if (error.parameter === "email") {
                                    if (error.message === "required") {
                                        this.form.email.errorMessage = "入力必須です。";
                                    } else if (error.message === "invalid value") {
                                        this.form.email.errorMessage = "入力値が異常です。";
                                    }
                                } else if (error.parameter === "password") {
                                    if (error.message === "required") {
                                        this.form.password.errorMessage = "入力必須です。";
                                    } else if (error.message === "invalid value") {
                                        this.form.password.errorMessage = "入力値が異常です。";
                                    }
                                }
                            }
                        }
                    }
                });
        }
    }
}
</script>

<style scoped>
.app {
    background-color: #f7f9fb;
}
.login {
    padding: 20px;
    height: 500px;
}
.login .form {
    width: 300px;
    height: 200px;
    margin: 0 auto;
}
</style>
