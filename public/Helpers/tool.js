var zccityTools = function (viewer) {
    this.viewer = viewer;
    viewer.scene.fxaa = false;
    viewer.scene.postProcessStages.fxaa.enabled = false;
    this.handler = new zccity.ScreenSpaceEventHandler(viewer.scene.canvas);
    this.scene = viewer.scene;
    this.init();
    this.layers = 10;
    var supportsImageRenderingPixelated = viewer.cesiumWidget._supportsImageRenderingPixelated;
    if (supportsImageRenderingPixelated) {
        var vtxf_dpr = window.devicePixelRatio;
        while (vtxf_dpr >= 2.0) { vtxf_dpr /= 2.0; }
        viewer.resolutionScale = vtxf_dpr;
    }
}
zccityTools.prototype.init = function (callback) {
    //去除所有实体
    this.removeEntities = function (viewer, entities) {
        for (var i = entities.length - 1; i >= 0; i--) {
            viewer.entities.remove(entities[i]);
        }
    }
    var currentSkyBox = new zccity.GroundSkyBox({
        sources: {
            positiveX: "./img/skybox/right.png",
            negativeX: "./img/skybox/left.png",
            positiveY: "./img/skybox/back.png",
            negativeY: "./img/skybox/front.png",
            positiveZ: "./img/skybox/top.png",
            negativeZ: "./img/skybox/bottom.png"
        }
    });
    viewer.scene.skyBox = currentSkyBox;
    viewer.scene.sun.show = false;
    viewer.scene.moon.show = false;
}

