import Vue from "vue";
import App from "./views";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import "./assets/css/tailwind/index.css";
// import "./assets/css/iconfont.css";

//异步计算属性功能
// import AsyncComputed from "vue-async-computed";
// Vue.use(AsyncComputed);

//在js中使用tailwind的响应窗口大小和媒体查询状态
// import VueScreen from 'vue-screen';
// Vue.use(VueScreen, 'tailwind');

//剪切板
// import Clipboard from "v-clipboard";
// Vue.use(Clipboard);

//工具库
import { tempImage, vTruncate, isAPICloud } from "@/utils/index";
Vue.prototype.$tempImage = tempImage;
Vue.prototype.$isAPICloud = isAPICloud;
Vue.use(vTruncate);

//api请求
import req from "@/request";
Vue.use(req);

//路由跳转
import skip from "@/plugins/router";
Vue.use(skip);

//单页应用导航管理器
// import VueRouterCache from "vue-router-cache";
// Vue.use(VueRouterCache, {
//   router: router,
//   max: 10,
//   isSingleMode: true, // 是否单例模式
//   isDebugger: false,
//   directionKey: "direction",
//   getHistoryStack() {
//     const str = window.sessionStorage.getItem("historyStack");
//     return JSON.parse(str);
//   },
//   setHistoryStack(history) {
//     const str = JSON.stringify(history);
//     window.sessionStorage.setItem("historyStack", str);
//   },
// });

const isDevelopment = process.env.NODE_ENV === "development";
Vue.config.productionTip = isDevelopment;

console.log("window.navigator.userAgent:" + window.navigator.userAgent);
console.log("window.location.protocol:" + window.location.protocol);

const vm = () => {
  return new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
};

const isAPICloudExe = isAPICloud();
console.log("isAPICloud", isAPICloudExe);

if (isAPICloudExe) {
  window.apiready = function () {
    Vue.prototype.$ac = window.api;
    vm();
  };
} else {
  vm();
}
