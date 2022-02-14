import DispatchApi from "@/api/DispatchApi";
import { useStore } from "@/store";
import { $closeLoading, $confirm, $loading, $message } from "@/utils";
import { ref } from "vue";

export default ({ refresh }: { refresh: Function }) => {
    const itemEditorVisible = ref(false);
    const itemEditorMode = ref('add');

    const store = useStore();

    const addItem = () => {
        itemEditorMode.value = 'add';
        itemEditorVisible.value = true;
    }

    const editItem = () => {
        const itemToEdit = store.state.Dispatch.CurrentDispatchSchemeDetailItem;

        if (!itemToEdit) {
            $message('请先选择一条调度内容再进行编辑');
            return;
        }

        itemEditorMode.value = 'edit';
        itemEditorVisible.value = true;
    }
    
    const deleteItem = () => {
        const itemToDelete = store.state.Dispatch.CurrentDispatchSchemeDetailItem;

        if (!itemToDelete) {
            $message('请先选择一条调度内容再进行删除');
            return;
        }

        $confirm("是否确认删除？").then(async () => {
            try {
                $loading();
                const ShipDispatchSchemeDetailsId = itemToDelete.ShipDispatchSchemeDetailsId as string;
                const { bl, data, msg } = await DispatchApi.deleteSchedulingContent({ ShipDispatchSchemeDetailsId });

                if (bl) {
                    refresh();
                }
                else {
                    $message(msg);
                }
            } finally {
                $closeLoading();
            }
        })
    }

    return {
        addItem,
        editItem,
        deleteItem,
        itemEditorVisible,
        itemEditorMode,
    }
}