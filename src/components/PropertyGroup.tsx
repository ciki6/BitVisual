import React, { useState, useEffect } from "react";
import PropertyItem from "./PropertyItem";
import { PropertyDictionaryItem } from "lib/types/property";

interface Props {
  propertyDic: PropertyDictionaryItem[];
  property: Record<string, any>;
  updateProperty: (name: string, value: any) => void;
}

const PropertyGroup: React.FC<Props> = ({ propertyDic, property, updateProperty }) => {
  const [collapsed, setCollapsed] = useState<boolean[]>([]);

  useEffect(() => {
    setCollapsed(propertyDic.map(() => false));
  }, [propertyDic]);

  const toggleGroupCollapse = (index: number) => {
    setCollapsed((prev) => prev.map((isCollapsed, i) => (i === index ? !isCollapsed : isCollapsed)));
  };

  const renderChildren = (children: PropertyDictionaryItem[]) => {
    return children.map((item) => {
      const propertyName = item.name;
      const fullPropertyName = item.children ? `${propertyName}` : propertyName;

      return (
        <div key={item.name}>
          <PropertyItem propertyDic={item} propertyName={fullPropertyName} property={property[propertyName]} updateProperty={updateProperty} />
          {item.children && <div style={{ marginLeft: "20px" }}>{renderChildren(item.children)}</div>}
        </div>
      );
    });
  };

  return (
    <div>
      {propertyDic.map((group, index) => (
        <div key={group.name}>
          <div>
            {group.displayName}
            <span className="btn" onClick={() => toggleGroupCollapse(index)}>
              {collapsed[index] ? "🔽" : "🔼"}
            </span>
          </div>
          {!collapsed[index] && <div>{renderChildren(group.children!)}</div>}
        </div>
      ))}
    </div>
  );
};

export default PropertyGroup;
