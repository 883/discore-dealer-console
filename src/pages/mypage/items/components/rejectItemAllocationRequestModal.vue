<template>
    <v-dialog v-model="isView" width="900px">
        <v-card>
            <DialogHeader title="在庫割り当て依頼却下"
                          @close="isView = false"> </DialogHeader>
            <v-card-text>
                <v-textarea label="コメント"
                            v-model="form.comment"
                            :color="$baseColor1"></v-textarea>
                <v-btn depressed
                       color="red"
                       dark
                       @click="execute">却下する</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import DialogHeader from "@/components/dialogHeader";
    export default {
        name: "rejectItemAllocationRequestModal",
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
                this.$axios.get("item_allocation_requests/" + this.id)
                    .then(res => {
                        this.form.comment = res.data.comment_by_manager;
                    });
            },
            /**
             * 実行
             */
            execute()
            {
                this.$axios.post("item_allocation_requests/" + this.id + "/rejected", {
                    comment: this.form.comment
                })
                    .then(res => {
                        alert("却下しました。");
                        this.$emit("reload");
                        this.isView = false;
                    });
            },
        }
    }
</script>

<style scoped>

</style>
