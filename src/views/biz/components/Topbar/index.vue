<template>
  <div class="topbar">
    <div class="topbar__title">
      <div class="topbar-logo" @click="() => { drawApi.drawCircle() }">
        <el-image :src="logo"></el-image>
      </div>
      <h1 class="topbar-name">{{ title }}</h1>
    </div>
    <div class="topbar__nav">
      <div class="topbar__nav-bg">
        <bg-line></bg-line>
      </div>
      <div class="topbar__nav-tabs">
        <div class="topbar__nav-tabs-menu">
          <div
            class="topbar__nav-tabs-item"
            :class="{
              'is--active': index === activeTabIndex
            }"
            v-for="(i,index) in tabs"
            :key="index"
            @click="onTabItemClick(i, index)"
          >
            <yw-icon :name="i.icon"></yw-icon>
            {{ i.label }}
          </div>
        </div>
        <span class="topbar__nav-tabs-activebar" :style="activebarStyle"></span>
      </div>
      <div class="topbar__nav-weatherctrl">
        <div
          class="topbar__nav-weatherctrl-item"
          :class="{
            'is--active': i.active
          }"
          v-for="i in weatherctrlItems"
          :key="i.value"
          @click="onWeatherctrlItemClick(i)"
        >
          <yw-icon :name="i.icon"></yw-icon>
          <span>{{ i.label }}</span>
        </div>
      </div>
      <div class="topbar__nav-timebox">
        <div class="topbar__nav-timebox-weather">
          <yw-icon :name="currentWeatherIcon"></yw-icon>
        </div>
        <div
          class="topbar__nav-timebox-time"
        >{{ $filters.date(currentTime, 'yyyy-MM-dd HH:mm:ss w') }}</div>
      </div>
      <div class="topbar__nav-tools">
        <el-tooltip
          v-for="i in tools"
          :key="i.value"
          effect="dark"
          :content="i.label"
          placement="top"
        >
          <div
            class="topbar__nav-tools-item"
            :class="[
              `fn-${i.value}`,
              {
                'is--active': i.active,
              }
            ]"
            @click="onToolItemClick(i)"
          >
            <yw-icon :name="i.icon"></yw-icon>

            <div class="tool-dropdown" v-if="i.children" v-show="i.active">
              <el-tooltip
                v-for="child in i.children"
                :key="child.value"
                effect="dark"
                :content="child.label"
                placement="right"
              >
                <li class="tool-dropdown__item" :data-fn="child.value">
                  <i :class="child.icon" :data-fn="child.value"></i>
                </li>
              </el-tooltip>

              <!-- <li
                class="tool-dropdown__item"
                v-for="i in i.children"
                :data-fn="i.value"
                :key="i.value"
              >
                <i :class="i.icon" :data-fn="i.value"></i>
              </li>-->
            </div>
          </div>
        </el-tooltip>
      </div>
    </div>
    <el-dialog title="请输入自定义参数" custom-class="dlg-measure" v-model="measureDlgVisible" width="400px">
      <el-form>
        <el-form-item label="码头" prop="MatouId">
          <el-select v-model="measureBerthingVm.MatouId" @change="onMatouChange">
            <el-option v-for="i in MatouList" :key="i.BId" :label="i.Name" :value="i.BId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角度" prop="Angle2">
          <el-input-number v-model="measureBerthingVm.Angle2"></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="onMeasureOk" :loading="measureLoading">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue';
import settings from "@/settings";
import logo from "@/assets/logo.png";
import BgLine from "./BgLine.vue";
import useTabs from "./useTabs";
import useWeatherctrlItems from "./useWeatherctrlItems";
import useTimebox from "./useTimebox";
import useTools from "./useTools";
import KanbanApi from '@/api/KanbanApi';
import { useStore } from '@/store';
import { ElMessageBox } from 'element-plus';

