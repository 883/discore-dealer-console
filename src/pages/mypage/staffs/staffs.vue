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
                        スタッフ一覧 ({{currentMemberCount}}/{{maxMemberCount}}
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
                           @click="$refs.addStaffModal.open()">新規登録</v-btn>

                    <!--テーブル-->
                    <v-simple-table>
                        <template v-slot:default>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>名前</th>
                                <th>所属支店</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(staff, i) in staffs"
                                :key="i"
                                @click="$refs.staffModal.open(staff.id)">
                                <td>{{staff.id}}</td>
                                <td>{{staff.name}}</td>
                                <td>{{staff.branch.name}}</td>
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
        <AddStaffModal ref="addStaffModal"
                       @reload="reload"></AddStaffModal>
        <StaffModal ref="staffModal"
                    @reload="reload"></StaffModal>
    </div>
</template>

<script>

    import AddStaffModal from "@/pages/mypage/staffs/components/addStaffModal.vue";
    import StaffModal from "@/components/staff/staffModal.vue";

    const LIMIT = 10;

    export default {
        name: "staffs",
        components: {StaffModal, AddStaffModal},
        data () {
            return {
                currentPage: 1,
                pageLength: 0,

                maxMemberCount: 0,
                currentMemberCount: 0,
                staffs: [ ],
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
                this.staffs = [];
                var url = "staffs?limit=" + LIMIT + "&offset=" + (LIMIT * (this.currentPage - 1));
                if (this.searchForm.name != null) {
                    url += "&search_name=" + this.searchForm.name;
                }

                this.$axios.get(url)
                    .then(response => {
                        // ページャをセット
                        this.pageLength = Math.ceil(response.data.total_count / LIMIT);

                        // データをセット
                        for (var i in response.data.staffs) {
                            var staff = response.data.staffs[i];
                            this.staffs.push({
                                id: staff.id,
                                name: staff.name,
                                branch: staff.branch
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
