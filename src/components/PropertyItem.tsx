import React, { useState, useEffect } from "react";
import { PropertyDictionaryItem } from "lib/types/property";

interface Props {
  propertyDic: PropertyDictionaryItem;
  propertyName: string;
  property: Record<string, any>;
  updateProperty: (name: string, value: any) => void;
}

// Helper function to get the nested value from the property object
const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

// Helper function to set the nested value in the property object
const setNestedValue = (obj: any, path: string, value: any) => {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  const lastObj = keys.reduce((acc, key) => (acc[key] = acc[key] || {}), obj);
  lastObj[lastKey] = value;
};

const PropertyItem: React.FC<Props> = ({ propertyDic, propertyName, property, updateProperty }) => {
  const getDefaultValue = () => {
    if (propertyDic.type === "DoubleArray") {
      return propertyDic.placeholder?.map(() => 0) || [];
    }
    return "";
  };

  // Initialize with the nested value from property or a default value
  const [value, setValue] = useState<any>(getNestedValue(property, propertyName) || getDefaultValue());

  // Effect to update value when property or propertyName changes
  useEffect(() => {
    const newValue = getNestedValue(property, propertyName) || getDefaultValue();
    setValue(newValue);
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
    // Update the nested property value
    const updatedProperty = { ...property };
    setNestedValue(updatedProperty, propertyName, newValue);
    updateProperty(propertyName, updatedProperty);
  };

  const renderInput = () => {
    switch (propertyDic.type) {
      case "Boolean":
        return <input type="checkbox" checked={value} onChange={handleChange} disabled={!propertyDic.editable} />;
      case "Int":
      case "Double":
        return <input type="number" value={value} step={propertyDic.type === "Double" ? 0.01 : 1} onChange={handleChange} disabled={!propertyDic.editable} />;
      case "Range":
        return <input type="range" value={value} onChange={handleChange} disabled={!propertyDic.editable} />;
      case "DoubleArray":
        return propertyDic.placeholder?.map((placeholder, index) => <input key={index} type="number" data-index={index} value={value[index] !== undefined ? value[index] : ""} placeholder={placeholder} onChange={handleChange} disabled={!propertyDic.editable} />);
      default:
        return <input type="text" value={value} onChange={handleChange} disabled={!propertyDic.editable} />;
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
