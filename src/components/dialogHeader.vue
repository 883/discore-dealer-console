<template>
    <v-toolbar fixed
               dense
               max-height="43px"
               style="margin-bottom: 10px">
        <div style="width: 10%">
        </div>
        <div style="width: 80%; text-align: center">
            <span class="headerTitle">{{title}}</span>
        </div>
        <div style="width: 10%; text-align: right;">
            <v-btn icon
                   @click="close">
                <v-icon>mdi-window-close</v-icon>
            </v-btn>
        </div>
    </v-toolbar>
</template>

<script>
    export default {
        name: "dialogHeader",
        props: [
            "title"
        ],
        methods: {
            /**
             * とじるボタン
             */
            close()
            {
                this.$emit("close")
            }
        }
    }
</script>

<style scoped>

</style>
