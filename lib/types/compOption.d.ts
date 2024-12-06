import type ComponentProperty from "./compProperty";
export interface ComponentOption {
  property?: Record<string, ComponentProperty>;
  compDataBind?: Record<string, any>;
  compAnimation?: Record<string, any>;
  compScript?: Record<string, any>;
  compInteract?: Record<string, any>;
  compData?: Record<string, any>;
  resourceId?: string;
}
