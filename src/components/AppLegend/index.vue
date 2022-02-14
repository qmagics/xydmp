<template>
    <div class="legend">
        <span class="legend-item" v-for="i in items">
            <span class="legend-item__color" :style="{ 'background-color': i.color }"></span>
            <span class="legend-item__label">{{ i.label }}</span>
        </span>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

interface LegendItem {
    label: string;
    color: string;
}

export default defineComponent({
    name: "AppLegend",
    props: {
        items: Array as PropType<LegendItem[]>,
    }
});
</script>

<style lang="scss">
.legend {
    display: flex;
    align-items: center;
    &-item {
        display: inline-flex;
        margin-right: 0.4rem;
        align-items: center;
        &:last-child {
            margin-right: 0;
        }
        &__color {
            width: 0.14rem;
            height: 0.14rem;
            border-radius: 0.02rem;
            margin-right: 0.06rem;
        }
        &__label {
        }
    }
}
</style>