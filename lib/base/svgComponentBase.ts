import * as d3 from "d3";
import $ from "jquery";
import ComponentBase from "./componentBase";
import OptionType from "./optionType";
import { ComponentProperty, PropertyDictionaryItem } from "../types/compProperty";

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
    const property: ComponentProperty = {
      basic: {
        type: "SVGComponent",
      },
      svgBasic: {
        isViewBox: false,
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
            description: "组件是否启用ViewBox，默认不启用表示没有viewbox属性",
            type: OptionType.boolean,
          },
          {
            name: "viewBox",
            displayName: "可视区域",
            description: "可视区域大小",
            placeholder: ["x", "y", "宽", "高"],
            show: false,
            type: OptionType.doubleArray,
          },
        ],
        show: false,
      },
    ];
    this.addProperty(property, propertyDictionary);
  }

  protected handlePropertyChange() {
    super.handlePropertyChange();
    this.propertyManager?.onPropertyChange((path: string, value: any) => {
      switch (path) {
        case "svgBasic.isViewBox":
          this.propertyManager!.getPropertyDictionaryByPath("svgBasic.viewBox")!.show = value;
          break;
        case "svgBasic.viewBox":
          if (this.property.svgBasic.isViewBox) {
            this.mainSVG.attr("viewBox", value.join(" "));
          }
          break;
      }
    });
  }

  protected draw() {
    super.draw();
    $(this.container).empty();
    const frame = this.property.basic.frame ?? [0, 0, 1920, 1080];
    this.mainSVG = d3.select(this.container).append("svg").attr("class", "mainSVG").attr("x", 0).attr("y", 0).attr("width", frame[2]).attr("height", frame[3]).style("pointer-events", "auto");
    if (this.property.svgBasic.isViewBox) {
      this.mainSVG.attr("viewBox", this.property.svgBasic.viewBox.join(" "));
    }
  }

  protected createClipRect() {
    const clipID = `${this.id}_clip`;
    this.mainSVG.append("defs").append("svg:clipPath").attr("id", clipID).append("svg:rect").attr("id", "clip-rect").attr("x", this.clipRect[0]).attr("y", this.clipRect[1]).attr("width", this.clipRect[2]).attr("height", this.clipRect[3]);

    this.mainSVG.attr("clip-path", `url(#${clipID})`);
  }
}

export default SVGComponentBase;
