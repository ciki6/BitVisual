import React, { useState, useEffect } from "react";
import { PropertyDictionaryItem } from "lib/types/property";

interface Props {
  propertyDic: PropertyDictionaryItem;
  propertyName: string;
  property: Record<string, any>;
  updateProperty: (name: string, value: any) => void;
}

function getNestedProperty(obj: any, path: string): any {
  return path.split(".").reduce((o, p) => (o ? o[p] : undefined), obj);
}

const PropertyItem: React.FC<Props> = ({ propertyDic, propertyName, property, updateProperty }) => {
  const [value, setValue] = useState<any>(() => getNestedProperty(property, propertyName));

  useEffect(() => {
    setValue(getNestedProperty(property, propertyName));
  }, [property, propertyName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue: any;

    switch (propertyDic.type) {
      case "Boolean":
        newValue = e.target.checked;
        break;
      case "Int":
      case "Double":
      case "Range":
        newValue = parseFloat(e.target.value);
        break;
      case "DoubleArray":
        const index = parseInt(e.target.dataset.index || "0");
        const newValues = [...value];
        newValues[index] = parseFloat(e.target.value);
        newValue = newValues;
        break;
      default:
        newValue = e.target.value;
        break;
    }

    setValue(newValue);
    updateProperty(propertyName, newValue);
  };

  const renderInput = () => {
    switch (propertyDic.type) {
      case "Boolean":
        return <input type="checkbox" checked={!!value} onChange={handleChange} disabled={!propertyDic.editable} />;
      case "Int":
      case "Double":
        return <input type="number" value={value || 0} step={propertyDic.type === "Double" ? 0.01 : 1} onChange={handleChange} disabled={!propertyDic.editable} />;
      case "Range":
        return <input type="range" value={value || 0} onChange={handleChange} disabled={!propertyDic.editable} />;
      case "DoubleArray":
        return propertyDic.placeholder?.map((placeholder, index) => <input key={index} type="number" data-index={index} value={(value && value[index]) || 0} placeholder={placeholder} onChange={handleChange} disabled={!propertyDic.editable} />);
      default:
        return <input type="text" value={value || ""} onChange={handleChange} disabled={!propertyDic.editable} />;
    }
  };

  return (
    <div>
      <div>{propertyDic.displayName}</div>
      {renderInput()}
    </div>
  );
};

export default PropertyItem;
