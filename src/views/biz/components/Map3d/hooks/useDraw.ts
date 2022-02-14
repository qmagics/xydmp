import { onMounted, onBeforeMount } from "vue";

export default (viewer: any) => {
    const drawHelper = new zccity.DrawHelper(viewer);

    const api: any = {

        /** 绘制圆 */
        drawCircle() {
            drawHelper.start(drawHelper.state);
            drawHelper.state = drawHelper.STATE.CIRCLE;
        },

        /** 绘制多边形 */
        drawPolygon() {
            drawHelper.start(drawHelper.state);
            drawHelper.state = drawHelper.STATE.POLYGON;
        },

        /** 画点 */
        drawPoint() {
            drawHelper.start(drawHelper.state);
            drawHelper.state = drawHelper.STATE.POINT;
        },

        /** 画线 */
        drawLine() {
            drawHelper.start(drawHelper.state);
            drawHelper.state = drawHelper.STATE.LINE;
        },

        /** 清除绘制 */
        drawClean() {
            drawHelper.removeAll()
        }
    }

    document.querySelector(".fn-draw")!.addEventListener("click", (e: any) => {
        const target: HTMLElement = e.target;

        const fn = target.dataset.fn;

        if (fn) {
            api[fn] && api[fn]();
        }
    })

    return api;
}