<template>
  <div class="dashboard-container">
    <div :class="[
      'dashboard',
      {
        'is--blur': isBlur
      }
    ]">
      <div class="dashboard__bg">
        <board-bg></board-bg>
      </div>
      <div class="dashboard__parts" v-loading="loading">
        <div class="part-top part-top-left">
          <span class="info-label">
            <yw-icon name="yw-icon-flag"></yw-icon>
            <span class="color-info">员工情况:</span>
          </span>
          <span class="info-item" v-for="(i,index) in topLeftItems" :key="index">
            <!-- @click="onTopItemClick(i)" -->
            {{ i.label }}：
            <span class="highlight">{{ i.value }}</span>
          </span>
        </div>
        <div class="part-top part-top-right">
          <span class="info-label is--clickable" @click="onTopItemClick()">
            <yw-icon name="yw-icon-ship-stop"></yw-icon>
            <span class="color-info">停靠情况:</span>
          </span>
          <span
            class="info-item is--clickable"
            v-for="(i,index) in topRightItems"
            :key="index"
            @click="onTopItemClick(i)"
          >
            {{ i.label }}：
            <span class="highlight">{{ i.value }}</span>
          </span>
        </div>
        <div class="part-bottom part-bottom-left">
          <div
            class="part-bottom-item"
            :class="{ 'is--active': i.active }"
            v-for="(i,index) in bottomLeftItems"
            :key="index"
            @click="onBottomItemClick(i)"
          >
            <yw-icon :name="i.icon"></yw-icon>
            <span>{{ i.value }}</span>
          </div>
        </div>
        <div class="part-bottom part-bottom-right">
          <div
            class="part-bottom-item"
            :class="{ 'is--active': i.active }"
            v-for="(i,index) in bottomRightItems"
            :key="index"
            @click="onBottomItemClick(i)"
          >
            <yw-icon :name="i.icon"></yw-icon>
            <span>{{ i.value }}</span>
          </div>
        </div>
        <div
          class="part-center"
          :class="{ 'is--active': bottomCenterItem.active }"
          @click="onBottomItemClick(bottomCenterItem)"
        >
          <span>{{ bottomCenterItem.value }}</span>
          <yw-icon :name="bottomCenterItem.icon"></yw-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import KanbanApi from "@/api/KanbanApi";
import { useStore } from "@/store";
import { ActionType } from "@/store/ActionType";
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import BoardBg from "./BoardBg.vue";
import useBottom from "./useBottom";
import useTop from "./useTop";

export default defineComponent({
  components: {
    BoardBg,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const loading = ref(false);
    const vm = computed(() => store.state.BaseInfo);

    const { topLeftItems, topRightItems, onTopItemClick } = useTop(vm);

    const {
      bottomLeftItems,
      bottomRightItems,
      bottomCenterItem,
      onBottomItemClick,
    } = useBottom(vm);

    const getData = async () => {
      try {
        loading.value = true;
        const { data } = await KanbanApi.getBasicInformation();

        const vm = data.rows[0];

        store.commit(ActionType.SET_BASE_INFO, vm);
      } finally {
        loading.value = false;
      }
    }

    onMounted(() => {
      getData();
    });

    const isBlur = computed(() => {
      const isMonitorVisible = store.state.MonitorView.visible;

      const isInDispatchPage = route.path.includes('dispatch');
      const isHasDispatchMode = !!store.state.Dispatch.Mode;

      return isMonitorVisible || (isInDispatchPage && isHasDispatchMode);
    });

    return {
      loading,
      topLeftItems,
      topRightItems,
      onTopItemClick,
      bottomLeftItems,
      bottomRightItems,
      bottomCenterItem,
      onBottomItemClick,
      isBlur
    };
  },
});
</script>

<style lang="scss">
$dashboardWidth: 12.2rem;
$partTopHeight: 0.28rem;
$partTopWidth: 4.2rem;
$partBottomHeight: 0.3rem;
$partBottomWidth: 3.3rem;
$partCenterSize: 1.16rem;

.dashboard-container {
  display: flex;
  justify-content: center;
  width: 100%;
  height: $footerHeight;
  background-image: linear-gradient(
    to top,
    rgba(18, 31, 47, 1) 0%,
    rgba(18, 31, 47, 0) 100%
  );
}

