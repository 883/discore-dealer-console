<template>
    <v-dialog v-model="isView" width="600px">
        <v-card>
            <DialogHeader title="商品詳細"
                          @close="isView = false"> </DialogHeader>
            <v-tabs :color="$baseColor1">
                <v-tab>情報</v-tab>
                <v-tab>在庫</v-tab>

                <v-tab-item>
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
                        <v-text-field label="ディーラー在庫数"
                                      v-model="form.dealerStockCount.value"
                                      :error-messages="form.dealerStockCount.errorMessage"
                                      :color="$baseColor1"></v-text-field>
                        <v-btn depressed
                               :style="'background-color: '+$baseColor1+'; background-image: linear-gradient(135deg, '+$baseColor1+' 0%, '+$baseColor2+' 100%);'"
                               dark
                               @click="save">保存</v-btn>
                        <v-btn depressed
                               color="red"
                               dark
                               @click="deleteItem">削除</v-btn>
                    </v-card-text>
                </v-tab-item>
                <v-tab-item>
                    <v-card-text>
                        <v-simple-table>
                            <template v-slot:default>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>支店名</th>
                                    <th>在庫数</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(branch, i) in branches"
                                    :key="i"
                                    @click="$refs.allocateModal.open(form, branch)">
                                    <td>{{branch.id}}</td>
                                    <td>{{branch.name}}</td>
                                    <td>{{branch.stockCount}}</td>
                                </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card-text>
                </v-tab-item>
            </v-tabs>
        </v-card>
        <AllocateModal ref="allocateModal"
                       @reload="reload"></AllocateModal>
    </v-dialog>
</template>

<script>
    import DialogHeader from "@/components/dialogHeader";
    import AllocateModal from "@/pages/mypage/items/components/allocateModal.vue";
    export default {
        name: "itemModal",
        components: {AllocateModal, DialogHeader},
        data() {
            return {
                isView: false,
                makers: [],
                form: {
                    id: {
                        value: null
                    },
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
                    },
                    dealerStockCount: {
                        value: null,
                        errorMessage: null
                    }
                },
                branches: []
            }
        },
        methods: {
            /**
             * 開く
             * @param itemId
             */
            open(itemId)
            {
                this.makers = [{
                    id: null,
                    name: "-"
                }];
                this.form = {
                    id: {
                        value: itemId
                    },
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
                    },
                    dealerStockCount: {
                        value: null,
                        errorMessage: null
                    }
                };
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
                this.reload();
            },
            reload()
            {
                this.branches = [];
                this.$axios.get("items/" + this.form.id.value)
                    .then(res => {
                        this.isView = true;
                        this.form.name.value = res.data.name;
                        this.form.retailPrice.value = res.data.retail_price;
                        this.form.wholesalePrice.value = res.data.wholesale_price;
                        this.form.janCode.value = res.data.jan_code;
                        this.form.identifyCode.value = res.data.identify_code;
                        this.form.makerId.value = res.data.maker == null ? null : res.data.maker.id;
                        this.form.dealerStockCount.value = res.data.dealer_stock_count;
                        this.old = JSON.parse(JSON.stringify(this.form));

                        for (var i in res.data.branches) {
                            var branch = res.data.branches[i];
                            this.branches.push({
                                id: branch.id,
                                name: branch.name,
                                stockCount: branch.stock_count
                            });
                        }
                    });
            },
            /**
             * 保存
             */
            save()
            {
                this.form.name.errorMessage = null;
                this.form.retailPrice.errorMessage = null;
                this.form.wholesalePrice.errorMessage = null;
                this.form.janCode.errorMessage = null;
                this.form.identifyCode.errorMessage = null;
                this.form.makerId.errorMessage = null;
                this.form.dealerStockCount.errorMessage = null;

                var params = {};
                if (this.form.name.value !== this.old.name.value) {
                    params.name = this.form.name.value;
                }
                if (this.form.retailPrice.value !== this.old.retailPrice.value) {
                    params.retail_price = this.form.retailPrice.value;
                }
                if (this.form.wholesalePrice.value !== this.old.wholesalePrice.value) {
                    params.wholesale_price = this.form.wholesalePrice.value;
                }
                if (this.form.janCode.value !== this.old.janCode.value) {
                    params.jan_code = this.form.janCode.value;
                }
                if (this.form.identifyCode.value !== this.old.identifyCode.value) {
                    params.identify_code = this.form.identifyCode.value;
                }
                if (this.form.makerId.value !== this.old.makerId.value) {
                    params.maker_id = this.form.makerId.value;
                }
                if (this.form.dealerStockCount.value !== this.old.dealerStockCount.value) {
                    params.dealer_stock_count = this.form.dealerStockCount.value;
                }
                this.$axios.patch("items/" + this.form.id.value, params).then(res => {
                    alert("更新しました。");
                    this.$emit("reload");
                }).catch(e => {
                    if (e.response.status === 400) {
                        if (e.response.data.message === "invalid request parameter") {
                            alert("入力された値に異常があります。");
                            for (var i in e.response.data.errors) {
                                var error = e.response.data.errors[i];
                                if (error.parameter === "name") {
                                    if (error.message === "not null") {
                                        this.form.name.errorMessage = "入力必須";
                                    } else if (error.message === "already exists") {
                                        this.form.name.errorMessage = "すでに存在しています";
                                    }
                                } else if (error.parameter === "retail_price") {
                                    if (error.message === "not null") {
                                        this.form.retailPrice.errorMessage = "入力必須";
                                    } else if (error.message === "invalid value") {
                                        this.form.retailPrice.errorMessage = "入力値が異常です";
                                    }
                                } else if (error.parameter === "wholesale_price") {
                                    if (error.message === "not null") {
                                        this.form.wholesalePrice.errorMessage = "入力必須";
                                    } else if (error.message === "invalid value") {
                                        this.form.wholesalePrice.errorMessage = "入力値が異常です";
                                    }
                                } else if (error.parameter === "jan_code") {
                                    if (error.message === "invalid value") {
                                        this.form.janCode.errorMessage = "入力値が異常です";
                                    } else if (error.message === "already exists") {
                                        this.form.janCode.errorMessage = "すでに存在しています";
                                    }
                                } else if (error.parameter === "identify_code") {
                                    if (error.message === "already exists") {
                                        this.form.identifyCode.errorMessage = "すでに存在しています";
                                    }
                                } else if (error.parameter === "dealer_stock_count") {
                                    if (error.message === "not null") {
                                        this.form.dealerStockCount.errorMessage = "null更新は不可です";
                                    } else if (error.message === "invalid value") {
                                        this.form.dealerStockCount.errorMessage = "入力値が異常です";
                                    }
                                }
                            }
                        }
                    }
                });
            },
            /**
             * 削除
             */
            deleteItem()
            {
                if (confirm("本当に削除してもよろしいですか？")) {
                    this.$axios.delete("items/" + this.form.id.value)
                        .then(res => {
                            alert("削除しました。");
                            this.$emit("reload");
                            this.isView = false;
                        });
                }
            }
        }
    }
</script>

<style scoped>

</style>
