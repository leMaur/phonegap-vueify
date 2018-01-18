import Vue from 'vue'
import Router from 'vue-router'
import home from '../components/home.vue'
import page from '../components/page.vue'

Vue.use(Router)

const router = new Router({
    routes:
    [
        {
            path: '/',
            name: 'home',
            component: home
        },
        {
            path: '/page',
            name: 'page',
            component: page
        }
    ]
})

export default router
