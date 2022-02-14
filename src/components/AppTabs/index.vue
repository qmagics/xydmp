<template>
  <div class="app-tabs" :class="`app-tabs--direction-${direction}`">
    <div
      class="app-tab-item"
      :class="{ 'is--active': modelValue === i.value }"
      v-for="i in items"
      :key="i.value"
      @click="onItemClick(i)"
    >
      <span class="app-tab-item__title">{{ i.label }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";

export interface TabItem {
  label: string;
  value: any;
}

export default defineComponent({
  name: "AppTabs",
  props: {
    items: {
      type: Array as PropType<TabItem[]>,
      required: true,
    },
    direction: {
      type: String as PropType<"vertical" | "horizontal">,
      default: "vertical",
    },

    modelValue: [String, Number],
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    if (!props.modelValue && props.items[0]) {
      emit("update:modelValue", props.items[0].value);
    }
    const onItemClick = (item: TabItem) => {
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
$itemWidth: 0.24rem;
$itemRadius: 0.06rem;
.app-tabs {
  display: flex;

  .app-tab-item {
    background-color: rgb(27, 43, 71);
    border: 0.02rem solid rgb(138, 145, 165);
    cursor: pointer;
    color: rgb(163, 170, 181);
  }

  &.app-tabs--direction-vertical {
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;

    .app-tab-item {
      width: $itemWidth;
      padding: 0.18rem 0;
      text-align: center;
      border-top-left-radius: $itemRadius;
      border-bottom-left-radius: $itemRadius;
      line-height: 1.2;
      position: relative;
      // transition: background 0.2s ease;
      &.is--active {
        color: #fff;
        background-image: linear-gradient(
          to right,
          rgb(18, 88, 125),
          rgb(27, 44, 72)
        );
        width: $itemWidth * 1.2;

        &::before,
        &::after {
          content: "";
          background-color: rgb(140, 157, 175);
          width: 0.01rem;
          height: 0.08rem;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        &::before {
          top: 0.08rem;
        }
        &::after {
          bottom: 0.08rem;
        }
      }
    }
  }

  &.app-tabs--direction-horizontal {
    flex-direction: row;
    align-items: flex-end;
    position: relative;
    @include linearBorder(bottom, 100%, 0.02rem, 0.8, -0.01rem);
    &:last-child:after {
      display: block;
    }

    .app-tab-item {
      height: $itemWidth;
      padding: 0 0.28rem;
      text-align: center;
      border-top-left-radius: $itemRadius;
      border-top-right-radius: $itemRadius;
      line-height: $itemWidth;
      position: relative;
      margin: 0 0.05rem;
      &.is--active {
        color: #fff;
        background-image: linear-gradient(
          to bottom,
          rgb(18, 88, 125),
          rgb(27, 44, 72)
        );
        height: $itemWidth * 1.2;
        font-weight: 600;

        &::before,
        &::after {
          content: "";
          background-color: rgb(140, 157, 175);
          width: 0.08rem;
          height: 0.01rem;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
        &::before {
          left: 0.12rem;
        }
        &::after {
          right: 0.12rem;
        }
      }
    }
  }
}
</style>
