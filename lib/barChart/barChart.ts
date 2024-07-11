import * as d3 from "d3";
import ComponentBase from "../base/componentBase";

class BarChart extends ComponentBase {
  constructor(id: string, code: string, container: Element, workMode: number, option: Object) {
    super(id, code, container, workMode, option);
    console.log(id, code, container, workMode, option);
    this._draw();
  }

  _draw() {
    let container = this.container;
    let id = this.id;
    super._draw();
    const data = [
      { letter: "A", frequency: 0.08167 },
      { letter: "B", frequency: 0.01492 },
      { letter: "C", frequency: 0.02782 },
      { letter: "D", frequency: 0.04253 },
      { letter: "E", frequency: 0.12702 },
      { letter: "F", frequency: 0.02288 },
      { letter: "G", frequency: 0.02015 },
      { letter: "H", frequency: 0.06094 },
      { letter: "I", frequency: 0.06966 },
      { letter: "J", frequency: 0.00153 },
      { letter: "K", frequency: 0.00772 },
      { letter: "L", frequency: 0.04025 },
      { letter: "M", frequency: 0.02406 },
      { letter: "N", frequency: 0.06749 },
      { letter: "O", frequency: 0.07507 },
      { letter: "P", frequency: 0.01929 },
      { letter: "Q", frequency: 0.00095 },
      { letter: "R", frequency: 0.05987 },
      { letter: "S", frequency: 0.06327 },
      { letter: "T", frequency: 0.09056 },
      { letter: "U", frequency: 0.02758 },
      { letter: "V", frequency: 0.00978 },
      { letter: "W", frequency: 0.0236 },
      { letter: "X", frequency: 0.0015 },
      { letter: "Y", frequency: 0.01974 },
      { letter: "Z", frequency: 0.00074 },
    ];

    if (container === null) return;
    const d3Container: any = d3.select(container).append("svg").attr("width", 1920).attr("height", 1080);
    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 0;
    const marginBottom = 30;
    const marginLeft = 40;
    const g = d3Container.append("g").attr("id", id);
    g.append("g").attr("class", "axis");
    g.append("g").attr("class", "graph");
    const x = d3
      .scaleBand()
      .domain(d3.sort(data, (d) => -d.frequency).map((d) => d.letter))
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    const xAxis = d3.axisBottom(x).tickSizeOuter(0);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.frequency)] as [number, number])
      .nice()
      .range([height - marginBottom, marginTop]);

    const svg = d3Container.attr("viewBox", [0, 0, width, height]).attr("width", width).attr("height", height).attr("style", "max-width: 100%; height: auto;").call(zoom);

    svg
      .append("g")
      .attr("class", "bars")
      .attr("fill", "steelblue")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d: any) => x(d.letter) as number)
      .attr("y", (d: any) => y(d.frequency) as number)
      .attr("height", (d: any) => y(0) - y(d.frequency))
      .attr("width", x.bandwidth());

    // Append the axes.
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call((g: any) => g.select(".domain").remove());

    function zoom(svg: any) {
      const extent: [[number, number], [number, number]] = [
        [marginLeft, marginTop],
        [width - marginRight, height - marginTop],
      ];

      svg.call(d3.zoom().scaleExtent([1, 8]).translateExtent(extent).extent(extent).on("zoom", zoomed));

      function zoomed(event: any) {
        x.range([marginLeft, width - marginRight].map((d) => event.transform.applyX(d)));
        svg
          .selectAll(".bars rect")
          .attr("x", (d: any) => x(d.letter))
          .attr("width", x.bandwidth());
        svg.selectAll(".x-axis").call(xAxis);
      }
    }
  }

  printString(str: string) {
    console.log(str);
  }
}

export default BarChart;
