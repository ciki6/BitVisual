import * as d3 from "d3";
import _ from "lodash";
import { ComponentProperty, PropertyDictionaryItem } from "../types/property";
import OptionType from "./optionType";
import DIVComponentBase from "./divComponentBase";

abstract class DIVContainerBase extends DIVComponentBase {
  childrenComponents: any[];
  panelProperty: any;
  panelPropertyDictionary!: PropertyDictionaryItem[];

  constructor(id: string, code: string, container: Element, workMode: number, option: any, useDefaultOpt: boolean) {
    super(id, code, container, workMode, option, useDefaultOpt);
    this.childrenComponents = [];
  }

  protected setupDefaultValues(): void {
    super.setupDefaultValues();
  }

  initPanelProperty() {
    this.panelProperty = {
      panelName: "",
      panelFrame: [0, 0, 100, 100],
      panelBgImage: "",
    };

    this.panelPropertyDictionary = [
      {
        name: "panelName",
        displayName: "面板名称",
        description: "面板名称",
        type: OptionType.string,
        show: true,
        editable: true,
      },
      {
        name: "panelFrame",
        displayName: "面板大小",
        description: "面板位置以及大小",
        type: OptionType.doubleArray,
        placeholder: ["x", "y", "宽", "高"],
        show: true,
        editable: false,
      },
      {
        name: "panelBgImage",
        displayName: "面板背景",
        description: "面板背景图",
        type: OptionType.string,
        show: true,
        editable: true,
      },
    ];
  }

  protected initProperty(): void {
    super.initProperty();
    this.initPanelProperty();
    const property: ComponentProperty = {
      basic: {
        type: "container",
      },
      basicSetting: {
        isLazyLoad: false,
      },
      panel: {
        panel_0: _.cloneDeep(this.panelProperty),
      },
      containerJson: [],
    };
    const propertyDictionary: PropertyDictionaryItem[] = [
      {
        name: "basicSetting",
        displayName: "容器组件设置",
        description: "容器组件基础设置",
        show: true,
        editable: true,
        children: [
          {
            name: "isLazyLoad",
            displayName: "是否动态加载",
            description: "是否动态加载组件",
            type: OptionType.boolean,
            show: true,
            editable: true,
          },
        ],
      },
      {
        name: "panel",
        displayName: "面板组",
        description: "面板组基础设置",
        action: [
          {
            text: "新增",
            style: "success",
            action: "addPanel",
            param: [],
          },
        ],
        children: [
          {
            name: "panel_0",
            displayName: "面板0",
            description: "",
            action: [
              {
                text: "删除组",
                style: "error",
                action: "deletePanel",
                param: ["parentIndex"],
              },
            ],
            children: _.cloneDeep(this.panelPropertyDictionary),
            show: true,
            editable: true,
          },
        ],
        show: true,
        editable: true,
      },
    ];
    this.addProperty(property, propertyDictionary);
  }

  protected draw() {
    super.draw();
    this.initPanelPropertyDictionary();
  }

  public getAllChildren(): any[] {
    return this.childrenComponents;
  }

  public cleanup(): void {
    this.childrenComponents.forEach((childComp) => {
      childComp.cleanup();
      d3.select(childComp.container).remove();
    });
  }

  protected initPanelPropertyDictionary() {}
}

export default DIVContainerBase;
