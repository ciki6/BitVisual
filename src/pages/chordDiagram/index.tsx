import React, { useEffect, useRef } from "react";
import ChordDiagram from "../../../lib/chordDiagram/chordDiagram";

const ChordDiagramTest: React.FC = () => {
  const compContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (compContainerRef.current) {
      new ChordDiagram("asd", "asd", compContainerRef.current, 0, {});
    }
  }, []);

  return (
    <div>
      ChordDiagram组件测试
      <div className="comp_container" ref={compContainerRef}></div>
    </div>
  );
};

export default ChordDiagramTest;
