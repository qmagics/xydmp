<template>
  <div
    :class="[
      'map-3d',
      {
        'is--hide-3d': isHide3d
      }
    ]"
    :style="{
      background: `${isMock ? `url(${mockBg})` : ''}`
    }"
  >
    <div class="map-main" id="mapMain" ref="mapRef"></div>
    <!-- <pre style="position: fixed;left:200px;top:200px;background:red;width:200px;height:400px;">{{CurrentShip}}</pre> -->

    <template v-if="d3MapReady">
      <!--船舶工具栏-->
      <ship-toolbar
        :visible="shipToolbar_Visible"
        :d3-position="shipToolbar_D3Position"
        panel-width="4.4rem"
        panel-height="2.2rem"
      >
        <template #panel>
          <ship-detail-panel :ship="CurrentShip"></ship-detail-panel>
        </template>
      </ship-toolbar>

      <!--船舶通用信息面板-->
      <ship-info-panel :ship="CurrentShip"></ship-info-panel>
    </template>
  </div>
  <div id="smallMap" class="small-map"></div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted } from "vue";
import useInitMap from "./hooks/useInitMap";
import mockBg from "@/assets/map-3d.png";
import ShipToolbar from './components/ShipToolbar.vue';
import ShipDetailPanel from './components/ShipDetailPanel.vue';
import ShipInfoPanel from './components/ShipInfoPanel.vue';
import { useStore } from '@/store';
import { Ship } from "./types";
import useSmallMap from "./hooks/useSmallMap";

export default defineComponent({
  components: {
    ShipToolbar,
    ShipDetailPanel,
    ShipInfoPanel
  },
  setup(props, { expose }) {
    const isMock = ref(false && process.env.NODE_ENV === 'development');
    const store = useStore();
    const d3MapReady = ref(false);

    if (!isMock.value) {
      const { onViewerReady } = useInitMap("mapMain");
      onViewerReady(() => {
        d3MapReady.value = true;
      });
    }

    onMounted(() => {
      useSmallMap();
    });

    const isHide3d = computed(() => store.state.WeatherView.typhonMapVisible);

    return {
      isMock,
      mockBg,
      CurrentShip: computed(() => store.state.CurrentShip as Ship),
      shipToolbar_Visible: computed(() => store.state.ShipToolbar.visible),
      shipToolbar_D3Position: computed(() => store.state.ShipToolbar.d3Position),
      d3MapReady,
      isHide3d
    };
  },
});
</script>

<style lang="scss">
@import "./map-3d.scss";
</style>