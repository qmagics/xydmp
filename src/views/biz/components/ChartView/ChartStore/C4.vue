<template>
  <div class="C4">
    <app-title-box>今日员工出勤情况</app-title-box>
    <app-chart-box height="1.7rem">
      <div class="C4__bar" v-loading="barLoading">
        <div class="bar-item" v-for="bar in bars" :key="bar.label">
          <span class="bar-item__label">{{ bar.label }}</span>
          <span class="bar-item__head">{{ bar.value }}人</span>
          <div class="bar-item__content">
            <span
              class="bar-item__content__body"
              :style="{
                'background-image': `linear-gradient(to right, transparent, ${bar.color})`,
                'width': `${bar.percent}`,
              }"
            ></span>
            <span class="bar-item__content__tail">{{ bar.percent }}</span>
          </div>
        </div>
      </div>
      <div class="C4__pies">
        <div class="pie-item pie1">
          <div class="chart-pie" ref="pie1Ref"></div>
        </div>
        <div class="pie-item pie2">
          <div class="chart-pie" ref="pie2Ref"></div>
        </div>
      </div>
    </app-chart-box>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import echarts, { EChartsOption } from "@/plugins/echarts";
import linearColors from "@/plugins/echarts/linearColors";

const useBar = () => {
  const barLoading = ref(false);

  const bars = ref([
    {
      label: "本厂员工",
      value: 0,
      percentValue: 0,
      percent: "0%",
      color: "rgb(70,156,232)",
    },
    {
      label: "外协员工",
      value: 0,
      percentValue: 0,
      percent: "0%",
      color: "rgb(76,229,255)",
    },
  ]);

  const getData = async () => {
    barLoading.value = true;
    try {
      setTimeout(() => {
        bars.value[0].value = 500;
        bars.value[0].percentValue = 0.82;
        bars.value[0].percent = "82%";

        bars.value[1].value = 120;
        bars.value[1].percentValue = 0.17;
        bars.value[1].percent = "17%";

        barLoading.value = false;
      }, 500);
    } finally {
      // barLoading.value = false;
    }
  };

  onMounted(() => {
    getData();
  });

  return {
    bars,
    barLoading,
    refresh: getData
  };
};

const usePies = () => {
  const pie1Ref = ref(),
    pie2Ref = ref();

  const commonOption: EChartsOption = {
    color: linearColors,
    tooltip: {
      trigger: "item",
      appendToBody: true,
    },
    legend: {
      top: "middle",
      right: "0",
      type: "scroll",
      orient: "vertical",
      itemWidth: 14,
      itemHeight: 8,
      itemGap: 8,
      icon: "roundRect",
      textStyle: {
        lineHeight: 14,
        color: "rgb(185,201,208)",
        fontSize: 12,
      },
      pageIconSize: 8,
      pageTextStyle: {
        color: "rgb(185,201,208)",
      },
      pageButtonItemGap: 5,
    },
  };

  const pie1Option: EChartsOption = Object.assign({}, commonOption, {
    series: [
      {
        name: "出勤",
        type: "pie",
        radius: ["55%", "80%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        left: "-50%",
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: "40",
        //     fontWeight: "bold",
        //   },
        // },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "工区1" },
          { value: 735, name: "工区2" },
          { value: 580, name: "工区3" },
        ],
      },
    ],
  });

  const pie2Option: EChartsOption = Object.assign({}, commonOption, {
    series: [
      {
        name: "出勤",
        type: "pie",
        radius: ["55%", "80%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        left: "-50%",
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: "40",
        //     fontWeight: "bold",
        //   },
        // },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: 1048,
            name: "工种1",
            // itemStyle: ,
          },
          { value: 735, name: "工种2" },
          { value: 580, name: "工种3" },
        ],
      },
    ],
  });

  const initPie1 = () => {
    const pie1 = echarts.init(pie1Ref.value);
    pie1.setOption(pie1Option);
  };

  const initPie2 = () => {
    const pie2 = echarts.init(pie2Ref.value);
    pie2.setOption(pie2Option);
  };

  onMounted(() => {
    initPie1();
    initPie2();
  });

  return {
    pie1Ref,
    pie2Ref,
  };
};

export default defineComponent({
  setup() {
    const { bars, barLoading } = useBar();
    const { pie1Ref, pie2Ref } = usePies();

    return {
      bars,
      barLoading,
      pie1Ref,
      pie2Ref,
    };
  },
});
</script>

<style lang="scss">
.C4 {
  .app-chart-box {
    padding: 0 0.15rem;
  }
  &__bar {
    $barItemHeight: 0.3rem;
    $barContentHeight: 0.12rem;
    padding-top: 0.1rem;

    .bar-item {
      display: flex;
      height: $barItemHeight;
      align-items: center;
      position: relative;
      font-size: 0.14rem;
      &__label {
        color: rgb(185, 201, 208);
        width: 0.6rem;
        @include text-clamp(1);
      }
      &__head {
        width: 0.5rem;
        @include text-clamp(1);
        text-align: right;
      }
      &__content {
        height: 100%;
        width: 60%;
        padding-left: 0.05rem;
        display: flex;
        align-items: center;
        &__body {
          height: $barContentHeight;
          width: 70%;
          border-radius: 0.02rem;
          transition: all 0.4s ease-in-out;
        }
        &__tail {
          width: 30%;
          text-align: center;
          @include text-clamp(1);
        }
      }
    }
  }
  &__pies {
    display: flex;
    margin-top: 0.1rem;
    .pie-item {
      height: 0.9rem;
      width: 50%;
      .chart-pie {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
