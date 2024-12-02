import ComponentBase from "./componentBase";
import * as _ from "lodash";

class DataModule {
  constructor(private instance: ComponentBase) {}

  getRedisLinkHttpData(params: any): Promise<any> {
    let url = `${location.origin}/dataSource/addRedisLinkVariableByKey`;
    return new Promise((resolve, reject) => {
      $.ajax(url, {
        type: "POST",
        async: true,
        contentType: "application/json",
        dataType: "JSON",
        data: JSON.stringify(params),
        success: (res) => {
          resolve(res);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  addRedisLinkDataByKey(params: { scope: string; name: string; value: any }[]): Promise<any> {
    let url = `${location.origin}/dataSource/addRedisListDataByKey`;
    return new Promise((resolve, reject) => {
      $.ajax(url, {
        type: "POST",
        async: true,
        contentType: "application/json",
        dataType: "JSON",
        data: JSON.stringify(params),
        success: (res) => {
          resolve(res);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  recordDataHandler(p: Boolean) {
    if (!p) this.instance.recordData = {};
    this.instance.onlyRecordData = p;
  }

  updateByRecordData() {
    if (this.instance.recordData && JSON.stringify(this.instance.recordData) !== "{}") {
      for (const groupId in this.instance.recordData) {
        this.instance.update(this.instance.recordData[groupId], groupId);
      }
    }
  }

  subscribeDataSource(): void {
    if (JSON.stringify(this.instance.dataBind) === "{}" || this.instance.workMode === 4) return;
    window.wiscomWebSocket.subscribeData(this.instance.code, this.instance.resourceId, (data: any) => {
      const dataBody = JSON.parse(data.body);
      if (dataBody === "OK") {
        this.instance.isSubscribeData = true;
        return;
      }
      const groupId = dataBody.group;
      const compData = JSON.parse(dataBody.data);
      if (this.instance.propertyManager.getProperty("basic.isSendData")) {
        this.postData(compData, "sendData");
      }
      for (let i = 0; i < this.instance.getDataScripts.length; i++) {
        try {
          const fn = new Function(this.instance.getDataScripts[i]);
          fn();
        } catch (error) {
          console.log(`脚本error=${error}:${this.instance.getDataScripts[i]}`);
        }
      }
      if (!this.instance.onlyRecordData) {
        this.instance.recordData[groupId] = data;
        return;
      }
      this.instance.update(compData, groupId);
      if (this.instance.workMode === 3) {
        this.unsubscribeDataSource();
        this.unsubscribeDataByClient();
      }
      setTimeout(() => {
        if (!this.instance.isSubscribeData) {
          this.subscribeDataSource();
        }
      }, 7000);
    });
  }

  unsubscribeDataSource() {
    window.wiscomWebSocket && window.dataSourceStompClients && window.wiscomWebSocket.unsubscribeData(this.instance.code, this.instance.resourceId);
  }

  unsubscribeDataByClient() {
    window.wiscomWebSocket && window.dataSourceStompClients && window.wiscomWebSocket.unsubscribeDataByClient(this.instance.code, this.instance.resourceId);
  }

  setData(data: any, groupId: string) {
    try {
      this.instance.update(data, groupId);
    } catch (e) {
      console.warn("setData", `set data ${data} to component ${this.instance.id} by groupId: ${groupId} failed!`);
    }
  }

  postData(data: any, eventName: string) {
    let eventActions = this.getActionByEventName(eventName);
    if (eventActions) {
      let actions = this.processActions(eventActions, data);
      let message = { targetId: this.instance.id, actions: actions };
      window.WisActionLoader.sendActionMessage(message);
    } else {
      console.warn("postData", "can not find handler for " + eventName);
    }
  }

  private processActions(actions: any[], _data: any) {
    let oldActions = _.cloneDeep(actions);
    oldActions.forEach(function (action: any) {
      let oldParam = action.compParams;
      action.compParams = [];
      oldParam.forEach(function (param: string) {
        let evalString = param;
        //如果evalString的类型为string则去判断里面是否包含@data@字符串并做数据替换，否则直接跳过
        if (typeof evalString === "string") {
          let valueStringList = param.match(/(?<=@)_data.[^,]+(?=@)/g);
          let valueReplaceList = param.match(/@_data.[^,]+@/g);
          let valueList: any[] = [];
          if (valueStringList && valueStringList.length > 0) {
            valueStringList.forEach((eachStr: string) => {
              valueList.push(eval(eachStr));
            });
            if (valueReplaceList && valueReplaceList.length > 0) {
              for (let i = 0; i < valueReplaceList.length; i++) {
                if (valueList[i]) {
                  evalString = evalString.replace(valueReplaceList[i], valueList[i]);
                }
              }
            }
          }
        }

        action.compParams.push(evalString);
      });
    });
    return oldActions;
  }

  private getActionByEventName(eventName: string): any[] | null {
    let custom = this.instance.interact.custom;
    if (custom.hasOwnProperty(eventName)) {
      let actions: any[] = [];
      for (let i = 0; i < custom[eventName].length; i++) {
        actions = [...actions, ...custom[eventName][i].actions];
      }
      return actions;
    }
    return null;
  }
}

export default DataModule;
