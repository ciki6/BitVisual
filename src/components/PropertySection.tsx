// PropertySection.tsx
import React, { useState } from "react";
import PropertyInput from "./PropertyInput";

const getNestedValue = (obj: any, path: string[]) => {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
};

interface PropertySectionProps {
  item: any;
  formData: any;
  onChange: (key: string, value: any) => void;
  onAction: (action: string, param: any) => void;
  parentPath?: string; // 父级路径
}

const PropertySection: React.FC<PropertySectionProps> = ({ item, formData, onChange, onAction, parentPath = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen((prev) => !prev);
  };

  const hasChildren = item.children;

  // 拼接当前路径：如果有父级路径，拼接父级路径和当前 item.name
  const currentPath = parentPath ? `${parentPath}.${item.name}` : item.name;
  const namePath = currentPath.split(".");
  const value = getNestedValue(formData, namePath); // 从 formData 中获取嵌套值

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {hasChildren && (
          <span onClick={toggleSection} style={{ cursor: "pointer", marginRight: 8 }}>
            {isOpen ? "▼" : "►"}
          </span>
        )}
        {hasChildren && <strong>{item.displayName}</strong>}
        {item.action &&
          item.action.map((act: any, index: number) => (
            <button type="button" key={index} style={{ backgroundColor: act.style, marginLeft: 10, color: "#fff" }} onClick={() => onAction(act.action, act.param)}>
              {act.text}
            </button>
          ))}
      </div>
      {isOpen && hasChildren && (
        <div style={{ paddingLeft: 20 }}>
          {item.children.map((child: any) => (
            <PropertySection
              key={child.name}
              item={child}
              formData={formData}
              onChange={onChange}
              onAction={onAction}
              parentPath={currentPath} // 将当前路径传递下去
            />
          ))}
        </div>
      )}
      {!hasChildren && (
        <PropertyInput
          name={currentPath} // 传递完整路径
          displayName={item.displayName}
          type={item.type}
          value={value}
          placeholder={item.placeholder}
          options={item.options}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default PropertySection;
