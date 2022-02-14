//自定义材质
if (typeof zccity !== 'undefined') (function (zccity) {
    /**
     * 自定义材质线Property 适用于entity和primitive材质
     */
    function CustomMaterialLine(options) {

        var Color = zccity.Color,
            defaultValue = zccity.defaultValue,
            defined = zccity.defined,
            defineProperties = Object.defineProperties,
            Event = zccity.Event,
            createPropertyDescriptor = zccity.createPropertyDescriptor,
            Property = zccity.Property,
            Material = zccity.Material,
            defaultColor = Color.WHITE,
            MaterialType = options.MaterialType || 'wallType' + parseInt(Math.random() * 1000);
        // 创建自定义动态材质对象
        function PolylineCustomMaterialProperty(options) {

            options = defaultValue(options, defaultValue.EMPTY_OBJECT);
            // 定义内置属性
            this._definitionChanged = new Event();
            this._color = undefined;
            this._colorSubscription = undefined;
            this.color = options.color || zccity.Color.BLUE;
            this.duration = options.duration || 1000;
            this._time = undefined;
        }
        // 定义材质对象默认属性
        defineProperties(PolylineCustomMaterialProperty.prototype, {
            isvarant: {
                get: function () {
                    return false;
                }
            },
            definitionChanged: {
                get: function () {
                    return this._definitionChanged;
                }
            },
            color: createPropertyDescriptor('color')
        });
        // 材质对象需要有type函数 value函数 equals函数
        PolylineCustomMaterialProperty.prototype.getType = function (time) {
            return MaterialType;
        };
        PolylineCustomMaterialProperty.prototype.getValue = function (time, result) {
            if (!defined(result)) {
                result = {};
            }
            result.color = Property.getValueOrClonedDefault(this._color, time, defaultColor, result.color);
            result.image = options.image;
            if (this._time === undefined) {
                this._time = time.secondsOfDay;
            }
            result.time = (time.secondsOfDay - this._time) * 1000 / this.duration;
            return result;
        };
        PolylineCustomMaterialProperty.prototype.equals = function (other) {
            return this === other || //
                (other instanceof PolylineCustomMaterialProperty &&
                    Property.equals(this._color, other._color));
        };
        // 将定义的材质对象添加到zccity的材质队列中
        Material._materialCache.addMaterial(MaterialType, {
            fabric: {
                type: MaterialType,
                uniforms: {
                    color: options.color || new zccity.Color(1.0, 0.0, 0.0, 0.5),
                    image: options.image,
                    time: options.color.time || 0
                },
                // 动态材质shader
                source: "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                  {\n\
                      czm_material material = czm_getDefaultMaterial(materialInput);\n\
                      vec2 st = materialInput.st;\n\
                      \n\
                      if(texture2D(image, vec2(0.0, 0.0)).a == 1.0){\n\
                          discard;\n\
                      }else{\n\
                          material.alpha = texture2D(image, vec2(1.0 - fract(time - st.s), st.t)).a * color.a;\n\
                      }\n\
                      \n\
                      material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);\n\
                      \n\
                      return material;\n\
                  }\n\
                  ",
            },
            // 透明
            translucent: function (material) {
                return true;
            }
        })
        return new PolylineCustomMaterialProperty(options);
    }

    zccity.CustomMaterialLine = CustomMaterialLine;
})(zccity);

//模型移动预览
zccityTools.prototype.preMoveModel = function (model, routeParams) {
    let models = [];
    let index = 0;
    routeParams.forEach((param) => {
        var entity_model = zccity.clone(model.model);
        entity_model.scale = param.scale ? param.scale : 1;
        entity_model.color = param.modelColor;
        entity_model.silhouetteColor = param.outLineColor;
        entity_model.silhouetteSize = 6;
        var position = zccity.Cartesian3.fromDegrees(param.x, param.y, param.z);
        var heading = param.a ? zccity.Math.toRadians(param.a) : 0;
        // var hpr = new zccity.HeadingPitchRoll(heading, 0, 0);
        //var hpr = new zccity.HeadingPitchRoll(heading + (Math.PI / 2), 0, 0);
        var hpr = new zccity.HeadingPitchRoll((-Math.PI / 2) - heading, 0, 0);
        var orientation = zccity.Transforms.headingPitchRollQuaternion(
            position,
            hpr
        );
        var cuModel = viewer.entities.add({
            id: param.id,
            name: param.name,
            position: position,
            orientation: orientation,
            model: entity_model,
        });
        models.push(cuModel);
        if (index == 0) {
            index++;
            return;
        }
        //
        //动态指向箭头
        let MaterialLineImage = '/big-screen/IMG/line2.png';
        let colors = routeParams[index - 1].linkColor;//221 / 255, 221 / 255, 221 / 255, 1
        // 创建材质线
        let getCustomMaterialLine = (image, color) => {
            return new zccity.CustomMaterialLine({
                image: image,
                color: color,
                duration: routeParams[index - 1].linkFlowDuration
            })
        };
        let linkLine = null;
        linkLine = viewer.entities.add({
            polyline: {
                positions: zccity.Cartesian3.fromDegreesArrayHeights([
                    routeParams[index - 1].x,
                    routeParams[index - 1].y,
                    routeParams[index - 1].z,
                    routeParams[index].x,
                    routeParams[index].y,
                    routeParams[index].z,
                ]),
                width: routeParams[index - 1].linkWidth,
                material: getCustomMaterialLine(MaterialLineImage, colors ?? zccity.Color.WHITE),
            }
        });
        models.push(linkLine);
        index++;
    });

    return models;
};

//模型移动预览取消
zccityTools.prototype.removePreMoveModel = function (models) {
    if (models) {
        models.forEach((t) => {
            viewer.entities.remove(t);
        });
    }
};