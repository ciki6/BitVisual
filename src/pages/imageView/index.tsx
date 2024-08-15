import React, { useEffect, useRef } from "react";
import ImageView from "../../../lib/imageView/imageView";

const ChordDiagramTest: React.FC = () => {
  const compContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (compContainerRef.current) {
      new ImageView("asd", "asd", compContainerRef.current, 0, {});
    }
  }, []);

  return (
    <div>
      ImageView组件测试
      <div className="comp_container" ref={compContainerRef}></div>
    </div>
  );
};

export default ChordDiagramTest;
