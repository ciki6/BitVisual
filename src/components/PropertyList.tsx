import React from "react";
import PropertyItem from "./PropertyItem";
import { PropertyDictionaryItem } from "lib/types/property";

interface Props {
  propertyDic: PropertyDictionaryItem[];
  property: Record<string, any>;
  onUpdateProperty: (name: string, value: any) => void;
}

const PropertyGroup: React.FC<Props> = ({ propertyDic, property, onUpdateProperty }) => {
  const propertyValue = (group: string, name: string): any => property[group]?.[name];

  const handlePropertyValueUpdate = (value: any, name: string) => {
    onUpdateProperty(name, value);
  };

  return (
    <div>
      {propertyDic.map((group) => (
        <div key={group.name}>
          {group.displayName}
          {group.children?.map((item) => (
            <PropertyItem key={item.name} propertyDic={item} propertyValue={propertyValue(group.name, item.name)} propertyName={`${group.name}.${item.name}`} onUpdatePropertyValue={handlePropertyValueUpdate} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default PropertyGroup;
