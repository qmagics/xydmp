<template>
  <SvgSymbols></SvgSymbols>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SvgSymbols from "@/icons/svg-symbols/index.vue";

export default defineComponent({
  components: {
    SvgSymbols,
  },
  setup() {},
});
</script>
