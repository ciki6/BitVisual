import * as d3 from "d3";
import ComponentBase from "./componentBase";
import OptionType from "./optionType";
import { BaseProperty, PropertyDictionaryItem } from "../types/property";

abstract class SVGComponentBase extends ComponentBase {

  mainSVG: any;

  constructor(id: string, code: string, container: Element, workMode: number, option: any, useDefaultOpt: boolean) {
    super(id, code, container, workMode, option, useDefaultOpt);
    this.mainSVG = null;
  }

  protected setupDefaultValues() {
    super.setupDefaultValues();
  }

  protected initProperty() {
    super.initProperty();
    const property: BaseProperty = {
      basic: {
        type: "SVGComponent",
      },
      svgBasic: {
        isViewBox: true,
        lockViewBox: false,
        viewBox: [0, 0, 1920, 1080],
      },
    };

    const propertyDictionary: PropertyDictionaryItem[] = [
      {
        name: "svgBasic",
        displayName: "SVG组件基础属性",
        description: "SVG组件基础属性",
        children: [
          {
            name: "isViewBox",
            displayName: "启用ViewBox",
            description: "组件是否启用ViewBox",
            type: OptionType.boolean,
            show: true,
            editable: true,
          },
          {
            name: "lockViewBox",
            displayName: "锁定ViewBox",
            description: "指定组件viewbox，若不锁定则跟随组件大小变化",
            type: OptionType.boolean,
            show: true,
            editable: true,
          },
          {
            name: "viewBox",
            displayName: "可视区域",
            description: "可视区域大小",
            placeholder: ["x", "y", "宽", "高"],
            type: OptionType.doubleArray,
            show: true,
            editable: true,
          },
        ],
        show: false,
        editable: true,
      },
    ];
    this.addProperty(property, propertyDictionary);
  }

  protected handlePropertyChange() {
    super.handlePropertyChange();
    this.propertyManager.onPropertyChange((path: string, value: any) => {
      switch (path) {
        case "svgBasic.viewBox":
          this.mainSVG.attr("viewBox", value.join(" "));
          break;
      }
    });
  }

  protected draw() {
    super.draw();
    const d3Container = d3.select(this.container);
    d3Container.select("svg").remove();
    const frame = this.property.basic.frame ?? [0, 0, 1920, 1080];
    this.mainSVG = d3Container.append("svg").attr("class", "mainSVG").attr("x", 0).attr("y", 0).attr("width", frame[2]).attr("height", frame[3]).style("pointer-events", "auto").attr("viewBox", this.property.svgBasic.viewBox.join(" "));
  }

  protected createClipRect() {
    const clipID = `${this.id}_clip`;
    this.mainSVG.append("defs").append("svg:clipPath").attr("id", clipID).append("svg:rect").attr("id", "clip-rect").attr("x", this.clipRect[0]).attr("y", this.clipRect[1]).attr("width", this.clipRect[2]).attr("height", this.clipRect[3]);

    this.mainSVG.attr("clip-path", `url(#${clipID})`);
  }
}

export default SVGComponentBase;
