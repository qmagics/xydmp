import DispatchApi from "@/api/DispatchApi";
import { useStore } from "@/store"
import { MutationTypes } from "@/store/modules/dispatch/mutation-types";
import { DispatchSchemeDetailItem, DispatchStateTypes } from "@/store/modules/dispatch/state";
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import useDetailEditor from "./useDetailEditor";
import useItemEditor from "./useItemEditor";

export const useDispatchSchema = () => {

    const store = useStore();
    const DispatchSchemeQuery = computed(() => store.state.Dispatch.DispatchSchemeQuery);

    const query = {
        Category: computed({
            get: () => DispatchSchemeQuery.value.Category,
            set: val => {
                store.commit(MutationTypes.DISPATCH__SET_DIAPATCH_SCHEME_QUERY_CATEGORY, val)
            }
        }),
        DateTimes: computed({
            get: () => DispatchSchemeQuery.value.DateTimes,
            set: val => {
                store.commit(MutationTypes.DISPATCH__SET_DIAPATCH_SCHEME_QUERY_DATETIMES, val)
            }
        })
    }

    // 加载状态
    const loading = ref(false);

    // 切换面板开关
    const handleClose = () => {
        store.commit(MutationTypes.DISPATCH__SET_DIAPATCH_MODE, '');
        changeSize('mini');
    }

    // 窗口大小切换
    const changeSize = (size: DispatchStateTypes['Size']) => {
        store.commit(MutationTypes.DISPATCH__SET_DIAPATCH_SIZE, size);
    }

    // 当前调度方案详情Id
    const CurrentShipDispatchSchemeId = computed(() => store.state.Dispatch.CurrentShipDispatchSchemeId);

    // 刷新船舶调度方案详情列表
    const refresh = async () => {
        try {
            loading.value = true;
            const { data, bl } = await DispatchApi.getShipDispatchSchemeDetails({
                ...store.state.Dispatch.DispatchSchemeQuery,
                ShipDispatchSchemeId: store.state.Dispatch.CurrentShipDispatchSchemeId || ''
            });

            if (bl) {
                const detail_list = data.rows;
                if (detail_list) {
                    // 设置调度方案详情 
                    store.commit(MutationTypes.DISPATCH__SET_CURRENT_DIAPATCH_SCHEME_DETAIL, detail_list);

                    // 刷新选中的调度方案详情以便更新3D预览效果
                    const oldItem = store.state.Dispatch.CurrentDispatchSchemeDetailItem;

                    store.commit(MutationTypes.DISPATCH__SET_CURRENT_DIAPATCH_SCHEME_DETAIL_ITEM, null);
                    if (oldItem?.DispatchShipId && oldItem.Type === '1') {
                        const updatedItem = detail_list.find(i => i.DispatchShipId === oldItem.DispatchShipId);

                        if (updatedItem) {
                            store.commit(MutationTypes.DISPATCH__SET_CURRENT_DIAPATCH_SCHEME_DETAIL_ITEM, updatedItem);
                        }
                    }
                }
            }
        } finally {
            loading.value = false;
        }
    }

    // 设置默认展示的调度方案
    const setDefaultDispatchScheme = async () => {
        try {
            const { bl, data } = await DispatchApi.getSchedulingSchemeList();

            if (bl) {
                const defaultItem = data.rows[0];

                if (defaultItem) {
                    store.commit(MutationTypes.DISPATCH__SET_SHIP_DISPATCH_SCHEME_ID, defaultItem.ShipDispatchSchemeId);
                    store.commit(MutationTypes.DISPATCH__SET_SHIP_DISPATCH_SCHEME_NAME, defaultItem.Name);
                    store.commit(MutationTypes.DISPATCH__SET_SHIP_DISPATCH_SCHEME_CODE, defaultItem.Code);
                }
            }

        } catch (e) {
            console.warn("设置默认展示的调度方案失败", e)
        }
        finally {

        }
    }

    // 当前调度方案详情
    const CurrentDispatchSchemeDetail = computed(() => store.state.Dispatch.CurrentDispatchSchemeDetail);
    const CurrentShipDispatchSchemeName = computed(() => store.state.Dispatch.CurrentShipDispatchSchemeName);
    /** 当前选中的详情项 */
    const CurrentDetailItem = computed(() => store.state.Dispatch.CurrentDispatchSchemeDetailItem);

    // 展示的列表
    const displayList = computed(() => {
        // 单次调度模式
        if (DispatchSchemeQuery.value.Category === '1') {
            return CurrentDispatchSchemeDetail.value || [];
        }
        // 按船只模式
        else {
            return CurrentDispatchSchemeDetail.value || [];
        }
    });

    /** 单次调度项选中 */
    const onSingleItemClick = (item: DispatchSchemeDetailItem) => {
        store.commit(MutationTypes.DISPATCH__SET_CURRENT_DIAPATCH_SCHEME_DETAIL_ITEM, item);
    }

    /** 船只调度 选中*/
    const onShipItemClick = (item: DispatchSchemeDetailItem) => {
        store.commit(MutationTypes.DISPATCH__SET_CURRENT_DIAPATCH_SCHEME_DETAIL_ITEM, item);
    }

    /** 调度项内容编辑逻辑 */
    const { itemEditorVisible, addItem, editItem, deleteItem, itemEditorMode } = useItemEditor({ refresh });

    /** 调度项内容编辑提交成功事件处理 */
    const onItemEditorSubmitSuccess = () => {
        refresh();

        // // 需要刷新选中调度内容对应的3d预览效果
        // const oldItem = store.state.Dispatch.CurrentDispatchSchemeDetailItem;
        // store.commit(MutationTypes.DISPATCH__SET_CURRENT_DIAPATCH_SCHEME_DETAIL_ITEM, null);
        // nextTick(() => {
        //     store.commit(MutationTypes.DISPATCH__SET_CURRENT_DIAPATCH_SCHEME_DETAIL_ITEM, oldItem);
        // })
    }

    /** 调度方案编辑逻辑 */
    const { listEditorVisible, openListEditor } = useDetailEditor();

    // 初始化
    onMounted(() => {
        const hasDefaultDispatchScheme = !!store.state.Dispatch.CurrentShipDispatchSchemeId;

        if (!hasDefaultDispatchScheme) {
            setDefaultDispatchScheme();
        }
    });

    // 监听
    watch(CurrentShipDispatchSchemeId, () => {
        refresh();
    });

    return {
        query,
        handleClose,
        changeSize,
        refresh,
        loading,
        displayList,
        CurrentShipDispatchSchemeName,
        CurrentDetailItem,
        onSingleItemClick,
        onShipItemClick,

        itemEditorVisible, addItem, editItem, deleteItem, itemEditorMode, onItemEditorSubmitSuccess,
        listEditorVisible, openListEditor
    }
}