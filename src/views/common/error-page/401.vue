<template>
  <div class="page-401">
    <h1>401</h1>
    <van-button type="warning" @click="$router.go(-1)">返回</van-button>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Page401",
});
</script>

<style lang="scss" scoped>
.page-401 {
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  text-align: center;

  h1 {
    font-size: 70px;
    color: #7b92a9;
  }
}
</style>
