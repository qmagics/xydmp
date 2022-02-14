<template>
  <div class="pop-block" v-show="popVisible">
    <component :is="popComponent"></component>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { defineComponent, computed } from "vue";
import PopFacilities from "./PopFacilities.vue";
import PopBerth from "./PopBerth.vue";

export default defineComponent({
  components: {
    PopFacilities,
    PopBerth,
  },
  computed: {},
  setup() {
    const store = useStore();
    return {
      popComponent: computed(() => `Pop${store.state.PopBlock.type}`),
      popVisible: computed(() => store.state.PopBlock.visible),
    };
  },
});
</script>

<style lang="scss">
$btnDelta: 0.04rem;
.pop-block {
  position: absolute;
  right: 0.3rem;
  bottom: 0.35rem;
  z-index: 2;

  &-btn {
    background: rgb(22, 39, 64);
    border: none;
    color: rgb(185, 191, 199);
    letter-spacing: 0.01rem;
    position: relative;
    &::before {
      position: absolute;
      content: "";
      left: $btnDelta;
      top: $btnDelta;
      bottom: $btnDelta;
      right: $btnDelta;
      border-radius: 0.3rem;
      border: 0.015rem solid rgb(105, 117, 134);
    }
    &:hover,
    &:focus {
      background: rgb(15, 29, 49);
      color: rgb(185, 191, 199);
    }

    &.is--active {
      .yw-icon {
        display: inline-block;
        transform: rotate(180deg);
      }
    }
  }

  &-panel {
    position: absolute;
    bottom: 0.5rem;
    right: 0;
  }
}
</style>