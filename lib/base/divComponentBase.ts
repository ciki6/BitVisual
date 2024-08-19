import * as d3 from "d3";
import ComponentBase from "./componentBase";
import { BaseProperty } from "../types/property";

abstract class DIVComponentBase extends ComponentBase {
  mainDIV: any;

  constructor(id: string, code: string, container: Element, workMode: number, option: any, useDefaultOpt: boolean) {
    super(id, code, container, workMode, option, useDefaultOpt);
    this.mainDIV = null;
  }

  protected initProperty(): void {
    super.initProperty();
    const property: BaseProperty = {
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
    this.mainDIV = d3Container.append("div").attr("class", "mainDIV").style("position", "absolute").style("left", "0").style("top", "0").style("width", `${frame[2]}px`).style("height", `${frame[3]}px`).style("overflow", "hidden").style("pointer-events", "auto");
  }
}

export default DIVComponentBase;
