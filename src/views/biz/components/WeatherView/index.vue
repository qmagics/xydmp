<template>
    <div class="weather-view">
        <app-panel
            class="weather-view__left"
            :style="panelLeftStyle"
            :class="visible ? 'is--active' : ''"
        >
            <template v-if="visible">
                <Qixiang></Qixiang>
                <Taifeng></Taifeng>
            </template>
        </app-panel>
    </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { defineComponent, computed } from "vue";
import Qixiang from "./Qixiang.vue";
import Taifeng from "./Taifeng.vue";

export default defineComponent({
    components: {
        Qixiang,
        Taifeng
    },
    setup() {
        const store = useStore();

        const panelStyle = computed(() => {
            return {
                bottom: "0.5rem",
                width: "4.2rem",
            };
        });

        const panelLeftStyle = computed(() => {
            return {
                ...panelStyle.value,
            };
        });

        // const panelRightStyle = computed(() => {
        //     return {
        //         ...panelStyle.value,
        //     };
        // });

        return {
            visible: computed(() => store.state.WeatherView.visible),
            panelLeftStyle,
            // panelRightStyle,
        };
    },
});
</script>

<style lang="scss">
$panelTop: 1.2rem;

.weather-view {
    position: relative;
    z-index: 5;

    &__left,
    &__right {
        position: fixed;
        top: $panelTop;
        transition: all 0.25s ease-in-out;
        bottom: 0;
    }

    &__left {
        left: 0;
        transform: translate3d(-100%, 0, 0);

        &.is--active {
            transform: translate3d(0, 0, 0);
        }
    }
    &__right {
        right: 0;
        transform: translate3d(100%, 0, 0);
        &.is--active {
            transform: translate3d(0, 0, 0);
        }
    }
}
</style>