let a = 0;
var paramlist = [];
Object.assign(zccityTools.prototype, {
    //添加模型
    addModel: function (url, param, customParams) {
        paramlist.push(param)
        var model = zccity.Model.loadGltf({
            url: url,
            modelMatrix: zccity.Matrix4.fromTranslation(zccity.Cartesian3.fromDegrees(param.x, param.y, param.z)),
            position: zccity.Cartesian3.fromDegrees(param.x, param.y, param.z),
            id: param.id,
            scale: 1,
            minimumPixelSize: 1,
        })
        viewer.scene.primitives.add(model);
        if (param.name != '标线') {
            var gif = param.image;
            var i = 0;
            var speed = 1;
            viewer.entities.add({
                name: param.name,
                id: param.id,
                parent: param.pname,
                position: zccity.Cartesian3.fromDegrees(param.x, param.y, (param.z + 50)), //广告牌坐标
                billboard: {
                    show: customParams.showIcon,
                    image: new zccity.CallbackProperty(() => {
                        if (gif != undefined && gif.length) {
                            if (i < speed * (gif.length - 1)) {
                                i++
                            } else {
                                i = 0
                            }
                            return gif[Math.floor(i / speed)]
                        } else {
                            return param.url //因为loadGif是异步的，在解析完成之前先使用原图
                        }
                    }, false),
                    scale: param.scale,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY, //广告牌不进行深度检测
                    heightReference: zccity.HeightReference.RELATIVE_TO_GROUND
                },
                label: {
                    show: customParams.showLabel,
                    text: param.name,
                    font: 'normal 32px Microsoft YaHei',
                    style: zccity.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 7,
                    outlineColor: new zccity.Color(0, 0, 0, 0.6),
                    fillColor: zccity.Color.WHITE,
                    verticalOrigin: zccity.VerticalOrigin.BOTTOM,
                    horizontalOrigin: zccity.HorizontalOrigin.CENTER, //水平位置
                    //中心位置
                    pixelOffset: new zccity.Cartesian2(0, -10),
                    scale: 0.5,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                }
            });
            var entitys = viewer.entities.values;
            entitys.forEach(entity => {
                if (entity._name == '挡板') {
                    entity.label = null;
                }
            });
        }
        model.readyPromise.then(function (model) {
            let m = model.modelMatrix;
            let m1 = zccity.Matrix3.fromRotationZ(zccity.Math.toRadians(param.a));
            zccity.Matrix4.multiplyByMatrix3(m, m1, m);
            model.modelMatrix = m;
            const scale = zccity.Matrix4.fromScale(new zccity.Cartesian3(param.sx, param.sy, 1), new zccity.Matrix4)
            model.modelMatrix = zccity.Matrix4.multiply(model.modelMatrix, scale, model.modelMatrix)
        }).otherwise(function (error) { });
        return model;
    },
    //添加场景
    addScene: function () {
        function update3dtilesMaxtrix(params) {
            //旋转
            let mx = zccity.Matrix3.fromRotationX(zccity.Math.toRadians(params.rx));
            let my = zccity.Matrix3.fromRotationY(zccity.Math.toRadians(params.ry));
            let mz = zccity.Matrix3.fromRotationZ(zccity.Math.toRadians(params.rz));
            let rotationX = zccity.Matrix4.fromRotationTranslation(mx);
            let rotationY = zccity.Matrix4.fromRotationTranslation(my);
            let rotationZ = zccity.Matrix4.fromRotationTranslation(mz);
            //平移
            let position = zccity.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
            let m = zccity.Transforms.eastNorthUpToFixedFrame(position);
            let scale = zccity.Matrix4.fromUniformScale(params.scale);
            //缩放
            zccity.Matrix4.multiply(m, scale, m);
            //旋转、平移矩阵相乘
            zccity.Matrix4.multiply(m, rotationX, m);
            zccity.Matrix4.multiply(m, rotationY, m);
            zccity.Matrix4.multiply(m, rotationZ, m);
            //赋值给tileset
            return m;
        };
        let params = {
            //东浪
            tx: 122.11860396909464,
            ty: 29.788795797693307,
            tz: -10, //模型中心Z轴坐标（高程，单位：米）
            rx: 0, //X轴（经度）方向旋转角度（单位：度）
            ry: 0, //Y轴（纬度）方向旋转角度（单位：度）
            rz: 0.5, //Z轴（高程）方向旋转角度（单位：度）
            scale: 1
        };
        let params2 = {
            //西白莲
            tx: 122.16289615296411,
            ty: 29.803282041221667,
            tz: -10,
            rx: 0, //X轴（经度）方向旋转角度（单位：度）
            ry: 0, //Y轴（纬度）方向旋转角度（单位：度）
            rz: 0, //Z轴（高程）方向旋转角度（单位：度）
            scale: 1
        };
        var orientation = {
            heading: 0.506831631640484,
            pitch: -0.19278958729486995,
            roll: 0.0014299115518028316,
        };
        var model = new zccity.Cesium3DTileset({
            url: "/3d/model/changjing/donglang_point/tileset.json",
            dynamicScreenSpaceError: true,
            dynamicScreenSpaceErrorDensity: 0.00278,
            dynamicScreenSpaceErrorFactor: 4.0,
            dynamicScreenSpaceErrorHeightFalloff: 0.25,
            maximumScreenSpaceError: 8, // 数值加大，能让最终成像变模糊
            maximumMemoryUsage: 8192, // 内存分配变小有利于倾斜摄影数据回收，提升性能体验
        });
        viewer.scene.primitives.add(model);
        viewer.scene.camera.setView({
            orientation: orientation,
            destination: new zccity.Cartesian3(-2945601.4322475917, 4694216.411159021, 3148342.970942407),
        });
        model.readyPromise.then(function (model) {
            model._root.transform = update3dtilesMaxtrix(params)
        }).otherwise(function (error) {
            console.log(error);
        });
        var model2 = new zccity.Cesium3DTileset({
            url: "/3d/model/changjing/xibailian/tileset.json",

        });
        viewer.scene.primitives.add(model2);
        model2.readyPromise.then(function (model2) {
            model2._root.transform = update3dtilesMaxtrix(params2)
        }).otherwise(function (error) {
            console.log(error);
        });
        return model
    },
    //添加揽桩
    addPackage: function (param, entityLZ) {
        paramlist.push(param)
        var entity_model = zccity.clone(entityLZ.model);
        entity_model.scale = param.scale2 ? param.scale2 : 1;
        var position = zccity.Cartesian3.fromDegrees(param.lat, param.lng, param.height);
        if (param.heading == undefined && param.id == undefined)
            return;
        var heading = zccity.Math.toRadians(param.heading);
        var pitch = 0;
        var roll = 0;
        var hpr = new zccity.HeadingPitchRoll(heading, pitch, roll);
        var orientation = zccity.Transforms.headingPitchRollQuaternion(position, hpr);
        var model = viewer.entities.add({
            id: "lanzhuang" + param.id,
            name: param.name,
            position: position,
            orientation: orientation,
            model: entity_model,
        });
        return model
    },
    //门机模型
    addMenJi: function (param, entitym, customParams) {
        paramlist.push(param)
        var gif = param.image;
        var i = 0;
        var speed = 1;
        var entity_model = zccity.clone(entitym.model);
        entity_model.scale = param.scale2 ? param.scale2 : 1;
        var position = zccity.Cartesian3.fromDegrees(param.lat, param.lng, param.height);
        if (param.heading == undefined)
            return;
        var heading = zccity.Math.toRadians(param.heading);
        var pitch = 0;
        var roll = 0;
        var hpr = new zccity.HeadingPitchRoll(heading, pitch, roll);
        var orientation = zccity.Transforms.headingPitchRollQuaternion(position, hpr);
        var model = viewer.entities.add({
            id: param.id,
            name: param.name,
            position: position,
            orientation: orientation,
            model: entity_model
        });
        viewer.entities.add({
            name: param.name,
            id: 'label' + param.id,
            parent: param.pname,
            position: zccity.Cartesian3.fromDegrees(param.lat, param.lng, (param.height + 50)), //广告牌坐标
            billboard: {
                image: param.url,
                scale: param.scale,
                show: customParams.showIcon,
                disableDepthTestDistance: Number.POSITIVE_INFINITY, //广告牌不进行深度检测
                heightReference: zccity.HeightReference.RELATIVE_TO_GROUND
            },
            label: {
                show: customParams.showLabel,
                text: param.name,
                font: 'normal 32px Microsoft YaHei',
                style: zccity.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 7,
                outlineColor: new zccity.Color(0, 0, 0, 0.6),
                fillColor: zccity.Color.WHITE,
                verticalOrigin: zccity.VerticalOrigin.BOTTOM,
                horizontalOrigin: zccity.HorizontalOrigin.CENTER, //水平位置
                //中心位置
                pixelOffset: new zccity.Cartesian2(0, -10),
                scale: 0.5,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            metadata: 'AAA'
        });
        return model
    },
    //添加龙门吊模型
    addLongMenDiao: function (param1) {
        var model = zccity.Model.loadGltf({
            url: '/3d/model/LongMenDiao/' + param1.id + '.gltf',
            modelMatrix: zccity.Matrix4.fromTranslation(zccity.Cartesian3.fromDegrees(param1.lat, param1.lng, param1.height)),
            position: zccity.Cartesian3.fromDegrees(param1.lat, param1.lng, param1.height),
            id: "LongMenDiao" + param1.id,
            scale: 1,
            minimumPixelSize: 1,
        });
        viewer.scene.primitives.add(model);
        // var model = viewer.entities.add({
        //     position: zccity.Cartesian3.fromDegrees(param1.lat, param1.lng, (param1.height + 50)),
        //     label:{
        //         text: param1.name,
        //         font: 'normal 32px Microsoft YaHei',
        //         style: zccity.LabelStyle.FILL_AND_OUTLINE,
        //         outlineWidth: 7,
        //         outlineColor: new zccity.Color(0, 0, 0, 0.6),
        //         fillColor: zccity.Color.WHITE,
        //         verticalOrigin: zccity.VerticalOrigin.BOTTOM,
        //         horizontalOrigin: zccity.HorizontalOrigin.CENTER, //水平位置
        //         //中心位置
        //         pixelOffset: new zccity.Cartesian2(0, -10),
        //         scale: 0.5,
        //         disableDepthTestDistance: Number.POSITIVE_INFINITY,
        //     }
        // });
        return model
    },
}),
    //漫游相关
    (function () {
        //高空漫游
        zccityTools.prototype.manyou = function (positionsAll) {
            var positionA = positionsAll;
            var position = [];
            for (i = 0; i < positionA.length; i++) {
                var x = positionA[i][0];
                var y = positionA[i][1];
                position.push({
                    x: x,
                    y: y
                });
            }
            function computeCirclularFlight() {
                var property = new zccity.SampledPositionProperty();
                for (var i = 0; i < position.length; i++) {
                    if (i == 0) {
                        var time = zccity.JulianDate.addSeconds(start, i, new zccity.JulianDate());
                        var _position = zccity.Cartesian3.fromDegrees(position[i].x, position[i].y, 150);
                        property.addSample(time, _position); //时间 位置
                    } else {
                        var position_a = new zccity.Cartesian3(property._property._values[i * 3 - 3], property._property._values[i * 3 - 2], property._property._values[i * 3 - 1]);
                        var _position = zccity.Cartesian3.fromDegrees(position[i].x, position[i].y, 150);
                        var positions = [zccity.Ellipsoid.WGS84.cartesianToCartographic(position_a), zccity.Ellipsoid.WGS84.cartesianToCartographic(_position)];
                        var a = new zccity.EllipsoidGeodesic(positions[0], positions[1]);
                        var long = a.surfaceDistance;
                        var _time = long / 8;
                        var time = zccity.JulianDate.addSeconds(property._property._times[i - 1], _time, new zccity.JulianDate());
                        property.addSample(time, _position);
                    }
                }
                property.setInterpolationOptions({
                    interpolationDegree: 3,
                    interpolationAlgorithm: zccity.HermitePolynomialApproximation
                });
                return property;
            }
            var start = zccity.JulianDate.fromDate(new Date(2017, 7, 11));
            var stop = zccity.JulianDate.addSeconds(start, 271, new zccity.JulianDate());

            //Make sure viewer is at the desired time.
            viewer.clock.startTime = start.clone();
            viewer.clock.stopTime = stop.clone();
            viewer.clock.currentTime = start.clone();
            viewer.clock.clockRange = zccity.ClockRange.LOOP_STOP; //Loop at the end
            viewer.clock.multiplier = 10;
            viewer.clock.canAnimate = false;

            var __position = computeCirclularFlight();
            // var __position;
            entityee = viewer.entities.add({
                //Set the entity availability to the same interval as the simulation time.
                availability: new zccity.TimeIntervalCollection([new zccity.TimeInterval({
                    start: start,
                    stop: stop
                })]),
                position: __position,
                orientation: new zccity.VelocityOrientationProperty(__position),
                model: {
                    uri: 'model/CesiumAir/Cesium_Air.gltf',
                    scale: 2,
                    minimumPixelSize: 64,
                    //heightReference: zccity.HeightReference.RELATIVE_TO_GROUND
                },
                //Show the path as a pink line sampled in 1 second increments.
                path: {
                    resolution: 1,
                    material: new zccity.PolylineGlowMaterialProperty({
                        glowPower: 0.1,
                        color: zccity.Color.RED
                    }),
                    width: 1
                }
            });
            viewer.trackedEntity = entityee;
            var matrix3Scratch = new zccity.Matrix3();
            var positionScratch = new zccity.Cartesian3();
            var orientationScratch = new zccity.Quaternion();
            function getModelMatrix(entity, time, result) {
                var position = zccity.Property.getValueOrUndefined(entityee.position, time, positionScratch);
                if (!zccity.defined(position)) {
                    return undefined;
                }
                var orientation = zccity.Property.getValueOrUndefined(entityee.orientation, time, orientationScratch);
                if (!zccity.defined(orientation)) {
                    result = zccity.Transforms.eastNorthUpToFixedFrame(position, undefined, result);
                } else {
                    result = zccity.Matrix4.fromRotationTranslation(zccity.Matrix3.fromQuaternion(orientation, matrix3Scratch), position, result);
                }
                return result;
            }
            var scratch = new zccity.Matrix4();
            var camera = viewer.scene.camera;
            function addevent() {
                getModelMatrix(entityee, viewer.clock.currentTime, scratch);
                var heading = zccity.Math.toRadians(45);
                var pitch = zccity.Math.toRadians(-45);
                var range = 2000;
                camera.lookAtTransform(scratch, new zccity.HeadingPitchRange(heading, pitch, range));
            }
            viewer.scene.preRender.addEventListener(addevent);
            this.addEvent = addevent;
        }
        //取消漫游
        zccityTools.prototype.stopfly = function () {
            viewer.trackedEntity = undefined;
            viewer.entities.remove(entityee);
            viewer.scene.preRender.removeEventListener(this.addEvent);
        }
        //键盘漫游
        var clock = function (viewer) {
            if (viewer) {
                return function () {
                    var ellipsoid = viewer.scene.globe.ellipsoid;
                    var canvas = viewer.canvas;
                    var camera = viewer.camera;
                    if (flags.looking) {
                        var width = canvas.clientWidth;
                        var height = canvas.clientHeight;
                        var x = (mousePosition.x - startMousePosition.x) / width;
                        var y = -(mousePosition.y - startMousePosition.y) / height;
                        var lookFactor = 0.05;
                        camera.lookRight(x * lookFactor);
                        camera.lookUp(y * lookFactor);
                    }
                    var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
                    var moveRate = cameraHeight / 50.0;
                    var angle = zccity.Math.PI / 450.0;
                    if (flags.moveForward) {
                        moveRate = cameraHeight / 30.0;
                        camera.moveForward(moveRate);
                    }
                    if (flags.moveBackward) {
                        moveRate = cameraHeight / 30.0;
                        camera.moveBackward(moveRate);
                    }
                    if (flags.moveLeft) {
                        camera.moveLeft(moveRate);
                    }
                    if (flags.moveRight) {
                        camera.moveRight(moveRate);
                    }
                    if (flags.lookUp) {
                        camera.lookUp(angle);
                    }
                    if (flags.lookDown) {
                        camera.lookDown(angle);
                    }
                    if (flags.lookLeft) {
                        camera.lookLeft(angle);
                    }
                    if (flags.lookRight) {
                        camera.lookRight(angle);
                    }
                }
            } else {
                return null;
            }
        }
        // polyline对象
        var loadPoi = (function () {
            function _(positions) {
                this.options = {
                    position: null,
                    model: {
                        uri: "model/CesiumBalloon.glb",
                        minimumPixelSize: 100,
                        maximumScale: 100,
                        scale: 0.02
                    }
                };
                this.positions = positions;
                this._init();
            }

            _.prototype._init = function () {
                var _self = this;
                var _update = function () {
                    return _self.positions[positions.length - 1];
                };
                //实时更新polyline.positions  
                this.options.position = new zccity.CallbackProperty(_update, false);
                var entity = viewer.entities.add(this.options);
                pois.push(entity);
            };

            return _;
        })()
        var startMousePosition;
        var mousePosition;
        var flags = {
            looking: false,
            moveForward: false,
            moveBackward: false,
            //		moveUp: false,
            //		moveDown: false,
            moveLeft: false,
            moveRight: false,

            lookUp: false,
            lookDown: false,
            lookLeft: false,
            lookRight: false
        };

        var pois = [];

        var positions = [];

        var keyBoard = null;

        function removeEntities(viewer, entities) {
            for (var i = entities.length - 1; i >= 0; i--) {
                viewer.entities.remove(entities[i]);
            }
        }
        zccityTools.prototype.gotoPoi = function () {
            const viewer = this.viewer;
            let scope = this;
            let handler = scope.handler;

            let balloon = void 0;
            if (handler.isDestroyed()) {
                handler = new zccity.ScreenSpaceEventHandler(viewer.scene.canvas);
                scope.handler = handler
            }
            return new Promise(function (callback) {
                handler.setInputAction(function (movement) {

                    //					removeEntities(viewer, pois);

                    let cartesian, pickedObject;
                    pickedObject = viewer.scene.pick(movement.endPosition);
                    if (pickedObject && zccity.defined(pickedObject) && pickedObject.primitive && pickedObject.primitive.IS3D) {
                        cartesian = viewer.scene.pickPosition(movement.endPosition)
                    } else {
                        let ray = viewer.camera.getPickRay(movement.endPosition);
                        cartesian = viewer.scene.globe.pick(ray, viewer.scene)
                    }
                    if (!cartesian) {
                        return false
                    }
                    positions.push(cartesian);

                    if (!zccity.defined(balloon)) {
                        balloon = new loadPoi(positions);
                    } else {
                        positions.pop();
                        positions.push(cartesian);
                    }

                    //					var poi = viewer.entities.add({
                    //						position: new zccity.CallbackProperty(function(time, result) {
                    //							return cartesian;
                    //						}, false),
                    //						model: {
                    //							uri: "models/CesiumBalloon.glb",
                    //							minimumPixelSize: 30,
                    //							maximumScale: 500,
                    //							scale: 0.002
                    //						}
                    //					});
                    //					pois.push(poi);

                }, zccity.ScreenSpaceEventType.MOUSE_MOVE);
                handler.setInputAction(function (movement) {
                    let cartesian, pickedObject;
                    pickedObject = viewer.scene.pick(movement.position);
                    if (pickedObject && zccity.defined(pickedObject) && pickedObject.primitive && pickedObject.primitive.IS3D) {
                        cartesian = viewer.scene.pickPosition(movement.position)
                    } else {
                        let ray = viewer.camera.getPickRay(movement.position);
                        cartesian = viewer.scene.globe.pick(ray, viewer.scene)
                        //alert("点击三维");
                    }
                    if (!cartesian) {
                        return false
                    }

                    removeEntities(viewer, pois);

                    var poi = viewer.entities.add({
                        position: cartesian,
                        model: {
                            uri: "model/CesiumBalloon.glb",
                            minimumPixelSize: 30,
                            maximumScale: 30,
                            scale: 0.2
                        }
                    });
                    pois.push(poi);
                    handler.destroy();
                    callback(cartesian);
                }, zccity.ScreenSpaceEventType.LEFT_CLICK);
            })
        },

            zccityTools.prototype.start = function (cartesian) {
                const viewer = this.viewer;
                let scope = this;
                let handler = scope.handler;
                viewer.scene.screenSpaceCameraController.enableTilt = false;
                removeEntities(viewer, pois);

                //			var heading = zccity.Math.toRadians(0.0);
                //			var pitch = zccity.Math.toRadians(0.0);
                //			var range = 1.0;
                var cartographic = zccity.Cartographic.fromCartesian(cartesian)
                if (cartographic) {
                    var lon = zccity.Math.toDegrees(cartographic.longitude)
                    var lat = zccity.Math.toDegrees(cartographic.latitude)
                    var h = cartographic.height;
                }
                viewer.camera.flyTo({
                    destination: zccity.Cartesian3.fromDegrees(lon, lat, 1000),
                    orientation: {
                        heading: zccity.Math.toRadians(0.0),
                        pitch: zccity.Math.toRadians(-60.0),
                        roll: zccity.Math.toRadians(0.0)
                    }
                });

                if (handler.isDestroyed()) {
                    handler = new zccity.ScreenSpaceEventHandler(viewer.scene.canvas);
                    scope.handler = handler
                }

                keyBoard = clock(viewer);
                if (!keyBoard) {
                    return false;
                }
                var canvas = viewer.canvas;
                canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
                canvas.onclick = function () {
                    canvas.focus();
                };

                viewer.scene.screenSpaceCameraController.enableRotate = false;
                viewer.scene.screenSpaceCameraController.enableTranslate = false;
                viewer.scene.screenSpaceCameraController.enableZoom = false;
                viewer.scene.screenSpaceCameraController.enableTilt = false; //倾斜相机
                viewer.scene.screenSpaceCameraController.enableLook = false; //平移或旋转来更改摄像机视图方向

                handler.setInputAction(function (movement) {
                    flags.looking = true;
                    mousePosition = startMousePosition = zccity.Cartesian3.clone(movement.position);
                }, zccity.ScreenSpaceEventType.LEFT_DOWN);

                handler.setInputAction(function (movement) {
                    mousePosition = movement.endPosition;
                }, zccity.ScreenSpaceEventType.MOUSE_MOVE);

                handler.setInputAction(function (position) {
                    flags.looking = false;
                }, zccity.ScreenSpaceEventType.LEFT_UP);

                var angle = zccity.Math.PI / 450.0;

                function getFlagForKeyCode(keyCode) {
                    switch (keyCode) {
                        //					case 33:
                        //					case 'Q'.charCodeAt(0):
                        //						return 'moveUp';
                        //
                        //					case 34:
                        //					case 'E'.charCodeAt(0):
                        //						return 'moveDown';
                        case 37:
                            return "lookLeft";
                        case 'A'.charCodeAt(0):
                            return 'moveLeft';

                        case 38:
                            return "lookUp";
                        case 'W'.charCodeAt(0):
                            return 'moveForward';

                        case 39:
                            return "lookRight";
                        case 'D'.charCodeAt(0):
                            return 'moveRight';

                        case 40:
                            return "lookDown";
                        case 'S'.charCodeAt(0):
                            return 'moveBackward';

                        default:
                            return undefined;
                    }
                }
                document.addEventListener('keydown', function (e) {
                    var flagName = getFlagForKeyCode(e.keyCode);
                    if (typeof flagName !== 'undefined') {
                        flags[flagName] = true;
                    }
                }, false);
                document.addEventListener('keyup', function (e) {
                    var flagName = getFlagForKeyCode(e.keyCode);
                    if (typeof flagName !== 'undefined') {
                        flags[flagName] = false;
                    }
                }, false);
                viewer.clock.onTick.addEventListener(keyBoard);
            },
            zccityTools.prototype.end = function () {
                const viewer = this.viewer;
                let scope = this;
                let handler = scope.handler;
                removeEntities(viewer, pois);
                pois = [];
                if (!handler.isDestroyed()) {
                    handler.destroy();
                }
                if (!keyBoard) {
                    return false;
                }
                viewer.scene.screenSpaceCameraController.enableRotate = true;
                viewer.scene.screenSpaceCameraController.enableTranslate = true;
                viewer.scene.screenSpaceCameraController.enableZoom = true;
                viewer.scene.screenSpaceCameraController.enableTilt = true; //倾斜相机
                viewer.scene.screenSpaceCameraController.enableLook = true; //平移或旋转来更改摄像机视图方向
                viewer.clock.onTick.removeEventListener(keyBoard);
                keyBoard = null;
            }
    })(),
    //量测相关
    (function () {
        //变量初始化
        var tempEntities = [],
            measureLabel = [];
        window.isMeasure = false;
        //创建面要素
        var createPolygon = (function () {
            function _(positions) {
                if (!zccity.defined(positions)) {
                    throw new zccity.DeveloperError('positions is required!');
                }
                if (positions.length < 3) {
                    throw new zccity.DeveloperError('positions 的长度必须大于等于3');
                }

                this.options = {
                    polygon: {
                        show: true,
                        hierarchy: undefined,
                        outline: true,
                        outlineColor: zccity.Color.RED,
                        outlineWidth: 2,
                        //					perPositionHeight: true, //指定是否使用每个位置的高度
                        material: zccity.Color.YELLOW.withAlpha(0.4),

                        classificationType: zccity.ClassificationType.BOTH
                    }
                };
                this.path = positions;
                this.hierarchy = positions;
                this._init();
            }

            _.prototype._init = function () {
                var _self = this;
                // var _update = function () {
                //     return _self.hierarchy;
                // };
                var _update = function () {
                    return new zccity.PolygonHierarchy(_self.hierarchy, []);
                };

                //实时更新polygon.hierarchy
                //new zccity.CallbackProperty(_update, false) 当_update返回值变化时执行
                this.options.polygon.hierarchy = new zccity.CallbackProperty(_update, false);

                //			this.options.polygon.classificationType= zccity.ClassificationType.BOTH;
                var entity = viewer.entities.add(this.options);

                tempEntities.push(entity);
            };

            return _;
        })();
        window.polylineEntity;
        //创建线要素类
        var createPolyLine = (function () {
            function _(positions, type) {
                //空间线
                this.options = {
                    polyline: {
                        show: true,
                        positions: [],
                        width: 3,
                        material: new zccity.PolylineOutlineMaterialProperty({
                            color: zccity.Color.YELLOW //渲染线样色
                        }),
                        depthFailMaterial: new zccity.PolylineOutlineMaterialProperty({
                            color: zccity.Color.YELLOW, //渲染被遮挡时线颜色
                        }),
                    }
                };
                this.type = type;
                this.positions = positions;
                this._init();
            }
            _.prototype._init = function () {
                var _self = this;
                var _update = function () {
                    return _self.positions;
                };

                if (_self.type === "move") {
                    this.options.polyline.positions = new zccity.CallbackProperty(_update, false);
                    var clickEntity = viewer.entities.add(this.options);
                    tempEntities.push(clickEntity);
                } else {
                    this.options.polyline.positions = _update();
                    var clickEntity = viewer.entities.add(this.options);
                    tempEntities.push(clickEntity);
                }


                //实时更新polyline.positions  
                //			this.options.polyline.positions = _update();
                //			let points = new zccity.CallbackProperty(_update, false);
                //			this.options.polyline.depthFailMaterial = new zccity.PolylineOutlineMaterialProperty({
                //				color: zccity.Color.RED,
                //			});

                // 			if (!zccity.defined(window.polylineEntity)) {
                // 				window.polylineEntity = viewer.entities.add(this.options);
                // 			} else {
                // 				window.polylineEntity.polyline.positions = _update();
                // 			}


                //			scene.clampToHeightMostDetailed(points).then(function(clampedCartesians) {
                //				this.options.polyline.positions = clampedCartesians;
                //				var entity = viewer.entities.add(this.options);
                // tempEntities.push(window.polylineEntity);
                //			});
            };
            return _;
        })();
        //创建三角小要素
        var PolylinePrimitive = (function () {
            function _(positions) {
                this.options = {
                    name: '空间线',
                    polyline: {
                        show: true,
                        positions: [],
                        material: new zccity.PolylineOutlineMaterialProperty({
                            color: zccity.Color.GOLD
                        }),
                        depthFailMaterial: new zccity.PolylineOutlineMaterialProperty({
                            color: zccity.Color.GOLD,
                        }),
                        width: 2
                    },
                    label: {
                        font: '12px sans-serif',
                        fillColor: zccity.Color.GOLD,
                        style: zccity.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        showBackground: true,
                        verticalOrigin: zccity.VerticalOrigin.BOTTOM,
                        pixelOffset: new zccity.Cartesian2(10, -10),
                        // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    }
                };

                //垂直线
                this.vertical = {
                    name: '垂直线',
                    polyline: {
                        show: true,
                        positions: [],
                        material: new zccity.PolylineOutlineMaterialProperty({
                            color: zccity.Color.GOLD
                        }),
                        depthFailMaterial: new zccity.PolylineOutlineMaterialProperty({
                            color: zccity.Color.GOLD,
                        }),
                        width: 2
                    },
                    label: {
                        font: '12px sans-serif',
                        fillColor: zccity.Color.GOLD,
                        style: zccity.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        showBackground: true,
                        verticalOrigin: zccity.VerticalOrigin.BOTTOM,
                        pixelOffset: new zccity.Cartesian2(10, -10),
                        // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    }
                }
                //水平线
                this.level = {
                    name: '水平线',
                    polyline: {
                        show: true,
                        positions: [],
                        material: new zccity.PolylineOutlineMaterialProperty({
                            color: zccity.Color.GOLD
                        }),
                        depthFailMaterial: new zccity.PolylineOutlineMaterialProperty({
                            color: zccity.Color.GOLD,
                        }),
                        width: 2
                    },
                    label: {
                        font: '12px sans-serif',
                        fillColor: zccity.Color.GOLD,
                        style: zccity.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        showBackground: true,
                        verticalOrigin: zccity.VerticalOrigin.BOTTOM,
                        pixelOffset: new zccity.Cartesian2(2, -10),
                        // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    }
                }
                this.positions = positions;
                this._init();
            }
            _.prototype._init = function () {
                var _self = this;

                var _update = function () {
                    return _self.positions;
                };
                var _update_label = function () {
                    let points = _self.positions;
                    //				let mid=zccity.Cartesian3.midpoint(points[0],points[points.length-1]);
                    return _self.positions[0];
                };
                var _text = function () {
                    var text_temp = GetDistance(_self.positions);
                    text_temp = "空间距离：" + text_temp + "米";
                    return text_temp;
                };
                var _update_level = function () {
                    let poi = point_conf(_self.positions).poi;
                    let levels = [_self.positions[_self.positions.length - 1], poi];
                    return levels;
                };
                var _update_level_label = function () {
                    let datas = point_conf(_self.positions);
                    let poi = datas.poi;
                    let type = datas.type;
                    //				let levels = [_self.positions[_self.positions.length - 1], poi];
                    if (type === "first") {
                        return poi;
                    }
                    if (type === "end") {
                        return _self.positions[1];
                    }

                    //				let mid = zccity.Cartesian3.midpoint(levels[0], poi);
                    //				return mid;
                };
                var _text_level = function () {
                    let datas = point_conf(_self.positions);
                    let poi = datas.poi;
                    let type = datas.type;
                    let levels;
                    if (type === "first") {
                        levels = [_self.positions[0], poi];
                    }
                    if (type === "end") {
                        levels = [_self.positions[1], poi];
                    }

                    var text_temp = GetDistance(levels);
                    text_temp = "水平距离：" + text_temp + "米";
                    return text_temp;
                };
                var _update_vertical = function () {
                    let poi = point_conf(_self.positions).poi;
                    let verticals = [_self.positions[0], poi];
                    return verticals;
                };
                var _update_vertical_label = function () {
                    let datas = point_conf(_self.positions);
                    let poi = datas.poi;
                    let type = datas.type;
                    //				let levels = [_self.positions[_self.positions.length - 1], poi];
                    if (type === "first") {
                        return _self.positions[1];
                    }
                    if (type === "end") {
                        return poi;
                    }
                    //				let verticals = [_self.positions[0], poi];
                    //				return verticals[1];
                    //				return verticals[1];

                    //				return zccity.Cartesian3.midpoint(verticals[0],verticals[verticals.length-1]);
                };
                var _text_vertical = function () {
                    let datas = point_conf(_self.positions);
                    let poi = datas.poi;
                    let type = datas.type;
                    let verticals;
                    if (type === "first") {
                        verticals = [_self.positions[1], poi];
                    }
                    if (type === "end") {
                        verticals = [_self.positions[0], poi];
                    }
                    var text_temp = GetDistance(verticals);
                    text_temp = "垂直距离：" + text_temp + "米";
                    return text_temp;
                };

                //实时更新polygon.hierarchy
                this.options.polyline.positions = new zccity.CallbackProperty(_update, false);
                this.options.position = new zccity.CallbackProperty(_update_label, false);
                this.options.label.text = new zccity.CallbackProperty(_text, false);

                var entity = viewer.entities.add(this.options);

                this.vertical.polyline.positions = new zccity.CallbackProperty(_update_vertical, false);
                this.vertical.position = new zccity.CallbackProperty(_update_vertical_label, false);
                this.vertical.label.text = new zccity.CallbackProperty(_text_vertical, false);
                var entity1 = viewer.entities.add(this.vertical);

                this.level.polyline.positions = new zccity.CallbackProperty(_update_level, false);
                this.level.position = new zccity.CallbackProperty(_update_level_label, false);
                this.level.label.text = new zccity.CallbackProperty(_text_level, false);
                var entity2 = viewer.entities.add(this.level);

                tempEntities.push(entity, entity1, entity2);
            };
            return _;
        })();
        //生成直角点
        function point_conf(pos) {
            var result = {};
            if (pos.length > 0) {
                var first = pos[0];
                var endpoi = pos[pos.length - 1];

                var firstCar = zccity.Cartographic.fromCartesian(first);
                var firlng = zccity.Math.toDegrees(firstCar.longitude); //经度值
                var firlat = zccity.Math.toDegrees(firstCar.latitude); //纬度值

                //height结果与cartographic.height相差无几，注意：cartographic.height可以为0，也就是说，可以根据经纬度计算出高程。
                var firheight = firstCar.height;
                //			var b=viewer.scene.globe.getHeight(firstCar);

                var endCar = zccity.Cartographic.fromCartesian(endpoi);
                var endlng = zccity.Math.toDegrees(endCar.longitude); //经度值
                var endlat = zccity.Math.toDegrees(endCar.latitude); //纬度值
                //height结果与cartographic.height相差无几，注意：cartographic.height可以为0，也就是说，可以根据经纬度计算出高程。
                var endheight = endCar.height;
                //			var a=viewer.scene.globe.getHeight(endCar);

                if (firheight > endheight) {
                    //				var height = viewer.scene.globe.getHeight(cartographic);
                    let poi = zccity.Cartesian3.fromDegrees(endlng, endlat, firheight);
                    result["type"] = "first";
                    result["poi"] = poi;
                } else {
                    let poi = zccity.Cartesian3.fromDegrees(firlng, firlat, endheight);
                    result["type"] = "end";
                    result["poi"] = poi;
                }

            }
            return result;
        }
        //获取两点间距离
        function GetDistance(positions) {
            var distance = 0;
            for (var i = 0; i < positions.length - 1; i++) {
                distance += zccity.Cartesian3.distance(positions[i], positions[i + 1]);
            }
            return distance;
        }
        var getDistance = GetDistance;
        //微元法求面积
        var countAreaInCartesian3 = function (ps) {
            var s = 0;
            for (var i = 0; i < ps.length; i++) {
                var p1 = ps[i];
                var p2;
                if (i < ps.length - 1)
                    p2 = ps[i + 1];
                else
                    p2 = ps[0];
                s += p1.x * p2.y - p2.x * p1.y;
            }
            return Math.abs(s / 2);
        }
        zccityTools.prototype.measure = function (type, cons) {
            const viewer = this.viewer;
            let scope = this;
            let positions = [];
            let handler = scope.handler;
            let newhandler;
            let pushPoi = [];
            if (window.isMeasure) {
                if (!handler.isDestroyed()) {
                    handler.removeInputAction(zccity.ScreenSpaceEventType.MOUSE_MOVE);
                    handler.removeInputAction(zccity.ScreenSpaceEventType.LEFT_CLICK);
                    handler.destroy(); //关闭事件句柄
                }
                positions = [];
                window.isMeasure = false;
            }
            if (handler.isDestroyed()) {
                handler = new zccity.ScreenSpaceEventHandler(viewer.scene.canvas);
            }
            scope.removeEntities(viewer, tempEntities);
            scope.removeEntities(viewer, measureLabel);
            window.polylineEntity = void 0;
            if (type === "polyline") {
                let distance = 0;
                let poly, movePoly, movePoint;
                window.isMeasure = true;
                handler.setInputAction(function (movement) {
                    // console.log('aaa', arguments);
                    let cartesian, pickedObject;
                    pickedObject = viewer.scene.pick(movement.endPosition);
                    // if (pickedObject && viewer.scene.pickPositionSupported && zccity.defined(pickedObject)) {
                    //     cartesian = viewer.scene.pickPosition(movement.endPosition);
                    // } else {
                    let ray = viewer.camera.getPickRay(movement.endPosition);
                    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                    //}
                    if (!cartesian) {
                        return false;
                    }
                    if (positions.length === 0) {
                        return false;
                    }
                    if (positions.length === 1) {
                        positions.push(cartesian.clone());
                    }
                    if (positions.length >= 2) {

                        if (!zccity.defined(movePoly)) {
                            movePoly = new createPolyLine(positions, "move");
                        } else {
                            positions.push(cartesian.clone());
                            positions.pop();
                        }
                    }
                }, zccity.ScreenSpaceEventType.MOUSE_MOVE);

                handler.setInputAction(function (movement) {
                    let cartesian, pickedObject;
                    pickedObject = viewer.scene.pick(movement.position);
                    let ray = viewer.camera.getPickRay(movement.position);
                    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                    var cartographic = zccity.Cartographic.fromCartesian(cartesian);
                    var lng = zccity.Math.toDegrees(cartographic.longitude);
                    var lat = zccity.Math.toDegrees(cartographic.latitude);
                    pushPoi.push({
                        lat: lat,
                        lng: lng
                    })
                    if (!cartesian) {
                        return false;
                    }
                    positions.pop();
                    positions.push(cartesian.clone());
                    distance += getDistance(positions);
                    if (positions.length === 1) {
                        let floatingPoint = viewer.entities.add({
                            name: '空间直线距离',
                            position: positions[positions.length - 1],
                            point: {
                                pixelSize: 5,
                                color: zccity.Color.RED,
                                outlineColor: zccity.Color.WHITE,
                                outlineWidth: 2,
                                heightReference: zccity.HeightReference.CLAMP_TO_GROUND,
                                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                            },
                        });
                        measureLabel.push(floatingPoint);
                    }
                    if (positions.length === 2) {
                        poly = new createPolyLine(positions);
                        //在三维场景中添加Label
                        var textDisance = distance.toFixed(2) + "米";
                        let floatingPoint = viewer.entities.add({
                            name: '空间直线距离',
                            position: positions[positions.length - 1],
                            point: {
                                pixelSize: 5,
                                color: zccity.Color.RED,
                                outlineColor: zccity.Color.WHITE,
                                outlineWidth: 2,
                                heightReference: zccity.HeightReference.CLAMP_TO_GROUND,
                                // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                            },
                            label: {
                                text: textDisance,
                                font: '18px sans-serif',
                                fillColor: zccity.Color.GOLD,
                                style: zccity.LabelStyle.FILL_AND_OUTLINE,
                                outlineWidth: 2,
                                verticalOrigin: zccity.VerticalOrigin.BOTTOM,
                                pixelOffset: new zccity.Cartesian2(5, -5),
                                heightReference: zccity.HeightReference.CLAMP_TO_GROUND,
                                // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                            }
                        });
                        measureLabel.push(floatingPoint);
                        let data = {
                            poi: pushPoi,
                            distance: textDisance
                        }
                        cons(data)
                        // 保留最后一个点位
                        let lastPoint = positions[positions.length - 1];
                        positions = [];
                        positions.push(lastPoint);
                        movePoly = void 0;
                        // handler.destroy(); //关闭事件句柄
                        // handler = undefined;
                        // positions.pop();
                        // positions = [];
                        // pushPoi = [];
                        // window.isMeasure = false;
                    }
                }, zccity.ScreenSpaceEventType.LEFT_CLICK);
                handler.setInputAction(function (movement) {
                    let cartesian, pickedObject;
                    pickedObject = viewer.scene.pick(movement.position);
                    // if (pickedObject && viewer.scene.pickPositionSupported && zccity.defined(pickedObject)) {
                    // 	cartesian = viewer.scene.pickPosition(movement.position);
                    // } else {
                    let ray = viewer.camera.getPickRay(movement.position);
                    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                    console.log(cartesian)
                    //					cartesian = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
                    //}
                    if (!cartesian) {
                        return false;
                    }
                    //				positions.pop()
                    positions.push(cartesian);
                    positions.pop(positions[1]);
                    distance += getDistance(positions);
                    console.log(positions)
                    poly = new createPolyLine(positions);

                    if (positions.length >= 2) {
                        //在三维场景中添加Label
                        var textDisance = distance.toFixed(2) + "米";
                        let floatingPoint = viewer.entities.add({
                            name: '空间直线距离',
                            position: positions[positions.length - 1],
                            point: {
                                pixelSize: 5,
                                color: zccity.Color.RED,
                                outlineColor: zccity.Color.WHITE,
                                outlineWidth: 2,
                                heightReference: zccity.HeightReference.CLAMP_TO_GROUND,
                                // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                            },
                            label: {
                                text: textDisance,
                                font: '18px sans-serif',
                                fillColor: zccity.Color.GOLD,
                                style: zccity.LabelStyle.FILL_AND_OUTLINE,
                                outlineWidth: 2,
                                verticalOrigin: zccity.VerticalOrigin.BOTTOM,
                                pixelOffset: new zccity.Cartesian2(5, -5),
                                heightReference: zccity.HeightReference.CLAMP_TO_GROUND,
                                // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                            }
                        });

                        measureLabel.push(floatingPoint);
                        handler.destroy(); //关闭事件句柄
                        positions = [];
                        window.isMeasure = false;
                    } else {
                        positions.pop();
                    }
                    // positions.pop(); //最后一个点无效
                }, zccity.ScreenSpaceEventType.RIGHT_CLICK);
            }

            /** 靠泊测距--start */
            if (type === "berthing") {
                let distance = 0;
                let poly, movePoly, movePoint;
                window.isMeasure = true;
                handler.setInputAction(function (movement) {
                    let cartesian, pickedObject;
                    pickedObject = viewer.scene.pick(movement.endPosition);
                    let ray = viewer.camera.getPickRay(movement.endPosition);
                    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                    if (!cartesian) {
                        return false;
                    }
                    if (positions.length === 0) {
                        return false;
                    }
                    if (positions.length === 1) {
                        positions.push(cartesian.clone());
                    }
                    if (positions.length >= 2) {
                        if (!zccity.defined(movePoly)) {
                            movePoly = new createPolyLine(positions, "move");
                        } else {
                            positions.push(cartesian.clone());
                            positions.pop();
                        }
                    }
                }, zccity.ScreenSpaceEventType.MOUSE_MOVE);
                handler.setInputAction(function (movement) {
                    let cartesian, pickedObject;
                    pickedObject = viewer.scene.pick(movement.position);
                    let ray = viewer.camera.getPickRay(movement.position);
                    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                    var cartographic = zccity.Cartographic.fromCartesian(cartesian);
                    var lng = zccity.Math.toDegrees(cartographic.longitude);
                    var lat = zccity.Math.toDegrees(cartographic.latitude);
                    pushPoi.push({
                        lat: lat,
                        lng: lng
                    });

                    if (!cartesian) {
                        return false;
                    }
                    positions.pop();
                    positions.push(cartesian.clone());
                    distance += getDistance(positions);
                    if (positions.length === 1) {
                        let floatingPoint = viewer.entities.add({
                            name: '空间直线距离',
                            position: positions[positions.length - 1],
                            point: {
                                pixelSize: 5,
                                color: zccity.Color.RED,
                                outlineColor: zccity.Color.WHITE,
                                outlineWidth: 2,
                                heightReference: zccity.HeightReference.CLAMP_TO_GROUND,
                                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                            },
                        });
                        measureLabel.push(floatingPoint);
                    }
                    // if (positions.length === 2) {
                    //     poly = new createPolyLine(positions);
                    //     //在三维场景中添加Label
                    //     var textDisance = distance.toFixed(2) + "米";
                    //     let floatingPoint = viewer.entities.add({
                    //         name: '空间直线距离',
                    //         position: positions[positions.length - 1],
                    //         point: {
                    //             pixelSize: 5,
                    //             color: zccity.Color.RED,
                    //             outlineColor: zccity.Color.WHITE,
                    //             outlineWidth: 2,
                    //             heightReference: zccity.HeightReference.CLAMP_TO_GROUND,
                    //             // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    //         },
                    //         label: {
                    //             text: textDisance,
                    //             font: '18px sans-serif',
                    //             fillColor: zccity.Color.GOLD,
                    //             style: zccity.LabelStyle.FILL_AND_OUTLINE,
                    //             outlineWidth: 2,
                    //             verticalOrigin: zccity.VerticalOrigin.BOTTOM,
                    //             pixelOffset: new zccity.Cartesian2(5, -5),
                    //             heightReference: zccity.HeightReference.CLAMP_TO_GROUND,
                    //             // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    //         }
                    //     });
                    //     measureLabel.push(floatingPoint);
                    //     let data = {
                    //         poi: pushPoi,
                    //         distance: textDisance
                    //     }
                    //     cons && cons(data)
                    //     // 保留最后一个点位
                    //     let lastPoint = positions[positions.length - 1];
                    //     positions = [];
                    //     positions.push(lastPoint);
                    //     movePoly = void 0;
                    //     // handler.destroy(); //关闭事件句柄
                    //     // handler = undefined;
                    //     // positions.pop();
                    //     // positions = [];
                    //     // pushPoi = [];
                    //     // window.isMeasure = false;
                    // }

                    if (pushPoi.length >= 2) {
                        poly = new createPolyLine(positions);
                        //在三维场景中添加Label
                        var textDisance = distance.toFixed(2) + "米";
                        let floatingPoint = viewer.entities.add({
                            name: '空间直线距离',
                            position: positions[positions.length - 1],
                            point: {
                                pixelSize: 5,
                                color: zccity.Color.RED,
                                outlineColor: zccity.Color.WHITE,
                                outlineWidth: 2,
                                heightReference: zccity.HeightReference.CLAMP_TO_GROUND,
                                // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                            },
                            label: {
                                text: textDisance,
                                font: '18px sans-serif',
                                fillColor: zccity.Color.GOLD,
                                style: zccity.LabelStyle.FILL_AND_OUTLINE,
                                outlineWidth: 2,
                                verticalOrigin: zccity.VerticalOrigin.BOTTOM,
                                pixelOffset: new zccity.Cartesian2(5, -5),
                                heightReference: zccity.HeightReference.CLAMP_TO_GROUND,
                                // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                            }
                        });
                        measureLabel.push(floatingPoint);
                        let data = {
                            poi: pushPoi,
                            distance: textDisance
                        }
                        // 保留最后一个点位
                        let lastPoint = positions[positions.length - 1];
                        positions = [];
                        positions.push(lastPoint);
                        movePoly = void 0;


                        cons && cons(data)
                        handler.destroy();
                    }
                }, zccity.ScreenSpaceEventType.LEFT_CLICK);
                // handler.setInputAction(function (movement) {
                //     let cartesian, pickedObject;
                //     pickedObject = viewer.scene.pick(movement.position);
                //     let ray = viewer.camera.getPickRay(movement.position);
                //     cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                //     if (!cartesian) {
                //         return false;
                //     }
                //     positions.push(cartesian);
                //     positions.pop(positions[1]);
                //     distance += getDistance(positions);
                //     poly = new createPolyLine(positions);

                //     if (positions.length >= 2) {
                //         //在三维场景中添加Label
                //         var textDisance = distance.toFixed(2) + "米";
                //         let floatingPoint = viewer.entities.add({
                //             name: '空间直线距离',
                //             position: positions[positions.length - 1],
                //             point: {
                //                 pixelSize: 5,
                //                 color: zccity.Color.RED,
                //                 outlineColor: zccity.Color.WHITE,
                //                 outlineWidth: 2,
                //                 heightReference: zccity.HeightReference.CLAMP_TO_GROUND,
                //                 // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                //             },
                //             label: {
                //                 text: textDisance,
                //                 font: '18px sans-serif',
                //                 fillColor: zccity.Color.GOLD,
                //                 style: zccity.LabelStyle.FILL_AND_OUTLINE,
                //                 outlineWidth: 2,
                //                 verticalOrigin: zccity.VerticalOrigin.BOTTOM,
                //                 pixelOffset: new zccity.Cartesian2(5, -5),
                //                 heightReference: zccity.HeightReference.CLAMP_TO_GROUND,
                //                 // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                //             }
                //         });

                //         measureLabel.push(floatingPoint);
                //         handler.destroy(); //关闭事件句柄
                //         positions = [];
                //         window.isMeasure = false;
                //     } else {
                //         positions.pop();
                //     }
                //     // positions.pop(); //最后一个点无效
                // }, zccity.ScreenSpaceEventType.RIGHT_CLICK);
            }
            /** 靠泊测距--end */

            if (type === "polygon") {
                window.isMeasure = true;
                let polygon = void 0;
                handler.setInputAction(function (movement) {
                    let cartesian, pickedObject;
                    pickedObject = viewer.scene.pick(movement.endPosition);
                    // if (pickedObject && viewer.scene.pickPositionSupported && zccity.defined(pickedObject)) {
                    // 	cartesian = viewer.scene.pickPosition(movement.endPosition);
                    // } else {
                    let ray = viewer.camera.getPickRay(movement.endPosition);
                    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                    //}

                    if (!cartesian) {
                        return false;
                    }

                    if (positions.length >= 3) {
                        if (!zccity.defined(polygon)) {
                            polygon = new createPolygon(positions);
                        } else {
                            positions.pop();
                            positions.push(cartesian.clone());
                        }
                    }

                }, zccity.ScreenSpaceEventType.MOUSE_MOVE);

                handler.setInputAction(function (movement) {
                    let cartesian, pickedObject;
                    pickedObject = viewer.scene.pick(movement.position);
                    // if (pickedObject && viewer.scene.pickPositionSupported && zccity.defined(pickedObject)) {
                    //     cartesian = viewer.scene.pickPosition(movement.position);
                    // } else {
                    let ray = viewer.camera.getPickRay(movement.position);
                    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                    //}

                    if (!cartesian) {
                        return false;
                    }

                    if (positions.length == 0) {
                        positions.push(cartesian.clone());
                    } else {
                        positions.pop();
                        positions.push(cartesian.clone());
                    }
                    positions.push(cartesian.clone());

                    let floatingPoint = viewer.entities.add({
                        name: '面边界点',
                        position: positions[positions.length - 1],
                        point: {
                            pixelSize: 5,
                            color: zccity.Color.RED,
                            outlineColor: zccity.Color.WHITE,
                            outlineWidth: 2,
                            heightReference: zccity.HeightReference.CLAMP_TO_GROUND,
                            // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                        }
                    });
                    measureLabel.push(floatingPoint);

                }, zccity.ScreenSpaceEventType.LEFT_CLICK);

                handler.setInputAction(function (movement) {
                    let cartesian, pickedObject;
                    pickedObject = viewer.scene.pick(movement.position);
                    // if (pickedObject && viewer.scene.pickPositionSupported && zccity.defined(pickedObject)) {
                    //     cartesian = viewer.scene.pickPosition(movement.position);
                    // } else {
                    let ray = viewer.camera.getPickRay(movement.position);
                    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                    //					cartesian = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
                    //}

                    if (!cartesian) {
                        return false;
                    }

                    positions.pop();
                    positions.push(cartesian.clone());
                    if (positions.length >= 3) {
                        var mj = countAreaInCartesian3(positions);
                        var area = mj > 1000000 ? (mj / 1000000).toFixed(2) + 'km²' : mj.toFixed(2) + '㎡';
                        var lastpoint = viewer.entities.add({
                            name: '多边形面积',
                            position: positions[positions.length - 1],
                            point: {
                                pixelSize: 5,
                                color: zccity.Color.RED,
                                outlineColor: zccity.Color.WHITE,
                                outlineWidth: 2,
                                heightReference: zccity.HeightReference.CLAMP_TO_GROUND,
                                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                            },
                            label: {
                                text: area,
                                font: '18px sans-serif',
                                fillColor: zccity.Color.GOLD,
                                style: zccity.LabelStyle.FILL_AND_OUTLINE,
                                outlineWidth: 2,
                                showBackground: true,
                                verticalOrigin: zccity.VerticalOrigin.BOTTOM,
                                pixelOffset: new zccity.Cartesian2(10, -10),
                                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                            }
                        });
                        measureLabel.push(lastpoint);
                        handler.destroy(); //关闭事件句柄
                        positions = [];
                        window.isMeasure = false;
                    }
                }, zccity.ScreenSpaceEventType.RIGHT_CLICK);
            }

            if (type === "height") {
                var tempPoints = void 0; //保存直角点
                var floatingPoint = void 0; //浮动点
                var poly = null;
                window.isMeasure = true;
                handler.setInputAction(function (movement) {
                    let cartesian, pickedObject;
                    pickedObject = viewer.scene.pick(movement.endPosition);
                    if (pickedObject && viewer.scene.pickPositionSupported && zccity.defined(pickedObject)) {
                        cartesian = viewer.scene.pickPosition(movement.endPosition);
                    } else {
                        let ray = viewer.camera.getPickRay(movement.endPosition);
                        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                    }

                    if (!cartesian) {
                        return false;
                    }

                    if (positions.length >= 2) {
                        if (!zccity.defined(poly)) {
                            poly = new PolylinePrimitive(positions);
                        } else {
                            positions.pop();
                            positions.push(cartesian.clone());
                        }
                    }
                }, zccity.ScreenSpaceEventType.MOUSE_MOVE);

                handler.setInputAction(function (movement) {
                    let cartesian, pickedObject;
                    pickedObject = viewer.scene.pick(movement.position);
                    if (pickedObject && viewer.scene.pickPositionSupported && zccity.defined(pickedObject)) {
                        cartesian = viewer.scene.pickPosition(movement.position);
                    } else {
                        let ray = viewer.camera.getPickRay(movement.position);
                        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                        //					cartesian = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
                    }

                    if (!cartesian) {
                        return false;
                    }

                    if (positions.length == 0) {
                        positions.push(cartesian.clone());
                    } else {
                        positions.pop();
                        positions.push(cartesian.clone());
                        handler.destroy(); //关闭事件句柄
                        positions = [];
                        window.isMeasure = false;
                    }
                    positions.push(cartesian.clone());

                    let floatingPoint = viewer.entities.add({
                        name: '面边界点',
                        position: positions[positions.length - 1],
                        point: {
                            pixelSize: 5,
                            color: zccity.Color.RED,
                            outlineColor: zccity.Color.WHITE,
                            outlineWidth: 2,
                            heightReference: zccity.HeightReference.CLAMP_TO_GROUND,
                            // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                        }
                    });
                    measureLabel.push(floatingPoint);
                }, zccity.ScreenSpaceEventType.LEFT_CLICK);
            }
            if (type === "clean") {
                scope.removeEntities(viewer, tempEntities);
                scope.removeEntities(viewer, measureLabel);
            }
        }
    })(),
    //坐标点记录
    (function () {
        var addpois = [];
        var jsonData = [];
        // var saveHandler;
        zccityTools.prototype.savePois = function () {
            var handler = new zccity.ScreenSpaceEventHandler(viewer.canvas);
            handler.setInputAction(function (evt) {
                var scene = viewer.scene;
                if (scene.mode !== zccity.SceneMode.MORPHING) {
                    var pickedObject = scene.pick(evt.position);
                    // if (scene.pickPositionSupported && zccity.defined(pickedObject) && pickedObject.node) {
                    if (zccity.defined(pickedObject)) {
                        // console.log(pickedObject.id)
                        var cartesian = viewer.scene.pickPosition(evt.position);
                        if (zccity.defined(cartesian)) {
                            var cartographic = zccity.Cartographic.fromCartesian(cartesian);
                            var lng = zccity.Math.toDegrees(cartographic.longitude);
                            var lat = zccity.Math.toDegrees(cartographic.latitude);
                            var height = cartographic.height; //模型高度
                            // mapPosition={x:lng,y:lat,z:height}
                            console.log(cartesian)
                            var mapPosition = {
                                x: lng,
                                y: lat,
                                z: height
                            }; //height的值为地形高度。
                            jsonData.push(mapPosition);
                            console.log(mapPosition)
                            var poi = viewer.entities.add({
                                position: cartesian,
                                point: {
                                    pixelSize: 5,
                                    color: zccity.Color.RED,
                                    outlineColor: zccity.Color.WHITE,
                                    outlineWidth: 2,
                                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                                },
                            });
                            addpois.push(poi);
                        }
                        // console.log(pickedObject.id)
                    }
                }
            }, zccity.ScreenSpaceEventType.LEFT_CLICK);
            // saveHandler = new zccity.ScreenSpaceEventHandler(viewer.scene.canvas);
            // saveHandler.setInputAction(function (movement) {
            //     // removeEntities(addpois);
            //     let cartesian, pickedObject;
            //     pickedObject = viewer.scene.pick(movement.position);
            //     if (pickedObject && viewer.scene.pickPositionSupported && zccity.defined(pickedObject) && pickedObject.primitive && pickedObject.primitive.IS3D) {
            //         cartesian = viewer.scene.pickPosition(movement.position);
            //     } else {
            //         let ray = viewer.camera.getPickRay(movement.position);
            //         cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            //     }
            //     var cartographic = zccity.Cartographic.fromCartesian(cartesian);
            //     var lng = zccity.Math.toDegrees(cartographic.longitude); //经度值
            //     var lat = zccity.Math.toDegrees(cartographic.latitude); //纬度值
            //     //height结果与cartographic.height相差无几，注意：cartographic.height可以为0，也就是说，可以根据经纬度计算出高程。
            //     var height = cartographic.height;
            //     var mapPosition = {
            //         x: lng,
            //         y: lat,
            //         z: height
            //     }; //height的值为地形高度。
            //     jsonData.push(mapPosition);
            //     console.log(mapPosition)
            //     var poi = viewer.entities.add({
            //         position: cartesian,
            //         point: {
            //             pixelSize: 5,
            //             color: zccity.Color.RED,
            //             outlineColor: zccity.Color.WHITE,
            //             outlineWidth: 2,
            //             disableDepthTestDistance: Number.POSITIVE_INFINITY,
            //         },
            //     });
            //     addpois.push(poi);

            // }, zccity.ScreenSpaceEventType.LEFT_CLICK);

        }
    })(),
    //poi查询
    (function () {
        //查询圆内的poi点
        var draws = [];
        zccityTools.prototype.circleQuery = function (entitiesQ, h) {

            let scope = this;
            let viewer = scope.viewer;
            let handler = scope.handler;
            var Draw = true;
            var lons = [];
            var lats = [];
            var polygonPath = [];
            var ids = [];
            /***************************鼠标点击事件***********************************/
            handler.setInputAction(function (movement) {
                var position1;
                var cartographic;
                var ray = viewer.scene.camera.getPickRay(movement.position);
                if (ray)
                    position1 = viewer.scene.globe.pick(ray, viewer.scene);
                if (position1)
                    cartographic = zccity.Ellipsoid.WGS84.cartesianToCartographic(position1);
                if (cartographic) {
                    // var height = viewer.scene.globe.getHeight(cartographic);
                    var height = 0
                    h ? height = h : {}
                    var point = zccity.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height);

                    var lon = zccity.Math.toDegrees(cartographic.longitude)
                    lons.push(lon)
                    var lat = zccity.Math.toDegrees(cartographic.latitude)
                    lats.push(lat)
                    if (Draw) {
                        polygonPath.push(point);
                        d1 = viewer.entities.add({
                            position: point,
                            point: {
                                show: true,
                                color: zccity.Color.SKYBLUE,
                                pixelSize: 3,
                                outlineColor: zccity.Color.YELLOW,
                                outlineWidth: 1,
                            },
                        });

                        draws.push(d1)
                        Draw = false;
                    } else {
                        d2 = viewer.entities.add({
                            position: point,
                            point: {

                                show: true,
                                color: zccity.Color.SKYBLUE,
                                pixelSize: 3,
                                outlineColor: zccity.Color.YELLOW,
                                outlineWidth: 1,
                            },
                        });
                        draws.push(d2)
                        // var p1=([lons[0], lats[0],30])

                        polyline = viewer.entities.add({
                            polyline: {

                                positions: zccity.Cartesian3.fromDegreesArrayHeights([lons[0], lats[0], height, lons[1], lats[1], height]),
                                material: new zccity.PolylineOutlineMaterialProperty({
                                    color: zccity.Color.RED
                                }),
                                width: 2,
                                depthFailMaterial: new zccity.PolylineOutlineMaterialProperty({
                                    color: zccity.Color.RED
                                })
                            }
                        });
                        draws.push(polyline)
                        var r = GetDistance(lats[0], lons[0], lats[1], lons[1]) * 1000
                        dd = viewer.entities.add({
                            position: zccity.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height + 30),
                            label: {
                                text: '所画圆半径为' + r.toFixed(2) + '米',
                                font: '14pt monospace',
                                color: zccity.Color.RED,
                                backgroundColor: zccity.Color.CORAL,
                                style: zccity.LabelStyle.FILL_AND_OUTLINE,
                                outlineWidth: 2,
                                //垂直位置
                                heightReference: zccity.HeightReference.RELATIVE_TO_GROUNDE,
                                verticalOrigin: zccity.VerticalOrigin.TOP,
                                pixelOffset: new zccity.Cartesian2(0, 0),
                            }
                        });
                        draws.push(dd)

                        d3 = viewer.entities.add({
                            position: zccity.Cartesian3.fromDegrees(lons[0], lats[0]),
                            name: 'Green circle at height',
                            ellipse: {
                                height: height,
                                semiMinorAxis: r,
                                semiMajorAxis: r,
                                material: zccity.Color.GREEN.withAlpha(0.5)

                            }
                        });
                        draws.push(d3)
                        handler.removeInputAction(zccity.ScreenSpaceEventType.LEFT_CLICK);
                        array = entitiesQ

                        for (let i = 0; i < array.length; i++) {
                            var a = array[i]._id
                            ids.push(a);
                        }
                        for (var i = 0; i < array.length; i++) {
                            var model = viewer.entities.getById(ids[i]);
                            if (typeof (model) != 'undefined') {
                                var cartesian = array[i]._position._value
                                var cartographic = zccity.Cartographic.fromCartesian(cartesian)
                                var lon = zccity.Math.toDegrees(cartographic.longitude)
                                var lat = zccity.Math.toDegrees(cartographic.latitude)
                                var dis = GetDistance(lats[0], lons[0], lat, lon) * 1000
                                if (dis < r) {
                                    model.show = true
                                } else { }

                            }
                        }
                        lons = [];
                        lats = [];
                        ids = [];
                    }
                }

            }, zccity.ScreenSpaceEventType.LEFT_CLICK);
            /***************************鼠标点击事件***********************************/
            //距离函数
            function GetDistance(lat1, lng1, lat2, lng2) {
                var radLat1 = lat1 * Math.PI / 180.0;
                var radLat2 = lat2 * Math.PI / 180.0;
                var a = radLat1 - radLat2;
                var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
                var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
                    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
                s = s * 6378.137; // EARTH_RADIUS;
                s = Math.round(s * 10000) / 10000;
                return s;
            }
        }
        //查询面内的poi点
        zccityTools.prototype.polygonQuery = function (entitiesQ, h) {

            let scope = this;
            let viewer = scope.viewer;
            let handler = scope.handler;
            var idds = []
            var isDraw = false;
            var dbx = []
            var polygonPath = [];
            window.pp = []
            var polygon = null;
            var height = h

            /***************************鼠标移动事件***********************************/
            handler.setInputAction(function (movement) {
                var position1;
                var cartographic;
                var ray = viewer.scene.camera.getPickRay(movement.endPosition);
                if (ray)
                    position1 = viewer.scene.globe.pick(ray, viewer.scene);
                if (position1)
                    cartographic = zccity.Ellipsoid.WGS84.cartesianToCartographic(position1);
                if (cartographic) {
                    // var height = viewer.scene.globe.getHeight(cartographic);
                    var point = zccity.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height);
                    if (isDraw) {

                        if (polygonPath.length < 2) {
                            return;
                        }
                        if (!zccity.defined(polygon)) {
                            polygonPath.push(point);
                            polygon = new CreatePolygon(polygonPath, zccity);
                        } else {
                            polygon.path.pop();
                            polygon.path.push(point);
                        }
                    }
                }

            }, zccity.ScreenSpaceEventType.MOUSE_MOVE);
            /***************************鼠标移动事件***********************************/

            /***************************鼠标点击事件***********************************/
            handler.setInputAction(function (movement) {
                isDraw = true;
                var position1;
                var cartographic;
                var ray = viewer.scene.camera.getPickRay(movement.position);
                if (ray)
                    position1 = viewer.scene.globe.pick(ray, viewer.scene);
                if (position1)
                    cartographic = zccity.Ellipsoid.WGS84.cartesianToCartographic(position1);
                if (cartographic) {
                    var point = zccity.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height);
                    var lon = zccity.Math.toDegrees(cartographic.longitude)
                    var lat = zccity.Math.toDegrees(cartographic.latitude)
                    var lonlat = [lon, lat]
                    var longitudeString = zccity.Math.toDegrees(cartographic.longitude)
                    var latitudeString = zccity.Math.toDegrees(cartographic.latitude)
                    var point1 = [longitudeString, latitudeString]
                    pp.push(point1)
                    if (isDraw) {
                        dbx.push(lonlat)
                        polygonPath.push(point);
                        dd1 = viewer.entities.add({
                            position: point,
                            point: {
                                show: true,
                                color: zccity.Color.SKYBLUE,
                                pixelSize: 3,
                                outlineColor: zccity.Color.YELLOW,
                                outlineWidth: 1
                            },
                        });
                        draws.push(dd1)
                    }
                }
            }, zccity.ScreenSpaceEventType.LEFT_CLICK);
            /***************************鼠标点击事件***********************************/

            /***************************鼠标双击事件***********************************/
            handler.setInputAction(function () {
                handler.removeInputAction(zccity.ScreenSpaceEventType.LEFT_CLICK);
                handler.removeInputAction(zccity.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
                array = entitiesQ
                if (polygonPath.length >= 2) {
                    for (let i = 0; i < array.length; i++) {
                        var a = array[i]._id
                        idds.push(a);
                    }

                    for (var i = 0; i < array.length; i++) {
                        var model = viewer.entities.getById(idds[i]);
                        if (typeof (model) != 'undefined') {
                            var cartesian = array[i]._position._value
                            var cartographic = zccity.Cartographic.fromCartesian(cartesian)
                            var lon = zccity.Math.toDegrees(cartographic.longitude)
                            var lat = zccity.Math.toDegrees(cartographic.latitude)
                            var xxx = insidePolygon(dbx, [lon, lat])
                            if (xxx) {
                                model.show = true
                            } else { }

                        }
                    }
                }
                window.water123 = polygonPath
                viewer.trackedEntity = undefined;
                isDraw = false;
                // tooltip.style.display = 'none';
                // polygonPath=[]
            }, zccity.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

            /***************************鼠标双击事件***********************************/

            var CreatePolygon = (function () {
                function _(positions) {
                    this.options = {
                        polygon: {
                            height: height,
                            show: true,
                            hierarchy: undefined,
                            outline: true,
                            outlineColor: zccity.Color.WHITE,
                            outlineWidth: 2,
                            material: zccity.Color.YELLOW.withAlpha(0.2)
                        }
                    };
                    this.path = positions;
                    this.hierarchy = positions;
                    this._init();
                }

                _.prototype._init = function () {
                    var _self = this;
                    var _update = function () {
                        return _self.hierarchy;
                    };
                    //实时更新polygon.hierarchy
                    this.options.polygon.hierarchy = new zccity.CallbackProperty(_update, false);

                    dd2 = viewer.entities.add(this.options);
                    draws.push(dd2)
                };
                // tooltip.innerHTML = ''
                return _;
            })();

            function insidePolygon(points, testPoint) {
                var x = testPoint[0],
                    y = testPoint[1];
                var inside = false;
                for (var i = 0, j = points.length - 1; i < points.length; j = i++) {
                    var xi = points[i][0],
                        yi = points[i][1];
                    var xj = points[j][0],
                        yj = points[j][1];

                    var intersect = ((yi > y) != (yj > y)) &&
                        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                    if (intersect) inside = !inside;
                }
                return inside;
            }
        }
        zccityTools.prototype.clean = function (entitiesQ) {
            pp = []
            let scope = this;
            let viewer = scope.viewer;
            array = entitiesQ
            // 删除测量功能画上去的实体
            for (let i = 0; i < draws.length; i++) {
                viewer.entities.remove(draws[i])
            }
            for (let i = 0; i < array.length; i++) {
                var a = array[i]._id
                var model = viewer.entities.getById(a);
                model.show = false

            }

            draws = [];

        }
    })(),
    //缓冲区相关
    (function () {
        var ddds = [];
        zccityTools.prototype.buffer = function (entitiesQ, h, r, color) {
            let scope = this;
            let viewer = scope.viewer;
            let handler = scope.handler;
            var lons = [];
            var lats = [];
            var ids = [];

            var radius = r
            array = entitiesQ
            for (let i = 0; i < array.length; i++) {
                var a = array[i]._id
                ids.push(a);
            }
            for (var i = 0; i < array.length; i++) {
                var model = viewer.entities.getById(ids[i]);
                if (typeof (model) != 'undefined') {
                    var cartesian = array[i]._position._value
                    var cartographic = zccity.Cartographic.fromCartesian(cartesian)
                    var lon = zccity.Math.toDegrees(cartographic.longitude)
                    lons.push(lon)
                    var lat = zccity.Math.toDegrees(cartographic.latitude)
                    lats.push(lat)
                }
            }
            handler.setInputAction(function (movement) {
                var height = h
                var pick = viewer.scene.pick(movement.position);
                for (let i = 0; i < ids.length; i++) {
                    if (zccity.defined(pick) && (pick.id.id == ids[i])) {
                        ddd = viewer.entities.add({
                            position: zccity.Cartesian3.fromDegrees(lons[i], lats[i]),
                            name: 'Green circle at height',
                            ellipse: {
                                height: height,
                                semiMinorAxis: radius,
                                semiMajorAxis: radius,
                                material: color ? color : new zccity.Color(1, 1, 1, 1)

                            }
                        });
                        ddds.push(ddd)
                    }
                }
                // lons = [];
                // lats = [];
                // ids = [];
            }, zccity.ScreenSpaceEventType.LEFT_CLICK);
        },
            zccityTools.prototype.bufferclean = function (entitiesQ) {
                let scope = this;
                let viewer = scope.viewer;
                array = entitiesQ
                // 删除测量功能画上去的实体
                for (let i = 0; i < ddds.length; i++) {
                    viewer.entities.remove(ddds[i])
                }
                ddds = [];

            }
    })(),
    //天气渲染
    (function () {
        zccityTools.prototype.snow = function () {
            const viewer = this.viewer;
            var collection = viewer.scene.postProcessStages;
            var fs_snow = FS_Snow();

            snow = new zccity.PostProcessStage({
                name: 'czm_snow',
                fragmentShader: fs_snow
            });
            // collection.add(snow);
            viewer.scene.postProcessStages.add(snow), lastStage = snow;
            //viewer.scene.skyAtmosphere.hueShift = -0.8;
            //viewer.scene.skyAtmosphere.saturationShift = -0.7;
            // viewer.scene.skyAtmosphere.brightnessShift = -0.33;//大气圈亮度
            //viewer.scene.fog.density = 0.001;
            viewer.scene.fog.minimumBrightness = 0; //0.8
            function FS_Snow() {
                return "uniform sampler2D colorTexture;\n\
                    varying vec2 v_textureCoordinates;\n\
                    \n\
                    float snow(vec2 uv,float scale)\n\
                    {\n\
                        float time = czm_frameNumber / 60.0;\n\
                        float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;\n\
                        uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;\n\
                        uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;\n\
                        p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);\n\
                        k=smoothstep(0.,k,sin(f.x+f.y)*0.01);\n\
                        return k*w;\n\
                    }\n\
                    \n\
                    void main(void){\n\
                        vec2 resolution = czm_viewport.zw;\n\
                        vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
                        vec3 finalColor=vec3(0);\n\
                        float c = 0.0;\n\
                        c+=snow(uv,130.)*.0;\n\
                        c+=snow(uv,20.)*.0;\n\
                        c+=snow(uv,15.)*.0;\n\
                        c+=snow(uv,10.);\n\
                        c+=snow(uv,8.);\n\
                        c+=snow(uv,6.);\n\
                        c+=snow(uv,5.);\n\
                        finalColor=(vec3(c)); \n\
                        gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.5); \n\
                    \n\
                    }\n\
                    ";
            }

            // tempPoints.push(zccity.Cartesian3.fromDegrees(119.951248, 30.523143, 9.8));
            //             // tempPoints.push(zccity.Cartesian3.fromDegrees(119.980961, 30.523143, 9.8));
            //             // tempPoints.push(zccity.Cartesian3.fromDegrees(119.987707, 30.510790, 9.8));
            //             // tempPoints.push(zccity.Cartesian3.fromDegrees(119.961778, 30.509970, 9.8));
            // tempPoints.push(zccity.Cartesian3.fromDegrees(119.88777, 30.56939, 9.8));
            // tempPoints.push(zccity.Cartesian3.fromDegrees(120.05266, 30.56502, 9.8));
            // tempPoints.push(zccity.Cartesian3.fromDegrees(120.07794, 30.42952, 9.8));
            // tempPoints.push(zccity.Cartesian3.fromDegrees(119.81519, 30.43857, 9.8));
            // var gon = viewer.entities.add({
            //     name: 'polygon',
            //     polygon: {
            //         hierarchy: tempPoints,
            //         material: zccity.Color.WHITE.withAlpha(0.15)
            //     }
            // });
            // viewer.camera.setView({
            //     /*338.47440430291294 "-heading"
            //       128 -23.14625736150863 "-pitch"*/
            //     /*精度大右，纬度大屏幕*/
            //     destination: zccity.Cartesian3.fromDegrees(119.973179, 30.505, 500),
            //     orientation: {
            //         heading: zccity.Math.toRadians(338.4744058989243),
            //         // pitch : -zccity.Math.PI_OVER_TWO,
            //         pitch: -zccity.Math.toRadians(23.146247896017282),
            //         roll: 0
            //     }
            // });
        },
            zccityTools.prototype.rain = function () {
                const viewer = this.viewer;
                rain(0.5)

                function FS_Rain(light) {
                    light = 0.5
                    //float a=-.004;float si=sin(a),co=cos(a);调增角度
                    //c是颜色属性
                    return "uniform sampler2D colorTexture;\n\
                        varying vec2 v_textureCoordinates;\n\
                        \n\
                        float hash(float x){\n\
                            return fract(sin(x*133.3)*13.13);\n\
                        }\n\
                        \n\
                        void main(void){\n\
                        \n\
                        float time = czm_frameNumber / 60.0;\n\
                        vec2 resolution = czm_viewport.zw;\n\
                        \n\
                        vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
                        vec3 c=vec3(.6,.7,.8);\n\
                        \n\
                        float a=-.004;\n\
                        float si=sin(a),co=cos(a);\n\
                        uv*=mat2(co,-si,si,co);\n\
                        uv*=length(uv+vec2(0,4.9))*.3+1.;\n\
                        \n\
                        float v=1.-sin(hash(floor(uv.x*100.))*2.);\n\
                        float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\n\
                        c*=v*b*0.2; \n\
                        \n\
                        gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), " +
                        light + ");  \n\
                        }\n\
                        ";

                }

                function rain(light) {
                    var collection = viewer.scene.postProcessStages;
                    var fs_rain = FS_Rain(light);
                    var _rain = new zccity.PostProcessStage({
                        name: '',
                        fragmentShader: fs_rain
                    });
                    collection.add(_rain);

                }
                // Bind the viewModel to the DOM elements of the UI that call for it.



                //Sandcastle_End

            },
            zccityTools.prototype.weatherClear = function () {
                const viewer = this.viewer;
                snow = undefined;
                // removeStage();
                // viewer.entities.removeAll();
                tempPoints = [];
                viewer.scene.postProcessStages.removeAll();
                function removeStage() {
                    lastStage && viewer.scene.postProcessStages.remove(lastStage), lastStage = null
                }
            }
    })(),
    //分屏
    (function () {
        var rightLayer, leftLayer
        zccityTools.prototype.slider = function (rightLayerIn, leftLayerIn) {
            let scope = this;
            let viewer = scope.viewer;
            rightLayer = viewer.imageryLayers.addImageryProvider(rightLayerIn)
            leftLayer = viewer.imageryLayers.addImageryProvider(leftLayerIn)

            // viewer.imageryLayers.addImageryProvider(leftLayer)
            rightLayer.splitDirection = zccity.ImagerySplitDirection.RIGHT;
            leftLayer.splitDirection = zccity.ImagerySplitDirection.LEFT;
            var slider = document.getElementById('slider');
            $("#slider").show();
            viewer.scene.imagerySplitPosition = (slider.offsetLeft) / slider.parentElement.offsetWidth;
            var sliderHandler = new zccity.ScreenSpaceEventHandler(slider);
            var moveActive = false;

            function move(movement) {
                if (!moveActive) {
                    return;
                }
                var relativeOffset = movement.endPosition.x;
                var splitPosition = (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
                slider.style.left = 100.0 * splitPosition + '%';
                viewer.scene.imagerySplitPosition = splitPosition;
            }
            sliderHandler.setInputAction(function () {
                moveActive = true;
            }, zccity.ScreenSpaceEventType.LEFT_DOWN);
            sliderHandler.setInputAction(function () {
                moveActive = true;
            }, zccity.ScreenSpaceEventType.PINCH_START);

            sliderHandler.setInputAction(move, zccity.ScreenSpaceEventType.MOUSE_MOVE);
            sliderHandler.setInputAction(move, zccity.ScreenSpaceEventType.PINCH_MOVE);

            sliderHandler.setInputAction(function () {
                moveActive = false;
            }, zccity.ScreenSpaceEventType.LEFT_UP);
            sliderHandler.setInputAction(function () {
                moveActive = false;
            }, zccity.ScreenSpaceEventType.PINCH_END);
        },
            zccityTools.prototype.clearSlider = function () {
                let scope = this;
                let viewer = scope.viewer;
                $("#slider").hide();
                viewer.scene.imagerySplitPosition = 0;
                viewer.imageryLayers.remove(rightLayer);
                viewer.imageryLayers.remove(leftLayer);
            }
    })(),
    //修改gltf位置
    (function () {
        zccityTools.prototype.moveto = function (model, param) {
            // console.log(model)
            var param123;
            var poi;
            param123 = paramlist.filter((p) => {
                return p.id == model.id;
            })[0];
            model.readyPromise.then(function (model) {
                poi = zccity.Cartesian3.fromDegrees(param.x, param.y, param.z);
                model.position = poi;
                let m = model.modelMatrix;
                let m1 = zccity.Matrix3.fromRotationZ(zccity.Math.toRadians(param.a));
                zccity.Matrix4.multiplyByMatrix3(m, m1, m);
                model.modelMatrix = m;
                const scale = zccity.Matrix4.fromScale(new zccity.Cartesian3(param123.sx, param123.sy, 1), new zccity.Matrix4)
                model.modelMatrix = zccity.Matrix4.multiply(model.modelMatrix, scale, model.modelMatrix)
            })
            var radar = viewer.entities.getById(model.id)
            //    console.log(radar)

            radar.position = zccity.Cartesian3.fromDegrees(param.x, param.y, (param.z + 50))
            radar.name = param.name
            radar.label.text._value = param.name
            // function movelabel(modellabel, a) {

            // }
        }
    })(),
    //删除模型
    (function () {
        zccityTools.prototype.delModel = function (model) {
            viewer.scene.primitives.remove(model);
            viewer.entities.removeById(model.id);
        }
    })(),
    //移动模型
    (function () {
        zccityTools.prototype.moveModel = function () {
            //模型移动
            var pointDraged = null;
            var leftDownFlag = false;
            var isMove = false;
            var param;
            viewer.screenSpaceEventHandler.setInputAction(leftDownAction, zccity.ScreenSpaceEventType.LEFT_DOWN);
            viewer.screenSpaceEventHandler.setInputAction(leftUpAction, zccity.ScreenSpaceEventType.LEFT_UP);
            viewer.screenSpaceEventHandler.setInputAction(mouseMoveAction, zccity.ScreenSpaceEventType.MOUSE_MOVE);

            function leftDownAction(e) {
                console.log("左键按下");
                isMove = false;
                pointDraged = viewer.scene.pick(e.position); //选取当前的entity
                //    console.log(pointDraged.id)
                param = paramlist.filter((p) => {
                    return p.id == pointDraged.id;
                })[0];
                // console.log(param)
                if (param.type == 'equip') {
                    return
                }
                leftDownFlag = true;
                if (pointDraged && pointDraged.id) {
                    viewer.scene.screenSpaceCameraController.enableRotate = false; //锁定相机
                }
            }

            function leftUpAction(e) {
                console.log("左键抬起");
                leftDownFlag = false;
                if (pointDraged && isMove && pointDraged.id) {
                    let m = pointDraged.primitive.modelMatrix;
                    console.log(param)
                    let m1 = zccity.Matrix3.fromRotationZ(zccity.Math.toRadians(param.a));
                    pointDraged.primitive.modelMatrix = zccity.Matrix4.multiplyByMatrix3(m, m1, m);
                    const scale = zccity.Matrix4.fromScale(new zccity.Cartesian3(param.sx, param.sy, 1), new zccity.Matrix4)
                    pointDraged.primitive.modelMatrix = zccity.Matrix4.multiply(pointDraged.primitive.modelMatrix, scale, pointDraged.primitive.modelMatrix)
                    var ellipsoid = viewer.scene.globe.ellipsoid;
                    let ray = pointDraged.primitive.position;
                    var cartesian3 = new zccity.Cartesian3(ray.x, ray.y, ray.z);
                    var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
                    var lat = zccity.Math.toDegrees(cartographic.latitude);
                    var lng = zccity.Math.toDegrees(cartographic.longitude);
                    var height = cartographic.height;
                    var position = {
                        x: lng,
                        y: lat,
                        z: height
                    };
                    // movelabel(position)
                    console.log(position)
                }
                pointDraged = null;
                viewer.scene.screenSpaceCameraController.enableRotate = true; //解锁相机
            }

            function mouseMoveAction(e) {
                if (leftDownFlag === true && pointDraged != null && pointDraged.id) {
                    isMove = true;
                    let ray = viewer.camera.getPickRay(e.endPosition);
                    let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                    var ellipsoid = viewer.scene.globe.ellipsoid;
                    let ray1 = pointDraged.primitive.position;
                    //    console.log(pointDraged)
                    var cartesian3 = new zccity.Cartesian3(ray1.x, ray1.y, ray1.z);
                    var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
                    var lat = zccity.Math.toDegrees(cartographic.latitude);
                    var lng = zccity.Math.toDegrees(cartographic.longitude);
                    var height = cartographic.height;
                    var position = {
                        x: lng,
                        y: lat,
                        z: height
                    };
                    movelabel(pointDraged.id, position)
                    pointDraged.primitive.position = cartesian; //此处根据具体entity来处理，也可能是pointDraged.id.position=cartesian;
                }
            }

            function movelabel(model, a) {
                var radar = viewer.entities.getById(model)
                //    console.log(radar)

                radar.position = zccity.Cartesian3.fromDegrees(a.x, a.y, (a.z + 50))
            }
        }
    })(),
    //空间线
    (function () {
        zccityTools.prototype.drawLineSpace = function (position, ls_parent_entity) {
            handler = new zccity.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
            var positions = [];
            var poly = null;
            var tooltip = document.getElementById("info");
            var distance = 0;
            var cartesian = null;
            var floatingPoint;
            tooltip.style.display = "block";

            handler.setInputAction(function (movement) {
                tooltip.style.left = movement.endPosition.x + 3 + "px";
                tooltip.style.top = movement.endPosition.y - 25 + "px";
                tooltip.innerHTML = '<p>单击开始，右击结束</p>';
                cartesian = viewer.scene.pickPosition(movement.endPosition);

                if (positions.length >= 2) {
                    if (!zccity.defined(poly)) {
                        poly = new PolyLinePrimitive(positions);
                    } else {
                        positions.pop();
                        // cartesian.y += (1 + Math.random());
                        positions.push(cartesian);
                    }
                    // distance = getSpaceDistance(positions);

                }
            }, zccity.ScreenSpaceEventType.MOUSE_MOVE);

            handler.setInputAction(function (movement) {
                cartesian = viewer.scene.pickPosition(movement.position);
                if (positions.length == 0) {
                    positions.push(cartesian.clone());
                }
                positions.push(cartesian);
                //在三维场景中添加Label
                floatingPoint = viewer.entities.add({
                    name: '空间直线距离',
                    position: positions[positions.length],
                    point: {
                        pixelSize: 5,
                        color: zccity.Color.WHITE,
                        outlineColor: zccity.Color.WHITE,
                        outlineWidth: 1,
                        heightReference: zccity.HeightReference.NONE
                    }
                });

                if (positions.length > 2) {
                    tooltip.style.display = "none";
                    // let data = {
                    //     x: (positions[0].x + positions[1].x) / 2,
                    //     y: (positions[0].y + positions[1].y) / 2,
                    //     z: (positions[0].z + positions[1].z) / 2
                    // }
                    // console.log(poly)
                    // position(data, poly.options)
                    console.log(positions)
                    handler.destroy(); //关闭事件句柄
                }
            }, zccity.ScreenSpaceEventType.LEFT_CLICK);

            // handler.setInputAction(function (movement) {
            //     tooltip.style.display = "none";
            //     console.log(positions)
            //     handler.destroy(); //关闭事件句柄

            // }, zccity.ScreenSpaceEventType.RIGHT_CLICK);

            var PolyLinePrimitive = (function () {
                function _(positions) {
                    this.options = {
                        name: '直线',
                        polyline: {
                            // parent:ls_parent_entity,
                            show: true,
                            positions: positions,
                            material: new zccity.ImageMaterialProperty({
                                image: './IMG/timg.jfif',
                                repeat: new zccity.Cartesian2(20.0, 1.0)
                            }),
                            width: 6
                        }
                    };
                    this.positions = positions;
                    this._init();
                }
                _.prototype._init = function () {
                    var _self = this;
                    var _update = function () {
                        return _self.positions;
                    };
                    //实时更新polyline.positions
                    this.options.polyline.positions = new zccity.CallbackProperty(_update, false);
                    // this.options.parent = ls_parent_entity;
                    // this.options.id = 'ls' + Math.random();
                    // console.log(ls_parent_entity)
                    // console.log(this.options)

                    viewer.entities.add(this.options);
                };
                return _;
            })()
        }
    })(),
    //展示
    (function () {
        zccityTools.prototype.showSpaceLine = function (positions, model) {
            viewer.entities.add({
                id: model,
                name: model,
                polyline: {
                    show: true,
                    positions: positions,
                    material: new zccity.ImageMaterialProperty({
                        image: './IMG/timg.jfif',
                        repeat: new zccity.Cartesian2(20.0, 1.0)
                    }),
                    width: 6
                }
            })
        }
    })(),
    //label展示
    (function () {
        zccityTools.prototype.isShow = function (type, flag) {
            if (flag) {
                type.show = false;
            } else {
                type.show = true;
            }
        }
    })(),
    //修改名字
    (function () {
        zccityTools.prototype.changeName = function (model, param) {
            // var param123;
            // var poi;
            // param123 = paramlist.filter((p) => {
            //     return p.id == model.id;
            // })[0];
            var radar = viewer.entities.getById(model.id)
            radar.name = param.name
            radar.label.text._value = param.name
            // function movelabel(modellabel, a) {

            // }
        }
    })(),
    //吊机线
    (function () {
        zccityTools.prototype.showBound = function (model, param, data) {
            var ellipsoid = viewer.scene.globe.ellipsoid;
            if (!(model && model.id && model.id.position && model.id.position._value))
                return;
            //let ray1 = model.primitive.position;
            let ray1 = model.id.position._value;
            var cartesian3 = new zccity.Cartesian3(ray1.x, ray1.y, ray1.z);
            var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
            var lat = zccity.Math.toDegrees(cartographic.latitude);
            var lng = zccity.Math.toDegrees(cartographic.longitude);
            var height = cartographic.height;
            for (let i = 0; i < param.length; i++) {
                viewer.entities.add({
                    //position: model.primitive.position,
                    position: ray1,
                    name: 'circle',
                    ellipse: {
                        semiMinorAxis: param[i].dis,
                        semiMajorAxis: param[i].dis,
                        height: data.height, //浮空
                        material: zccity.Color.GREEN.withAlpha(0),
                        // material:new zccity.Color.fromCssColorString(param[i].color),
                        outline: true, // height must be set for outlines to display
                        // outlineColor: {
                        //     rgba: [204,0,255],
                        // },
                        outlineWidth: 500,
                        outlineColor: new zccity.Color.fromCssColorString(data.color)

                    }
                });
                var cartesian3 = new zccity.Cartesian3(ray1.x + param[i].dis, ray1.y, ray1.z);
                //var cartesian3 = new zccity.Cartesian3(model.primitive.position.x + param[i].dis, model.primitive.position.y, model.primitive.position.z);
                var cartographic1 = ellipsoid.cartesianToCartographic(cartesian3);
                var lat = zccity.Math.toDegrees(cartographic1.latitude);
                var lng = zccity.Math.toDegrees(cartographic1.longitude);
                // let position = {x:(model.primitive.position.x+param[i]),y:model.primitive.position.y,z:model.primitive.position.z};
                viewer.entities.add({
                    position: zccity.Cartesian3.fromDegrees(lng, lat, data.height + 4.9),
                    name: 'circle',
                    label: {
                        text: param[i].dis + 'm' + '  ' + param[i].weight + 't',
                        style: zccity.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 1,
                        // outlineColor: new zccity.Color(0, 0, 0, 1),
                        fillColor: new zccity.Color.fromCssColorString(data.color),
                        verticalOrigin: zccity.VerticalOrigin.CENTER,
                        horizontalOrigin: zccity.HorizontalOrigin.RIGHT, //水平位置
                        //中心位置
                        pixelOffset: new zccity.Cartesian2(0, 0),
                        scale: 0.5,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    }
                });

            }

        }
    })(),
    //吊机线清除
    (function () {
        zccityTools.prototype.delBound = function () {
            var entitys = viewer.entities._entities._array;
            for (var i = 0; i < entitys.length; i++) {
                if (entitys[i]._name === "circle") {
                    viewer.entities.remove(entitys[i]);
                    i--;
                }
            }
        }
    })(),
    //移动吊机模型
    (function () {
        zccityTools.prototype.moveEquip = function (cons) {
            //模型移动
            var pointDraged = null;
            var leftDownFlag = false;
            var isMove = false;
            var param;
            var startP;
            var endP;
            viewer.screenSpaceEventHandler.setInputAction(leftDownAction, zccity.ScreenSpaceEventType.LEFT_DOWN);
            viewer.screenSpaceEventHandler.setInputAction(leftUpAction, zccity.ScreenSpaceEventType.LEFT_UP);
            viewer.screenSpaceEventHandler.setInputAction(mouseMoveAction, zccity.ScreenSpaceEventType.MOUSE_MOVE);

            function leftDownAction(e) {
                // console.log(arguments);
                // try {
                //     console.log("左键按下", e);
                // } catch { }
                zccityTools.prototype.delBound();
                isMove = false;
                pointDraged = viewer.scene.pick(e.position); //选取当前的entity


                /** 取点经纬度 */
                // (function () {
                //     var ray = viewer.scene.camera.getPickRay(e.position);
                //     if (ray) {
                //         var ppp = viewer.scene.globe.pick(ray, viewer.scene);
                //         cartographic = zccity.Ellipsoid.WGS84.cartesianToCartographic(ppp);
                //         var lon = zccity.Math.toDegrees(cartographic.longitude);
                //         var lat = zccity.Math.toDegrees(cartographic.latitude);
                //         console.log(lon, lat)
                //     }
                // })();
                /** */

                if (!(pointDraged && pointDraged.id))
                    return;
                param = paramlist.filter((p) => {
                    return p.id == pointDraged.id.id;
                })[0];
                if (!param)
                    return;
                if (param.type == 'equip') {
                    // console.log(param);
                    leftDownFlag = true;
                    if (pointDraged && pointDraged.id) {
                        startP = pointDraged.id.position._value;
                        //startP = pointDraged.primitive.position;
                        // console.log("startP" + startP)
                        // console.log(pointDraged)
                        viewer.scene.screenSpaceCameraController.enableRotate = false; //锁定相机
                    }
                } else {
                    return
                }

            }

            function leftUpAction(e) {
                // console.log("左键抬起");
                leftDownFlag = false;
                if (pointDraged && isMove && pointDraged.id) {

                    let data = {
                        id: pointDraged.id.id,
                        position: endP
                    };
                    if (cons) {
                        cons(data);
                    }
                    // let m = pointDraged.primitive.modelMatrix;
                    // let m1 = zccity.Matrix3.fromRotationZ(zccity.Math.toRadians(180));
                    // pointDraged.primitive.modelMatrix = zccity.Matrix4.multiplyByMatrix3(m, m1, m);
                    // var ellipsoid = viewer.scene.globe.ellipsoid;
                    // let ray = pointDraged.primitive.position;
                    // console.log(ray)
                    // var a = 1.4925089961788027;
                    // var aimx = ((a * a) * startP.x - a * startP.y + ray.x + a * ray.y) / (a * a + 1);
                    // var aimy = (-a * startP.x + startP.y + a * ray.x + (a * a) * ray.y) / (a * a + 1);
                    // var cartesian33 = new zccity.Cartesian3(aimx, aimy, startP.z);
                    // var cartographic1 = ellipsoid.cartesianToCartographic(cartesian33);
                    // var lat = zccity.Math.toDegrees(cartographic1.latitude);
                    // var lng = zccity.Math.toDegrees(cartographic1.longitude);
                    // console.log(lat + ':' + lng)
                    // console.log(aimx + ':' + aimy)

                    //pointDraged.primitive.position = zccity.Cartesian3.fromDegrees(lng, lat, 4.9)
                }
                pointDraged = null;
                viewer.scene.screenSpaceCameraController.enableRotate = true; //解锁相机
            }

            function mouseMoveAction(e) {
                if (leftDownFlag === true && pointDraged != null && pointDraged.id && startP) {
                    isMove = true;
                    let ray = viewer.camera.getPickRay(e.endPosition);
                    let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                    var ellipsoid = viewer.scene.globe.ellipsoid;
                    let ray1 = pointDraged.id.position._value;
                    //    console.log(pointDraged)
                    var cartesian3 = new zccity.Cartesian3(ray1.x, ray1.y, ray1.z);
                    var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
                    var lat = zccity.Math.toDegrees(cartographic.latitude);
                    var lng = zccity.Math.toDegrees(cartographic.longitude);
                    var height = cartographic.height;
                    var position = {
                        x: lng,
                        y: lat,
                        z: height
                    };
                    var cartesianEndPoint = getMoveEndPointAtLine(startP, cartesian,
                        new zccity.Cartesian3(param.line[0][0], param.line[0][1], param.line[0][2]), new zccity.Cartesian3(param.line[1][0], param.line[1][1], param.line[1][2]));
                    // var  cartesianEndPoint= getMoveEndPointAtLine(startP,cartesian,
                    //     new zccity.Cartesian3(-2941894.1232141, 4694874.105902383, 3149170.148280738), 
                    //     new zccity.Cartesian3(-2942026.625818319, 4694677.066238022, 3149338.921365658));
                    movelabel(pointDraged.id.id, position);
                    pointDraged.id.position._value = cartesianEndPoint; //此处根据具体entity来处理，也可能是pointDraged.id.position=cartesian;
                    endP = position;
                }
            }

            function movelabel(model, a) {
                var radar = viewer.entities.getById("label" + model)
                radar.position = zccity.Cartesian3.fromDegrees(a.x, a.y, (a.z + 50))
            }

            function getMoveEndPointAtLine(moveStartPoint, moveEndPoint, lineStartPoint, lineEndPoint) {
                //以线的起点为原点，所有世界坐标转为本地坐标
                var localToWorld_Matrix = zccity.Transforms.eastNorthUpToFixedFrame(lineStartPoint);
                var worldToLocal_Matrix = zccity.Matrix4.inverse(localToWorld_Matrix, new zccity.Matrix4());
                var localPosition_lineStartPoint = zccity.Matrix4.multiplyByPoint(worldToLocal_Matrix, lineStartPoint, new zccity.Cartesian3());
                var localPosition_lineEndPoint = zccity.Matrix4.multiplyByPoint(worldToLocal_Matrix, lineEndPoint, new zccity.Cartesian3());
                var localPosition_moveStartPoint = zccity.Matrix4.multiplyByPoint(worldToLocal_Matrix, moveStartPoint, new zccity.Cartesian3());
                var localPosition_moveEndPoint = zccity.Matrix4.multiplyByPoint(worldToLocal_Matrix, moveEndPoint, new zccity.Cartesian3());

                var moveLength = Math.sqrt(Math.pow(localPosition_moveEndPoint.x - localPosition_moveStartPoint.x, 2) + Math.pow(localPosition_moveEndPoint.y - localPosition_moveStartPoint.y, 2));

                var angleMove = GetAngel(localPosition_moveStartPoint, localPosition_moveEndPoint);
                var angleLine = GetAngel(localPosition_lineStartPoint, localPosition_lineEndPoint);

                var angel = angleLine - angleMove; //两线夹角

                var lineMoveLength = moveLength * Math.cos(angel);

                var deltaX = lineMoveLength * Math.sin(angleLine);
                var deltaY = lineMoveLength * Math.cos(angleLine);
                var nagetive = deltaX * deltaY == 0 ? 1 : (deltaX * deltaY / Math.abs(deltaX * deltaY));

                if (localPosition_moveStartPoint.x < localPosition_moveEndPoint.x) {
                    deltaX = Math.abs(deltaX);
                    deltaY = nagetive * Math.abs(deltaY);
                } else {
                    deltaX = -Math.abs(deltaX);
                    deltaY = -nagetive * Math.abs(deltaY);
                }

                var localPosition_EndPointAtLine = new zccity.Cartesian3(localPosition_moveStartPoint.x + deltaX, localPosition_moveStartPoint.y + deltaY, localPosition_moveStartPoint.z);

                if (localPosition_EndPointAtLine.x < Math.min(localPosition_lineStartPoint.x, localPosition_lineEndPoint.x)) {
                    localPosition_EndPointAtLine = localPosition_lineStartPoint.x < localPosition_lineEndPoint.x ? localPosition_lineStartPoint : localPosition_lineEndPoint;
                } else if (localPosition_EndPointAtLine.x > Math.max(localPosition_lineStartPoint.x, localPosition_lineEndPoint.x)) {
                    localPosition_EndPointAtLine = localPosition_lineStartPoint.x > localPosition_lineEndPoint.x ? localPosition_lineStartPoint : localPosition_lineEndPoint;
                }

                var worldPosition_EndPointAtLine = zccity.Matrix4.multiplyByPoint(localToWorld_Matrix, localPosition_EndPointAtLine, new zccity.Cartesian3());

                return worldPosition_EndPointAtLine;
            }

            function GetAngel(startPoint, endPoint) {
                if (startPoint.x == endPoint.x)
                    return 0;
                else
                    return Math.PI / 2 - Math.atan((endPoint.y - startPoint.y) / (endPoint.x - startPoint.x));
            }
        }
    })(),
    //三维测量
    (function () {
        zccityTools.prototype.spatialDistance = function (position) {
            handler = new zccity.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
            var positions = [];
            var poly = null;
            var tooltip = document.getElementById("info");
            var distance = 0;
            var cartesian = null;
            var floatingPoint;
            tooltip.style.display = "block";

            handler.setInputAction(function (movement) {
                tooltip.style.left = movement.endPosition.x + 3 + "px";
                tooltip.style.top = movement.endPosition.y - 25 + "px";
                tooltip.innerHTML = '<p>左键开始，双击结束</p>';
                cartesian = viewer.scene.pickPosition(movement.endPosition);

                if (positions.length >= 2) {
                    if (!zccity.defined(poly)) {
                        poly = new PolyLinePrimitive(positions);
                    } else {
                        positions.pop();
                        // cartesian.y += (1 + Math.random());
                        positions.push(cartesian);
                    }
                    distance = getSpaceDistance(positions);

                }
            }, zccity.ScreenSpaceEventType.MOUSE_MOVE);

            handler.setInputAction(function (movement) {
                tooltip.style.display = "none";
                cartesian = viewer.scene.pickPosition(movement.position);
                if (positions.length == 0) {
                    positions.push(cartesian.clone());
                }
                positions.push(cartesian);
                //在三维场景中添加Label
                var textDisance = distance + "米";
                floatingPoint = viewer.entities.add({
                    name: '空间测量线',
                    position: positions[positions.length - 1],
                    point: {
                        pixelSize: 5,
                        color: zccity.Color.WHITE,
                        outlineColor: zccity.Color.WHITE,
                        outlineWidth: 1,
                        heightReference: zccity.HeightReference.NONE
                    },
                    label: {
                        text: textDisance,
                        font: '18px sans-serif',
                        fillColor: zccity.Color.GOLD,
                        style: zccity.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        verticalOrigin: zccity.VerticalOrigin.BOTTOM,
                        pixelOffset: new zccity.Cartesian2(30, -30),
                        heightReference: zccity.HeightReference.NONE
                    }



                });
            }, zccity.ScreenSpaceEventType.LEFT_CLICK);
            //监听双击事件
            handler.setInputAction(function (movement) {
                tooltip.style.display = "none";
                handler.destroy(); //关闭事件句柄
                positions.pop(); //最后一个点无效
            }, zccity.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

            // handler.setInputAction(function (movement) {
            //     tooltip.style.display = "none";
            //     // console.log(positions)
            //     handler.destroy(); //关闭事件句柄

            // }, zccity.ScreenSpaceEventType.RIGHT_CLICK);

            var PolyLinePrimitive = (function () {
                function _(positions) {
                    this.options = {
                        name: '三维线',
                        polyline: {
                            show: true,
                            positions: positions,
                            material: zccity.Color.CHARTREUSE,
                            width: 2
                        }
                    };
                    this.positions = positions;
                    this._init();
                }
                _.prototype._init = function () {
                    var _self = this;
                    var _update = function () {
                        return _self.positions;
                    };
                    //实时更新polyline.positions
                    this.options.polyline.positions = new zccity.CallbackProperty(_update, false);
                    viewer.entities.add(this.options);
                };
                return _;
            })()
        };
        //空间两点距离计算函数
        function getSpaceDistance(positions) {
            var distance = 0;
            for (var i = 0; i < positions.length - 1; i++) {

                var point1cartographic = zccity.Cartographic.fromCartesian(positions[i]);
                var point2cartographic = zccity.Cartographic.fromCartesian(positions[i + 1]);
                /**根据经纬度计算出距离**/
                var geodesic = new zccity.EllipsoidGeodesic();
                geodesic.setEndPoints(point1cartographic, point2cartographic);
                var s = geodesic.surfaceDistance;
                //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
                //返回两点之间的距离
                s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
                distance = distance + s;
            }
            return distance.toFixed(2);
        };
        zccityTools.prototype.cleanSpatialMeasure = function (entitiesQ) {
            var entitys = viewer.entities._entities._array;
            for (var i = 0; i < entitys.length; i++) {
                if (entitys[i]._name === "空间测量线" || entitys[i]._name === "三维线") {
                    viewer.entities.remove(entitys[i]);
                    i--;
                }
            }
        }
    })(),
    //模型更换
    (function () {
        zccityTools.prototype.changeModel = function (delmodel, dir) {
            var nposition = delmodel.userData.position;
            // console.log(nposition)
            viewer.scene.primitives.remove(delmodel);
            var param123;
            param123 = paramlist.filter((p) => {
                return p.id == delmodel.id;
            })[0];
            let newurl = delmodel.basePath.split('_')[0] + '_' + dir + '.gltf';
            console.log(delmodel.basePath.split('_')[0])
            console.log(newurl)
            var model = zccity.Model.loadGltf({
                url: newurl,
                modelMatrix: zccity.Matrix4.fromTranslation(nposition),
                position: nposition,
                id: param123.id,
                scale: 1,
                minimumPixelSize: 1,
            })
            viewer.scene.primitives.add(model);

            model.readyPromise.then(function (model) {
                let m = model.modelMatrix;
                // let m1 = zccity.Matrix3.fromRotationZ(zccity.Math.toRadians(param123.a));
                // zccity.Matrix4.multiplyByMatrix3(m, m1, m);
                // model.modelMatrix = m;
                const scale = zccity.Matrix4.fromScale(new zccity.Cartesian3(param123.sx, param123.sy, 1), new zccity.Matrix4)
                model.modelMatrix = zccity.Matrix4.multiply(model.modelMatrix, scale, model.modelMatrix)
            }).otherwise(function (error) {
                console.log(error)
            });
            return model
        }
    })()