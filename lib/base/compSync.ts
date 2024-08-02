import ComponentBase from "./componentBase";

class SyncModule {
  constructor(private instance: ComponentBase) {}

  sendMessageByWS(this: ComponentBase, message: string) {
    let centralManager = window.centralManager;
    let webSocket = this.webSocket;

    centralManager.sendMessage(webSocket, message);
  }

  initEventSync() {
    if (!this.instance.webSocket) {
      this.instance.webSocket = window.centralManager.eventSynchronization(this.instance.id, (data: any) => {
        this.eventSyncProcess(data);
      });
    }
  }

  eventSyncProcess(_data: any) {}
}

export default SyncModule;
