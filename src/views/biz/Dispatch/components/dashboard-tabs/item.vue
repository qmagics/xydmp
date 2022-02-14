<template>
    <div class="dashboard-tab-item" v-if="isVisible">
        <div class="dashboard-tab-item__inner">
            <slot></slot>
        </div>
        <div class="dashboard-tab-item__actions">
            <slot name="actions"></slot>
        </div>
        <div class="dashboard-tab-item__footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, inject, onBeforeUnmount } from "vue";
import { DashboardTabItemProxy, DASHBOARD_TABS_PROVIDE_KEY } from "./tokens";

export default defineComponent({
    name: "DashboardTabItem",

    props: {
        value: String,
        label: String,
        icon: String
    },

    setup(props) {
        const tabs = inject(DASHBOARD_TABS_PROVIDE_KEY);
        const proxy = getCurrentInstance()?.proxy as unknown as DashboardTabItemProxy;

        const isVisible = computed(() => tabs!.modelValue === props.value);

        tabs?.addTabItem(proxy);

        onBeforeUnmount(() => {
            tabs?.delTabItem(proxy);
        });

        return {
            isVisible
        }
    }
});
</script>

<style lang="scss">
$actionWidth: 5rem;
$actionHeight: 0.4rem;
$footerHeight: 0.4rem;
.dashboard-tab-item {
    padding: 0 0 0 0.7rem;
    position: relative;
    height: 100%;
    z-index: 1;
    &__inner {
        // background-color: rgba(255, 0, 0, 0.384);
        height: calc(100% - #{$footerHeight});
        position: relative;
        z-index: 1;
        overflow: hidden;
    }
    &__actions {
        // background-color: rgba(255, 0, 255, 0.555);
        width: $actionWidth;
        height: $actionHeight;
        position: absolute;
        left: 50%;
        bottom: 0.15rem;
        transform: translateX(-50%);
        z-index: 2;
    }
    &__footer {
        // background-color: rgba(0, 255, 42, 0.336);
        height: $footerHeight;
    }

    .dispatch-tab-actions {
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 100%;
        .action-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;

            &:after {
                content: "";
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                background-color: rgb(126, 139, 167);
                height: 80%;
                width: 0.01rem;
            }

            &:last-child {
                &::after {
                    display: none;
                }
            }

            .yw-icon {
                font-size: 0.22rem;
                cursor: pointer;
                position: relative;
                color: rgb(210, 212, 215);

                &::after {
                    content: "";
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0.15);
                    opacity: 0;
                    transition: all 0.15s ease;
                }

                &:hover {
                    color: #fff;
                    &::after {
                        opacity: 1;
                        width: 180%;
                        height: 180%;
                    }
                }
            }
        }
    }
}
</style>