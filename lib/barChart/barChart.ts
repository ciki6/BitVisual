import * as d3 from "d3";
import _ from "lodash";
import "../base/d3Extend";
import SVGComponentBase from "../base/svgComponentBase";
import { ComponentProperty, PropertyDictionaryItem } from "lib/types/property";
import OptionType from "../base/optionType";
import "./barChart.css";

type DataPoint = {
  name: string;
  x: string;
  y: number;
};

type DataSets = {
  [key: string]: DataPoint[];
};

class BarChart extends SVGComponentBase {
  private x0: d3.ScaleBand<string>;
  private x1: d3.ScaleBand<string>;
  private y: d3.ScaleLinear<number, number>;
  dataSeriesProperty: any;
  dataSeriesPropertyDictionary!: PropertyDictionaryItem[];
  guideLineProperty: any;
  guideLinePropertyDictionary!: PropertyDictionaryItem[];
  chartContainer: any;
  realWidth: number;
  realHeight: number;
  data: any;
  axisX: any;
  axisY: any;
  defs: any;

  constructor(id: string, code: string, container: Element, workMode: number, option: Object, useDefaultOpt: boolean) {
    super(id, code, container, workMode, option, useDefaultOpt);
    this.realWidth = 1920;
    this.realHeight = 1080;
    this.x0 = d3.scaleBand();
    this.x1 = d3.scaleBand();
    this.y = d3.scaleLinear();
    this.draw();
  }

  protected setupDefaultValues(): void {
    super.setupDefaultValues();
    this.defaultData = {
      dataSeries_0: [
        { name: "去年", x: "一二三四五七八九十", y: 0.08167 },
        { name: "去年", x: "B", y: 0.01492 },
        { name: "去年", x: "C", y: 0.02782 },
        { name: "去年", x: "D", y: 0.04253 },
      ],
      dataSeries_1: [
        { name: "今年", x: "一二三四五七八九十", y: 0.12702 },
        { name: "今年", x: "B", y: 0.02288 },
        { name: "今年", x: "G", y: 0.02015 },
        { name: "今年", x: "H", y: 0.06094 },
        { name: "今年", x: "I", y: 0.06966 },
      ],
    } as DataSets;
  }

