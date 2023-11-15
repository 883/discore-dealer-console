<template>
    <v-dialog v-model="isView" width="600px">
        <v-card>
            <DialogHeader title="スタッフ登録"
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
                <v-select label="担当支店"
                          :items="branches"
                          v-model="form.branchId.value"
                          item-text="name"
                          item-value="id"
                          :error-messages="form.branchId.errorMessage"
                          :color="$baseColor1"></v-select>
                <v-btn depressed
                       :style="$baseColorStyle"
                       dark
                       @click="save">登録</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import DialogHeader from "@/components/dialogHeader";
    export default {
        name: "addStaffModal",
        components: {DialogHeader},
        data() {
            return {
                isView: false,
                branches: [],
                form: {
                    name: {
                        value: null,
                        errorMessage: null
                    },
                    email: {
                        value: null,
                        errorMessage: null
                    },
                    branchId: {
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
                this.branches = [];
                this.form = {
                    name: {
                        value: null,
                        errorMessage: null
                    },
                    email: {
                        value: null,
                        errorMessage: null
                    },
                    branchId: {
                        value: null,
                        errorMessage: null
                    }
                };
                this.$axios.get("branches?limit=1000")
                    .then(res => {
                        for (var i in res.data.branches) {
                            var branch = res.data.branches[i];
                            this.branches.push({
                                id: branch.id,
                                name: branch.name
                            });
                        }
                        if (this.branches.length === 1) {
                            this.form.branchId.value = this.branches[0].id;
                        }
                    });
                this.isView = true;
            },
            /**
             * 保存
             */
            save()
            {
                this.form.name.errorMessage = null;
                this.form.email.errorMessage = null;
                this.form.branchId.errorMessage = null;

                this.$axios.post("/staffs", {
                    name: this.form.name.value,
                    email: this.form.email.value,
                    branch_id: this.form.branchId.value
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
                                } else if (error.parameter === "branch_id") {
                                    if (error.message === "required") {
                                        this.form.branchId.errorMessage = "入力必須";
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
