import { BaseProperty, PropertyDictionaryItem } from "lib/types/compProperty";
import OptionType from "./optionType";
import PropertyManager from "./property";
import * as d3 from "d3";

class CustomComponent {
  id: string;
  code: string;
  container: Element;
  workMode: number;
  useDefaultOpt: boolean;
  resourceId: string | undefined;
  propertyDictionary: PropertyDictionaryItem[];
  property: BaseProperty;
  propertyManager: any;
  childrenComponents: any[];
  constructor(id: string, code: string, container: Element, workMode: number, option: any = {}, useDefaultOpt: boolean = true) {
    this.id = id;
    this.code = code;
    this.resourceId = option.resourceId;
    this.container = container;
    this.workMode = workMode;
    this.useDefaultOpt = useDefaultOpt;
    this.propertyDictionary = [];
    this.childrenComponents = [];
    this.property = {} as BaseProperty;
    this.initProperty();
    this.property = $.extend(true, this.property, option.property);
    this.draw();
  }

  initProperty() {
    const property: BaseProperty = {
      basic: {
        code: this.code,
        displayName: "",
        type: "custom",
        className: "",
        frame: [0, 0, 1920, 1080],
        isVisible: true,
        translateZ: true,
        needSync: false,
        zIndex: 0,
        scale: 1,
        isDataLinked: false,
        isSendData: false,
        isAnimate: false,
      },
      childComp: [],
    };

    const propertyDictionary: PropertyDictionaryItem[] = [
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
            name: "frame",
            displayName: "组件大小",
            description: "组件位置以及大小",
            type: OptionType.doubleArray,
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

  public setProperty(path: string | Partial<BaseProperty>, value?: any): void {
    this.propertyManager.set(path, value);
  }

  protected draw() {}

  protected generateChildrenComp() {
    this.childrenComponents = [];
    const parentZIndex = this.property.basic.zIndex;
    this.property.childComp.forEach((item: any, index: number) => {
      const className = item.property.basic.className;
      const code = this.code + "_" + index;
      const zIndex = item.property.basic.zIndex + parentZIndex;
      item.property.basic.zIndex = zIndex;
      item.resourceId = this.resourceId;
      const container = d3
        .select(this.container)
        .style("z-idnex", parentZIndex)
        .select("div")
        .append("div")
        .attr("id", `comp_${this.id}_${code}`)
        .style("position", "absolute")
        .style("left", `${item.property.basic.frame[0]}px`)
        .style("top", `${item.property.basic.frame[1]}px`)
        .style("width", `${item.property.basic.frame[2]}px`)
        .style("height", `${item.property.basic.frame[3]}px`)
        .style("z-idnex", `${item.property.basic.zIndex}`)
        .node();
      const comp = eval(`new ${className}(this.id, code, container, this.workMode, compOpt, false)`);
      this.childrenComponents.push(comp);
    });
  }

  cleanup() {
    this.childrenComponents.forEach((item: any) => item.cleanup());
  }
}

export default CustomComponent;
