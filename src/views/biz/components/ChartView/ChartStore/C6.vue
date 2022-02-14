<template>
  <div class="C6">
    <app-title-box @click="refresh">各码头船速监控</app-title-box>
    <app-chart-box height="1.9rem" v-loading="loading">
      <div class="items">
        <div class="item" v-for="(ship,index) in ships" :key="index">
          <div class="item__title">
            <i>{{index+1}}</i>
            <span>{{ship.Name}}</span>
          </div>
          <app-speed-dashboard class="item__dashboard" :value="ship.Speed"></app-speed-dashboard>
        </div>
      </div>
    </app-chart-box>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted, reactive } from "vue";

interface Ship {
  Name: any;
  Speed: any;
}

export default defineComponent({
  setup() {
    /** 加载中标识 */
    const loading = ref(false);

    /** 数据 */
    const rows = ref<any[]>([]);

    /** 船舶展示列表数据 */
    const ships = ref<Ship[]>(
      Array.from("0".repeat(8)).map((i, index) => {
        return {
          Name: computed(() => {
            const row = rows.value[index];
            return row?.Name || "--";
          }),
          Speed: computed(() => {
            const row = rows.value[index];
            return row?.Speed || 0;
          }),
        };
      })
    );

    /** 获取随机船速（mock） */
    function getRandomSpeed() {
      return Number((Math.random() * 2).toFixed(1));
    }

    /** 获取数据 */
    const getData = async () => {
      loading.value = true;
      try {
        setTimeout(() => {
          rows.value = [
            {
              Name: "中海环球",
              Speed: getRandomSpeed(),
            },
            {
              Name: "麦哲伦",
              Speed: getRandomSpeed(),
            },
            {
              Name: "中海环球",
              Speed: getRandomSpeed(),
            },
            {
              Name: "中海环球",
              Speed: getRandomSpeed(),
            },
            {
              Name: "中海环球",
              Speed: getRandomSpeed(),
            },
            {
              Name: "南海环球",
              Speed: getRandomSpeed(),
            },
            {
              Name: "中海环球",
              Speed: getRandomSpeed(),
            },
            {
              Name: "中海环球",
              Speed: getRandomSpeed(),
            },
          ];
          loading.value = false;
        }, 2000);
      } finally {
        // loading.value = false;
      }
    };

    onMounted(() => {
      getData();
    });

    return {
      loading,
      refresh: getData,
      ships,
    };
  },
});
</script>
<style lang="scss">
.C6 {
  .app-chart-box {
    padding: 0 0.1rem;
    padding-top: 0.14rem;
  }

  .items {
    display: flex;
    flex-flow: row wrap;

    .item {
      display: flex;
      align-items: center;
      flex-direction: column;
      width: 25%;
      margin-bottom: 0.18rem;

      &__title {
        color: rgb(163, 215, 255);
        font-size: 0.12rem;
        height: 0.18rem;
        @include text-clamp(1);
        i {
          font-style: normal;
          height: 0.16rem;
          width: 0.16rem;
          text-align: center;
          border-radius: 50%;
          margin-right: 0.02rem;
          display: inline-block;
          border: 0.014rem solid rgb(163, 215, 255);
        }
      }
      &__dashboard {
        margin-top: 0.02rem;
      }
    }
  }
}
</style>
