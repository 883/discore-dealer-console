<template>
    <div style="background-color: white; padding: 10px;">
        <v-row>
            <!--検索ボックス-->
            <v-col cols="4">
                <div class="search-form">
                    <h4 style="padding-left: 10px;">検索フォーム</h4>
                    <v-menu ref="datePicker"
                            v-model="isOpenFromDatePicker"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="290px">
                        <template v-slot:activator="{ on }">
                            <v-text-field v-model="form.fromDatetime"
                                          label="期間（下限）"
                                          readonly
                                          dense
                                          color="#9599E2"
                                          v-on="on"
                                          append-outer-icon="mdi-close"
                                          @click:append-outer="form.fromDatetime = null"></v-text-field>
                        </template>
                        <v-date-picker v-model="form.fromDatetime"
                                       no-title
                                       scrollable
                                       color="#9599E2"
                                       @click:date="isOpenFromDatePicker = false">
                        </v-date-picker>
                    </v-menu>
                    <v-menu ref="datePicker"
                            v-model="isOpenToDatePicker"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="290px">
                        <template v-slot:activator="{ on }">
                            <v-text-field v-model="form.toDatetime"
                                          label="期間（上限）"
                                          readonly
                                          dense
                                          color="#9599E2"
                                          v-on="on"
                                          append-outer-icon="mdi-close"
                                          @click:append-outer="form.toDatetime = null"></v-text-field>
                        </template>
                        <v-date-picker v-model="form.toDatetime"
                                       no-title
                                       scrollable
                                       color="#9599E2"
                                       @click:date="isOpenToDatePicker = false">
                        </v-date-picker>
                    </v-menu>

                    <v-btn :style="$baseColorStyle"
                           dark
                           depressed
                           @click="reload">検索</v-btn>
                </div>
            </v-col>

            <v-col cols="8">
                <div class="main">
                    <v-text-field label="総注文額"
                                  v-model="results.totalOrderPrice.toLocaleString()"
                                  :color="$baseColor1"
                                  prefix="¥"
                                  readonly></v-text-field>
                    <v-text-field label="総注文件数"
                                  v-model="results.totalOrderCount.toLocaleString()"
                                  :color="$baseColor1"
                                  readonly></v-text-field>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    const LIMIT = 10;

    export default {
        name: "report",
        components: {},
        data () {
            return {
                isOpenFromDatePicker: false,
                isOpenToDatePicker: false,
                form: {
                    fromDatetime: null,
                    toDatetime: null
                },
                results: {
                    totalOrderPrice: 0,
                    totalOrderCount: 0
                }
            }
        },
        created() {
            this.isOpenFromDatePicker = false;
            this.isOpenToDatePicker = false;
            this.form = {
                fromDatetime: null,
                toDatetime: null
            };
            this.reload();
        },
        methods: {
            /**
             */
            reload()
            {
                var params = [];
                if (this.form.fromDatetime != null) {
                    params.push("from_datetime=" + this.form.fromDatetime + " 00:00:00");
                }
                if (this.form.toDatetime != null) {
                    params.push("to_datetime=" + this.form.toDatetime + " 23:59:59");
                }

                // 総額
                var url = "analytics/total_order_price";
                if (params.length > 0) {
                    url += "?" + params.join("&");
                }
                this.$axios.get(url).then(response => {
                    this.results.totalOrderPrice = response.data.result;
                });
                // 総件数
                url = "analytics/total_order_count";
                if (params.length > 0) {
                    url += "?" + params.join("&");
                }
                this.$axios.get(url).then(response => {
                    this.results.totalOrderCount = response.data.result;
                });
            },
        },
    }
</script>

<style scoped>
    .search-form {
        border: 3px solid #E4E7ED;
        border-radius: 6px;
        padding: 5px;
    }
    .main {
        border: 3px solid #E4E7ED;
        border-radius: 6px;
        padding: 5px;
    }
</style>