  protected initProperty(): void {
    super.initProperty();
    this.initAddedProperty();
    const property: ComponentProperty = {
      basic: {
        className: "BarChart",
      },
      global: {
        padding: [80, 30, 50, 10],
        bgImage: "",
        bar: {
          barNumber: 0,
          carousel: false,
          barStyle: {
            type: "rect",
            groupMarginPercent: 20,
            barMarginPercent: 10,
            barBg: "#00000066",
          },
        },
        legend: {
          isShow: false,
          style: {
            font: {
              family: "微软雅黑",
              size: "50px",
              color: "#ffffff",
              bolder: false,
              italic: false,
              underline: false,
            },
            type: "rect",
            size: [10, 10],
            showValue: true,
            valueMargin: 5,
            valueFont: {
              family: "微软雅黑",
              size: "50px",
              color: "#ffffff",
              bolder: false,
              italic: false,
              underline: false,
              lineThrough: false,
            },
            valueSuffix: "",
          },
          layout: {
            position: ["r", "t", 0, 0],
            direction: "h",
            margin: 10,
          },
        },
      },
      axis: {
        axisX: {
          isShow: true,
          axisLabel: {
            isShow: true,
            font: {
              family: "微软雅黑",
              size: "50px",
              color: "#ffffff",
              bolder: false,
              italic: false,
              underline: false,
              lineThrough: false,
            },
            showMargin: 0,
            labelWidth: 0,
            labelOverflow: "suspe",
            textRotate: 0,
          },
          axisLine: {
            isShow: true,
            color: "#fff",
            stroke: 5,
          },
          axisTick: {
            isShow: true,
            color: "#fff",
            stroke: 5,
            length: 2,
            rangeType: "auto",
            rangeValue: [1, 1000],
          },
          gridLine: {
            isShow: true,
            style: "dash",
            color: "#fff",
            stroke: 5,
          },
        },
        axisY: {
          isShow: true,
          axisLabel: {
            isShow: true,
            font: {
              family: "微软雅黑",
              size: "50px",
              color: "#ffffff",
              bolder: false,
              italic: false,
              underline: false,
              lineThrough: false,
            },
            showMargin: 0,
            labelWidth: 0,
            labelOverflow: "suspe",
            textRotate: 0,
          },
          axisLine: {
            isShow: true,
            color: "#fff",
            stroke: 5,
          },
          axisTick: {
            isShow: true,
            color: "#fff",
            stroke: 5,
            length: 2,
            rangeType: "auto",
            rangeValue: [1, 1000],
          },
          gridLine: {
            isShow: true,
            style: "dash",
            color: "#fff",
            stroke: 5,
          },
        },
        axisZ: {
          isShow: false,
          axisLabel: {
            isShow: true,
            font: {
              family: "微软雅黑",
              size: "50px",
              color: "#ffffff",
              bolder: false,
              italic: false,
              underline: false,
              lineThrough: false,
            },
            showMargin: 0,
            labelWidth: 0,
            labelOverflow: "suspe",
            textRotate: 0,
          },
          axisLine: {
            isShow: true,
            color: "#fff",
            stroke: 5,
          },
          axisTick: {
            isShow: true,
            color: "#fff",
            stroke: 5,
            length: 2,
            rangeType: "auto",
            rangeValue: [1, 1000],
          },
          gridLine: {
            isShow: true,
            style: "dash",
            color: "#fff",
            stroke: 5,
          },
        },
      },
      series: {
        dataSeries: {
          dataSeries_0: _.cloneDeep(this.dataSeriesProperty),
          dataSeries_1: _.cloneDeep(this.dataSeriesProperty),
        },
        guideLine: {
          guideLine_0: _.cloneDeep(this.guideLineProperty),
        },
      },
      prompt: {
        isShow: true,
        carousel: {
          isShow: false,
          stopTime: 5,
        },
        suspend: {
          background: {
            image: "",
            opacity: 0.5,
            size: [100, 100],
            offset: [0, 0],
          },
          style: {
            titleFont: "",
            align: "left",
            nameFont: "",
            legendType: "rect",
            legendSize: [10, 10],
            interval: 20,
            dataFont: "",
            dataSuffix: "",
          },
          indicator: {
            widthPercent: 0.5,
            color: "",
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
            name: "bar",
            displayName: "柱体",
            children: [
              {
                name: "barNumber",
                displayName: "柱子数量",
                type: OptionType.int,
              },
              {
                name: "carousel",
                displayName: "启动轮播",
                type: OptionType.boolean,
              },
              {
                name: "barStyle",
                displayName: "柱体样式",
                children: [
                  {
                    name: "type",
                    displayName: "柱体类型",
                    type: OptionType.select,
                    options: [
                      {
                        name: "矩形",
                        value: "rect",
                      },
                      {
                        name: "圆形",
                        value: "circle",
                      },
                      {
                        name: "圆柱",
                        value: "cylinder",
                      },
                      {
                        name: "方柱",
                        value: "cube",
                      },
                      {
                        name: "切片",
                        value: "slice",
                      },
                    ],
                  },
                  {
                    name: "groupMarginPercent",
                    displayName: "组间距占比",
                    type: OptionType.range,
                    unit: "%",
                    options: {
                      min: 1,
                      max: 100,
                    },
                  },
                  {
                    name: "barMarginPercent",
                    displayName: "柱间距占比",
                    type: OptionType.range,
                    unit: "%",
                    options: {
                      min: 1,
                      max: 100,
                    },
                  },
                  {
                    name: "barBg",
                    displayName: "柱背景",
                    type: OptionType.color,
                  },
                ],
              },
            ],
          },
          {
            name: "legend",
            displayName: "图例",
            children: [
              {
                name: "isShow",
                displayName: "是否显示",
                type: OptionType.boolean,
              },
              {
                name: "style",
                displayName: "样式",
                children: [
                  {
                    name: "font",
                    displayName: "文本样式",
                    type: OptionType.font,
                  },
                  {
                    name: "type",
                    displayName: "类型",
                    type: OptionType.radio,
                    options: [
                      {
                        name: "正方形",
                        value: "rect",
                      },
                      {
                        name: "圆点",
                        value: "circle",
                      },
                      {
                        name: "三角形",
                        value: "triangle",
                      },
                    ],
                  },
                  {
                    name: "size",
                    displayName: "大小",
                    type: OptionType.doubleArray,
                    placeholder: ["长", "宽"],
                    unit: "px",
                  },
                  {
                    name: "showValue",
                    displayName: "显示数值",
                    type: OptionType.boolean,
                  },
                  {
                    name: "valueMargin",
                    displayName: "显示间隔",
                    type: OptionType.boolean,
                  },
                  {
                    name: "valueFont",
                    displayName: "数值文本",
                    type: OptionType.font,
                  },
                  {
                    name: "valueSuffix",
                    displayName: "后缀",
                    type: OptionType.string,
                  },
                ],
              },
              {
                name: "layout",
                displayName: "布局",
                children: [
                  {
                    name: "position",
                    displayName: "位置",
                    type: OptionType.position,
                  },
                  {
                    name: "direction",
                    displayName: "排列方式",
                    type: OptionType.radio,
                    options: [
                      {
                        name: "横向",
                        value: "h",
                      },
                      {
                        name: "纵向",
                        value: "v",
                      },
                    ],
                  },
                  {
                    name: "margin",
                    displayName: "间距",
                    type: OptionType.double,
                    unit: "px",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "axis",
        displayName: "坐标轴",
        children: [
          {
            name: "axisX",
            displayName: "X轴",
            children: [
              {
                name: "isShow",
                displayName: "是否显示",
                type: OptionType.boolean,
              },
              {
                name: "axisLabel",
                displayName: "轴标签",
                children: [
                  {
                    name: "isShow",
                    displayName: "是否显示",
                    type: OptionType.boolean,
                  },
                  {
                    name: "font",
                    displayName: "文本样式",
                    type: OptionType.font,
                  },
                  {
                    name: "showMargin",
                    displayName: "显示间隔",
                    type: OptionType.int,
                  },
                  {
                    name: "labelWidth",
                    displayName: "文字长度",
                    type: OptionType.double,
                    unit: "px",
                  },
                  {
                    name: "labelOverflow",
                    displayName: "文字溢出",
                    type: OptionType.select,
                    options: [
                      {
                        name: "省略号",
                        value: "suspe",
                      },
                      {
                        name: "换行",
                        value: "warp",
                      },
                      {
                        name: "滚动",
                        value: "scroll",
                      },
                    ],
                  },
                  {
                    name: "textRotate",
                    displayName: "文字角度",
                    type: OptionType.range,
                    options: {
                      min: -180,
                      max: 180,
                    },
                    unit: "°",
                  },
                ],
              },
              {
                name: "axisLine",
                displayName: "轴线",
                children: [
                  {
                    name: "isShow",
                    displayName: "是否显示",
                    type: OptionType.boolean,
                  },
                  {
                    name: "颜色",
                    displayName: "color",
                    type: OptionType.color,
                  },
                  {
                    name: "粗细",
                    displayName: "stroke",
                    type: OptionType.int,
                  },
                ],
              },
              {
                name: "axisTick",
                displayName: "刻度",
                children: [
                  {
                    name: "isShow",
                    displayName: "是否显示",
                    type: OptionType.boolean,
                  },
                  {
                    name: "颜色",
                    displayName: "color",
                    type: OptionType.color,
                  },
                  {
                    name: "粗细",
                    displayName: "stroke",
                    type: OptionType.int,
                  },
                  {
                    name: "长短",
                    displayName: "length",
                    type: OptionType.int,
                  },
                  {
                    name: "范围类型",
                    displayName: "rangeType",
                    type: OptionType.radio,
                    options: [
                      {
                        name: "自适应",
                        value: "auto",
                      },
                      {
                        name: "指定值",
                        value: "value",
                      },
                    ],
                  },
                  {
                    name: "范围值",
                    displayName: "rangeValue",
                    type: OptionType.doubleArray,
                    placeholder: ["最小值", "最大值"],
                  },
                ],
              },
              {
                name: "gridLine",
                displayName: "网格线",
                children: [
                  {
                    name: "isShow",
                    displayName: "是否显示",
                    type: OptionType.boolean,
                  },
                  {
                    name: "线样式",
                    displayName: "style",
                    type: OptionType.radio,
                    options: [
                      {
                        name: "虚线",
                        value: "dash",
                      },
                      {
                        name: "实线",
                        value: "line",
                      },
                    ],
                  },
                  {
                    name: "颜色",
                    displayName: "color",
                    type: OptionType.color,
                  },
                  {
                    name: "粗细",
                    displayName: "stroke",
                    type: OptionType.int,
                  },
                ],
              },
            ],
          },
          {
            name: "axisY",
            displayName: "Y轴",
            children: [
              {
                name: "isShow",
                displayName: "是否显示",
                type: OptionType.boolean,
              },
              {
                name: "axisLabel",
                displayName: "轴标签",
                children: [
                  {
                    name: "isShow",
                    displayName: "是否显示",
                    type: OptionType.boolean,
                  },
                  {
                    name: "font",
                    displayName: "文本样式",
                    type: OptionType.font,
                  },
                  {
                    name: "showMargin",
                    displayName: "显示间隔",
                    type: OptionType.int,
                  },
                  {
                    name: "labelWidth",
                    displayName: "文字长度",
                    type: OptionType.double,
                    unit: "px",
                  },
                  {
                    name: "labelOverflow",
                    displayName: "文字溢出",
                    type: OptionType.select,
                    options: [
                      {
                        name: "省略号",
                        value: "suspe",
                      },
                      {
                        name: "换行",
                        value: "warp",
                      },
                      {
                        name: "滚动",
                        value: "scroll",
                      },
                    ],
                  },
                  {
                    name: "textRotate",
                    displayName: "文字角度",
                    type: OptionType.range,
                    options: {
                      min: -180,
                      max: 180,
                    },
                    unit: "°",
                  },
                ],
              },
              {
                name: "axisLine",
                displayName: "轴线",
                children: [
                  {
                    name: "isShow",
                    displayName: "是否显示",
                    type: OptionType.boolean,
                  },
                  {
                    name: "颜色",
                    displayName: "color",
                    type: OptionType.color,
                  },
                  {
                    name: "粗细",
                    displayName: "stroke",
                    type: OptionType.int,
                  },
                ],
              },
              {
                name: "axisTick",
                displayName: "刻度",
                children: [
                  {
                    name: "isShow",
                    displayName: "是否显示",
                    type: OptionType.boolean,
                  },
                  {
                    name: "颜色",
                    displayName: "color",
                    type: OptionType.color,
                  },
                  {
                    name: "粗细",
                    displayName: "stroke",
                    type: OptionType.int,
                  },
                  {
                    name: "长短",
                    displayName: "length",
                    type: OptionType.int,
                  },
                  {
                    name: "范围类型",
                    displayName: "rangeType",
                    type: OptionType.radio,
                    options: [
                      {
                        name: "自适应",
                        value: "auto",
                      },
                      {
                        name: "指定值",
                        value: "value",
                      },
                    ],
                  },
                  {
                    name: "范围值",
                    displayName: "rangeValue",
                    type: OptionType.doubleArray,
                    placeholder: ["最小值", "最大值"],
                  },
                ],
              },
              {
                name: "gridLine",
                displayName: "网格线",
                children: [
                  {
                    name: "isShow",
                    displayName: "是否显示",
                    type: OptionType.boolean,
                  },
                  {
                    name: "线样式",
                    displayName: "style",
                    type: OptionType.radio,
                    options: [
                      {
                        name: "虚线",
                        value: "dash",
                      },
                      {
                        name: "实线",
                        value: "line",
                      },
                    ],
                  },
                  {
                    name: "颜色",
                    displayName: "color",
                    type: OptionType.color,
                  },
                  {
                    name: "粗细",
                    displayName: "stroke",
                    type: OptionType.int,
                  },
                ],
              },
            ],
          },
          {
            name: "axisZ",
            displayName: "Z轴",
            children: [
              {
                name: "isShow",
                displayName: "是否显示",
                type: OptionType.boolean,
              },
              {
                name: "axisLabel",
                displayName: "轴标签",
                children: [
                  {
                    name: "isShow",
                    displayName: "是否显示",
                    type: OptionType.boolean,
                  },
                  {
                    name: "font",
                    displayName: "文本样式",
                    type: OptionType.font,
                  },
                  {
                    name: "showMargin",
                    displayName: "显示间隔",
                    type: OptionType.int,
                  },
                  {
                    name: "labelWidth",
                    displayName: "文字长度",
                    type: OptionType.double,
                    unit: "px",
                  },
                  {
                    name: "labelOverflow",
                    displayName: "文字溢出",
                    type: OptionType.select,
                    options: [
                      {
                        name: "省略号",
                        value: "suspe",
                      },
                      {
                        name: "换行",
                        value: "warp",
                      },
                      {
                        name: "滚动",
                        value: "scroll",
                      },
                    ],
                  },
                  {
                    name: "textRotate",
                    displayName: "文字角度",
                    type: OptionType.range,
                    options: {
                      min: -180,
                      max: 180,
                    },
                    unit: "°",
                  },
                ],
              },
              {
                name: "axisLine",
                displayName: "轴线",
                children: [
                  {
                    name: "isShow",
                    displayName: "是否显示",
                    type: OptionType.boolean,
                  },
                  {
                    name: "颜色",
                    displayName: "color",
                    type: OptionType.color,
                  },
                  {
                    name: "粗细",
                    displayName: "stroke",
                    type: OptionType.int,
                  },
                ],
              },
              {
                name: "axisTick",
                displayName: "刻度",
                children: [
                  {
                    name: "isShow",
                    displayName: "是否显示",
                    type: OptionType.boolean,
                  },
                  {
                    name: "颜色",
                    displayName: "color",
                    type: OptionType.color,
                  },
                  {
                    name: "粗细",
                    displayName: "stroke",
                    type: OptionType.int,
                  },
                  {
                    name: "长短",
                    displayName: "length",
                    type: OptionType.int,
                  },
                  {
                    name: "范围类型",
                    displayName: "rangeType",
                    type: OptionType.radio,
                    options: [
                      {
                        name: "自适应",
                        value: "auto",
                      },
                      {
                        name: "指定值",
                        value: "value",
                      },
                    ],
                  },
                  {
                    name: "范围值",
                    displayName: "rangeValue",
                    type: OptionType.doubleArray,
                    placeholder: ["最小值", "最大值"],
                  },
                ],
              },
              {
                name: "gridLine",
                displayName: "网格线",
                children: [
                  {
                    name: "isShow",
                    displayName: "是否显示",
                    type: OptionType.boolean,
                  },
                  {
                    name: "线样式",
                    displayName: "style",
                    type: OptionType.radio,
                    options: [
                      {
                        name: "虚线",
                        value: "dash",
                      },
                      {
                        name: "实线",
                        value: "line",
                      },
                    ],
                  },
                  {
                    name: "颜色",
                    displayName: "color",
                    type: OptionType.color,
                  },
                  {
                    name: "粗细",
                    displayName: "stroke",
                    type: OptionType.int,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "series",
        displayName: "系列",
        children: [
          {
            name: "dataSeries",
            displayName: "数据系列",
            children: [
              {
                name: "dataSeries_0",
                displayName: `数据系列0`,
                action: [
                  {
                    text: "删除组",
                    style: "red",
                    action: "deleteDataSeries",
                    param: ["parentIndex"],
                  },
                ],
                children: _.cloneDeep(this.dataSeriesPropertyDictionary),
              },
              {
                name: "dataSeries_1",
                displayName: `数据系列1`,
                action: [
                  {
                    text: "删除组",
                    style: "red",
                    action: "deleteDataSeries",
                    param: ["parentIndex"],
                  },
                ],
                children: _.cloneDeep(this.dataSeriesPropertyDictionary),
              },
            ],
            action: [
              {
                text: "新增",
                style: "blue",
                action: "addDataSeries",
                param: [],
              },
            ],
          },
          {
            name: "guideLine",
            displayName: "辅助线",
            children: [
              {
                name: "guideLine",
                displayName: `辅助线0`,
                action: [
                  {
                    text: "删除组",
                    style: "red",
                    action: "deleteGuideLine",
                    param: ["parentIndex"],
                  },
                ],
                children: _.cloneDeep(this.guideLinePropertyDictionary),
              },
            ],
            action: [
              {
                text: "新增",
                style: "blue",
                action: "addGuideLine",
                param: [],
              },
            ],
          },
        ],
      },
      {
        name: "prompt",
        displayName: "提示框",
        children: [
          {
            name: "isShow",
            displayName: "是否显示",
            type: OptionType.boolean,
          },
          {
            name: "carousel",
            displayName: "轮播",
            children: [
              {
                name: "isShow",
                displayName: "是否显示",
                type: OptionType.boolean,
              },
              {
                name: "stopTime",
                displayName: "停留时长",
                type: OptionType.int,
                unit: "秒",
              },
            ],
          },
          {
            name: "suspend",
            displayName: "悬浮框",
            children: [
              {
                name: "background",
                displayName: "背景",
                children: [
                  {
                    name: "image",
                    displayName: "背景图",
                    type: OptionType.media,
                  },
                  {
                    name: "opacity",
                    displayName: "透明度",
                    type: OptionType.range,
                    options: {
                      min: 0,
                      max: 1,
                    },
                  },
                  {
                    name: "size",
                    displayName: "大小",
                    type: OptionType.doubleArray,
                    placeholder: ["长", "宽"],
                    unit: "px",
                  },
                  {
                    name: "offset",
                    displayName: "偏移量",
                    type: OptionType.doubleArray,
                    placeholder: ["x", "y"],
                    unit: "px",
                  },
                ],
              },
              {
                name: "style",
                displayName: "样式",
                children: [
                  {
                    name: "titleFont",
                    displayName: "标题样式",
                    type: OptionType.font,
                  },
                  {
                    name: "align",
                    displayName: "对齐方式",
                    type: OptionType.radio,
                    options: [
                      {
                        name: "左",
                        value: "left",
                      },
                      {
                        name: "居中",
                        value: "center",
                      },
                      {
                        name: "右",
                        value: "right",
                      },
                    ],
                  },
                  {
                    name: "nameFont",
                    displayName: "名称样式",
                    type: OptionType.font,
                  },
                  {
                    name: "legendType",
                    displayName: "图例类型",
                    type: OptionType.radio,
                    options: [
                      {
                        name: "正方形",
                        value: "rect",
                      },
                      {
                        name: "圆点",
                        value: "circle",
                      },
                      {
                        name: "三角形",
                        value: "triangle",
                      },
                    ],
                  },
                  {
                    name: "legendSize",
                    displayName: "图例大小",
                    type: OptionType.doubleArray,
                    placeholder: ["长", "宽"],
                    unit: "px",
                  },
                  {
                    name: "interval",
                    displayName: "图例大小",
                    description: "数值与名称之间的间隔",
                    type: OptionType.doubleArray,
                    placeholder: ["长", "宽"],
                    unit: "px",
                  },
                  {
                    name: "dataFont",
                    displayName: "数值样式",
                    type: OptionType.font,
                  },
                  {
                    name: "dataSuffix",
                    displayName: "后缀",
                    type: OptionType.string,
                  },
                ],
              },
              {
                name: "indicator",
                displayName: "指示器",
                children: [
                  {
                    name: "widthPercent",
                    displayName: "宽度占比",
                    type: OptionType.range,
                    options: {
                      min: 1,
                      max: 100,
                    },
                  },
                  {
                    name: "color",
                    displayName: "颜色",
                    type: OptionType.color,
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

  protected initAddedProperty(): void {
    this.dataSeriesProperty = {
      valueAxis: "y",
      style: {
        fillType: "color",
        color: ["blue", "red"],
        image: "",
        opacity: 1,
      },
      highlight: {
        valueType: "min",
        value: "",
        color: "red",
      },
      dataTip: {
        font: {
          family: "微软雅黑",
          size: "50px",
          color: "#ffffff",
          bolder: false,
          italic: false,
          underline: false,
          lineThrough: false,
        },
        image: "",
        offset: [0, 0],
        suffix: "",
      },
    };
    this.dataSeriesPropertyDictionary = [
      {
        name: "valueAxis",
        displayName: "轴选择",
        type: OptionType.radio,
        options: [
          {
            name: "Y轴",
            value: "y",
          },
          {
            name: "Z轴",
            value: "z",
          },
        ],
      },
      {
        name: "style",
        displayName: "样式",
        children: [
          {
            name: "fillType",
            displayName: "填充类型",
            type: OptionType.radio,
            options: [
              {
                name: "颜色",
                value: "color",
              },
              {
                name: "图片",
                value: "image",
              },
            ],
          },
          {
            name: "color",
            displayName: "柱体颜色",
            type: OptionType.colorList,
          },
          {
            name: "image",
            displayName: "柱体图片",
            type: OptionType.media,
          },
          {
            name: "opacity",
            displayName: "柱体图片透明度",
            type: OptionType.range,
            options: {
              min: 0,
              max: 1,
            },
          },
        ],
      },
      {
        name: "highlight",
        displayName: "高亮",
        children: [
          {
            name: "isShow",
            displayName: "是否显示",
            type: OptionType.boolean,
          },
          {
            name: "valueType",
            displayName: "值类型",
            type: OptionType.select,
            options: [
              {
                name: "最大值",
                value: "max",
              },
              {
                name: "最小值",
                value: "min",
              },
              {
                name: "指定值",
                value: "assign",
              },
            ],
          },
          {
            name: "value",
            displayName: "匹配项",
            type: OptionType.string,
          },
          {
            name: "color",
            displayName: "颜色",
            type: OptionType.color,
          },
        ],
      },
      {
        name: "dataTip",
        displayName: "值标签",
        children: [
          {
            name: "isShow",
            displayName: "是否显示",
            type: OptionType.boolean,
          },
          {
            name: "font",
            displayName: "文本样式",
            type: OptionType.font,
          },
          {
            name: "image",
            displayName: "图标",
            type: OptionType.media,
          },
          {
            name: "offset",
            displayName: "位置",
            type: OptionType.position,
          },
          {
            name: "suffix",
            displayName: "后缀",
            type: OptionType.string,
          },
        ],
      },
    ];

    this.guideLineProperty = {
      style: {
        lineType: "max",
        axis: "y",
        value: "",
        lineStyle: "line",
        color: "red",
        stroke: 5,
      },
      dataTip: {
        font: {
          family: "微软雅黑",
          size: "50px",
          color: "#ffffff",
          bolder: false,
          italic: false,
          underline: false,
          lineThrough: false,
        },
        image: "",
        offset: [0, 0],
        suffix: "",
      },
    };

    this.guideLinePropertyDictionary = [
      {
        name: "style",
        displayName: "样式",
        children: [
          {
            name: "lineType",
            displayName: "线类型",
            type: OptionType.select,
            options: [
              {
                name: "最大值",
                value: "max",
              },
              {
                name: "最小值",
                value: "min",
              },
              {
                name: "平均值",
                value: "average",
              },
              {
                name: "指定值",
                value: "assign",
              },
            ],
          },
          {
            name: "valueAxis",
            displayName: "轴选择",
            type: OptionType.radio,
            options: [
              {
                name: "Y轴",
                value: "y",
              },
              {
                name: "X轴",
                value: "x",
              },
              {
                name: "Z轴",
                value: "z",
              },
            ],
          },
          {
            name: "value",
            displayName: "匹配值",
            type: OptionType.string,
          },
          {
            name: "线样式",
            displayName: "lineStyle",
            type: OptionType.radio,
            options: [
              {
                name: "虚线",
                value: "dash",
              },
              {
                name: "实线",
                value: "line",
              },
            ],
          },
          {
            name: "颜色",
            displayName: "color",
            type: OptionType.color,
          },
          {
            name: "粗细",
            displayName: "stroke",
            type: OptionType.int,
          },
        ],
      },
      {
        name: "dataTip",
        displayName: "值标签",
        children: [
          {
            name: "font",
            displayName: "文本样式",
            type: OptionType.font,
          },
          {
            name: "image",
            displayName: "图标",
            type: OptionType.media,
          },
          {
            name: "offset",
            displayName: "位置",
            type: OptionType.position,
          },
          {
            name: "suffix",
            displayName: "后缀",
            type: OptionType.string,
          },
        ],
      },
    ];
  }

  protected handlePropertyChange(): void {
    this.propertyManager.onPropertyChange((path: string, value: any) => {
      switch (path) {
        case "global.padding":
          this.chartContainer.style("transform", `translate(${value[2]}px,${value[0]}px)`);
          break;
      }
    });
  }

  public addDataSeries() {
    let dataSeriesPropertyDictionary = this.getPropertyDictionary("series.dataSeries") ?? ({} as any);
    let lastIndex = 0;
    if (dataSeriesPropertyDictionary.children.length > 0) {
      lastIndex = (d3.max(dataSeriesPropertyDictionary.children.map((d: any) => parseInt(d.name.split("_")[1])) as number[]) as number) + 1;
    }
    let dataSeriesName = `dataSeries_${lastIndex}`;
    this.property.series.dataSeries[dataSeriesName] = _.cloneDeep(this.dataSeriesProperty);
    dataSeriesPropertyDictionary.children.push({
      name: dataSeriesName,
      displayName: `数据系列${lastIndex}`,
      action: [
        {
          text: "删除组",
          style: "red",
          action: "deleteDataSeries",
          param: ["parentIndex"],
        },
      ],
      children: _.cloneDeep(this.dataSeriesPropertyDictionary),
    });
  }

  public deleteDataSeries(index: number) {
    let dataSeriesPropertyDictionary = this.getPropertyDictionary("series.dataSeries");
    let dataSeriesName = dataSeriesPropertyDictionary!.children![index].name;
    dataSeriesPropertyDictionary!.children!.splice(index, 1);
    delete this.property.series.dataSeries[dataSeriesName];
  }

  public addGuideLine() {
    let guideLinePropertyDictionary = this.getPropertyDictionary("series.guideLine") ?? ({} as any);
    let lastIndex = 0;
    if (guideLinePropertyDictionary.children.length > 0) {
      lastIndex = Math.max(guideLinePropertyDictionary.children.map((d: any) => parseInt(d.name.split("_")[1]))) + 1;
    }
    let guideLineName = `guideLine_${lastIndex}`;
    this.property.series.guideLine[guideLineName] = _.cloneDeep(this.guideLineProperty);
    guideLinePropertyDictionary.children.push({
      name: guideLineName,
      displayName: `辅助线${lastIndex}`,
      action: [
        {
          text: "删除组",
          style: "red",
          action: "deleteGuideLine",
          param: ["parentIndex"],
        },
      ],
      children: _.cloneDeep(this.guideLinePropertyDictionary),
    });
  }

  public deleteGuideLine(index: number) {
    let guideLinePropertyDictionary = this.getPropertyDictionary("series.guideLine");
    let guideLineName = guideLinePropertyDictionary!.children![index].name;
    guideLinePropertyDictionary!.children!.splice(index, 1);
    delete this.property.series.guideLine[guideLineName];
  }

  protected draw() {
    super.draw();
    this.render();
  }

  private render(): void {
    this.renderContainer();
    this.renderAxis();
    this.renderBar(this.defaultData);
    this.renderGuideLine(this.defaultData);
    this.renderLegend(this.defaultData);
    this.renderPrompt(this.defaultData);
  }

  private renderContainer(): void {
    if (this.property.global.bgImage !== "") {
      this.mainSVG.append("image").attr("x", 0).attr("y", 0).attr("width", this.property.frame[2]).attr("height", this.property.frame[3]).attr("xlink:href", this.property.global.bgImage);
    }
    if (this.mainSVG.select("defs").empty()) {
      this.defs = this.mainSVG.append("defs");
    } else {
      this.defs = this.mainSVG.select("defs");
    }
    const padding = this.property.global.padding;
    this.chartContainer = this.mainSVG.append("g").attr("class", "barChart-container").style("transform", `translate(${padding[2]}px,${padding[0]}px)`);
    this.chartContainer.append("g").attr("class", "axes");
    this.chartContainer.append("g").attr("class", "graph");
    this.chartContainer.append("g").attr("class", "guideLine");
    d3.select(this.container).append("div").attr("class", "barChart-legend");
    d3.select(this.container).append("div").attr("class", "barChart-prompt").style("transform", `translate(${padding[2]}px,${padding[0]}px)`);
    this.realWidth = this.property.basic.frame[2] - this.property.global.padding[2] - this.property.global.padding[3];
    this.realHeight = this.property.basic.frame[3] - this.property.global.padding[0] - this.property.global.padding[1];
  }

  private renderAxis(): void {
    this.mainSVG.select(".axes").selectAll(".axis").remove();

    this.x0 = d3
      .scaleBand<string>()
      .rangeRound([0, this.realWidth])
      .padding(this.property.global.bar.barStyle.groupMarginPercent / 100);

    this.x1 = d3.scaleBand<string>().padding(this.property.global.bar.barStyle.barMarginPercent / 100);

    this.y = d3.scaleLinear().range([this.realHeight, 0]);

    this.axisX = this.mainSVG.select(".axes").append("g").attr("class", "axisX").attr("transform", `translate(0,${this.realHeight})`);

    this.axisY = this.mainSVG.select(".axes").append("g").attr("class", "axisY");
  }

  private renderBar(data: DataSets): void {
    const allKeys = Array.from(new Set(Object.values(data).flatMap((dataset: any) => dataset.map((d: any) => d.x))));

    const datasets = Object.keys(data);

    const dataSeriesProps = this.property.series.dataSeries;

    let showKeys = allKeys;
    const barNumber = this.property.global.bar.barNumber;

    if (barNumber !== 0) {
      showKeys = allKeys.slice(0, barNumber);
    }

    this.x0.domain(showKeys);
    this.x1.domain(datasets).rangeRound([0, this.x0.bandwidth()]);
    this.y
      .domain([
        0,
        d3.max(
          datasets.flatMap((key) => data[key]),
          (d) => d.y
        ) as number,
      ])
      .nice();

    this.axisX.call(d3.axisBottom(this.x0).tickSize(10));

    this.axisX.selectAll("text").setFontStyle(this.property.axis.axisX.axisLabel.font).style("transform", `rotate(${this.property.axis.axisX.axisLabel.textRotate}deg)`);
    this.axisX.select(".domain").style("stroke-width", this.property.axis.axisX.axisLine.stroke).style("stroke", this.property.axis.axisX.axisLine.color);
    this.axisX.selectAll(".tick").selectAll("line").style("stroke-width", this.property.axis.axisX.axisTick.stroke).style("stroke", this.property.axis.axisX.axisTick.color);

    this.axisY.transition().duration(750).call(d3.axisLeft(this.y).tickSize(10));

    this.axisY.selectAll("text").setFontStyle(this.property.axis.axisY.axisLabel.font);
    this.axisY.select(".domain").style("stroke-width", this.property.axis.axisY.axisLine.stroke).style("stroke", this.property.axis.axisY.axisLine.color);
    this.axisY.selectAll(".tick").selectAll("line").style("stroke-width", this.property.axis.axisY.axisTick.stroke).style("stroke", this.property.axis.axisY.axisTick.color);

    datasets.forEach((d) => {
      this.defs.select(`#barFillImage_${this.id}_${d}`).remove();
      this.defs.append("pattern").attr("id", `barFillImage_${this.id}_${d}`).attr("patternUnits", "objectBoundingBox").attr("width", 1).attr("height", 1).append("image").attr("href", this.property.series.dataSeries[d].style.image).attr("x", 0).attr("y", 0).attr("width", 1).attr("height", 1);
    });

    const bars = this.mainSVG.select(".graph").selectAll("g.layer").data(showKeys);

    const barsEnter = bars
      .enter()
      .append("g")
      .classed("layer", "true")
      .attr("transform", (d: any) => `translate(${this.x0(d)}, 0)`);

    barsEnter
      .merge(bars)
      .transition()
      .duration(750)
      .attr("transform", (d: any) => `translate(${this.x0(d)}, 0)`);

    bars.exit().remove();

    const barBgColor = this.property.global.bar.barStyle.barBg;

    barsEnter.append("rect").attr("class", "background").attr("width", this.x0.bandwidth()).attr("height", this.realHeight).attr("fill", barBgColor);

    const rects = this.mainSVG
      .select(".graph")
      .selectAll("g.layer")
      .selectAll(".bar")
      .data((d: any) =>
        datasets.map((key) => {
          const itemIndex = data[key].findIndex((item) => item.x === d);
          const item = itemIndex !== -1 ? data[key][itemIndex] : { name: "", x: d, y: 0 };
          return { key, value: item.y, name: item.name, props: dataSeriesProps[key], index: itemIndex };
        })
      );

    rects
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("x", (d: any) => this.x1(d.key) as number)
      .attr("width", this.x1.bandwidth())
      .attr("fill", (d: any) => this.barFill(d))
      .attr("y", this.y(0))
      .attr("height", 0)
      .merge(rects)
      .transition()
      .duration(750)
      .attr("x", (d: any) => this.x1(d.key) as number)
      .attr("width", this.x1.bandwidth())
      .attr("y", (d: any) => this.y(d.value))
      .attr("height", (d: any) => this.y(0) - this.y(d.value));

    rects.exit().transition().duration(750).attr("y", this.y(0)).attr("height", 0).remove();
  }

  private barFill(d: any) {
    if (d.props.style.fillType === "color") {
      const colorList = d.props.style.color;
      if (d.index >= colorList.length) {
        return colorList[colorList.length - 1];
      } else {
        return colorList[d.index];
      }
    }
    return `url(#barFillImage_${this.id}_${d.key})`;
  }

  private renderLegend(data: DataSets) {
    const legendProp = this.property.global.legend;
    const fontProp = legendProp.style.font;
    const layout = legendProp.layout.direction;
    const [itemW, itemH] = legendProp.style.size;
    const p = legendProp.layout.position;
    const legend = d3
      .select(this.container)
      .select(".barChart-legend")
      .style("width", this.property.basic.frame[2] + "px")
      .style("height", this.property.basic.frame[3] + "px")
      .style("transform", `translate(${p[2]}px,${p[3]}px)`)
      .style("flex-direction", layout === "h" ? "row" : "column")
      .style("justify-content", p[0] === "l" ? "flex-start" : p[0] === "m" ? "center" : "flex-end");
    const keys = Object.keys(data);
    const legendItems = keys.map((key: any) => ({
      key,
      name: data[key][0].name,
      totalValue: d3.sum(data[key], (d) => d.y),
    }));

    legendItems.forEach((item: any, index: number) => {
      const legendItem = legend
        .append("div")
        .classed("barChart-legnendItem", true)
        .style(layout === "h" ? "margin-left" : "margin-top", index === 0 ? "0" : legendProp.layout.margin + "px")
        .style("align-self", p[1] === "t" ? "flex-start" : p[1] === "m" ? "center" : "flex-end");
      legendItem
        .append("div")
        .style("width", itemW + "px")
        .style("height", itemH + "px")
        .style("background-color", "steelblue");

      legendItem.append("span").setFontStyle(fontProp).text(item.name);
    });
  }

  private renderGuideLine(data: DataSets) {
    this.mainSVG.select(".guideLine").selectAll(".guide").remove();
    for (const key in this.property.series.guideLine) {
      const guideLineProp = this.property.series.guideLine[key];
      let x1: number = 0,
        y1: number = 0,
        x2: number = 0,
        y2: number = 0,
        showValue: number = 0;
      switch (guideLineProp.style.lineType) {
        case "max":
          showValue = Math.max(...Object.values(data).flatMap((series: any) => series.map((item: any) => item.y)));
          x1 = 0;
          x2 = this.realWidth;
          y1 = this.y(showValue);
          y2 = this.y(showValue);
          break;
        case "min":
          showValue = Math.min(...Object.values(data).flatMap((series: any) => series.map((item: any) => item.y)));
          x1 = 0;
          x2 = this.realWidth;
          y1 = this.y(showValue);
          y2 = this.y(showValue);
          break;
        case "average":
          const allYValues = Object.values(data).flatMap((series: any) => series.map((item: any) => item.y));
          showValue = allYValues.reduce((sum, y) => sum + y, 0) / allYValues.length;
          x1 = 0;
          x2 = this.realWidth;
          y1 = this.y(showValue);
          y2 = this.y(showValue);
          break;
        case "assign":
          showValue = guideLineProp.style.value;
          x1 = 0;
          x2 = this.realWidth;
          y1 = this.y(showValue);
          y2 = this.y(showValue);
          break;
      }
      this.mainSVG.select(".guideLine").append("line").classed("guide", true).attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2).style("stroke-width", guideLineProp.style.stroke).style("stroke", guideLineProp.style.color);
      this.mainSVG
        .select(".guideLine")
        .append("text")
        .classed("guide", true)
        .style("transform", `translate(${guideLineProp.dataTip.offset.join(",")})`)
        .setFontStyle(guideLineProp.dataTip.font)
        .text(showValue + guideLineProp.dataTip.suffix);
      if (guideLineProp.dataTip.image !== "") {
        this.mainSVG.select(".guideLine").append("image").classed("guide", true).attr("href", guideLineProp.dataTip.image).attr("x", guideLineProp.dataTip.offset[0]).attr("y", guideLineProp.dataTip.offset[1]);
      }
    }
  }

  private renderPrompt(data: DataSets) {
    console.log(data);
    const promptProp = this.property.prompt;
    const promptContainer = d3.select(this.container).select(".barChart-prompt");
    if (!promptProp.isShow) return;
    if (promptProp.carousel.isShow) {
      promptContainer
        .append("div")
        .style("width", this.x0.bandwidth() + "px")
        .style("height", this.realHeight + "px")
        .style("background-color", "#ffffff50");
    } else {
      promptContainer
        .append("div")
        .classed("indicator", true)
        .style("transform", `translateX(${this.x0(this.x0.domain()[0])}px)`)
        .style("width", this.x0.bandwidth() + "px")
        .style("height", this.realHeight + "px")
        .style("background-color", "#ffffff50");
      const suspendContainer = promptContainer
        .append("div")
        .classed("suspend", true)
        .style("top", this.realHeight / 2 + "px")
        .style("left", this.x0(this.x0.domain()[0]) + "px")
        .style("width", promptProp.suspend.background.size[0] + "px")
        .style("height", promptProp.suspend.background.size[1] + "px")
        .style("transform", `translate(${promptProp.suspend.background.offset[0]}px,${promptProp.suspend.background.offset[1]}px)`)
        .style("background-color", "red");
      suspendContainer.append("div").classed("suspend-title", true).text("AAA");
    }
  }

  public update(data: any) {
    console.log("bar chart update", data);
    this.renderAxis();
    this.renderBar(data);
  }
}

export default BarChart;
