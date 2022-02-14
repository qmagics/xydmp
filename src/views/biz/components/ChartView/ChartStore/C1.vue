<template>
  <div class="C1">
    <app-title-box @click="refresh">项目情况总览</app-title-box>
    <app-chart-box height="1.2rem" v-loading="loading">
      <div class="C1__title">
        <span>{{titleText}}</span>
        <b>{{vm.total}}</b>
      </div>
      <div class="C1__content">
        <div class="item">
          <div class="item__left">
            <svg>
              <use xlink:href="#light-base" />
            </svg>
            <yw-icon name="yw-icon-a10" class="icon-shadow-yellow"></yw-icon>
          </div>
          <div class="item__right">
            <b>{{vm.item1Count}}</b>
            <span class="color-yellow">{{vm.item1Status}}</span>
          </div>
        </div>
        <div class="item">
          <div class="item__left">
            <svg>
              <use xlink:href="#light-base" />
            </svg>
            <yw-icon name="yw-icon-a9" class="icon-shadow-green"></yw-icon>
          </div>
          <div class="item__right">
            <b>{{vm.item2Count}}</b>
            <span class="color-success">{{vm.item2Status}}</span>
          </div>
        </div>
      </div>
    </app-chart-box>
  </div>
</template>
<script lang="ts">
import KanbanApi from "@/api/KanbanApi";
import { computed, defineComponent, onMounted, reactive, ref } from "vue";

export default defineComponent({
  setup() {
    const loading = ref(false);
    const currentYear = new Date().format("yyyy");
    const titleText = computed(() => {
      return `${currentYear}年度修船总数`;
    });

    const vm = reactive({
      total: 200,
      item1Count: 0,
      item1Status: "",
      item2Count: 0,
      item2Status: "",
    });

    /** 获取图表数据方法 */
    const getData = async () => {
      if (loading.value) return;

      loading.value = true;
      try {
        const { data } = await KanbanApi.getProjectOverview();
        const [r1, r2, r3] = data.rows;
        vm.total = r1.TotalCount;
        vm.item1Count = r2.RepairCount;
        vm.item1Status = r2.Status;
        vm.item2Count = r3.CompletedCount;
        vm.item2Status = r3.Status;
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      getData();
    });

    return {
      titleText,
      vm,
      loading,
      refresh: getData,
    };
  },
});
</script>

<style lang="scss" scoped>
.C1 {
  &__title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.17rem;
    line-height: 0;
    height: 0.3rem;
    padding-top: 0.1rem;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: 0.01rem;
    b {
      color: $colorPrimaryLight;
      font-size: 120%;
      margin-left: 0.05rem;
    }
  }
  &__content {
    display: flex;
    margin-top: 0.2rem;
    .item {
      display: flex;
      width: 50%;
      padding: 0 5%;
      &__left {
        display: flex;
        position: relative;
        width: 60%;
        svg {
          height: 0.5rem;
        }
        .yw-icon {
          font-size: 0.28rem;
          position: absolute;
          top: 0.05rem;
          left: 50%;
          transform: translate3d(-50%, 0, 0);
        }
      }
      &__right {
        width: 40%;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 0.14rem;
        justify-content: center;
        b {
          font-size: 145%;
        }
        span {
        }
      }
    }
  }
}
</style>
