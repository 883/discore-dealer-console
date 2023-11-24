<template>
    <v-dialog v-model="isView" width="600px">
        <v-card>
            <DialogHeader title="支店詳細"
                          @close="isView = false"> </DialogHeader>
            <v-tabs :color="$baseColor1">
                <v-tab>情報</v-tab>
                <v-tab>所属スタッフ</v-tab>

                <v-tab-item>
                    <v-card-text>
                        <v-text-field label="名前"
                                      v-model="form.name.value"
                                      :error-messages="form.name.errorMessage"
                                      :color="$baseColor1"></v-text-field>
                        <v-text-field label="住所"
                                      v-model="form.address.value"
                                      :error-messages="form.address.errorMessage"
                                      :color="$baseColor1"></v-text-field>
                        <v-text-field label="電話番号"
                                      v-model="form.tel.value"
                                      :error-messages="form.tel.errorMessage"
                                      :color="$baseColor1"></v-text-field>
                        <v-text-field label="FAX番号"
                                      v-model="form.fax.value"
                                      :error-messages="form.fax.errorMessage"
                                      :color="$baseColor1"></v-text-field>
                        <v-btn depressed
                               :style="$baseColorStyle"
                               dark
                               @click="save">保存</v-btn>
                        <v-btn depressed
                               color="red"
                               dark
                               @click="deleteBranch">削除</v-btn>
                    </v-card-text>
                </v-tab-item>
                <v-tab-item>
                    <v-card-text>
                        <v-simple-table>
                            <template v-slot:default>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>名前</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(staff, i) in staffs"
                                    :key="i"
                                    @click="$refs.staffModal.open(staff.id)">
                                    <td>{{staff.id}}</td>
                                    <td>{{staff.name}}</td>
                                </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card-text>
                </v-tab-item>
            </v-tabs>
        </v-card>
        <StaffModal ref="staffModal"
                    @reload="reload"></StaffModal>
    </v-dialog>
</template>

<script>
    import DialogHeader from "@/components/dialogHeader";
    import StaffModal from "@/components/staff/staffModal.vue";
    export default {
        name: "branchModal",
        components: {StaffModal, DialogHeader},
        data() {
            return {
                isView: false,
                form: {
                    id: {
                        value: null
                    },
                    name: {
                        value: null,
                        errorMessage: null
                    },
                    address: {
                        value: null,
                        errorMessage: null
                    },
                    tel: {
                        value: null,
                        errorMessage: null
                    },
                    fax: {
                        value: null,
                        errorMessage: null
                    },
                },
                staffs: []
            }
        },
        methods: {
            /**
             * 開く
             */
            open(branchId)
            {
                this.form = {
                    id: {
                        value: branchId
                    },
                    name: {
                        value: null,
                        errorMessage: null
                    },
                    address: {
                        value: null,
                        errorMessage: null
                    },
                    tel: {
                        value: null,
                        errorMessage: null
                    },
                    fax: {
                        value: null,
                        errorMessage: null
                    },
                };
                this.isView = true;
                this.reload();
            },
            /**
             * 表示更新
             */
            reload()
            {
                this.staffs = [];
                this.$axios.get("branches/" + this.form.id.value)
                    .then(res => {
                        this.form.name.value = res.data.name;
                        this.form.address.value = res.data.address;
                        this.form.tel.value = res.data.tel;
                        this.form.fax.value = res.data.fax;
                        this.old = JSON.parse(JSON.stringify(this.form));

                        for (var i in res.data.staffs) {
                            var staff = res.data.staffs[i];
                            this.staffs.push({
                                id: staff.id,
                                name: staff.name,
                            });
                        }
                        this.$emit("reload");
                    });
            },
            /**
             * 保存
             */
            save()
            {
                this.form.name.errorMessage = null;
                this.form.address.errorMessage = null;
                this.form.tel.errorMessage = null;
                this.form.fax.errorMessage = null;
                var params = {};
                if (this.form.name.value !== this.old.name.value) {
                    params.name = this.form.name.value;
                }
                if (this.form.address.value !== this.old.address.value) {
                    params.address = this.form.address.value;
                }
                if (this.form.tel.value !== this.old.tel.value) {
                    params.tel = this.form.tel.value;
                }
                if (this.form.fax.value !== this.old.fax.value) {
                    params.fax = this.form.fax.value;
                }
                console.log(params);

                this.$axios.patch("/branches/" + this.form.id.value, params).then(res => {
                    alert("更新しました。");
                    this.$emit("reload");
                }).catch(e => {
                    if (e.response.status === 400) {
                        if (e.response.data.message === "invalid request parameter") {
                            alert("入力された値に異常があります。");
                            for (var i in e.response.data.errors) {
                                var error = e.response.data.errors[i];
                                if (error.parameter === "name") {
                                    if (error.message === "not null") {
                                        this.form.name.errorMessage = "入力必須";
                                    } else if (error.message === "already exists") {
                                        this.form.name.errorMessage = "すでに存在しています";
                                    }
                                } else if (error.parameter === "address") {
                                    if (error.message === "not null") {
                                        this.form.address.errorMessage = "入力必須";
                                    }
                                } else if (error.parameter === "tel") {
                                    if (error.message === "not null") {
                                        this.form.tel.errorMessage = "入力必須";
                                    } else if (error.message === "invalid value") {
                                        this.form.tel.errorMessage = "入力値が異常です";
                                    }
                                } else if (error.parameter === "fax") {
                                    if (error.message === "invalid value") {
                                        this.form.fax.errorMessage = "入力値が異常です";
                                    }
                                }
                            }
                        }
                    }
                });
            },
            /**
             * 削除
             */
            deleteBranch()
            {
                if (confirm("本当に削除してもよろしいですか？\n※この支店に関わる全ての情報が削除されます。")) {
                    this.$axios.delete("branches/" + this.form.id.value)
                        .then(res => {
                            alert("削除しました。");
                            this.$emit("reload");
                            this.isView = false;
                        });
                }
            }
        }
    }
</script>

<style scoped>

</style>
