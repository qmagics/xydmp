<template>
  <div class="PopFacilities">
    <el-button
      round
      class="pop-block-btn"
      :class="{ 'is--active': panelVisible }"
      @click="panelVisible = !panelVisible"
    >
      设施清单列表&nbsp;&nbsp;
      <yw-icon name="yw-icon-arrow-up"></yw-icon>
    </el-button>

    <app-panel class="pop-block-panel" v-show="panelVisible" width="3.4rem" height="6rem">
      <!-- 厂房 -->
      <template v-if="currentTabValue === 'Changfang'">
        <h2 class="text-center">厂房列表清单</h2>
        <app-title-line></app-title-line>
        <el-table
          class="table--theme-dark table--linear-border"
          :data="table1.data"
          :height="tableHeight"
          @row-click="(row:any)=>onRowClick(row,'Changfang')"
        >
          <el-table-column label="名称" prop="Name" align="center"></el-table-column>
          <el-table-column label="类型" prop="Category" align="center">
            <template #="{ row }">
              {{
                ({
                  '3': '车间',
                  '2': '办公楼',
                  '3': '其它'
                } as any)[row.Category]
              }}
            </template>
          </el-table-column>
          <!--<el-table-column label="状态" prop="CurrentStatusName" align="center">
            <template #="scope">
              <span
                :class="`color-${table1.getStatusObj(scope.row.CurrentStatus).type}`"
              >{{ scope.row.CurrentStatusName }}</span>
            </template>
          </el-table-column>-->
        </el-table>
      </template>

      <!-- 码头 -->
      <template v-if="currentTabValue === 'Matou'">
        <h2 class="text-center">码头列表清单</h2>
        <app-title-line></app-title-line>
        <el-table
          class="table--theme-dark table--linear-border"
          :data="table2.data"
          :height="tableHeight"
          @row-click="(row:any)=>onRowClick(row,'Matou')"
        >
          <el-table-column label="名称" prop="Name" align="center"></el-table-column>
          <el-table-column label="船只数" prop="ShipCount" align="center"></el-table-column>
          <!--<el-table-column label="状态" prop="CurrentStatusName" align="center">
            <template #="scope">
              <span
                :class="`color-${table2.getStatusObj(scope.row.CurrentStatus).type}`"
              >{{ scope.row.CurrentStatusName }}</span>
            </template>
          </el-table-column>-->
        </el-table>
      </template>

      <!-- 船坞 -->
      <template v-if="currentTabValue === 'Chuanwu'">
        <h2 class="text-center">船坞列表清单</h2>
        <app-title-line></app-title-line>
        <el-table
          class="table--theme-dark table--linear-border"
          :data="table3.data"
          :height="tableHeight"
          @row-click="(row:any)=>onRowClick(row,'Chuanwu')"
        >
          <el-table-column label="名称" prop="Name" align="center"></el-table-column>
          <el-table-column label="船只数" prop="ShipCount" align="center"></el-table-column>
          <el-table-column label="状态" prop="CurrentStatusName" align="center">
            <template #="scope">
              <span
                :class="`color-${table3.getStatusObj(scope.row.CurrentStatus).type}`"
              >{{ scope.row.CurrentStatusName }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 船只 -->
      <template v-if="currentTabValue === 'Chuanzhi'">
        <h2 class="text-center">船只列表清单</h2>
        <app-title-line></app-title-line>
        <el-table
          class="table--theme-dark table--linear-border"
          :data="table4.data"
          :height="tableHeight"
          @row-click="(row:any)=>onRowClick(row,'Chuanzhi')"
        >
          <el-table-column label="名称" prop="CnName" align="center"></el-table-column>
          <el-table-column label="管理员" prop="ShipManagerName" align="center"></el-table-column>
          <el-table-column label="状态" prop="StatusName" align="center">
            <template #="scope">
              <span
                :class="`color-${table4.getStatusObj(scope.row.Status).type}`"
              >{{ scope.row.StatusName }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 锚地 -->
      <template v-if="currentTabValue === 'Maodi'">
        <h2 class="text-center">锚地列表清单</h2>
        <app-title-line></app-title-line>
        <el-table
          class="table--theme-dark table--linear-border"
          :data="table5.data"
          :height="tableHeight"
          @row-click="(row:any)=>onRowClick(row,'Maodi')"
        >
          <el-table-column label="名称" prop="Name" align="center"></el-table-column>
          <el-table-column label="船只数" prop="ShipCount" align="center"></el-table-column>
        </el-table>
      </template>

      <!-- 设备 -->
      <template v-if="currentTabValue === 'Shebei'">
        <h2 class="text-center">设备列表清单</h2>
        <app-title-line></app-title-line>
        <el-table
          class="table--theme-dark table--linear-border"
          :data="table6.data"
          :height="tableHeight"
          @row-click="(row:any)=>onRowClick(row,'Shebei')"
        >
          <el-table-column label="名称" prop="Name" align="center"></el-table-column>
          <!-- <el-table-column label="船只数" prop="ShipCount" align="center"></el-table-column> -->
          <el-table-column label="状态" prop="CurrentStatusName" align="center">
            <template #="scope">
              <span
                :class="`color-${table6.getStatusObj(scope.row.CurrentStatus).type}`"
              >{{ scope.row.CurrentStatusName }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 监控 -->
      <template v-if="currentTabValue === 'Jiankong'">
        <h2 class="text-center">监控列表清单</h2>
        <app-title-line></app-title-line>
        <el-table
          class="table--theme-dark table--linear-border"
          :data="table7.data"
          :height="tableHeight"
          @row-click="(row:any)=>onRowClick(row,'Jiankong')"
        >
          <el-table-column label="名称" prop="Name" align="center"></el-table-column>
          <!-- <el-table-column label="状态" prop="CurrentStatusName" align="center">
            <template #="scope">
              <span
                :class="`color-${table7.getStatusObj(scope.row.CurrentStatus).type}`"
              >{{ scope.row.CurrentStatusName }}</span>
            </template>
          </el-table-column> -->
        </el-table>
      </template>

      <template #around>
        <app-tabs class="around-tabs" :items="tabItems" v-model="currentTabValue"></app-tabs>
      </template>
    </app-panel>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import AppTabs, { TabItem } from "@/components/AppTabs/index.vue";
import usePopFacilities from "./usePopFacilities";
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
        label: "厂房",
        value: "Changfang",
      },
      {
        label: "码头",
        value: "Matou",
      },
      {
        label: "船坞",
        value: "Chuanwu",
      },
      {
        label: "船只",
        value: "Chuanzhi",
      },
      {
        label: "锚地",
        value: "Maodi",
      },
      {
        label: "设备",
        value: "Shebei",
      },
      {
        label: "监控",
        value: "Jiankong",
      },
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

    const { 
      onRowClick,
      table1,
      table2,
      table3,
      table4,
      table5,
      table6,
      table7, } = usePopFacilities();

    return {
      panelVisible,
      tabItems,
      currentTabValue,
      onRowClick,
      table1,
      table2,
      table3,
      table4,
      table5,
      table6,
      table7,
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
