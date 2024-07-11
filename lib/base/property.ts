import { BaseProperty, PropertyDictionaryItem } from "../types/property";

type Callback = (path: string, value: any) => void;

class PropertyManager {
  private property: BaseProperty;
  private propertyDic: PropertyDictionaryItem[];
  private callbacks: Callback[] = [];

  constructor(initialProperty: BaseProperty, initialPropertyDic: PropertyDictionaryItem[]) {
    // 确保 property 中的 basic 属性存在
    if (!initialProperty.basic) {
      throw new Error("The 'basic' property is required.");
    }
    this.property = this.createProxy(initialProperty);
    this.propertyDic = initialPropertyDic; // 使用传入的属性字典或空对象
  }

  private createProxy(target: any, path: string[] = []): any {
    const self = this;

    return new Proxy(target, {
      get(target, key) {
        const prop = target[key];
        if (typeof prop === "object" && prop !== null) {
          return self.createProxy(prop, path.concat(String(key)));
        }
        return prop;
      },
      set(target, key, value) {
        target[key] = value;
        const fullPath = path.concat(String(key)).join(".");
        self.triggerCallbacks(fullPath, value);
        return true;
      },
    });
  }

  private triggerCallbacks(path: string, value: any) {
    for (const callback of this.callbacks) {
      callback(path, value);
    }
  }

  public set(path: string, value: any) {
    const keys = path.split(".");
    let obj: any = this.property;
    while (keys.length > 1) {
      const key = keys.shift();
      if (key === undefined) {
        throw new Error(`Property ${key} does not exist on the object.`);
      } else {
        if (obj[key] === undefined) {
          throw new Error(`Property ${key} does not exist on the object.`);
        }
        obj = obj[key];
      }
    }
    obj[keys[0]] = value;
  }

  public getProperty(path: string): any {
    const keys = path.split(".");
    let obj = this.property;
    for (const key of keys) {
      if (obj[key] === undefined) {
        return undefined;
      }
      obj = obj[key];
    }
    return obj;
  }

  public onPropertyChange(callback: Callback) {
    this.callbacks.push(callback);
  }

  public getPropertyDictionary(): PropertyDictionaryItem[] {
    return this.propertyDic;
  }

  public getPropertyList(): BaseProperty {
    return this.property;
  }
}

export default PropertyManager;

// 使用示例
// const initialProperty: BaseProperty = {
//   basic: {
//     code: "",
//     displayName: "",
//     type: "",
//     className: "",
//     frame: [0, 0, 1920, 1080],
//     isVisible: true,
//     translateZ: true,
//     needSync: false,
//     zIndex: 0,
//     scale: 1,
//     isSendData: false,
//     isAnimate: false,
//     isDataLinked: false,
//   },
//   optionalProperty: {
//     exampleKey: "exampleValue",
//   },
// };

// const initialPropertyDic: PropertyDictionary = {
//   exampleDicKey: "exampleDicValue",
// };

// const propertyManager = new PropertyManager(initialProperty, initialPropertyDic);

// // 添加属性变化监听
// propertyManager.onPropertyChange((path, value) => {
//   console.log(`Property changed: ${path} = ${value}`);
// });

// // 设置属性
// propertyManager.set("basic.code", "qwe");

// // 获取属性
// console.log(propertyManager.getProperty("basic.code")); // 输出: 'qwe'

// // 获取属性字典
// console.log(propertyManager.getPropertyDictionary()); // 输出: { exampleDicKey: 'exampleDicValue' }
