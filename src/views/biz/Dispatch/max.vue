<template>
    <div class="dispatch--max">
        <DispatchPlanMax></DispatchPlanMax>
    </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { MutationTypes } from "@/store/modules/dispatch/mutation-types";
import { computed, defineComponent } from "vue";
import DispatchPlanMax from './dispatch-schema/max.vue';


export default defineComponent({
    components: {
        DispatchPlanMax
    },
    setup() {
        const store = useStore();

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