<template>
  <div class="app-switchs" :class="`app-switchs--direction-${direction}`">
    <div
      class="app-switch-item"
      :class="{'is--active':modelValue===i.value}"
      v-for="i in items"
      :key="i.value"
      @click="onItemClick(i)"
    >
      <span class="app-switch-item__title">{{i.label}}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";

export interface SwitchItem {
  label: string;
  value: any;
}

export default defineComponent({
  name: "AppSwitchs",
  props: {
    items: {
      type: Array as PropType<SwitchItem[]>,
      required: true,
    },
    direction: {
      type: String as PropType<"vertical" | "horizontal">,
      default: "horizontal",
    },
    modelValue: [String, Number],
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    if (!props.modelValue) {
      emit("update:modelValue", props.items[1].value);
    }
    const onItemClick = (item: SwitchItem) => {
      emit("update:modelValue", item.value);
      emit("change", item.value);
    };

    return {
      onItemClick,
    };
  },
});
</script>

<style lang="scss">
$itemHeight: 0.24rem;
.app-switchs {
  display: flex;

  .app-switch-item {
    // background-color: rgb(27, 43, 71);
    // border: 0.01rem solid rgb(138, 145, 165);
    // cursor: pointer;
    // color: rgb(163, 170, 181);
  }

  &.app-switchs--direction-horizontal {
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .app-switch-item {
      display: flex;
      height: $itemHeight;
      padding: 0 0.12rem;
      text-align: center;
      position: relative;
      align-items: center;
      @include linearBorder(right, 60%);
      color: rgb(162, 167, 172);
      cursor: pointer;
      font-size: 0.12rem;

      &:hover {
        color: rgb(200, 206, 212);
      }

      &::before {
        content: "";
        width: 100%;
        height: 100%;
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: 0;
        transform: scale(0);
        transform-origin: center;
        background-image: radial-gradient(
          rgb(0, 119, 255) 0%,
          rgba(0, 137, 253, 0) 70%
        );
        transition: all 0.2s ease;
      }

      &.is--active {
        color: #fff;
        font-weight: bold;

        &::before {
          transform: scale(1);
        }
      }

      &__title {
        z-index: 1;
      }
      // transition: background 0.2s ease;
      // &.is--active {
      //   color: #fff;
      //   background-image: linear-gradient(
      //     to right,
      //     rgb(18, 88, 125),
      //     rgb(27, 44, 72)
      //   );
      //   width: $itemHeight * 1.2;

      //   &::before,
      //   &::after {
      //     content: "";
      //     background-color: rgb(140, 157, 175);
      //     width: 0.01rem;
      //     height: 0.08rem;
      //     position: absolute;
      //     left: 50%;
      //     transform: translateX(-50%);
      //   }
      //   &::before {
      //     top: 0.08rem;
      //   }
      //   &::after {
      //     bottom: 0.08rem;
      //   }
      // }
    }
  }
}
</style>
