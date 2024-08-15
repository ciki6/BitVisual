import React, { useState, useEffect } from "react";

interface Props {
  propertyValue: boolean;
  onUpdatePropertyValue: (value: boolean) => void;
}

const Checkbox: React.FC<Props> = ({ propertyValue, onUpdatePropertyValue }) => {
  const [checked, setChecked] = useState(propertyValue);

  useEffect(() => {
    setChecked(propertyValue);
  }, [propertyValue]);

  const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    onUpdatePropertyValue(e.target.checked);
  };

  return <input type="checkbox" checked={checked} onChange={updateValue} />;
};

export default Checkbox;
