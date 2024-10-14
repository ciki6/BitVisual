// PropertyInput.tsx
import React from "react";

interface SelectOption {
  name: string;
  value: any;
}

interface RangeOption {
  min: number;
  max: number;
}

interface PropertyInputProps {
  name: string;
  displayName: string;
  type: string; // 现在是字符串类型
  value: any;
  options?: SelectOption[] | RangeOption;
  placeholder?: string[];
  onChange: (key: string, value: any) => void;
}

const PropertyInput: React.FC<PropertyInputProps> = ({ name, displayName, type, value, options, placeholder, onChange }) => {
  const handleChange = (index: number, newValue: any) => {
    const updatedValue = [...(value || [])]; // 创建数组的副本
    updatedValue[index] = newValue;
    onChange(name, updatedValue); // 更新整个数组
  };

  switch (type) {
    case "String":
      return (
        <div>
          <label>{displayName}:</label>
          <input type="text" value={value || ""} placeholder={placeholder?.[0]} onChange={(e) => onChange(name, e.target.value)} />
        </div>
      );
    case "Boolean":
      return (
        <div>
          <label>{displayName}:</label>
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(name, e.target.checked)} />
        </div>
      );
    case "Int":
    case "Double":
      return (
        <div>
          <label>{displayName}:</label>
          <input type="number" value={value || ""} placeholder={placeholder?.[0]} onChange={(e) => onChange(name, e.target.value)} />
        </div>
      );
    case "DoubleArray":
      return (
        <div>
          <label>{displayName}:</label>
          {placeholder?.map((place, index) => (
            <div key={index}>
              <label>{place}:</label>
              <input type="number" value={value?.[index] || ""} placeholder={place} onChange={(e) => handleChange(index, Number(e.target.value))} />
            </div>
          ))}
        </div>
      );
    case "Range":
      if (options) {
        const { min, max } = options as RangeOption;
        return (
          <div>
            <label>{displayName}:</label>
            <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(name, e.target.value)} />
            <span>{value}</span>
          </div>
        );
      }
      break;
    case "Select":
      if (options) {
        return (
          <div>
            <label>{displayName}:</label>
            <select value={value || ""} onChange={(e) => onChange(name, e.target.value)}>
              {(options as SelectOption[]).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        );
      }
      break;
    // 处理其他类型...
    default:
      return null;
  }
};

export default PropertyInput;
