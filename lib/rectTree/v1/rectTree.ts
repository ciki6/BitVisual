import * as d3 from "d3";
import _ from "lodash";
import "../../base/d3Extend";
import { ComponentProperty, PropertyDictionaryItem } from "lib/types/compProperty";
import SVGComponentBase from "../../base/svgComponentBase";
import OptionType from "../../base/optionType";

type DataSet = { group: string; name: string; value: number };

type TreeNode = { name: string; value?: number; children?: TreeNode[] };

class RectTree extends SVGComponentBase {
  chartContainer: any;
  realWidth: number;
  realHeight: number;
  constructor(id: string, code: string, container: Element, workMode: number, option: Object, useDefaultOpt: boolean) {
    super(id, code, container, workMode, option, useDefaultOpt);
    this.realWidth = 1920;
    this.realHeight = 1080;
    this.draw();
  }

  protected setupDefaultValues(): void {
    this.defaultData = [
      { group: "Group 1", name: "A", value: 100 },
      { group: "Group 1", name: "B", value: 50 },
      { group: "Group 2", name: "C", value: 75 },
      { group: "Group 2", name: "D", value: 120 },
      { group: "Group 2", name: "E", value: 40 },
    ] as DataSet[];
  }

  protected initProperty(): void {
    super.initProperty();
    const property: ComponentProperty = {
      basic: {
        className: "RectTree",
      },
      global: {
        padding: [10, 10, 10, 10],
        bgImage: "",
        graph: {
          mainBorder: {
            color: "#000",
            width: 1,
          },
          mainColorList: ["red", "blue"],
          childBorder: {
            color: "#000",
            width: 1,
          },
          categoryText: {
            font: {
              family: "思源黑体Normal",
              size: 50,
              color: "#ffffff",
              bolder: false,
              italic: false,
              underline: false,
            },
          },
          dataText: {
            suffix: "",
            suffixFont: {
              family: "思源黑体Normal",
              size: 50,
              color: "#ffffff",
              bolder: false,
              italic: false,
              underline: false,
            },
          },
        },
        legend: {
          show: true,
          style: {
            font: {
              family: "思源黑体Normal",
              size: 50,
              color: "#ffffff",
              bolder: false,
              italic: false,
              underline: false,
            },
            type: "circle",
            size: [10, 10],
            showData: false,
            showPercent: false,
            interval: 10,
            dataFont: {
              family: "思源黑体Normal",
              size: 50,
              color: "#ffffff",
              bolder: false,
              italic: false,
              underline: false,
            },
            suffix: "",
          },
          layout: {
            position: ["r", "t", 0, 0],
            direction: "h",
            margin: 10,
          },
        },
      },
    };

    const propertyDictionary: PropertyDictionaryItem[] = [
      {
        name: "global",
        displayName: "全局",
        children: [
          {
            name: "padding",
            displayName: "内边距",
            type: OptionType.doubleArray,
            placeholder: ["上", "下", "左", "右"],
          },
          {
            name: "bgImage",
            displayName: "背景图片",
            type: OptionType.media,
          },
          {
            name: "graph",
            displayName: "图形",
            children: [
              {
                name: "mainBorder",
                displayName: "主边框",
                children: [
                  {
                    name: "color",
                    displayName: "颜色",
                    type: OptionType.color,
                  },
                  {
                    name: "width",
                    displayName: "宽度",
                    type: OptionType.double,
                  },
                ],
              },
              {
                name: "mainColorList",
                displayName: "主颜色列表",
                type: OptionType.colorList,
              },
              {
                name: "childBorder",
                displayName: "子边框",
                children: [
                  {
                    name: "color",
                    displayName: "颜色",
                    type: OptionType.color,
                  },
                  {
                    name: "width",
                    displayName: "宽度",
                    type: OptionType.double,
                  },
                ],
              },
              {
                name: "categoryText",
                displayName: "类目文本",
                children: [
                  {
                    name: "font",
                    displayName: "文本样式",
                    type: OptionType.font,
                  },
                ],
              },
              {
                name: "dataText",
                displayName: "数据文本",
                children: [
                  {
                    name: "suffix",
                    displayName: "后缀",
                    type: OptionType.string,
                  },
                  {
                    name: "suffixFont",
                    displayName: "后缀样式",
                    type: OptionType.font,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    this.addProperty(property, propertyDictionary);
  }

  protected transformData(data: DataSet[]): TreeNode {
    const groupMap: Record<string, TreeNode> = {};
    data.forEach(({ group, name, value }) => {
      if (!groupMap[group]) {
        groupMap[group] = { name: group, children: [] };
      }
      groupMap[group].children!.push({ name, value });
    });

    return {
      name: "root",
      children: Object.values(groupMap),
    };
  }

  protected draw() {
    super.draw();
    this.render();
  }

  protected render() {
    this.renderContainer();
    this.renderChart(this.transformData(this.defaultData));
  }

  protected renderContainer() {
    const padding = this.property.global.padding;
    this.realWidth = this.property.basic.frame[2] - this.property.global.padding[2] - this.property.global.padding[3];
    this.realHeight = this.property.basic.frame[3] - this.property.global.padding[0] - this.property.global.padding[1];
    this.chartContainer = this.mainSVG.append("g").attr("class", "chart-container").style("transform", `translate(${padding[2]}px,${padding[0]}px)`);
  }

  protected renderChart(data: TreeNode) {
    const root = d3
      .hierarchy<TreeNode>(data)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treemapLayout = d3.treemap<TreeNode>().size([this.realWidth, this.realHeight]).padding(1);

    treemapLayout(root);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const nodes = this.chartContainer
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("transform", (d: any) => `translate(${d.x0},${d.y0})`);

    nodes
      .append("rect")
      .attr("width", (d: any) => d.x1 - d.x0)
      .attr("height", (d: any) => d.y1 - d.y0)
      .attr("fill", (d: any) => color(d.parent!.data.name));

    nodes
      .append("text")
      .attr("x", 4)
      .attr("y", 14)
      .text((d: any) => d.data.name)
      .attr("fill", "white")
      .attr("font-size", 12)
      .style("pointer-events", "none");
  }

  public update() {}
}

export default RectTree;
