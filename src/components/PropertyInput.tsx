import React from "react";
import "./PropertyInput.css";

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
  const fonts = ["宋体", "黑体", "微软雅黑", "楷体", "仿宋"];
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
  const handleObjectChange = (key: string, newValue: any) => {
    let updatedValue = value;
    updatedValue[key] = newValue;
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
    case "Font":
      return (
        <div>
          <label>{displayName}:</label>
          <div className="font-container">
            <div className="font-item">
              <select value={value.family || ""} onChange={(e) => handleObjectChange("family", String(e.target.value))}>
                {fonts.map((font: string, index: number) => (
                  <option key={index} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>
            <div className="font-item">
              <input value={value.size || ""} style={{ width: "50px" }} onChange={(e) => handleObjectChange("size", String(e.target.value))} />
              px
            </div>
            <div className="font-item">
              <input type="color" value={value.color || ""} onChange={(e) => handleObjectChange("color", String(e.target.value))} />
            </div>
            <div className="font-item">
              <button type="button" className={value.bolder ? "font-selected" : "font-unselected"} onClick={() => handleObjectChange("bolder", !value.bolder)}>
                加粗
              </button>
            </div>
            <div className="font-item">
              <button type="button" className={value.italic ? "font-selected" : "font-unselected"} onClick={() => handleObjectChange("bolder", !value.italic)}>
                倾斜
              </button>
            </div>
            <div className="font-item">
              <button type="button" className={value.underline ? "font-selected" : "font-unselected"} onClick={() => handleObjectChange("bolder", !value.underline)}>
                下划线
              </button>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default PropertyInput;
