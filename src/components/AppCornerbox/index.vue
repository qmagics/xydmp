<template>
  <div class="app-corner-box" :class="[
    `app-corner-box--${type}`
  ]" :style="boxStyle">
    <div class="app-corner-box__inner">
      <slot></slot>
    </div>
    <i class="c c1"></i>
    <i class="c c2"></i>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "AppCornerBox",
  props: {
    height: {
      type: String,
      default: "0.34rem",
    },
    type: {
      type: String,
      default: "L",
    },
  },
  setup(props) {
    const boxStyle = computed(() => {
      return {
        height: props.height,
      };
    });
    return {
      boxStyle,
    };
  },
});
</script>

<style lang="scss">
$cornerSize: var(--corner-size);
$cornerBorderWidth: var(--corner-border-width);
$cornerBorderColor: var(--corner-border-color);

.app-corner-box {
  background-color: rgba(13, 35, 51, 0.7);
  min-height: 0.3rem;
  position: relative;

  --corner-size: 0.05rem;
  --corner-border-width: 0.02rem;
  --corner-border-color: rgb(92, 204, 255);

  &--L {
    & > .c {
      &:before,
      &:after {
        content: "";
        position: absolute;
        width: $cornerSize;
        height: $cornerSize;
        border-color: $cornerBorderColor;
        border-style: solid;
      }

      &.c1 {
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0;
        &::before {
          border-width: $cornerBorderWidth 0 0 $cornerBorderWidth;
          left: 0;
          top: 0;
        }
        &::after {
          border-width: 0 0 $cornerBorderWidth $cornerBorderWidth;
          left: 0;
          bottom: 0;
        }
      }
      &.c2 {
        right: 0;
        bottom: 0;
        top: 0;
        &::before {
          border-width: $cornerBorderWidth $cornerBorderWidth 0 0;
          right: 0;
          top: 0;
        }
        &::after {
          border-width: 0 $cornerBorderWidth $cornerBorderWidth 0;
          right: 0;
          bottom: 0;
        }
      }
    }
  }
  &__inner {
    display: flex;
    height: 100%;
  }
}
</style>
