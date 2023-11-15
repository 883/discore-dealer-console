<template>
    <v-dialog v-model="isView" width="900px">
        <v-card>
            <DialogHeader title="在庫割り当て依頼一覧"
                          @close="isView = false"> </DialogHeader>
            <v-card-text>
                <v-row>
                    <v-col cols="3">
                        <h4>検索フォーム</h4>
                        <v-select label="ステータス"
                                  v-model="searchForm.status"
                                  :items="statusList"
                                  item-text="name"
                                  item-value="key"
                                  :color="$baseColor1"></v-select>
                        <v-select label="支店"
                                  v-model="searchForm.branchId"
                                  :items="branches"
                                  item-text="name"
                                  item-value="id"
                                  :color="$baseColor1"></v-select>
                        <v-btn depressed
                               :style="$baseColorStyle"
                               dark
                               @click="reload">検索</v-btn>
                    </v-col>
                    <v-col cols="9">
                        <!--テーブル-->
                        <v-simple-table>
                            <template v-slot:default>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>最終更新日時</th>
                                    <th>ステータス</th>
                                    <th>商品</th>
                                    <th>個数</th>
                                    <th>支店</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(itemAllocationRequest, i) in itemAllocationRequests"
                                    :key="i"
                                    @click="$refs.itemAllocationRequestModal.open(itemAllocationRequest.id)">
                                    <td>{{itemAllocationRequest.id}}</td>
                                    <td>{{itemAllocationRequest.updatedAt}}</td>
                                    <td>{{itemAllocationRequest.status}}</td>
                                    <td>{{itemAllocationRequest.item == null ? "" : itemAllocationRequest.item.name}}</td>
                                    <td>{{itemAllocationRequest.count}}</td>
                                    <td>{{itemAllocationRequest.branch.id}}</td>
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
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <ItemAllocationRequestModal ref="itemAllocationRequestModal"
                                    @reload="reload"></ItemAllocationRequestModal>
    </v-dialog>
</template>

<script>
    import DialogHeader from "@/components/dialogHeader";
    import ItemAllocationRequestModal from "@/pages/mypage/items/components/itemAllocationRequestModal.vue";
    const LIMIT = 10;
    export default {
        name: "itemAllocationRequestsModal",
        components: {ItemAllocationRequestModal, DialogHeader},
        data() {
            return {
                isView: false,

                statusList: [
                    {
                        name: "-",
                        key: null
                    },
                    {
                        name: "処理待ち",
                        key: "waiting"
                    },
                    {
                        name: "処理中",
                        key: "processing"
                    },
                    {
                        name: "発送済み",
                        key: "delivered"
                    },
                    {
                        name: "検収済み",
                        key: "done"
                    },
                    {
                        name: "キャンセル済み",
                        key: "canceled"
                    },
                    {
                        name: "却下",
                        key: "rejected"
                    },
                ],
                branches: [],
                searchForm: {
                    status: null,
                    branchId: null
                },

                currentPage: 1,
                pageLength: 0,
                itemAllocationRequests: []
            }
        },
        methods: {
            /**
             * 開く
             */
            open()
            {
                this.isView = true;
                this.branches = [
                    {
                        name: "-",
                        id: null
                    },
                ];
                this.searchForm = {
                    status: null,
                    branchId: null
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
                    });
                this.currentPage = 1;
                this.pageLength = 0;
                this.reload();
            },
            /**
             * 表示をリロード
             */
            reload(page)
            {

                if (page instanceof Number) {
                    this.currentPage = page;
                }
                this.items = [];
                var url = "item_allocation_requests?limit=" + LIMIT + "&offset=" + (LIMIT * (this.currentPage - 1));
                if (this.searchForm.status != null) {
                    url += "&search_status=" + this.searchForm.status;
                }
                if (this.searchForm.branchId != null) {
                    url += "&search_branch_id=" + this.searchForm.branchId;
                }

                this.itemAllocationRequests = [];
                this.$axios.get(url)
                    .then(response => {
                        // ページャをセット
                        this.pageLength = Math.ceil(response.data.total_count / LIMIT);

                        // データをセット
                        for (var i in response.data.item_allocation_requests) {
                            var itemAllocationRequest = response.data.item_allocation_requests[i];
                            this.itemAllocationRequests.push({
                                id: itemAllocationRequest.id,
                                status: itemAllocationRequest.status === "waiting" ? "処理待ち"
                                    : itemAllocationRequest.status === "processing" ? "処理中"
                                        : itemAllocationRequest.status === "delivered" ? "発送済み"
                                            : itemAllocationRequest.status === "done" ? "検収済み"
                                                : itemAllocationRequest.status === "canceled" ? "キャンセル済み"
                                                    : itemAllocationRequest.status === "rejected" ? "却下"
                                                        : "",
                                item: itemAllocationRequest.item,
                                count: itemAllocationRequest.count,
                                branch: itemAllocationRequest.branch,
                                createdAt: this.$moment(itemAllocationRequest.created_at).format("YYYY-MM-DD HH:mm"),
                                updatedAt: this.$moment(itemAllocationRequest.updated_at).format("YYYY-MM-DD HH:mm")
                            });
                        }
                    });
                this.$emit("reload");
            }
        }
    }
</script>

<style scoped>

</style>
