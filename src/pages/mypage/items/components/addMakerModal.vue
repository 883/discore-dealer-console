<template>
    <v-dialog v-model="isView" width="600px">
        <v-card>
            <DialogHeader title="メーカー登録"
                          @close="isView = false"> </DialogHeader>
            <v-card-text>
                <v-text-field label="名前"
                              v-model="form.name.value"
                              :error-messages="form.name.errorMessage"
                              :color="$baseColor1"></v-text-field>
                <v-btn depressed
                       :style="$baseColorStyle"
                       dark
                       @click="save">保存</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import DialogHeader from "@/components/dialogHeader";
    export default {
        name: "addMakerModal",
        components: {DialogHeader},
        data() {
            return {
                isView: false,
                form: {
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
             */
            open()
            {
                this.form = {
                    name: {
                        value: null,
                        errorMessage: null
                    },
                };
                this.isView = true;
            },
            /**
             * 保存
             */
            save()
            {
                this.form.name.errorMessage = null;
                this.$axios.post("makers", {
                    name: this.form.name.value,
                }).then(res => {
                    alert("登録しました。");
                    this.$emit("reload");
                    this.isView = false;
                }).catch(e => {
                    if (e.response.status === 400) {
                        if (e.response.data.message === "invalid request parameter") {
                            alert("入力された値に異常があります。");
                            for (var i in e.response.data.errors) {
                                var error = e.response.data.errors[i];
                                if (error.parameter === "name") {
                                    if (error.message === "required") {
                                        this.form.name.errorMessage = "入力必須";
                                    } else if (error.message === "already exists") {
                                        this.form.name.errorMessage = "すでに存在します";
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
