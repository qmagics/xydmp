<template>
  <div class="C5">
    <app-title-box>
      当前船只停靠情况
      <template #right>
        <app-switchs
          v-model="query.Category"
          :items="[ {label:'鑫亚',value:1},{label:'亚泰',value:2} ]"
          @change="refresh"
        ></app-switchs>
      </template>
    </app-title-box>
    <app-chart-box height="1.5rem" v-loading="loading">
      <app-corner-box v-for="i in list" :key="i.label">
        <div class="item">
          <div class="item__icon">
            <yw-icon :name="i.icon"></yw-icon>
          </div>
          <div class="item__label color-young">{{i.label}}：</div>
          <div class="item__group">
            <div class="item__group__label color-success">{{i.group1.label}}：</div>
            <div class="item__group__value">{{i.group1.value}}艘</div>
          </div>
          <div class="item__group">
            <div class="item__group__label color-orange">{{i.group2.label}}：</div>
            <div class="item__group__value">{{i.group2.value}}艘</div>
          </div>
        </div>
      </app-corner-box>
    </app-chart-box>
  </div>
</template>
<script lang="ts">
import KanbanApi from "@/api/KanbanApi";
import { computed, defineComponent, onMounted, reactive, ref } from "vue";

export default defineComponent({
  setup() {
    const loading = ref(false);

    const query = reactive({
      Category: 1,
    });

    const vm = ref<any>({});

    const list = ref([
      {
        label: "码头",
        icon: "yw-icon-a3",
        group1: {
          label: "有动力",
          value: computed(() => {
            return vm.value.PowerDockCount || 0;
          }),
        },
        group2: {
          label: "无动力",
          value: computed(() => {
            return vm.value.NoPowerDockCount || 0;
          }),
        },
      },
      {
        label: "船坞",
        icon: "yw-icon-a2",
        group1: {
          label: "有动力",
          value: computed(() => {
            return vm.value.PowerWharfCount || 0;
          }),
        },
        group2: {
          label: "无动力",
          value: computed(() => {
            return vm.value.NoPowerWharfCount || 0;
          }),
        },
      },
      {
        label: "锚地",
        icon: "yw-icon-a1",
        group1: {
          label: "有动力",
          value: computed(() => {
            return vm.value.PowerAnchorageCount || 0;
          }),
        },
        group2: {
          label: "无动力",
          value: computed(() => {
            return vm.value.NoPowerAnchorageCount || 0;
          }),
        },
      },
    ]);

    const getData = async () => {
      loading.value = true;

      try {
        const { data } = await KanbanApi.getShipDockingStatus(query);
        vm.value = data.rows[0] || {};
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      getData();
    });

    return {
      query,
      list,
      loading,
      refresh: getData,
    };
  },
});
</script>

<style lang="scss">
.C5 {
  .app-chart-box {
    padding: 0 0.15rem;
    padding-top: 0.15rem;
  }
  .app-corner-box {
    margin-bottom: 0.1rem;
  }
  .item {
    display: flex;
    align-items: center;
    padding: 0 0.1rem;
    line-height: 1.2;

    &__icon {
      color: #71b1ff;
      font-size: 0.16rem;
      width: 0.2rem;
      text-align: center;
    }

    &__label {
      padding-left: 0.1rem;
      width: 0.64rem;
      @include text-clamp(1);
    }

    &__group {
      display: flex;
      align-items: center;
      padding-right: 0.1rem;
      width: 1.2rem;
      &__label {
      }
      &__value {
        color: rgb(202, 219, 224);
        @include text-clamp(1);
      }
    }
  }
}
</style>
