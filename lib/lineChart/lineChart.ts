import * as d3 from "d3";
import _, { pad } from "lodash";
import $ from "jquery";
import "../base/d3Extend";
import SVGComponentBase from "../base/svgComponentBase";
import { ComponentProperty, PropertyDictionaryItem } from "lib/types/property";
import OptionType from "../base/optionType";
import { getSymbol } from "../base/compUtil";

interface dataType {
  x: string;
  y: number;
}

class LineChart extends SVGComponentBase {
  private margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  private xA: d3.ScaleBand<string>;
  private yA: d3.ScaleLinear<number, number>;
  private zA: d3.ScaleLinear<number, number>;
  _id: any;
  dataSeriesProperty: any;
  dataSeriesPropertyDictionary!: PropertyDictionaryItem[];
  guideLineProperty: any;
  guideLinePropertyDictionary!: PropertyDictionaryItem[];
  chartContainer: any;
  realWidth: number;
  realHeight: number;
  animeRect: any;
  promptcontentbg: any;
  aniTimer: any;
  //提示框动画事件
  showPromptIndex: ((self: any, aniIndex: number) => void) | undefined;

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
    this.xA = d3.scaleBand();
    this.yA = d3.scaleLinear();
    this.zA = d3.scaleLinear();
    this._id = 'wiscom_' + this.id;

    // this.dataSeriesProperty = {} as any;
    // this.dataSeriesPropertyDictionary = [] as PropertyDictionaryItem[]
    // this.guideLineProperty = {} as any;
    // this.guideLinePropertyDictionary = [] as PropertyDictionaryItem[]
    this.initAddedProperty();

