import { useStore } from "@/store";
import { GlobalShipMode } from "@/store/interface";
import { computed, watch } from "vue";
import useDispatchScheme from "./useDispatchScheme"

export default (viewer: any) => {
    const store = useStore();

    const ShipMode = computed(() => store.state.GlobalShipMode);

    // 船舶调度方案逻辑
    const { destroyDispatchScheme, initDispatchScheme } = useDispatchScheme();

    const initDispatch = () => {
        initDispatchScheme();
    }

    const destroyDispatch = () => {
        destroyDispatchScheme();
    }

    watch(ShipMode, (val) => {
        if (val === GlobalShipMode.DISPATCH) {
            initDispatch();
        }
        else {
            destroyDispatch();
        }
    })

    return {
        initDispatch,
        destroyDispatch
    }
}