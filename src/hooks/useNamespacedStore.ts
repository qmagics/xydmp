import { useStore } from "@/store";
import { ActionMethod, createNamespacedHelpers } from "vuex";

export const useNamespacedActions = (namespace: string, map: string[]) => {
    const { mapActions } = createNamespacedHelpers(namespace);
    const store = useStore();
    const actions = mapActions(map);

    Object.entries(actions).forEach(([key, val]) => {
        (actions as any)[key] = (...args: any) => { val.call({ $store: store }, ...args) }
    })

    return actions;
}