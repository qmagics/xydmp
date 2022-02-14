<template>
    <div class="ship-toolbar" v-show="visible" :style="toolbarStyle">
        <div class="ship-toolbar__btns">
            <div class="tool-btn" v-for="btn in btns" :key="btn.value">
                <yw-icon :name="btn.icon"></yw-icon>
            </div>
            <div
                class="tool-btn toggle-btn"
                :class="`${panelVisible ? 'is--active' : ''}`"
                @click="togglePanel"
            >
                <yw-icon :name="`yw-icon-arrow-${panelVisible ? 'down' : 'up'}-solid`"></yw-icon>
            </div>
        </div>
        <div class="ship-toolbar__panel">
            <app-panel v-show="panelVisible" :width="panelWidth" :height="panelHeight">
                <slot name="panel"></slot>
            </app-panel>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType, onUnmounted, watch, reactive } from "vue";
import { CssPosition, D3Position } from "../types";
import { getCssPositionFromD3Position } from '../utils';

export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        showPanel: {
            type: Boolean,
            default: false
        },
        panelWidth: {
            type: String,
            default: "4rem"
        },
        panelHeight: {
            type: String,
            default: "2.2rem"
        },
        d3Position: {
            type: Object as PropType<D3Position>
        }
    },
    setup(props, { emit }) {
        let eventListener: any = null;
        watch(() => props.visible, (val) => {
            if (val === true) {
                const v = getCssPositionFromD3Position(props.d3Position as D3Position);
                cssPosition.value = getCssPositionFromD3Position(props.d3Position as D3Position);
                eventListener = viewer.clock.onTick.addEventListener((clock: any) => {
                    cssPosition.value = getCssPositionFromD3Position(props.d3Position as D3Position);
                });
            }
            else {
                viewer.clock.onTick.removeEventListener(eventListener);
            }
        });

        const cssPosition = ref<CssPosition>({
            left: 0,
            top: 0
        });

        const offset = reactive({
            left: -100,
            top: -100
        });

        const toolbarStyle = computed(() => {
            return {
                left: cssPosition.value.left + offset.left + 'px',
                top: cssPosition.value.top + offset.top + 'px',
            }
        });

        const btns = ref([
            {
                icon: 'yw-icon-delete',
                value: 1,
                label: '删除'
            },
            {
                icon: 'yw-icon-resize',
                value: 2,
                label: '移动'
            },
            {
                icon: 'yw-icon-a1',
                value: 3,
                label: '下锚'
            },
            {
                icon: 'yw-icon-lansheng',
                value: 4,
                label: '绑缆绳'
            }
        ]);

        const panelVisible = ref(props.showPanel);

        const togglePanel = () => {
            panelVisible.value = !panelVisible.value;
        };

        return {
            btns,
            panelVisible,
            togglePanel,
            toolbarStyle
        }
    },
});
</script>

<style lang="scss">
$btnsHeight: 0.36rem;
.ship-toolbar {
    position: absolute;
    &__btns {
        display: flex;
        background: rgba(7, 14, 22, 0.7);
        box-shadow: 0.03rem 0.03rem 0.06rem rgba(7, 14, 22, 0.2);
        height: $btnsHeight;
        border-radius: 0.04rem;
        align-items: center;
        justify-content: center;
        .tool-btn {
            padding: 0 0.1rem;
            font-size: 0.16rem;
            position: relative;
            @include lineBorder(right, 100%);
            cursor: pointer;
            &:hover {
                .yw-icon {
                    color: $colorPrimaryLight;
                }
            }
            &.is--active {
                .yw-icon {
                    color: $colorPrimary;
                }
            }
            .yw-icon {
                color: rgba(255, 255, 255, 0.9);
                transition: all 0.1s ease;
            }

            &.toggle-btn {
                padding: 0;
                font-size: 0.12rem;
                // padding: 0 0.04rem;
            }
        }
    }
    &__panel {
        position: absolute;
        bottom: $btnsHeight + 0.1rem;
        right: 0;
        .app-panel__bg {
            box-shadow: 0.1rem 0.1rem 0.2rem rgba(7, 14, 22, 0.2);
        }
    }
}
</style>