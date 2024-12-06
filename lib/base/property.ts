import { BaseProperty, PropertyDictionaryItem } from "../types/compProperty";
import * as _ from "lodash";

type Callback = (path: string, value: any) => void;

class PropertyManager {
  private property: BaseProperty;
  private propertyDic: PropertyDictionaryItem[];
  private callbacks: Callback[] = [];

  constructor(initialProperty: BaseProperty, initialPropertyDic: PropertyDictionaryItem[]) {
    if (!initialProperty.basic) {
      throw new Error("The 'basic' property is required.");
    }
    this.property = this.createProxy(initialProperty);
    this.propertyDic = initialPropertyDic;
  }

  private createProxy(target: any, path: string[] = []): any {
    const self = this;

    return new Proxy(target, {
      get(target, key) {
        const prop = Reflect.get(target, key);
        if (typeof prop === "object" && prop !== null) {
          return self.createProxy(prop, path.concat(String(key)));
        }
        return prop;
      },
      set(target, key, value) {
        const result = Reflect.set(target, key, value);
        if (result) {
          const fullPath = path.concat(String(key)).join(".");
          self.triggerCallbacks(fullPath, value);
        }
        return result;
      },
    });
  }

  private triggerCallbacks(path: string, value: any) {
    for (const callback of this.callbacks) {
      callback(path, value);
    }
  }

  public set(pathOrObject: string | Partial<BaseProperty>, value?: any) {
    if (typeof pathOrObject === "string") {
      this.setPropertyByPath(pathOrObject, value);
    } else {
      this.setPropertyByObject(pathOrObject);
    }
  }

  private setPropertyByPath(path: string, value: any) {
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
    console.log(this.property, "propertyManager");
  }

  private setPropertyByObject(newProperties: Partial<BaseProperty>) {
    const changedPaths: string[] = [];

    const compareAndUpdate = (oldObj: any, newObj: any, path: string[] = []) => {
      for (const key in newObj) {
        if (newObj.hasOwnProperty(key)) {
          const fullPath = [...path, key].join(".");
          if (_.isObject(newObj[key]) && !_.isArray(newObj[key])) {
            compareAndUpdate(oldObj[key], newObj[key], [...path, key]);
          } else if (!_.isEqual(oldObj[key], newObj[key])) {
            oldObj[key] = newObj[key];
            changedPaths.push(fullPath);
          }
        }
      }
    };

    compareAndUpdate(this.property, newProperties);

    for (const path of changedPaths) {
      const value = this.getProperty(path);
      this.triggerCallbacks(path, value);
    }
  }

  public addProperty(property: any, propertyDic?: PropertyDictionaryItem[]) {
    this.property = this.createProxy(_.merge({}, this.property, property));
    if (propertyDic) {
      this.propertyDic = [...this.propertyDic, ...propertyDic];
    }
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

  public getPropertyDictionaryByPath(path: string): PropertyDictionaryItem | undefined {
    const keys = path.split(".");
    let dicItems = this.propertyDic;
    for (const key of keys) {
      const foundItem = dicItems.find((item) => item.name === key);
      if (!foundItem) {
        return undefined;
      }
      if (foundItem.children && keys.indexOf(key) !== keys.length - 1) {
        dicItems = foundItem.children;
      } else {
        return foundItem;
      }
    }
    return undefined;
  }
}

export default PropertyManager;
