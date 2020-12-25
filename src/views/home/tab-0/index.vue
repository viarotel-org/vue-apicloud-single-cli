<template>
  <div class="">
    <div class="border-t-safe">tab-0</div>
    <div class="">{{ demoData }}</div>
    <van-button @click="getDemoData" type="default">获取数据</van-button>
  </div>
</template>

<script>
export default {
  name: "tab-0",
  data() {
    return {
      demoData: "",
    };
  },
  methods: {
    async getDemoData() {
      const data = await this.$store.dispatch("demo/getDemoData");
      this.demoData = data;
    },
  },
};
</script>

<style></style>
