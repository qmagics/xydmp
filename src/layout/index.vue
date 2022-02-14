<template>
  <router-view></router-view>

  <van-tabbar route>
    <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
    <van-tabbar-item icon="user-o" to="/me">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "Layout",

  computed: {
    ...mapGetters("app", ["isHasBottomBar"])
  },

  mounted() {
    this.$store.dispatch("app/showBottomBar");
  },

  beforeUnmount() {
    this.$store.dispatch("app/hideBottomBar");
  }
});
</script>