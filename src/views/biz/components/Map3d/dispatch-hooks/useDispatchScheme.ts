import { watch, WatchStopHandle } from "vue";
import { useStore } from "@/store";
import { DispatchSchemeDetailItem } from "@/store/modules/dispatch/state";
import { destroyPreviewEffect, showPreviewEffect } from "../dispatchPreviewUtils";

/** 单次调度逻辑 */
const useEffectOne = () => {
    const store = useStore();

    // 销毁句柄
    let stopWatchItemChange: WatchStopHandle | undefined = undefined;

    // 初始化
    const init = () => {
        // 监听当前选中的调度详情项,渲染3D调度效果
        stopWatchItemChange = watch(() => store.state.Dispatch.CurrentDispatchSchemeDetailItem, item => {
            // 清除之前的
            destroyEffect();

            if (item) {
                // 渲染新的
                showEffect(item);
            }
        }, { immediate: true });
    }

    // 销毁
    const destroy = () => {
        destroyEffect();
        stopWatchItemChange?.call(null);
        stopWatchItemChange = undefined;
    }

    // 根据单次调度显示3D效果
    const showEffect = (item: DispatchSchemeDetailItem) => {

        // 类型是调度，才显示3d效果
        if (item.Type === '1') {
            showPreviewEffect(item);
        }
    }

    // 销毁3D效果
    const destroyEffect = () => {
        destroyPreviewEffect();
    }

    return {
        destroyEffectOne: destroy,
        initEffectOne: init
    }
}

/** 单船调度逻辑 */
const useEffectShip = () => {
    const store = useStore();

    const showEffect = () => {

    }

    const destroy = () => {

    }

    const init = () => {

    }

    return {
        destroyEffectShip: destroy,
        initEffectShip: init
    }
}

/** 船舶调度方案逻辑 */
const useDispatchScheme = () => {

    // 单次调度模式
    const { destroyEffectOne, initEffectOne } = useEffectOne();

    // 单船调度模式
    const { destroyEffectShip, initEffectShip } = useEffectShip();

    // 初始化逻辑
    const init = () => {
        initEffectOne();
        initEffectShip();
    }

    // 销毁逻辑
    const destroy = () => {
        destroyEffectOne();
        destroyEffectShip();
    }


    // // 暴露方法 
    // window.DispatchSchemeTools = {
    //     show3DEffectByOne,
    //     show3DEffectByShip
    // }

    return {
        // show3DEffectByOne,
        // show3DEffectByShip,
        destroyDispatchScheme: destroy,
        initDispatchScheme: init
    }
}

export default useDispatchScheme;