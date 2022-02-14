import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

interface TabItem {
    label: string;
    icon: string;
    path: string;
}

export default () => {
    const router = useRouter();
    const route = useRoute();
    const activeTabIndex = computed(() => {
        return tabs.value.findIndex(i => i.path === route.path);
    });

    const tabs = ref<TabItem[]>([
        {
            label: "厂区总览",
            icon: "yw-icon-home",
            path: "/overview",
        },
        {
            label: "项目管理",
            icon: "yw-icon-manage",
            path: "/projects",
        },
        {
            label: "指挥调度",
            icon: "yw-icon-flag",
            path: "/dispatch",
        },
    ]);

    const onTabItemClick = (item: TabItem, index: number) => {
        const { path } = item;
        router.push({ path });
        // activeTabIndex.value = index;
    };

    const activebarStyle = computed(() => {
        const n = activeTabIndex.value;
        return {
            left: `calc(${n} * var(--tabItemWidth) + var(--tabItemGutter) * ${n} * 2)`,
        };
    });

    return {
        tabs,
        onTabItemClick,
        activebarStyle,
        activeTabIndex
    }
}