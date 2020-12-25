import { createRouter, dynamicRouter } from "@/plugins/router.js";
import store from "@/store";

const dynamicRouterArr = dynamicRouter({
  blacklist: {
    // login: true,
  },
  mixin: {
    home: {
      redirect: { name: "tab-0" },
    },
    account: {
      redirect: { name: "login" },
    },
  },
});
console.log(dynamicRouterArr);
// console.log(JSON.stringify(dynamicRouterArr));

const router = createRouter(
  [
    ...dynamicRouterArr,
    {
      path: "*",
      name: "intercept",
      redirect: { name: "home" },
    },
  ],
  { mode: "hash" }
);

router.beforeEach((to, from, next) => {
  switch (to.name) {
    case "login":
      if (store.getters.token) {
        return next({ name: "home" });
      }
      break;
  }
  next();
  console.log("router.beforeEach.to:", to);
  console.log("router.beforeEach.from:", from);
});

// router.afterEach((to, from) => {
//   console.log('router.beforeEach.to:', to);
//   console.log('router.beforeEach.from:', from);
// });

export default router;
