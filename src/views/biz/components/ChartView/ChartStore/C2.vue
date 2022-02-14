<template>
  <div class="C2">
    <app-title-box @click="refresh">厂区设备数量统计</app-title-box>
    <app-chart-box height="1.4rem" v-loading="loading">
      <el-row class="chart-box-row" :gutter="15">
        <el-col :span="12" v-for="(item, index) in items" :key="index" @click="onItemClick(item)">
          <div class="item">
            <div class="item__icon">
              <!-- <yw-icon :name="item.icon"></yw-icon> -->
              <yw-icon name="yw-icon-a4"></yw-icon>
            </div>
            <div class="item__content">
              <span>{{ item?.data?.Name }}</span>
              <b>{{ item?.data?.UsedCount || 0 }}</b>
            </div>
          </div>
        </el-col>
      </el-row>
    </app-chart-box>
  </div>
  <el-dialog custom-class="blur-dialog C2_1-dialog" v-model="showDlg" append-to-body width="6rem">
    <C2_1 :current-tab="currentTab" :list="list" @close="showDlg = false"></C2_1>
  </el-dialog>
</template>
<script lang="ts">
import KanbanApi from "@/api/KanbanApi";
import { defineComponent, ref, computed, onMounted, reactive, getCurrentInstance, ComputedRef } from "vue";
import C2_1 from "./C2_1.vue";

export interface Item {
  Name: string;
  UsedCount: number;
  EquipDetailList: any[];
  Id: string;
}

export default defineComponent({
  components: {
    C2_1
  },
  setup() {
    const loading = ref(false);
    const list = ref<Item[]>([]);

    // const items = reactive<{ icon: string, value: number, data?: Item }[]>([
    //   {
    //     icon: "yw-icon-a8",
    //     value: 0,
    //     data: undefined
    //   },
    //   {
    //     icon: "yw-icon-a7",
    //     value: 1,
    //     data: undefined
    //   },
    //   {
    //     icon: "yw-icon-a6",
    //     value: 2,
    //     data: undefined
    //   },
    //   {
    //     icon: "yw-icon-a5",
    //     value: 3,
    //     data: undefined
    //   },
    //   {
    //     icon: "yw-icon-a4",
    //     value: 4,
    //     data: undefined
    //   },
    //   {
    //     icon: "yw-icon-a11",
    //     value: 5,
    //     data: undefined
    //   },
    // ]);

    /** 获取图表数据方法 */
    const getData = async () => {
      if (loading.value) return;

      loading.value = true;
      try {
        const { data } = await KanbanApi.getMainEquipmentDistribution();
        list.value = data.rows;

      } finally {
        loading.value = false;
      }
    };

    const items = computed(() => {
      return list.value.slice(0, 6).map(i => {
        return {
          icon: "",
          value: i.Id,
          data: i
        }
      });
    });

    const showDlg = ref(false);
    const currentTab = ref();

    const onItemClick = (item: any) => {
      currentTab.value = item.value;
      showDlg.value = true;
    }

    onMounted(() => {
      getData();
    });

    return {
      items,
      loading,
      refresh: getData,
      list,
      showDlg,
      currentTab,
      onItemClick
    };
  },

  // methods: {
  //   onItemClick(item: any) {
  //     import("./C2_1.vue").then((res) => {
  //       this.$modal({
  //         title: "A",
  //         width: "600px",
  //         height: "600px",
  //         component: res.default,
  //         data: {
  //           currentTab: item.value,
  //           list: this.list
  //         }
  //       });
  //     });
  //   }
  // }
});
</script>

<style lang="scss">
$iconboxSize: 0.3rem;
.C2 {
  .app-chart-box {
    display: flex;
    flex-flow: row wrap;
    padding: 0 0.15rem;
    .chart-box-row {
      padding-top: 0.15rem;
    }
    .item {
      display: flex;
      height: $iconboxSize;
      align-items: center;
      background: rgba(13, 35, 51, 0.5);
      cursor: pointer;
      transition: all 0.1s ease;
      &:hover {
        background: rgba(30, 52, 68, 0.7);
      }
      &__icon {
        $color: rgb(125, 220, 255);
        $cornerSize: 0.03rem;

        width: $iconboxSize;
        height: $iconboxSize;
        text-align: center;
        flex: none;
        position: relative;

        .yw-icon {
          color: rgb(125, 220, 255);
          font-size: 0.18rem;
          line-height: $iconboxSize;
        }

        &:before,
        &:after {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }

        &:before {
          border: 0.01rem solid rgba($color, 0.7);
        }
        &:after {
          background-image: linear-gradient(
              45deg,
              $color 0,
              $color $cornerSize,
              transparent $cornerSize,
              transparent 100%
            ),
            linear-gradient(
              -45deg,
              $color 0,
              $color $cornerSize,
              transparent $cornerSize,
              transparent 100%
            ),
            linear-gradient(
              135deg,
              $color 0,
              $color $cornerSize,
              transparent $cornerSize,
              transparent 100%
            ),
            linear-gradient(
              -135deg,
              $color 0,
              $color $cornerSize,
              transparent $cornerSize,
              transparent 100%
            );
        }
      }
      &__content {
        flex: 1;
        height: $iconboxSize;
        padding: 0 0.1rem;
        color: rgb(185, 201, 208);
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        span {
          @include text-clamp(1);
          flex: 1;
        }
        b {
          @include text-clamp(1);
          flex: none;
          color: $colorSuccess;
          font-weight: normal;
          font-size: 0.15rem;
        }
      }
    }
  }
}
</style>
