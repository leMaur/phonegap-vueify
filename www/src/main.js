// The following line loads the standalone build of Vue instead of the runtime-only build,
// so you don't have to do: import Vue from 'vue/dist/vue'
// This is done with the browser options. For the config, see package.json
import Vue from 'vue'
import App from './App.vue'
import Router from './router'
import Store from './store'

new Vue({ // eslint-disable-line no-new
    el: '#app',
    store: Store,
    router: Router,
    render: (h) => h(App)
})
