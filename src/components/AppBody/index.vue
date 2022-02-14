<template>
  <div class="app-body">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppBody",
  setup(props) {},
});
</script>


