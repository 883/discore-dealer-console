<template>
    <v-dialog v-model="isView" width="600px">
        <v-card>
            <DialogHeader title="メーカー詳細"
                          @close="isView = false"> </DialogHeader>
            <v-card-text>
                <v-text-field label="名前"
                              v-model="form.name.value"
                              :error-messages="form.name.errorMessage"
                              :color="$baseColor1"></v-text-field>
                <v-btn depressed
                       :style="'background-color: '+$baseColor1+'; background-image: linear-gradient(135deg, '+$baseColor1+' 0%, '+$baseColor2+' 100%);'"
                       dark
                       @click="save">保存</v-btn>
                <v-btn depressed
                       color="red"
                       dark
                       @click="deleteMaker">削除</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import DialogHeader from "@/components/dialogHeader";
    export default {
        name: "makerModal",
        components: {DialogHeader},
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
                }
            }
        },
        methods: {
            /**
             * 開く
             * @param makerId
             */
            open(makerId)
            {
                this.form = {
                    id: {
                        value: makerId
                    },
                    name: {
                        value: null,
                        errorMessage: null
                    },
                };
                this.$axios.get("makers/" + makerId)
                    .then(res => {
                        this.form.name.value = res.data.name;
                        this.isView = true;
                    });
            },
            /**
             * 保存
             */
            save()
            {
                this.form.name.errorMessage = null;
                this.$axios.patch("/makers/" + this.form.id.value, {
                    name: this.form.name.value
                }).then(res => {
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
                                }
                            }
                        }
                    }
                });
            },
            /**
             * 削除
             */
            deleteMaker()
            {
                if (confirm("本当に削除してもよろしいですか？\n※このメーカーが設定された商品はメーカー未設定となります。")) {
                    this.$axios.delete("makers/" + this.form.id.value)
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
