import * as d3 from "d3";

type FontStyle = {
  family: string;
  size: string;
  color: string;
  bolder: boolean;
  italic: boolean;
  underline: boolean;
  lineThrough: boolean;
};

type ColorStop = {
  color: string;
  id: string;
  offset: number;
};

type Color = {
  angle: number;
  colorString: string;
  stops: ColorStop[];
};

declare module "d3-selection" {
  interface Selection<GElement extends d3.BaseType, Datum, PElement extends d3.BaseType, PDatum> {
    setFontStyle(style: FontStyle): this;
    attr(attrs: Record<string, string | number | boolean> | string, value?: string | number | boolean): this;
    style(styles: Record<string, string | number | boolean> | string, value?: string | number | boolean, priority?: string): this;
  }
}

class D3Extend {
  constructor() {
    d3.selection.prototype.setFontStyle = this.setFontStyle;
    d3.selection.prototype.setColor = this.setColor;
    this.extendAttr();
    this.extendStyle();
  }

  private setFontStyle = function (this: d3.Selection<d3.BaseType, unknown, null, undefined>, style: FontStyle): d3.Selection<d3.BaseType, unknown, null, undefined> {
    return this.each(function () {
      const selection = d3.select(this);
      const isSVGElement = this instanceof SVGElement;
      const { family, size, color, bolder, italic, underline, lineThrough } = style;

      selection
        .style("font-family", family)
        .style("font-size", size + "px")
        .style("font-weight", bolder ? "bold" : "normal")
        .style("font-style", italic ? "italic" : "normal");
      if (isSVGElement) {
        selection.attr("fill", color);
      } else {
        selection.style("color", color);
      }
      if (isSVGElement) {
        const textNode = this as SVGTextElement;
        const textBBox = textNode.getBBox();
        const lineY = textBBox.y + textBBox.height;
        const strikeY = textBBox.y + textBBox.height / 2;

        const parentSelection = d3.select(textNode.parentNode as Element);
        parentSelection.selectAll(".underline, .line-through").remove();

        if (underline) {
          parentSelection
            .append("line")
            .attr("class", "underline")
            .attr("x1", textBBox.x)
            .attr("y1", lineY)
            .attr("x2", textBBox.x + textBBox.width)
            .attr("y2", lineY)
            .attr("stroke", color)
            .attr("stroke-width", "1");
        }

        if (lineThrough) {
          parentSelection
            .append("line")
            .attr("class", "line-through")
            .attr("x1", textBBox.x)
            .attr("y1", strikeY)
            .attr("x2", textBBox.x + textBBox.width)
            .attr("y2", strikeY)
            .attr("stroke", color)
            .attr("stroke-width", "1");
        }
      } else {
        selection.style("color", color);

        const textDecoration: string[] = [];
        if (underline) textDecoration.push("underline");
        if (lineThrough) textDecoration.push("line-through");
        selection.style("text-decoration", textDecoration.join(" "));
      }
    });
  };

  private setColor = function (this: d3.Selection<d3.BaseType, unknown, null, undefined>, color: Color | string): d3.Selection<d3.BaseType, unknown, null, undefined> {
    return this.each(function (_, i, group) {
      const selection = d3.select(this);
      const isSVGElement = this instanceof SVGElement;
      if (typeof color === "string") {
        if (isSVGElement) {
          selection.attr("fill", color);
        } else {
          selection.style("color", color);
        }
      } else {
        const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
        if (isSVGElement) {
          const svgElement = this.ownerSVGElement;
          if (!svgElement) return;
          let defs = d3.select(svgElement).select("defs") as d3.Selection<SVGDefsElement, unknown, null, undefined>;
          if (defs.empty()) {
            defs = d3.select(svgElement).append("defs");
          }
          if (i === 0) {
            defs.select(`#${gradientId}`).remove();

            const linearGradient = defs
              .append("linearGradient")
              .attr("id", gradientId)
              .attr("gradientUnits", "userSpaceOnUse")
              .attr("x1", `${Math.cos((color.angle - 90) * (Math.PI / 180)) * 100}%`)
              .attr("y1", `${Math.sin((color.angle - 90) * (Math.PI / 180)) * 100}%`)
              .attr("x2", `${Math.cos((color.angle + 90) * (Math.PI / 180)) * 100}%`)
              .attr("y2", `${Math.sin((color.angle + 90) * (Math.PI / 180)) * 100}%`);

            color.stops.forEach((stop) => {
              linearGradient.append("stop").attr("offset", `${stop.offset}%`).attr("stop-color", stop.color);
            });
          }
          selection.attr("fill", `url(#${gradientId})`);
        } else {
          const gradientStops = color.stops.map((stop) => `${stop.color} ${stop.offset}%`).join(", ");
          const cssGradient = `linear-gradient(${color.angle}deg, ${gradientStops})`;
          selection.style("background", cssGradient);
        }
      }
    });
  };

  private extendAttr = () => {
    const originalAttr = d3.selection.prototype.attr;
    d3.selection.prototype.attr = function (nameOrAttrs: Record<string, string | number | boolean> | string, value?: string | number | boolean) {
      if (typeof nameOrAttrs === "object" && nameOrAttrs !== null) {
        for (const [key, val] of Object.entries(nameOrAttrs)) {
          originalAttr.call(this, key, val);
        }
        return this;
      } else {
        return originalAttr.call(this, nameOrAttrs, value);
      }
    };
  };

  private extendStyle() {
    const originalStyle = d3.selection.prototype.style;
    d3.selection.prototype.style = function (nameOrStyles: Record<string, string | number | boolean> | string, value?: string | number | boolean, priority?: string) {
      if (typeof nameOrStyles === "object" && nameOrStyles !== null) {
        for (const [key, val] of Object.entries(nameOrStyles)) {
          originalStyle.call(this, key, val, priority);
        }
        return this;
      } else {
        return originalStyle.call(this, nameOrStyles, value);
      }
    };
  }
}

new D3Extend();
