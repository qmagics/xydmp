import { computed, reactive } from "vue";

export default () => {
    const loadingMap = reactive<any>({});
    const start = (key: string | number) => {
        loadingMap[key] = true;
    }

    const stop = (key: string | number) => {
        loadingMap[key] = false;
    }

    const value = computed(() => {
        return Reflect.ownKeys(loadingMap).some((key: any) => loadingMap[key] === true);
    });

    return {
        start,
        stop,
        value
    }
}