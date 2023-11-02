<template>
    <v-dialog v-model="isView" width="600px">
        <v-card>
            <DialogHeader title="マネージャー詳細"
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
                <v-btn v-if="isRoot"
                       depressed
                       color="red"
                       dark
                       @click="deleteManager">削除</v-btn>
                <template v-else>権限がありません。</template>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import DialogHeader from "@/components/dialogHeader";
    export default {
        name: "managerModal",
        components: {DialogHeader},
        data() {
            return {
                isView: false,
                isRoot: false,
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
                }
            }
        },
        methods: {
            /**
             * 開く
             */
            open(managerId)
            {
                this.isRoot = false;
                this.form = {
                    id: {
                        value: managerId
                    },
                    name: {
                        value: null,
                        errorMessage: null
                    },
                    email: {
                        value: null,
                        errorMessage: null
                    },
                };
                this.$axios.get("managers/" + managerId)
                    .then(res => {
                        this.form.name.value = res.data.name;
                        this.form.email.value = res.data.email;
                        this.isView = true;
                    });
                this.$axios.get("")
                    .then(res => {
                        this.isRoot = res.data.is_root;
                    });
            },
            /**
             * 削除
             */
            deleteManager()
            {
                if (confirm("本当に削除してもよろしいですか？")) {
                    this.$axios.delete("managers/" + this.form.id.value)
                        .then(res => {
                            alert("削除しました。");
                            this.$emit("reload");
                            this.isView = false;
                        })
                        .catch(e => {
                            if (e.response.status === 400 &&
                                e.response.data.message === "cannot delete yourself") {
                                alert("あなた自身を削除することはできません。");
                            } else if (e.response.status === 403) {
                                alert("権限がありません。");
                            }
                        });
                }
            }
        }
    }
</script>

<style scoped>

</style>
