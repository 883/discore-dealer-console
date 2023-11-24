<template>
    <v-dialog v-model="isView" width="600px">
        <v-card>
            <DialogHeader title="支店登録"
                          @close="isView = false"> </DialogHeader>
            <v-card-text>
                <v-text-field label="名前"
                              v-model="form.name.value"
                              :error-messages="form.name.errorMessage"
                              :color="$baseColor1"></v-text-field>
                <v-text-field label="住所"
                              v-model="form.address.value"
                              :error-messages="form.address.errorMessage"
                              :color="$baseColor1"></v-text-field>
                <v-text-field label="電話番号"
                              v-model="form.tel.value"
                              :error-messages="form.tel.errorMessage"
                              :color="$baseColor1"></v-text-field>
                <v-text-field label="FAX番号"
                              v-model="form.fax.value"
                              :error-messages="form.fax.errorMessage"
                              :color="$baseColor1"></v-text-field>
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
        name: "addBranchModal",
        components: {DialogHeader},
        data() {
            return {
                isView: false,
                form: {
                    name: {
                        value: null,
                        errorMessage: null
                    },
                    address: {
                        value: null,
                        errorMessage: null
                    },
                    tel: {
                        value: null,
                        errorMessage: null
                    },
                    fax: {
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
                this.form = {
                    name: {
                        value: null,
                        errorMessage: null
                    },
                    address: {
                        value: null,
                        errorMessage: null
                    },
                    tel: {
                        value: null,
                        errorMessage: null
                    },
                    fax: {
                        value: null,
                        errorMessage: null
                    }
                };
                this.isView = true;
            },
            /**
             * 保存
             */
            save()
            {
                this.form.name.errorMessage = null;

                this.$axios.post("/branches", {
                    name: this.form.name.value,
                    address: this.form.address.value,
                    tel: this.form.tel.value,
                    fax: this.form.fax.value,
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
                                } else if (error.parameter === "address") {
                                    if (error.message === "required") {
                                        this.form.address.errorMessage = "入力必須";
                                    }
                                } else if (error.parameter === "tel") {
                                    if (error.message === "required") {
                                        this.form.tel.errorMessage = "入力必須";
                                    } else if (error.message === "invalid value") {
                                        this.form.tel.errorMessage = "入力値が異常です";
                                    }
                                } else if (error.parameter === "fax") {
                                    if (error.message === "invalid value") {
                                        this.form.fax.errorMessage = "入力値が異常です";
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

</style>
