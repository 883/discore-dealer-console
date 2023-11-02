<template>
    <v-dialog v-model="isView" width="600px">
        <v-card>
            <DialogHeader title="マネージャー登録"
                          @close="isView = false"> </DialogHeader>
            <v-card-text>
                <v-text-field label="名前"
                              v-model="form.name.value"
                              :error-messages="form.name.errorMessage"
                              :color="$baseColor1"></v-text-field>
                <v-text-field label="メールアドレス"
                              v-model="form.email.value"
                              :error-messages="form.email.errorMessage"
                              :color="$baseColor1"></v-text-field>
                <v-btn v-if="isRoot"
                       depressed
                       :style="'background-color: '+$baseColor1+'; background-image: linear-gradient(135deg, '+$baseColor1+' 0%, '+$baseColor2+' 100%);'"
                       dark
                       @click="save">登録</v-btn>
                <template v-else>
                    マネージャーの操作権限がありません。
                </template>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import DialogHeader from "@/components/dialogHeader";
    export default {
        name: "addManagerModal",
        components: {DialogHeader},
        data() {
            return {
                isView: false,
                isRoot: false,
                form: {
                    name: {
                        value: null,
                        errorMessage: null
                    },
                    email: {
                        value: null,
                        errorMessage: null
                    }
                }
            }
        },
        methods: {
            /**
             * 開く
             */
            open()
            {
                this.isRoot = false;
                this.form = {
                    name: {
                        value: null,
                        errorMessage: null
                    },
                    email: {
                        value: null,
                        errorMessage: null
                    },
                };
                this.isView = true;
                this.$axios.get("")
                    .then(res => {
                        this.isRoot = res.data.is_root;
                    });
            },
            /**
             * 保存
             */
            save()
            {
                this.form.name.errorMessage = null;
                this.form.email.errorMessage = null;

                this.$axios.post("/managers", {
                    name: this.form.name.value,
                    email: this.form.email.value
                }).then(res => {
                    alert("登録しました。");
                    this.$emit("reload");
                    this.isView = false;
                }).catch(e => {
                    if (e.response.status === 400) {
                        if (e.response.data.message === "invalid request parameter") {
                            alert("入力された値に異常があります。");
                            for (var i in e.response.data.errors) {
                                var error = e.response.data.errors[i];
                                if (error.parameter === "name") {
                                    if (error.message === "required") {
                                        this.form.name.errorMessage = "入力必須";
                                    } else if (error.message === "already exists") {
                                        this.form.name.errorMessage = "すでに存在します";
                                    }
                                } else if (error.parameter === "email") {
                                    if (error.message === "required") {
                                        this.form.email.errorMessage = "入力必須";
                                    } else if (error.message === "invalid value") {
                                        this.form.email.errorMessage = "入力値が異常です";
                                    } else if (error.message === "already exists") {
                                        this.form.email.errorMessage = "すでに存在します";
                                    }
                                }
                            }
                        } else if (e.response.data.message === "exceed max_member_count") {
                            alert("メンバー作成数上限に達しています。");
                        }
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
