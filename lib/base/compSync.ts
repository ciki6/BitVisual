import ComponentBase from "./componentBase";

class SyncModule {
  constructor(private instance: ComponentBase) {}

  _sendMessageByWS(this: ComponentBase, message: string) {
    let centralManager = window.centralManager;
    let webSocket = this.webSocket;

    centralManager.sendMessage(webSocket, message);
  }

  _initEventSync() {
    if (!this.instance.webSocket) {
      this.instance.webSocket = window.centralManager.eventSynchronization(this.instance.id, (data: any) => {
        this._eventSyncProcess(data);
      });
    }
  }

  _eventSyncProcess(_data: any) {}
}

export default SyncModule;
