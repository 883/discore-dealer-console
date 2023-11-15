<template>
    <div style="background-color: white; padding: 10px;">
        <v-row>
            <!--検索ボックス-->
            <v-col cols="4">
                <div class="search-form">
                    <h4 style="padding-left: 10px;">検索フォーム</h4>
                    <v-text-field label="名前"
                                  v-model="searchForm.name"
                                  :color="$baseColor1"></v-text-field>

                    <v-btn :style="$baseColorStyle"
                           dark
                           depressed
                           @click="reload">検索</v-btn>
                    <v-btn :color="$baseColor1"
                           outlined
                           depressed
                           @click="clearSearchForm">クリア</v-btn>
                </div>
            </v-col>

            <!--リスト-->
            <v-col cols="8">
                <div class="list">
                    <h4 style="padding-left: 10px;">
                        商品一覧
                    </h4>
                    <v-btn depressed
                           outlined
                           :color="$baseColor1"
                           @click="$refs.addItemModal.open()">新規登録</v-btn>
                    <v-btn depressed
                           outlined
                           :color="$baseColor1"
                           @click="$refs.csvModal.open()">CSV</v-btn>
                    <v-btn depressed
                           outlined
                           :color="$baseColor1"
                           @click="$refs.makersModal.open()">メーカー管理</v-btn>
                    <v-btn depressed
                           outlined
                           :color="$baseColor1"
                           @click="$refs.itemAllocationRequestsModal.open()">在庫割り当てリクエスト</v-btn>

                    <!--テーブル-->
                    <v-simple-table>
                        <template v-slot:default>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>名前</th>
                                <th>メーカー</th>
                                <th>ディーラー在庫数</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(item, i) in items"
                                :key="i"
                                @click="$refs.itemModal.open(item.id)">
                                <td>{{item.id}}</td>
                                <td>{{item.name}}</td>
                                <td>{{item.maker == null ? null : item.maker.name}}</td>
                                <td>{{item.dealerStockCount}}</td>
                            </tr>
                            </tbody>
                        </template>
                    </v-simple-table>

                    <!--ページャ-->
                    <v-pagination v-model="currentPage"
                                  :length="pageLength"
                                  :color="$baseColor1"
                                  circle
                                  @input="reload"></v-pagination>
                </div>
            </v-col>
        </v-row>
        <AddItemModal ref="addItemModal"
                      @reload="reload"></AddItemModal>
        <ItemModal ref="itemModal"
                   @reload="reload"></ItemModal>
        <CsvModal ref="csvModal"
                  @reload="reload"></CsvModal>
        <MakersModal ref="makersModal"></MakersModal>
        <ItemAllocationRequestsModal ref="itemAllocationRequestsModal"
                                     @reload="reload"></ItemAllocationRequestsModal>
    </div>
</template>

<script>
    import AddItemModal from "@/pages/mypage/items/components/addItemModal.vue";
    import MakersModal from "@/pages/mypage/items/components/makersModal.vue";
    import ItemModal from "@/components/item/itemModal.vue";
    import CsvModal from "@/pages/mypage/items/components/csvModal.vue";
    import ItemAllocationRequestsModal from "@/pages/mypage/items/components/itemAllocationRequestsModal.vue";
    const LIMIT = 10;
    export default {
        name: "items",
        components: {ItemAllocationRequestsModal, CsvModal, ItemModal, MakersModal, AddItemModal},
        data () {
            return {
                currentPage: 1,
                pageLength: 0,

                items: [ ],
                searchForm: {
                    name: null
                }
            }
        },
        created() {
            this.reload();
        },
        methods: {
            /**
             * リストデータを取得する
             * @param page
             */
            reload(page)
            {
                if (page instanceof Number) {
                    this.currentPage = page;
                }
                this.items = [];
                var url = "items?limit=" + LIMIT + "&offset=" + (LIMIT * (this.currentPage - 1));
                if (this.searchForm.name != null) {
                    url += "&search_name=" + this.searchForm.name;
                }

                this.$axios.get(url)
                    .then(response => {
                        // ページャをセット
                        this.pageLength = Math.ceil(response.data.total_count / LIMIT);

                        // データをセット
                        for (var i in response.data.items) {
                            var item = response.data.items[i];
                            this.items.push({
                                id: item.id,
                                name: item.name,
                                maker: item.maker,
                                dealerStockCount: item.dealer_stock_count
                            });
                        }
                    });

                this.$emit("reload");
            },

            /**
             * 検索フォームをクリアする
             */
            clearSearchForm()
            {
                this.searchForm = {
                    name: null
                };
                this.reload();
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
    .list {
        border: 3px solid #E4E7ED;
        border-radius: 6px;
        padding: 5px;
    }
</style>
