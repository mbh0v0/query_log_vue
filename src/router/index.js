import { createRouter, createWebHistory } from "vue-router";

import db_conn from "../pages/db_conn.vue"
import home from "../pages/home.vue"
import query_info from "../pages/query_info.vue"
import query_log from "../pages/query_log.vue"

const routes = [
    {
        path: "/",
        component: home
    },
    {
        path: "/home",
        component: home
    },
    {
        path: "/query_info",
        component: query_info
    },
    {
        path: '/query_log',
        component: query_log
    },
    {
        path: "/db_conn",
        component: db_conn
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router