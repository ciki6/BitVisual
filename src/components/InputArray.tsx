import React, { useState, useEffect } from "react";
import { PropertyDictionaryItem } from "lib/types/property";

interface Props {
  propertyDic: PropertyDictionaryItem;
  propertyValue: number[];
  onUpdatePropertyValue: (value: number[]) => void;
}

const PropertyInputArray: React.FC<Props> = ({ propertyDic, propertyValue, onUpdatePropertyValue }) => {
  const [values, setValues] = useState<number[]>([...propertyValue]);

  useEffect(() => {
    setValues([...propertyValue]);
  }, [propertyValue]);

  const handleChange = (index: number, newValue: number) => {
    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
    onUpdatePropertyValue(newValues);
  };

  return (
    <div>
      {propertyDic.placeholder?.map((item, index) => (
        <input key={index} type="number" value={values[index]} placeholder={item} onChange={(e) => handleChange(index, Number(e.target.value))} />
      ))}
    </div>
  );
};

export default PropertyInputArray;
