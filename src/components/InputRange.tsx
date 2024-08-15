import React, { useState, useEffect } from "react";

interface Props {
  propertyValue: number;
  onUpdatePropertyValue: (value: number) => void;
}

const RangeInput: React.FC<Props> = ({ propertyValue, onUpdatePropertyValue }) => {
  const [value, setValue] = useState<number>(propertyValue);

  useEffect(() => {
    setValue(propertyValue);
  }, [propertyValue]);

  const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setValue(newValue);
    onUpdatePropertyValue(newValue);
  };

  return <input type="range" value={value} onChange={updateValue} />;
};

export default RangeInput;
