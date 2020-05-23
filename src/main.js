import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './routes';
import { BootstrapVue } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

const router = new VueRouter({mode: 'history', routes});
Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;


new Vue({
  render: h => h(App),
  router
}).$mount('#app');
