import React, { useEffect, useState } from "react";
import InputCheckbox from "./InputCheckbox";
import InputNumber from "./InputNumber";
import InputArray from "./InputArray";
import InputRange from "./InputRange";

import { PropertyDictionaryItem } from "lib/types/property";

interface Props {
  propertyDic: PropertyDictionaryItem;
  propertyValue: any;
  propertyName: string;
  onUpdatePropertyValue: (newValue: any, propertyName: string) => void;
}

const PropertyItem: React.FC<Props> = ({ propertyDic, propertyValue, propertyName, onUpdatePropertyValue }) => {
  const [value, setValue] = useState(propertyValue);

  useEffect(() => {
    setValue(propertyValue);
  }, [propertyValue]);

  const getInputComponent = (type: string | undefined): React.ElementType | string => {
    switch (type) {
      case "String":
        return "input";
      case "Boolean":
        return InputCheckbox;
      case "Int":
      case "Double":
        return InputNumber;
      case "DoubleArray":
        return InputArray;
      case "Range":
        return InputRange;
      default:
        return "input";
    }
  };

  const shouldShowField = (field: PropertyDictionaryItem) => {
    return field.show;
  };

  const valueUpdate = (newVal: any) => {
    setValue(newVal);
    onUpdatePropertyValue(newVal, propertyName);
  };

  const InputComponent = getInputComponent(propertyDic.type);

  return (
    shouldShowField(propertyDic) && (
      <div>
        <div>{propertyDic.displayName}</div>
        {typeof InputComponent === "string" ? <input value={value} onChange={(e) => valueUpdate(e.target.value)} disabled={!propertyDic.editable} /> : <InputComponent propertyDic={propertyDic} propertyValue={value} onUpdatePropertyValue={valueUpdate} disabled={!propertyDic.editable} />}
      </div>
    )
  );
};

export default PropertyItem;
