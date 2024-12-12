import * as d3 from "d3";
import _, { forEach } from "lodash";
import $ from "jquery";
import "../base/d3Extend";
import SVGComponentBase from "../base/svgComponentBase";
import { ComponentProperty, PropertyDictionaryItem } from "lib/types/compProperty";
import OptionType from "../base/optionType";
import { getSymbol, formatDate } from "../base/compUtil";

interface dataType {
  x: string;
  y: number;
}

/**
 * 基础散点图
 * @class ScatterPlotChart
 * @extends {SVGComponentBase}
 */
class ScatterPlotChart extends SVGComponentBase {
  private xA: d3.ScaleLinear<number, number>;
  private yA: d3.ScaleLinear<number, number>;
  private zA: d3.ScaleLinear<number, number>;
  dataSeriesProperty: any;
  dataSeriesPropertyDictionary!: PropertyDictionaryItem[];
  chartContainer: any;
  realWidth: number;
  realHeight: number;
  promptcontentbg: any;
  aniTimer: any;
  _id: any;
  defs: any;

  constructor(id: string, code: string, container: Element, workMode: number, option: Object, useDefaultOpt: boolean) {
    super(id, code, container, workMode, option, useDefaultOpt);
    this.realWidth = 1920;
    this.realHeight = 1080;
    this.xA = d3.scaleLinear();
    this.yA = d3.scaleLinear();
    this.zA = d3.scaleLinear();
    this._id = 'wiscom_' + this.id;
    this.initAddedProperty();

    this.draw();
  }

  protected setupDefaultValues(): void {
    super.setupDefaultValues();
    this.initAddedProperty();

    let dataSeriesModels = Object.values(this.property.series.dataSeries);
    let dataSeriesModelArr = [];
    let dataSeriesDic = this.getPropertyDictionary('series.dataSeries');
    for (let i = 0; i < dataSeriesModels.length; i++) {
      // @ts-ignore
      let plotName = dataSeriesModels[i].groupId;
      dataSeriesModelArr.push({
        name: plotName,
        displayName: `数据系列${plotName.split("_")[1]}`,
        description: plotName,
        action: [
          {
            text: "删除组",
            style: "red",
            action: "deleteDataSeries",
            param: [plotName.split("_")[1]],
          },
        ],
        children: _.cloneDeep(this.dataSeriesPropertyDictionary),
      })
    }
    //@ts-ignore
    dataSeriesDic.children = dataSeriesModelArr;

    if (this.dataBind === undefined || JSON.stringify(this.dataBind) === "{}") {
      this.dataBind = {
      };
    };

    for (let i = 0; i < dataSeriesModels.length; i++) {
      //@ts-ignore
      let dataSeriesName = dataSeriesModels[i].groupId;
      this._addDataBind(dataSeriesName, true);
    }

    this.defaultData = {
      'dataSeries_0': [
        { x: "1", y: 14.5 },
        { x: "2", y: 8.2 },
        { x: "3", y: 2.7 },
        { x: "4", y: 4.3 },
        { x: "5", y: 130 },
        { x: "6", y: 2.3 },
        { x: "7", y: 2 },
        { x: "8", y: 6 },
        { x: "9", y: 7 },
        { x: "10", y: 0 }
      ],
      'dataSeries_1': [
        { x: "1", y: 56 },
        { x: "2", y: 820 },
        { x: "3", y: 27 },
        { x: "4", y: 43 },
        { x: "5", y: 10 },
        { x: "6", y: 23 },
        { x: "7", y: 20 },
        { x: "8", y: 60 },
        { x: "9", y: 70 },
        { x: "10", y: 10 },
        { x: "11", y: 8 },
        { x: "12", y: 40 }
      ]
    } as any;
  }

  private _addDataBind(plotName = '', isAdd = true) {
    if (isAdd) {
      if (Object.keys(this.dataBind).indexOf(plotName) < 0) {
        this.dataBind[plotName] = { x: { bindKey: '', isCustom: false }, y: { bindKey: '', isCustom: false } };
      }
    } else {
      delete this.dataBind[plotName];
    }
  }

