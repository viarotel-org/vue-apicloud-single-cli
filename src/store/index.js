import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";

const getModules = (banObj) => {
  const files = require.context("./modules", true, /\.js$/);
  const rules = (path) => path.replace(/(.*\/)*([^.]+).*/gi, "$2");
  const isBan = (path) => {
    const tempBool = banObj[rules(path)];
    return typeof tempBool === "boolean" && !tempBool;
  };
  const filePathArr = files.keys().filter((path) => !isBan(path));
  return filePathArr.reduce((obj, path) => {
    let name = rules(path);
    obj[name] = {
      ...files(path).default,
      namespaced: true,
    };
    return obj;
  }, {});
};
const modules = getModules({
  // sms: false,
});
// console.log("modules", modules);

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  getters,
});