export default defineComponent({
  components: {
    BgLine,
  },

  props: {
    drawApi: {}
  },

  setup() {
    const { tabs, onTabItemClick, activebarStyle, activeTabIndex } = useTabs();
    const { weatherctrlItems, onWeatherctrlItemClick } = useWeatherctrlItems();
    const { currentTime, currentWeatherIcon } = useTimebox();
    const { tools, onToolItemClick } = useTools();

    const store = useStore();
    const measureLoading = ref(false);
    const measureBerthingVm = reactive({
      Angle1: 0,
      Angle2: 0,
      Dis: 0,
      MatouId: ""
    });
    const measureDlgVisible = ref(false);
    const onMeasureOk = async () => {
      measureLoading.value = true;
      try {
        const { data } = await KanbanApi.getRanging(measureBerthingVm)

        ElMessageBox({
          message: JSON.stringify(data)
        });
      } finally {
        measureLoading.value = false;
        measureDlgVisible.value = false;
        try {
          zccityTool.measure('clean')
        } catch (error) {

        }
      }
    }
    const onMatouChange = (BId: any) => {
      measureBerthingVm.MatouId = BId;

      const item = MatouList.value.find(i => i.BId === BId);
      measureBerthingVm.Angle2 = item.Angle;
    }
    const MatouList = computed(() => {
      return store.state.MatouList || [];
    });
    (window as any).calcMeasureBerthing = ({ Dis, Angle1, Angle2 }: any) => {
      measureDlgVisible.value = true;
      measureBerthingVm.Angle1 = Angle1;
      measureBerthingVm.Angle2 = Angle2;
      measureBerthingVm.Dis = Dis;
    }

    return {
      logo,
      title: settings.name,
      activeTabIndex,
      tabs,
      onTabItemClick,
      activebarStyle,
      weatherctrlItems,
      onWeatherctrlItemClick,
      currentTime,
      currentWeatherIcon,
      tools,
      onToolItemClick,

      measureBerthingVm,
      onMeasureOk,
      measureLoading,
      MatouList,
      onMatouChange,
      measureDlgVisible
    };
  },
});
</script>

<style lang="scss">
$inactiveTextColor: rgba(255, 255, 255, 0.5);
$logoWidth: 0.66rem;

$navWidth: 13.2rem;
$navLeftGutter: 0.3rem;

$tabHeight: 0.5rem;
$tabWidth: 7rem;
$tabItemWidth: 1.2rem;
$tabItemGutter: 0.3rem;

$weatherctrlWidth: 2.4rem;
$weatherctrlHeight: 0.38rem;
$weatherctrlItemDotSize: 0.09rem;

$timeboxHeight: 0.34rem;
$timeboxWidth: 2.4rem;

$toolsHeight: 0.34rem;
$toolsWidth: 2.6rem;
$toolItemSize: 0.36rem;

