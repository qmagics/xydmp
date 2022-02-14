<template>
  <div class="app-title-line">
    <div class="app-title-line__inner" :style="{width}">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8.68 5.5">
        <path
          d="M4,.58.93,2.06a.77.77,0,0,0,0,1.38L4,4.92a.76.76,0,0,0,.66,0L7.75,3.44a.77.77,0,0,0,0-1.38L4.66.58A.7.7,0,0,0,4,.58Z"
        />
      </svg>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppTitleLine",
  props: {
    width: {
      type: String,
      default: "1.8rem",
    },
  },
  setup() {},
});
</script>

<style lang="scss">
.app-title-line {
  width: 100%;
  height: 0.2rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  &__inner {
    position: relative;
    height: 100%;
    width: 100%;

    svg {
      width: 1em;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      path {
        fill: none;
        stroke: #fff;
        stroke-miterlimit: 10;
        opacity: 0.5;
      }
    }

    &::before,
    &::after {
      content: "";
      height: 0.02rem;
      width: calc(50% - 1em);
      background-image: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.4) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    &::before {
      left: 0;
    }
    &::after {
      right: 0;
    }
  }
}
</style>
