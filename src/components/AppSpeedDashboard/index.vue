<template>
  <div class="app-speed-dashboard">
    <div class="app-speed-dashboard__bg">
      <svg>
        <use xlink:href="#app-speed-dashboard-bg" />
      </svg>
    </div>
    <div class="app-speed-dashboard__tick">
      <i>0</i>
      <i>1</i>
      <i>2</i>
    </div>
    <div class="app-speed-dashboard__value">
      <b>{{value||'0.0'}}</b>
      <span>{{unit}}</span>
    </div>
    <div class="app-speed-dashboard__pointer">
      <div class="pointer" :style="{
          transform:`rotate(${pointerRotateDeg}deg)`
      }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2.27 9.83">
          <polygon points="0 9.83 2.27 9.77 1.12 0 0.69 0.01 0 9.83" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch, ref } from "vue";

export default defineComponent({
  name: "AppSpeedDashboard",
  props: {
    value: Number,
    max: {
      type: Number,
      default: 2,
    },
    unit: {
      type: String,
      default: "kn",
    },
  },
  setup(props) {
    const minDeg = -126,
      maxDeg = 126;

    const degAbs = Math.abs(minDeg) + Math.abs(maxDeg);

    const pointerRotateDeg = computed<number>(() => {
      let deg = minDeg;

      const percent = (props.value || 0) / props.max;
      deg += percent * degAbs;

      return deg;
    });

    const getFormatValue = () => {
      return Number(props.value?.toFixed(1));
    };

    return {
      pointerRotateDeg,
      getFormatValue,
    };
  },
});
</script>

<style lang="scss">
$width: 0.6rem;
$height: 0.5rem;
$scale: 0.98;
.app-speed-dashboard {
  //   background-color: rgba(128, 255, 0, 0.253);
  width: $width;
  height: $height;
  position: relative;
  &__bg {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: $width * $scale;
      height: $height * $scale;
    }
  }
  &__tick {
    width: $width * $scale;
    height: $height * $scale;
    position: absolute;
    left: 0;
    top: 0;
    & > i {
      position: absolute;
      font-style: normal;
      font-size: 0.1rem;

      &:nth-child(1) {
        left: 17%;
        bottom: -2%;
      }
      &:nth-child(2) {
        top: 12%;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
      }
      &:nth-child(3) {
        right: 17%;
        bottom: -2%;
      }
    }
  }
  &__value {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate3d(-50%, 0, 0);
    font-size: 0.16rem;
    z-index: 1;
    b {
    }
    span {
      font-size: 80%;
    }
  }
  &__bg {
  }
  &__pointer {
    width: $width * $scale;
    height: $width * $scale;
    // background-color: rgba(20, 107, 220, 0.281);
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    .pointer {
      width: 0.04rem;
      height: $width * 0.9;
      transition: all 0.4s ease;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      //   animation: rotate infinite 1s ease;

      polygon {
        fill: rgb(203, 242, 255);
        transform: scale(0.7);
      }
    }
  }
}

// @keyframes rotate {
//   0% {
//     transform: rotate(0deg);
//   }
//   100% {
//     transform: rotate(360deg);
//   }
// }
</style>
