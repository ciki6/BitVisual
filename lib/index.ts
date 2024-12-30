import type { WisChartType } from "./types";
import { ComponentOption } from "lib/types/compOption";
import BarChart from "./barChart";
import ChordDiagram from "./chordDiagram/v1/chordDiagram";
import ImageView from "./imageView/imageView";
import LineChart from "./lineChart/lineChart";
import AreaChart from "./areaChart/areaChart";
import ScatterPlotChart from "./scatterPlotChart/scatterPlotChart";
import BubbleChart from "./bubbleChart";
import BarGraph from "./barGraph";

type CompParam = {
  className: string;
  id: string;
  code: string;
  container: Element;
  workMode: number;
  option: ComponentOption;
  useDefaultOpt: boolean;
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
  const s = `new ${compParam.className}.${compParam.option.compVersion}('${compParam.id}', '${compParam.code}', compParam.container, compParam.workMode, compParam.option, compParam.useDefaultOpt)`;
  return eval(s);
};
