import { onUnmounted } from 'vue';

export default (chart: any) => {
    const resizeHandler = () => {
        chart.resize();
    }
    window.addEventListener('resize', resizeHandler);
    onUnmounted(() => {
        window.removeEventListener('resize', resizeHandler);
    });
}