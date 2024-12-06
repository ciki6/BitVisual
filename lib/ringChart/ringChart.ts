import * as d3 from "d3";
import "../base/d3Extend";
import "./ringChart.css";
import SVGComponentBase from "../base/svgComponentBase";
import type { ComponentProperty, PropertyDictionaryItem } from "lib/types/compProperty";
import OptionType from "../base/optionType";
import type { Pie, Arc, PieArcDatum } from "d3-shape";
import type { Selection, BaseType } from "d3-selection";
import type { Transition } from "d3-transition";

interface DataItem {
    name: string;
    value: number;
    color: string;
    percentage: number | string;
    index?: number;
}

type d3Data = BaseType & {
    __data__: PieArcDatum<DataItem>;
};

class RingChart extends SVGComponentBase {
    private width: number;
    private height: number;
    private textWidth: Record<string, number>;
    private pieContainer: Selection<SVGGElement, unknown, null, undefined> | null;
    private tooltip: any;
    private pie: Pie<any, DataItem> | null;
    private arc: Arc<any, PieArcDatum<DataItem>> | null;
    private arcHighlight: Arc<any, PieArcDatum<DataItem>> | null;
    private pieData: PieArcDatum<DataItem>[] | null;
    private centroid: Record<string, number[]>;
    private points: Record<string, number[]>;
    private hasChangeValue: Record<string, Record<"value" | "percentage", number | string>>;
    private hasChangeData: DataItem[];
    private hasChangeCentroid: Record<string, number[]>;
    private hasChangePoints: Record<string, number[]>;
    private hasChangeTextPoints: Record<string, number[]>;
    private hasChangeValuePoints: Record<string, number[]>;
    private topCentroid: Record<string, number[]>;
    private hasHiddenArcPath: Set<string>;
    private hasChangePieData: PieArcDatum<DataItem>[] | null;
    private intervalId: ReturnType<typeof setTimeout> | null;
    private currentIndex: number;
    private hoverArc: SVGGElement | null;
    private autoCarouselArc: SVGPathElement | null;
    private isFirstEnter: boolean;
    private canClick: boolean;
    private legend: Selection<HTMLDivElement, unknown, null, undefined> | null;
    private isInterfaceData: boolean;
    private ringGradient: Selection<SVGGElement, unknown, null, undefined> | null;
    private ring: Selection<SVGPathElement, PieArcDatum<DataItem>, SVGGElement, unknown> | null;

    constructor(
        id: string,
        code: string,
        container: Element,
        workMode: number,
        option: Object,
        useDefaultOpt: boolean
    ) {
        super(id, code, container, workMode, option, useDefaultOpt);
        this.pieContainer = null;
        this.tooltip = null;
        this.width = 0;
        this.height = 0;
        this.textWidth = {};
        this.pie = null;
        this.arc = null;
        this.arcHighlight = null;
        this.pieData = null;
        this.centroid = {};
        this.points = {};
        this.hasChangeValue = {};
        this.hasChangeData = [];
        this.hasChangeCentroid = {};
        this.hasChangePoints = {};
        this.hasChangeTextPoints = {};
        this.hasChangeValuePoints = {};
        this.hasChangePieData = [];
        this.topCentroid = {};
        this.hasHiddenArcPath = new Set();
        this.intervalId = null;
        this.currentIndex = 0;
        this.hoverArc = null;
        this.autoCarouselArc = null;
        this.isFirstEnter = true;
        this.canClick = true;
        this.isInterfaceData = true;
        this.legend = null;
        this.ringGradient = null;
        this.ring = null;
        this.draw();
    }

    protected setupDefaultValues() {
        super.setupDefaultValues();
        this.defaultData = [
            { name: "风电", value: 42 },
            { name: "光伏", value: 9 },
            { name: "火电", value: 21 },
            { name: "水电", value: 14 },
            { name: "核电", value: 14 },
        ] as DataItem[];
    }

