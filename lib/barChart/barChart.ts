import * as d3 from "d3";
import _ from "lodash";
import SVGComponentBase from "../base/svgComponentBase";
import { ComponentProperty, PropertyDictionaryItem } from "lib/types/property";
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
  dataSeriesProperty: any;
  dataSeriesPropertyDictionary!: PropertyDictionaryItem[];
  guideLineProperty: any;
  guideLinePropertyDictionary!: PropertyDictionaryItem[];
  chartContainer: any;
  realWidth: number;
  realHeight: number;
  data: any;

  constructor(id: string, code: string, container: Element, workMode: number, option: Object, useDefaultOpt: boolean) {
    super(id, code, container, workMode, option, useDefaultOpt);
    this.margin = {
      top: 20,
      right: 0,
      bottom: 30,
      left: 40,
    };
    this.realWidth = 1920;
    this.realHeight = 1080;
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
    this.initAddedProperty();
    const property: ComponentProperty = {
      basic: {
        className: "BarChart",
      },
      global: {
        padding: [10, 10, 10, 10],
        bgImage: "",
        bar: {
          barNumber: 0,
          carousel: false,
          barStyle: {
            type: "rect",
            barWidthPercent: 20,
            barMarginPercent: 10,
            barBg: "",
          },
        },
        legend: {
          isShow: false,
          style: {
            font: "",
            type: "rect",
            size: [10, 10],
            showValue: false,
            valueMargin: 5,
            valueFont: "",
            valueSuffix: "",
          },
          layout: {
            position: [90, 5],
            direction: "h",
            margin: 5,
          },
        },
      },
      axis: {
        axisX: {
          isShow: true,
          axisLabel: {
            isShow: true,
            font: "",
            showMargin: 0,
            labelWidth: 0,
            labelOverflow: "suspe",
            textRotate: 0,
          },
          axisLine: {
            isShow: true,
            color: "",
            stroke: 5,
          },
          axisTick: {
            isShow: true,
            color: "",
            stroke: 5,
            length: 2,
            rangeType: "auto",
            rangeValue: [1, 1000],
          },
          gridLine: {
            isShow: true,
            style: "dash",
            color: "",
            stroke: 5,
          },
        },
        axisY: {
          isShow: true,
          axisLabel: {
            isShow: true,
            font: "",
            showMargin: 0,
            labelWidth: 0,
            labelOverflow: "suspe",
            textRotate: 0,
          },
          axisLine: {
            isShow: true,
            color: "",
            stroke: 5,
          },
          axisTick: {
            isShow: true,
            color: "",
            stroke: 5,
            length: 2,
            rangeType: "auto",
            rangeValue: [1, 1000],
          },
          gridLine: {
            isShow: true,
            style: "dash",
            color: "",
            stroke: 5,
          },
        },
        axisZ: {
          isShow: false,
          axisLabel: {
            isShow: true,
            font: "",
            showMargin: 0,
            labelWidth: 0,
            labelOverflow: "suspe",
            textRotate: 0,
          },
          axisLine: {
            isShow: true,
            color: "",
            stroke: 5,
          },
          axisTick: {
            isShow: true,
            color: "",
            stroke: 5,
            length: 2,
            rangeType: "auto",
            rangeValue: [1, 1000],
          },
          gridLine: {
            isShow: true,
            style: "dash",
            color: "",
            stroke: 5,
          },
        },
      },
      series: {
        dataSeries: {},
        guideLine: {},
      },
      prompt: {
        isShow: false,
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
                    name: "barWidthPercent",
                    displayName: "柱宽占比",
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
            children: [],
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
            children: [],
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
        color: ["blue"],
        image: "",
        opacity: 1,
      },
      highlight: {
        valueType: "min",
        value: "",
        color: "red",
      },
      dataTip: {
        font: {},
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
        lineType: "assign",
        axis: "y",
        value: "",
        lineStyle: "line",
        color: "red",
        stroke: 5,
      },
      dataTip: {
        font: {},
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
                name: "指定值",
                value: "assign",
              },
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
    debugger;
    let dataSeriesPropertyDictionary = this.getPropertyDictionary("series.dataSeries") ?? ({} as any);
    let lastIndex = 0;
    if (dataSeriesPropertyDictionary.children.length > 0) {
      lastIndex = Math.max(dataSeriesPropertyDictionary.children.map((d: any) => parseInt(d.name.split("_")[1]))) + 1;
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
    this.renderBar();
    this.renderLegend();
  }

  private renderContainer(): void {
    if (this.property.global.bgImage !== "") {
      this.mainSVG.append("image").attr("x", 0).attr("y", 0).attr("width", this.property.frame[2]).attr("height", this.property.frame[3]).attr("xlink:href", this.property.global.bgImage);
    }
    const padding = this.property.global.padding;
    this.chartContainer = this.mainSVG.append("g").attr("class", "barChart-container").style("transform", `translate(${padding[2]}px,${padding[0]}px)`);
    this.chartContainer.append("g").attr("class", "axes");
    this.chartContainer.append("g").attr("class", "graph");
    this.realWidth = this.property.basic.frame[2] - this.property.global.padding[2] - this.property.global.padding[3];
    this.realHeight = this.property.basic.frame[3] - this.property.global.padding[0] - this.property.global.padding[1];
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
    const barWidth = (this.x.bandwidth() * this.property.global.bar.barStyle.barWidthPercent) / 100;
    this.mainSVG
      .select(".graph")
      .selectAll("rect")
      .data(data)
      .join(
        (enter: any) =>
          enter
            .append("rect")
            .attr("x", (d: dataType) => (this.x(d.x) as number) + this.x.bandwidth() / 2 - barWidth / 2)
            .attr("y", (d: dataType) => this.y(d.y))
            .attr("height", (d: dataType) => this.y(0) - this.y(d.y))
            .attr("width", barWidth)
            .attr("fill", "steelblue"),
        (update: any) => {
          update
            .transition()
            .duration(500)
            .attr("x", (d: dataType) => this.x(d.x))
            .attr("y", (d: dataType) => this.y(d.y))
            .attr("height", (d: dataType) => this.y(0) - this.y(d.y))
            .attr("width", barWidth);
        },
        (exit: any) => exit.remove()
      );
  }

  private renderLegend() {
    const p = this.property.global.legend.layout.position;
    const pt = [(this.realWidth * p[0]) / 100, (this.realHeight * p[1]) / 100];
    const legendContainer = this.chartContainer.append("g").attr("class", "legend").style("transform", `translate(${pt[0]}px,${pt[1]}px)`);
  }

  public update(data: any) {
    console.log("bar chart update", data);
    this.defaultData = data;
    this.renderAxis();
    this.renderBar();
  }
}

export default BarChart;
