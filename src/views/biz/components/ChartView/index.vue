<template>
  <div class="chart-view">
    <app-panel
      class="chart-view__left"
      :style="panelLeftStyle"
      :class="chartVisible?'is--active':''"
    >
      <G1 v-if="chartVisible"></G1>
    </app-panel>
    <app-panel
      class="chart-view__right"
      :style="panelRightStyle"
      :class="chartVisible?'is--active':''"
    >
      <G2 v-if="chartVisible"></G2>
    </app-panel>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { defineComponent, computed } from "vue";
import G1 from "./G1.vue";
import G2 from "./G2.vue";

export default defineComponent({
  components: {
    G1,
    G2,
  },
  setup() {
    const store = useStore();

    const panelStyle = computed(() => {
      return {
        bottom: "0.5rem",
        width: "4.2rem",
      };
    });

    const panelLeftStyle = computed(() => {
      return {
        ...panelStyle.value,
      };
    });

    const panelRightStyle = computed(() => {
      return {
        ...panelStyle.value,
      };
    });

    return {
      chartVisible: computed(() => store.state.ChartView.visible),
      panelLeftStyle,
      panelRightStyle,
    };
  },
});
</script>

<style lang="scss">
$panelTop: 1.2rem;

.chart-view {
  position: relative;
  z-index: 5;

  &__left,
  &__right {
    position: fixed;
    top: $panelTop;
    transition: all 0.25s ease-in-out;
    bottom: 0;
  }

  &__left {
    left: 0;
    transform: translate3d(-100%, 0, 0);

    &.is--active {
      transform: translate3d(0, 0, 0);
    }
  }
  &__right {
    right: 0;
    transform: translate3d(100%, 0, 0);
    &.is--active {
      transform: translate3d(0, 0, 0);
    }
  }
}
</style>