export default (viewer: any) => {
    const provider = new zccity.WebMapServiceImageryProvider({
        url: 'http://yfb.zjtoprs.com:8082/geoserver/xinya/wms',
        layers: 'xinya:xinyaShip',
        parameters: {
            service: 'WMS',
            format: 'image/png',
            transparent: true,
        }
    });
    viewer.imageryLayers.addImageryProvider(provider);
}