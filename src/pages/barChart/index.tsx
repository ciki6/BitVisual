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

  const handleDataTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDefaultData(e.target.value);
  };

  const handlePropertyTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProperty(JSON.parse(e.target.value));
  };

  const updateData = () => {
    if (compRef.current) {
      compRef.current.update(JSON.parse(defaultData));
    }
  };

  const updatePropertyArea = () => {
    if (compRef.current) {
      compRef.current.setPropertyByObject(property);
    }
  };

  useEffect(() => {
    if (compContainerRef.current) {
      compRef.current = new BarChart(
        "asd",
        "asd",
        compContainerRef.current,
        0,
        {
          property: {
            basic: {
              frame: [0, 0, 900, 800],
            },
          },
        },
        true
      );
      setPropertyDic(compRef.current.propertyManager.getPropertyDictionary());
      setProperty(compRef.current.propertyManager.getPropertyList());
      setDefaultData(JSON.stringify(compRef.current.defaultData));
    }
  }, []);

  return (
    <div>
      BarChart组件测试
      <div className="comp_prop">
        <div className="comp_container" ref={compContainerRef}></div>
        <div className="prop_container">
          <PropertyList property={property} propertyDic={propertyDic} onUpdateProperty={updateProperty} />
        </div>
      </div>
      <div className="comp_data">
        <textarea className="data_area" defaultValue={defaultData} onChange={handleDataTextareaChange}></textarea>
        <button onClick={updateData}>update data</button>
        <textarea className="data_area" defaultValue={JSON.stringify(property)} onChange={handlePropertyTextareaChange}></textarea>
        <button onClick={updatePropertyArea}>update property</button>
      </div>
    </div>
  );
};

export default BarChartTest;
