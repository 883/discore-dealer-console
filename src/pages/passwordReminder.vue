<template>
    <div class="app">
        <div style="text-align: center">
            <img :src="LogoImg" style="width: 200px; margin-top: 50px;">
            <h4>パスワード再発行</h4>
        </div>
        <div class="login">
            <v-form v-if="!isSent" class="login form">
                <v-text-field label="メールアドレス"
                              :color="$baseColor1"
                              v-model="passwordReminder.email"></v-text-field>
                <v-btn @click="send"
                       depressed
                       block
                       dark
                       :style="$baseColorStyle">送信</v-btn>
                <v-btn text
                       :color="$baseColor1"
                       @click="$router.push('/login')">ログイン画面に戻る</v-btn>
            </v-form>
            <div v-else
                 class="login message">
                入力されたメールアドレスに一時パスワードを送信しました。<br>
                一時パスワードを用いてログインすることが可能です。<br>
                <v-btn text
                       :color="$baseColor1"
                       @click="$router.push('/login')">ログイン画面に戻る</v-btn>
            </div>
        </div>
    </div>
</template>

<script>
    import LogoImg from "@/assets/images/logo.png";
    export default {
        data () {
            return {
                LogoImg: LogoImg,

                isSent: false,
                passwordReminder: {
                    email: null,
                }
            }
        },
        methods: {
            /**
             * パスワードリマインダーメールを送信
             */
            send()
            {
                this.$axios.post("/send_onetime_password", {
                    email: this.passwordReminder.email
                })
                    .then(res => {
                        this.isSent = true;
                    });
            },
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
    .login .message {
        width: 500px;
        height: 200px;
        margin: 0 auto;
    }
</style>
