<template>
  <C1 ref="c1"></C1>
  <C2 ref="c2"></C2>
  <C3 ref="c3"></C3>
  <C9 ref="c4"></C9>
</template>

<script lang="ts">
import settings from "@/settings";
import { defineComponent, getCurrentInstance, onBeforeUnmount, onMounted, ref } from "vue";
import ChartStore from "./ChartStore";

export default defineComponent({
  components: {
    C1: ChartStore.C1,
    C2: ChartStore.C2,
    C3: ChartStore.C3,
    // C4: ChartStore.C4,
    C9: ChartStore.C9,
  },
  setup() {
    const c1 = ref(), c2 = ref(), c3 = ref(), c4 = ref();
    let timer: any = null;

    onMounted(() => {
      startTick();
    });

    const startTick = () => {
      timer = setInterval(() => {
        c1?.value?.refresh();
        c2?.value?.refresh();
        c3?.value?.refresh();
        c4?.value?.refresh();
      }, settings.refreshChartInterval);
    }

    const stopTick = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    onBeforeUnmount(() => {
      stopTick();
    });

    return {
      c1,
      c2,
      c3,
      c4,
    }
  },
});
</script>