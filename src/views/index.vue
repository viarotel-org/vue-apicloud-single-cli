<template>
  <transition v-bind="transitionObj">
    <!-- <router-cache> -->
    <router-view class="router-view"></router-view>
    <!-- </router-cache> -->
  </transition>
</template>
<script>
export default {
  name: "App",
  // data() {
  //   return {};
  // },
  // created() {},
  watch: {
    $route(to) {
      console.log(to.name, this);
    },
  },
  computed: {
    transitionObj() {
      let name = "";
      let mode = "";
      let duration = {};
      // if (!this.$screen.lg) {
      switch (this.$route.params.direction) {
        case "back":
          name = "back";
          mode = "";
          duration = {
            enter: 300,
            leave: 300,
          };
          break;
        case "forward":
          name = "forward";
          mode = "";
          duration = {
            enter: 300,
            leave: 300,
          };
          break;
        case "replace":
          name = "forward";
          mode = "";
          duration = {
            enter: 300,
            leave: 300,
          };
          break;
      }
      // }
      return {
        name,
        mode,
        duration,
      };
    },
  },
  mounted() {
    // this.$isAPICloud &&
    //   this.$ac.addEventListener(
    //     {
    //       name: "keyback",
    //     },
    //     (ret, err) => {
    //       const UIStack = this.$pageStack.getStack();
    //       console.log(UIStack);
    //       if (UIStack.length === 1) {
    //         alert("退出app");
    //       } else {
    //         this.$router.go(-1);
    //       }
    //     }
    //   );
  },
};
</script>

<style lang="scss">
.router-view {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  &.forward-enter {
    transform: translate3d(100%, 0, 0);
    z-index: 20;
  }
  &.forward-enter-active {
    z-index: 20;
    transition: transform 300ms ease-in-out;
  }
  &.forward-enter-to {
    z-index: 20;
    transform: none;
  }
  &.forward-leave,
  &.forward-leave-active {
    z-index: 10;
    transition: transform 280ms ease-in-out;
  }
  &.forward-leave-to {
    z-index: 10;
    transform: translate3d(-20%, 0, 0);
  }

  &.back-enter {
    z-index: 10;
    transform: translate3d(-20%, 0, 0);
  }
  &.back-enter-active {
    z-index: 10;
    transition: transform 300ms ease-in-out;
  }
  &.back-enter-to {
    z-index: 10;
    transform: none;
  }

  &.back-leave,
  &.back-leave-active {
    z-index: 20;
    transition: transform 280ms ease-in-out;
  }
  &.back-leave-to {
    z-index: 20;
    transform: translate3d(100%, 0, 0);
  }
}

// .router-view {
//   position: absolute;
//   top: 0;
//   bottom: 0;
//   left: 0;
//   left: 0;
//   transition: opacity 0.5s, transform 0.5s;
//   &.forward-enter,
//   &.back-leave-active {
//     opacity: 0.5;
//     transform: translateX(100%);
//   }
//   &.forward-leave-active,
//   &.back-enter {
//     opacity: 0.5;
//     transform: translateX(-100%);
//   }
// }
</style>
