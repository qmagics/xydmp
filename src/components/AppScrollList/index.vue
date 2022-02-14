<template>
    <div class="app-scroll-list">
        <el-scrollbar ref="scrollbarRef" native>
            <div class="app-scroll-list__inner">
                <slot></slot>
            </div>
        </el-scrollbar>
        <div class="app-scroll-list__btns">
            <yw-icon
                :class="['btn-prev', { 'is--disabled': false }]"
                name="yw-icon-arrow-down"
                @click="scrollLeft"
            ></yw-icon>
            <yw-icon
                :class="['btn-next', { 'is--disabled': false }]"
                name="yw-icon-arrow-down"
                @click="scrollRight"
            ></yw-icon>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: "AppScrollList",

    setup() {
        const scrollbarRef = ref();
        const scrollDistance = ref(500);
        let scrollbarWrapper: any = null;

        onMounted(() => {
            scrollbarWrapper = scrollbarRef.value.$el.querySelector('.el-scrollbar__wrap');
            scrollDistance.value = scrollbarWrapper.clientWidth;
        });

        const scrollLeft = () => {
            scrollbarWrapper.scrollBy({ left: -scrollDistance.value, behavior: 'smooth' });
        };
        const scrollRight = () => {
            scrollbarWrapper.scrollBy({ left: scrollDistance.value, behavior: 'smooth' });
        };

        return {
            scrollbarRef,
            scrollLeft,
            scrollRight
        }

    }
});
</script>

<style lang="scss">
.app-scroll-list {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    padding: 0 0.7rem;
    .el-scrollbar__wrap {
        overflow: hidden;
    }
    &__inner {
        display: flex;
    }
    &__btns {
        .yw-icon {
            position: absolute;
            top: 50%;
            font-size: 0.3rem;
            color: rgba(193, 198, 211, 0.8);
            cursor: pointer;
            &:hover {
                color: rgba(193, 198, 211, 1);
            }
            &.is--disabled {
                color: rgba(193, 198, 211, 0.3);
                cursor: not-allowed;
            }
        }
        .btn-prev {
            transform: translateY(-50%) rotate(90deg);
            left: 0.1rem;
        }
        .btn-next {
            transform: translateY(-50%) rotate(-90deg);
            right: 0.1rem;
        }
    }
}
</style>