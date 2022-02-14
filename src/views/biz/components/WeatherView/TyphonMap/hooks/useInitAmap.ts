import { useStore } from '@/store';
import { onBeforeUnmount, onMounted, reactive, Ref, ref } from 'vue';
import { loadAMap } from '../utils';
import useRenderTyphon from './useRenderTyphon';

export default (elRef: Ref<HTMLDivElement>) => {
    const store = useStore();
    const { typhonMapCenter, typhonMapZoom } = store.state.WeatherView;

    const mapInstance = ref();
    const readyCbs: Function[] = [];

    /** 加载地图 */
    const initMap = async () => {
        const AMap = await loadAMap();

        // 创建地图实例
        mapInstance.value = new AMap.Map(elRef.value, {
            resizeEnable: true,
            zoom: typhonMapZoom,
            center: typhonMapCenter,
            layers: [
                new AMap.TileLayer(),
                new AMap.TileLayer.Satellite(),
                new AMap.TileLayer.RoadNet()
            ]
        });

        // 触发ready事件
        readyCbs.forEach(fn => fn());
    }

    /** 卸载地图 */
    const destroyMap = () => {
        mapInstance.value && mapInstance.value.destroy();
    }

    /** 渲染台风 */
    const { render: renderTyohon } = useRenderTyphon(mapInstance);

    /** 地图初始化完毕 */
    const onInitReady = (cb: Function) => {
        readyCbs.push(cb);
    };

    onMounted(() => {
        initMap();
    });

    onBeforeUnmount(() => {
        destroyMap();
    });

    return {
        mapInstance,
        renderTyohon,
        onInitReady
    };
}

