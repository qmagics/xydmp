import { Ref, onMounted, toRef } from 'vue';
import useConfig from './useConfig';
import useDraw from './useDraw';
import useMeasure from './useMeasure';
import useEvent from './useEvent';
import useFacilities from './useFacilities';
import useNavigation from './useNavigation';
import useSea from './useSea';
import useShips from './useShips';
import { useStore } from '@/store';
import { GlobalShipMode } from '@/store/interface';
import useDispatch from '../dispatch-hooks/useDispatch';

export default (containerId: string) => {
    const store = useStore();

    let viewer: any = null;
    let drawApi: any = null;

    const cbs: Function[] = [];

    const onViewerReady = (cb: Function) => {
        cbs.push(cb);
    }

    const init = () => {

        (window as any).viewer = viewer = new zccity.ZCViewer(containerId, {
            SOONCITY_BASE_URL: '/ZcCitySDK/Cesium',
            sceneModePicker: false,
            navigationHelpButton: false,
            homeButton: false,
            geocoder: false,
            infoBox: false,
            shouldAnimate: true,
            selectionIndicator: false,
            shadows: false,
            animation: false,
            timeline: false,
            vrButton: false,
            fullscreenButton: false,
            skyAtmosphere: false, //关闭地球光环
            imageryProvider: new zccity.ArcGisMapServerImageryProvider({
                url: 'http://yfb.zjtoprs.com:6090/arcgis/rest/services/xinyaImagery/MapServer',
                maximumLevel: 18
            }),
            //terrainProvider : zccity.createWorldTerrain()
        });

        const zccityTool: any = (window as any).zccityTool = new zccityTools(viewer);

        // 罗盘导航
        useNavigation(viewer);

        // 环境配置项
        useConfig(viewer);

        // 海面
        useSea(viewer);

        useEvent(viewer, zccityTool);

        // 设施
        useFacilities(viewer, zccityTool);

        // 绘制
        useDraw(viewer);

        // 测量
        useMeasure(viewer);

        // 初始化场景并转场
        zccityTool.addScene();

        // 船舶
        const { initShips } = useShips();

        // 调度管理
        const { initDispatch } = useDispatch(viewer);

        // 根据船舶模式执行初始化
        const ShipMode = store.state.GlobalShipMode;
        if (ShipMode === GlobalShipMode.REALTIME) {
            initShips();
        }
        else if (ShipMode === GlobalShipMode.DISPATCH) {
            initDispatch();
        }

        // 执行初始化回调
        cbs.forEach(cb => cb());
    }

    onMounted(() => {
        init();
    });

    return {
        viewer,
        onViewerReady,
        init,
    }
}
