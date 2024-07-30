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
  [key: string]: any; // 其他可选属性
};

export type PropertyDictionaryItem = {
  name: string;
  displayName: string;
  description: string;
  type?: OptionType;
  show: boolean;
  editable: boolean;
  children?: PropertyDictionaryItem[];
  placeholder?: string[];
  options?: [];
  rules?: string;
  value?: any;
};
