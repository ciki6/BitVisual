import * as d3 from "d3";
import SVGComponentBase from "../base/svgComponentBase";

import { BaseProperty, PropertyDictionaryItem } from "lib/types/property";

import OptionType from "../base/optionType";

interface dataType {
  x: string;
  y: number;
}

class BarChart extends SVGComponentBase {
  private margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  private x: d3.ScaleBand<string>;
  private y: d3.ScaleLinear<number, number>;

  constructor(id: string, code: string, container: Element, workMode: number, option: Object, useDefaultOpt: boolean) {
    super(id, code, container, workMode, option, useDefaultOpt);
    this.margin = {
      top: 20,
      right: 0,
      bottom: 30,
      left: 40,
    };
    this.x = d3.scaleBand();
    this.y = d3.scaleLinear();
    this.draw();
  }

  protected setupDefaultValues(): void {
    super.setupDefaultValues();
    this.defaultData = [
      { x: "A", y: 0.08167 },
      { x: "B", y: 0.01492 },
      { x: "C", y: 0.02782 },
      { x: "D", y: 0.04253 },
      { x: "E", y: 0.12702 },
      { x: "F", y: 0.02288 },
      { x: "G", y: 0.02015 },
      { x: "H", y: 0.06094 },
      { x: "I", y: 0.06966 },
      { x: "J", y: 0.00153 },
      { x: "K", y: 0.00772 },
      { x: "L", y: 0.04025 },
      { x: "M", y: 0.02406 },
      { x: "N", y: 0.06749 },
      { x: "O", y: 0.07507 },
      { x: "P", y: 0.01929 },
      { x: "Q", y: 0.00095 },
      { x: "R", y: 0.05987 },
      { x: "S", y: 0.06327 },
      { x: "T", y: 0.09056 },
      { x: "U", y: 0.02758 },
      { x: "V", y: 0.00978 },
      { x: "W", y: 0.0236 },
      { x: "X", y: 0.0015 },
      { x: "Y", y: 0.01974 },
      { x: "Z", y: 0.00074 },
    ] as dataType[];
  }

  protected initProperty(): void {
    super.initProperty();
    const property: BaseProperty = {
      basic: {
        className: "BarChart",
      },
      fontSetting: {
        fontSize: 16,
      },
    };

    const propertyDictionary: PropertyDictionaryItem[] = [
      {
        name: "fontSetting",
        displayName: "文字属性",
        description: "文字属性",
        children: [
          {
            name: "fontSize",
            displayName: "文字大小",
            description: "文字大小",
            type: OptionType.int,
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

  protected handlePropertyChange(): void {
    this.propertyManager.onPropertyChange((path: string, value: any) => {
      switch (path) {
        case "fontSetting.fontSize":
          d3.select(this.container)
            .selectAll("text")
            .style("font-size", value + "px");
          break;
      }
    });
  }

  protected draw() {
    super.draw();
    this.render();
  }

  private render(): void {
    const g = this.mainSVG.append("g").attr("id", this.id);
    g.append("g").attr("class", "axes");
    g.append("g").attr("class", "graph");
    this.renderAxis();
    this.renderBar();
  }

  private renderAxis(): void {
    const data = this.defaultData;
    const width = 1920;
    const height = 1080;
    this.mainSVG.select(".axes").selectAll(".axis").remove();
    this.x = d3
      .scaleBand()
      .domain(d3.sort(data, (d: dataType) => -d.y).map((d) => d.x))
      .range([this.margin.left, width - this.margin.right])
      .padding(0.1);

    const xAxis = d3.axisBottom(this.x).tickSizeOuter(0);

    this.y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d: dataType) => d.y)] as [number, number])
      .nice()
      .range([height - this.margin.bottom, this.margin.top]);

    this.mainSVG
      .select(".axes")
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height - this.margin.bottom})`)
      .call(xAxis);

    this.mainSVG
      .select(".axes")
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${this.margin.left},0)`)
      .call(d3.axisLeft(this.y))
      .call((g: any) => g.select(".domain").remove());
  }

  private renderBar(): void {
    const data = this.defaultData;

    this.mainSVG
      .select(".graph")
      .selectAll("rect")
      .data(data)
      .join(
        (enter: any) =>
          enter
            .append("rect")
            .attr("x", (d: dataType) => this.x(d.x))
            .attr("y", (d: dataType) => this.y(d.y))
            .attr("height", (d: dataType) => this.y(0) - this.y(d.y))
            .attr("width", this.x.bandwidth())
            .attr("fill", "steelblue"),
        (update: any) => {
          update
            .transition()
            .duration(500)
            .attr("x", (d: dataType) => this.x(d.x))
            .attr("y", (d: dataType) => this.y(d.y))
            .attr("height", (d: dataType) => this.y(0) - this.y(d.y))
            .attr("width", this.x.bandwidth());
        },
        (exit: any) => exit.remove()
      );
  }

  printString(str: string) {
    console.log(str);
  }

  update(data: any) {
    console.log("bar chart update", data);
    this.defaultData = data;
    this.renderAxis();
    this.renderBar();
  }
}

export default BarChart;
