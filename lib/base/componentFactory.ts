import * as d3 from "d3";

export class ComponentFactory {
  className: string;
  id: string;
  code: string;
  container: Element;
  workMode: number;
  opts: any;
  useDefaultOpt: boolean;
  constructor(className: string, id: string, code: string, container: Element, workMode: number, opts: any, useDefaultOpt: boolean) {
    this.className = className;
    this.id = id;
    this.code = code;
    this.container = container;
    this.workMode = workMode || 1;
    this.opts = opts;
    this.useDefaultOpt = useDefaultOpt;
    return this._createComponent();
  }

  _createComponent() {
    let executeString = `new ${this.className}(this.id, this.code, this.container, this.workMode, this.opts, this.useDefaultOpt)`;
    if (this.opts.property.basic.type === "custom") {
      executeString = "new CustomComponent(this.id, this.code, this.container, this.workMode, this.opts, this.useDefaultOpt)";
    }
    return eval(executeString);
  }
}

export class ComponentsFactory {
  data: any;
  container: any;
  workMode: number;
  opts: any;
  components: any[];
  constructor(data: any, container: any, workMode: number, opts = {}) {
    this.data = data;
    this.container = container;
    this.workMode = workMode || 1;
    this.opts = opts;
    this.components = [];
    this._initComponent();
  }

  _initComponent() {
    var div, object;
    var className, compId, compCode, frame, compConf, zIndex, compOption;

    for (var i = 0; i < this.data.length; i++) {
      let curData = this.data[i] || {};
      compConf = curData.compConf;
      compConf.basic.fontScale = this.opts.fontScale || 1;
      compId = curData.id;
      className = compConf.basic.className;
      compCode = compConf.basic.code;

      var fScale = this.opts.fontScale || 1;
      var compBasicF = compConf.basic.saveFrame ? compConf.basic.saveFrame : compConf.basic.frame;
      compConf.basic.saveFrame = compBasicF;
      compConf.basic.frame = [compBasicF[0] * fScale, compBasicF[1] * fScale, compBasicF[2] * fScale, compBasicF[3] * fScale];
      frame = compConf.basic.frame;
      zIndex = curData.compZindex + "";
      compOption = {
        property: compConf || {},
        compDataBind: curData.compDataBind || {},
        compAnimation: curData.compAnimation || {},
        compScript: curData.compScript || {},
        compInteract: curData.compInteract || {},
        compData: curData.compData || {},
        resourceId: this.opts.resourceId || "",
      };

      div = this.createDivElement(frame, compId, compCode);
      this.container.node().appendChild(div);
      try {
        object = new ComponentFactory(className, compId, compCode, div, this.workMode, compOption, false);
      } catch (error) {
        console.error(`Failed to create component : ${className}, id:${compId}, code:${compCode}`);
      }
      this.components[i] = object;

      if (zIndex.length > 0) d3.select(div).style("z-index", Number(zIndex));
    }
  }

  private createDivElement(frame: number[], name: string, compCode: string): HTMLDivElement {
    return d3.create("div").attr("id", `comp_${name}`).attr("name", name).attr("data-compCode", compCode).attr("style", `position:absolute; left: ${frame[0]}px; top: ${frame[1]}px; width: ${frame[2]}px; height: ${frame[3]}px;`).node() as HTMLDivElement;
  }
}
