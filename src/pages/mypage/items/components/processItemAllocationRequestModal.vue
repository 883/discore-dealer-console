<template>
    <v-dialog v-model="isView" width="900px">
        <v-card>
            <DialogHeader title="在庫割り当て依頼処理"
                          @close="isView = false"> </DialogHeader>
            <v-card-text>
                <v-textarea label="コメント"
                            v-model="form.comment"
                            :color="$baseColor1"></v-textarea>
                <v-btn depressed
                       :style="$baseColorStyle"
                       dark
                       @click="execute">処理中へ進む</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import DialogHeader from "@/components/dialogHeader";
    export default {
        name: "processItemAllocationRequestModal",
        components: {DialogHeader},
        data() {
            return {
                isView: false,

                id: null,
                form: {
                    comment: null
                }
            }
        },
        methods: {
            /**
             * 開く
             * @param itemAllocationId
             */
            open(itemAllocationId)
            {
                this.isView = true;
                this.id = itemAllocationId;
                this.form = {
                    comment: null
                };
            },
            /**
             * 実行
             */
            execute()
            {
                this.$axios.post("item_allocation_requests/" + this.id + "/processing", {
                    comment: this.form.comment
                })
                    .then(res => {
                        alert("処理を開始しました。");
                        this.$emit("reload");
                        this.isView = false;
                    });
            },
        }
    }
</script>

<style scoped>

</style>
