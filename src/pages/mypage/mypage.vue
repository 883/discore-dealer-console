<template>
    <v-app>
        <!--メインメニュー（左）-->
        <v-navigation-drawer v-model="drawer"
                             app>
            <v-list dense>
                <v-list-item-group v-model="pageNum"
                                   :color="$baseColor1">
                    <v-list-item @click="selectMainMenu(PAGE_BRANCHES)">
                        <v-list-item-content>
                            <v-badge v-if="alertCount.dealers > 0"
                                     :content="alertCount.dealers"
                                     inline
                                     :color="$baseColor1">
                                <v-list-item-title>
                                    支店
                                </v-list-item-title>
                            </v-badge>
                            <v-list-item-title v-else>
                                支店
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="selectMainMenu(PAGE_MANAGERS)">
                        <v-list-item-content>
                            <v-badge v-if="alertCount.managers > 0"
                                     :content="alertCount.managers"
                                     inline
                                     :color="$baseColor1">
                                <v-list-item-title>
                                    マネージャー
                                </v-list-item-title>
                            </v-badge>
                            <v-list-item-title v-else>
                                マネージャー
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>

        <!--アプリケーションヘッダ-->
        <v-app-bar app
                   :style="'background-color: '+$baseColor1+'; background-image: linear-gradient(135deg, '+$baseColor1+' 0%, '+$baseColor2+' 100%);'"
                   dark>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>{{pageName}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon
                           v-bind="attrs"
                           v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item @click="$refs.profileModal.open()">
                        <v-list-item-title>プロフィール</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="logout">
                        <v-list-item-title>ログアウト</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>

        <!--メインコンテンツ-->
        <v-main>
            <Branches v-if="page === PAGE_BRANCHES"
                      @reload="reload"></Branches>
            <Managers v-else-if="page === PAGE_MANAGERS"
                      @reload="reload"></Managers>
        </v-main>
        <ProfileModal ref="profileModal"></ProfileModal>
    </v-app>
</template>

<script>
    import LogoImg from "@/assets/images/logo.png";

    import ProfileModal from "@/pages/mypage/components/profileModal.vue";
    import Branches from "@/pages/mypage/branches/branches.vue";
    import Managers from "@/pages/mypage/managers/managers.vue";

    const PAGE_BRANCHES = "branches";
    const PAGE_MANAGERS = "managers";

    export default {
        name: "mypage",
        components: {
            Managers,
            Branches,
            ProfileModal,
        },
        data () {
            return {
                PAGE_BRANCHES: PAGE_BRANCHES,
                PAGE_MANAGERS: PAGE_MANAGERS,

                logoImg: LogoImg,

                drawer: null,
                page: null,
                pageNum: 0,
                pageName: null,
                alertCount: {
                    dealers: 0
                }
            }
        },
        created () {
            // 通知数を取得
            this.getBranchesAlertCount();

            this.selectMainMenu(this.PAGE_BRANCHES);
        },
        methods: {
            /**
             * メインメニュー選択時の処理
             * @param to
             */
            selectMainMenu(to)
            {
                this.page = to;
                // 現在のページを特定
                if (to === PAGE_BRANCHES) {
                    this.pageName = "支店";
                    this.pageNum = 0;
                } else if (to === PAGE_MANAGERS) {
                    this.pageName = "マネージャー";
                    this.pageNum = 1;
                }
            },

            /**
             *
             */
            getBranchesAlertCount()
            {
                //this.$axios.get("stylists?search_has_new_message=true")
                //    .then(response => {
                //        this.alertCount.stylist = response.data.total_count;
                //    });
            },

            /**
             * 各種通知情報をリロードする
             */
            reload()
            {
                this.getBranchesAlertCount();
            },
            /**
             * ログアウトする
             */
            logout()
            {
                this.$axios.post("/logout")
                    .then(res => {
                      this.$cookies.remove("access_token");
                      this.$cookies.remove("admin_id");
                      this.$router.push('/login');
                    })
                    .catch(e => {
                      this.$cookies.remove("access_token");
                      this.$cookies.remove("admin_id");
                      this.$router.push('/login');
                    });
            }
        }
    }
</script>

<style scoped>
    .header {
        box-shadow: 0px 0px 5px;
        background-color: #FFF;
    }
    .badge {
        background-color: red;
        color: #FFFFFF;
        line-height: normal;
        border-radius: 20px;

        padding: 5px 8px 5px 8px;
        height: 25px;
        position: absolute;
        top: 14px;
        right: 15px;
    }
</style>
