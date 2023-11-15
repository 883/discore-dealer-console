<template>
    <v-dialog v-model="isView" width="600px">
        <v-card>
            <DialogHeader title="スタッフ詳細"
                          @close="isView = false"> </DialogHeader>
            <v-card-text>
                <v-text-field label="名前"
                              v-model="form.name.value"
                              :error-messages="form.name.errorMessage"
                              :color="$baseColor1"
                              readonly></v-text-field>
                <v-text-field label="メールアドレス"
                              v-model="form.email.value"
                              :error-messages="form.email.errorMessage"
                              :color="$baseColor1"
                              readonly></v-text-field>
                <v-select label="所属店舗"
                          v-model="form.branchId.value"
                          :items="branches"
                          item-text="name"
                          item-value="id"
                          :error-messages="form.email.errorMessage"
                          :color="$baseColor1"></v-select>
                <v-btn depressed
                       :style="$baseColorStyle"
                       dark
                       @click="save">保存</v-btn>
                <v-btn depressed
                       color="red"
                       dark
                       @click="deleteManager">削除</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import DialogHeader from "@/components/dialogHeader";
    export default {
        name: "staffModal",
        components: {DialogHeader},
        data() {
            return {
                isView: false,
                branches: [],
                form: {
                    id: {
                        value: null
                    },
                    name: {
                        value: null,
                        errorMessage: null
                    },
                    email: {
                        value: null,
                        errorMessage: null
                    },
                    branchId: {
                        value: null,
                        errorMessage: null
                    },
                }
            }
        },
        methods: {
            /**
             * 開く
             * @param staffId
             */
            open(staffId)
            {
                this.form = {
                    id: {
                        value: staffId
                    },
                    name: {
                        value: null,
                        errorMessage: null
                    },
                    email: {
                        value: null,
                        errorMessage: null
                    },
                    branchId: {
                        value: null,
                        errorMessage: null
                    },
                };
                this.branches = [];
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
                this.$axios.get("staffs/" + staffId)
                    .then(res => {
                        this.form.name.value = res.data.name;
                        this.form.email.value = res.data.email;
                        this.form.branchId.value = res.data.branch.id;
                        this.isView = true;
                    });
            },
            /**
             * 保存
             */
            save()
            {
                this.$axios.patch("staffs/" + this.form.id.value, {
                    branchId: this.form.branchId.value
                }).then(res => {
                    alert("保存しました。");
                })
            },
            /**
             * 削除
             */
            deleteManager()
            {
                if (confirm("本当に削除してもよろしいですか？")) {
                    this.$axios.delete("staffs/" + this.form.id.value)
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
