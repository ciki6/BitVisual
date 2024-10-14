import React, { useState } from "react";
import PropertyInput from "./PropertyInput";

interface Action {
  text: string;
  style: string;
  action: string;
  param: any;
}

interface PropertySectionProps {
  item: any; // 定义属性字典项
  formData: any; // 定义实际数据项
  onChange: (key: string, value: any) => void;
  onAction: (action: string, param: any) => void; // 用于处理按钮点击事件
  parentPath?: string; // 父级路径
}

const getNestedValue = (obj: any, path: string[]) => {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
};

const PropertySection: React.FC<PropertySectionProps> = ({ item, formData, onChange, onAction, parentPath = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen((prev) => !prev);
  };

  const hasChildren = item.children && item.children.length > 0; // 检查是否有子项

  // 拼接当前路径：如果有父级路径，拼接父级路径和当前 item.name
  const currentPath = parentPath ? `${parentPath}.${item.name}` : item.name;
  const namePath = currentPath.split(".");
  const value = getNestedValue(formData, namePath); // 获取嵌套值

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {hasChildren && (
          <span onClick={toggleSection} style={{ cursor: "pointer", marginRight: 8 }}>
            {isOpen ? "▼" : "►"} {/* 只有有子项时才显示箭头 */}
          </span>
        )}
        {hasChildren && <strong>{item.displayName}</strong>} {/* 只有有子项时才显示名称 */}
        {/* 如果有 actions，则渲染按钮 */}
        {item.actions &&
          item.actions.map((action: Action, index: number) => (
            <button
              key={index}
              style={{ backgroundColor: action.style, marginLeft: 10 }} // 按钮与 displayName 同行并有间距
              onClick={() => onAction(action.action, action.param)}>
              {action.text}
            </button>
          ))}
      </div>
      {isOpen &&
        hasChildren && ( // 只在展开时显示子项
          <div style={{ paddingLeft: 20 }}>
            {item.children.map((child: any) => (
              <PropertySection key={child.name} item={child} formData={formData} onChange={onChange} onAction={onAction} parentPath={currentPath} />
            ))}
          </div>
        )}
      {!hasChildren && (
        <div>
          <PropertyInput name={item.name} displayName={item.displayName} type={item.type} value={value} placeholder={item.placeholder} options={item.options} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

export default PropertySection;
