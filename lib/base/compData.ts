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
    if (this.instance.processFunction && this.instance.recordData && JSON.stringify(this.instance.recordData) !== "{}") {
      Object.values(this.instance.recordData).forEach((each) => {
        this.instance.processFunction(each);
      });
    }
  }

  subscribeDataSource(processFunction: Function): void {
    this.instance.processFunction = processFunction;
    if (JSON.stringify(this.instance.dataBind) === "{}" || this.instance.workMode === 4) return;
    window.wiscomWebSocket.subscribeData(this.instance.code, this.instance.resourceId, (data: any) => {
      if (data.body === "OK") {
        this.instance.isSubscribeData = true;
        return;
      }
      if (this.instance.propertyManager.getProperty("basic.isSendData")) {
        this.postData(JSON.parse(JSON.parse(data.body).data), "sendData");
      }
      for (let i = 0; i < this.instance.getDataScripts.length; i++) {
        try {
          eval(this.instance.getDataScripts[i]);
        } catch (error) {
          console.log(`脚本error=${error}:${this.instance.getDataScripts[i]}`);
        }
      }
      if (!this.instance.onlyRecordData) {
        let temp = JSON.parse(data.body);
        this.instance.recordData[temp.group] = data;
        return;
      }
      //执行回调方法
      if (processFunction) {
        processFunction(data);
      }
      if (this.instance.workMode === 3) {
        this.unsubscribeDataSource();
        this.unsubscribeDataByClient();
      }
      setTimeout(() => {
        if (!this.instance.isSubscribeData) {
          this.subscribeDataSource(processFunction);
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

  setData(data: any) {
    data.forEach((d: any) => {
      this.instance.processFunction(d);
    });
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