    protected initProperty() {
        super.initProperty();
        const property: ComponentProperty = {
            basic: {
                className: "RingChart",
                frame: [0, 0, 1920, 1080],
            },
            global: {
                padding: [10, 10, 10, 10],
                bgImage: "",
                ringStyle: {
                    pieStyle: {
                        outerRadius: 350,
                        innerRadius: 240,
                        cornerRadius: 0,
                        padAngle: 0.02,
                        borderColor: "rgba(0,0,0,0)",
                        borderWidth: 1,
                        rotationAngle: 0,
                        anticlockwise: 0,
                        dataSort: "desc",
                    },
                    label: {
                        isShow: true,
                        style: {
                            font: {
                                family: "微软雅黑",
                                size: 40,
                                color: "white",
                            },
                            showlLabelType: "percentage", //percentage value
                            polylineColor: "white",
                            polylineWidth: 3,
                            polylineDistance: 80,
                            polylineDistance2: 100,
                            showName: false,
                            nameOffsetY: -10,
                            nameOffsetX: 0,
                            showValue: true,
                            valueOffsetY: -100,
                            valueOffsetX: 0,
                            precision: 1,
                        },
                    },
                    decorationStyle: {
                        isShow: true,
                        style: {
                            outerRadius: 220, //外半径
                            innerRadius: 200, //内半径
                            padAngle: 0.1, //饼图扇区之间的间隙角度
                            cornerRadius: 10, //圆角半径
                            rotationDirection: "1",
                            useGradientColors: true,
                            opacity: 0.9,
                            scrollSpeend: 3,
                        },
                    },
                    maskStyle: {
                        isShow: true,
                        style: {
                            percentage: 95,
                            opacity: 0.3,
                        },
                    },
                },
                legend: {
                    isShow: true,
                    style: {
                        font: {
                            family: "微软雅黑",
                            size: 45,
                            color: "white",
                        },
                        size: [40, 40],
                        type: "rect",
                        showValue: false,
                        showPercentage: false,
                        unit: "",
                    },
                    layout: {
                        position: [350, 1550], //top left
                        direction: "vertical", //horizontal vertical
                        rectGap: 25, //图例之间
                        itemGap: 40, //图例与文字之间
                    },
                },
            },
            series: {
                color: ["#09cfa7", "#2fbdfe", "#fef32c", "#e8734d", "#09eb48"],
            },
            prompt: {
                isShow: false,
                carousel: {
                    isShow: true,
                    durationTime: 1,
                },
                tooltip: {
                    background: {
                        backgroundImage: "",
                        backgroundColor: "white",
                        opacity: 0.9,
                        offset: [20, 20],
                    },
                    style: {
                        name: {
                            family: "微软雅黑",
                            size: 30,
                            color: "balck",
                        },
                        value: {
                            family: "微软雅黑",
                            size: 35,
                            color: "balck",
                        },
                        type: "circle",
                        size: [20, 20],
                        paddingLeft: 20,
                        unit: "",
                    },
                },
            },
            animation: {
                durationTime: 1,
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
                        name: "ringStyle",
                        displayName: "样式",
                        children: [
                            {
                                name: "pieStyle",
                                displayName: "环形图样式",
                                children: [
                                    {
                                        name: "outerRadius",
                                        displayName: "外半径",
                                        type: OptionType.int,
                                        unit: "px",
                                    },
                                    {
                                        name: "innerRadius",
                                        displayName: "内半径",
                                        type: OptionType.int,
                                        unit: "px",
                                    },
                                    {
                                        name: "padAngle",
                                        displayName: "间隙角度",
                                        type: OptionType.double,
                                        unit: "弧度",
                                    },
                                    {
                                        name: "cornerRadius",
                                        displayName: "圆角半径",
                                        type: OptionType.int,
                                        unit: "px",
                                    },
                                    {
                                        name: "borderColor",
                                        displayName: "边框颜色",
                                        type: OptionType.color,
                                    },
                                    {
                                        name: "borderWidth",
                                        displayName: "边框宽度",
                                        type: OptionType.double,
                                        unit: "px",
                                    },
                                    {
                                        name: "rotationAngle",
                                        displayName: "旋转角度",
                                        type: OptionType.range,
                                        unit: "度",
                                        options: {
                                            min: 0,
                                            max: 360,
                                        },
                                    },
                                    {
                                        name: "dataSort",
                                        displayName: "排列顺序",
                                        type: OptionType.select,
                                        options: [
                                            {
                                                name: "正序",
                                                value: "desc",
                                            },
                                            {
                                                name: "倒序",
                                                value: "asc",
                                            },
                                            {
                                                name: "默认",
                                                value: "default",
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                name: "label",
                                displayName: "标签",
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
                                                name: "polylineColor",
                                                displayName: "折线颜色",
                                                type: OptionType.color,
                                            },
                                            {
                                                name: "polylineWidth",
                                                displayName: "折线宽度",
                                                type: OptionType.double,
                                                unit: "px",
                                            },
                                            {
                                                name: "polylineDistance",
                                                displayName: "第一段折线长度",
                                                type: OptionType.double,
                                                unit: "px",
                                            },
                                            {
                                                name: "polylineDistance2",
                                                displayName: "第二段折线长度",
                                                type: OptionType.double,
                                                unit: "px",
                                            },
                                            {
                                                name: "showName",
                                                displayName: "展示类名",
                                                type: OptionType.boolean,
                                            },
                                            {
                                                name: "nameOffsetY",
                                                displayName: "类名Y轴偏移",
                                                type: OptionType.double,
                                                unit: "px",
                                            },
                                            {
                                                name: "nameOffsetX",
                                                displayName: "类名X轴偏移",
                                                type: OptionType.double,
                                                unit: "px",
                                            },
                                            {
                                                name: "showValue",
                                                displayName: "展示数值",
                                                type: OptionType.boolean,
                                            },
                                            {
                                                name: "showlLabelType",
                                                displayName: "数值类型",
                                                type: OptionType.radio,
                                                options: [
                                                    {
                                                        name: "百分比",
                                                        value: "percentage",
                                                    },
                                                    {
                                                        name: "数值",
                                                        value: "value",
                                                    },
                                                ],
                                            },

                                            {
                                                name: "valueOffsetY",
                                                displayName: "数值Y轴偏移",
                                                type: OptionType.double,
                                                unit: "px",
                                            },
                                            {
                                                name: "valueOffsetX",
                                                displayName: "数值X轴偏移",
                                                type: OptionType.double,
                                                unit: "px",
                                            },
                                            {
                                                name: "precision",
                                                displayName: "小数位数",
                                                type: OptionType.range,
                                                options: {
                                                    min: 0,
                                                    max: 5,
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                name: "decorationStyle",
                                displayName: "装饰物",
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
                                                name: "outerRadius",
                                                displayName: "外半径",
                                                type: OptionType.int,
                                                unit: "px",
                                            },
                                            {
                                                name: "innerRadius",
                                                displayName: "内半径",
                                                type: OptionType.int,
                                                unit: "px",
                                            },
                                            {
                                                name: "padAngle",
                                                displayName: "间隙角度",
                                                type: OptionType.double,
                                                unit: "弧度",
                                            },
                                            {
                                                name: "cornerRadius",
                                                displayName: "圆角半径",
                                                type: OptionType.int,
                                                unit: "px",
                                            },
                                            {
                                                name: "useGradientColors",
                                                displayName: "渐变色",
                                                type: OptionType.boolean,
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
                                                name: "rotationDirection",
                                                displayName: "旋转方向",
                                                type: OptionType.radio,
                                                options: [
                                                    {
                                                        name: "顺时针",
                                                        value: "1",
                                                    },
                                                    {
                                                        name: "逆时针",
                                                        value: "-1",
                                                    },
                                                ],
                                            },
                                            {
                                                name: "scrollSpeend",
                                                displayName: "旋转速度",
                                                type: OptionType.double,
                                                unit: "秒",
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                name: "maskStyle",
                                displayName: "遮罩物",
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
                                                name: "percentage",
                                                displayName: "占比",
                                                type: OptionType.range,
                                                options: {
                                                    min: 0,
                                                    max: 100,
                                                },
                                                unit: "%",
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
                                        ],
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
                                        name: "size",
                                        displayName: "大小",
                                        type: OptionType.doubleArray,
                                        placeholder: ["长", "宽"],
                                        unit: "px",
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
                                                name: "圆形",
                                                value: "circle",
                                            },
                                        ],
                                    },
                                    {
                                        name: "showValue",
                                        displayName: "显示数值",
                                        type: OptionType.boolean,
                                    },
                                    {
                                        name: "showPercentage",
                                        displayName: "显示百分比",
                                        type: OptionType.boolean,
                                    },
                                    {
                                        name: "unit",
                                        displayName: "后缀单位",
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
                                                value: "horizontal",
                                            },
                                            {
                                                name: "纵向",
                                                value: "vertical",
                                            },
                                        ],
                                    },
                                    {
                                        name: "rectGap",
                                        displayName: "图例间距",
                                        type: OptionType.double,
                                        unit: "px",
                                    },
                                    {
                                        name: "itemGap",
                                        displayName: "图例文字间距",
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
                name: "series",
                displayName: "系列",
                children: [
                    {
                        name: "color",
                        displayName: "数据颜色",
                        type: OptionType.colorList,
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
                                name: "durationTime",
                                displayName: "持续时间",
                                type: OptionType.int,
                                unit: "秒",
                            },
                        ],
                    },
                    {
                        name: "tooltip",
                        displayName: "悬浮框",
                        children: [
                            {
                                name: "background",
                                displayName: "背景",
                                children: [
                                    {
                                        name: "backgroundImage",
                                        displayName: "背景图片",
                                        type: OptionType.media,
                                    },
                                    {
                                        name: "backgroundColor",
                                        displayName: "背景色",
                                        type: OptionType.color,
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
                                        name: "offset",
                                        displayName: "偏移",
                                        type: OptionType.position,
                                    },
                                ],
                            },
                            {
                                name: "style",
                                displayName: "样式",
                                children: [
                                    {
                                        name: "name",
                                        displayName: "类别文字样式",
                                        type: OptionType.font,
                                    },
                                    {
                                        name: "value",
                                        displayName: "数值文字样式",
                                        type: OptionType.font,
                                    },
                                    {
                                        name: "type",
                                        displayName: "图例类型",
                                        type: OptionType.radio,
                                        options: [
                                            {
                                                name: "正方形",
                                                value: "rect",
                                            },
                                            {
                                                name: "圆形",
                                                value: "circle",
                                            },
                                        ],
                                    },
                                    {
                                        name: "size",
                                        displayName: "图例大小",
                                        type: OptionType.doubleArray,
                                        placeholder: ["长", "宽"],
                                        unit: "px",
                                    },
                                    {
                                        name: "paddingLeft",
                                        displayName: "显示间隔",
                                        type: OptionType.int,
                                        unit: "px",
                                    },
                                    {
                                        name: "unit",
                                        displayName: "后缀",
                                        type: OptionType.string,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        name: "animation",
                        displayName: "过度动画",
                        children: [
                            {
                                name: "durationTime",
                                displayName: "持续时间",
                                type: OptionType.int,
                                unit: "秒",
                            },
                        ],
                    },
                ],
            },
        ];
        this.addProperty(property, propertyDictionary);
    }

    protected draw() {
        super.draw();
        this.createSVGContainer();
        this.handleData(this.defaultData);
        this.createTooltip();
        this.generateArc();
        this.hoverAnimate();
        this.autoCarousel();
    }

    protected handlePropertyChange() {
        this.propertyManager.onPropertyChange((path: string, value: any) => {
            switch (path) {
                case "global.padding":
                    this.width = this.property.basic.frame[2] - value[2] - value[3];
                    this.height = this.property.basic.frame[3] - value[0] - value[1];
                    this.pieContainer!.attr(
                        "transform",
                        `translate(${this.width / 2}, ${this.height / 2})`
                    );
                    break;
            }
        });
    }

    private handleData(data: DataItem[], isChange = true) {
        this.generateRadialGradientColor();
        const sum = this.arraySum(data);
        data.map((d: DataItem, i: number) => {
            d.percentage = d3.format(`.${this.property.global.ringStyle.label.style.precision}f`)(
                (d.value / sum) * 100
            );
            d.index = i;
            d.color = this.property.series.color[i];
            if (isChange) {
                this.hasChangeValue[d.name] = {
                    value: d.value,
                    percentage: d.percentage,
                };
            }
        });
        this.hasChangeData = JSON.parse(JSON.stringify(data));
        data.map((d: DataItem) => {
            this.textWidth[d.name] = this.getTrueWidth(d.name);
        });
        return data;
    }

    private generateRadialGradientColor() {
        if (this.pieContainer!.select(".radialGradient")) {
            this.pieContainer!.select(".radialGradient").remove();
        }
        const defs = this.pieContainer!.append("defs").attr("class", "radialGradient");
        this.property.series.color.forEach((d: string) => {
            const gradient = defs
                .append("radialGradient")
                .attr("id", `gradient-${d}`)
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", this.property.global.ringStyle.pieStyle.outerRadius);

            gradient
                .append("stop")
                .attr("offset", "0%")
                .attr("stop-color", d)
                .attr("stop-opacity", this.property.global.ringStyle.maskStyle.style.opacity);

            gradient
                .append("stop")
                .attr("offset", `${this.property.global.ringStyle.maskStyle.style.percentage}%`)
                .attr("stop-color", d)
                .attr("stop-opacity", this.property.global.ringStyle.maskStyle.style.opacity);

            gradient
                .append("stop")
                .attr(
                    "offset",
                    `${this.property.global.ringStyle.maskStyle.style.percentage + 0.1}%`
                )
                .attr("stop-color", d)
                .attr("stop-opacity", 1);

            gradient
                .append("stop")
                .attr("offset", "100%")
                .attr("stop-color", d)
                .attr("stop-opacity", 1);
        });
    }

    private createSVGContainer() {
        this.width =
            this.property.basic.frame[2] -
            this.property.global.padding[2] -
            this.property.global.padding[3];
        this.height =
            this.property.basic.frame[3] -
            this.property.global.padding[0] -
            this.property.global.padding[1];

        this.pieContainer = this.mainSVG
            .append("g")
            .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);

        if (this.property.global.bgImage !== "") {
            this.pieContainer!.append("image")
                .attr("x", this.width / 2)
                .attr("y", this.height / 2)
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("xlink:href", this.property.global.bgImage)
                .attr("preserveAspectRatio", "none");
        }

        this.ringGradient = this.pieContainer!.append("g").attr("class", "ring-gradient");
    }

    private createTooltip() {
        d3.select(".ring-chart-tooltip").remove();
        this.tooltip = d3
            .select(this.mainSVG.node().parentNode)
            .append("div")
            .attr("class", "ring-chart-tooltip")
            .style(
                "background",
                this.property.prompt.tooltip.background.backgroundImage == ""
                    ? ""
                    : `url(${this.property.prompt.tooltip.background.backgroundImage}) center/100% 100% no-repeat`
            )
            .style("background-color", this.property.prompt.tooltip.background.backgroundColor);

        this.pieContainer!.append("defs")
            .append("filter")
            .attr("id", "ring-filter")
            .attr("x", "-100%")
            .attr("y", "-100%")
            .attr("width", "300%")
            .attr("height", "300%")
            .append("feDropShadow")
            .attr("dx", "0")
            .attr("dy", "0")
            .attr("stdDeviation", "5 5")
            .attr("flood-color", "rgb(0,0,0)")
            .attr("flood-opacity", "0.5");
    }

    private generateArc() {
        const radians = (Math.PI / 180) * this.property.global.ringStyle.pieStyle.rotationAngle;
        this.pie = d3
            .pie<any, DataItem>()
            .value((d) => d.value)
            .sort(null)
            .startAngle(0 + radians)
            .endAngle(Math.PI * 2 + radians)
            .padAngle(this.property.global.ringStyle.pieStyle.padAngle);
        // .padAngle(0);

        this.arcHighlight = d3
            .arc<any, PieArcDatum<DataItem>>()
            .innerRadius(this.property.global.ringStyle.pieStyle.innerRadius)
            .outerRadius(this.property.global.ringStyle.pieStyle.outerRadius * 1.1)
            .cornerRadius(this.property.global.ringStyle.pieStyle.cornerRadius);
        this.arc = d3
            .arc<any, PieArcDatum<DataItem>>()
            .innerRadius(this.property.global.ringStyle.pieStyle.innerRadius)
            .outerRadius(this.property.global.ringStyle.pieStyle.outerRadius)
            .cornerRadius(this.property.global.ringStyle.pieStyle.cornerRadius);

        this.pieData = this.pie(this.defaultData);

        this.pieContainer!.append("g").attr("class", "path-group");

        this.update(this.pieData);
    }

    private animatePolyline = (data: PieArcDatum<DataItem>, _: number, isChange = false) => {
        const { name } = data.data;
        const [centerX, centerY, centerZ] = isChange
            ? this.hasChangeCentroid[name]
            : this.centroid[name];
        const offsetX = this.property.global.ringStyle.label.style.polylineDistance2;
        const [cos, sin, arcEdgeX, arcEdgeY] = this.getAecEdgePoints(centerX, centerY, centerZ);
        const [pointX, pointY] = this.points[name]; //折点
        if (isChange) {
            const from = [pointX, pointY, ...this.topCentroid[name]];
            const to = [...this.hasChangePoints[name], arcEdgeX, arcEdgeY];
            const interpolate = d3.interpolate(from, to);
            this.topCentroid[name] = [arcEdgeX, arcEdgeY];
            this.points[name] = this.hasChangePoints[name];
            if (centerX >= 0) {
                return (t: number) => {
                    const [x, y, arcEdgeX, arcEdgeY] = interpolate(t);
                    return `${arcEdgeX},${arcEdgeY} ${x},${y}, ${x + offsetX * 1},${y}`;
                };
            }
            return (t: number) => {
                const [x, y, arcEdgeX, arcEdgeY] = interpolate(t);
                return `${arcEdgeX},${arcEdgeY} ${x},${y}, ${x - offsetX * 1},${y}`;
            };
        } else {
            this.topCentroid[name] = [arcEdgeX, arcEdgeY]; //圆边上点坐标
            if (centerX >= 0) {
                return (t: number) => {
                    const x = arcEdgeX + (pointX - arcEdgeX) * t;
                    const y = arcEdgeY + (pointY - arcEdgeY) * t;
                    return `${arcEdgeX},${arcEdgeY} ${x},${y}, ${x + offsetX * t},${y}`;
                };
            }
            return (t: number) => {
                const x = arcEdgeX + (pointX - arcEdgeX) * t;
                const y = arcEdgeY + (pointY - arcEdgeY) * t;
                return `${arcEdgeX},${arcEdgeY} ${x},${y}, ${x - offsetX * t},${y}`;
            };
        }
    };

    private animateText(
        selection: Transition<SVGTextElement, PieArcDatum<DataItem>, BaseType, unknown>,
        isChange = false
    ) {
        const that = this;
        selection
            .attrTween("x", function (d: PieArcDatum<DataItem>) {
                const { name } = d.data;
                const offsetX = that.property.global.ringStyle.label.style.nameOffsetX;
                if (isChange) {
                    const from = that.hasChangeTextPoints[name];
                    const to = that.hasChangePoints[name];
                    const interpolate = d3.interpolate(from[0], to[0]);
                    if (to[0] > 0) {
                        d3.select(this).attr("text-anchor", "start");
                        return (t: number) => {
                            that.hasChangeTextPoints[name][0] = to[0] + offsetX;
                            return (interpolate(t) + offsetX * t) as unknown as string;
                        };
                    }
                    d3.select(this).attr("text-anchor", "end");
                    return (t: number) => {
                        that.hasChangeTextPoints[name][0] = to[0] - offsetX;
                        return (interpolate(t) - offsetX * t) as unknown as string;
                    };
                } else {
                    const [x] = that.points[name];
                    if (x > 0) {
                        d3.select(this).attr("text-anchor", "start");
                        that.hasChangeTextPoints[name][0] = x + offsetX;
                        return (t: number) => ((x + offsetX) * t) as unknown as string;
                    }
                    d3.select(this).attr("text-anchor", "end");
                    that.hasChangeTextPoints[name][0] = x - offsetX;
                    return (t: number) => ((x - offsetX) * t) as unknown as string;
                }
            })
            .attrTween("y", ((d: PieArcDatum<DataItem>) => {
                const { name } = d.data;
                if (isChange) {
                    const from = this.hasChangeTextPoints[name];
                    const to = this.hasChangePoints[name];
                    const interpolate = d3.interpolate(from[1], to[1]);
                    this.hasChangeTextPoints[name][1] =
                        to[1] + this.property.global.ringStyle.label.style.nameOffsetY;
                    return (t: number) =>
                        interpolate(t) + this.property.global.ringStyle.label.style.nameOffsetY * t;
                } else {
                    const [_, y] = this.points[name];
                    this.hasChangeTextPoints[name][1] =
                        y + this.property.global.ringStyle.label.style.nameOffsetY;
                    return (t: number) =>
                        (y + this.property.global.ringStyle.label.style.nameOffsetY) * t;
                }
            }) as any);
    }

    private animateValue(
        selection: Transition<SVGTextElement, PieArcDatum<DataItem>, BaseType, unknown>,
        isChange = false
    ) {
        if (isChange) {
            const that = this;
            selection
                .attrTween("x", function (d: PieArcDatum<DataItem>) {
                    const { name } = d.data;
                    const offsetX = that.property.global.ringStyle.label.style.valueOffsetX;
                    const from = that.hasChangeValuePoints[name];
                    const to = that.hasChangePoints[name];
                    const interpolate = d3.interpolate(from[0], to[0]);

                    if (to[0] > 0) {
                        d3.select(this).attr("text-anchor", "start");
                        return (t: number) => {
                            that.hasChangeValuePoints[name][0] = to[0] - offsetX;
                            return (interpolate(t) - offsetX * t) as unknown as string;
                        };
                    }
                    d3.select(this).attr("text-anchor", "end");
                    return (t: number) => {
                        that.hasChangeValuePoints[name][0] = to[0] + offsetX;
                        return (interpolate(t) + offsetX * t) as unknown as string;
                    };
                })
                .attrTween("y", ((d: PieArcDatum<DataItem>) => {
                    const { name } = d.data;
                    const from = this.hasChangeValuePoints[name];
                    const to = this.hasChangePoints[name];
                    const interpolate = d3.interpolate(from[1], to[1]);
                    this.hasChangeValuePoints[name][1] =
                        to[1] +
                        this.property.global.ringStyle.label.style.font.size +
                        this.property.global.ringStyle.label.style.valueOffsetY / 2;
                    return (t: number) =>
                        interpolate(t) +
                        this.property.global.ringStyle.label.style.font.size * t +
                        (this.property.global.ringStyle.label.style.valueOffsetY / 2) * t;
                }) as any);
        } else {
            const that = this;
            selection
                .attr("x", function (d: PieArcDatum<DataItem>) {
                    const { name } = d.data;
                    const [x] = that.points[name];
                    const offsetX = that.property.global.ringStyle.label.style.valueOffsetX;
                    if (x > 0) {
                        d3.select(this).attr("text-anchor", "start");
                        that.hasChangeValuePoints[name][0] = x - offsetX;
                        return x - offsetX;
                    }
                    d3.select(this).attr("text-anchor", "end");
                    that.hasChangeValuePoints[name][0] = x + offsetX;
                    return x + offsetX;
                })
                .attr("y", ((d: PieArcDatum<DataItem>) => {
                    const { name } = d.data;
                    const [_, y] = this.points[name];
                    this.hasChangeValuePoints[name][1] =
                        y +
                        this.property.global.ringStyle.label.style.font.size +
                        this.property.global.ringStyle.label.style.valueOffsetY / 2;
                    return (
                        y +
                        this.property.global.ringStyle.label.style.font.size +
                        this.property.global.ringStyle.label.style.valueOffsetY / 2
                    );
                }) as any);
        }

        selection.textTween(((d: PieArcDatum<DataItem>) => {
            const { name } = d.data;
            let interpolate: (t: number) => number;

            if (!this.hasChangeValue[name]) {
                this.hasChangeValue[name] = {
                    percentage: 0,
                    value: 0,
                };
            }

            if (this.property.global.ringStyle.label.style.showlLabelType == "percentage") {
                const from = isChange ? (this.hasChangeValue[name].percentage as number) : 0;
                interpolate = d3.interpolateNumber(from, d.data.percentage as number);
                this.hasChangeValue[name].percentage = d.data.percentage!;
                return (t: number) => {
                    return (
                        d3.format(`.${this.property.global.ringStyle.label.style.precision}f`)(
                            interpolate(t)
                        ) + "%"
                    );
                };
            } else {
                const from = isChange ? (this.hasChangeValue[name].value as number) : 0;
                interpolate = d3.interpolateNumber(from, d.data.value);
                this.hasChangeValue[name].value = d.data.value;
                return (t: number) =>
                    d3.format(`.${this.property.global.ringStyle.label.style.precision}f`)(
                        interpolate(t)
                    );
            }
        }) as any);
    }

    private generateLegend(data = this.pieData) {
        this.legend && this.legend.remove();
        this.legend = d3
            .select(this.mainSVG.node().parentNode)
            .append("div")
            .attr("class", "ring-chart-legend")
            .style("position", "absolute")
            .style("top", `${this.property.global.legend.layout.position[0]}px`)
            .style("left", `${this.property.global.legend.layout.position[1]}px`)
            .style(
                "width",
                this.property.global.legend.layout.direction == "horizontal"
                    ? `calc(100% - ${this.property.global.legend.layout.position[1]}px)`
                    : "auto"
            )
            .style(
                "height",
                this.property.global.legend.layout.direction == "vertical"
                    ? `calc(100% - ${this.property.global.legend.layout.position[0]}px)`
                    : "auto"
            )
            .style("display", "flex")
            .style("flex-direction", "column")
            .style(
                "flex-direction",
                this.property.global.legend.layout.direction == "vertical" ? "column" : "row"
            )
            .style("flex-wrap", "wrap")
            .style("gap", `${this.property.global.legend.layout.rectGap}px`);

        const legendItems = this.legend.selectAll(".legend-item").data(data!).enter();

        const item = legendItems
            .append("div")
            .attr("class", "legend-item")
            .style("display", "flex")
            .style("align-items", "center")
            .style("justify-content", "start")
            .style("gap", `${this.property.global.legend.layout.itemGap}px`);

        item.append("div")
            .attr("class", "legend-mark")
            .attr("data-name", (d) => d.data.name)
            .style("width", this.property.global.legend.style.size[0] + "px")
            .style("height", this.property.global.legend.style.size[1] + "px")
            .style("border-radius", this.property.global.legend.style.type == "rect" ? "0%" : "50%")
            .style("cursor", "pointer")
            .style("background-color", (d) => d.data.color);

        item.append("div")
            .attr("class", "legend-name")
            .style("user-select", "none")
            .style("color", this.property.global.legend.style.font.color)
            .style("font-size", this.property.global.legend.style.font.size + "px")
            .text((d) => this.computedValue(d.data));

        this.registerLegendEvent();
    }

    private registerLegendEvent() {
        this.legend!.selectAll(".legend-mark")
            .on("click", (d) => {
                if (!this.canClick) return;
                this.isInterfaceData = false;
                const target = d.target;
                const data = target.__data__.data;
                const index = this.hasChangeData.findIndex((e) => e.name === data.name);
                if (index !== -1) {
                    target.style.backgroundColor = "#ccc";
                    this.hasChangeData.splice(index, 1);
                    this.hasHiddenArcPath.add(data.name);
                } else {
                    target.style.backgroundColor = data.color;
                    const i = this.hasChangeData.findIndex((e) => e.index! > target.__data__.index);
                    if (i == -1) {
                        this.hasChangeData.push(data);
                    } else {
                        this.hasChangeData.splice(i, 0, data);
                    }
                    this.hasHiddenArcPath.delete(data.name);
                }

                const sum = this.arraySum(this.hasChangeData);

                this.hasChangeData.map((v) => {
                    v.percentage =
                        Math.round(
                            (v.value / sum) *
                                100 *
                                Math.pow(10, this.property.global.ringStyle.label.style.precision)
                        ) / Math.pow(10, this.property.global.ringStyle.label.style.precision);
                });

                this.hasChangePieData = this.pie!(this.hasChangeData);
                this.update(this.hasChangePieData);
                this.isInterfaceData = true;
            })
            .on("mouseenter", (d) => {
                this.intervalId && clearInterval(this.intervalId);
                this.intervalId = null;
                if (!this.canClick) return;
                const target = d.target;
                const data = target.__data__.data;
                const that = this;
                this.hoverArc = null;
                this.tooltip.transition().duration(200).style("opacity", 0);
                this.pieContainer!.select(".path-group")
                    .selectAll(".arc-path")
                    .each(function () {
                        if (
                            (this as d3Data).__data__.data.name === data.name &&
                            !that.hasHiddenArcPath.has(data.name)
                        ) {
                            that.hoverArc = this as SVGGElement;
                            d3.select(this)
                                .style("cursor", "pointer")
                                .transition()
                                .duration(200)
                                .attr("d", that.arcHighlight as any)
                                .attr("filter", "url(#ring-filter)");
                        }
                    });
            })
            .on("mouseout", () => {
                if (!this.canClick) return;
                d3.select(this.hoverArc)
                    .transition()
                    .duration(200)
                    .attr("d", this.arc as any)
                    .attr("filter", "");
                this.autoCarousel();
            });
    }

    private hoverAnimate() {
        this.pieContainer!.select(".path-group")
            .on("mousemove", (event: PointerEvent) => {
                const target = event.target as SVGPathElement;
                if (!this.canClick) return;
                if (target!.tagName !== "path") return;

                const { color, name, value } = (target as unknown as d3Data).__data__.data;

                d3.select(target)
                    .style("cursor", "pointer")
                    .transition()
                    .duration(200)
                    .attr("d", this.arcHighlight as any)
                    .attr("filter", "url(#ring-filter)");

                this.tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", this.property.prompt.tooltip.background.opacity)
                    .style("border-color", color);
                this.tooltip
                    .html(
                        `<div style="display:flex;align-items: center;justify-content: center;">
                            <span style="display:inline-block;margin-right:8px;border-radius:${
                                this.property.prompt.tooltip.style.type == "circle" ? "50%" : "0%"
                            };width:${this.property.prompt.tooltip.style.size[0]}px;height:${
                            this.property.prompt.tooltip.style.size[1]
                        }px;background-color:${color};"></span>
                            <span style="font-size:${
                                this.property.prompt.tooltip.style.name.size
                            }px;color:${
                            this.property.prompt.tooltip.style.name.color
                        }">${name}</span>
                            <span style="padding-left:${
                                this.property.prompt.tooltip.style.paddingLeft
                            }px;font-size:${
                            this.property.prompt.tooltip.style.value.size
                        }px;color:${this.property.prompt.tooltip.style.value.color}">${value}</span>
                        <span style="font-size:${
                            this.property.prompt.tooltip.style.value.size
                        }px;color:${this.property.prompt.tooltip.style.value.color}">${
                            this.property.prompt.tooltip.style.unit
                        }</span>
                            </div>`
                    )
                    .style(
                        "left",
                        event.offsetX + this.property.prompt.tooltip.background.offset[0] + "px"
                    )
                    .style(
                        "top",
                        event.offsetY + this.property.prompt.tooltip.background.offset[1] + "px"
                    );

                this.intervalId && clearInterval(this.intervalId);
                this.intervalId = null;
            })
            .on("mouseout", (event: PointerEvent) => {
                if (!this.canClick) return;
                if ((event.target as SVGPathElement)!.tagName !== "path") return;
                d3.select(event.target as SVGPathElement)
                    .transition()
                    .duration(200)
                    .attr("d", this.arc as any)
                    .attr("filter", "");
                this.tooltip.transition().duration(200).style("opacity", 0);
                this.autoCarousel();
            });
    }

    private autoCarousel() {
        if (
            this.property.prompt.isShow &&
            this.property.prompt.carousel.isShow &&
            this.hasHiddenArcPath.size === 0
        ) {
            this.intervalId && clearInterval(this.intervalId);
            this.currentIndex = 0;
            this.intervalId = setInterval(() => {
                const d = this.pieData![this.currentIndex];
                const centroid = this.arc!.centroid(d);
                const x = centroid[0] + this.width / 2;
                const y = centroid[1] + this.height / 2;

                const that = this;
                this.pieContainer?.selectAll(".arc-path").each(function () {
                    if ((this as SVGPathElement).dataset.name === d.data.name) {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .attr("d", that.arcHighlight as any)
                            .attr("filter", "url(#ring-filter)");

                        d3.select(that.autoCarouselArc)
                            .transition()
                            .duration(200)
                            .attr("d", that.arc as any)
                            .attr("filter", "");

                        that.autoCarouselArc = this as SVGPathElement;
                    }
                });

                this.tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", this.property.prompt.tooltip.background.opacity)
                    .style("border-color", d.data.color);
                this.tooltip
                    .html(
                        `<div style="display:flex;align-items: center;justify-content: center;">
                            <span style="display:inline-block;margin-right:8px;border-radius:${
                                this.property.prompt.tooltip.style.type == "circle" ? "50%" : "0%"
                            };width:${this.property.prompt.tooltip.style.size[0]}px;height:${
                            this.property.prompt.tooltip.style.size[1]
                        }px;background-color:${d.data.color};"></span>
                            <span style="font-size:${
                                this.property.prompt.tooltip.style.name.size
                            }px;color:${this.property.prompt.tooltip.style.name.color}">${
                            d.data.name
                        }</span>
                            <span style="padding-left:${
                                this.property.prompt.tooltip.style.paddingLeft
                            }px;font-size:${
                            this.property.prompt.tooltip.style.value.size
                        }px;color:${this.property.prompt.tooltip.style.value.color}">${
                            d.data.value
                        }</span>
                            <span style="font-size:${
                                this.property.prompt.tooltip.style.value.size
                            }px;color:${this.property.prompt.tooltip.style.value.color}">${
                            this.property.prompt.tooltip.style.unit
                        }</span>
                            </div>`
                    )
                    .style("left", x + this.property.prompt.tooltip.background.offset[0] + "px")
                    .style("top", y + this.property.prompt.tooltip.background.offset[1] + "px");

                this.currentIndex = (this.currentIndex + 1) % this.pieData!.length;
            }, this.property.prompt.carousel.durationTime * 1000);
        }
    }

    private generateRotateRing(data = this.pieData) {
        d3.select(".rotate-ring-group").remove();
        d3.select(".ring-gradient").html("");
        const arc = d3
            .arc<any, PieArcDatum<DataItem>>()
            .innerRadius(this.property.global.ringStyle.decorationStyle.style.innerRadius)
            .outerRadius(this.property.global.ringStyle.decorationStyle.style.outerRadius)
            .cornerRadius(this.property.global.ringStyle.decorationStyle.style.cornerRadius)
            .padAngle(this.property.global.ringStyle.decorationStyle.style.padAngle);

        this.ring = this.pieContainer!.append("g")
            .attr("class", "rotate-ring-group")
            .selectAll("path")
            .data(data!)
            .enter()
            .append("g")
            .attr("class", "ring-group")
            .attr("data-name", (d) => d.data.name)
            .attr("data-index", (d) => d.index)
            .append("path")
            .attr("class", "ring-path")
            .attr("d", arc)
            .attr("fill", (d) => {
                return this.property.global.ringStyle.decorationStyle.style.useGradientColors
                    ? `url(#${this.creatGradientColor(d.data.name, d.data.color)})`
                    : d.data.color;
            })
            .attr("opacity", this.property.global.ringStyle.decorationStyle.style.opacity);

        let that = this;
        this.ring
            .transition()
            .duration(this.property.global.ringStyle.decorationStyle.style.scrollSpeend * 1000)
            .ease(d3.easeLinear)
            .on("start", function repeat() {
                d3.active(this)!
                    .attrTween("transform", () => {
                        return (t) =>
                            `rotate(${
                                t *
                                360 *
                                that.property.global.ringStyle.decorationStyle.style
                                    .rotationDirection
                            }, 0, 0)`;
                    })
                    .transition()
                    .on("start", repeat);
            });
    }

    public update(data: PieArcDatum<DataItem>[] | DataItem[]) {
        this.intervalId && clearInterval(this.intervalId);
        this.intervalId = null;

        this.tooltip.transition().duration(200).style("opacity", 0);

        let pieData: PieArcDatum<DataItem>[];

        if (data[0]?.hasOwnProperty("startAngle") || data.length === 0) {
            pieData = data as PieArcDatum<DataItem>[];
        } else {
            const newPieData = this.pie!(this.handleData(data as DataItem[], false));
            pieData = newPieData;
        }

        this.pieContainer!.select(".path-group")
            .selectAll(".arc-path")
            .data<PieArcDatum<DataItem>>(pieData, (d: any) => d.data.name)
            .join(
                (enter) => {
                    enter
                        .append("path")
                        .attr("class", "arc-path")
                        .attr("d", this.arc)
                        .attr("stroke", this.property.global.ringStyle.pieStyle.borderColor)
                        .attr("data-name", (d) => d.data.name)
                        .style(
                            "stroke-width",
                            `${this.property.global.ringStyle.pieStyle.borderWidth}px`
                        )
                        .attr("fill", (d) =>
                            this.property.global.ringStyle.maskStyle.isShow
                                ? `url(#gradient-${d.data.color})`
                                : d.data.color
                        )
                        .transition()
                        .duration(this.property.animation.durationTime * 1000)
                        .attrTween("d", (d: PieArcDatum<DataItem>) => {
                            const interpolate = d3.interpolate(d.endAngle, d.startAngle);
                            return (t: number) => {
                                d.startAngle = interpolate(t);
                                return this.arc!(d) as string;
                            };
                        })
                        .end()
                        .then(() => {
                            this.canClick = true;
                        });
                },
                (update) => {
                    update
                        .each((d) => {
                            this.getPoints(d, true);
                        })
                        .attr("fill", (d) =>
                            this.property.global.ringStyle.maskStyle.isShow
                                ? `url(#gradient-${d.data.color})`
                                : d.data.color
                        )
                        .attr("stroke", this.property.global.ringStyle.pieStyle.borderColor)
                        .style(
                            "stroke-width",
                            `${this.property.global.ringStyle.pieStyle.borderWidth}px`
                        )
                        .transition()
                        .duration(this.property.animation.durationTime * 1000)
                        .attrTween("d", (d: PieArcDatum<DataItem>) => {
                            this.canClick = false;
                            const name = d.data.name;
                            const from = this.pieData!.find((d) => d.data.name === name);
                            const to = d;

                            const interpolate = d3.interpolate(
                                {
                                    startAngle: from!.startAngle,
                                    endAngle: from!.endAngle,
                                },
                                {
                                    startAngle: to.startAngle,
                                    endAngle: to.endAngle,
                                }
                            );
                            return (t) => {
                                d.startAngle = interpolate(t).startAngle;
                                d.endAngle = interpolate(t).endAngle;
                                return this.arc!(d) as string;
                            };
                        })
                        .end()
                        .then(() => {
                            this.pieData = pieData;
                            if (this.isFirstEnter) {
                                this.canClick = false;
                                this.isFirstEnter = false;
                            } else {
                                this.canClick = true;
                            }
                        })
                        .catch(() => {});
                },
                (exit) => {
                    exit.transition()
                        .duration(this.property.animation.durationTime * 1000)
                        .attrTween("d", (d: PieArcDatum<DataItem>) => {
                            const interpolate = d3.interpolate(d.startAngle, d.endAngle);
                            return (t) => {
                                d.startAngle = interpolate(t);
                                return this.arc!(d) as string;
                            };
                        })
                        .remove();
                }
            );

        if (this.property.global.ringStyle.label.isShow) {
            this.pieContainer!.select(".path-group")
                .selectAll(".arc-polyline")
                .data<PieArcDatum<DataItem>>(pieData, (d: any) => d.data.name)
                .join(
                    (enter) => {
                        enter
                            .append("polyline")
                            .attr("class", "arc-polyline")
                            .attr(
                                "stroke-width",
                                this.property.global.ringStyle.label.style.polylineWidth
                            )
                            .attr(
                                "stroke",
                                this.property.global.ringStyle.label.style.polylineColor
                            )
                            .attr("fill", "none")
                            .each((d) => {
                                this.getPoints(d);
                            })
                            .transition()
                            .duration(this.property.animation.durationTime * 1000)
                            .attrTween("points", (d, i) => this.animatePolyline(d, i));
                    },
                    (update) => {
                        update
                            .transition()
                            .duration(this.property.animation.durationTime * 1000)
                            .attrTween("points", (d, i) => this.animatePolyline(d, i, true));
                    },
                    (exit) => {
                        exit.transition()
                            .duration(this.property.animation.durationTime * 1000)
                            .style("opacity", 0)
                            .remove();
                    }
                );

            if (this.property.global.ringStyle.label.style.showName) {
                this.pieContainer!.select(".path-group")
                    .selectAll(".arc-text")
                    .data<PieArcDatum<DataItem>>(pieData, (d: any) => d.data.name)
                    .join(
                        (enter) => {
                            enter
                                .append("text")
                                .attr("class", "arc-text")
                                .setFontStyle(this.property.global.ringStyle.label.style.font)
                                .style("opacity", 0)
                                .transition()
                                .duration(this.property.animation.durationTime * 1000)
                                .call((selection) => this.animateText(selection))
                                .style("opacity", 1)
                                .attr("fill", this.property.global.ringStyle.label.style.font.color)
                                .text((d: any) => d.data.name);
                        },
                        (update) => {
                            update
                                .transition()
                                .duration(this.property.animation.durationTime * 1000)
                                .call((selection: any) => this.animateText(selection, true));
                        },
                        (exit) => {
                            exit.transition()
                                .duration(this.property.animation.durationTime * 1000)
                                .style("opacity", 0)
                                .remove();
                        }
                    );
            }

            if (this.property.global.ringStyle.label.style.showValue) {
                this.pieContainer!.select(".path-group")
                    .selectAll(".arc-value")
                    .data<PieArcDatum<DataItem>>(pieData, (d: any) => d.data.name)
                    .join(
                        (enter) => {
                            enter
                                .append("text")
                                .attr("class", "arc-value")
                                .setFontStyle(this.property.global.ringStyle.label.style.font)
                                .style("opacity", 0)
                                .transition()
                                .duration(this.property.animation.durationTime * 1000)
                                .call((selection) => this.animateValue(selection))
                                .style("opacity", 1);
                        },
                        (update) => {
                            update
                                .transition()
                                .duration(this.property.animation.durationTime * 1000)
                                .call((selection: any) => this.animateValue(selection, true));
                        },
                        (exit) => {
                            exit.transition()
                                .duration(this.property.animation.durationTime * 1000)
                                .style("opacity", 0)
                                .remove();
                        }
                    );
            }
        }
        if (this.property.global.legend.isShow && this.isInterfaceData) {
            this.hasHiddenArcPath.clear();
            this.generateLegend(pieData);
            if (this.property.global.ringStyle.decorationStyle.isShow) {
                this.generateRotateRing(pieData);
            }
        }
        this.autoCarouselArc = null;
        this.autoCarousel();
    }

    private arraySum(array: DataItem[]) {
        return array.reduce((acc, cur) => acc + cur.value, 0);
    }

    private getTrueWidth(text: string) {
        this.mainSVG
            .append("text")
            .attr("class", "temp-text")
            .style("font-size", `${this.property.global.ringStyle.label.style.font.size}px`)
            .style("opacity", 0)
            .text(text);
        const textTrueWidth = this.mainSVG.select(".temp-text").node().getBBox().width;
        this.mainSVG.select(".temp-text").remove();
        return textTrueWidth + 20;
    }

    private getPoints(d: PieArcDatum<DataItem>, isChange = false) {
        const centerX = this.arc!.centroid(d)[0];
        const centerY = this.arc!.centroid(d)[1];
        const centerZ = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
        const [X, Y] = this.getAxis(
            centerX,
            centerY,
            centerZ,
            this.property.global.ringStyle.pieStyle.outerRadius +
                this.property.global.ringStyle.label.style.polylineDistance
        );

        if (isChange) {
            this.hasChangeCentroid[d.data.name] = [centerX, centerY, centerZ];
            this.hasChangePoints[d.data.name] = [X, Y];
        } else {
            this.centroid[d.data.name] = [centerX, centerY, centerZ];
            this.points[d.data.name] = [X, Y]; //折点坐标
            this.hasChangeTextPoints[d.data.name] = [];
            this.hasChangeValuePoints[d.data.name] = [];
        }
    }

    private getAxis(centerX: number, centerY: number, centerZ: number, distance: number) {
        // 一、四象限
        if (centerY <= 0) {
            const cos = Math.abs(centerX / centerZ);
            const sin = Math.abs(centerY / centerZ);
            const x = centerX >= 0 ? cos * distance : -cos * distance;
            const y = -sin * distance;
            return [x, y];
        }
        // 二、三象限
        const cos = Math.abs(centerY / centerZ);
        const sin = Math.abs(centerX / centerZ);
        const x = centerX > 0 ? sin * distance : -sin * distance;
        const y = cos * distance;
        return [x, y];
    }

    private getAecEdgePoints(centerX: number, centerY: number, centerZ: number) {
        let cos = 0;
        let sin = 0;
        let arcEdgeX = 0;
        let arcEdgeY = 0;
        if (centerY <= 0) {
            cos = Math.abs(centerX / centerZ);
            sin = Math.abs(centerY / centerZ);
            arcEdgeX =
                centerX >= 0
                    ? cos * this.property.global.ringStyle.pieStyle.outerRadius
                    : -cos * this.property.global.ringStyle.pieStyle.outerRadius;
            arcEdgeY = -sin * this.property.global.ringStyle.pieStyle.outerRadius;
        } else {
            cos = Math.abs(centerY / centerZ);
            sin = Math.abs(centerX / centerZ);
            arcEdgeX =
                centerX > 0
                    ? sin * this.property.global.ringStyle.pieStyle.outerRadius
                    : -sin * this.property.global.ringStyle.pieStyle.outerRadius;
            arcEdgeY = cos * this.property.global.ringStyle.pieStyle.outerRadius;
        }
        return [cos, sin, arcEdgeX, arcEdgeY];
    }

    private computedValue(data: DataItem) {
        let name = data.name;
        if (this.property.global.legend.style.showValue) {
            name = name + " " + data.value + " " + this.property.global.legend.style.unit;
        }
        if (this.property.global.legend.style.showPercentage) {
            name = name + " " + data.percentage + " " + this.property.global.legend.style.unit;
        }
        return name;
    }

    private creatGradientColor(name: string, color: string) {
        const colorId = name + "ringGradient";
        const gradient = this.ringGradient!.append("defs")
            .append("linearGradient")
            .attr("id", colorId)
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

        gradient
            .append("stop")
            .attr("offset", "0%")
            .attr("stop-color", color)
            .attr("stop-opacity", this.property.global.ringStyle.decorationStyle.style.opacity);

        gradient
            .append("stop")
            .attr("offset", "100%")
            .attr("stop-color", color)
            .attr("stop-opacity", 0);

        return colorId;
    }
}

export default RingChart;
