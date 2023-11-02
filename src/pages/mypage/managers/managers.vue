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
                    <h4 style="padding-left: 10px;">
                        マネージャー一覧 ({{currentMemberCount}}/{{maxMemberCount}}
                        <v-tooltip bottom>
                            <template v-slot:activator="{on, attrs}">
                                <v-icon v-bind="attrs"
                                        v-on="on">mdi-help-circle</v-icon>
                            </template>
                            <span>マネージャー数とスタッフ数の合計 / 上限</span>
                        </v-tooltip>
                        )
                    </h4>
                    <v-btn depressed
                           outlined
                           :color="$baseColor1"
                           @click="$refs.addManagerModal.open()">新規登録</v-btn>

                    <!--テーブル-->
                    <v-simple-table>
                        <template v-slot:default>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>名前</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(manager, i) in managers"
                                :key="i"
                                @click="$refs.managerModal.open(manager.id)">
                                <td>{{manager.id}}</td>
                                <td>{{manager.name}}</td>
                            </tr>
                            </tbody>
                        </template>
                    </v-simple-table>

                    <!--ページャ-->
                    <v-pagination v-model="currentPage"
                                  :length="pageLength"
                                  color="indigo"
                                  circle
                                  @input="reload"></v-pagination>
                </div>
            </v-col>
        </v-row>
        <AddManagerModal ref="addManagerModal"
                         @reload="reload"></AddManagerModal>
        <ManagerModal ref="managerModal"
                      @reload="reload"></ManagerModal>
    </div>
</template>

<script>
    import AddManagerModal from "@/pages/mypage/managers/components/addManagerModal.vue";
    import ManagerModal from "@/components/manager/managerModal.vue";

    const LIMIT = 10;

    export default {
        name: "managers",
        components: {ManagerModal, AddManagerModal},
        data () {
            return {
                currentPage: 1,
                pageLength: 0,

                maxMemberCount: 0,
                currentMemberCount: 0,
                managers: [ ],
                searchForm: {
                    name: null
                }
            }
        },
        created() {
            this.$axios.get("/dealer")
                .then(res => {
                    this.maxMemberCount = res.data.max_member_count;
                    this.currentMemberCount = res.data.current_member_count;
                });
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
                this.managers = [];
                var url = "managers?limit=" + LIMIT + "&offset=" + (LIMIT * (this.currentPage - 1));
                if (this.searchForm.name != null) {
                    url += "&search_name=" + this.searchForm.name;
                }

                this.$axios.get(url)
                    .then(response => {
                        // ページャをセット
                        this.pageLength = Math.ceil(response.data.total_count / LIMIT);

                        // データをセット
                        for (var i in response.data.managers) {
                            var manager = response.data.managers[i];
                            this.managers.push({
                                id: manager.id,
                                name: manager.name,
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