    this.draw();
  }

  protected setupDefaultValues(): void {
    super.setupDefaultValues();
    this.defaultData = {
      'dataSeries_0': [
        { x: "B", y: 14.5 },
        { x: "A", y: 8.2 },
        { x: "C", y: 2.7 },
        { x: "D", y: 4.3 },
        { x: "E", y: 130 },
        { x: "F", y: 2.3 },
        { x: "G", y: 2 },
        { x: "H", y: 6 },
        { x: "I", y: 7 },
        { x: "J", y: 1 },
        { x: "K", y: 0.8 },
        { x: "L", y: 4 },
        { x: "M", y: 2.4 },
        { x: "N", y: 6.8 },
        { x: "O", y: 7.5 },
        { x: "P", y: 2 },
        { x: "Q", y: 0.1 },
        { x: "R", y: 5.9 },
        { x: "S", y: 6.3 },
        { x: "T", y: 9 },
        { x: "U", y: 2.8 },
        { x: "V", y: 0.1 },
        { x: "W", y: 2.4 },
        { x: "X", y: 1.5 },
        { x: "Y", y: 1.9 },
        { x: "Z", y: 10.0 },
      ],
      'dataSeries_1': [
        { x: "B", y: 56 },
        { x: "A", y: 820 },
        { x: "C", y: 27 },
        { x: "D", y: 43 },
        { x: "E", y: 10 },
        { x: "F", y: 23 },
        { x: "G", y: 20 },
        { x: "H", y: 60 },
        { x: "I", y: 70 },
        { x: "J", y: 10 },
        { x: "K", y: 8 },
        { x: "L", y: 40 },
        { x: "M", y: 24 },
        { x: "N", y: 68 },
        { x: "O", y: 75 },
        { x: "P", y: 20 },
        { x: "Q", y: 1 },
        { x: "R", y: 59 },
        { x: "S", y: 63 },
        { x: "T", y: 90 },
        { x: "U", y: 28 },
        { x: "V", y: 1 },
        { x: "W", y: 24 },
        { x: "X", y: 15 },
        { x: "Y", y: 19 },
        { x: "Z", y: 10 },
      ]
    } as any;
  }

  protected initProperty(): void {
    super.initProperty();
    this.initAddedProperty();
    const property: ComponentProperty = {
      basic: {
        className: "LineChart",
      },
      global: {
        padding: [40, 60, 50, 40],
        bgImage: "",
        line: {
          carousel: false,
        },
        legend: {
          isShow: true,
          style: {
            font: {
              family: "微软雅黑",
              size: "16px",
              color: "#000000",
              bolder: false,
              italic: false,
              underline: false,
            },
            size: [16, 5],
            valueMargin: 5,
          },
          layout: {
            position: [50, 0],
            direction: "h",
            margin: 20,
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
              size: "16px",
              color: "#000000",
              bolder: false,
              italic: false,
              underline: false,
              lineThrough: false,
            },
            showMargin: 10,
            textRotate: 0,
            textOffset: [0, 0],
          },
          axisLine: {
            isShow: true,
            color: "gray",
            stroke: 5,
          },
          axisTick: {
            isShow: true,
            color: "gray",
            stroke: 5,
            length: 2,
            rangeType: "auto",
            rangeValue: [1, 1000],
          },
          gridLine: {
            isShow: true,
            style: "dash",
            color: "#c5bcbc",
            stroke: 5,
          },
        },
        axisY: {
          isShow: true,
          axisLabel: {
            isShow: true,
            font: {
              family: "微软雅黑",
              size: "16px",
              color: "#000000",
              bolder: false,
              italic: false,
              underline: false,
              lineThrough: false,
            },
            showMargin: 1,
          },
          axisLine: {
            isShow: true,
            color: "gray",
            stroke: 5,
          },
          axisTick: {
            isShow: true,
            color: "gray",
            stroke: 5,
            length: 6,
            rangeType: "auto",//value auto
            rangeValue: [0, 1000],
          },
          gridLine: {
            isShow: true,
            style: "dash",
            color: "#c5bcbc",
            stroke: 5,
          },
        },
        axisZ: {
          isShow: false,
          axisLabel: {
            isShow: true,
            font: {
              family: "微软雅黑",
              size: "16px",
              color: "#000000",
              bolder: false,
              italic: false,
              underline: false,
              lineThrough: false,
            },
            showMargin: 0,
          },
          axisLine: {
            isShow: true,
            color: "gray",
            stroke: 5,
          },
          axisTick: {
            isShow: true,
            color: "gray",
            stroke: 5,
            length: 2,
            rangeType: "auto",
            rangeValue: [1, 1000],
          },
          gridLine: {
            isShow: false,
            style: "dash",
            color: "#c5bcbc",
            stroke: 5,
          },
        },
      },
      series: {
        dataSeries: {
          'dataSeries_0': {
            name: '折线1',
            valueAxis: "y",
            style: {
              type: "solid",//solid ：实线 dashed ：虚线
              color: 'red',
              smooth: true,
              symbolType: 'circle',//triangle circle hollowcircle rect hollowrect pin hollowpin
              symbolSize: 8,
              lineWidth: 5,
            },
            highlight: {
              isShow: false,
              valueType: "max",//max min assign
              value: "",
              color: "yellow",
            },
            dataTip: {
              isShow: true,
              font: {
                family: "微软雅黑",
                size: "16px",
                color: "#000000",
                bolder: false,
                italic: false,
                underline: false,
                lineThrough: false,
              },
              image: "",
              offset: [0, 0],
              suffix: "",
            },
          }
        },
        guideLine: {
          // 'guidLine_0': {
          //   style: {
          //     lineType: "max",
          //     axis: "y",
          //     value: "",
          //     lineStyle: "line",//dash line
          //     color: "green",
          //     stroke: 5,
          //   },
          //   dataTip: {
          //     font: {
          //       family: "微软雅黑",
          //       size: "16px",
          //       color: "#000000",
          //       bolder: false,
          //       italic: false,
          //       underline: false,
          //       lineThrough: false,
          //     },
          //     image: "",
          //     offset: [0, 0],
          //     suffix: "",
          //   },
          // }
        },
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
            size: [160, 100],
            offset: [0, 0],
          },
          style: {
            titleFont: {
              family: "微软雅黑",
              size: "16px",
              color: "#000000",
              bolder: false,
              italic: false,
              underline: false,
            },
            align: "left",
            nameFont: {
              family: "微软雅黑",
              size: "16px",
              color: "#000000",
              bolder: false,
              italic: false,
              underline: false,
            },
            legendSize: [16, 5],
            interval: 20,
            dataFont: {
              family: "微软雅黑",
              size: "16px",
              color: "#000000",
              bolder: false,
              italic: false,
              underline: false,
            },
            dataSuffix: "",
          },
          indicator: {
            widthPercent: 0.5,
            color: "rgba(0,0,0,0.2)",
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
            name: "line",
            displayName: "折线",
            children: [
              {
                name: "carousel",
                displayName: "启动轮播",
                type: OptionType.boolean,
              }
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
                    name: "size",
                    displayName: "大小",
                    type: OptionType.doubleArray,
                    placeholder: ["长", "宽"],
                    unit: "px",
                  },
                  {
                    name: "valueMargin",
                    displayName: "显示间隔",
                    type: OptionType.boolean,
                  }
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
                    name: "textRotate",
                    displayName: "文字角度",
                    type: OptionType.range,
                    options: {
                      min: -180,
                      max: 180,
                    },
                    unit: "°",
                  },
                  {
                    name: "textOffset",
                    displayName: "文本偏移",
                    type: OptionType.doubleArray,
                    description: '当文字角度不为0时生效',
                    placeholder: ["横向", "纵向"],
                    unit: "em",
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
                    param: [0],
                  },
                ],
                children: _.cloneDeep(this.dataSeriesPropertyDictionary),
              }
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
                name: "guideLine_0",
                displayName: `辅助线0`,
                action: [
                  {
                    text: "删除组",
                    style: "red",
                    action: "deleteGuideLine",
                    param: [0],
                  },
                ],
                children: _.cloneDeep(this.guideLinePropertyDictionary),
              }
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
    if (!this.dataSeriesProperty) {
      this.dataSeriesProperty = {
        name: '',
        valueAxis: "y",
        style: {
          type: "solid",//solid ：实线 dashed ：虚线
          color: 'green',
          smooth: true,
          symbolType: 'circle',//triangle circle hollowcircle rect hollowrect pin hollowpin
          symbolSize: 8,
          lineWidth: 5,
        },
        highlight: {
          isShow: false,
          valueType: "min",
          value: "",
          color: "red",
        },
        dataTip: {
          isShow: true,
          font: {},
          image: "",
          offset: [0, 0],
          suffix: "",
        },
      };
    }
    if (!this.dataSeriesPropertyDictionary) {
      this.dataSeriesPropertyDictionary = [
        {
          name: "name",
          displayName: "折线名称",
          type: OptionType.string,
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
              name: "type",
              displayName: "折线类型",
              type: OptionType.radio,
              options: [
                {
                  name: "实线",
                  value: "solid",
                },
                {
                  name: "虚线",
                  value: "dashed",
                },
              ],
            },
            {
              name: "color",
              displayName: "折线颜色",
              type: OptionType.color,
            },
            {
              name: "smooth",
              displayName: "是否平滑",
              type: OptionType.boolean,
            },
            {
              name: "symbolType",
              displayName: "折点类型",
              type: OptionType.radio,
              options: [
                {
                  name: "无",
                  value: "none",
                },
                {
                  name: "实心方块",
                  value: "rect",
                },
                {
                  name: '空心方块',
                  value: 'hollowrect'
                },
                {
                  name: "实心圆",
                  value: "circle",
                },
                {
                  name: "空心圆",
                  value: "hollowcircle",
                },
                {
                  name: "三角形",
                  value: "triangle",
                },
                {
                  name: "大头针",
                  value: "pin",
                },
                {
                  name: "空心大头针",
                  value: "hollowpin",
                },
              ],
            },
            {
              name: "symbolSize",
              displayName: "点大小",
              type: OptionType.double,
            },
            {
              name: "lineWidth",
              displayName: "折线粗细",
              type: OptionType.double,
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
    }

    if (!this.guideLineProperty) {
      this.guideLineProperty = {
        style: {
          lineType: "min",
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
    }
    if (!this.guideLinePropertyDictionary) {
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
                  name: "指定值",
                  value: "assign",
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
      lastIndex = d3.max(dataSeriesPropertyDictionary.children.map((d: any) => parseInt(d.name.split("_")[1])) as number[]) as number + 1;
    }
    let dataSeriesName = `dataSeries_${lastIndex}`;
    this.property.series.dataSeries[dataSeriesName] = _.cloneDeep(this.dataSeriesProperty);
    this.property.series.dataSeries[dataSeriesName].name = dataSeriesName;
    dataSeriesPropertyDictionary.children.push({
      name: dataSeriesName,
      displayName: `数据系列${lastIndex}`,
      action: [
        {
          text: "删除组",
          style: "red",
          action: "deleteDataSeries",
          param: [lastIndex],
        },
      ],
      children: _.cloneDeep(this.dataSeriesPropertyDictionary),
    });
    this.renderAxis();
    this._getLine();
    this.renderLine();
    this.renderLegend();
    this._renderGuidLine();
    this._renderPromptList();
    this.promptAnime('');
  }

  public deleteDataSeries(index: any) {
    let dataSeriesPropertyDictionary = this.getPropertyDictionary("series.dataSeries") as any;
    for (let j = 0; j < dataSeriesPropertyDictionary!.children.length; j++) {
      let d = dataSeriesPropertyDictionary!.children[j];
      if (d.name == `dataSeries_${index}`) {
        index = j;
        break;
      }
    }
    let dataSeriesName = dataSeriesPropertyDictionary!.children![index].name;
    dataSeriesPropertyDictionary!.children!.splice(index, 1);
    delete this.property.series.dataSeries[dataSeriesName];

    this.renderAxis();
    this._getLine();
    this.renderLine();
    this.renderLegend();
    this._renderGuidLine();
    this._renderPromptList();
    this.promptAnime();
  }

  public addGuideLine() {
    let guideLinePropertyDictionary = this.getPropertyDictionary("series.guideLine") ?? ({} as any);
    let lastIndex = 0;
    if (guideLinePropertyDictionary.children.length > 0) {
      lastIndex = d3.max(guideLinePropertyDictionary.children.map((d: any) => parseInt(d.name.split("_")[1])) as number[]) as number + 1;
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
          param: [lastIndex],
        },
      ],
      children: _.cloneDeep(this.guideLinePropertyDictionary),
    });
    this._renderGuidLine();
  }

  public deleteGuideLine(index: any) {
    let guideLinePropertyDictionary = this.getPropertyDictionary("series.guideLine") ?? ({} as any);
    for (let j = 0; j < guideLinePropertyDictionary!.children.length; j++) {
      let d = guideLinePropertyDictionary!.children[j];
      if (d.name == `dataSeries_${index}`) {
        index = j;
        break;
      }
    }
    let guideLineName = guideLinePropertyDictionary!.children![index].name;
    guideLinePropertyDictionary!.children!.splice(index, 1);
    delete this.property.series.guideLine[guideLineName];
    this._renderGuidLine();
  }

  protected draw() {
    super.draw();
    this.render();
  }

  private render(): void {
    this.renderDefs();
    this.renderContainer();
    this.renderAxis();
    this._getLine();
    this.renderLine();
    this.renderLegend();
    this._renderGuidLine();
    this.promptAnime();
  }

  private renderContainer(): void {
    if (this.property.global.bgImage !== "") {
      this.mainSVG.append("image").attr("x", 0).attr("y", 0).attr("width", this.property.frame[2]).attr("height", this.property.frame[3]).attr("xlink:href", this.property.global.bgImage);
    }
    const padding = this.property.global.padding;
    let prompt = this.property.prompt;

    this.realWidth = this.property.svgBasic.viewBox[2];
    this.realHeight = this.property.svgBasic.viewBox[3];

    this.chartContainer = this.mainSVG.append("g").attr("class", "lineChart-container").style("transform", `translate(${padding[2]}px,${padding[0]}px)`);
    this.chartContainer.append("g").attr("class", "axis-bg");
    this.chartContainer.append("g").attr("class", "graph").attr('clip-path', `url(#$${this._id}_clippath)`);
    this.chartContainer.append("g").attr("class", "guide-line");
    if (prompt.isShow) {
      this.chartContainer.append('rect')
        .attr('class', `prompt-indicator`)
        .attr('fill', prompt.suspend.indicator.color)
        .attr('width', 0)
        .attr('height', this.realHeight - 2 * padding[0] - padding[1])
        .attr('x', padding[2])
        .attr('y', padding[0])
    }

    // if (this.property.global.legend.isShow) {
    //[0,0](左上角) [50,0](上中间) [100,0](右上角) .style("justify-content", `center`)
    //[0,50](左中间) [100,50](右中间)
    //[0,100](左下角) [50,100](下中间) [100,100](右下角) .style("justify-content", `center`)
    let style = '';
    // if (this.property.global.legend.layout.position[0] == 0 && this.property.global.legend.layout.position[1] == 0) {
    //   style = `position: absolute; height: auto; display: flex; transform: translate3d(0px, 10px, 0px); top: 5px; right: 0px; left: 0px; justify-content: flex-start;`;
    // } else if (this.property.global.legend.layout.position[0] == 50 && this.property.global.legend.layout.position[1] == 0) {
    //   style = `position: absolute; height: auto; display: flex; transform: translate3d(0px, 10px, 0px); top: 5px; right: 0px; left: 0px; justify-content: center;`;
    // } else if (this.property.global.legend.layout.position[0] == 100 && this.property.global.legend.layout.position[1] == 0) {
    //   style = `position: absolute; height: auto; display: flex; transform: translate3d(0px, 10px, 0px); top: 5px; right: 0px; left: 0px; justify-content: flex-end;`;
    // } else if (this.property.global.legend.layout.position[0] == 0 && this.property.global.legend.layout.position[1] == 50) {
    //   style = `position: absolute; height: auto; display: flex; transform: translate3d(0px, 10px, 0px); top: 0px; left: 10px; bottom: 0px; align-items: center;`;
    // } else if (this.property.global.legend.layout.position[0] == 100 && this.property.global.legend.layout.position[1] == 50) {
    //   style = `position: absolute; height: auto; display: flex; transform: translate3d(0px, 10px, 0px); top: 0px; bottom: 0px; align-items: center; right: 10px;`;
    // } else if (this.property.global.legend.layout.position[0] == 0 && this.property.global.legend.layout.position[1] == 100) {
    //   style = `position: absolute; height: auto; display: flex; transform: translate3d(0px, 10px, 0px); bottom: 5px; right: 0px; left: 0px; justify-content: flex-start;`;
    // } else if (this.property.global.legend.layout.position[0] == 50 && this.property.global.legend.layout.position[1] == 100) {
    //   style = `position: absolute; height: auto; display: flex; transform: translate3d(0px, 10px, 0px); bottom: 5px; right: 0px; left: 0px; justify-content: center;`;
    // } else if (this.property.global.legend.layout.position[0] == 100 && this.property.global.legend.layout.position[1] == 100) {
    //   style = `position: absolute; height: auto; display: flex; transform: translate3d(0px, 10px, 0px); bottom: 5px; right: 0px; left: 0px; justify-content: flex-end;`;
    // }
    style = `position: absolute; height: auto; display: flex; transform: translate3d(${this.property.global.legend.layout.position[0] / 100 * this.realWidth}px, ${this.property.global.legend.layout.position[1] / 100 * this.realHeight}px, 0px);justify-content: center;`;

    this.mainSVG.append("g")
      .attr("class", "line-legend")
      .append("foreignObject")
      .attr("x", `0`)
      .attr("y", `0`)
      .attr("width", '100%')
      .attr("height", '100%')
      .style('pointer-events', 'none')
      .append("xhtml:div")
      .attr('style', style)
      .append("ul")
      .attr('class', 'legend')
      .style("display", this.property.global.legend.layout.direction == 'h' ? 'flex' : 'grid')
      .style("gap", this.property.global.legend.layout.direction == 'h' ? `0px ${this.property.global.legend.layout.margin}px` : `${this.property.global.legend.layout.margin}px 0px`)
      .style('padding', 0);
    // }

    if (prompt.isShow) {
      let prompttitle = `font-family:${prompt.suspend.style.titleFont.family};font-size:${prompt.suspend.style.titleFont.size};color:${prompt.suspend.style.titleFont.color};font-weight:${prompt.suspend.style.titleFont.bolder ? 'bolder' : 'normal'};font-style:${prompt.suspend.style.titleFont.italic ? 'italic' : 'normal'};text-decoration:${prompt.suspend.style.titleFont.underline ? 'underline' : 'none'};text-align:${prompt.suspend.style.align}`;
      this.promptcontentbg = this.mainSVG.append("g")
        .style('transform', `translate(${padding[2]}px,${padding[0]}px)`)
        .append("foreignObject")
        .attr("class", "line-prompt")
        .style('pointer-events', 'none')
        .style('transform', `translate(${padding[2] + prompt.suspend.background.offset[0]}px,${padding[0] + prompt.suspend.background.offset[1]}px)`)
        .attr("width", prompt.suspend.background.size[0])
        .attr("height", prompt.suspend.background.size[1])
        .append("xhtml:div")
        .attr('style', `pointer-events: none; width: ${prompt.suspend.background.size[0]}px; min-height: ${prompt.suspend.background.size[1]}px;background-color: ${'rgba(1, 81, 200, 0.85)'};letter-spacing: 0px;background-image:url(${prompt.suspend.background.image})`)
        .append("div")
        .attr('style', `display: flex;flex-direction: column;justify-content: space-between;gap: 5px;height: 100%;padding:10px`)
      this.promptcontentbg.append('div')
        .attr("class", 'prompt-content-title')
        .attr('style', prompttitle)
        .text('标题');
      this._renderPromptList();
    }
  }

  private _renderPromptList() {
    let prompt = this.property.prompt;
    const dataSeries = this.property.series.dataSeries;
    const linekeys = this.property.prompt.isShow ? Object.keys(this.property.series.dataSeries) : [];
    let nameFont = `font-family:${prompt.suspend.style.nameFont.family};font-size:${prompt.suspend.style.nameFont.size};color:${prompt.suspend.style.nameFont.color};font-weight:${prompt.suspend.style.nameFont.bolder ? 'bolder' : 'normal'};font-style:${prompt.suspend.style.nameFont.italic ? 'italic' : 'normal'};text-decoration:${prompt.suspend.style.nameFont.underline ? 'underline' : 'none'};`;

    let dataFont = `font-family:${prompt.suspend.style.dataFont.family};font-size:${prompt.suspend.style.dataFont.size};color:${prompt.suspend.style.dataFont.color};font-weight:${prompt.suspend.style.dataFont.bolder ? 'bolder' : 'normal'};font-style:${prompt.suspend.style.dataFont.italic ? 'italic' : 'normal'};text-decoration:${prompt.suspend.style.dataFont.underline ? 'underline' : 'none'};`;
    this.promptcontentbg.selectAll(`.prompt-li`)
      .data(linekeys)
      .join((enter: any) => {
        let divDom = enter.append('div')
          .attr('class', `prompt-li`)
          .attr('id', (d: any) => `${this._id}_${d}`)
          .attr('style', `display: flex; justify-content: space-between; line-height: 24px;`);
        let legendDom = divDom.append('span')
          .attr('style', `display: flex; align-items: center; gap: 5px;`);
        legendDom.append('span')
          .attr('class', 'pro-legend-sign')
          .attr('style', (d: any) => `height: ${prompt.suspend.style.legendSize[1]}px; background: ${dataSeries[d].style.color}; width: ${prompt.suspend.style.legendSize[0]}px; gap: 5px; min-width: 15px;`);
        legendDom.append('span')
          .attr('class', 'pro-legend-name')
          .attr('style', nameFont)
          .text((d: any) => dataSeries[d].name);
        divDom.append('span')
          .attr('class', 'pro-legend-value')
          .attr('style', dataFont);
      }, (update: any) => {
        update.attr('class', `prompt-li`).attr('id', (d: any) => `${this._id}_${d}`)
        update.select(`.pro-legend-sign`).attr('style', (d: any) => `height: ${prompt.suspend.style.legendSize[1]}px; background: ${dataSeries[d].style.color}; width: ${prompt.suspend.style.legendSize[0]}px; gap: 5px; min-width: 15px;`);
        update.select('.pro-legend-name')
          .attr('style', nameFont)
          .text((d: any) => dataSeries[d].name);
        update.select('.pro-legend-value').attr('style', dataFont);
      }, (exit: any) => exit.remove());
  }

  private promptAnime(xValue: any): void {

    this.clearTimer();

    let prompt = this.property.prompt;
    if (!prompt.isShow) return;
    const padding = this.property.global.padding;
    const linekeys = Object.keys(this.property.series.dataSeries);
    let tempData = {} as any, values = [] as number[];
    linekeys.forEach(element => {
      tempData[element] = this.defaultData[element] || [];
      tempData[element].map(d => d.name = element);
      values = values.concat(tempData[element]);
    });
    const xAxisValues = [...new Set(Object.values(tempData).flatMap((value: any) => value.map((d: any) => d.x)))];//解构赋值

    let promptData = xAxisValues.map((xkey: any) => {
      let dic = { xkey };
      for (let index = 0; index < values.length; index++) {
        //@ts-ignore
        if (values[index].x == xkey) {
          //@ts-ignore
          dic[values[index].name] = values[index].y
        }
      }
      return dic;
    })
    let indicatorWidth = prompt.suspend.indicator.widthPercent * this.xA.bandwidth();
    this.chartContainer.select('.prompt-indicator').attr('width', indicatorWidth);
    //提示框当前位置的下标
    let prompAniIndex = xAxisValues.indexOf(xValue) < 0 ? 0 : xAxisValues.indexOf(xValue);

    //提示框位置更新
    this.showPromptIndex = function (that, aniIndex: number) {
      for (let index = 0; index < linekeys.length; index++) {
        //@ts-ignore
        that.promptcontentbg.select(`#${that._id}_${linekeys[index]}`).select('.pro-legend-value').text(promptData[aniIndex][linekeys[index]]);
      }

      that.promptcontentbg.select('.prompt-content-title').text(promptData[aniIndex]['xkey']);
      let translateX = (that.xA(promptData[aniIndex]['xkey']) as number) + that.xA.bandwidth() / 2 + prompt.suspend.background.offset[0];
      let translateY = padding[0] + prompt.suspend.background.offset[1];
      if (translateX + prompt.suspend.background.size[0] > that.realWidth - padding[2]) {
        translateX = (that.xA(promptData[aniIndex]['xkey']) as number) + that.xA.bandwidth() / 2 - prompt.suspend.background.size[0] - prompt.suspend.background.offset[0];
      }
      that.mainSVG.select('.line-prompt').style('transform', `translate3d(${translateX}px,${translateY}px,0px)`);
      that.chartContainer.select('.prompt-indicator').attr('x', (that.xA(promptData[aniIndex]['xkey']) as number) + that.xA.bandwidth() / 2 - indicatorWidth / 2);
    }
    this.showPromptIndex(this, prompAniIndex)
    if (prompt.carousel.isShow) {
      this.aniTimer = setInterval(() => {
        prompAniIndex++;
        if (prompAniIndex >= promptData.length) {
          prompAniIndex = 0;
        }
        //@ts-ignore
        this.showPromptIndex(this, prompAniIndex);
      }, prompt.carousel.stopTime * 1000)
    }
  }

  /**
   * 绘制裁剪框
   * @private
   * @memberof LineChart
   */
  private renderDefs() {
    this.animeRect = this.mainSVG.append('defs')
      .append('clipPath')
      .attr('id', `${this._id}_clippath`)
      .append('rect')
      .style('transform', `translate(${this.property.global.padding[2]}px,0px)`)
      .style('height', `${this.realHeight}px`)
      .style('width', `0px`)
  }

  /**
   *初始化图例
   * @private
   * @memberof LineChart
   */
  private renderLegend(): void {

    const legend = this.property.global.legend;
    this.mainSVG.select('.line-legend').style('display', legend.isShow ? 'block' : 'none');
    if (legend.isShow) {
      const dataSeries = this.property.series.dataSeries;
      const linekeys = legend.isShow ? Object.keys(this.property.series.dataSeries) : [];
      let divStyle = `font-family:${legend.style.font.family};font-size:${legend.style.font.size};color:${legend.style.font.color};font-weight:${legend.style.font.bolder ? 'bolder' : 'normal'};font-style:${legend.style.font.italic ? 'italic' : 'normal'};text-decoration:${legend.style.font.underline ? 'underline' : 'none'}`;
      this.mainSVG.select('.legend')
        .selectAll('.li_dom')
        .data(linekeys)
        .join((enter: any) => {
          let liDom = enter.append('li')
            .attr('class', `li_dom`)
            .attr('style', `display: flex; opacity: 1; align-items: center; cursor: pointer; gap: ${legend.style.valueMargin}px;`);

          liDom.append('span')
            .attr('style', (d: any) => `height: ${legend.style.size[1]}px; background: ${dataSeries[d].style.color}; width: ${legend.style.size[0]}px; gap: ${legend.style.valueMargin}px; min-width: ${legend.style.size[0]}px; `);

          liDom.append('div')
            .attr('style', divStyle)
            .text((d: any) => dataSeries[d].name)
        }, (update: any) => {
          update.attr('class', `li_dom`).attr('style', `display: flex; opacity: 1; align-items: center; cursor: pointer; gap: ${legend.style.valueMargin}px;`);

          update.select('span').attr('style', (d: any) => `height: ${legend.style.size[1]}px; background: ${dataSeries[d].style.color}; width: ${legend.style.size[0]}px; gap: ${legend.style.valueMargin}px; min-width: ${legend.style.size[0]}px; `);

          update.select('div').attr('style', divStyle)
            .text((d: any) => dataSeries[d].name)
        }, (exit: any) => {
          exit.remove()
        })
    }
  }

  /**
   *绘制x y轴
   * @private
   * @returns {void}
   * @memberof LineChart
   */
  private renderAxis(): void {
    const linekeys = Object.keys(this.property.series.dataSeries);
    let maxValue = 1, minValue = 0, maxValues = [] as number[], minValues = [] as number[];
    let zmaxValue = 1, zminValue = 0, zmaxValues = [] as number[], zminValues = [] as number[];
    if (this.property.axis.axisY.axisTick.rangeType == 'auto') {
      for (const key in this.property.series.dataSeries) {
        if (Object.prototype.hasOwnProperty.call(this.defaultData, key) && this.property.series.dataSeries[key].valueAxis == 'y') {
          maxValues.push(d3.max(this.defaultData[key], (d: dataType) => d.y) as number);
          minValues.push(d3.min(this.defaultData[key], (d: dataType) => d.y) as number);
        }
      }
      maxValue = (d3.max(maxValues) as number) * 1.1 || 1;
      minValue = (d3.max(minValues) as number) * 0.9 || 0;
    } else {
      maxValue = this.property.axis.axisY.axisTick.rangeValue[1];
      minValue = this.property.axis.axisY.axisTick.rangeValue[0];
    }

    if (this.property.axis.axisZ.axisTick.rangeType == 'auto') {
      for (const key in this.property.series.dataSeries) {
        if (Object.prototype.hasOwnProperty.call(this.defaultData, key) && this.property.series.dataSeries[key].valueAxis == 'z') {
          zmaxValues.push(d3.max(this.defaultData[key], (d: dataType) => d.y) as number);
          zminValues.push(d3.min(this.defaultData[key], (d: dataType) => d.y) as number);
        }
      }
      zmaxValue = (d3.max(zmaxValues) as number) * 1.1 || 1;
      zminValue = (d3.max(zminValues) as number) * 0.9 || 0;
    } else {
      zmaxValue = this.property.axis.axisZ.axisTick.rangeValue[1];
      zminValue = this.property.axis.axisZ.axisTick.rangeValue[0];
    }

    if (linekeys.length < 1) return;
    const xAxisValues = [...new Set(Object.values(this.defaultData).flatMap((value: any) => value.map((d: any) => d.x)))];//解构赋值
    const padding = this.property.global.padding;
    const width = this.realWidth - padding[2] - padding[3];
    const height = this.realHeight - padding[0] - padding[1];

    this.mainSVG.select(".axis-bg").selectAll(".axis").remove();
    this.xA = d3
      .scaleBand()
      .domain(xAxisValues)
      .range([padding[2], width])
      .padding(0.1);

    let xAxisD = d3.axisBottom(this.xA).tickSizeOuter(0).tickSize(this.property.axis.axisX.axisTick.length);
    let xAxis = xAxisD;
    // if (this.property.axis.axisX.axisLabel.isShow) {
    //   xAxis = xAxis.ticks(this.property.axis.axisX.axisLabel.showMargin);
    // }

    this.yA = d3
      .scaleLinear()
      .domain([minValue, maxValue] as [number, number])
      .nice()
      .range([height, padding[0]]);

    this.zA = d3
      .scaleLinear()
      .domain([zminValue, zmaxValue] as [number, number])
      .nice()
      .range([height, padding[0]]);

    $(this.mainSVG.select(".axis-bg").node()).empty()

    let that = this;
    if (this.property.axis.axisX.isShow) {
      let axisX = that.property.axis.axisX;
      this.mainSVG
        .select(".axis-bg")
        .append("g")
        .attr("class", "axisX")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .call((doms: any) => {
          //X轴线
          doms.select('path').remove();
          if (axisX.axisLine.isShow) {
            doms.append('path').attr('d', `M${padding[2]} 1L${width} 1`).style('stroke', axisX.axisLine.color).style('stroke-width', axisX.axisLine.stroke);
          }

          //X刻度
          doms.selectAll('line').style('stroke-width', `${axisX.axisTick.stroke} px`).style('stroke', `${axisX.axisTick.color} `)
          if (!axisX.axisTick.isShow) {
            doms.selectAll('line').remove();
          }
          if (axisX.axisLabel.textRotate != 0) {
            doms.selectAll('text').attr('transform', `rotate(${axisX.axisLabel.textRotate})`)
              .attr('dx', `${axisX.axisLabel.textOffset[0]} em`)
              .attr('dy', `${axisX.axisLabel.textOffset[1]} em`)

          }
          doms.selectAll('text').setFontStyle(axisX.axisLabel.font);
          //X网格线
          if (axisX.gridLine.isShow) {
            doms.selectAll('.tick').append('line')
              .attr('stroke-dasharray', axisX.gridLine.style == 'dash' ? `${axisX.gridLine.stroke} ` : '0')
              .attr('stroke', axisX.gridLine.color)
              .attr('stroke-width', axisX.gridLine.stroke)
              .attr('x1', 0)
              .attr('y1', padding[0] - height)
              .attr('x2', 0)
              .attr('y2', 0)
          }
        });
    }

    if (this.property.axis.axisY.isShow) {
      let axisY = that.property.axis.axisY;
      this.mainSVG
        .select(".axis-bg")
        .append("g")
        .attr("class", "axisY")
        .attr("transform", `translate(${padding[2]}, 0)`)
        .call(d3.axisLeft(this.yA).tickSize(axisY.axisTick.length))
        .call((doms: any) => {

          //Y轴线
          doms.select('path').style('stroke', axisY.axisLine.isShow ? axisY.axisLine.color : 'transparent').style('stroke-width', axisY.axisLine.stroke);
          //Y刻度
          doms.selectAll('line').style('stroke-width', `${axisY.axisTick.stroke} px`).style('stroke', `${axisY.axisTick.color} `)
          if (!axisY.axisTick.isShow) {
            doms.selectAll('line').remove();
          }
          doms.selectAll('text').setFontStyle(axisY.axisLabel.font)
          //Y网格线
          if (axisY.gridLine.isShow) {
            doms.selectAll('.tick').append('line')
              .attr('stroke-dasharray', axisY.gridLine.style == 'dash' ? `${axisY.gridLine.stroke} ` : '0')
              .attr('stroke', axisY.gridLine.color)
              .attr('stroke-width', axisY.gridLine.stroke)
              .attr('x1', 0)
              .attr('y1', 0)
              .attr('x2', width - padding[2])
              .attr('y2', 0)
              .style('opacity', (_d: any, index: number) => {
                return index;
              })
          }
        });
    }

    if (this.property.axis.axisZ.isShow) {
      let axisZ = that.property.axis.axisZ;
      this.mainSVG
        .select(".axis-bg")
        .append("g")
        .attr("class", "axisZ")
        .attr("transform", `translate(${width}, 0)`)
        .call(d3.axisRight(this.zA).tickSize(axisZ.axisTick.length))
        .call((doms: any) => {

          //Y轴线
          doms.select('path').style('stroke', axisZ.axisLine.isShow ? axisZ.axisLine.color : 'transparent').style('stroke-width', axisZ.axisLine.stroke);
          //Y刻度
          doms.selectAll('line').style('stroke-width', `${axisZ.axisTick.stroke} px`).style('stroke', `${axisZ.axisTick.color} `)
          if (!axisZ.axisTick.isShow) {
            doms.selectAll('line').remove();
          }
          doms.selectAll('text').setFontStyle(axisZ.axisLabel.font)
          //Y网格线
          if (axisZ.gridLine.isShow) {
            doms.selectAll('.tick').append('line')
              .attr('stroke-dasharray', axisZ.gridLine.style == 'dash' ? `${axisZ.gridLine.stroke} ` : '0')
              .attr('stroke', axisZ.gridLine.color)
              .attr('stroke-width', axisZ.gridLine.stroke)
              .attr('x1', 0)
              .attr('y1', 0)
              .attr('x2', -width + padding[2])
              .attr('y2', 0)
              .style('opacity', (_d: any, index: number) => {
                return index;
              })
          }
        });
    }
  }

  /**
   * 初始化线条函数
   * @private
   * @memberof LineChart
   */
  private _getLine(): void {
    // @ts-ignore
    const dataSeries = this.property.series.dataSeries;
    const linekeys = Object.keys(dataSeries);
    for (let index = 0; index < linekeys.length; index++) {
      let lineKey = linekeys[index];
      if (dataSeries[lineKey].style.smooth) {
        if (dataSeries[lineKey].valueAxis == 'y') {
          // @ts-ignore
          dataSeries[lineKey].line = !this.xA && !this.yA ? null : d3.line().x((d: any) => this.xA(d.x)).y((d: any) => this.yA(d.y)).curve(d3.curveCatmullRom);
        } else {
          // @ts-ignore
          dataSeries[lineKey].line = !this.xA && !this.yA ? null : d3.line().x((d: any) => this.xA(d.x)).y((d: any) => this.zA(d.y)).curve(d3.curveCatmullRom);
        }
      } else {
        if (dataSeries[lineKey].valueAxis == 'y') {
          // @ts-ignore
          dataSeries[lineKey].line = !this.xA && !this.yA ? null : d3.line().x((d: any) => this.xA(d.x)).y((d: any) => this.yA(d.y));
        } else {
          // @ts-ignore
          dataSeries[lineKey].line = !this.xA && !this.yA ? null : d3.line().x((d: any) => this.xA(d.x)).y((d: any) => this.zA(d.y));
        }
      }
    }
  }

  /**
   * 绘制曲线
   * @private
   * @memberof LineChart
   */
  private renderLine(): void {
    const data = this.defaultData;
    const dataSeries = this.property.series.dataSeries;
    const linekeys = Object.keys(this.property.series.dataSeries);
    let that = this;
    this.animeRect.style('width', `0px`)
    this.chartContainer.select('.graph')
      .selectAll('g')
      .data(linekeys)
      .join(
        (enter: any) => {
          enter
            .append('g')
            .attr('class', (d: any) => `${d}_line`)
            .append("path")
            .attr("transform", `translate(${that.xA.bandwidth() / 2}, 0)`)
            .attr("d", (d: any) => dataSeries[d].line(data[d] || []))
            .attr("stroke", (d: any) => dataSeries[d].style.color != '' ? dataSeries[d].style.color : 'red')
            .attr("stroke-width", (d: any) => dataSeries[d].style.lineWidth)
            .attr("fill", "none")
        },
        (update: any) => {
          update.attr('class', (d: any) => `${d}_line`)
            .select('path')
            .attr("d", (d: any) => dataSeries[d].line(data[d] || []));
        },
        (exit: any) => exit.remove()
      );

    for (let index = 0; index < linekeys.length; index++) {
      let keyClass = linekeys[index];
      let fill = '', dPth = '', tempMax = 0, tempMin = 0;
      switch (dataSeries[keyClass].style.symbolType) {
        case 'rect':
          fill = dataSeries[keyClass].style.color;
          dPth = getSymbol('rect');
          break;
        case 'hollowrect':
          fill = 'none';
          dPth = getSymbol('rect');
          break;
        case 'circle':
          fill = dataSeries[keyClass].style.color;
          dPth = getSymbol('circle');
          break;
        case 'hollowcircle':
          fill = 'none';
          dPth = getSymbol('circle');
          break;
        case 'triangle':
          fill = dataSeries[keyClass].style.color;
          dPth = getSymbol('triangle');
          break;
        case 'pin':
          fill = dataSeries[keyClass].style.color;
          dPth = getSymbol('pin');
          break;
        case 'hollowpin':
          fill = 'none';
          dPth = getSymbol('pin');
          break;
        default:
          fill = 'none';
          dPth = '';
          break;
      }
      if (dataSeries[keyClass].highlight.isShow && (dataSeries[keyClass].highlight.valueType == 'min' || dataSeries[keyClass].highlight.valueType == 'max')) {
        tempMax = d3.max(data[keyClass], (d: dataType) => d.y) as number;
        tempMin = d3.min(data[keyClass], (d: dataType) => d.y) as number;
      }
      this.chartContainer.select('.graph')
        .select(`.${keyClass}_line`)
        .selectAll(`.item`)
        .data(data[keyClass] || [])
        .join((enter: any) => {
          enter.append("path")
            .attr('class', `item`)
            .attr("d", dPth)
            .attr("stroke", (d: any) => {
              if (dataSeries[keyClass].highlight.isShow) {
                if (dataSeries[keyClass].highlight.valueType == 'min' && d.y == tempMin) {
                  return dataSeries[keyClass].highlight.color;
                } else if (dataSeries[keyClass].highlight.valueType == 'max' && d.y == tempMax) {
                  return dataSeries[keyClass].highlight.color;
                } else if (dataSeries[keyClass].highlight.valueType == 'assign' && d.x == dataSeries[keyClass].highlight.value) {
                  return dataSeries[keyClass].highlight.color;
                } else {
                  return fill;
                }
              }
              return fill;
            })
            .attr("stroke-width", dataSeries[keyClass].style.lineWidth / dataSeries[keyClass].style.symbolSize)
            .attr("fill", (d: any) => {
              if (dataSeries[keyClass].highlight.isShow) {
                if (dataSeries[keyClass].highlight.valueType == 'min' && d.y == tempMin) {
                  return dataSeries[keyClass].highlight.color;
                } else if (dataSeries[keyClass].highlight.valueType == 'max' && d.y == tempMax) {
                  return dataSeries[keyClass].highlight.color;
                } else if (dataSeries[keyClass].highlight.valueType == 'assign' && d.x == dataSeries[keyClass].highlight.value) {
                  return dataSeries[keyClass].highlight.color;
                } else {
                  return fill;
                }
              }
              return fill;
            })
            .style("transform", (d: any) => `translate(${(that.xA(d.x) as number) + that.xA.bandwidth() / 2}px, ${dataSeries[keyClass].valueAxis == 'y' ? that.yA(d.y) : that.zA(d.y)}px) scale(${dataSeries[keyClass].style.symbolSize})`)
            .on('mouseover', (d: any) => {
              console.log(d.currentTarget.__data__)
              that.promptAnime(d.currentTarget.__data__.x)
            });
        }, (update: any) => {
          update.attr('class', `item`)
            .attr("d", dPth)
            .attr("stroke", (d: any) => {
              if (dataSeries[keyClass].highlight.isShow) {
                if (dataSeries[keyClass].highlight.valueType == 'min' && d.y == tempMin) {
                  return dataSeries[keyClass].highlight.color;
                } else if (dataSeries[keyClass].highlight.valueType == 'max' && d.y == tempMax) {
                  return dataSeries[keyClass].highlight.color;
                } else if (dataSeries[keyClass].highlight.valueType == 'assign' && d.x == dataSeries[keyClass].highlight.value) {
                  return dataSeries[keyClass].highlight.color;
                } else {
                  return fill;
                }
              }
              return fill;
            })
            .attr("stroke-width", dataSeries[keyClass].style.lineWidth / dataSeries[keyClass].style.symbolSize)
            .attr("fill", (d: any) => {
              if (dataSeries[keyClass].highlight.isShow) {
                if (dataSeries[keyClass].highlight.valueType == 'min' && d.y == tempMin) {
                  return dataSeries[keyClass].highlight.color;
                } else if (dataSeries[keyClass].highlight.valueType == 'max' && d.y == tempMax) {
                  return dataSeries[keyClass].highlight.color;
                } else if (dataSeries[keyClass].highlight.valueType == 'assign' && d.x == dataSeries[keyClass].highlight.value) {
                  return dataSeries[keyClass].highlight.color;
                } else {
                  return fill;
                }
              }
              return fill;
            })
            .style("transform", (d: any) => `translate(${(that.xA(d.x) as number) + that.xA.bandwidth() / 2}px, ${dataSeries[keyClass].valueAxis == 'y' ? that.yA(d.y) : that.zA(d.y)}px) scale(${dataSeries[keyClass].style.symbolSize})`)
        }, (exit: any) => exit.remove());

      if (dataSeries[keyClass].dataTip.isShow) {
        this.chartContainer.select('.graph')
          .select(`.${keyClass}_line`)
          .selectAll(`text`)
          .data(data[keyClass] || [])
          .join((enter: any) => {
            enter.append("text")
              .attr("fill", dataSeries[keyClass].dataTip.color != '' ? dataSeries[keyClass].dataTip.color : 'red')
              .style('text-anchor', "middle")
              .style("transform", (d: any) => {
                let translateX = (that.xA(d.x) as number) + that.xA.bandwidth() / 2 + dataSeries[keyClass].dataTip.offset[0];
                let translateY = 0;
                if (dataSeries[keyClass].valueAxis == 'y') {
                  translateY = that.yA(d.y) - dataSeries[keyClass].style.symbolSize - dataSeries[keyClass].style.lineWidth + dataSeries[keyClass].dataTip.offset[1];
                } else if (dataSeries[keyClass].valueAxis == 'z') {
                  translateY = that.zA(d.y) - dataSeries[keyClass].style.symbolSize - dataSeries[keyClass].style.lineWidth + dataSeries[keyClass].dataTip.offset[1];
                }
                return `translate(${translateX}px, ${translateY}px)`;
              })
              .text((d: any) => `${d.y}${dataSeries[keyClass].dataTip.suffix}`)
          }, (update: any) => {
            update.attr("fill", dataSeries[keyClass].dataTip.color != '' ? dataSeries[keyClass].dataTip.color : 'red')
              .style('text-anchor', "middle")
              .style("transform", (d: any) => {
                let translateX = (that.xA(d.x) as number) + that.xA.bandwidth() / 2 + dataSeries[keyClass].dataTip.offset[0];
                let translateY = 0;
                if (dataSeries[keyClass].valueAxis == 'y') {
                  translateY = that.yA(d.y) - dataSeries[keyClass].style.symbolSize - dataSeries[keyClass].style.lineWidth + dataSeries[keyClass].dataTip.offset[1];
                } else if (dataSeries[keyClass].valueAxis == 'z') {
                  translateY = that.zA(d.y) - dataSeries[keyClass].style.symbolSize - dataSeries[keyClass].style.lineWidth + dataSeries[keyClass].dataTip.offset[1];
                }
                return `translate(${translateX}px, ${translateY}px)`;
              })
              .text((d: any) => `${d.y}${dataSeries[keyClass].dataTip.suffix}`)
          }, (exit: any) => exit.remove());

        this.chartContainer.select('.graph').select(`.${keyClass}_line`).selectAll(`text`).setFontStyle(dataSeries[keyClass].dataTip.font);
      }
    }
    this.animeRect.transition().duration(1000).style('width', `${this.realWidth}px`)
  }

  /**
   * 绘制引导线
   * @private
   * @memberof LineChart
   */
  private _renderGuidLine() {

    const linekeys = Object.keys(this.property.series.dataSeries);

    let tempData = {} as any;
    linekeys.forEach(element => {
      tempData[element] = this.defaultData[element] || [];
    });

    const allValues = [...new Set(Object.values(tempData).flatMap((value: any) => value.map((d: any) => d.y)))];//解构赋值
    let guideMax = 0, guideMin = 0, guideAverge: any = 0;
    guideMax = d3.max(allValues);
    guideMin = d3.min(allValues);
    guideAverge = d3.mean(allValues)?.toFixed(2);

    const padding = this.property.global.padding;
    const width = this.realWidth - padding[3];
    const guideLine = this.property.series.guideLine;
    let guideLineKeys = Object.keys(guideLine);

    this.chartContainer.select(".guide-line")
      .selectAll('g')
      .data(guideLineKeys)
      .join((enter: any) => {
        let guideDom = enter.append('g').attr('class', (d: any) => d);
        guideDom.append('line')
          .attr('x1', padding[2])
          .attr('y1', (d: any) => {
            let lineScale = guideLine[d].style.axis == 'y' ? this.yA : this.zA;
            if (guideLine[d].style.lineType == 'max') {
              return lineScale(guideMax);
            } else if (guideLine[d].style.lineType == 'min') {
              return lineScale(guideMin);
            } else if (guideLine[d].style.lineType == 'average') {
              return lineScale(guideAverge);
            } else if (guideLine[d].style.lineType == 'assign') {
              return lineScale(guideLine[d].style.value);
            }
          })
          .attr('x2', width - padding[2])
          .attr('y2', (d: any) => {
            let lineScale = guideLine[d].style.axis == 'y' ? this.yA : this.zA;
            if (guideLine[d].style.lineType == 'max') {
              return lineScale(guideMax);
            } else if (guideLine[d].style.lineType == 'min') {
              return lineScale(guideMin);
            } else if (guideLine[d].style.lineType == 'average') {
              return lineScale(guideAverge);
            } else if (guideLine[d].style.lineType == 'assign') {
              return lineScale(guideLine[d].style.value);
            }

          })
          .attr('stroke', (d: any) => guideLine[d].style.color)
          .attr('stroke-width', (d: any) => guideLine[d].style.stroke)
          .attr('stroke-dasharray', (d: any) => guideLine[d].style.lineStyle == 'line' ? '0' : `${guideLine[d].style.stroke}`);

        guideDom.append('text').attr('y', (d: any) => {
          let lineScale = guideLine[d].style.axis == 'y' ? this.yA : this.zA;
          let translateY: any;
          if (guideLine[d].style.lineType == 'max') {
            translateY = lineScale(guideMax);
          } else if (guideLine[d].style.lineType == 'min') {
            translateY = lineScale(guideMin);
          } else if (guideLine[d].style.lineType == 'average') {
            translateY = lineScale(guideAverge);
          } else if (guideLine[d].style.lineType == 'assign') {
            translateY = lineScale(guideLine[d].style.value);
          }
          return translateY + guideLine[d].dataTip.offset[1]
        })
          .attr('x', (d: any) => padding[2] + guideLine[d].dataTip.offset[0])
          .text((d: any) => {
            if (guideLine[d].style.lineType == 'max') {
              return `${guideMax}${guideLine[d].dataTip.suffix}`;
            } else if (guideLine[d].style.lineType == 'min') {
              return `${guideMin}${guideLine[d].dataTip.suffix}`;
            } else if (guideLine[d].style.lineType == 'average') {
              return `${guideAverge}${guideLine[d].dataTip.suffix}`;
            } else if (guideLine[d].style.lineType == 'assign') {
              return `${guideLine[d].style.value}${guideLine[d].dataTip.suffix}`;
            }
          })
      }, (update: any) => {
        update.select('line')
          .attr('x1', padding[2])
          .attr('y1', (d: any) => {
            let lineScale = guideLine[d].style.axis == 'y' ? this.yA : this.zA;
            if (guideLine[d].style.lineType == 'max') {
              return lineScale(guideMax);
            } else if (guideLine[d].style.lineType == 'min') {
              return lineScale(guideMin);
            } else if (guideLine[d].style.lineType == 'average') {
              return lineScale(guideAverge);
            } else if (guideLine[d].style.lineType == 'assign') {
              return lineScale(guideLine[d].style.value);
            }
          })
          .attr('x2', width - padding[2])
          .attr('y2', (d: any) => {
            let lineScale = guideLine[d].style.axis == 'y' ? this.yA : this.zA;
            if (guideLine[d].style.lineType == 'max') {
              return lineScale(guideMax);
            } else if (guideLine[d].style.lineType == 'min') {
              return lineScale(guideMin);
            } else if (guideLine[d].style.lineType == 'average') {
              return lineScale(guideAverge);
            } else if (guideLine[d].style.lineType == 'assign') {
              return lineScale(guideLine[d].style.value);
            }
          })
          .attr('stroke', (d: any) => guideLine[d].style.color)
          .attr('stroke-width', (d: any) => guideLine[d].style.stroke)
          .attr('stroke-dasharray', (d: any) => guideLine[d].style.lineStyle == 'line' ? '0' : `${guideLine[d].style.stroke}`);

        update.select('text')
          .attr('y', (d: any) => {
            let translateY: any;
            let lineScale = guideLine[d].style.axis == 'y' ? this.yA : this.zA;
            if (guideLine[d].style.lineType == 'max') {
              translateY = lineScale(guideMax);
            } else if (guideLine[d].style.lineType == 'min') {
              translateY = lineScale(guideMin);
            } else if (guideLine[d].style.lineType == 'average') {
              translateY = lineScale(guideAverge);
            } else if (guideLine[d].style.lineType == 'assign') {
              translateY = lineScale(guideLine[d].style.value);
            }
            return translateY + guideLine[d].dataTip.offset[1]
          })
          .attr('x', (d: any) => padding[2] + guideLine[d].dataTip.offset[0])
          .text((d: any) => {
            if (guideLine[d].style.lineType == 'max') {
              return `${guideMax}${guideLine[d].dataTip.suffix}`;
            } else if (guideLine[d].style.lineType == 'min') {
              return `${guideMin}${guideLine[d].dataTip.suffix}`;
            } else if (guideLine[d].style.lineType == 'average') {
              return `${guideAverge}${guideLine[d].dataTip.suffix}`;
            } else if (guideLine[d].style.lineType == 'assign') {
              return `${guideLine[d].style.value}${guideLine[d].dataTip.suffix}`;
            }
          })
      }, (exit: any) => exit.remove())

    guideLineKeys.forEach(guideClass => {
      this.chartContainer.select(".guide-line").select(`.${guideClass}`).select('text').setFontStyle(guideLine[guideClass].dataTip.font)
    });
  }

  public update(data: any) {
    // console.log("bar chart update", data);
    this.defaultData = data;
    this.renderAxis();
    this._getLine();
    this.renderLine();
    // this.renderLegend();
    this._renderGuidLine();
  }

  private clearTimer() {
    this.aniTimer && clearInterval(this.aniTimer);
    this.aniTimer = null;
  }

  public cleanup(): void {
    super.cleanup();
    this.clearTimer();
  }
}

export default LineChart;