.dashboard {
  height: $footerHeight;
  width: $dashboardWidth;
  position: relative;
  overflow: hidden;

  &.is--blur {
    filter: blur(0.05rem);
  }

  &__bg {
    height: 100%;
    overflow: hidden;
  }

  &__parts {
    position: absolute;
    left: 1.2rem;
    right: 1.2rem;
    top: 0.62rem;
    bottom: 0;
    .part-top {
      height: $partTopHeight;
      width: $partTopWidth;
      // background: rgba(255, 0, 0, 0.363);
      line-height: $partTopHeight;
      position: absolute;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      font-size: 0.13rem;
      .info-label {
        text-align: center;
        width: 0.9rem;
        cursor: pointer;
        &.is--clickable {
          &:hover {
            text-decoration: underline;
          }
        }
        .yw-icon {
          margin-right: 0.05rem;
        }
      }
      .info-item {
        position: relative;
        color: rgba(255, 255, 255, 0.8);
        &.is--clickable {
          cursor: pointer;
          &:hover {
            color: $colorInfo;
            .highlight {
              color: $colorInfo;
            }
          }
        }
        .highlight {
          color: #fff;
        }
        &::after {
          content: "";
          position: absolute;
          height: 60%;
          width: 0.01rem;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
        &:last-child {
          &::after {
            display: none;
          }
        }
      }
      &-left {
        left: 0.1rem;
        .info-item {
          width: 1.2rem;
          height: $partTopHeight;
          @include text-clamp(1);
        }
      }
      &-right {
        right: 0.1rem;
        .info-item {
          width: 0.8rem;
          height: $partTopHeight;
          @include text-clamp(1);
        }
      }
    }
    .part-bottom {
      height: $partBottomHeight;
      width: $partBottomWidth;
      position: absolute;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;

      $deg: -38deg;

      &-item {
        // background: rgba(210, 105, 30, 0.315);
        flex: 1;
        display: flex;
        height: 100%;
        align-items: center;
        position: relative;
        justify-content: center;
        cursor: pointer;
        &::before {
          transition: all 0.2s ease;
          content: "";
          position: absolute;
          height: 100%;
          width: 0;
        }
        &:after {
          content: "";
          position: absolute;
          height: 60%;
          width: 0.01rem;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          right: 0;
          top: 50%;
          transform: translateY(-50%) skew($deg);
        }
        &:last-child {
          &::after {
            display: none;
          }
        }
        .yw-icon {
          color: $colorPrimaryLight;
          font-size: 0.16rem;
          margin-right: 0.05rem;
          z-index: 1;
        }
        span {
          z-index: 1;
        }
      }

      &-left {
        left: 0.88rem;
        .part-bottom-item {
          &::before {
            background: linear-gradient(
              to right,
              rgb(38, 104, 190) 0%,
              rgba(36, 77, 129, 0) 100%
            );
            left: 0;
            transform: skew($deg);
          }

          &.is--active {
            &::before {
              width: 90%;
            }
          }

          &:first-child {
            &::before {
              border-top-left-radius: 0.12rem;
            }
          }
        }
      }

      &-right {
        right: 0.88rem;
        .part-bottom-item {
          &::before {
            background: linear-gradient(
              to left,
              rgb(38, 104, 190) 0%,
              rgba(36, 77, 129, 0) 100%
            );
            right: 0;
            transform: skew(-$deg);
          }

          &.is--active {
            &::before {
              width: 90%;
            }
          }

          &:last-child {
            &::before {
              border-top-right-radius: 0.12rem;
            }
          }

          &:after {
            transform: translateY(-50%) skew(-$deg);
          }
        }
      }
    }
    .part-center {
      width: $partCenterSize;
      height: $partCenterSize;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      top: -0.14rem;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding-top: 0.12rem;
      cursor: pointer;
      span {
        font-size: 0.34rem;
        position: relative;
      }
      .yw-icon {
        color: $colorPrimaryLight;
        position: relative;
        font-size: 0.2rem;
      }

      &::before {
        content: "";
        width: 0;
        height: 0;
        position: absolute;
        transition: all 0.2s ease;
        top: 50%;
        left: 50%;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background-image: radial-gradient(
          circle,
          rgb(38, 104, 190, 1) 0%,
          rgb(38, 104, 190, 0.6) 20%,
          rgba(38, 104, 190, 0) 100%
        );
      }

      &.is--active {
        &::before {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>