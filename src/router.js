import Vue from "vue";
import Router from "vue-router";

import Index from "./pages/index";
import Login from "./pages/login";
import PasswordReminder from "./pages/passwordReminder";
import MyPage from "./pages/mypage/mypage";

Vue.use(Router);

export default new Router({
    mode: "hash",
    routes: [
        {
            path: "/",
            name: "index",
            component: Index
        },
        {
            path: "/login",
            name: "login",
            component: Login
        },
        {
            path: "/passwordReminder",
            name: "passwordReminder",
            component: PasswordReminder
        },
        {
            path: "/myPage",
            name: "myPage",
            component: MyPage
        },
    ]
});
