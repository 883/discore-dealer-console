<template>
    <v-dialog v-model="isView" width="600px">
        <v-card>
            <DialogHeader title="メーカー一覧"
                          @close="isView = false"> </DialogHeader>
            <v-card-text>
                <v-btn depressed
                       outlined
                       :color="$baseColor1"
                       @click="$refs.addMakerModal.open()">新規登録</v-btn>
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>名前</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(maker, i) in makers"
                            :key="i"
                            @click="$refs.makerModal.open(maker.id)">
                            <td>{{maker.id}}</td>
                            <td>{{maker.name}}</td>
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
            </v-card-text>
        </v-card>
        <AddMakerModal ref="addMakerModal"
                       @reload="reload"></AddMakerModal>
        <MakerModal ref="makerModal"
                    @reload="reload"></MakerModal>
    </v-dialog>
</template>

<script>
    import DialogHeader from "@/components/dialogHeader";
    import AddMakerModal from "@/pages/mypage/items/components/addMakerModal.vue";
    import MakerModal from "@/components/makerModal.vue";
    const LIMIT = 10;
    export default {
        name: "makersModal",
        components: {MakerModal, AddMakerModal, DialogHeader},
        data() {
            return {
                isView: false,
                currentPage: 1,
                pageLength: 1,
                makers: [],
            }
        },
        methods: {
            /**
             * 開く
             */
            open()
            {
                this.makers = [];
                this.isView = true;
                this.currentPage = 1;
                this.pageLength = 1;
                this.reload();
            },
            /**
             * 一覧を更新
             * @param page
             */
            reload(page)
            {
                if (page instanceof Number) {
                    this.currentPage = page;
                }
                this.makers = [];
                this.$axios.get("makers?limit=" + LIMIT + "&offset=" + (LIMIT * (this.currentPage - 1)))
                    .then(response => {
                        // ページャをセット
                        this.pageLength = Math.ceil(response.data.total_count / LIMIT);

                        // データをセット
                        for (var i in response.data.makers) {
                            var maker = response.data.makers[i];
                            this.makers.push({
                                id: maker.id,
                                name: maker.name,
                            });
                        }
                    });
            },
        }
    }
</script>

<style scoped>

</style>
