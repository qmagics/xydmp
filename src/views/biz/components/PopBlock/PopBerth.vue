<template>
  <div class="PopFacilities">
    <el-button
      round
      class="pop-block-btn"
      :class="{ 'is--active': panelVisible }"
      @click="panelVisible = !panelVisible"
    >
      船只停靠详情&nbsp;&nbsp;
      <yw-icon name="yw-icon-arrow-up"></yw-icon>
    </el-button>

    <app-panel class="pop-block-panel" v-show="panelVisible" width="3.4rem" height="6rem">
      <!-- 码头 -->
      <template v-if="currentTabValue === 'Matou'">
        <h2 class="text-center">码头停靠船只详情</h2>
        <app-title-line></app-title-line>
        <el-table
          class="table--theme-dark table--linear-border"
          :data="table1.data"
          :height="tableHeight"
          highlightCurrentRow
          @row-click="(row: any) => onRowClick(row, 'Chuanzhi')"
        >
          <el-table-column label="名称" prop="CnName" align="center"></el-table-column>
          <el-table-column label="管理员" prop="ShipManagerName" align="center"></el-table-column>
          <el-table-column label="状态" prop="StatusName" align="center">
            <template #="{ row }">
              <span :class="`color-${table1.getStatusObj(row.Status).type}`">{{ row.StatusName }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 锚点 -->
      <template v-if="currentTabValue === 'Maodi'">
        <h2 class="text-center">锚点停靠船只详情</h2>
        <app-title-line></app-title-line>
        <el-table
          class="table--theme-dark table--linear-border"
          :data="table2.data"
          :height="tableHeight"
          highlightCurrentRow
          @row-click="(row: any) => onRowClick(row, 'Chuanzhi')"
        >
          <el-table-column label="名称" prop="CnName" align="center"></el-table-column>
          <el-table-column label="管理员" prop="ShipManagerName" align="center"></el-table-column>
          <el-table-column label="状态" prop="StatusName" align="center">
            <template #="{ row }">
              <span :class="`color-${table2.getStatusObj(row.Status).type}`">{{ row.StatusName }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 船坞 -->
      <template v-if="currentTabValue === 'Chuanwu'">
        <h2 class="text-center">船坞停靠船只详情</h2>
        <app-title-line></app-title-line>
        <el-table
          class="table--theme-dark table--linear-border"
          :data="table3.data"
          :height="tableHeight"
          highlightCurrentRow
          @row-click="(row: any) => onRowClick(row, 'Chuanzhi')"
        >
          <el-table-column label="名称" prop="CnName" align="center"></el-table-column>
          <el-table-column label="管理员" prop="ShipManagerName" align="center"></el-table-column>
          <el-table-column label="状态" prop="StatusName" align="center">
            <template #="{ row }">
              <span :class="`color-${table3.getStatusObj(row.Status).type}`">{{ row.StatusName }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 开航 -->
      <!-- <template v-if="currentTabValue==='Kaihang'">
        <h2 class="text-center">开航停靠船只详情</h2>
        <app-title-line></app-title-line>
        <el-table class="table--theme-dark" :data="table4.data" :height="tableHeight">
          <el-table-column label="名称" prop="CnName" align="center"></el-table-column>
          <el-table-column label="管理员" prop="ShipManagerName" align="center"></el-table-column>
          <el-table-column label="状态" prop="StatusName" align="center">
            <template #="{ row }">
              <span
                :class="`color-${table4.getStatusObj(row.Status).type}`"
              >{{ row.StatusName }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>-->

      <template #around>
        <app-tabs class="around-tabs" :items="tabItems" v-model="currentTabValue"></app-tabs>
      </template>
    </app-panel>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import AppTabs, { TabItem } from "@/components/AppTabs/index.vue";
import useBerth from "./useBerth";
import { useStore } from "@/store";

export default defineComponent({
  components: {
    AppTabs,
  },
  setup() {
    const store = useStore();

    // 面板是否显示
    const panelVisible = computed<boolean>({
      get() {
        return store.state.PopBlock.panelVisible;
      },
      set(val) {
        store.commit("Set_PopBlock_PanelVisible", val);
      },
    });

    // tabs标签页
    const tabItems = ref<TabItem[]>([
      {
        label: "码头",
        value: "Matou",
      },
      {
        label: "锚点",
        value: "Maodi",
      },
      {
        label: "船坞",
        value: "Chuanwu",
      },
      // {
      //   label: "开航",
      //   value: "Kaihang",
      // },
    ]);

    // 当前标签页
    const currentTabValue = computed<string>({
      get() {
        return store.state.PopBlock.activePanelTab;
      },
      set(val) {
        store.commit("Set_PopBlock_ActivePanelTab", val);
      },
    });

    // 表格高度
    const tableHeight = ref(`calc(100% - 0.56rem)`);

    const { table1, table2, table3, onRowClick } = useBerth();

    return {
      panelVisible,
      tabItems,
      currentTabValue,
      onRowClick,
      table1,
      table2,
      table3,
      // table4,
      tableHeight,
    };
  },
});
</script>

<style lang="scss">
.PopFacilities {
  .around-tabs {
    position: absolute;
    left: -0.3rem;
    top: 50%;
    transform: translateY(-50%);

    &:before {
      content: "";
      width: 0.01rem;
      height: 5rem;
      position: absolute;
      right: -0.01rem;
      background-image: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 1) 50%,
        rgba(255, 255, 255, 0) 100%
      );
    }
  }
  .el-table {
    margin-top: 0.1rem;
  }
}
</style>
