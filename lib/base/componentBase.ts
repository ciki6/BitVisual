import _ from "lodash";
import * as d3 from "d3";

import PropertyManager from "./property";
import { BaseProperty, PropertyDictionaryItem } from "../types/compProperty";
import { ComponentOption } from "lib/types/compOption";
import OptionType from "./optionType";
import DataModule from "./compData";
import SyncModule from "./compSync";

type Constructor<T = {}> = new (...args: any[]) => T;

type MergeArrayItem = { name?: string; [key: string]: any };

abstract class ComponentBase {
  id: string;
  code: string;
  container: Element;
  workMode: number;
  useDefaultOpt: boolean;
  propertyDictionary: PropertyDictionaryItem[];
  property: BaseProperty;
  propertyManager: PropertyManager | undefined;
  dataBind: any;
  animation: any;
  script: any;
  interact: any;
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
  defaultData: any;
  webSocket: any;
  commandUUID: string | null;
  onlyRecordData: Boolean;
  recordData: any;
  isSubscribeData: Boolean;
  clipRect: number[];
  public dataModule: { [key: string]: Function } = {};
  public syncModule: { [key: string]: Function } = {};
  public animeModule: { [key: string]: Function } = {};
  version: string | undefined;
  unionGroup: string | undefined;

  constructor(id: string, code: string, container: Element, workMode: number, option: ComponentOption = {}, useDefaultOpt: boolean = true) {
    this.id = id;
    this.code = code;
    this.container = container;
    this.workMode = workMode;
    this.useDefaultOpt = useDefaultOpt;

    this.dataBind = {};
    this.animation = [];
    this.script = {};
    this.interact = {};
    this.resourceId = "";
    this.beforeDrawScripts = [];
    this.clickScript = [];
    this.getDataScripts = [];
    this.eventFunc = [];
    this.invokeFunc = [];
    this.defaultData = null;
    this.webSocket = null;
    this.commandUUID = null;
    this.onlyRecordData = false;
    this.recordData = {};
    this.isSubscribeData = false;
    this.clipRect = [];

    this.propertyDictionary = [] as PropertyDictionaryItem[];
    this.property = {} as BaseProperty;

    this.initMethods(DataModule, this.dataModule);
    this.initMethods(SyncModule, this.syncModule);

    this.initProperty();
    this.initEvents();
    this.initConf(option);
    this.setupDefaultValues();
    this.handlePropertyChange();
  }

  private initMethods<T>(ModuleClass: Constructor<T>, target: { [key: string]: Function }): void {
    const moduleInstance = new ModuleClass(this);
    const prototype = Object.getPrototypeOf(moduleInstance);

    Object.getOwnPropertyNames(prototype).forEach((method) => {
      if (method !== "constructor" && typeof prototype[method] === "function") {
        target[method] = prototype[method].bind(moduleInstance);
      }
    });
  }

  protected initConf(option: ComponentOption): void {
    this.dataBind = this.deepMerge(option.compDataBind, this.dataBind);
    this.animation = this.deepMerge(option.compAnimation, this.animation);
    this.script = this.deepMerge(option.compScript, this.script);
    this.interact = this.deepMerge(option.compInteract, this.interact);
    this.resourceId = option.resourceId;
    this.version = option.compVersion;
    this.unionGroup = option.unionGroup;
    this.propertyManager = new PropertyManager(this.deepMerge(option.property as any, this.property), this.deepMerge(option.propertyDictionary as any, this.propertyDictionary));
    this.propertyDictionary = this.propertyManager.getPropertyDictionary();
    this.property = this.propertyManager.getPropertyList();
    this.initConfHandler();
  }

  protected deepMerge<T extends object>(a: T, b: T): T {
    if (a === undefined) return b;
    return _.mergeWith({}, b, a, (bValue, aValue) => {
      if (_.isArray(bValue) && _.isArray(aValue)) {
        return this.mergeArray(aValue as MergeArrayItem[], bValue as MergeArrayItem[]);
      }
      if (_.isObject(bValue) && _.isObject(aValue)) {
        return this.deepMerge(aValue, bValue);
      }
      return aValue !== undefined ? aValue : bValue;
    });
  }

  protected mergeArray(aArray: MergeArrayItem[], bArray: MergeArrayItem[]): MergeArrayItem[] {
    if (aArray.every(_.isObject) && bArray.every(_.isObject)) {
      return bArray.map((bItem) => {
        const aItem = aArray.find((item) => item.name === bItem.name);
        return aItem ? this.deepMerge(aItem, bItem) : bItem;
      });
    }
    return aArray.length ? aArray : bArray;
  }

  protected initConfHandler(): void {
    this.compScriptHandler();
  }

  protected setupDefaultValues(): void {}

