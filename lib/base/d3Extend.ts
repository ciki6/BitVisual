import * as d3 from "d3";

interface FontStyle {
  family: string;
  size: string;
  color: string;
  bolder: boolean;
  italic: boolean;
  underline: boolean;
  lineThrough: boolean;
}

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
        .style("font-size", size)
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
