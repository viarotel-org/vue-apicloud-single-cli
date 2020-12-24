import Vue from "vue";
import VueRouter from "vue-router";
import { isNoAttrs } from "@/utils/index.js";
import { getStorages, setStorages } from "@/plugins/storages";
import { merge } from "lodash-es";

/**
 * @param {array} routes 路由表数组
 * @param {object} 路由配置
 * @returns {object} 路由实例
 */
export function createRouter(
  routes = [],
  { base = process.env.BASE_URL, mode = "hash", ...moreOptions } = {}
) {
  //路由防抖
  const originalPush = VueRouter.prototype.push;
  VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
  };

  Vue.use(VueRouter);

  return new VueRouter({
    mode,
    base,
    routes,
    ...moreOptions,
  });
}

/**
 * @desc 动态获取路由配置表
 * @param {object}  blacklist 黑名单雷暴
 * @param {object}  mixin 路由混入列表
 */
export function dynamicRouter({ blacklist, mixin }) {
  const getFileName = (path) => path.replace(/(.*\/)*([^\/]+).*/gi, "$2");
  const arrayToTreeObject = (arr) =>
    arr.reduceRight((result, key) => ({ [key]: result }), {});
  const treeObjFormat = (obj, callBack) =>
    Object.keys(obj).map((key) => ({
      ...(Object.keys(obj[key] || []).length
        ? { children: treeObjFormat(obj[key], callBack) }
        : {}),
      ...callBack(key),
    }));
  const getFilePathList = (blacklist) => {
    let files = require.context("@/views", true, /\/$/);
    return files
      .keys()
      .filter(
        (path) =>
          !/components/i.test(path) &&
          !blacklist[getFileName(path)] &&
          path !== "./"
      );
  };

  const filePathArr = getFilePathList(blacklist);

  const routerIndexObj = filePathArr.reduce((obj, i) => {
    let name = getFileName(i);
    let path = i.slice(1, -1);
    obj[name] = {
      name,
      path,
      component: () => import(`@/views${path}`),
      ...(mixin[name] || {}),
    };
    return obj;
  }, {});

  const treeObj = filePathArr.reduce((obj, i) => {
    let pathArr = i.split("/").slice(1, -1);
    obj = merge(obj, arrayToTreeObject(pathArr));
    return obj;
  }, {});
  return treeObjFormat(treeObj, (key) => routerIndexObj[key]);
  // console.log(filePathArr);
  // console.log(treeObj);
}

/**
 * @param {string} name 要打开的路由名称
 * @param {object}  params 路由传参 默认为params传参
 * @param {object} 其他配置 isReplace是否替换当前路由 isQuery是否地址栏传参 ctx 上下文
 */
export function openView(
  name,
  params,
  { isReplace = false, isBody = false, ctx = this } = {}
) {
  const way = isReplace ? "replace" : "push";

  params = isBody ? { params } : { query: params };

  return ctx.$router[way]({ name, ...params });
}

/**
 * @param {object} ctx 要打开的路由名称
 * @returns {object} 页面所接受的参数
 */
export function getViewParams(ctx = this) {
  const whitelist = ["via", "direction"]; //忽略路由管理器所用到的参数

  let tempObj = {};
  let isQuery = isNoAttrs(ctx.$route.query, ...whitelist);
  let isBody = isNoAttrs(ctx.$route.params, ...whitelist);

  if (isQuery) {
    tempObj = ctx.$route.query;
  } else if (isBody) {
    tempObj = ctx.$route.params;
    setStorages(ctx.$route.name, ctx.$route.params);
    // console.log('isBody', getStorages(ctx.$route.name));
  } else {
    tempObj = getStorages(ctx.$route.name) || {};
  }
  return tempObj;
}

export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, "$openView", {
      get() {
        return openView.bind(this);
      },
    });

    Object.defineProperty(Vue.prototype, "$viewParams", {
      get() {
        return getViewParams(this);
      },
    });
  },
};
