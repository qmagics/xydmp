import KanbanApi from "@/api/KanbanApi";
import { useStore } from "@/store";
import { ActionType } from "@/store/ActionType";
import { computed, onBeforeMount, onUnmounted, watch } from "vue";
import { Ship, ShipMap } from "../types";
import useRenderShips from "./useRenderShips";
import settings from '@/settings';
import { GlobalShipMode } from "@/store/interface";

export default () => {
    const store = useStore();
    let firstRender = true;

    const { render3dShips, removeShips } = useRenderShips();

    // 船只显示模式
    const ShipMode = computed(() => store.state.GlobalShipMode);

    // 监听模式变化，执行船舶刷新和自动刷新
    watch(ShipMode, val => {
        if (val === GlobalShipMode.REALTIME) {
            initShips();
            startTick();
        }
        else if (val === GlobalShipMode.DISPATCH) {
            removeShips();
            stopTick();
        }
    })

    /** 刷新船舶仓库 */
    const refreshShipStore = async () => {
        const res = await KanbanApi.getShipList();

        const list = res.data.rows;

        const map = list.reduce((memo, cur) => {
            if (cur.ShipRepairProjectId) {
                memo[cur.ShipRepairProjectId] = cur;
            }
            return memo as Record<string, Ship>;
        }, {} as ShipMap);

        store.commit(ActionType.SET_SHIP_LIST, list);
        store.commit(ActionType.SET_SHIP_MAP, map);
    }

    const initShips = async () => {
        console.log('initShips')
        try {
            await refreshShipStore();

            // 删除船只
            removeShips();

            // 渲染初始化3d船只
            render3dShips();

            // 
            if (firstRender && !document.hidden) {
                firstRender = false;
                startTick();
            }
        } catch {

        }
    }

    // window.removeShips = removeShips;
    // window.render3dShips = render3dShips;

    let timer: any = null;

    /** 开启定时刷新 */
    const startTick = (interval = settings.refreshShipInterval) => {
        if (!timer) {
            timer = setInterval(() => {
                initShips();
            }, interval);
        }
    }

    /** 取消定时刷新 */
    const stopTick = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    /** 处理浏览器窗口可视化切换 */
    const handleVisibilityChange = () => {
        if (ShipMode.value === GlobalShipMode.REALTIME) {
            const isHidden = document.hidden;
            if (isHidden) {
                stopTick();
            } else {
                startTick();
            }
        }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    onBeforeMount(() => {
        stopTick();
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    });

    return {
        // shipList,
        // shipMap,
        initShips,
        startTick,
        stopTick
    }
}
