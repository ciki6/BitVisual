import $ from "jquery";
import _ from "lodash";
import * as d3 from "d3";

import PropertyManager from "./property";
import { BaseProperty, PropertyDictionaryItem } from "../types/property";

class ComponentBase {
  id: string;
  code: string;
  container: Element;
  workMode: number;
  useDefaultOpt: boolean;
  propertyDictionary: PropertyDictionaryItem[];
  property: BaseProperty;
  propertyManager: any;
  dataBind: any;
  animation: any[];
  script: any;
  interact: any;
  // _foldPath: string;
  resourceId: string | undefined;
  clickScript: string[];
  getDataScripts: string[];
  beforeDrawScripts: string[];
  eventFunc: {
    name: string;
    displayName: string;
    params: {
      name: string;
      displayName: string;
    }[];
  }[];
  invokeFunc: {
    name: string;
    displayName: string;
    params: {
      name: string;
      displayName: string;
      type: string;
    }[];
  }[];

  constructor(id: string, code: string, container: Element, workMode: number, option: any = {}, useDefaultOpt: boolean = true) {
    this.id = id;
    this.code = code;
    this.container = container;
    this.workMode = workMode;
    this.useDefaultOpt = useDefaultOpt;

    this.dataBind = {};
    this.animation = [];
    this.script = {};
    this.interact = {};
    // this._foldPath = "";
    this.resourceId = "";
    this.beforeDrawScripts = [];
    this.clickScript = [];
    this.getDataScripts = [];
    this.eventFunc = [];
    this.invokeFunc = [];

    this.propertyDictionary = [] as PropertyDictionaryItem[];
    this.property = {} as BaseProperty;

    this._initProperty();
    this._initEvents();
    this._initConf(option);
    this._setupDefaultValues();
  }

  _initConf(option: any) {
    this.property = $.extend(true, this.property, option.property);
    if (typeof option.compDataBind === "string") {
      try {
        option.compDataBind = JSON.parse(option.compDataBind);
      } catch (error) {
        console.error("组件数据绑定类型无法json格式化");
      }
    }
    this.dataBind = $.extend(true, this.dataBind, option.compDataBind);
    this.animation = _.union(this.animation, typeof option.compAnimation === "string" ? JSON.parse(option.compAnimation) : option.compAnimation);
    this.script = $.extend(true, this.script, typeof option.compScript === "string" ? JSON.parse(option.compScript) : option.compScript);
    this.interact = $.extend(true, this.interact, typeof option.compInteract === "string" ? JSON.parse(option.compInteract) : option.compInteract);
    // this._foldPath = WisUtil.scriptPath(this.property.basic.className);
    this.resourceId = option.resourceId;
    this._initConfHandler();
  }

  _initConfHandler() {
    this._compScriptHandler();
  }

  _setupDefaultValues() {
    // this._foldPath = WisUtil.scriptPath(this.property.basic.className);
    // this.hasSelectedForDataLink = false;
    // this.onlyRecordData = true;
    // this.recordData = "";
    // this.sessionId = sessionStorage.getItem("sessionID") || "";
    // this._publicFolderPath = "";
  }

  _initProperty() {
    let property: BaseProperty = {
      basic: {
        code: this.code,
        displayName: "",
        type: "",
        className: "",
        frame: [0, 0, 1920, 1080],
        isVisible: true,
        translateZ: true,
        needSync: false,
        zIndex: 0,
        scale: 1,
        isSendData: false,
        isAnimate: false,
        isDataLinked: false,
      },
    };

    let propertyDictionary: PropertyDictionaryItem[] = [
      {
        name: "basic",
        displayName: "基础属性",
        description: "组件基础属性",
        children: [
          {
            name: "code",
            displayName: "组件编码",
            description: "组件编码",
            type: "string",
            show: true,
            editable: false,
          },
          {
            name: "displayName",
            displayName: "组件名称",
            description: "组件名称",
            type: "string",
            show: true,
            editable: true,
          },
          {
            name: "type",
            displayName: "组件类型",
            description: "组件类型",
            type: "string",
            show: true,
            editable: false,
          },
          {
            name: "className",
            displayName: "组件类名",
            description: "组件类名",
            type: "string",
            show: true,
            editable: false,
          },
          {
            name: "frame",
            displayName: "组件大小",
            description: "组件位置以及大小",
            type: "doubleArray",
            placeholder: ["x", "y", "宽", "高"],
            show: true,
            editable: true,
          },
          {
            name: "isVisible",
            displayName: "是否可见",
            description: "组件是否可见",
            type: "boolean",
            show: true,
            editable: true,
          },
          {
            name: "translateZ",
            displayName: "启用Z轴位移",
            description: "是否启用Z轴位移(启用分层渲染)",
            type: "boolean",
            show: true,
            editable: true,
          },
          {
            name: "needSync",
            displayName: "是否同步",
            description: "跨屏组件是否启动事件同步",
            type: "boolean",
            show: true,
            editable: true,
          },
          {
            name: "zIndex",
            displayName: "组件层级",
            description: "组件的所在画布的层级",
            type: "int",
            show: true,
            editable: true,
          },
          {
            name: "isSendData",
            displayName: "是否发送数据",
            description: "组件在接收到数据后是否发送数据",
            type: "boolean",
            show: true,
            editable: true,
          },
          {
            name: "isAnimate",
            displayName: "是否有动画",
            description: "当前组件是否绑定动画",
            type: "boolean",
            show: true,
            editable: true,
          },
          {
            name: "isDataLinked",
            displayName: "是否有组件联动",
            description: "当前组件是否有组件联动",
            type: "boolean",
            show: true,
            editable: true,
          },
        ],
        show: true,
        editable: true,
      },
    ];

    this.propertyManager = new PropertyManager(property, propertyDictionary);

    this.propertyDictionary = this.propertyManager.getPropertyDictionary();
    this.property = this.propertyManager.getPropertyList();
    // this._addProperty(property, propertyDictionary);
  }

