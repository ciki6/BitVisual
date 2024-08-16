import React, { useEffect, useRef, useState } from "react";
import PropertyList from "@/components/PropertyList";
import BarChart from "../../../lib/barChart/barChart";

const BarChartTest: React.FC = () => {
  const compContainerRef = useRef<HTMLDivElement | null>(null);
  const compRef = useRef<any>(null);
  const [defaultData, setDefaultData] = useState<string>("");
  const [propertyDic, setPropertyDic] = useState([]);
  const [property, setProperty] = useState({});

  const updateProperty = (name: string, value: any) => {
    if (compRef.current) {
      compRef.current.setProperty(name, value);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDefaultData(e.target.value);
  };

  const updateData = () => {
    if (compRef.current) {
      compRef.current.update(JSON.parse(defaultData));
    }
  };

  useEffect(() => {
    if (compContainerRef.current) {
      compRef.current = new BarChart("asd", "asd", compContainerRef.current, 0, {}, true);
      setPropertyDic(compRef.current.propertyManager.getPropertyDictionary());
      setProperty(compRef.current.propertyManager.getPropertyList());
      setDefaultData(JSON.stringify(compRef.current.defaultData));
    }
  }, []);

  return (
    <div>
      BarChart组件测试
      <div className="comp_container" ref={compContainerRef}></div>
      <PropertyList property={property} propertyDic={propertyDic} onUpdateProperty={updateProperty} />
      <textarea defaultValue={defaultData} onChange={handleTextareaChange}></textarea>
      <button onClick={updateData}>update data</button>
    </div>
  );
};

export default BarChartTest;
