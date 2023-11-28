<template>
    <v-dialog v-model="isView" width="600px">
        <v-card>
            <DialogHeader title="プロフィール"
                          @close="isView = false"> </DialogHeader>
            <v-tabs :color="$baseColor1">
                <v-tab> ディーラー情報 </v-tab>
                <v-tab> マネージャー情報 </v-tab>

                <v-tab-item class="tabBody">
                    <v-card-text>
                        <v-text-field v-if="isRoot"
                                      label="名前"
                                      v-model="dealer.name.value"
                                      :error-messages="dealer.name.errorMessage"
                                      :color="$baseColor1"></v-text-field>
                        <v-text-field v-else
                                      label="名前"
                                      v-model="dealer.name.value"
                                      :color="$baseColor1"
                                      readonly></v-text-field>
                        <v-text-field label="送料のデフォルト値"
                                      v-model="dealer.defaultPostage.value"
                                      prefix="¥"
                                      :color="$baseColor1"></v-text-field>
                        <v-btn v-if="isRoot"
                               depressed
                               :style="$baseColorStyle"
                               dark
                               @click="saveDealer">保存</v-btn>
                    </v-card-text>
                </v-tab-item>
                <v-tab-item>
                    <v-card-text>
                        <v-text-field label="名前"
                                      v-model="manager.name.value"
                                      :error-messages="manager.name.errorMessage"
                                      :color="$baseColor1"></v-text-field>
                        <v-text-field label="メールアドレス"
                                      v-model="manager.email.value"
                                      :color="$baseColor1"
                                      readonly
                                      @click="$refs.updateEmailModal.open(manager.email.value)"></v-text-field>
                        <v-text-field label="パスワード"
                                      v-model="manager.password.value"
                                      :error-messages="manager.password.errorMessage"
                                      :color="$baseColor1"></v-text-field>
                        <v-text-field label="パスワード（確認）"
                                      v-model="manager.passwordConfirm.value"
                                      :error-messages="manager.passwordConfirm.errorMessage"
                                      :color="$baseColor1"></v-text-field>
                        <v-btn depressed
                               :style="$baseColorStyle"
                               dark
                               @click="saveManager">保存</v-btn>
                    </v-card-text>
                </v-tab-item>
            </v-tabs>
        </v-card>
        <UpdateEmailModal ref="updateEmailModal"
                          @reload="reload"></UpdateEmailModal>
    </v-dialog>
</template>

<script>
    import DialogHeader from "@/components/dialogHeader";
    import UpdateEmailModal from "@/pages/mypage/components/updateEmailModal.vue";
    export default {
        name: "profileModal",
        components: {UpdateEmailModal, DialogHeader},
        data() {
            return {
                isView: false,
                isRoot: false,
                dealer: {
                    id: {
                        value: null
                    },
                    name: {
                        value: null,
                        errorMessage: null
                    },
                    defaultPostage: {
                        value: null,
                        errorMessage: null
                    },
                },
                manager: {
                    id: {
                        value: null
                    },
                    name: {
                        value: null,
                        errorMessage: null
                    },
                    email: {
                        value: null,
                        errorMessage: null
                    },
                    password: {
                        value: null,
                        errorMessage: null
                    },
                    passwordConfirm: {
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
                this.dealer = {
                    id: {
                        value: null
                    },
                    name: {
                        value: null,
                        errorMessage: null
                    },
                    defaultPostage: {
                        value: null,
                        errorMessage: null
                    },
                };
                this.manager = {
                    id: {
                        value: null
                    },
                    name: {
                        value: null,
                        errorMessage: null
                    },
                    email: {
                        value: null,
                        errorMessage: null
                    },
                    password: {
                        value: null,
                        errorMessage: null
                    },
                    passwordConfirm: {
                        value: null,
                        errorMessage: null
                    }
                };
                this.reload();
            },
            /**
             * 画面情報をリロードする
             */
            reload()
            {
                this.$axios.get("")
                    .then(res => {
                        this.manager.id.value = res.data.id;
                        this.manager.name.value = res.data.name;
                        this.manager.email.value = res.data.email;
                        this.isRoot = res.data.is_root;
                        this.isView = true;
                        this.oldManager = JSON.parse(JSON.stringify(this.manager));
                    });
                this.$axios.get("/dealer")
                    .then(res => {
                        this.dealer.name.value = res.data.name;
                        this.dealer.defaultPostage.value = res.data.default_postage;
                        this.oldDealer = JSON.parse(JSON.stringify(this.dealer));
                    });
            },
            /**
             * ディーラー情報保存
             */
            saveDealer()
            {
                this.dealer.name.errorMessage = null;

                var params = { };
                if (this.oldDealer.name.value !== this.dealer.name.value) {
                    params.name = this.dealer.name.value;
                }
                if (this.oldDealer.defaultPostage.value !== this.dealer.defaultPostage.value) {
                    params.default_postage = this.dealer.defaultPostage.value;
                }

                this.$axios.patch("/dealer", params)
                    .then(res => {
                        alert("ディーラー情報を更新しました。");
                    })
                    .catch(e => {
                        if (e.response.status === 400 &&
                            e.response.data.message === "invalid request parameter") {
                            for (var i in e.response.data.errors) {
                                var error = e.response.data.errors[i];
                                if (error.parameter === "name") {
                                    if (error.message === "not null") {
                                        this.dealer.name.errorMessage = "入力必須";
                                    }
                                }
                            }
                        }
                    });
            },
            /**
             * マネージャー情報を保存
             */
            saveManager()
            {
                this.manager.name.errorMessage = null;
                this.manager.password.errorMessage = null;
                this.manager.passwordConfirm.errorMessage = null;

                var params = {};
                if (this.oldManager.name.value !== this.manager.name.value) {
                    params.name = this.manager.name.value;
                }
                if (this.manager.password.value != null) {
                    params.password = this.manager.password.value;
                    params.password_confirm = this.manager.passwordConfirm.value;
                }

                this.$axios.patch("", params)
                    .then(res => {
                        alert("マネージャー情報を更新しました。");
                        this.manager.password.value = null;
                        this.manager.passwordConfirm.value = null;
                    })
                    .catch(e => {
                        if (e.response.status === 400 &&
                            e.response.data.message === "invalid request parameter") {
                            for (var i in e.response.data.errors) {
                                var error = e.response.data.errors[i];
                                if (error.parameter === "name") {
                                    if (error.message === "not null") {
                                        this.manager.name.errorMessage = "入力必須";
                                    }
                                } else if (error.parameter === "password") {
                                    if (error.message === "not null") {
                                        this.manager.password.errorMessage = "入力必須";
                                    } else if (error.message === "invalid value") {
                                        this.manager.password.errorMessage = "入力値が異常です";
                                    }
                                } else if (error.parameter === "password") {
                                    if (error.message === "invalid value") {
                                        this.manager.passwordConfirm.errorMessage = "入力必須";
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
