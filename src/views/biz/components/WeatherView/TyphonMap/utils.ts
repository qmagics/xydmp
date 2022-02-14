import settings from '@/settings';

/** 加载脚本 */
const loadScript = (url: string, callback?: Function): HTMLScriptElement => {
    const script = document.createElement('script');
    script.type = "text/javascript";
    script.charset = 'utf-8';

    script.onload = script.onreadystatechange = function (this: any) {
        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
            callback && callback();
            script.onload = script.onreadystatechange = null;
        }
    };

    script.src = url;
    document.head.appendChild(script);

    return script;
}

/** 加载高德地图 */
export const loadAMap = () => {
    if (window.AMap) {
        return Promise.resolve(window.AMap);
    }

    window._AMapSecurityConfig = {
        securityJsCode: settings.amapSecurityJsCode,
    }

    return new Promise((resolve, reject) => {
        window.onAMapLoad = () => {
            loadScript("https://webapi.amap.com/ui/1.1/main-async.js", () => {
                initAMapUI();
                resolve(window.AMap);
            });
        }

        loadScript(`https://webapi.amap.com/maps?v=1.4.15&key=${settings.amapKey}&callback=onAMapLoad`);


    });
}

/** 加载搞得地图UI插件 */
export const loadAMapPlugins = () => {

}