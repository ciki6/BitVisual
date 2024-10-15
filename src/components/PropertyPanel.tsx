// PropertyPanel.tsx
import React from "react";
import PropertySection from "./PropertySection";

interface PropertyPanelProps {
  property: any;
  propertyDic: any;
  onChange: (key: string, value: any) => void; // 传递键和值
  onAction: (action: string, param: any) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ property, propertyDic, onChange, onAction }) => {
  const handleChange = (key: string, value: any) => {
    onChange(key, value); // 直接传递键和值
  };

  return (
    <form>
      {propertyDic.map((item: any) => (
        <PropertySection key={item.name} item={item} formData={property} onChange={handleChange} onAction={onAction} />
      ))}
    </form>
  );
};

export default PropertyPanel;
