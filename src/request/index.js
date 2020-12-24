import { mapRequest } from "@/plugins/request";
import { requestConfig } from "@/config/index.js";

const mapRequestExe = mapRequest([
  //获取模拟数据
  {
    key: "getDemoData",
    value: "Member/index",
  },
  // //获取验证码
  // {
  //   key: 'getSmsCode',
  //   value: 'Member/edit_memberavatar'
  // },
  // //获取用户信息
  // {
  //   key: "getUserInfo",
  //   value: "Member/index",
  // },
  // //获取站点信息
  // {
  //   key: "getSiteInfo",
  //   value: "Index/getEditablePageConfigList",
  // },
]);

export default {
  install(Vue) {
    Vue.prototype.$req = mapRequestExe;
  },
  ...mapRequestExe,
};