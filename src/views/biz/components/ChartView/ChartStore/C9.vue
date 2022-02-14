<template>
  <div class="C9">
    <app-title-box @click="refresh">今日员工出勤情况</app-title-box>
    <app-chart-box height="1.7rem" v-loading="loading">
      <div class="C9__bar">
        <div class="bar-icon">
          <span class="bar-icon__left">
            <yw-icon class="icon-shadow-young" name="yw-icon-a12"></yw-icon>
          </span>
          <span class="bar-icon__right">
            <b>
              {{ vm.StaffCount }}
              <small>人</small>
            </b>
            <span>今日出勤</span>
          </span>
        </div>
        <div class="bar-content">
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
      </div>
      <el-row class="C9__grid" @click="showDetail">
        <el-col :span="6" tag="b">作业出勤</el-col>
        <el-col :span="10" class="text-center">施工队/班组：{{ vm.TeamCount }}个</el-col>
        <el-col :span="8" class="text-right">
          <span class="color-success">{{ vm.AttendanceCount }}</span>
          /{{ vm.PersonCount }}人
        </el-col>
      </el-row>
      <div class="C9__pies">
        <div class="pie-item pie1">
          <div class="chart-pie" ref="pie1Ref"></div>
          <div class="pie-title">
            <b>
              {{ vm.AttendanceUnderRate?.replace('%', '') }}
              <small>%</small>
            </b>
            <span>出勤率</span>
          </div>
          <div class="pie-label">
            <div class="pie-label__item">
              <span class="color-success">{{ vm.AttendanceAboardCount }}</span>
              / {{ vm.AboardCount }}&nbsp;人
            </div>
            <div class="pie-label__item">
              <span class="color-success">{{ vm.AttendanceUnderCount }}</span>
              / {{ vm.UnderCount }}&nbsp;人
            </div>
          </div>
        </div>
      </div>
    </app-chart-box>
  </div>
  <el-dialog custom-class="blur-dialog C9_1-dialog" v-model="showDlg" append-to-body width="10rem">
    <C9_1 @close="showDlg = false"></C9_1>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, computed, onMounted, reactive, watch } from "vue";
import echarts, { EChartsOption } from "@/plugins/echarts";
import linearColors from "@/plugins/echarts/linearColors";
import KanbanApi from "@/api/KanbanApi";
import C9_1 from "./C9_1.vue";

const useBar = (vm: Ref<Record<string, any>>) => {
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

  watch(vm, (vm) => {
    bars.value[0].value = vm.FactoryStaff;
    bars.value[0].percentValue = parseFloat(vm.FactoryStaff) * 100;
    bars.value[0].percent = vm.FactoryStaffRate;

    bars.value[1].value = vm.AssociateStaff;
    bars.value[1].percentValue = parseFloat(vm.AssociateStaff) * 100;
    bars.value[1].percent = vm.AssociateStaffRate;
  }, { deep: true });

  return {
    bars,
    barLoading,
  };
};

const usePies = (vm: Ref<Record<string, any>>) => {
  const pie1Ref = ref();
  let pie1: any = null;

  const commonOption: EChartsOption = {
    color: linearColors,
    tooltip: {
      trigger: "item",
      appendToBody: true,
    },
    legend: {
      top: "middle",
      left: "0",
      // type: "scroll",
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
        radius: ["65%", "90%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        right: "-50%",
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
          { value: 0, name: "船上员工" },
          { value: 0, name: "船下员工" },
        ],
      },
    ],
  });

  watch(vm, vm => {
    const series0Data = (pie1Option as any).series[0].data;

    series0Data[0].value = vm.AboardCount;
    series0Data[1].value = vm.UnderCount;

    pie1.setOption(pie1Option);
  }, { deep: true });

  const initPie1 = () => {
    pie1 = echarts.init(pie1Ref.value);
    pie1.setOption(pie1Option);
  };

  onMounted(() => {
    initPie1();
  });

  return {
    pie1Ref,
  };
};

