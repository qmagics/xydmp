import { InjectionKey } from "vue";

export interface DashboardTabsProvideContext {
    modelValue: string;
    addTabItem: (p: DashboardTabItemProxy) => void;
    delTabItem: (p: DashboardTabItemProxy) => void;
}

export interface DashboardTabItemProxy {
    value: string,
    label: string,
    icon: string
}

export const DASHBOARD_TABS_PROVIDE_KEY = Symbol('DashboardTabs') as InjectionKey<DashboardTabsProvideContext>