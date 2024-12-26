import type { WisChartType } from "./types";
import { ComponentOption } from "lib/types/compOption";
import BarChart from "./barChart";
import ChordDiagram from "./chordDiagram/chordDiagram";
import ImageView from "./imageView/imageView";
import LineChart from "./lineChart/lineChart";
import AreaChart from "./areaChart/areaChart";
import ScatterPlotChart from "./scatterPlotChart/scatterPlotChart";
import BubbleChart from "./bubbleChart/bubbleChart";
import BarGraph from "./barGraph/barGraph";

type CompParam = {
  className: string;
  id: string;
  code: string;
  container: Element;
  workMode: number;
  option: ComponentOption;
  useDefaultOpt: boolean;
  version: string;
};

const WisChart: WisChartType = {
  BarChart,
  ChordDiagram,
  ImageView,
  LineChart,
  AreaChart,
  ScatterPlotChart,
  BubbleChart,
  BarGraph,
};
export default WisChart;

export const compGenerator = (compParam: CompParam) => {
  const fn = new Function(`new ${compParam.className}.${compParam.version}('${compParam.id}', '${compParam.code}', compParam.container, compParam.workMode, compParam.option, compParam.useDefaultOpt)`);
  return fn();
};
