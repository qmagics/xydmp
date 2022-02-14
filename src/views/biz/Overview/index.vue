
<template>
  <div>
    <!-- AAAAAA -->
    <!-- <pre>{{shipList}}</pre> -->
  </div>
</template>

<script lang="ts">
import { store, useStore } from "@/store";
import { ActionType } from "@/store/ActionType";
import { GlobalShipMode } from "@/store/interface";
import { defineComponent, computed } from "vue";

export default defineComponent({
  setup() {
    const store = useStore();

    // 将船舶显示模式切换为实时模式
    store.commit(ActionType.SET_GLOBAL_SHIP_MODE, GlobalShipMode.REALTIME);

    return {
      shipList: computed(() => {
        return store.state.map3d.shipList;
      }),
    };
  },
});
</script>

<style>
</style>