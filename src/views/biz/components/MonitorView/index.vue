<template>
    <div class="monitor-view">
        <transition name="slide-up">
            <mini v-if="visible && size === 'mini'"></mini>
        </transition>
        <transition name="slide-up">
            <max v-if="visible && size === 'max'"></max>
        </transition>
    </div>

    <el-dialog custom-class="blur-dialog" v-model="showMonitorViewDialog">
        <app-panel>...</app-panel>
    </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import mini from './mini.vue';
import max from './max.vue';
import { useStore } from "@/store";
import { ActionType } from "@/store/ActionType";

export default defineComponent({
    name: "MonitorView",

    components: {
        mini,
        max
    },

    setup() {
        const store = useStore();
        const showMonitorViewDialog = ref(false);

        const size = computed({
            get() {
                return store.state.MonitorView.size;
            },
            set(val) {
                store.commit(ActionType.SET_MONITOR_VIEW_SIZE, val);
            }
        });

        const visible = computed({
            get() {
                return store.state.MonitorView.visible;
            },
            set(val) {
                store.commit(ActionType.SET_MONITOR_VIEW_TOGGLE, val);
            }
        });


        return {
            size,
            visible,
            showMonitorViewDialog
        }
    }
});
</script>

<style lang="scss">
.monitor-view {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 5;
}
</style>