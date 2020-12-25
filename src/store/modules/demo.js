import req from "@/request";
export default {
  namespaced: true,
  state: () => ({
    demoData: "hello word",
  }),
  getters: {},
  mutations: {
    setDemoData(state, data) {
      state.demoData = data;
    },
  },
  actions: {
    //获取演示数据
    getDemoData({ commit, rootGetters, rootState }, params = {}) {
      // console.log('rootState', rootState);
      // console.log('rootGetters', rootGetters);
      // console.log('this', this);
      return new Promise(async (resolve) => {
        const data = await req.getDemoData(params);
        commit("setDemoData", data.data);
        resolve(data);
      });
    },
  },
};
