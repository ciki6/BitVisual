import * as d3 from "d3";
import "../base/d3Extend";
import "./pieChart.css";
import SVGComponentBase from "../base/svgComponentBase";
import type { ComponentProperty, PropertyDictionaryItem } from "lib/types/property";
import OptionType from "../base/optionType";
import type { Pie, Arc, PieArcDatum } from "d3-shape";
import type { Selection } from "d3-selection";
import type { Transition } from "d3-transition";

interface DataItem {
    name: string;
    value: number;
    color: string;
    percentage?: number | string;
    index?: number;
}

class PieChart extends SVGComponentBase {
    private width: number;
    private height: number;
    private colorMap: Record<string, string>;
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
    private legendRectItems: Selection<
        SVGRectElement,
        d3.PieArcDatum<DataItem>,
        SVGGElement,
        unknown
    > | null;

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
        this.colorMap = {};
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
        this.legendRectItems = null;
        this.draw();
    }

    protected setupDefaultValues(): void {
        super.setupDefaultValues();
        this.defaultData = [
            // { name: "火电", value: 10 },
            // { name: "水电", value: 20 },
            // { name: "风电", value: 25 },
            // { name: "光伏", value: 40 },
            // { name: "核电", value: 40 },
            // { name: "新能源", value: 20 },
            // { name: "生物质", value: 30 },
        ] as DataItem[];
    }

    protected initProperty(): void {
        super.initProperty();
        const property: ComponentProperty = {
            basic: {
                className: "PieChart",
                frame: [0, 0, 1920, 1080],
            },
            global: {
                padding: [10, 10, 10, 10],
                bgImage: "",
                pieStyle: {
                    radius: 350,
                    borderColor: "rgba(0,0,0,0)",
                    borderWidth: 1,
                    rotationAngle: 0,
                    anticlockwise: 0,
                    dataSort: "desc",
                    label: {
                        isShow: true,
                        style: {
                            font: {
                                family: "微软雅黑",
                                size: 40,
                                color: "#be8a2f",
                            },
                            showlLabelType: "percentage", //percentage value
                            polylineColor: "black",
                            polylineWidth: 2,
                            polylineDistance: 80,
                            labelOffsetY: 10, //标签Y轴偏移
                            textOffsetX: 0, //百分比数值距离
                            precision: 2,
                        },
                    },
                },
                legend: {
                    isShow: true,
                    style: {
                        font: {
                            family: "微软雅黑",
                            size: 30,
                            color: "black",
                        },

                        size: [60, 60],
                        radius: [0, 0],
                        showValue: 0,
                        unit: "(万千瓦时)",
                    },
                    layout: {
                        position: [50, 50], //top left
                        direction: "vertical", //horizontal vertical
                        rectGap: 20, //图例之间
                        itemGap: 10, //图例与文字之间
                    },
                },
            },
            series: {
                dataName: ["火电", "水电", "风电", "光伏", "核电", "新能源", "生物质"],
                dataValue: [10, 20, 35, 40, 30, 21, 15],
                color: [
                    "#91cc75",
                    "#ee6666",
                    "#73c0de",
                    "#3ba272",
                    "#fc8452",
                    "#9a60b4",
                    "#ea7ccc",
                ],
            },
            prompt: {
                isShow: true,
                carousel: {
                    isShow: 0,
                    durationTime: 2,
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
                        size: [15, 15],
                        radius: [7, 7],
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
                        name: "pieStyle",
                        displayName: "饼图样式",
                        children: [
                            {
                                name: "radius",
                                displayName: "半径",
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
                                                name: "showlLabelType",
                                                displayName: "类型",
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
                                                displayName: "折线长度",
                                                type: OptionType.double,
                                                unit: "px",
                                            },
                                            {
                                                name: "labelOffsetY",
                                                displayName: "标签Y轴偏移",
                                                type: OptionType.double,
                                                unit: "px",
                                            },
                                            {
                                                name: "textOffsetX",
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
                                    // {
                                    //     name: "type",
                                    //     displayName: "类型",
                                    //     type: OptionType.radio,
                                    //     options: [
                                    //         {
                                    //             name: "矩形",
                                    //             value: "rect",
                                    //         },
                                    //         {
                                    //             name: "圆点",
                                    //             value: "circle",
                                    //         },
                                    //     ],
                                    // },
                                    {
                                        name: "size",
                                        displayName: "大小",
                                        type: OptionType.doubleArray,
                                        placeholder: ["长", "宽"],
                                        unit: "px",
                                    },
                                    {
                                        name: "radius",
                                        displayName: "圆角",
                                        type: OptionType.doubleArray,
                                        placeholder: ["x圆角", "y圆角"],
                                        unit: "px",
                                    },
                                    {
                                        name: "showValue",
                                        displayName: "显示数值",
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
                        name: "dataName",
                        displayName: "数据集名",
                        type: OptionType.string,
                    },
                    {
                        name: "dataValue",
                        displayName: "数据集值",
                        type: OptionType.doubleArray,
                    },
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
                                        name: "size",
                                        displayName: "图例大小",
                                        type: OptionType.doubleArray,
                                        placeholder: ["长", "宽"],
                                        unit: "px",
                                    },
                                    {
                                        name: "radius",
                                        displayName: "图例圆角",
                                        type: OptionType.doubleArray,
                                        placeholder: ["x圆角", "y圆角"],
                                        unit: "px",
                                    },
                                    {
                                        name: "paddingLeft",
                                        displayName: "显示间隔",
                                        type: OptionType.doubleArray,
                                        placeholder: ["x圆角", "y圆角"],
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
        this.handleData();
        this.createSVGContainer();
        this.createTooltip();
        this.generateArc();
        if (this.property.global.pieStyle.label.isShow) {
            this.generatePolyline();
            this.generateText();
            this.generateValue();
        }
        if (this.property.global.legend.isShow) {
            this.generateLegend();
        }
        this.hoverAnimate();
        this.autoCarousel();
    }

    protected handlePropertyChange(): void {
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

    private handleData(): void {
        this.defaultData = this.property.series.dataName.map((d: string, i: number) => {
            this.colorMap[d] = this.property.series.color[i];
            return {
                name: d,
                value: this.property.series.dataValue[i],
                color: this.property.series.color[i],
            };
        });

        if (this.property.global.pieStyle.dataSort == "desc") {
            this.defaultData.sort((a: DataItem, b: DataItem) => Number(a.value) - Number(b.value));
        } else if (this.property.global.pieStyle.dataSort == "asc") {
            this.defaultData.sort((a: DataItem, b: DataItem) => Number(b.value) - Number(a.value));
        }

        const sum = this.arraySum(this.defaultData);
        this.defaultData.map((d: DataItem, i: number) => {
            d.percentage = d3.format(`.${this.property.global.pieStyle.label.style.precision}f`)(
                (d.value / sum) * 100
            );
            d.index = i;
            this.hasChangeValue[d.name] = {
                value: d.value,
                percentage: d.percentage,
            };
        });

        this.hasChangeData = JSON.parse(JSON.stringify(this.defaultData));
        this.defaultData.map((d: DataItem) => {
            this.textWidth[d.name] = this.getTrueWidth(d.name);
        });
    }

    // 创建 SVG 容器
    private createSVGContainer(): void {
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
    }

    private createTooltip() {
        d3.select(".pie-chart-tooltip").remove();
        this.tooltip = d3
            .select(this.mainSVG.node().parentNode)
            .append("div")
            .attr("class", "pie-chart-tooltip")
            .style(
                "background",
                this.property.prompt.tooltip.background.backgroundImage == ""
                    ? ""
                    : `url(public/images/imageView/noImage.png) center/100% 100% no-repeat`
            )
            .style("background-color", this.property.prompt.tooltip.background.backgroundColor);

        this.pieContainer!.append("defs")
            .append("filter")
            .attr("id", "pie-filter")
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
        // 创建饼图生成器
        const radians = (Math.PI / 180) * this.property.global.pieStyle.rotationAngle;
        this.pie = d3
            .pie<any, DataItem>()
            .value((d) => d.value)
            .sort(null)
            .startAngle(0 + radians)
            .endAngle(Math.PI * 2 + radians)
            .padAngle(0);

        this.arcHighlight = d3
            .arc<any, PieArcDatum<DataItem>>()
            .innerRadius(0)
            .outerRadius(this.property.global.pieStyle.radius * 1.2)
            .cornerRadius(0);

        // 创建弧生成器
        this.arc = d3
            .arc<any, PieArcDatum<DataItem>>()
            .innerRadius(0)
            .outerRadius(this.property.global.pieStyle.radius)
            .cornerRadius(0);

        // 生成饼图数据
        this.pieData = this.pie(this.defaultData);

        // 添加路径元素
        this.pieContainer!.append("g")
            .attr("class", "path-group")
            .selectAll("path")
            .data(this.pieData)
            .enter()
            .append("g")
            .attr("class", "arc-group")
            .attr("data-name", (d) => d.data.name)
            .attr("data-index", (d) => d.index)
            .append("path")
            .attr("class", "arc-path")
            .attr("d", this.arc)
            .attr("fill", (d: PieArcDatum<DataItem>) => d.data.color)
            .attr("stroke", this.property.global.pieStyle.borderColor)
            .style("stroke-width", `${this.property.global.pieStyle.borderWidth}px`)
            .each((d: PieArcDatum<DataItem>) => {
                this.getPoints(d);
            })
            .transition()
            .duration(this.property.animation.durationTime * 1000)
            .attrTween("d", (d: PieArcDatum<DataItem>) => {
                let interpolate = d3.interpolate(d.startAngle, d.endAngle);
                return (t) => {
                    d.endAngle = interpolate(t);
                    return this.arc!(d) as string;
                };
            });
    }

    private generatePolyline() {
        this.pieContainer!.selectAll(".arc-group")
            .append("polyline")
            .attr("class", "arc-polyline")
            .transition()
            .duration(this.property.animation.durationTime * 1000)
            .attrTween("points", ((d: PieArcDatum<DataItem>) => this.animatePolyline(d)) as any)
            .attr("stroke-width", this.property.global.pieStyle.label.style.polylineWidth)
            .attr("stroke", this.property.global.pieStyle.label.style.polylineColor)
            .attr("fill", "none");
    }

    private animatePolyline = (d: PieArcDatum<DataItem>) => {
        const [centerX, centerY, centerZ] = this.centroid[d.data.name];
        const offsetX = this.textWidth[d.data.name];
        const [pointX, pointY] = this.points[d.data.name];

        const [cos, sin, arcEdgeX, arcEdgeY] = this.getAecEdgePoints(centerX, centerY, centerZ);

        this.topCentroid[d.data.name] = [arcEdgeX, arcEdgeY]; //圆边上点坐标

        if (centerX >= 0) {
            return (t: number) => {
                const x = arcEdgeX + (pointX - arcEdgeX) * t;
                const y = arcEdgeY + (pointY - arcEdgeY) * t;
                return `${arcEdgeX},${arcEdgeY} ${x},${y}, ${x + offsetX},${y}`;
            };
        }
        return (t: number) => {
            const x = arcEdgeX + (pointX - arcEdgeX) * t;
            const y = arcEdgeY + (pointY - arcEdgeY) * t;
            return `${arcEdgeX},${arcEdgeY} ${x},${y}, ${x - offsetX},${y}`;
        };
    };

    private generateText() {
        // 添加文字
        this.pieContainer!.selectAll(".arc-group")
            .append("text")
            .attr("class", "arc-text")
            .setFontStyle(this.property.global.pieStyle.label.style.font)
            // .style("font-size", `${this.property.global.pieStyle.label.style.font.fontSize}px`)
            .style("opacity", 0)
            .transition()
            .duration(this.property.animation.durationTime * 1000)
            .call((selection) => this.animateText(selection))
            .style("opacity", 1)
            .attr("fill", this.property.global.pieStyle.label.style.font.color)
            .text((d: any) => d.data.name);
    }

    private animateText(selection: Transition<SVGTextElement, unknown, SVGGElement, unknown>) {
        selection
            .attrTween("x", ((d: PieArcDatum<DataItem>) => {
                const { name } = d.data;
                const [x] = this.points[name];
                const offsetX = this.textWidth[name];
                if (x > 0) {
                    this.hasChangeTextPoints[name][0] = x + 5;
                    return (t: number) => (x + 0) * t;
                }
                this.hasChangeTextPoints[name][0] = x - offsetX;
                return (t: number) => (x - 1 * offsetX) * t;
            }) as any)
            .attrTween("y", ((d: PieArcDatum<DataItem>) => {
                const { name } = d.data;
                const [_, y] = this.points[name];
                this.hasChangeTextPoints[name][1] =
                    y - this.property.global.pieStyle.label.style.labelOffsetY;
                return (t: number) =>
                    (y - this.property.global.pieStyle.label.style.labelOffsetY) * t;
            }) as any);
    }

    private generateValue() {
        // 添加百分比
        this.pieContainer!.selectAll(".arc-group")
            .append("text")
            .attr("class", "arc-value")
            .attr("fill", this.property.global.pieStyle.label.style.font.color)
            .setFontStyle(this.property.global.pieStyle.label.style.font)
            // .style("font-size", `${this.property.global.pieStyle.label.style.font.fontSize}px`)
            .style("opacity", 1)
            .attr("x", ((d: PieArcDatum<DataItem>) => {
                const { name } = d.data;
                const [x] = this.points[name];
                const offsetX = this.textWidth[name];
                if (x > 0) {
                    this.hasChangeValuePoints[name][0] =
                        x - this.property.global.pieStyle.label.style.textOffsetX;
                    return x - this.property.global.pieStyle.label.style.textOffsetX;
                }
                this.hasChangeValuePoints[name][0] =
                    x - offsetX + this.property.global.pieStyle.label.style.textOffsetX;
                return x - offsetX + this.property.global.pieStyle.label.style.textOffsetX;
            }) as any)
            .attr("y", ((d: PieArcDatum<DataItem>) => {
                const { name } = d.data;
                const [_, y] = this.points[name];
                this.hasChangeValuePoints[name][1] =
                    y +
                    this.property.global.pieStyle.label.style.font.size +
                    this.property.global.pieStyle.label.style.labelOffsetY / 2;
                return (
                    y +
                    this.property.global.pieStyle.label.style.font.size +
                    this.property.global.pieStyle.label.style.labelOffsetY / 2
                );
            }) as any)
            .transition()
            .duration(this.property.animation.durationTime * 1000)
            .call((selection) => this.animateValue(selection));
    }

    private animateValue(selection: Transition<SVGTextElement, unknown, SVGGElement, unknown>) {
        selection.textTween((d: any) => {
            let interpolate = null;
            if (this.property.global.pieStyle.label.style.showlLabelType == "percentage") {
                interpolate = d3.interpolateNumber(0, d.data.percentage as number);
                return (t) => {
                    return (
                        d3.format(`.${this.property.global.pieStyle.label.style.precision}f`)(
                            interpolate!(t)
                        ) + "%"
                    );
                };
            } else {
                interpolate = d3.interpolateNumber(0, d.data.value);
                return (t) =>
                    d3.format(`.${this.property.global.pieStyle.label.style.precision}f`)(
                        interpolate!(t)
                    );
            }
        });
    }

    private generateLegend() {
        const legend = this.pieContainer!.append("g")
            .attr("class", "pie-legend")
            .attr(
                "transform",
                `translate(-${this.width / 2 - this.property.global.legend.layout.position[0]}, -${
                    this.height / 2 - this.property.global.legend.layout.position[1]
                })`
            );

        const legendItems = legend
            .selectAll(".pie-legend-item")
            .data(this.pieData!)
            .enter()
            .append("g")
            .attr("class", "pie-legend-item");

        this.legendRectItems = legendItems
            .append("rect")
            .attr("width", this.property.global.legend.style.size[0])
            .attr("height", this.property.global.legend.style.size[1])
            .attr("rx", this.property.global.legend.style.radius[0])
            .attr("ry", this.property.global.legend.style.radius[1])
            .attr("fill", (d) => d.data.color)
            .style("cursor", "pointer")
            .on("click", (event: PointerEvent, d) => {
                let index = this.hasChangeData.findIndex((e) => e.name === d.data.name);
                if (index !== -1) {
                    d3.select(event.target as SVGRectElement).attr("fill", "#ccc");
                    this.hasChangeData.splice(index, 1);
                    // this.hasHiddenArcPath.add(d.index);
                    this.hasHiddenArcPath.add(d.data.name);
                } else {
                    d3.select(event.target as SVGRectElement).attr("fill", d.data.color);
                    let i = this.hasChangeData.findIndex((e) => e.index! > d.index);
                    if (i == -1) {
                        this.hasChangeData.push(d.data);
                    } else {
                        this.hasChangeData.splice(i, 0, d.data);
                    }
                    // this.hasHiddenArcPath.delete(d.index);
                    this.hasHiddenArcPath.delete(d.data.name);
                }

                let sum = this.arraySum(this.hasChangeData);

                this.hasChangeData.map((v) => {
                    v.percentage =
                        Math.round(
                            (v.value / sum) *
                                100 *
                                Math.pow(10, this.property.global.pieStyle.label.style.precision)
                        ) / Math.pow(10, this.property.global.pieStyle.label.style.precision);
                });

                this.hasChangePieData = this.pie!(this.hasChangeData);

                this.pieContainer!.selectAll(".arc-path")
                    .transition()
                    .duration(this.property.animation.durationTime * 1000)
                    .call((selection) =>
                        this.updateArc(
                            selection as unknown as Transition<
                                SVGPathElement,
                                unknown,
                                SVGGElement,
                                unknown
                            >,
                            this.hasChangePieData!
                        )
                    );

                this.pieContainer!.selectAll(".arc-polyline")
                    .transition()
                    .duration(this.property.animation.durationTime * 1000)
                    .call((selection) =>
                        this.updatePolyline(
                            selection as unknown as Transition<
                                SVGPolylineElement,
                                unknown,
                                SVGGElement,
                                unknown
                            >,
                            this.hasChangePieData!
                        )
                    );

                this.pieContainer!.selectAll(".arc-text")
                    .transition()
                    .duration(this.property.animation.durationTime * 1000)
                    .call((selection) =>
                        this.updateText(
                            selection as unknown as Transition<
                                SVGTextElement,
                                unknown,
                                SVGGElement,
                                unknown
                            >,
                            this.hasChangePieData!
                        )
                    );

                this.pieContainer!.selectAll(".arc-value")
                    .transition()
                    .duration(this.property.animation.durationTime * 1000)
                    .call((selection) =>
                        this.updateValue(
                            selection as unknown as Transition<
                                SVGTextElement,
                                unknown,
                                SVGGElement,
                                unknown
                            >,
                            this.hasChangePieData!
                        )
                    );
            })
            .on("mouseenter", (_, d) => {
                this.intervalId && clearInterval(this.intervalId);
                this.intervalId = null;
                this.tooltip.transition().duration(200).style("opacity", 0);
                this.pieContainer!.selectAll(".arc-group").each((_, i, all) => {
                    const name = (all[i] as SVGGElement).dataset.name;
                    if (name == d.data.name && !this.hasHiddenArcPath.has(name)) {
                        d3.select(all[i])
                            .select("path")
                            .style("cursor", "pointer")
                            .transition()
                            .duration(200)
                            .attr("d", this.arcHighlight as any)
                            .attr("filter", "url(#pie-filter)");
                    }
                });
            })
            .on("mouseout", (_, d) => {
                this.pieContainer!.selectAll(".arc-group").each((_, i, all) => {
                    const name = (all[i] as SVGGElement).dataset.name;
                    if (name == d.data.name) {
                        d3.select(all[i])
                            .select("path")
                            .transition()
                            .duration(200)
                            .attr("d", this.arc as any)
                            .attr("filter", "");
                    }
                });
                this.autoCarousel();
            });

        const legendTextItems = legendItems
            .append("text")
            .setFontStyle(this.property.global.legend.style.font)
            // .style("font-size", this.property.global.legend.style.font.fontSize)
            .attr(
                "x",
                this.property.global.legend.style.size[0] +
                    this.property.global.legend.layout.itemGap
            )
            .attr("y", this.property.global.legend.style.size[1] / 2)
            .attr("fill", this.property.global.legend.style.font.color)
            .attr("dy", "0.35em")
            .text((d) => this.computedValue(d.data));

        if (this.property.global.legend.layout.direction == "vertical") {
            legendItems.attr(
                "transform",
                (_, i) =>
                    `translate(0, ${
                        i *
                        (this.property.global.legend.style.size[1] +
                            this.property.global.legend.layout.rectGap)
                    })`
            );
        } else {
            const legendItemWidths = legendTextItems.nodes().map((node) => node.getBBox().width);
            let xOffset = 0;
            legendItems.attr("transform", (_, i) => {
                let translate = `translate(${
                    xOffset +
                    (this.property.global.legend.style.size[0] +
                        this.property.global.legend.layout.rectGap) *
                        i
                },0)`;
                xOffset += legendItemWidths[i] + this.property.global.legend.layout.itemGap;
                return translate;
            });
        }
    }

    private updateArc(
        selection: Transition<SVGPathElement, unknown, SVGGElement, unknown>,
        sourceData: PieArcDatum<DataItem>[]
    ) {
        selection
            .each(((d: PieArcDatum<DataItem>) => {
                const name = d.data.name;
                const target = sourceData.find((e) => e.data.name === name);

                if (!target) return;
                this.getPoints(target, true);
            }) as any)
            .attrTween("d", (d: any) => {
                const name = d.data.name;
                const target = sourceData.find((e) => e.data.name === name);
                if (!target) {
                    const interpolate = d3.interpolate(d.startAngle, d.endAngle);
                    return (t) => {
                        d.startAngle = interpolate(t);
                        return this.arc!(d) as string;
                    };
                }

                const interpolate = d3.interpolate(
                    {
                        startAngle: d.startAngle,
                        endAngle: d.endAngle,
                    },
                    {
                        startAngle: target.startAngle,
                        endAngle: target.endAngle,
                    }
                );
                return (t) => {
                    const obj = interpolate(t);
                    d.startAngle = obj.startAngle;
                    d.endAngle = obj.endAngle;
                    return this.arc!(d) as string;
                };
            });
    }

    private updatePolyline(
        selection: Transition<SVGPolylineElement, unknown, SVGGElement, unknown>,
        sourceData: PieArcDatum<DataItem>[]
    ) {
        selection.attrTween("points", (d: any) => {
            const name = d.data.name;
            const target = sourceData.find((e) => e.data.name === name);

            if (!target) {
                return () => {
                    return `${0},${0} ${0},${0}, ${0},${0}`;
                };
            }
            const [centerX, centerY, centerZ] = this.hasChangeCentroid[d.data.name];
            const offsetX = this.textWidth[d.data.name];

            const [cos, sin, arcEdgeX, arcEdgeY] = this.getAecEdgePoints(centerX, centerY, centerZ); //圆边上点

            let from = this.points[d.data.name]; //折点坐标

            let to = this.hasChangePoints[d.data.name];

            from = [...from, ...this.topCentroid[d.data.name]];
            to = [...to, arcEdgeX, arcEdgeY];
            const interpolate = d3.interpolate(from, to);
            this.topCentroid[d.data.name] = [arcEdgeX, arcEdgeY];
            if (centerX >= 0) {
                return (t) => {
                    const x = interpolate(t)[2] + (to[0] - to[2]) * t;
                    const y = interpolate(t)[3] + (to[1] - to[3]) * t;
                    return `${interpolate(t)[2]},${interpolate(t)[3]} ${x},${y}, ${
                        x + offsetX
                    },${y}`;
                };
            }
            return (t) => {
                const x = interpolate(t)[2] + (to[0] - to[2]) * t;
                const y = interpolate(t)[3] + (to[1] - to[3]) * t;
                return `${interpolate(t)[2]},${interpolate(t)[3]} ${x},${y}, ${x - offsetX},${y}`;
            };
        });
    }

    private updateText(
        selection: Transition<SVGTextElement, unknown, SVGGElement, unknown>,
        sourceData: PieArcDatum<DataItem>[]
    ) {
        const that = this;
        selection
            .attrTween("x", function (d: any) {
                const name = d.data.name;
                const target = sourceData.find((e) => e.data.name === name);
                if (!target) {
                    this.style.opacity = "0";
                    return () => "0";
                }

                this.style.opacity = "1";

                const from = that.hasChangeTextPoints[d.data.name];
                const to = that.hasChangePoints[d.data.name];

                const interpolate = d3.interpolate(from[0], to[0]);

                const offsetX = that.textWidth[name];
                if (to[0] > 0) {
                    return (t) => {
                        that.hasChangeTextPoints[name][0] = to[0] + 5;
                        return (interpolate(t) + 5 * t) as unknown as string;
                    };
                }
                return (t) => {
                    that.hasChangeTextPoints[name][0] = to[0] - offsetX;
                    return (interpolate(t) - offsetX * t) as unknown as string;
                };
            })
            .attrTween("y", function (d: any) {
                const name = d.data.name;
                const target = sourceData.find((e) => e.data.name === name);

                if (!target) {
                    this.style.opacity = "0";
                    return () => "0";
                }

                const from = that.hasChangeTextPoints[d.data.name];
                const to = that.hasChangePoints[d.data.name];

                const interpolate = d3.interpolate(from[1], to[1]);

                that.hasChangeTextPoints[name][1] =
                    to[1] - that.property.global.pieStyle.label.style.labelOffsetY;
                return (t) =>
                    (interpolate(t) -
                        that.property.global.pieStyle.label.style.labelOffsetY *
                            t) as unknown as string;
            });
    }

    private updateValue(
        selection: Transition<SVGTextElement, unknown, SVGGElement, unknown>,
        sourceData: PieArcDatum<DataItem>[]
    ) {
        let that = this;
        selection
            .attrTween("x", function (d: any) {
                const name = d.data.name;
                const target = sourceData.find((e) => e.data.name === name);
                if (!target) {
                    this.style.opacity = "0";
                    return () => "0";
                }

                this.style.opacity = "1";

                const from = that.hasChangeValuePoints[d.data.name];
                const to = that.hasChangePoints[d.data.name];

                const interpolate = d3.interpolate(from[0], to[0]);

                const offsetX = that.textWidth[name];

                if (to[0] > 0) {
                    return (t) => {
                        that.hasChangeValuePoints[name][0] =
                            to[0] - that.property.global.pieStyle.label.style.textOffsetX;
                        return (interpolate(t) -
                            that.property.global.pieStyle.label.style.textOffsetX *
                                t) as unknown as string;
                    };
                }
                return (t) => {
                    that.hasChangeValuePoints[name][0] =
                        to[0] - offsetX + that.property.global.pieStyle.label.style.textOffsetX;
                    return (interpolate(t) -
                        (offsetX - that.property.global.pieStyle.label.style.textOffsetX) *
                            t) as unknown as string;
                };
            })
            .attrTween("y", function (d: any) {
                const name = d.data.name;
                const target = sourceData.find((e) => e.data.name === name);
                if (!target) {
                    this.style.opacity = "0";
                    return () => "0";
                }

                const from = that.hasChangeValuePoints[d.data.name];
                const to = that.hasChangePoints[d.data.name];

                const interpolate = d3.interpolate(from[1], to[1]);

                that.hasChangeValuePoints[name][1] =
                    to[1] +
                    that.property.global.pieStyle.label.style.font.size +
                    that.property.global.pieStyle.label.style.labelOffsetY / 2;
                return (t) =>
                    (interpolate(t) +
                        that.property.global.pieStyle.label.style.font.size * t +
                        (that.property.global.pieStyle.label.style.labelOffsetY / 2) *
                            t) as unknown as string;
            })
            .textTween((d: any) => {
                const name = d.data.name;
                const target = sourceData.find((e) => e.data.name === name);

                if (!target) {
                    //...............
                    return () => undefined as unknown as string;
                }

                let interpolate: (t: number) => number;
                if (this.property.global.pieStyle.label.style.showlLabelType == "percentage") {
                    interpolate = d3.interpolateNumber(
                        this.hasChangeValue[name].percentage as number,
                        target.data.percentage as number
                    );
                    this.hasChangeValue[name].percentage = target.data.percentage!;
                    return (t) => {
                        return (
                            d3.format(`.${this.property.global.pieStyle.label.style.precision}f`)(
                                interpolate(t)
                            ) + "%"
                        );
                    };
                } else {
                    interpolate = d3.interpolateNumber(
                        this.hasChangeValue[name].value as number,
                        target.data.value
                    );
                    this.hasChangeValue[name].value = target.data.value;
                    return (t) =>
                        d3.format(`.${this.property.global.pieStyle.label.style.precision}f`)(
                            interpolate(t)
                        );
                }
            });
    }

    private hoverAnimate() {
        this.pieContainer!.selectAll(".arc-path")
            .on("mousemove", (event: PointerEvent, d: any) => {
                const target = this.defaultData.find((e: DataItem) => e.name === d.data.name);

                d3.select(event.target as SVGRectElement)
                    .style("cursor", "pointer")
                    .transition()
                    .duration(200)
                    .attr("d", this.arcHighlight as any)
                    .attr("filter", "url(#pie-filter)");

                this.tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", this.property.prompt.tooltip.background.opacity)
                    .style("border-color", d.data.color);
                this.tooltip
                    .html(
                        `<div style="display:flex;align-items: center;justify-content: center;">
                            <span style="display:inline-block;margin-right:8px;border-radius:${this.property.prompt.tooltip.style.radius[0]}px ${this.property.prompt.tooltip.style.radius[1]}px
                            ;width:${this.property.prompt.tooltip.style.size[0]}px;height:${this.property.prompt.tooltip.style.size[1]}px;background-color:${d.data.color};"></span>
                            <span style="font-size:${this.property.prompt.tooltip.style.name.size}px;color:${this.property.prompt.tooltip.style.name.color}">${d.data.name}</span>
                            <span style="padding-left:${this.property.prompt.tooltip.style.paddingLeft}px;font-size:${this.property.prompt.tooltip.style.value.size}px;color:${this.property.prompt.tooltip.style.value.color}">${target.value}</span>
                        <span style="font-size:${this.property.prompt.tooltip.style.value.size}px;color:${this.property.prompt.tooltip.style.value.color}">${this.property.prompt.tooltip.style.unit}</span>
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
                d3.select(event.target as SVGRectElement)
                    .transition()
                    .duration(200)
                    .attr("d", this.arc as any)
                    .attr("filter", "");
                this.tooltip.transition().duration(200).style("opacity", 0);
                this.autoCarousel();
            });
    }

    private autoCarousel() {
        if (this.property.prompt.carousel.isShow && this.hasHiddenArcPath.size === 0) {
            this.intervalId && clearInterval(this.intervalId);
            this.currentIndex = 0;
            this.intervalId = setInterval(() => {
                const d = this.pieData![this.currentIndex];
                const centroid = this.arc!.centroid(d);
                const x = centroid[0] + this.width / 2;
                const y = centroid[1] + this.height / 2;

                this.tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", this.property.prompt.tooltip.background.opacity)
                    .style("border-color", d.data.color);
                this.tooltip
                    .html(
                        `<div style="display:flex;align-items: center;justify-content: center;">
                            <span style="display:inline-block;margin-right:8px;border-radius:${this.property.prompt.tooltip.style.radius[0]}px ${this.property.prompt.tooltip.style.radius[1]}px;
                            width:${this.property.prompt.tooltip.style.size[0]}px;height:${this.property.prompt.tooltip.style.size[1]}px;background-color:${d.data.color};"></span>
                            <span style="font-size:${this.property.prompt.tooltip.style.name.size}px;color:${this.property.prompt.tooltip.style.name.color}">${d.data.name}</span>
                            <span style="padding-left:${this.property.prompt.tooltip.style.paddingLeft}px;font-size:${this.property.prompt.tooltip.style.value.size}px;color:${this.property.prompt.tooltip.style.value.color}">${d.data.value}</span>
                            <span style="font-size:${this.property.prompt.tooltip.style.value.size}px;color:${this.property.prompt.tooltip.style.value.color}">${this.property.prompt.tooltip.style.unit}</span>
                            </div>`
                    )
                    .style("left", x + this.property.prompt.tooltip.background.offset[0] + "px")
                    .style("top", y + this.property.prompt.tooltip.background.offset[1] + "px");

                this.currentIndex = (this.currentIndex + 1) % this.defaultData.length;
            }, this.property.prompt.carousel.durationTime * 1000);
        }
    }

    public update(data: DataItem[]): void {
        this.intervalId && clearInterval(this.intervalId);
        this.intervalId = null;
        // this.data = [
        //     { name: "光伏", value: Math.floor(Math.random() * (50 - 10 + 1)) + 10 },
        //     { name: "核电", value: Math.floor(Math.random() * (50 - 10 + 1)) + 10 },
        //     { name: "新能源", value: Math.floor(Math.random() * (50 - 10 + 1)) + 10 },
        //     { name: "生物质", value: Math.floor(Math.random() * (50 - 10 + 1)) + 10 },
        //     { name: "火电", value: Math.floor(Math.random() * (50 - 10 + 1)) + 10 },
        //     { name: "水电", value: Math.floor(Math.random() * (50 - 10 + 1)) + 10 },
        //     { name: "风电", value: Math.floor(Math.random() * (50 - 10 + 1)) + 10 },
        // ];

        if (this.property.global.pieStyle.dataSort == "desc") {
            data.sort((a: DataItem, b: DataItem) => Number(a.value) - Number(b.value));
        } else if (this.property.global.pieStyle.dataSort == "asc") {
            data.sort((a: DataItem, b: DataItem) => Number(b.value) - Number(a.value));
        }

        const sum = this.arraySum(data);
        data.map((d, i) => {
            d.percentage = d3.format(`.${this.property.global.pieStyle.label.style.precision}f`)(
                (d.value / sum) * 100
            );
            d.color = this.colorMap[d.name] ?? this.property.series.color[i];
            d.index = i;
        });

        this.hasChangeData = JSON.parse(JSON.stringify(data));

        // 生成饼图数据
        let newPieData = this.pie!(data);

        newPieData.map((d) => {
            this.textWidth[d.data.name] = this.getTrueWidth(d.data.name);
        });

        this.pieData = newPieData;

        this.pieContainer!.selectAll(".arc-path")
            .transition()
            .duration(this.property.animation.durationTime * 1000)
            .call((selection) =>
                this.updateArc(
                    selection as unknown as Transition<
                        SVGPathElement,
                        unknown,
                        SVGGElement,
                        unknown
                    >,
                    newPieData
                )
            );

        if (this.property.global.pieStyle.label.isShow) {
            this.pieContainer!.selectAll(".arc-polyline")
                .transition()
                .duration(this.property.animation.durationTime * 1000)
                .call((selection) =>
                    this.updatePolyline(
                        selection as unknown as Transition<
                            SVGPolylineElement,
                            unknown,
                            SVGGElement,
                            unknown
                        >,
                        newPieData
                    )
                );

            this.pieContainer!.selectAll(".arc-text")
                .transition()
                .duration(this.property.animation.durationTime * 1000)
                .call((selection) =>
                    this.updateText(
                        selection as unknown as Transition<
                            SVGTextElement,
                            unknown,
                            SVGGElement,
                            unknown
                        >,
                        newPieData
                    )
                );

            this.pieContainer!.selectAll(".arc-value")
                .transition()
                .duration(this.property.animation.durationTime * 1000)
                .call((selection) =>
                    this.updateValue(
                        selection as unknown as Transition<
                            SVGTextElement,
                            unknown,
                            SVGGElement,
                            unknown
                        >,
                        newPieData
                    )
                );
        }

        this.hasHiddenArcPath.clear();

        if (this.property.global.legend.isShow) {
            this.legendRectItems!.attr("fill", (d) => {
                return d.data.color;
            });
        }

        this.defaultData = data;

        setTimeout(() => {
            if (this.property.global.legend.isShow) {
                this.pieContainer!.selectAll(".pie-legend-item")
                    .data(this.pieData!)
                    .select("rect")
                    .attr("fill", (d) => {
                        return d.data.color;
                    });
                this.pieContainer!.selectAll(".pie-legend-item")
                    .data(this.pieData!)
                    .select("text")
                    .text((d) => {
                        return this.computedValue(d.data);
                    });
            }

            this.autoCarousel();
        }, 8);
    }

    private arraySum(array: DataItem[]) {
        return array.reduce((acc, cur) => acc + cur.value, 0);
    }

    private getTrueWidth(text: string) {
        this.mainSVG
            .append("text")
            .attr("class", "temp-text")
            .style("font-size", `${this.property.global.pieStyle.label.style.font.size}px`)
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
        // const offsetX = this.textWidth[d.data.name];

        const [X, Y] = this.getAxis(
            centerX,
            centerY,
            centerZ,
            this.property.global.pieStyle.radius +
                this.property.global.pieStyle.label.style.polylineDistance
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
                    ? cos * this.property.global.pieStyle.radius
                    : -cos * this.property.global.pieStyle.radius;
            arcEdgeY = -sin * this.property.global.pieStyle.radius;
        } else {
            cos = Math.abs(centerY / centerZ);
            sin = Math.abs(centerX / centerZ);
            arcEdgeX =
                centerX > 0
                    ? sin * this.property.global.pieStyle.radius
                    : -sin * this.property.global.pieStyle.radius;
            arcEdgeY = cos * this.property.global.pieStyle.radius;
        }
        return [cos, sin, arcEdgeX, arcEdgeY];
    }

    private computedValue(data: DataItem) {
        if (this.property.global.legend.style.showValue) {
            if (this.property.global.pieStyle.label.style.showlLabelType == "value") {
                return (
                    data.name + " " + data.percentage + " " + this.property.global.legend.style.unit
                );
            } else {
                return data.name + " " + data.value + " " + this.property.global.legend.style.unit;
            }
        } else {
            return data.name;
        }
    }
}

export default PieChart;
