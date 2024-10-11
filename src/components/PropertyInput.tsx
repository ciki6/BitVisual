// PropertyInput.tsx
import React from 'react';
import OptionType from '../../lib/base/optionType'; // 导入 OptionType 枚举

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
  type: OptionType;
  value: any;
  options?: SelectOption[] | RangeOption;
  placeholder?: string[];
  onChange: (key: string, value: any) => void;
}

const PropertyInput: React.FC<PropertyInputProps> = ({ name, displayName, type, value, options, placeholder, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const newValue = type === OptionType.boolean ? target.checked : target.value;
    onChange(name, newValue);
  };

  switch (type) {
    case OptionType.string:
      return (
        <div>
          <label>{displayName}:</label>
          <input type="text" value={value || ''} placeholder={placeholder?.[0]} onChange={handleChange} />
        </div>
      );
    case OptionType.boolean:
      return (
        <div>
          <label>{displayName}:</label>
          <input type="checkbox" checked={!!value} onChange={handleChange} />
        </div>
      );
    case OptionType.int:
    case OptionType.double:
      return (
        <div>
          <label>{displayName}:</label>
          <input type="number" value={value || ''} placeholder={placeholder?.[0]} onChange={handleChange} />
        </div>
      );
    case OptionType.doubleArray:
      return (
        <div>
          <label>{displayName}:</label>
          <input
            type="text"
            value={value?.join(', ') || ''}
            placeholder={placeholder?.join(', ')}
            onChange={(e) => onChange(name, e.target.value.split(',').map(Number))}
          />
        </div>
      );
    case OptionType.range:
      if (options) {
        const { min, max } = options as RangeOption;
        return (
          <div>
            <label>{displayName}:</label>
            <input
              type="range"
              min={min}
              max={max}
              value={value}
              onChange={(e) => handleChange(e)}
            />
            <span>{value}</span>
          </div>
        );
      }
      break;
    case OptionType.select:
      if (options) {
        return (
          <div>
            <label>{displayName}:</label>
            <select value={value || ''} onChange={handleChange}>
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
