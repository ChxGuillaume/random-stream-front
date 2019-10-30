import Vue from 'vue'
import Router from 'vue-router'
import TwitchStreams from "./views/TwitchStreams";
import WeeklyStats from "./views/WeeklyStats";

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'TwitchStreams',
            component: TwitchStreams,
        },
        {
            path: '/weekly-stats',
            name: 'WeeklyStats',
            component: WeeklyStats,
        },
        {path: '*', redirect: '/'},
    ],
})
