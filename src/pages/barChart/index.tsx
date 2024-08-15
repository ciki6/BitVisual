import React, { useEffect, useRef, useState } from "react";
import PropertyList from "@/components/PropertyList";
import BarChart from "../../../lib/barChart/barChart";

const BarChartTest: React.FC = () => {
  const compContainerRef = useRef<HTMLDivElement | null>(null);
  const compRef = useRef<any>(null); // 使用 any 或者你在 BarChart 中定义的具体类型
  const [propertyDic, setPropertyDic] = useState([]);
  const [property, setProperty] = useState({});

  const updateProperty = (name: string, value: any) => {
    console.log("updateProperty", name, value);
    if (compRef.current) {
      compRef.current.setProperty(name, value);
    }
  };

  useEffect(() => {
    if (compContainerRef.current) {
      compRef.current = new BarChart("asd", "asd", compContainerRef.current, 0, {}, true);
      setPropertyDic(compRef.current.propertyManager.getPropertyDictionary());
      setProperty(compRef.current.propertyManager.getPropertyList());
    }
  }, []);

  return (
    <div>
      BarChart组件测试
      <div className="comp_container" ref={compContainerRef}></div>
      <PropertyList property={property} propertyDic={propertyDic} onUpdateProperty={updateProperty} />
      <textarea></textarea>
    </div>
  );
};

export default BarChartTest;
