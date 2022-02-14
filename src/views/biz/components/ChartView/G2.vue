<template>
  <C5 ref="c1"></C5>
  <C10 ref="c2"></C10>
  <C7 ref="c3"></C7>
  <C8 ref="c4"></C8>
</template>

<script lang="ts">
import settings from "@/settings";
import { defineComponent, ref, onBeforeUnmount, onMounted } from "vue";
import ChartStore from "./ChartStore";

export default defineComponent({
  components: {
    C5: ChartStore.C5,
    // C6: ChartStore.C6,
    C7: ChartStore.C7,
    C8: ChartStore.C8,
    C10: ChartStore.C10,
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