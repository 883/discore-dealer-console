<template>
    <v-dialog v-model="isView" width="600px">
        <v-card>
            <DialogHeader title="プロフィール"
                          @close="isView = false"> </DialogHeader>
            <v-tabs color="#9599E2">
                <v-tab> ディーラー情報 </v-tab>
                <v-tab> メンバー情報 </v-tab>

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
                        <v-btn v-if="isRoot"
                               depressed
                               :style="'background-color: '+$baseColor1+'; background-image: linear-gradient(135deg, '+$baseColor1+' 0%, '+$baseColor2+' 100%);'"
                               dark
                               @click="saveDealer">保存</v-btn>
                    </v-card-text>
                </v-tab-item>
                <v-tab-item>
                    <v-card-text>
                        <v-text-field label="名前"
                                      v-model="member.name.value"
                                      :error-messages="member.name.errorMessage"
                                      :color="$baseColor1"></v-text-field>
                        <v-text-field label="メールアドレス"
                                      v-model="member.email.value"
                                      :color="$baseColor1"
                                      readonly
                                      @click="$refs.updateEmailModal.open(member.email.value)"></v-text-field>
                        <v-text-field label="パスワード"
                                      v-model="member.password.value"
                                      :error-messages="member.password.errorMessage"
                                      :color="$baseColor1"></v-text-field>
                        <v-text-field label="パスワード（確認）"
                                      v-model="member.passwordConfirm.value"
                                      :error-messages="member.passwordConfirm.errorMessage"
                                      :color="$baseColor1"></v-text-field>
                        <v-btn depressed
                               :style="'background-color: '+$baseColor1+'; background-image: linear-gradient(135deg, '+$baseColor1+' 0%, '+$baseColor2+' 100%);'"
                               dark
                               @click="saveMember">保存</v-btn>
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
                },
                member: {
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
                };
                this.member = {
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
                this.$axios.get("/member")
                    .then(res => {
                        this.member.id.value = res.data.id;
                        this.member.name.value = res.data.name;
                        this.member.email.value = res.data.email;
                        this.isRoot = res.data.is_root;
                        this.isView = true;
                        this.oldMember = JSON.parse(JSON.stringify(this.member));
                    });
                this.$axios.get()
                    .then(res => {
                        this.dealer.name.value = res.data.name;
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

                this.$axios.patch("", params)
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
             * メンバー情報を保存
             */
            saveMember()
            {
                this.member.name.errorMessage = null;
                this.member.password.errorMessage = null;
                this.member.passwordConfirm.errorMessage = null;

                var params = {};
                if (this.oldMember.name.value !== this.member.name.value) {
                    params.name = this.member.name.value;
                }
                if (this.member.password.value != null) {
                    params.password = this.member.password.value;
                    params.password_confirm = this.member.passwordConfirm.value;
                }

                this.$axios.patch("/member", params)
                    .then(res => {
                        alert("メンバー情報を更新しました。");
                        this.member.password.value = null;
                        this.member.passwordConfirm.value = null;
                    })
                    .catch(e => {
                        if (e.response.status === 400 &&
                            e.response.data.message === "invalid request parameter") {
                            for (var i in e.response.data.errors) {
                                var error = e.response.data.errors[i];
                                if (error.parameter === "name") {
                                    if (error.message === "not null") {
                                        this.member.name.errorMessage = "入力必須";
                                    }
                                } else if (error.parameter === "password") {
                                    if (error.message === "not null") {
                                        this.member.password.errorMessage = "入力必須";
                                    } else if (error.message === "invalid value") {
                                        this.member.password.errorMessage = "入力値が異常です";
                                    }
                                } else if (error.parameter === "password") {
                                    if (error.message === "invalid value") {
                                        this.member.passwordConfirm.errorMessage = "入力必須";
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
