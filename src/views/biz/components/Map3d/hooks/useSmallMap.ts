export default () => {
    var corner1 = L.latLng(30.543338954230222, 121.15722656250001); //设置左上角经纬度
    var corner2 = L.latLng(29.267232865200903, 122.93701171875001); //设置右下点经纬度
    var bounds = L.latLngBounds(corner1, corner2); //构建视图限制范围
    var map = L.map('smallMap', {
        center: [
            29.784057144743887,
            122.08946147991631
        ],
        minZoom: 8,
        maxZoom: 50,
        zoom: 8,
        maxBounds: bounds,
        zoomControl: false
    });
    map.setMaxBounds(bounds);

    const tileLayer = new L.tileLayer(
        'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
        maxZoom: 19,
        minZoom: 0,
        continuousWorld: true
    });

    tileLayer.addTo(map);

    const maker = L.marker([29.784057144743887, 122.08946147991631]);
    maker.addTo(map);

    map.on('click', function (e: any) {
        console.log(JSON.stringify(e.latlng));
    });
}