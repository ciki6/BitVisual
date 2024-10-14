// PropertyPanel.tsx
import React from "react";
import PropertySection from "./PropertySection";

interface PropertyPanelProps {
  property: any;
  propertyDic: any;
  onChange: (property: any) => void;
  onAction: (action: string, param: any) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ property, propertyDic, onChange, onAction }) => {
  const handleChange = (key: string, value: any) => {
    const updatedData = { ...property, [key]: value };
    onChange(updatedData);
  };

  return (
    <form>
      {propertyDic.map((item: any) => (
        <PropertySection key={item.name} item={item} formData={property} onChange={handleChange} onAction={onAction} />
      ))}
      <button type="submit">提交</button>
    </form>
  );
};

export default PropertyPanel;
