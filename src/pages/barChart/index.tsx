import React, { useEffect, useRef, useState } from "react";
import PropertyPanel from "@/components/PropertyPanel"; // Make sure the import path is correct
import BarChart from "../../../lib/barChart/barChart";

const BarChartTest: React.FC = () => {
  const compContainerRef = useRef<HTMLDivElement | null>(null);
  const compRef = useRef<any>(null);
  const [defaultData, setDefaultData] = useState<string>("");
  const [propertyDic, setPropertyDic] = useState([]);
  const [property, setProperty] = useState<any>({});
  const [propertyTextAreaContent, setPropertyTextAreaContent] = useState<string>("");

  // const handlePropertyChange = (name: string, value: any) => {
  //   const updatedProperty = { ...property };
  //   const keys = name.split(".");
  //   let obj = updatedProperty;
  //   for (let i = 0; i < keys.length - 1; i++) {
  //     obj = obj[keys[i]];
  //   }
  //   obj[keys[keys.length - 1]] = value;
  //   setProperty(updatedProperty);

  //   if (compRef.current) {
  //     compRef.current.setProperty(name, value);
  //   }
  // };

  const handlePropertyChange = (property: any) => {
    if (compRef.current) {
      compRef.current.setProperty(property);
    }
  };

  const handleAction = (action: string, param: any) => {
    if (compRef.current) {
      eval(`compRef.current.${action}(${param.join(",")})`);
    }
  };

  const handleDataTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDefaultData(e.target.value);
  };

  const handlePropertyTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPropertyTextAreaContent(e.target.value);
  };

  const updateData = () => {
    if (compRef.current) {
      compRef.current.update(JSON.parse(defaultData));
    }
  };

  const applyTextareaToPropertyGroup = () => {
    try {
      const updatedProperty = JSON.parse(propertyTextAreaContent);
      setProperty(updatedProperty);

      if (compRef.current) {
        compRef.current.setProperty(updatedProperty);
      }
    } catch (error) {
      console.error("Invalid JSON input", error);
    }
  };

  useEffect(() => {
    if (compContainerRef.current) {
      compRef.current = new BarChart(
        "asd",
        "asd",
        compContainerRef.current as Element,
        0,
        {
          property: {
            basic: {
              frame: [0, 0, 1920, 1080],
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

  useEffect(() => {
    setPropertyTextAreaContent(JSON.stringify(property, null, 2));
  }, [property]);
  return (
    <div>
      BarChart组件测试
      <div className="comp_prop">
        <div className="comp_container" ref={compContainerRef}></div>
        <div className="prop_container">
          <PropertyPanel property={property} propertyDic={propertyDic} onChange={handlePropertyChange} onAction={handleAction} />
        </div>
      </div>
      <div className="comp_data">
        <textarea className="data_area" value={defaultData} onChange={handleDataTextareaChange}></textarea>
        <button onClick={updateData}>update data</button>

        <textarea className="data_area" value={propertyTextAreaContent} onChange={handlePropertyTextareaChange}></textarea>
        <button onClick={applyTextareaToPropertyGroup}>Apply to PropertyGroup</button>
      </div>
    </div>
  );
};

export default BarChartTest;
