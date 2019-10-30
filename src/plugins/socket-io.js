import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
    connection: `${process.env.VUE_APP_SOCKET_URL}:3000`,
}));
