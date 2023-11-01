<template>
    <div>
    </div>
</template>

<script>
    export default {
        name: "index",
        created()
        {
            if (this.$cookies.isKey("access_token")) {
                this.$router.push({
                    path: '/myPage',
                    query: {
                        page: "calendar"
                    }
                });
            } else {
                this.$router.push("/login");
            }
        }
    }
</script>

<style scoped>

</style>
