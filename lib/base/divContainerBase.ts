import * as d3 from "d3";
import _ from "lodash";
import * as $ from "jquery";
import { ComponentProperty, PropertyDictionaryItem } from "../types/property";
import OptionType from "./optionType";
import DIVComponentBase from "./divComponentBase";

abstract class DIVContainerBase extends DIVComponentBase {
  childrenComponents: any[];
  panelProperty: any;
  panelPropertyDictionary!: PropertyDictionaryItem[];
  containerMap: any;

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
            style: "blue",
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
                style: "red",
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
    if (this.workMode === 2) this.initPanelPropertyDictionary();
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

  protected initPanelPropertyDictionary() {
    let panelProperty = this.property.panel;
    let panelPropertyDictionary = this.getPropertyDictionary("panel");

    for (const panelId in panelProperty) {
      if (Object.prototype.hasOwnProperty.call(panelProperty, panelId) && this.getPropertyDictionary("panel") === undefined) {
        panelPropertyDictionary!.children!.push({
          name: panelId,
          description: panelId,
          displayName: panelId,
          action: [
            {
              text: "删除组",
              style: "red",
              action: "deletePanel",
              param: ["parentIndex"],
            },
          ],
          children: _.cloneDeep(this.panelPropertyDictionary),
          show: true,
          editable: true,
        });
      }
    }
  }

  public addPanel() {
    let panelPropertyDictionary = this.getPropertyDictionary("panel") ?? ({} as any);
    let lastIndex = 0;
    if (panelPropertyDictionary.children.length > 0) {
      lastIndex = Math.max(panelPropertyDictionary.children.map((d: any) => parseInt(d.name.split("_")[1]))) + 1;
    }
    let panelName = `panel_${lastIndex}`;
    this.property.panel[panelName] = _.cloneDeep(this.panelProperty);
    panelPropertyDictionary.children.push({
      name: panelName,
      displayName: panelName,
      action: [
        {
          text: "删除组",
          style: "red",
          action: "deletePanel",
          param: ["parentIndex"],
        },
      ],
      children: _.cloneDeep(this.panelPropertyDictionary),
      show: true,
      editable: true,
    });
  }

  public deletePanel(index: number) {
    let panelPropertyDictionary = this.getPropertyDictionary("panel");
    let panelName = panelPropertyDictionary!.children![index].name;
    panelPropertyDictionary!.children!.splice(index, 1);
    delete this.property.panel[panelName];
    for (let i = 0; i < this.property.containerJson.length; i++) {
      if (this.property.containerJson[i].paneId === panelName) {
        this.property.containerJson.splice(i, 1);
        break;
      }
    }
  }

  protected drawPanel(container: d3.Selection<HTMLElement, unknown, any, unknown>, option: { paneId: string; left?: number; top?: number; width?: number; height?: number }) {
    const ele = container.append("div");
    const opt = { ...{ paneId: "", top: 0, left: 0, width: this.property.basic.frame[2], height: this.property.basic.frame[3] }, ...option };
    ele.style("top", opt.top).style("left", opt.left).style("width", opt.width).style("height", opt.height);
    this.containerMap[opt.paneId] = ele;
    return ele;
  }

  protected drawChidlrenComponents(paneId: string | null = null) {
    this.cleanup();
    if (paneId === null) {
      for (const containerObj of this.property.containerJson) {
        const panelId = containerObj.paneId;
        const container = this.containerMap[panelId];
        $(container.node()).empty();
      }
    }
  }
}

export default DIVContainerBase;