  protected initProperty(): void {
    super.initProperty();
    const property: ComponentProperty = {
      basic: {
        className: "ScatterPlotChart",
      },
      global: {
        padding: [40, 60, 50, 40],
        bgImage: "",
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
            labelFormat: 'category',//time category
            timeFormat: ''
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
            groupId: 'dataSeries_0',
            name: '散点1',
            valueAxis: "y",
            style: {
              color: 'red',
              radius: 8,
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
              offset: [0, -10],
              suffix: "",
            },
          }
        }
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
                  {
                    name: "标签格式",
                    displayName: "labelFormat",
                    type: OptionType.radio,
                    options: [
                      {
                        name: "类目型",
                        value: "category",
                      },
                      {
                        name: "时间型",
                        value: "time",
                      },
                    ],
                  },
                  {
                    name: "时间格式",
                    displayName: "timeFormat",
                    type: OptionType.radio,
                    options: [
                      {
                        name: '无',
                        value: '',
                      },
                      {
                        name: '年',
                        value: 'yyyy',
                      },
                      {
                        name: '月',
                        value: 'MM',
                      },
                      {
                        name: '日',
                        value: 'dd',
                      },
                      {
                        name: '时',
                        value: 'HH',
                      },
                      {
                        name: '分',
                        value: 'mm',
                      },
                      {
                        name: '秒',
                        value: 'ss',
                      },
                      {
                        name: '月/日',
                        value: 'MM/dd',
                      },
                      {
                        name: '年-月-日',
                        value: 'yyyy-MM-dd',
                      },
                      {
                        name: '时:分:秒',
                        value: 'HH:mm:ss',
                      },
                    ]
                  }
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
          }
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
        groupId: '',
        name: '',
        valueAxis: "y",
        style: {
          color: 'green',
          radius: 6,
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
          offset: [0, -10],
          suffix: "",
        },
      };
    }
    if (!this.dataSeriesPropertyDictionary) {
      this.dataSeriesPropertyDictionary = [
        {
          name: "groupId",
          displayName: "散点编码",
          type: OptionType.string,
          editable: false,
          show: true,
        },
        {
          name: "name",
          displayName: "散点名称",
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
              name: "color",
              displayName: "填充色",
              type: OptionType.color,
            },
            {
              name: "radius",
              displayName: "半径",
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
  }

  protected handlePropertyChange(): void {
    this.propertyManager.onPropertyChange((path: string, value: any) => {
      switch (path) {
        case "global.padding":
          this.chartContainer.style("transform", `translate(${value[2]}px,${value[0]}px)`);
          break;
        case "global.legend.isShow":
          this.getPropertyDictionary("global.legend.style").show = false;
          this.getPropertyDictionary("global.legend.layout").show = false;
          break;
        case "axis.axisX.isShow":
          this.getPropertyDictionary("axis.axisX.axisLabel").show = false;
          this.getPropertyDictionary("axis.axisX.axisLine").show = false;
          this.getPropertyDictionary("axis.axisX.axisTick").show = false;
          this.getPropertyDictionary("axis.axisX.gridLine").show = false;
          break;
        case "axis.axisY.isShow":
          this.getPropertyDictionary("axis.axisY.axisLabel").show = false;
          this.getPropertyDictionary("axis.axisY.axisLine").show = false;
          this.getPropertyDictionary("axis.axisY.axisTick").show = false;
          this.getPropertyDictionary("axis.axisY.gridLine").show = false;
          break;
        case "axis.axisZ.isShow":
          this.getPropertyDictionary("axis.axisZ.axisLabel").show = false;
          this.getPropertyDictionary("axis.axisZ.axisLine").show = false;
          this.getPropertyDictionary("axis.axisZ.axisTick").show = false;
          this.getPropertyDictionary("axis.axisZ.gridLine").show = false;
          break;
        case "prompt.isShow":
          this.getPropertyDictionary("prompt.carousel").show = false;
          this.getPropertyDictionary("prompt.suspend").show = false;
          break;
      }
      // this.render();
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
    this.property.series.dataSeries[dataSeriesName].groupId = dataSeriesName;
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
    this._addDataBind(dataSeriesName, true);
    this.renderAxis();
    this.renderPlot();
    this.renderLegend();
    if (this.property.prompt.isShow) {
      this._renderPromptList();
    }
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

    this._addDataBind(dataSeriesName, false);
    this.renderAxis();
    this.renderPlot();
    this.renderLegend();
    if (this.property.prompt.isShow) {
      this._renderPromptList();
    }
    this.promptAnime('');
  }

  protected draw() {
    super.draw();
    this.render();
  }

  private render(): void {
    this.renderDefs();
    this.renderContainer();
    this.renderAxis();
    this.renderPlot();
    this.renderLegend();
    this.promptAnime('');
  }

  private renderContainer(): void {
    if (this.property.global.bgImage !== "") {
      this.mainSVG.append("image").attr("x", 0).attr("y", 0).attr("width", this.property.frame[2]).attr("height", this.property.frame[3]).attr("xlink:href", this.property.global.bgImage);
    }
    const padding = this.property.global.padding;
    let prompt = this.property.prompt;

    this.realWidth = this.property.svgBasic.viewBox[2];
    this.realHeight = this.property.svgBasic.viewBox[3];

    this.chartContainer = this.mainSVG.append("g").attr("class", "scatterPlotChart-container").style("transform", `translate(${padding[2]}px,${padding[0]}px)`);
    this.chartContainer.append("g").attr("class", "axis-bg");
    this.chartContainer.append("g").attr("class", "graph");
    if (prompt.isShow) {
      this.chartContainer.append('rect')
        .attr('class', `prompt-indicator prompt-sign`)
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
      .attr("class", "plot-legend")
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
        .attr("class", "prompt-sign")
        .append("foreignObject")
        .attr("class", "plot-prompt")
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
      if (!prompt.carousel.isShow) {
        this.mainSVG.selectAll('.prompt-sign').style('display', 'none')
      }
      this._renderPromptList();
    }
  }

  private _renderPromptList() {
    let prompt = this.property.prompt;
    const dataSeries = this.property.series.dataSeries;
    const plotkeys = this.property.prompt.isShow ? Object.keys(this.property.series.dataSeries) : [];
    let nameFont = `font-family:${prompt.suspend.style.nameFont.family};font-size:${prompt.suspend.style.nameFont.size};color:${prompt.suspend.style.nameFont.color};font-weight:${prompt.suspend.style.nameFont.bolder ? 'bolder' : 'normal'};font-style:${prompt.suspend.style.nameFont.italic ? 'italic' : 'normal'};text-decoration:${prompt.suspend.style.nameFont.underline ? 'underline' : 'none'};`;

    let dataFont = `font-family:${prompt.suspend.style.dataFont.family};font-size:${prompt.suspend.style.dataFont.size};color:${prompt.suspend.style.dataFont.color};font-weight:${prompt.suspend.style.dataFont.bolder ? 'bolder' : 'normal'};font-style:${prompt.suspend.style.dataFont.italic ? 'italic' : 'normal'};text-decoration:${prompt.suspend.style.dataFont.underline ? 'underline' : 'none'};`;
    this.promptcontentbg.selectAll(`.prompt-li`)
      .data(plotkeys)
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

  private promptAnime(xValue: any) {

    this.clearTimer();
    let prompt = this.property.prompt;
    if (!prompt.isShow) return;
    const padding = this.property.global.padding;
    const plotkeys = Object.keys(this.property.series.dataSeries);
    let tempData = {} as any, values = [] as number[];
    plotkeys.forEach(element => {
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
    let indicatorWidth = prompt.suspend.indicator.widthPercent * 20;
    this.chartContainer.select('.prompt-indicator').attr('width', indicatorWidth);
    //提示框当前位置的下标
    let prompAniIndex = xAxisValues.indexOf(xValue) < 0 ? 0 : xAxisValues.indexOf(xValue);

    let that = this;
    //提示框位置更新
    let showPromptIndex = function (aniIndex: number) {
      for (let index = 0; index < plotkeys.length; index++) {
        //@ts-ignore
        that.promptcontentbg.select(`#${that._id}_${plotkeys[index]}`).select('.pro-legend-value').text(promptData[aniIndex][plotkeys[index]]);
      }

      that.promptcontentbg.select('.prompt-content-title').text(promptData[aniIndex]['xkey']);
      let translateX = (that.xA(promptData[aniIndex]['xkey']) as number) + prompt.suspend.background.offset[0];
      let translateY = padding[0] + prompt.suspend.background.offset[1];
      if (translateX + prompt.suspend.background.size[0] > that.realWidth - padding[2]) {
        translateX = (that.xA(promptData[aniIndex]['xkey']) as number) - prompt.suspend.background.size[0] - prompt.suspend.background.offset[0];
      }
      that.mainSVG.select('.plot-prompt').style('transform', `translate3d(${translateX}px,${translateY}px,0px)`);
      that.chartContainer.select('.prompt-indicator').attr('x', (that.xA(promptData[aniIndex]['xkey']) as number) - indicatorWidth / 2);
    }
    showPromptIndex(prompAniIndex);
    if (prompt.isShow && prompt.carousel.isShow) {
      that.mainSVG.selectAll('.prompt-sign').style('display', 'block');
      this.aniTimer = setInterval(() => {
        prompAniIndex++;
        if (prompAniIndex >= promptData.length) {
          prompAniIndex = 0;
        }
        //@ts-ignore
        showPromptIndex(prompAniIndex);
      }, prompt.carousel.stopTime * 1000)
    }
  }

  /**
   * 绘制裁剪框
   * @private
   * @memberof ScatterPlotChart
   */
  private renderDefs() {
    this.defs = this.mainSVG.append('defs')
  }

  /**
   *初始化图例
   * @private
   * @memberof ScatterPlotChart
   */
  private renderLegend(): void {

    const legend = this.property.global.legend;
    this.mainSVG.select('.plot-legend').style('display', legend.isShow ? 'block' : 'none');
    if (legend.isShow) {
      const dataSeries = this.property.series.dataSeries;
      const plotkeys = legend.isShow ? Object.keys(this.property.series.dataSeries) : [];
      let divStyle = `font-family:${legend.style.font.family};font-size:${legend.style.font.size};color:${legend.style.font.color};font-weight:${legend.style.font.bolder ? 'bolder' : 'normal'};font-style:${legend.style.font.italic ? 'italic' : 'normal'};text-decoration:${legend.style.font.underline ? 'underline' : 'none'}`;
      this.mainSVG.select('.legend')
        .selectAll('.li_dom')
        .data(plotkeys)
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

  private sortData(dataKey: string) {
    this.defaultData[dataKey] = this.defaultData[dataKey].map((item: any) => ({ ...item, s: dataKey }));
    return this.defaultData[dataKey];
  }

  /**
   *绘制x y轴
   * @private
   * @returns {void}
   * @memberof ScatterPlotChart
   */
  private renderAxis(): void {
    const plotkeys = Object.keys(this.property.series.dataSeries);
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

    if (plotkeys.length < 1) return;
    let tempData = {} as any, allData = [] as any;
    plotkeys.forEach(element => {
      tempData[element] = this.defaultData[element] || [];
      allData = allData.concat(this.sortData(element))
    });
    const xAxisValues = [...new Set(Object.values(tempData).flatMap((value: any) => value.map((d: any) => parseFloat(d.x))))];//解构赋值

    const padding = this.property.global.padding;
    const width = this.realWidth - padding[2] - padding[3];
    const height = this.realHeight - padding[0] - padding[1];

    this.mainSVG.select(".axis-bg").selectAll(".axis").remove();
    this.xA = d3
      .scaleLinear()
      .domain([d3.min(xAxisValues), d3.max(xAxisValues)] as [number, number])
      .range([padding[2], width]);

    let xAxisD = d3.axisBottom(this.xA).tickSizeOuter(0).tickSize(this.property.axis.axisX.axisTick.length);
    let xAxis = xAxisD;

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
              .attr('dx', `${axisX.axisLabel.textOffset[0]}em`)
              .attr('dy', `${axisX.axisLabel.textOffset[1]}em`)
          }

          //时间刻度时候转换
          if (axisX.axisLabel.labelFormat == 'time' && axisX.axisLabel.timeFormat != '') {
            doms.selectAll('text').data(xAxisValues).text(function (d: any) {
              let dd = formatDate(new Date(d), axisX.axisLabel.timeFormat);
              return dd;
            });
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
   * 绘制曲线
   * @private
   * @memberof ScatterPlotChart
   */
  private renderPlot(): void {
    const data = this.defaultData;
    const dataSeries = this.property.series.dataSeries;
    const plotkeys = Object.keys(this.property.series.dataSeries);

    let allData = [] as any;
    plotkeys.forEach(element => {
      allData = allData.concat(this.defaultData[element] || [])
    });
    let that = this;
    this.chartContainer.select('.graph')
      .selectAll('circle')
      .data(allData)
      .join((enter: any) => {
        enter.append('circle')
          .attr('r', (d: any) => dataSeries[d.s].style.radius)
          .attr('fill', (d: any) => dataSeries[d.s].style.color)
          .attr('cx', (d: any) => this.xA(d.x))
          .attr('cy', (d: any) => dataSeries[d.s].valueAxis == 'y' ? this.yA(d.y) : this.zA(d.y))
          .on('mouseover', (d: any) => {
            // let prompt = that.property.prompt;
            // if (prompt.isShow && !prompt.carousel.isShow) {
            //   that.mainSVG.selectAll('.prompt-sign').style('display', 'block')
            //   that.promptAnime(d.currentTarget.__data__.x);
            // }
          })
      }, (update: any) => {
        update.attr('r', (d: any) => dataSeries[d.s].style.radius)
          .attr('fill', (d: any) => dataSeries[d.s].style.color)
          .attr('cx', (d: any) => this.xA(d.x))
          .attr('cy', (d: any) => dataSeries[d.s].valueAxis == 'y' ? this.yA(d.y) : this.zA(d.y))
      }, (exit: any) => exit.remove())

    this.chartContainer.select('.graph')
      .selectAll(`text`)
      .data(allData)
      .join((enter: any) => {
        enter.append("text")
          .attr('class', (d: any) => d.s)
          .attr("fill", (d: any) => dataSeries[d.s].dataTip.color != '' ? dataSeries[d.s].dataTip.color : 'red')
          .style('text-anchor', "middle")
          .style("transform", (d: any) => {
            let translateX = (that.xA(d.x) as number) + dataSeries[d.s].dataTip.offset[0];
            let translateY = 0;
            if (dataSeries[d.s].valueAxis == 'y') {
              translateY = that.yA(d.y);
            } else if (dataSeries[d.s].valueAxis == 'z') {
              translateY = that.zA(d.y);
            }
            return `translate(${translateX}px, ${translateY + dataSeries[d.s].dataTip.offset[1]}px)`;
          })
          .text((d: any) => `${d.y}${dataSeries[d.s].dataTip.suffix}`)
      }, (update: any) => {
        update.attr('class', (d: any) => d.s)
          .attr("fill", (d: any) => dataSeries[d.s].dataTip.color != '' ? dataSeries[d.s].dataTip.color : 'red')
          .style('text-anchor', "middle")
          .style("transform", (d: any) => {
            let translateX = (that.xA(d.x) as number) + dataSeries[d.s].dataTip.offset[0];
            let translateY = 0;
            if (dataSeries[d.s].valueAxis == 'y') {
              translateY = that.yA(d.y);
            } else if (dataSeries[d.s].valueAxis == 'z') {
              translateY = that.zA(d.y);
            }
            return `translate(${translateX}px, ${translateY + dataSeries[d.s].dataTip.offset[1]}px)`;
          })
          .text((d: any) => `${d.y}${dataSeries[d.s].dataTip.suffix}`)
      }, (exit: any) => exit.remove());

    plotkeys.forEach(element => {
      this.chartContainer.select('.graph').selectAll(`.${element}`).setFontStyle(dataSeries[element].dataTip.font);
    });
  }

  public update(data: any) {
    if (!data) return;
    this.defaultData = data;
    this.renderAxis();
    this.renderPlot();
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

export default ScatterPlotChart;
