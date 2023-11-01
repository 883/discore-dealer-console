<template>
    <v-dialog v-model="isView" width="600px">
        <v-card>
            <DialogHeader title="メールアドレス変更"
                          @close="isView = false"> </DialogHeader>
            <v-card-text>
                <v-text-field label="メールアドレス"
                              v-model="form.email.value"
                              :error-messages="form.email.errorMessage"
                              :color="$baseColor1"></v-text-field>
                <v-btn depressed
                       :style="'background-color: '+$baseColor1+'; background-image: linear-gradient(135deg, '+$baseColor1+' 0%, '+$baseColor2+' 100%);'"
                       dark
                       @click="save">登録</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import DialogHeader from "@/components/dialogHeader";
    export default {
        name: "updateEmailModal",
        components: {DialogHeader},
        data() {
            return {
                isView: false,
                form: {
                    email: {
                        value: null,
                        errorMessage: null
                    },
                },
            }
        },
        methods: {
            /**
             * 開く
             */
            open(email)
            {
                this.form = {
                    email: {
                        value: email,
                        errorMessage: null
                    },
                };
                this.isView = true;
            },
            /**
             * ディーラー情報保存
             */
            save()
            {
                this.form.email.errorMessage = null;

                this.$axios.patch("member", {
                    email: this.form.email.value
                })
                    .then(res => {
                        alert("入力されたメールアドレスに確認のメールを送信しました。\nメールボックスをご確認ください。");
                        this.$emit("reload");
                        this.isView = false;
                    })
                    .catch(e => {
                        if (e.response.status === 400 &&
                            e.response.data.message === "invalid request parameter") {
                            for (var i in e.response.data.errors) {
                                var error = e.response.data.errors[i];
                                if (error.parameter === "email") {
                                    if (error.message === "not null") {
                                        this.form.email.errorMessage = "入力必須";
                                    } else if (error.message === "invalid value") {
                                        this.form.email.errorMessage = "入力値が異常です";
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
</style>
