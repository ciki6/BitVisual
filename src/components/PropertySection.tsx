// PropertySection.tsx
import React, { useState } from 'react';
import PropertyInput from './PropertyInput';

interface PropertySectionProps {
  item: any; // 可以更精确地定义类型
  formData: any; // 可以更精确地定义类型
  onChange: (key: string, value: any) => void;
}

const PropertySection: React.FC<PropertySectionProps> = ({ item, formData, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen((prev) => !prev);
  };

  const hasChildren = item.children && item.children.length > 0; // 检查是否有子项

  return (
    <div>
      {hasChildren && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span onClick={toggleSection} style={{ cursor: 'pointer', marginRight: 8 }}>
            {isOpen ? '▼' : '►'} {/* 只有有子项时才显示箭头 */}
          </span>
          <strong>{item.displayName}</strong></div>
      )}
      {isOpen && hasChildren && ( // 只在展开时显示子项
        <div style={{ paddingLeft: 20 }}>
          {item.children.map((child: any) => (
            <PropertySection key={child.name} item={child} formData={formData} onChange={onChange} />
          ))}
        </div>
      )}
      {!hasChildren && ( // 如果没有子项，则直接显示输入框
        <PropertyInput {...item} value={formData[item.name]} onChange={onChange} />
      )}
    </div>
  );
};

export default PropertySection;
