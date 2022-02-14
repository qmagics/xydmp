<template>
    <div class="monitor-view--max">
        <div class="monitor-view--max__header">
            <div class="header-search">
                <el-input
                    size="small"
                    placeholder="请输入监控名称"
                    class="input--theme-dark"
                    v-model="query.Key"
                ></el-input>
                <el-button
                    size="small"
                    type="primary"
                    @click="refreshList"
                    :loading="listLoading"
                >搜索</el-button>
            </div>
            <div class="header-title">
                <app-title-line width="3rem"></app-title-line>
                <div class="header-title__inner">
                    <yw-icon name="yw-icon-monitor"></yw-icon>厂区监控
                </div>
                <app-title-line width="3rem"></app-title-line>
            </div>
            <div class="header-tools">
                <yw-icon name="yw-icon-min" @click="handleMini" style="margin-right:.2rem;"></yw-icon>

                <app-btn icon="yw-icon-close" @click="handleClose">关闭</app-btn>
            </div>
        </div>
        <div class="monitor-view--max__body">
            <div class="left-menu">
                <el-tree
                    v-loading="treeLoading"
                    class="tree--theme-dark"
                    :data="monitorCategoryList"
                    highlight-current
                    :props="{ label: 'Name', children: 'Children' }"
                    @check-change="onTreeCheckChange"
                    check-on-click-node
                    default-expand-all
                ></el-tree>
            </div>
            <div class="right-content" v-loading="listLoading">
                <div class="video-item" v-for="i in monitorList">
                    <video-box :name="i.Name" :src="i.Bitstream"></video-box>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import useMonitor, { useMonitorCategory } from "./useMonitor";
import VideoBox from './video-box.vue';
import AppBtn from '@/components/AppBtn/index.vue';

export default defineComponent({
    components: {
        VideoBox,
        AppBtn
    },
    setup() {
        // 监控列表
        const { query, refresh: refreshList, loading: listLoading, handleClose, changeSize, monitorList } = useMonitor({
            CategoryId: '',
            Key: ''
        });

        const handleMini = () => {
            changeSize('mini');
        }

        // 监控分类
        const { refresh: refreshCategory, monitorCategoryList, loading: treeLoading } = useMonitorCategory();
        const onTreeCheckChange = (node: any) => {
            query.CategoryId = node.Id;
            refreshList();
        }

        // 初始化
        onMounted(() => {
            // 刷新分类
            refreshCategory();

            // 刷新列表
            refreshList();
        });

        return {
            query,
            refreshList,
            handleClose,
            handleMini,
            monitorList,
            listLoading,
            refreshCategory,
            treeLoading,
            monitorCategoryList,
            onTreeCheckChange
        }
    }
});
</script>

<style lang="scss">
$videoBoxWidth: 2.52rem;
$videoBoxHeight: 1.6rem;
$leftWidth: 2.6rem;
$headerHeight: 1.12rem;

.monitor-view--max {
    position: fixed;
    z-index: 6;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba(2, 20, 43, 0.8);

    &__header {
        height: $headerHeight;
        padding: 0 0.4rem 0 $leftWidth;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .header-search {
            display: flex;
            width: 3rem;
            .el-button {
                margin-left: 0.1rem;
            }
        }
        .header-title {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 3rem;
            text-align: center;
            &::before {
                content: "";
                position: absolute;
                top: 0.05rem;
                bottom: 0.05rem;
                left: 0;
                right: 0;
                background-image: linear-gradient(
                    to right,
                    rgba(0, 0, 0, 0) 0%,
                    rgba(0, 0, 0, 0.8) 50%,
                    rgba(0, 0, 0, 0) 100%
                );
            }
            .app-title-line {
                height: 0.1rem;
            }
            &__inner {
                font-size: 0.19rem;
                font-weight: 600;
                letter-spacing: 0.02rem;
                z-index: 1;
                position: relative;
                .yw-icon {
                    margin-right: 0.05rem;
                }
            }
        }
        .header-tools {
            .yw-icon {
                width: 0.36rem;
                height: 0.28rem;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 0.03rem;
                transition: background-color 0.1s ease;
                font-size: 0.18rem;
                cursor: pointer;

                &:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                &:active {
                    background: rgba(255, 255, 255, 0.15);
                }
            }
        }
    }

    &__body {
        display: flex;
        height: calc(100% - #{$headerHeight});
        padding-right: 0.2rem;
        overflow: hidden;

        .left-menu {
            width: $leftWidth - 0.2rem;
            flex: none;
            padding: 0 0.1rem 0 0.2rem;
            height: 100%;
            overflow-y: auto;
            margin-right: 0.2rem;
        }
        .right-content {
            overflow-y: auto;
            height: 100%;
            flex: 1;

            .video-item {
                margin: 0 0.2rem 0.2rem 0;
                width: $videoBoxWidth;
                height: $videoBoxHeight;
                float: left;
                .video-box {
                    height: 100%;
                    .video-box__title {
                        background-color: transparent;
                        color: rgb(171, 201, 214);
                    }
                }
            }
        }
    }
}
</style>