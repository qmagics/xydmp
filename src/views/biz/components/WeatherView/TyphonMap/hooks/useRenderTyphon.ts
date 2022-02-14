import { TyphonObject } from "@/types/biz";
import tf_png from '@/assets/tf.png';
import { onUnmounted } from "vue";

const EMPTY_LINE_STYLE = {
    lineWidth: 0,
    fillStyle: null,
    strokeStyle: null,
    borderStyle: null
};

const DEFAULT_RENDER_OPTIONS = {
    pathLineStyle: EMPTY_LINE_STYLE,
    pathLineSelectedStyle: EMPTY_LINE_STYLE,
    pathLineHoverStyle: EMPTY_LINE_STYLE,
    keyPointStyle: EMPTY_LINE_STYLE,
    startPointStyle: EMPTY_LINE_STYLE,
    endPointStyle: EMPTY_LINE_STYLE,
    keyPointHoverStyle: EMPTY_LINE_STYLE,
    keyPointOnSelectedPathLineStyle: EMPTY_LINE_STYLE
}


export default (mapInstance: any) => {
    let navg: any = null;

    // 销毁巡航器
    const destroyNavg = () => {
        navg.destroy();
    }

    const render = (typhon: TyphonObject) => {
        // console.log("渲染台风", typhon);

        if (navg) {
            destroyNavg();
        }

        const { name, points } = typhon;

        const path = points.map(point => {
            const { lat, lng } = point;
            return [Number(lng), Number(lat)];
        });

        AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (PathSimplifier: any, $: any) {

            if (!PathSimplifier.supportCanvas) {
                alert('当前环境不支持 Canvas！');
                return;
            }

            var pathSimplifierIns = new PathSimplifier({
                zIndex: 100,

                autoSetFitView: true,

                map: mapInstance.value,

                getPath: function (pathData: any, pathIndex: any) {
                    console.log(arguments);

                    return pathData.path;
                },
                getHoverTitle: function (pathData: any, pathIndex: any, pointIndex: any) {

                    return null;
                },
                renderOptions: {
                    ...DEFAULT_RENDER_OPTIONS,
                    keyPointTolerance: 0,
                    keyPointStyle: {
                        radius: 4,
                        fillStyle: "rgb(81,251,82)"
                    },
                    // getPathStyle(pathItem: any) {
                    //     return {
                    //         keyPointStyle: {
                    //             radius: 10,
                    //             fillStyle: "rgb(81,251,82)"
                    //         }
                    //     }
                    // }
                },
                // renderOptions: {
                //     //将点、线相关的style全部置EMPTY_LINE_STYLE
                //     pathLineStyle: EMPTY_LINE_STYLE,
                //     pathLineSelectedStyle: EMPTY_LINE_STYLE,
                //     pathLineHoverStyle: EMPTY_LINE_STYLE,
                //     keyPointStyle: {
                //         radius: 4,
                //         fillStyle: "rgb(81,251,82)"
                //     },
                //     keyPointHoverStyle: {
                //         radius: 8,
                //         fillStyle: "rgb(81,251,82)"
                //     },
                //     // keyPointStyle: EMPTY_LINE_STYLE,
                //     startPointStyle: EMPTY_LINE_STYLE,
                //     endPointStyle: EMPTY_LINE_STYLE,
                //     // keyPointHoverStyle: EMPTY_LINE_STYLE,
                //     // keyPointOnSelectedPathLineStyle: EMPTY_LINE_STYLE



                // },


            });

            pathSimplifierIns.setData([{
                name: name,
                path: path
                // path: [
                //     [116.405289, 39.904987],
                //     [113.964458, 40.54664],
                //     [111.47836, 41.135964],
                //     [108.949297, 41.670904],
                //     [106.380111, 42.149509],
                //     [103.774185, 42.56996],
                //     [101.135432, 42.930601],
                //     [98.46826, 43.229964],
                //     [95.777529, 43.466798],
                //     [93.068486, 43.64009],
                //     [90.34669, 43.749086],
                //     [87.61792, 43.793308]
                // ]
            }]);

            //initRoutesContainer(d);

            function onload() {
                pathSimplifierIns.renderLater();
            }

            function onerror(e) {
                console.log('图片加载失败！');
            }

            navg = pathSimplifierIns.createPathNavigator(0, {
                loop: false,
                speed: 1000000,
                pathNavigatorStyle: {
                    width: 50,
                    height: 50,
                    strokeStyle: null,
                    fillStyle: null,
                    //使用图片
                    content: PathSimplifier.Render.Canvas.getImageContent(tf_png, onload, onerror),
                    //经过路径的样式
                    pathLinePassedStyle: {

                    }
                    //     lineWidth: 2,
                    //     strokeStyle: 'rgb(4,120,202)',
                    //     // dirArrowStyle: {
                    //     //     stepSpace: 15,
                    //     //     strokeStyle: 'red'
                    //     // }
                    // }
                },
            });

            navg.start();
        });
    }

    onUnmounted(() => {
        destroyNavg();
    });

    return {
        render
    }
}