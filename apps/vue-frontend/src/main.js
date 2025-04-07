import Vue from 'vue'
import App from './App.vue'
import router from '@/routes/routes';
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { store } from "./store";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import './assets/css/global.css';
import { BootstrapVue, ToastPlugin } from 'bootstrap-vue';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.use(ToastPlugin);

Vue.use(ElementUI);

Vue.config.productionTip = false


new Vue({
  store,
  router, // Register the routes
  render: h => h(App),
}).$mount('#app');
