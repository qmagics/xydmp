<template>
  <div class="app-footer">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppFooter",
  setup(props) {},
});
</script>