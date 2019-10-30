import Vue from 'vue'
import './plugins/fontawesome'
import './plugins/axios'
import './plugins/socket-io'
import './plugins/multiselect'
import './plugins/animejs'
import './plugins/vuecookies'
import './plugins/vuemoment'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
