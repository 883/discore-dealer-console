import Vue from 'vue';

import App from './App.vue';

import router from "./router";
import axios from '@/plugins/axios';
import vuetify from "@/plugins/vuetify";
import baseColor from "@/plugins/baseColor";
import cookie from "vue-cookies";
import "@/plugins/moment";

Vue.use(axios);
Vue.use(baseColor);
Vue.use(cookie);


new Vue({
    el: '#app',
    template:'<app></app>',
    router,
    vuetify: vuetify,

    components: { App }
});
