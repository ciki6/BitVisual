import React, { useState, useEffect } from "react";
import PropertyItem from "./PropertyItem";
import { PropertyDictionaryItem } from "lib/types/property";

interface Props {
  propertyDic: PropertyDictionaryItem[];
  property: Record<string, any>;
  onUpdateProperty: (name: string, value: any) => void;
}

const PropertyGroup: React.FC<Props> = ({ propertyDic, property, onUpdateProperty }) => {
  const [collapsed, setCollapsed] = useState<boolean[]>([]);

  useEffect(() => {
    setCollapsed(propertyDic.map(() => false));
  }, [propertyDic]);

  const propertyValue = (group: string, name: string): any => property[group]?.[name];

  const handlePropertyValueUpdate = (value: any, name: string) => {
    onUpdateProperty(name, value);
  };

  const toggleGroupCollapse = (index: number) => {
    setCollapsed((prev) => prev.map((isCollapsed, i) => (i === index ? !isCollapsed : isCollapsed)));
  };

  return (
    <div>
      {propertyDic.map((group, index) => (
        <div key={group.name}>
          <div>
            {group.displayName}
            <span
              className="btn"
              onClick={() => {
                toggleGroupCollapse(index);
              }}>
              {collapsed[index] ? "🔽" : "🔼"}
            </span>
            {group.hasOwnProperty("action") && <button>新增</button>}
          </div>
          {!collapsed[index] && (
            <div>
              {group.children?.map((item) => (
                <PropertyItem key={item.name} propertyDic={item} propertyValue={propertyValue(group.name, item.name)} propertyName={`${group.name}.${item.name}`} onUpdatePropertyValue={handlePropertyValueUpdate} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PropertyGroup;
