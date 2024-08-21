// PropertyGroup.tsx
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

  return (
    <div>
      {propertyDic.map((group, index) => (
        <div key={group.name}>
          <div>
            {group.displayName}
            <span className="btn" onClick={() => toggleGroupCollapse(index)}>
              {collapsed[index] ? "🔽" : "🔼"}
            </span>
            {group.hasOwnProperty("action") && <button>新增</button>}
          </div>
          {!collapsed[index] && (
            <div>
              {group.children?.map((item) => (
                <PropertyItem key={item.name} propertyDic={item} propertyName={`${group.name}.${item.name}`} property={property} updateProperty={updateProperty} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PropertyGroup;
