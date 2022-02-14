<template>
    <div class="app-btn" @mouseenter="isActive = true" @mouseleave="isActive = false">
        <div class="app-btn__bg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 159.72 37.36">
                <path
                    :style="{
                        fill: isActive ? 'rgb(29,54,72)' : '#091721',
                        stroke: '#a4a9ac',
                        'stroke-miterlimit': 10,
                        'stroke-width': '.03rem',
                        'opacity': 0.65,
                    }"
                    d="M140.32,36.36H19.4a7.85,7.85,0,0,1-4.77-1.62l-9.2-7.07a11.33,11.33,0,0,1,0-18l9.2-7.07A7.85,7.85,0,0,1,19.4,1H140.32a7.86,7.86,0,0,1,4.78,1.62l9.2,7.07a11.34,11.34,0,0,1,0,18l-9.2,7.07A7.86,7.86,0,0,1,140.32,36.36Z"
                />
            </svg>
        </div>
        <span class="app-btn__inner">
            <svg-icon :name="icon"></svg-icon>
            <span>
                <slot></slot>
            </span>
        </span>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

/** 不规则按钮 */
export default defineComponent({
    name: "AppBtn",

    props: {
        icon: String,
        width: {
            type: String,
            default: "1.2rem"
        }
    },

    setup(props) {
        const isActive = ref(false);

        return {
            isActive
        }
    }
})
</script>

<style lang="scss">
$btnWidth: v-bind(width);
$btnHeight: 0.3rem;
.app-btn {
    cursor: pointer;
    width: $btnWidth;
    height: $btnHeight;
    line-height: $btnHeight;
    position: relative;
    display: inline-block;

    &__bg {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        svg {
            width: 100%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }

    &__inner {
        position: relative;
        z-index: 1;
        // width: 100%;
        // height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .svg-icon {
            color: rgb(160, 205, 255);
        }
        span {
            margin-left: 0.15rem;
        }
    }
}
</style>