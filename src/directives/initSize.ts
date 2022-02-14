import { Directive } from "vue";

export default {
    mounted(el: any, binding: any) {
        const bodyH = document.body.clientHeight || document.querySelector("#app")?.clientHeight as number;
        const bodyW = document.body.clientWidth;
        let { placement, height, width, id } = binding.value;

        if (typeof height === "string") {
            if (height.includes("%")) {
                height = bodyH * (+height.replace(/\%/g, "") / 100);
            }
            else {
                height = parseFloat(height);
            }
        }

        if (typeof width === "string") {
            if (width.includes("%")) {
                width = bodyW * (+width.replace(/\%/g, "") / 100);
            }
            else {
                width = parseFloat(width);
            }
        }

        if (width > bodyW) {
            width = bodyW;
        }

        if (height > bodyH) {
            height = bodyH;
        }

        let top = "5vh";
        let left = (bodyW - width) / 2 + "px";

        const modalEl = el.querySelector(`.fx-modal`);

        modalEl.style.width = width + "px";
        modalEl.style.height = height + "px";

        // if (placement === "center") {
        //     if (height) {
        //         top = (bodyH - height) / 2 + "px";
        //     }
        // }
        //默认上下居中
        if (height) {
            top = (bodyH - height) / 2 + "px";
        }

        modalEl.style.left = left;
        modalEl.style.top = top;
    }
} as Directive