import type ComponentProperty, { PropertyDictionaryItem } from "./compProperty";
export interface ComponentOption {
  property?: ComponentProperty;
  propertyDictionary?: PropertyDictionaryItem[];
  compDataBind?: Record<string, any>;
  compAnimation?: Record<string, any>;
  compScript?: Record<string, any>;
  compInteract?: Record<string, any>;
  compData?: Record<string, any>;
  resourceId?: string;
  compVersion?: string;
  unionGroup?: string;
}
