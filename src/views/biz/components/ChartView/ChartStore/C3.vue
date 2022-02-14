<template>
  <div class="C3">
    <app-title-box @click="refresh">本年度船只修理情况</app-title-box>
    <app-chart-box height="2.2rem">
      <div class="C3__header">
        <div class="legend">
          <span class="legend__item" v-for="i in legends" :key="i.value">
            <span class="legend__item-block" :style="{ 'background-color': i.color }"></span>
            <span class="legend__item-label">{{ i.label }}</span>
          </span>
        </div>
      </div>
      <div class="C3__body" v-loading="loading">
        <div class="percent-bar" :style="percentbarStyle">
          <el-popover
            v-for="month in displayMonthlyData"
            :key="month.Name"
            :title="`${month.Name}修理情况`"
            placement="top-end"
            trigger="hover"
            popper-class="tooltip-popper"
            :show-arrow="false"
          >
            <template #reference>
              <div class="percent-bar__item">
                <div class="bar-head">{{ month.Name }}</div>
                <div class="bar-body">
                  <span
                    class="bar-part"
                    :style="{
                      'background-image': `linear-gradient(to right, transparent, ${t.color})`,
                      'width': getPartWidth(month, t)
                    }"
                    v-for="t in types"
                    :key="t.value"
                  ></span>
                </div>
                <div class="bar-tail">{{ month.TotalCount || 0 }}艘</div>
              </div>
            </template>
            <div class="percent-bar__tooltip">
              <p v-for="i in types.filter(i => month[i.prop])">
                <span class="legend__item-block" :style="{ 'background-color': i.color }"></span>
                <span class="tooltip__label">{{ i.label }}</span>
                <span class="tooltip__value">{{ month[i.prop] }}</span>
              </p>
            </div>
          </el-popover>
        </div>
      </div>
      <div class="C3__footer">
        <div class="toggle-btn" @click="togglePage">
          <yw-icon :name="`yw-icon-arrow-${arrowDirection}`"></yw-icon>
        </div>
      </div>
    </app-chart-box>
  </div>
</template>
<script lang="ts">
import KanbanApi from "@/api/KanbanApi";
import { defineComponent, ref, computed, onMounted } from "vue";

// 当月数据项
interface monthlyItem {
  Name: string;
  OilTankerCount: number;
  ContainerCount: number;
  BulkCargoCount: number;
  RoroShipCount: number;
  OtherCount: number;
  TotalCount: number;
  [key: string]: any;
}

// 船只类型
interface ShipType {
  label: string;
  value: string;
  prop: string;
  color: string;
}

/** 使用百分比条 */
const usePercentbar = (options: { defaultPage: number }) => {
  const currentPage = ref(options?.defaultPage || 1);

  /** bar容器样式 */
  const percentbarStyle = computed(() => {
    const ty = currentPage.value === 1 ? "0" : "-50%";
    return {
      transform: `translate3d(0,${ty},0)`,
    };
  });

  /** 切换页码 */
  const togglePage = () => {
    if (++currentPage.value > 2) {
      currentPage.value = 1;
    }
  };

  /** 翻页箭头方向 */
  const arrowDirection = computed(() => {
    return currentPage.value === 1 ? "down" : "up";
  });

  return {
    percentbarStyle,
    togglePage,
    arrowDirection,
  };
};

