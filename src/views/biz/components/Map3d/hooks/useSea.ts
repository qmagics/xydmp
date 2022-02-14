// import shuimian_json from '../meta/shuimian.json';
export default (viewer: any) => {
    import('../meta/shuimian.json').then(res => {
        var seaSurface = res.default;

        var djk_Polygon = viewer.scene.primitives.add(new zccity.Primitive({
            geometryInstances: new zccity.GeometryInstance({
                geometry: new zccity.PolygonGeometry({
                    polygonHierarchy: new zccity.PolygonHierarchy(
                        zccity.Cartesian3.fromDegreesArray(seaSurface)
                    ),
                    vertexFormat: zccity.EllipsoidSurfaceAppearance
                        .VERTEX_FORMAT
                })
            }),
            appearance: new zccity.EllipsoidSurfaceAppearance({
                aboveGround: true
            }),
            show: true
        }));

        djk_Polygon.appearance.material = new zccity.Material({
            fabric: {
                type: 'Water',
                uniforms: {
                    normalMap: '/big-screen/IMG/waterNormals.jpg',
                    frequency: 500.0,
                    animationSpeed: 0.05,
                    amplitude: 1
                }
            }
        });

    })
}