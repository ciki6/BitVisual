import OptionType from "lib/base/optionType";

type BasicProperty = {
  code: string;
  displayName: string;
  type: string;
  className: string;
  frame: [number, number, number, number];
  isVisible: boolean;
  translateZ: boolean;
  needSync: boolean;
  zIndex: number;
  scale: number;
  isSendData: boolean;
  isAnimate: boolean;
  isDataLinked: boolean;
};

export type BaseProperty = {
  basic: BasicProperty;
  [key: string]: any;
};

export type ComponentProperty = {
  basic: Partial<BasicProperty>;
  [key: string]: any;
};

type PropertyAction = {
  text: string;
  style: "blue" | "red";
  action: string;
  param: any[];
};

type selectOption = {
  name: string;
  value: string;
};

type rangeOption = {
  max: number;
  min: number;
};

export type PropertyDictionaryItem = {
  name: string;
  displayName: string;
  description?: string;
  type?: OptionType;
  show?: boolean;
  editable?: boolean;
  children?: PropertyDictionaryItem[];
  placeholder?: string[];
  options?: selectOption[] | rangeOption;
  rules?: string;
  value?: any;
  action?: PropertyAction[];
  unit?: string;
};
