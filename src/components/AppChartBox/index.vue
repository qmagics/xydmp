<template>
  <div class="app-chart-box" :style="boxStyle">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "AppChartBox",
  props: {
    height: String,
  },
  setup(props) {
    const boxStyle = computed(() => {
      return {
        height: props.height,
      };
    });
    return {
      boxStyle,
    };
  },
});
</script>

<style lang="scss">
.app-chart-box {
  // background-color: rgba(136, 255, 0, 0.2);
}
</style>