export default defineComponent({
  components: {
    C9_1
  },
  setup() {
    const loading = ref(false);
    const vm = ref<any>({});

    const getData = async () => {
      try {
        loading.value = true;
        const { data } = await KanbanApi.getEmployeeAttendance();
        vm.value = data.rows[0];
      } finally {
        loading.value = false;
      }
    }

    const { bars } = useBar(vm);
    const { pie1Ref } = usePies(vm);


    // dlg
    const showDlg = ref(false);
    const showDetail = () => {
      showDlg.value = true;
    }

    onMounted(() => {
      getData();
    });

    return {
      bars,
      loading,
      pie1Ref,
      vm,
      refresh: getData,
      showDlg,
      showDetail
    };
  },

  // methods: {
  //   showDetail(this: { $modal: (p: any) => void }) {
  //     import("./C9_1.vue").then((res) => {
  //       const d = this.$modal({
  //         width: "90%",
  //         height: "90%",
  //         showClose: false,
  //         component: res.default,
  //         data: {

  //         },
  //         actions: {
  //           close() {
  //             // d.close();
  //           }
  //         }
  //       });
  //     });
  //   }
  // }
});
</script>

<style lang="scss">
.C9 {
  $bg: rgb(24, 51, 85);
  .app-chart-box {
    padding: 0 0.15rem;
  }
  &__bar {
    $barItemHeight: 0.2rem;
    $barContentHeight: 0.11rem;
    padding-top: 0.1rem;
    display: flex;

    .bar-icon {
      width: 1rem;
      height: 0.4rem;
      background: $bg;
      border-radius: 0.04rem;
      display: flex;
      align-items: center;
      justify-content: center;

      &__left {
        .yw-icon {
          color: rgb(11, 211, 154);
          font-size: 0.24rem;
        }
      }
      &__right {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 0.1rem;

        b {
          font-size: 0.17rem;
          small {
            font-size: 60%;
            font-weight: normal;
          }
        }
        span {
          font-size: 80%;
        }
      }
    }

    .bar-content {
      flex: 1;
      padding-left: 0.1rem;
      .bar-item {
        display: flex;
        height: $barItemHeight;
        align-items: center;
        position: relative;
        font-size: 0.12rem;
        &__label {
          color: rgb(185, 201, 208);
          width: 0.6rem;
          @include text-clamp(1);
        }
        &__head {
          width: 0.5rem;
          @include text-clamp(1);
          position: absolute;
          left: 0.6rem;
          top: 50%;
          transform: translate3d(0, -50%, 0);
        }
        &__content {
          height: 100%;
          width: 70%;
          padding-left: 0.05rem;
          display: flex;
          align-items: center;
          &__body {
            height: $barContentHeight;
            width: 60%;
            border-radius: 0.02rem;
            transition: all 0.4s ease-in-out;
          }
          &__tail {
            width: 50%;
            text-align: center;
            @include text-clamp(1);
            transform: translateX(30%);
          }
        }
      }
    }
  }
  &__grid {
    margin-top: 0.1rem;
    padding: 0 0.1rem;
    height: 0.22rem;
    line-height: 0.22rem;
    background: $bg;
    border-radius: 0.02rem;
    font-size: 0.12rem;
    cursor: pointer;
  }

  &__pies {
    display: flex;
    margin-top: 0.1rem;
    .pie-item {
      height: 0.78rem;
      width: 100%;
      position: relative;
      .chart-pie {
        float: right;
        width: 60%;
        height: 100%;
        // background: rgba(255, 0, 0, 0.315);
      }
      .pie-title {
        position: absolute;
        right: 0.28rem;
        top: 50%;
        transform: translate3d(0, -50%, 0);
        z-index: 1;
        display: flex;
        flex-direction: column;
        width: 0.48rem;
        text-align: center;
        line-height: 1;
        border-radius: 0.12rem;

        b {
          font-size: 0.16rem;
          small {
            font-weight: normal;
          }
        }

        span {
          font-size: 0.12rem;
        }
      }
      .pie-label {
        position: absolute;
        left: 0%;
        top: 50%;
        padding-left: 0.1rem;
        transform: translate3d(0, -50%, 0);
        width: 1rem;
        text-align: right;
        &__item {
          height: 0.22rem;
          line-height: 0.22rem;
          transform: translate3d(0, 0, 0);
          // background: rgba(255, 0, 0, 0.274);
          // border-bottom: 1px solid red;
        }
      }
    }
  }
}
</style>
