<template>
    <v-dialog v-model="isView" width="600px">
        <v-card>
            <DialogHeader title="CSVによる商品管理"
                          @close="isView = false"> </DialogHeader>
            <v-tabs :color="$baseColor1">
                <v-tab> ダウンロード </v-tab>
                <v-tab> アップロード </v-tab>

                <v-tab-item class="tabBody">
                    <v-card-text>
                        <v-select label="表示列"
                                  multiple
                                  v-model="form.columns.value"
                                  :error-messages="form.columns.errorMessage"
                                  :items="columns"
                                  item-text="name"
                                  item-value="key"
                                  :color="$baseColor1"></v-select>
                        <v-btn depressed
                               :style="'background-color: '+$baseColor1+'; background-image: linear-gradient(135deg, '+$baseColor1+' 0%, '+$baseColor2+' 100%);'"
                               dark
                               @click="download">ダウンロード</v-btn>
                    </v-card-text>
                </v-tab-item>
                <v-tab-item>
                    <v-card-text>
                        <v-file-input label="CSVファイル"
                                      v-model="form.csvFile.value"
                                      :error-messages="form.csvFile.errorMessage"
                                      accept="text/plain"
                                      :color="$baseColor1"></v-file-input>
                        <v-btn depressed
                               :style="'background-color: '+$baseColor1+'; background-image: linear-gradient(135deg, '+$baseColor1+' 0%, '+$baseColor2+' 100%);'"
                               dark
                               @click="upload">アップロード</v-btn>
                    </v-card-text>
                </v-tab-item>
            </v-tabs>
        </v-card>
    </v-dialog>
</template>

<script>
    import DialogHeader from "@/components/dialogHeader";
    export default {
        name: "csvModal",
        components: {DialogHeader},
        data() {
            return {
                isView: false,
                columns: [
                    {
                        name: "id",
                        key: "id"
                    },
                    {
                        name: "小売価格",
                        key: "retail_price"
                    },
                    {
                        name: "卸売価格",
                        key: "wholesale_price"
                    },
                    {
                        name: "JANコード",
                        key: "jan_code"
                    },
                    {
                        name: "商品識別コード",
                        key: "jan_code"
                    },
                    {
                        name: "メーカーID",
                        key: "maker_id"
                    },
                    {
                        name: "ディーラー在庫数",
                        key: "dealer_stock_count"
                    },
                ],
                form: {
                    columns: {
                        value: [],
                        errorMessage: null
                    },
                    csvFile: {
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
                    columns: {
                        value: [
                            "id",
                            "retail_price",
                            "wholesale_price",
                            "jan_code",
                            "identify_code",
                            "maker_id",
                            "dealer_stock_count"
                        ],
                        errorMessage: null
                    },
                    csvFile: {
                        value: null,
                        errorMessage: null
                    }
                };
                this.isView = true;
            },
            /**
             * ダウンロード
             */
            download()
            {
                this.form.columns.errorMessage = null;
                this.$axios.get("/items/csv?columns=" + this.form.columns.value.join(","), {responseType: "blob"}).then(res => {
                    var url = URL.createObjectURL(new Blob([res.data], {type: "text/csv"}));
                    var link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "items.csv");
                    document.body.appendChild(link);
                    link.click();
                    URL.revokeObjectURL(url);
                    link.parentNode.removeChild(link);
                });
            },
            /**
             * アップロード
             */
            upload()
            {
                var formData = new FormData();
                formData.append("csv", this.form.csvFile.value);
                this.$axios.post("items/csv", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }).then(res => {
                    alert("登録更新を行いました。");
                    this.$emit("reload");
                    this.isView = false;
                }).catch(e => {
                    if (e.response.status === 400 &&
                        e.response.data.message === "invalid request parameter") {
                        alert("エラーが発生しました。アップロードするファイルをご確認ください。");
                        for (var i in e.response.data.errors) {
                            var error = e.response.data.errors[i];
                            if (error.parameter === "csv") {
                                if (error.message === "required") {
                                    this.form.csvFile.errorMessage = "入力必須";
                                } else if (error.message === "invalid value") {
                                    this.form.csvFile.errorMessage = "ファイルタイプが異常です";
                                } else if (error.message === "id not found") {
                                    this.form.csvFile.errorMessage = "id列で指定された商品が存在しません";
                                } else if (error.message === "name duplicated") {
                                    this.form.csvFile.errorMessage = "name列が重複しています";
                                } else if (error.message === "invalid retail_price value") {
                                    this.form.csvFile.errorMessage = "小売価格列の値が異常です";
                                } else if (error.message === "invalid wholesale_price value") {
                                    this.form.csvFile.errorMessage = "卸売価格列の値が異常です";
                                } else if (error.message === "invalid jan_code value") {
                                    this.form.csvFile.errorMessage = "JANコード列の値が異常です";
                                } else if (error.message === "jan_code duplicated") {
                                    this.form.csvFile.errorMessage = "JANコード列の値が重複しています";
                                } else if (error.message === "identify_code duplicated") {
                                    this.form.csvFile.errorMessage = "商品識別コード列の値が重複しています";
                                } else if (error.message === "maker_id not found") {
                                    this.form.csvFile.errorMessage = "メーカーID列の値が存在しません";
                                } else if (error.message === "invalid dealer_stock_count") {
                                    this.form.csvFile.errorMessage = "ディーラー在庫数列の値が異常です";
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
