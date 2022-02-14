
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/** AMap */
declare var _AMapSecurityConfig: any;
declare var onAMapLoad: Function;
declare var AMap: any;
declare var initAMapUI: Function;
declare var AMapUI: any;

/** 3D */
declare var viewer: any;
declare var zccity: any;
declare var zccityTools: any;
declare var zccityTool: any;
declare var CesiumNavigation: any;

/** 船舶渲染工具类 */
declare var RenderShipTools: {
  /** 根据store.state.ShipList数据批量渲染船只 */
  render3dShips: () => void;
  /** 销毁全部3d船只 */
  removeShips: () => void;
  /** 根据id销毁3d船只 */
  removeShipById: (id: string) => any;
  /** 更新3d船只 */
  updateShip: (ship: any) => void;
  /** 渲染单个3d船只 */
  renderShip: (ship: any) => void;
}

/** 船舶调度工具类 */
declare var DispatchSchemeTools: {
  show3DEffectByOne: (item: any) => void;
  show3DEffectByShip: (item: any) => void;
}


// $filters
declare var $filters: {
  date: (t: any) => string,
  time: (t: any) => string,
};
declare var L: any;