import React, { useState, useEffect } from "react";
import { PropertyDictionaryItem } from "lib/types/property";

interface Props {
  propertyValue: number;
  propertyDic: PropertyDictionaryItem;
  onUpdatePropertyValue: (value: number) => void;
}

const NumberInput: React.FC<Props> = ({ propertyValue, propertyDic, onUpdatePropertyValue }) => {
  const [value, setValue] = useState<number>(propertyValue);

  useEffect(() => {
    setValue(propertyValue);
  }, [propertyValue]);

  const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setValue(newValue);
    onUpdatePropertyValue(newValue);
  };

  return <input type="number" value={value} step={propertyDic.type === "Double" ? 0.01 : 1} onChange={updateValue} />;
};

export default NumberInput;
