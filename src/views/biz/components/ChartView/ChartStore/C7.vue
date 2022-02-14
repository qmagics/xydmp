<template>
  <div class="C7">
    <app-title-box @click="refresh">
      每日重大安全风险管控
      <!-- <template #right>
        <app-switchs
          :items="[{ label: '全厂', value: 1 }, { label: '船舶', value: 2 }]"
          v-model="query.SourceType"
          @change="refresh"
        ></app-switchs>
      </template>-->
    </app-title-box>
    <app-chart-box height="1.5rem" v-loading="loading">
      <el-table
        class="table--theme-dark table--linear-border"
        :data="rows"
        height="100%"
        :show-header="true"
        tooltip-effect="dark"
        size="mini"
        :stripe="false"
        @row-click="onRowClick"
      >
        <el-table-column label="风险类型" prop="TypeName" show-overflow-tooltip :width="80"></el-table-column>
        <el-table-column label="船名" prop="ShipName" show-overflow-tooltip :width="100"></el-table-column>
        <el-table-column label="标题" prop="Title" show-overflow-tooltip></el-table-column>
      </el-table>
    </app-chart-box>
  </div>

  <el-dialog custom-class="blur-dialog C7_1-dialog" v-model="showDlg" append-to-body width="7rem">
    <C7_1 :item="currentRow" @close="showDlg = false"></C7_1>
  </el-dialog>
</template>
<script lang="ts">
import KanbanApi from "@/api/KanbanApi";
import { defineComponent, ref, reactive, computed, onMounted } from "vue";
import C7_1 from './C7_1.vue';

export default defineComponent({
  components: {
    C7_1
  },
  setup() {
    const loading = ref(false);
    const query = reactive({
      SourceType: 2,
    });

    const rows = ref<any[]>([]);

    const getData = async () => {
      loading.value = true;
      try {
        const { data } = await KanbanApi.getDailySafetyRiskFirst(query);
        rows.value = data.rows;
      } finally {
        loading.value = false;
      }
    };

    const showDlg = ref(false);

    const currentRow = ref();

    const onRowClick = (row: any) => {
      currentRow.value = JSON.parse(JSON.stringify(row));
      showDlg.value = true;
    }

    onMounted(() => {
      getData();
    });

    return {
      currentRow,
      showDlg,
      onRowClick,
      query,
      loading,
      rows,
      refresh: getData,
    };
  },
});
</script>

<style lang="scss">
.C7 {
  .app-chart-box {
    padding: 0 0.15rem;
  }

  .text-date {
    color: rgb(59, 166, 255);
  }

  .el-table {
    tr {
      cursor: pointer;
    }
  }
}

.C7_1-dialog {
}
</style>
