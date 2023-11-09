<template>
    <v-dialog v-model="isView" width="600px">
        <v-card>
            <DialogHeader title="在庫割り当て"
                          @close="isView = false"> </DialogHeader>
            <v-card-text>
                <v-text-field label="支店名"
                              v-model="branch.name"
                              :color="$baseColor1"
                              readonly></v-text-field>
                <v-text-field label="割り当て在庫数"
                              v-model="form.count.value"
                              :error-messages="form.count.errorMessage"
                              suffix="個"
                              :hint="'ディーラー在庫数：' + item.dealerStockCount"
                              persistent-hint
                              :color="$baseColor1"></v-text-field>
                <v-btn depressed
                       :style="'background-color: '+$baseColor1+'; background-image: linear-gradient(135deg, '+$baseColor1+' 0%, '+$baseColor2+' 100%);'"
                       dark
                       @click="allocate">割り当てる</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import DialogHeader from "@/components/dialogHeader";
    export default {
        name: "allocateModal",
        components: {DialogHeader},
        data() {
            return {
                isView: false,
                branch: {
                    id: null,
                    name: null,
                },
                item: {
                    id: null,
                    name: null,
                    dealerStockCount: null
                },
                form: {
                    count: {
                        value: 0,
                        errorMessage: null
                    },
                }
            }
        },
        methods: {
            /**
             * 開く
             * @param item
             * @param branch
             */
            open(item, branch)
            {
                this.item = {
                    id: item.id.value,
                    name: item.name.value,
                    dealerStockCount: item.dealerStockCount.value
                };
                this.branch = branch;
                this.form = {
                    count: {
                        value: 0,
                        errorMessage: null
                    },
                };
                this.isView = true;
            },
            /**
             * 保存
             */
            allocate()
            {
                this.form.count.errorMessage = null;

                this.$axios.post("/items/" + this.item.id + "/allocate_to_branch/" + this.branch.id, {
                    count: this.form.count.value,
                }).then(res => {
                    alert("在庫を割り当てました。");
                    this.$emit("reload");
                    this.isView = false;
                }).catch(e => {
                    if (e.response.status === 400) {
                        if (e.response.data.message === "invalid request parameter") {
                            alert("入力された値に異常があります。");
                            for (var i in e.response.data.errors) {
                                var error = e.response.data.errors[i];
                                if (error.parameter === "count") {
                                    if (error.message === "required") {
                                        this.form.count.errorMessage = "入力必須";
                                    } else if (error.message === "invalid value") {
                                        this.form.count.errorMessage = "すでに存在します";
                                    } else if (error.message === "exceed dealer_stock_count") {
                                        this.form.count.errorMessage = "ディーラー在庫数を上回っています";
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
