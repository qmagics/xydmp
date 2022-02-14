<template>
  <div class="page-404">
    <h1>404</h1>
    <van-button type="warning" @click="$router.go(-1)">返回</van-button>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Page404",
});
</script>

<style lang="scss" scoped>
.page-404 {
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  text-align: center;

  h1 {
    font-size: 70px;
    color:#7b92a9;
  }
}
</style>
