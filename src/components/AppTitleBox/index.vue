<template>
  <div :class="classes">
    <div class="app-title-box__inner">
      <slot></slot>
    </div>
    <div v-if="$slots.right" class="app-title-box__right">
      <slot name="right"></slot>
    </div>
    <div class="app-title-box__bg">
      <svg>
        <use xlink:href="#app-title-box__bg" />
      </svg>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "AppTitleBox",
  props: {
    align: {
      type: String,
      default: "left",
    },
  },
  setup(props) {
    const classes = computed(() => {
      return ["app-title-box", `is--align-${props.align}`];
    });
    return {
      classes,
    };
  },
});
</script>

<style lang="scss">
.app-title-box {
  width: 100%;
  height: 0.5rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  // background-color: rgba(255, 0, 242, 0.2);

  &__inner {
    display: flex;
    width: 100%;
    padding: 0 0.4rem;
    position: relative;
    z-index: 1;
    color: rgb(226, 226, 226);
  }

  &__right {
    position: absolute;
    right: 0.3rem;
    z-index: 1;
  }

  &.is--align-center {
    .app-title-box__inner {
      justify-content: center;
    }
  }
  &.is--align-left {
    .app-title-box__inner {
      justify-content: left;
    }
  }
  &.is--align-right {
    .app-title-box__inner {
      justify-content: right;
    }
  }

  &__bg {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
    svg {
      width: 114%;
      height: 300%;
      transform: translate3d(-6%, -33%, 0);
    }
  }
}
</style>