export default defineComponent({
  setup() {
    const month = new Date().getMonth();
    const loading = ref(false);

    /** 以月份为维度的统计数据 */
    const monthlyData = ref<monthlyItem[]>([]);

    /** 显示的数据 */
    const displayMonthlyData = computed(() => {
      if (month > 5) {
        return [...monthlyData.value].reverse();
      }
      else {
        return monthlyData.value;
      }
    });

    /** 船舶类型配置 */
    const types = ref<ShipType[]>([
      {
        label: "油化船",
        value: "OilTanker",
        prop: "OilTankerCount",
        color: "rgb(255,233,113)",
      },
      {
        label: "集装箱",
        value: "Container",
        prop: "ContainerCount",
        color: "rgb(155,156,156)",
      },
      {
        label: "散货",
        value: "BulkCargo",
        prop: "BulkCargoCount",
        color: "rgb(46,155,255)",
      },
      {
        label: "滚装船",
        value: "RoroShip",
        prop: "RoroShipCount",
        color: "rgb(255,119,51)",
      },
      {
        label: "其它",
        value: "Other",
        prop: "OtherCount",
        color: "rgb(75,213,168)",
      },
    ]);

    /** 图例对象 */
    const legends = computed(() => {
      return types.value;
    });

    /** 获取图表数据方法 */
    const getData = async () => {
      if (loading.value) return;

      loading.value = true;
      try {
        const { data } = await KanbanApi.getShipRepair();
        monthlyData.value = data.rows;
      } finally {
        loading.value = false;
      }
    };

    /** 获取区块宽度 */
    const getPartWidth = (month: monthlyItem, type: ShipType): string => {
      if (month.TotalCount === 0) {
        return "0%";
      }
      const percent = (month as any)[type.prop] / month.TotalCount;
      return (percent * 100).toFixed(4) + "%";
    };

    /** 使用百分比条 */
    const { percentbarStyle, togglePage, arrowDirection } = usePercentbar({
      defaultPage: 1,
    });

    onMounted(() => {
      getData();
    });

    return {
      loading,
      monthlyData,
      displayMonthlyData,
      types,
      legends,
      refresh: getData,
      getPartWidth,
      togglePage,
      percentbarStyle,
      arrowDirection,
    };
  },
});
</script>

<style lang="scss">
.legend {
  display: flex;
  justify-content: space-between;
}
.legend__item {
  display: flex;
  align-items: center;
  &-block {
    display: inline-block;
    width: 0.16rem;
    height: 0.08rem;
    border-radius: 0.02rem;
  }
  &-label {
    color: rgb(165, 220, 255);
    font-size: 0.12rem;
    padding-left: 0.05rem;
  }
}

.C3 {
  .app-chart-box {
    padding: 0 0.15rem;
  }

  &__header {
    padding-top: 0.1rem;
  }
  &__body {
    margin-top: 0.1rem;
    height: 1.6rem;
    overflow-y: hidden;
  }
  &__footer {
    display: flex;
    align-items: center;
    justify-content: center;
    .toggle-btn {
      width: 50%;
      text-align: center;
      border-radius: 0.04rem;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
      &:hover {
        background-color: rgba(34, 122, 185, 0.158);
      }
      &:active {
        background-color: rgba(34, 122, 185, 0.3);
      }
      .yw-icon {
        color: rgb(57, 174, 255);
      }
    }
  }

  .percent-bar {
    $itemHeight: 0.26rem;
    $barItemBgColor: rgba(60, 66, 72, 0.8);
    transition: transform 0.4s ease;
    &__item {
      display: flex;
      align-items: center;
      color: rgb(213, 222, 226);
      height: $itemHeight;
      .bar-head {
        width: 0.36rem;
        padding-right: 0.05rem;
        @include text-clamp(1);
        text-align: right;
      }
      .bar-body {
        flex: 1;
        background-color: $barItemBgColor;
        border: 0.01rem solid $barItemBgColor;
        height: 0.1rem;
        line-height: 0;
        overflow: hidden;
        border-radius: 0.05rem;
        .bar-part {
          vertical-align: middle;
          width: 20%;
          display: inline-block;
          height: 100%;
        }
      }
      .bar-tail {
        width: 0.4rem;
        padding-left: 0.05rem;
        text-align: left;
      }
    }
  }
}

.el-popper.tooltip-popper {
  background: rgba(#081520, 0.75);
  border: none;
  box-shadow: 0 0 0.08rem 0.04rem rgba($colorPrimaryLight, 0.35);

  .el-popover__title {
    color: #fff;
    font-size: .14rem;
  }
  p {
    margin-bottom: 0.05rem;
  }
  .tooltip__label {
    color: rgba($colorInfo, 1);
    padding-left: 0.1rem;
  }
  .tooltip__value {
    color: #fff;
    float: right;
  }
}
</style>
