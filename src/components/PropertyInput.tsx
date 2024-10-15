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
  type: string;
  value: any;
  placeholder?: string[];
  options?: SelectOption[] | RangeOption;
  onChange: (key: string, value: any) => void;
}

const PropertyInput: React.FC<PropertyInputProps> = ({ name, displayName, type, value, placeholder, options, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let newValue;
    if (type === "Boolean") {
      newValue = (e.target as HTMLInputElement).checked;
    } else {
      newValue = e.target.value;
    }
    onChange(name, newValue);
  };
  const handleArrayChange = (index: number, newValue: any) => {
    const updatedValue = [...(value || [])];
    updatedValue[index] = newValue;
    onChange(name, updatedValue);
  };

  switch (type) {
    case "String":
      return (
        <div>
          <label>{displayName}:</label>
          <input type="text" value={value || ""} placeholder={placeholder?.[0]} onChange={handleChange} />
        </div>
      );
    case "Boolean":
      return (
        <div>
          <label>{displayName}:</label>
          <input type="checkbox" checked={!!value} onChange={handleChange} />
        </div>
      );
    case "Int":
    case "Double":
      return (
        <div>
          <label>{displayName}:</label>
          <input type="number" value={value || ""} placeholder={placeholder?.[0]} onChange={handleChange} />
        </div>
      );
    case "DoubleArray":
      return (
        <div>
          <label>{displayName}:</label>
          {placeholder?.map((place, index) => (
            <div key={index}>
              <label>{place}:</label>
              <input type="number" value={value?.[index] || ""} placeholder={place} onChange={(e) => handleArrayChange(index, Number(e.target.value))} />
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
            <input type="range" min={min} max={max} value={value || min} onChange={handleChange} />
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
            <select value={value || ""} onChange={handleChange}>
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
    // 添加其他类型的处理逻辑...
    default:
      return null;
  }
};

export default PropertyInput;
