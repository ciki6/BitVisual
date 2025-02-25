import * as d3 from "d3";
import ComponentBase from "./componentBase";
import { ComponentProperty } from "../types/compProperty";

abstract class DIVComponentBase extends ComponentBase {
  mainDIV: any;

  constructor(id: string, code: string, container: Element, workMode: number, option: any, useDefaultOpt: boolean) {
    super(id, code, container, workMode, option, useDefaultOpt);
    this.mainDIV = null;
  }

  protected initProperty(): void {
    super.initProperty();
    const property: ComponentProperty = {
      basic: {
        type: "DIVComponent",
      },
    };
    this.addProperty(property, []);
  }

  protected draw() {
    super.draw();
    const d3Container = d3.select(this.container);
    const frame = this.property.basic.frame ?? [0, 0, 1920, 1080];
    d3Container.select(".mainDIV").remove();
    this.mainDIV = d3Container
      .append("div")
      .attr("class", "mainDIV")
      .style({
        position: "absolute",
        left: 0,
        top: 0,
        width: frame[2] + "px",
        height: frame[3] + "px",
        overflow: "hidden",
        "pointer-event": "auto",
      });
  }
}

export default DIVComponentBase;
