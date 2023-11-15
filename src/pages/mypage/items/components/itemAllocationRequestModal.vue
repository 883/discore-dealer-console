<template>
    <v-dialog v-model="isView" width="900px">
        <v-card>
            <DialogHeader title="在庫割り当て依頼詳細"
                          @close="isView = false"> </DialogHeader>
            <v-card-text>
                <v-text-field label="ステータス"
                              v-model="itemAllocationRequest.status"
                              :color="$baseColor1"
                              readonly></v-text-field>
                <v-row>
                    <v-col cols="9">
                        <v-text-field label="商品名"
                                      v-model="itemAllocationRequest.item == null ? '' : itemAllocationRequest.item.name"
                                      :color="$baseColor1"
                                      readonly
                                      @click="$refs.itemModal.open(itemAllocationRequest.item.id)"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field label="個数"
                                      v-model="itemAllocationRequest.count"
                                      suffix="個"
                                      :color="$baseColor1"
                                      readonly></v-text-field>
                    </v-col>
                </v-row>
                <v-text-field label="支店"
                              v-model="itemAllocationRequest.branch == null ? '' : itemAllocationRequest.branch.name"
                              :color="$baseColor1"
                              readonly
                              @click="$refs.branchModal.open(itemAllocationRequest.branch.id)"></v-text-field>
                <v-row>
                    <v-col cols="6">
                        <v-text-field label="依頼スタッフ"
                                      v-model="itemAllocationRequest.staff == null ? '' : itemAllocationRequest.staff.name"
                                      :color="$baseColor1"
                                      readonly
                                      @click="$refs.staffModal.open(itemAllocationRequest.staff.id)"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-textarea label="スタッフからのコメント"
                                      v-model="itemAllocationRequest.commentByStaff"
                                      :color="$baseColor1"
                                      readonly></v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <v-text-field label="対応マネージャー"
                                      v-model="itemAllocationRequest.manager == null ? '' : itemAllocationRequest.manager.name"
                                      :color="$baseColor1"
                                      readonly
                                      @click="$refs.managerModal.open(itemAllocationRequest.manager.id)"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-textarea label="マネージャーからのコメント"
                                      v-model="itemAllocationRequest.commentByManager"
                                      :color="$baseColor1"
                                      readonly></v-textarea>
                    </v-col>
                </v-row>
                <template v-if="itemAllocationRequest.status === '処理待ち'">
                    <v-btn depressed
                           :style="$baseColorStyle"
                           dark
                           @click="$refs.processModal.open(itemAllocationRequest.id)">処理中に進む</v-btn>
                    <v-btn depressed
                           color="red"
                           dark
                           @click="$refs.rejectModal.open(itemAllocationRequest.id)">却下する</v-btn>
                </template>
                <template v-else-if="itemAllocationRequest.status === '処理中'">
                    <v-btn depressed
                           :style="$baseColorStyle"
                           dark
                           @click="$refs.deliverModal.open(itemAllocationRequest.id)">発送済みにする</v-btn>
                    <v-btn depressed
                           color="red"
                           dark
                           @click="$refs.rejectModal.open(itemAllocationRequest.id)">却下する</v-btn>
                </template>
            </v-card-text>
        </v-card>
        <ItemModal ref="itemModal"
                   @reload="reload"></ItemModal>
        <BranchModal ref="branchModal"
                     @reload="reload"></BranchModal>
        <StaffModal ref="staffModal"
                    @reload="reload"></StaffModal>
        <ManagerModal ref="managerModal"
                      @reload="reload"></ManagerModal>
        <ProcessItemAllocationRequestModal ref="processModal"
                                           @reload="reload"></ProcessItemAllocationRequestModal>
        <DeliverItemAllocationRequestModal ref="deliverModal"
                                           @reload="reload"></DeliverItemAllocationRequestModal>
        <RejectItemAllocationRequestModal ref="rejectModal"
                                          @reload="reload"></RejectItemAllocationRequestModal>
    </v-dialog>
</template>

<script>
    import DialogHeader from "@/components/dialogHeader";
    import ItemModal from "@/components/item/itemModal.vue";
    import BranchModal from "@/components/branch/branchModal.vue";
    import StaffModal from "@/components/staff/staffModal.vue";
    import ManagerModal from "@/components/manager/managerModal.vue";
    import RejectItemAllocationRequestModal from "@/pages/mypage/items/components/rejectItemAllocationRequestModal.vue";
    import ProcessItemAllocationRequestModal
        from "@/pages/mypage/items/components/processItemAllocationRequestModal.vue";
    import DeliverItemAllocationRequestModal
        from "@/pages/mypage/items/components/deliverItemAllocationRequestModal.vue";
    const LIMIT = 10;
    export default {
        name: "itemAllocationRequestModal",
        components: {
            DeliverItemAllocationRequestModal,
            ProcessItemAllocationRequestModal,
            RejectItemAllocationRequestModal, ManagerModal, StaffModal, BranchModal, ItemModal, DialogHeader},
        data() {
            return {
                isView: false,

                itemAllocationRequest: {
                    id: null,
                    status: null,
                    item: null,
                    count: null,
                    createdAt: null,
                    updatedAt: null,
                    branch: null,
                    staff: null,
                    commentByStaff: null,
                    manager: null,
                    commentByManager: null
                }
            }
        },
        methods: {
            /**
             * 開く
             */
            open(itemAllocationId)
            {
                this.isView = true;
                this.itemAllocationRequest = {
                    id: itemAllocationId,
                    status: null,
                    item: null,
                    count: null,
                    createdAt: null,
                    updatedAt: null,
                    branch: null,
                    staff: null,
                    commentByStaff: null,
                    manager: null,
                    commentByManager: null
                };
                this.reload();
            },
            reload()
            {
                this.$axios.get("item_allocation_requests/" + this.itemAllocationRequest.id)
                    .then(res => {
                        this.itemAllocationRequest.status = res.data.status === "waiting" ? "処理待ち"
                                : res.data.status === "processing" ? "処理中"
                                    : res.data.status === "delivered" ? "発送済み"
                                        : res.data.status === "done" ? "検収済み"
                                            : res.data.status === "canceled" ? "キャンセル済み"
                                                : res.data.status === "rejected" ? "却下"
                                                    : "";
                        this.itemAllocationRequest.item = res.data.item;
                        this.itemAllocationRequest.count = res.data.count;
                        this.itemAllocationRequest.createdAt = this.$moment(res.data.created_at).format("YYYY-MM-DD HH =mm");
                        this.itemAllocationRequest.updatedAt = this.$moment(res.data.updated_at).format("YYYY-MM-DD HH =mm");
                        this.itemAllocationRequest.branch = res.data.branch;
                        this.itemAllocationRequest.staff = res.data.staff;
                        this.itemAllocationRequest.commentByStaff = res.data.comment_by_staff;
                        this.itemAllocationRequest.manager = res.data.manager;
                        this.itemAllocationRequest.commentByManager = res.data.comment_by_manager;
                    });
                this.$emit("reload");
            },
        }
    }
</script>

<style scoped>

</style>