  _initEvents() {
    this.eventFunc = [
      {
        name: "sendData",
        displayName: "发送数据",
        params: [
          {
            name: "data",
            displayName: "数据",
          },
        ],
      },
    ];

    this.invokeFunc = [
      {
        name: "setProperty",
        displayName: "配置属性",
        params: [
          {
            name: "name",
            displayName: "属性名",
            type: "option",
          },
          {
            name: "value",
            displayName: "属性值",
            type: "optionType",
          },
        ],
      },
      {
        name: "showComponent",
        displayName: "是否显示组件",
        params: [
          {
            name: "isShow",
            displayName: "是否显示",
            type: "boolean",
          },
        ],
      },
    ];
  }

  showComponent(isShow: boolean) {
    d3.select(this.container).style("display", isShow ? "block" : "none");
  }

  _addProperty(property: BaseProperty, propertyDictionary: PropertyDictionaryItem[] = []) {
    this.property = $.extend(true, this.property, property);
    if (propertyDictionary.length > 0) {
      this.propertyDictionary = this.propertyDictionary.concat(propertyDictionary);
    }
  }

  _findPropertyDictionary(propertyName: string): Object {
    // return WisCompUtil.findPropertyDictionary(propertyName, this.propertyDictionary);
    return {};
  }

  setProperty(property: any, value: any = null) {
    if (value !== null) {
      property = this._propertyNameToJson(property, value);
    }
    this.property = $.extend(true, this.property, property);
    this._draw();
  }

  _propertyNameToJson(propertyName: string, value: any): Object {
    const propJson = this._findPropertyDictionary(propertyName);
    if (propJson) {
      let json: any = {};
      let jsonObj = json;
      const propArr = propertyName.split(".");
      for (let i = 0; i < propArr.length - 1; i++) {
        jsonObj[propArr[i]] = {};
        jsonObj = jsonObj[propArr[i]];
      }
      jsonObj[propArr[propArr.length - 1]] = value;
      return json;
    } else {
      return {};
    }
  }

  _handlePropertyChange() {
    this.propertyManager.onPropertyChange((path: string, value: any) => {
      switch (path) {
        case "basic.zIndex":
          d3.select(this.container).style("z-index", value);
          break;
      }
    });
  }

  setDataBind(key: string, value: any) {
    this.dataBind[key] = value;
  }

  _compAnimationHandler() {}

  _compScriptHandler() {
    this.getDataScripts = [];
    this.clickScript = [];
    this.beforeDrawScripts = [];
    if (this.script.data === undefined || this.script.data.length === 0) return;
    this.script.data.forEach((scriptObj: any) => {
      console.log(`组件${this.id}绑定脚本${scriptObj.displayName}`);
      switch (scriptObj.trigger) {
        //点击
        case "click":
          this.clickScript.push(scriptObj.content);
          break;
        //接收数据
        case "getData":
          this.getDataScripts.push(scriptObj.content);
          break;
        //绘制组件前
        case "beforeDraw":
          this.beforeDrawScripts.push(scriptObj.content);
          break;
        //todo 其他触发方式
      }
    });

    //绑定点击事件脚本
    d3.select(this.container).on("click", () => {
      this.clickScript.forEach((s) => {
        eval(s);
      });
    });
  }

  _draw() {
    if (this.workMode !== 2) {
      this.beforeDrawScripts.forEach((s) => {
        eval(s);
      });
    }
    let d3Container = d3.select(this.container);
    d3Container.style("display", this.property.basic.isVisible ? "block" : "none").style("z-index", this.property.basic.zIndex);
    if (this.property.basic.translateZ) {
      d3Container.style("transform", "translateZ(0)");
    }
  }
}

export default ComponentBase;