  protected initProperty(): void {
    let property: BaseProperty = {
      basic: {
        code: this.code,
        theme: "",
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
            type: OptionType.string,
            editable: false,
          },
          {
            name: "displayName",
            displayName: "组件名称",
            description: "组件名称",
            type: OptionType.string,
          },
          {
            name: "type",
            displayName: "组件类型",
            description: "组件类型",
            type: OptionType.string,
            editable: false,
          },
          {
            name: "className",
            displayName: "组件类名",
            description: "组件类名",
            type: OptionType.string,
            editable: false,
          },
          {
            name: "theme",
            displayName: "主题",
            description: "主题",
            type: OptionType.string,
            editable: true,
          },
          {
            name: "frame",
            displayName: "组件大小",
            description: "组件位置以及大小",
            type: OptionType.size,
            placeholder: ["x", "y", "宽", "高"],
          },
          {
            name: "isVisible",
            displayName: "是否可见",
            description: "组件是否可见",
            type: OptionType.boolean,
          },
          {
            name: "translateZ",
            displayName: "启用Z轴位移",
            description: "是否启用Z轴位移(启用分层渲染)",
            type: OptionType.boolean,
          },
          {
            name: "needSync",
            displayName: "是否同步",
            description: "跨屏组件是否启动事件同步",
            type: OptionType.boolean,
          },
          {
            name: "zIndex",
            displayName: "组件层级",
            description: "组件的所在画布的层级",
            type: OptionType.int,
          },
          {
            name: "isSendData",
            displayName: "是否发送数据",
            description: "组件在接收到数据后是否发送数据",
            type: OptionType.boolean,
          },
          {
            name: "isAnimate",
            displayName: "是否有动画",
            description: "当前组件是否绑定动画",
            type: OptionType.boolean,
          },
          {
            name: "isDataLinked",
            displayName: "是否有组件联动",
            description: "当前组件是否有组件联动",
            type: OptionType.boolean,
          },
        ],
      },
    ];
    this.addProperty(property, propertyDictionary);
  }

  protected addProperty(property: any, propertyDic: PropertyDictionaryItem[]): void {
    if (this.propertyManager) {
      this.propertyManager.addProperty(property, propertyDic);
    } else {
      this.propertyManager = new PropertyManager(property, propertyDic);
    }

    this.propertyDictionary = this.propertyManager.getPropertyDictionary();
    this.property = this.propertyManager.getPropertyList();
  }

  protected initEvents(): void {
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

  public showComponent(isShow: boolean): void {
    d3.select(this.container).style("display", isShow ? "block" : "none");
  }

  protected getPropertyDictionary(path: string): PropertyDictionaryItem | undefined {
    return this.propertyManager?.getPropertyDictionaryByPath(path);
  }

  public setProperty(path: string | Partial<BaseProperty>, value?: any): void {
    if (_.get(this.property, path) === value) return;
    this.propertyManager?.set(path, value);
  }

  protected handlePropertyChange(): void {
    this.propertyManager?.onPropertyChange((path: string, value: any) => {
      switch (path) {
        case "basic.zIndex":
          d3.select(this.container).style("z-index", value);
          break;
      }
    });
  }

  public setDataBind(key: string, value: any): void {
    this.dataBind[key] = value;
  }

  protected compAnimationHandler(): void {}

  protected compScriptHandler(): void {
    this.getDataScripts = [];
    this.clickScript = [];
    this.beforeDrawScripts = [];
    if (this.script.data === undefined || this.script.data.length === 0) return;
    this.script.data.forEach((scriptObj: any) => {
      console.log(`组件${this.id}绑定脚本${scriptObj.displayName}`);
      switch (scriptObj.trigger) {
        case "click":
          this.clickScript.push(scriptObj.content);
          break;
        case "getData":
          this.getDataScripts.push(scriptObj.content);
          break;
        case "beforeDraw":
          this.beforeDrawScripts.push(scriptObj.content);
          break;
      }
    });

    d3.select(this.container).on("click", () => {
      this.clickScript.forEach((s) => {
        const fn = new Function(s);
        fn();
      });
    });
  }

  protected draw(): void {
    this.property = this.propertyManager?.getPropertyList() as BaseProperty;
    if (this.workMode !== 2) {
      this.beforeDrawScripts.forEach((s) => {
        const fn = new Function(s);
        fn();
      });
    }
    let d3Container = d3.select(this.container);
    d3Container.style("display", this.property.basic.isVisible ? "block" : "none").style("z-index", this.property.basic.zIndex ?? 0);
    if (this.property.basic.translateZ) {
      d3Container.style("transform", "translateZ(0)");
    }
  }

  abstract update(data: any, groupId: string): void;

  public cleanup(): void {
    this.dataModule.unsubscribeDataSource();
    if (window.wiscomWebSocket) {
      this.animeModule.stopAnimate();
    }
    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket.heartBeatIntervaler && clearInterval(this.webSocket.heartBeatIntervaler);
      this.webSocket = null;
    }
  }

  passiveLoad(): void {}

  public setClipRect(x: number, y: number, w: number, h: number): void {
    this.clipRect = [x, y, w, h];
    if (this.property.basic.needSync) {
      this.createClipRect();
      this.syncModule.initEventSync();
    }
  }

  protected createClipRect(): void {}
}

export default ComponentBase;
