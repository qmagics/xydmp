<template>
    <div class="app-lv" :style="{
        'align-items': alignItems
    }">
        <span class="app-lv__label" :style="lStyle">
            <slot name="label">{{ label }}</slot>
        </span>
        <span class="app-lv__value" :style="vStyle">
            <slot name="value">{{ value }}</slot>
        </span>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, CSSProperties } from "vue";

export default defineComponent({
    name: "AppLv",
    props: {
        label: {},
        value: {},
        alignItems: {
            type: String,
            default: "center"
        },

        labelClamp: {
            type: [Number, String],
            default: 1,
        },

        valueClamp: {
            type: [Number, String],
            default: 1,
        },

        labelStyle: {
            type: Object,
        },
        valueStyle: {
            type: Object,
        },
    },
    setup(props) {

        // const lvStyle = computed(() => {
        //     return
        // });

        const lStyle = computed(() => {
            return {
                '-webkit-line-clamp': props.labelClamp,
                ...props.labelStyle,
            } as CSSProperties
        });

        const vStyle = computed(() => {
            return {
                '-webkit-line-clamp': props.valueClamp,
                ...props.valueStyle,
            } as CSSProperties
        });

        return {
            lStyle,
            vStyle
        }

    },
});
</script>

<style lang="scss">
.app-lv {
    display: flex;
    // align-items: center;
    &__label {
        flex: none;
        color: rgb(171, 177, 180);
    }
    &__value {
        flex: 1;
        @include text-clamp(1);
        color: #fff;
    }
    & + .app-lv {
        margin-top: 0.02rem;
    }
}
</style>