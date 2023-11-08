<template>
    <v-dialog v-model="isView" width="600px">
        <v-card>
            <DialogHeader title="商品登録"
                          @close="isView = false"> </DialogHeader>
            <v-card-text>
                <v-text-field label="名前"
                              v-model="form.name.value"
                              :error-messages="form.name.errorMessage"
                              :color="$baseColor1"></v-text-field>
                <v-row>
                    <v-col cols="6">
                        <v-text-field label="小売価格（税抜）"
                                      v-model="form.retailPrice.value"
                                      :error-messages="form.retailPrice.errorMessage"
                                      prefix="¥"
                                      :color="$baseColor1"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field label="卸売価格（税抜）"
                                      v-model="form.wholesalePrice.value"
                                      :error-messages="form.wholesalePrice.errorMessage"
                                      prefix="¥"
                                      :color="$baseColor1"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <v-text-field label="JANコード"
                                      v-model="form.janCode.value"
                                      :error-messages="form.janCode.errorMessage"
                                      :color="$baseColor1"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field label="商品識別コード"
                                      v-model="form.identifyCode.value"
                                      :error-messages="form.identifyCode.errorMessage"
                                      :color="$baseColor1"></v-text-field>
                    </v-col>
                </v-row>
                <v-select label="メーカー"
                          v-model="form.makerId.value"
                          :error-messages="form.makerId.errorMessage"
                          :items="makers"
                          item-text="name"
                          item-value="id"
                          :color="$baseColor1"></v-select>
                <v-btn depressed
                       :style="'background-color: '+$baseColor1+'; background-image: linear-gradient(135deg, '+$baseColor1+' 0%, '+$baseColor2+' 100%);'"
                       dark
                       @click="saveItem">保存</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import DialogHeader from "@/components/dialogHeader";
    export default {
        name: "addItemModal",
        components: {DialogHeader},
        data() {
            return {
                isView: false,
                makers: [],
                form: {
                    name: {
                        value: null,
                        errorMessage: null
                    },
                    retailPrice: {
                        value: null,
                        errorMessage: null
                    },
                    wholesalePrice: {
                        value: null,
                        errorMessage: null
                    },
                    janCode: {
                        value: null,
                        errorMessage: null
                    },
                    identifyCode: {
                        value: null,
                        errorMessage: null
                    },
                    makerId: {
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
                this.makers = [];
                this.form = {
                    name: {
                        value: null,
                        errorMessage: null
                    },
                    retailPrice: {
                        value: null,
                        errorMessage: null
                    },
                    wholesalePrice: {
                        value: null,
                        errorMessage: null
                    },
                    janCode: {
                        value: null,
                        errorMessage: null
                    },
                    identifyCode: {
                        value: null,
                        errorMessage: null
                    },
                    makerId: {
                        value: null,
                        errorMessage: null
                    }
                };
                this.isView = true;
                this.$axios.get("makers?limit=1000")
                    .then(res => {
                        for (var i in res.data.makers) {
                            var maker = res.data.makers[i];
                            this.makers.push({
                                id: maker.id,
                                name: maker.name
                            });
                        }
                    });
            },
            /**
             * 保存
             */
            saveItem()
            {
                this.form.name.errorMessage = null;
                this.form.retailPrice.errorMessage = null;
                this.form.wholesalePrice.errorMessage = null;
                this.form.janCode.errorMessage = null;
                this.form.identifyCode.errorMessage = null;
                this.form.makerId.errorMessage = null;

                this.$axios.post("/items", {
                    name: this.form.name.value,
                    retail_price: this.form.retailPrice.value,
                    wholesale_price: this.form.wholesalePrice.value,
                    jan_code: this.form.janCode.value,
                    identify_code: this.form.identifyCode.value,
                    maker_id: this.form.makerId.value,
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
                                } else if (error.parameter === "retail_price") {
                                    if (error.message === "required") {
                                        this.form.retailPrice.errorMessage = "入力必須";
                                    } else if (error.message === "invalid value") {
                                        this.form.retailPrice.errorMessage = "入力値が異常です";
                                    }
                                } else if (error.parameter === "wholesale_price") {
                                    if (error.message === "required") {
                                        this.form.wholesalePrice.errorMessage = "入力必須";
                                    } else if (error.message === "invalid value") {
                                        this.form.wholesalePrice.errorMessage = "入力値が異常です";
                                    }
                                } else if (error.parameter === "jan_code") {
                                    if (error.message === "required") {
                                        this.form.janCode.errorMessage = "入力必須";
                                    } else if (error.message === "invalid value") {
                                        this.form.janCode.errorMessage = "入力値が異常です";
                                    } else if (error.message === "already exists") {
                                        this.form.janCode.errorMessage = "すでに存在します";
                                    }
                                } else if (error.parameter === "identify_code") {
                                    if (error.message === "required") {
                                        this.form.identifyCode.errorMessage = "入力必須";
                                    } else if (error.message === "invalid value") {
                                        this.form.identifyCode.errorMessage = "入力値が異常です";
                                    } else if (error.message === "already exists") {
                                        this.form.identifyCode.errorMessage = "すでに存在します";
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
