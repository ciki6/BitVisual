import * as d3 from "d3";
import "./style.css";
class ImageView {
  constructor(
    id: string,
    code: string,
    container: Element,
    workMode: number,
    option: Object, useDefaultOpt: boolean
  ) {
    console.log(id, code, container, workMode, option, useDefaultOpt);
    this._draw(id, container);
  }

  _draw(id: string, container: Element) {
    if (container === null) return;
    const d3Container: any = d3.select(container);
    d3Container
      .append("img")
      .attr("id", id)
      .attr('title', 'defaultImage')
      .attr("class", "imageView")
      .attr("src", "/images/imageView/noImage.png");
  }

  printString(str: string) {
    console.log(str);
  }
}
export default ImageView;
