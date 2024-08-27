export {};

declare global {
  interface Window {
    centralManager: any;
    wiscomWebSocket: any;
    meetingId: string;
    controlledUsers: any;
    commandType: any;
    clientID: any;
    screenOverload: any;
    dataSourceStompClients: any;
    WisActionLoader: any;
    initAPIPromise: any;
  }
}
