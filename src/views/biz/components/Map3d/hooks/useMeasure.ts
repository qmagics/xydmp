function courseAngle(lng_a: any, lat_a: any, lng_b: any, lat_b: any) {
    //以a点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
    var localToWorld_Matrix = zccity.Transforms.eastNorthUpToFixedFrame(new zccity.Cartesian3.fromDegrees(lng_a, lat_a));
    //求世界坐标到局部坐标的变换矩阵
    var worldToLocal_Matrix = zccity.Matrix4.inverse(localToWorld_Matrix, new zccity.Matrix4());
    //a点在局部坐标的位置，其实就是局部坐标原点
    var localPosition_A = zccity.Matrix4.multiplyByPoint(worldToLocal_Matrix, new zccity.Cartesian3.fromDegrees(lng_a, lat_a), new zccity.Cartesian3());
    //B点在以A点为原点的局部的坐标位置
    var localPosition_B = zccity.Matrix4.multiplyByPoint(worldToLocal_Matrix, new zccity.Cartesian3.fromDegrees(lng_b, lat_b), new zccity.Cartesian3());
    //弧度
    var angle = Math.atan2((localPosition_B.y - localPosition_A.y), (localPosition_B.x - localPosition_A.x))
    //角度
    var theta = angle * (180 / Math.PI);
    if (theta < 0) {
        theta = theta + 360;
    }
    return theta;
}

export default (viewer: any) => {
    const api: any = {

        /** 靠泊测距 */
        measureBerthing() {
            zccityTool.measure('berthing', (data: any) => {
                const { poi, distance } = data;

                // 测出的距离
                const Dis = parseFloat(distance);

                //两点形成的直线的方位角
                const Angle1 = courseAngle(poi[0].lng, poi[0].lat, poi[1].lng, poi[1].lat);

                //用户填写的自定义夹角初始值
                const Angle2 = 0;

                // console.log({ Dis, Angle1, Angle2 });
                (window as any).calcMeasureBerthing({ Dis, Angle1, Angle2 });
            })
        },

        /** 测距 */
        measureDistance() {
            zccityTool.measure('polyline')
        },

        /** 测面 */
        measurePolygon() {
            zccityTool.measure('polygon')
        },

        /** 三角测量 */
        measureTriangulation() {
            zccityTool.measure('height')
        },

        /** 清除绘制 */
        measureClean() {
            zccityTool.measure('clean')
        }
    }

    document.querySelector(".fn-measure")!.addEventListener("click", (e: any) => {
        const target: HTMLElement = e.target;

        const fn = target.dataset.fn;

        if (fn) {
            api[fn] && api[fn]();
        }
    })

    return api;
}