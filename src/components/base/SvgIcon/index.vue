<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "SvgIcon",
  props: {
    prefix: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}${props.name}`);
    return { symbolId };
  },
});
</script>

<style lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  // vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>