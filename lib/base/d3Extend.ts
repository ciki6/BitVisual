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
  }
}

class D3Extend {
  constructor() {
    d3.selection.prototype.setFontStyle = this.setFontStyle;
  }

  setFontStyle = function (this: d3.Selection<d3.BaseType, unknown, null, undefined>, style: FontStyle): d3.Selection<d3.BaseType, unknown, null, undefined> {
    return this.each(function () {
      const textSelection = d3.select(this);
      textSelection
        .attr("font-family", style.family)
        .attr("font-size", style.size)
        .attr("fill", style.color)
        .attr("font-weight", style.bolder ? "bold" : "normal")
        .attr("font-style", style.italic ? "italic" : "normal");

      const textNode = this as SVGTextElement;
      const { underline, lineThrough } = style;
      const textBBox = textNode.getBBox();
      const lineY = textBBox.y + textBBox.height;
      const strikeY = textBBox.y + textBBox.height / 2;

      const parentNode = textNode.parentNode as Element | null;
      if (parentNode) {
        const parentSelection = d3.select(parentNode);

        parentSelection.selectAll(".underline, .line-through").remove();

        if (underline) {
          parentSelection
            .append("line")
            .attr("class", "underline")
            .attr("x1", textBBox.x)
            .attr("y1", lineY)
            .attr("x2", textBBox.x + textBBox.width)
            .attr("y2", lineY)
            .attr("stroke", style.color)
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
            .attr("stroke", style.color)
            .attr("stroke-width", "1");
        }
      }
    });
  };
}

new D3Extend();
