<template>
    <div class="dispatch--mini">
        <dashboard-tabs v-model="Mode">
            <DispatchPlanMini></DispatchPlanMini>
        </dashboard-tabs>
    </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { MutationTypes } from "@/store/modules/dispatch/mutation-types";
import { computed, defineComponent } from "vue";
import DashboardTabs from './components/dashboard-tabs/index.vue';
import DispatchPlanMini from './dispatch-schema/mini.vue';

export default defineComponent({
    components: {
        DashboardTabs,
        DispatchPlanMini
    },
    setup() {
        const store = useStore();
        // const tabItems = [
        //     {
        //         label: "船舶停靠方案",
        //         value: DispatchMode.BERTH_SCHEME,
        //         icon: "yw-icon-parking",
        //     },
        //     {
        //         label: "船舶调度动态",
        //         value: DispatchMode.DISPATCH_PLAN,
        //         icon: "yw-icon-clock"
        //     },
        //     {
        //         label: "船舶调度方案",
        //         value: DispatchMode.DIAPATCH_SCHEME,
        //         icon: "yw-icon-exchange"
        //     }
        // ];

        const Mode = computed({
            get: () => store.state.Dispatch.Mode,
            set: val => store.commit(MutationTypes.DISPATCH__SET_DIAPATCH_MODE, val)
        });

        return {
            Mode
        }
    }
})
</script>

<style lang="scss">
$height: 2.5rem;
.dispatch--mini {
    height: $height;
    
}
</style>