<template>
  <div class="h-screen flex flex-col items-stretch">
    <div class="flex-grow overflow-y-scroll-smooth h-full">
      <router-view></router-view>
    </div>
    <van-tabbar class="flex-shrink-0" v-model="tabbarActive" :fixed="false">
      <van-tabbar-item
        v-for="(item, index) in tabbarArr"
        :key="index"
        :icon="item.icon"
        :to="item.to"
        >{{ item.text }}</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      tabbarActive: 0,
      tabbarArr: [
        {
          icon: "home-o",
          iconActive: "home-o",
          text: "home-o",
          to: { name: "tab-0" },
        },
        {
          icon: "search",
          iconActive: "search",
          text: "search",
          to: { name: "tab-1" },
        },
        {
          icon: "friends-o",
          iconActive: "friends-o",
          text: "friends-o",
          to: { name: "tab-2" },
        },
        {
          icon: "user-o",
          iconActive: "user-o",
          text: "user-o",
          to: { name: "tab-3" },
        },
      ],
    };
  },
  methods: {},
};
</script>

<style></style>
