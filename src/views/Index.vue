<template>
  <Modal />
  <app-header>
    <topbar></topbar>
  </app-header>
  <app-body>
    <map-3d v-if="couldRender3D"></map-3d>
    <tide-view></tide-view>
    <typhon-map v-if="showTyphoonMap"></typhon-map>
    <router-view></router-view>
    <pop-block></pop-block>
    <chart-view></chart-view>
    <weather-view></weather-view>
    <monitor-view></monitor-view>
  </app-body>
  <app-footer>
    <dashboard></dashboard>
  </app-footer>
</template>

<script lang="ts">
import { defineComponent, computed, provide, ref } from "vue";
import AppHeader from "@/components/AppHeader/index.vue";
import AppBody from "@/components/AppBody/index.vue";
import AppFooter from "@/components/AppFooter/index.vue";
import Topbar from "./biz/components/Topbar/index.vue";
import Map3d from "./biz/components/Map3d/index.vue";
import Dashboard from "./biz/components/Dashboard/index.vue";
import PopBlock from "./biz/components/PopBlock/index.vue";
import ChartView from "./biz/components/ChartView/index.vue";
import WeatherView from "./biz/components/WeatherView/index.vue";
import TyphonMap from './biz/components/WeatherView/TyphonMap/index.vue';
import TideView from './biz/components/TideView/index.vue';
import MonitorView from './biz/components/MonitorView/index.vue';
import { useStore } from "@/store";
import KanbanApi from "@/api/KanbanApi";

export default defineComponent({
  components: {
    AppHeader,
    AppBody,
    AppFooter,
    Topbar,
    Map3d,
    Dashboard,
    PopBlock,
    ChartView,
    WeatherView,
    TyphonMap,
    TideView,
    MonitorView
  },

  setup() {
    const store = useStore();

    const couldRender3D = ref(false);

    KanbanApi.getShipList().then(res => {
      if (res?.bl) {
        couldRender3D.value = true;
      }
    })

    return {
      showTyphoonMap: computed(() => store.state.WeatherView.visible && store.state.WeatherView.typhonMapVisible),
      couldRender3D
    };
  },

  mounted() {
    // import("./common/login/index.vue").then((res) => {
    //   this.$modal({
    //     title: "A",
    //     width: "600px",
    //     height: "300px",
    //     component: res.default,
    //   });
    // });
  },
});
</script>