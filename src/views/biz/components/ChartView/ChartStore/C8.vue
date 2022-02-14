<template>
  <div class="C8">
    <app-title-box>
      每日能耗情况统计
      <template #right>
        <div class="querybox">
          <span class="label">年份：</span>
          <!-- <el-select
            class="select--theme-dark"
            size="minii"
            style="width:.7rem"
            v-model="query.Years"
            @change="refresh"
          >
            <el-option v-for="i in yearList" :key="i" :label="i" :value="i"></el-option>
          </el-select>-->
          <el-date-picker
            class="date-picker--theme-dark date-picker--hide-prefix"
            style="width:.8rem"
            type="month"
            size="minii"
            v-model="query.Years"
            @change="refresh"
          ></el-date-picker>
        </div>
      </template>
    </app-title-box>
    <app-chart-box height="1.6rem" v-loading="lineLoading">
      <app-switchs :items="tabs" v-model="query.EnergyType" @change="refresh"></app-switchs>
      <div class="chart-line" ref="lineRef"></div>
    </app-chart-box>
  </div>
</template>
<script lang="ts">
import KanbanApi from "@/api/KanbanApi";
import useChartResize from "@/hooks/useChartResize";
import echarts, { EChartsOption } from "@/plugins/echarts";
import { linearColorReverse } from "@/plugins/echarts/linearColors";
import { defineComponent, ref, onMounted, computed, reactive } from "vue";

const useLine = () => {
  const lineLoading = ref(false);
  const lineRef = ref();
  let line: any = null;

  const lineOptions: EChartsOption = {
    tooltip: {
      trigger:"axis",
      appendToBody: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [],
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          width: 2,
          color: "90,111,133",
        },
      },
      axisLabel: {
        color: "rgb(168,174,189)",
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          color: "rgb(255,255,255,.1)",
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          width: 2,
          color: "90,111,133",
        },
      },
      axisLabel: {
        color: "rgb(168,174,189)",
      },
    },
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "10%",
      containLabel: true,
    },
    series: [
      {
        data: [],
        type: "line",
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: linearColorReverse[0],
        },
        lineStyle: {
          width: 2,
        },
        areaStyle: {},
      },
    ],
  };

  const initLine = () => {
    line = echarts.init(lineRef.value);
    line.setOption(lineOptions);
    useChartResize(line);
  };

  const refreshLine = (lineData: any) => {
    if (lineData && lineData[0]) {
      const { DailyList } = lineData[0];

      const xAxisData: any[] = [],
        seriesData: any[] = [];

      DailyList.forEach((d: any) => {
        xAxisData.push(d.day);
        seriesData.push(d.Record);
        // seriesData.push(Math.random() * 100);
      });

      (lineOptions.xAxis as any).data = xAxisData;
      (lineOptions.series as any)[0].data = seriesData;

      line.setOption(lineOptions);
    }
  };

  onMounted(() => {
    initLine();
  });

  return {
    lineLoading,
    lineRef,
    line,
    refreshLine,
  };
};

export default defineComponent({
  setup() {
    const yearList = ref<string[]>(
      Array.from("0".repeat(3)).map((i, index) =>
        String(new Date().getFullYear() + index - 1)
      )
    );

    const query = reactive({
        Years: new Date().stringify(),
      EnergyType: 1,
    });

    const tabs = ref([
      {
        label: "电力",
        value: 1,
      },
      {
        label: "氧气",
        value: 2,
      },
      {
        label: "天然气",
        value: 3,
      },
      {
        label: "二氧化碳",
        value: 4,
      },
      {
        label: "柴油",
        value: 5,
      },
      {
        label: "水",
        value: 6,
      },
    ]);

    const { lineRef, lineLoading, refreshLine } = useLine();

    const getLineData = async () => {
      lineLoading.value = true;
      try {
        const { data } = await KanbanApi.getDailyEnergyConsumption(query);
        refreshLine(data.rows);
      } finally {
        lineLoading.value = false;
      }
    };

    onMounted(() => {
      getLineData();
    });

    return {
      tabs,
      query,
      yearList,
      lineRef,
      lineLoading,
      refresh: getLineData,
    };
  },
});
</script>

<style lang="scss">
.C8 {
  .querybox {
    margin-right: 0.1rem;
    .label {
      color: rgb(172, 176, 182);
      font-size: 0.12rem;
    }
  }

  .app-chart-box {
    padding: 0 0.15rem;
  }

  .chart-line {
    height: 1.36rem;
  }
}
</style>
