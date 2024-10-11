import React, { useState, useEffect } from "react";
import { PropertyDictionaryItem } from "lib/types/property";

interface Props {
  propertyDic: PropertyDictionaryItem;
  propertyName: string;
  property: Record<string, any>;
  updateProperty: (name: string, value: any) => void;
}

const PropertyItem: React.FC<Props> = ({ propertyDic, propertyName, property, updateProperty }) => {
  // 添加对property和propertyName的检查，避免读取未定义的值
  const [value, setValue] = useState<any>(property?.[propertyName] ?? "");

  useEffect(() => {
    // 确保在property和propertyName有效的情况下设置value
    if (property && propertyName in property) {
      setValue(property[propertyName]);
    }
  }, [property, propertyName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let newValue: any;

    if (propertyDic.type === "Boolean") {
      newValue = (e.target as HTMLInputElement).checked;
    } else {
      newValue = e.target.value;
    }

    switch (propertyDic.type) {
      case "Int":
      case "Double":
      case "Range":
        newValue = parseFloat(newValue);
        break;
      case "DoubleArray":
        const index = parseInt(e.target.dataset.index || "0");
        const newValues = [...value];
        newValues[index] = parseFloat(newValue);
        newValue = newValues;
        break;
      default:
        break;
    }

    setValue(newValue);
    updateProperty(propertyName, newValue);
  };

  const renderInput = () => {
    if (!propertyDic) return null; // 防止propertyDic为空时渲染出错

    switch (propertyDic.type) {
      case "Boolean":
        return <input type="checkbox" checked={value} onChange={handleChange} disabled={!propertyDic.editable} />;
      case "Int":
      case "Double":
        return <input type="number" value={value} step={propertyDic.type === "Double" ? 0.01 : 1} onChange={handleChange} disabled={!propertyDic.editable} />;
      case "Range":
        return <input type="range" value={value} onChange={handleChange} disabled={!propertyDic.editable} />;
      case "DoubleArray":
        return propertyDic.placeholder?.map((placeholder, index) => <input key={index} type="number" data-index={index} value={value[index]} placeholder={placeholder} onChange={handleChange} disabled={!propertyDic.editable} />);
      default:
        return <input type="text" value={value} onChange={handleChange} disabled={!propertyDic.editable} />;
    }
  };

  return (
    <div>
      <div>{propertyDic?.displayName || "Unknown"}</div>
      {renderInput()}
    </div>
  );
};

export default PropertyItem;
