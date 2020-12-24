<template>
  <div class="h-screen flex flex-col items-stretch">
    <div class="flex-grow overflow-y-scroll-smooth h-full"></div>
    <van-tabbar class="flex-shrink-0" v-model="tabbarActive" :fixed="false">
      <van-tabbar-item icon="home-o"></van-tabbar-item>
      <van-tabbar-item icon="search"></van-tabbar-item>
      <van-tabbar-item icon="friends-o"></van-tabbar-item>
      <van-tabbar-item icon="user-o"></van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      tabbarActive: 0,
    };
  },
};
</script>

<style></style>
