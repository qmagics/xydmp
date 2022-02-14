import { ref, onBeforeUnmount } from "vue";

export default () => {
    const currentTime = ref<Date>(new Date());

    const tick = setInterval(() => {
        currentTime.value = new Date();
    }, 1000);

    onBeforeUnmount(() => {
        if (tick) {
            clearInterval(tick);
        }
    })

    return {
        currentWeatherIcon: "yw-icon-sun",
        currentTime
    }
}