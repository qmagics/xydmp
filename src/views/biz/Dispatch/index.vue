
<template>
  <div :class="[
    'page--dispatch',
    {
      'is--has-mode': !!Mode
    }
  ]">
    <transition name="slide-up">
      <mini v-if="Size === 'mini'"></mini>
    </transition>
    <transition name="slide-up">
      <max v-if="Size === 'max'"></max>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import mini from './mini.vue';
import max from './max.vue';
import { useStore } from "@/store";
import { ActionType } from "@/store/ActionType";
import { GlobalShipMode } from "@/store/interface";

export default defineComponent({
  components: {
    mini,
    max
  },
  setup() {
    const store = useStore();
    const Size = computed(() => store.state.Dispatch.Size);
    const Mode = computed(() => store.state.Dispatch.Mode);

    // 将船舶显示模式切换为调度模式
    store.commit(ActionType.SET_GLOBAL_SHIP_MODE, GlobalShipMode.DISPATCH);

    return {
      Size,
      Mode
    }
  }
});
</script>

<style lang="scss">
.page--dispatch {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 5;

  &.is--has-mode {
    right: 0;
  }
}
</style>