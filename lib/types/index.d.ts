import BarChart from "../barChart/barChart";
import ChordDiagram from "../chordDiagram/chordDiagram";
import ImageView from "../imageView/imageView";
import LineChart from "../lineChart/lineChart";
import AreaChart from "../areaChart/areaChart";
import ScatterPlotChart from "../scatterPlotChart/scatterPlotChart";
import BubbleChart from "../bubbleChart/bubbleChart";
import BarGraph from "../barGraph/barGraph";

export interface WisChartType {
  BarChart: typeof BarChart;
  ChordDiagram: typeof ChordDiagram;
  ImageView: typeof ImageView;
  LineChart: typeof LineChart;
  AreaChart: typeof AreaChart;
  ScatterPlotChart: typeof ScatterPlotChart;
  BubbleChart: typeof BubbleChart;
  BarGraph: typeof BarGraph;
}