import { ref } from "vue";

export default () => {
    const listEditorVisible = ref(false);

    const openListEditor = () => {
        listEditorVisible.value = true;
    }

    return {
        openListEditor,
        listEditorVisible
    }
}