.topbar {
  --tabItemWidth: #{$tabItemWidth};
  --tabItemGutter: #{$tabItemGutter};

  display: flex;
  height: 100%;
  padding: 0.2rem;
  position: relative;
  &::before {
    content: "";
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-image: linear-gradient(
      to bottom,
      rgba(1, 15, 32, 1) 0%,
      rgba(1, 15, 32, 0.6) 60%,
      rgba(1, 15, 32, 0)
    );
  }
  &__title {
    z-index: 1;
    display: flex;
    .topbar-logo {
      width: $logoWidth;
      height: calc($logoWidth / 2);
      position: relative;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 80%;
        height: 100%;
        border-radius: 50%;
        transform: scale(98%) rotate(20deg);
        background: rgb(84, 166, 233);
        filter: blur(0.08rem);
      }
    }
    .topbar-name {
      padding-left: 0.1rem;
      font-size: 0.26rem;
      font-weight: normal;
      text-shadow: -1px 2px rgb(84, 103, 123), 0 0 30px rgb(173, 214, 255);
      //   box-shadow: 0 0 4px 2px rgb(119, 169, 213);
    }
  }
  &__nav {
    z-index: 1;
    position: relative;
    width: $navWidth;

    &-bg {
      width: $navWidth;
      position: absolute;
      top: 0;
      left: $navLeftGutter;
    }

    &-tabs {
      width: $tabWidth;
      height: $tabHeight;
      position: absolute;
      top: 0;
      left: $navLeftGutter + 0.1rem;

      &-menu {
        width: 100%;
        display: flex;
        align-items: center;
        height: $tabHeight;
      }
      &-item {
        width: $tabItemWidth;
        color: $inactiveTextColor;
        font-size: 0.17rem;
        font-weight: bold;
        letter-spacing: 0.015rem;
        text-align: center;
        margin: 0 $tabItemGutter;
        position: relative;
        cursor: pointer;

        @include linearBorder(right, 100%, 0.01rem, 0.5, -0.3rem);

        &:hover {
          color: rgba(255, 255, 255, 0.7);
        }

        &:first-child {
          margin-left: 0;
        }

        &.is--active {
          color: #fff;
          i {
            color: rgb(67, 174, 255);
          }
        }

        i {
          //   margin-right: 0.03rem;
          font-size: 1.05em;
        }
      }
      &-activebar {
        width: $tabItemWidth;
        position: absolute;
        top: -0.015rem;
        left: 0;
        height: 0.04rem;
        background: linear-gradient(
          to right,
          rgb(42, 215, 255),
          rgb(0, 113, 232)
        );
        transition: left 0.2s ease;
      }
    }

    &-weatherctrl {
      position: absolute;
      top: 0.08rem;
      right: 3.4rem;
      width: $weatherctrlWidth;
      height: $weatherctrlHeight;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.05rem;
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 0.025rem;
        transform: translateY(-50%);
        border-radius: 0.0125rem;
        background: rgb(28, 73, 120);
      }

      &-item {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        color: $inactiveTextColor;
        font-size: 0.15rem;
        justify-content: space-between;
        cursor: pointer;
        transition: color 0.1s ease;
        &:hover {
          color: rgba(255, 255, 255, 0.7);
        }

        &::before {
          content: "";
          background: #fff;
          width: 0;
          height: 0;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.1s ease;
        }

        &.is--active {
          color: #fff;
          &::before {
            box-shadow: 0 0 0.06rem 0.02rem #3385e9;
            width: $weatherctrlItemDotSize;
            height: $weatherctrlItemDotSize;
          }
        }

        span {
          font-size: 0.12rem;
        }
      }
    }

    &-timebox {
      position: absolute;
      top: -0.05rem;
      right: 0.12rem;
      width: $weatherctrlWidth;
      height: $weatherctrlHeight;
      display: flex;
      align-items: center;
      &-weather {
        color: rgb(233, 214, 151);
        font-size: 0.2rem;
      }
      &-time {
        font-size: 0.15rem;
        color: $inactiveTextColor;
        padding-left: 0.1rem;
      }
    }

    &-tools {
      position: absolute;
      bottom: 0.2rem;
      right: 0;
      width: $toolsWidth;
      height: $toolsHeight;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &-item {
        width: $toolItemSize;
        height: $toolItemSize;
        border-radius: 50%;
        background-image: radial-gradient(
          rgb(19, 28, 35) 0%,
          rgb(19, 28, 35) 40%,
          rgb(18, 26, 34)
        );
        display: flex;
        align-items: center;
        justify-content: center;
        border: 0.02rem solid rgb(161, 164, 167);
        cursor: pointer;
        box-shadow: 0 0 0.04rem 0.02rem rgba(17, 26, 35, 1);
        transition: all 0.1s ease;
        position: relative;
        &:hover {
          background: rgb(33, 48, 59);
        }

        &.is--active {
          background-image: radial-gradient(
            rgb(37, 72, 108) 0%,
            rgb(37, 72, 108) 40%,
            rgb(20, 36, 54) 100%
          );
          box-shadow: 0 0 0.06rem 0.03rem rgba(39, 74, 110, 1);
          border-color: rgb(169, 183, 197);
          .yw-icon {
            color: #fff;
          }
        }

        & > .yw-icon {
          color: rgb(206, 238, 255);
        }

        .tool-dropdown {
          position: absolute;
          top: calc(100% + 0.1rem);
          overflow: hidden;
          // top: 0;
          left: 50%;
          width: $toolItemSize;
          transform: translateX(-50%);
          background: rgba(1, 15, 32, 0.6);
          // background: red;
          padding: 0.1rem 0 0.1rem 0;
          border-radius: calc($toolItemSize/2);

          &__item {
            height: 0.34rem;
            // background: red;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover {
              background: rgba(255, 255, 255, 0.1);
            }
            .yw-icon {
              font-size: 0.16rem;
            }
          }
        }
      }
    }
  }
}

.dlg-measure {
  background: rgba(23, 44, 77, 0.9);
  .el-dialog__title {
    color: rgba(255, 255, 255, 0.8);
  }
  .el-form-item__label {
    color: rgba(255, 255, 255, 0.8);
  }
  .el-button--primary {
    $btnBg: rgba(27, 69, 138, 0.9);
    background: $btnBg;
    border-color: $btnBg;
  }
}
</style>