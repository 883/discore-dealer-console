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

                    <v-btn :style="'background-color: '+$baseColor1+'; background-image: linear-gradient(135deg, '+$baseColor1+' 0%, '+$baseColor2+' 100%);'"
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
                    <h4 style="padding-left: 10px;">支店一覧</h4>
                    <v-btn depressed
                           outlined
                           :color="$baseColor1"
                           @click="$refs.addBranchModal.open()">新規登録</v-btn>

                    <!--テーブル-->
                    <v-simple-table>
                        <template v-slot:default>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>名前</th>
                                <th>所属スタッフ数</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(branch, i) in branches"
                                :key="i"
                                @click="$refs.branchModal.open(branch.id)">
                                <td>{{branch.id}}</td>
                                <td>{{branch.name}}</td>
                                <td>{{branch.staffCount}}</td>
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
        <AddBranchModal ref="addBranchModal"
                        @reload="reload"></AddBranchModal>
        <BranchModal ref="branchModal"
                     @reload="reload"></BranchModal>
    </div>
</template>

<script>
    import AddBranchModal from "@/pages/mypage/branches/components/addBranchModal.vue";
    import BranchModal from "@/components/branch/branchModal.vue";

    const LIMIT = 10;

    export default {
        name: "branches",
        components: {BranchModal, AddBranchModal},
        data () {
            return {
                currentPage: 1,
                pageLength: 0,

                branches: [ ],
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
                this.branches = [];
                var url = "branches?limit=" + LIMIT + "&offset=" + (LIMIT * (this.currentPage - 1));
                if (this.searchForm.name != null) {
                    url += "&search_name=" + this.searchForm.name;
                }

                this.$axios.get(url)
                    .then(response => {
                        // ページャをセット
                        this.pageLength = Math.ceil(response.data.total_count / LIMIT);

                        // データをセット
                        for (var i in response.data.branches) {
                            var branch = response.data.branches[i];
                            this.branches.push({
                                id: branch.id,
                                name: branch.name,
                                staffCount: branch.staff_count
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
