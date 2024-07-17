import ComponentBase from "./componentBase";
import * as $ from "jquery";
import { guid } from "./compUtil";
const CommandModule = {
  sendCommand(this: ComponentBase, params: any): void {
    params.option = $.extend(true, { showCanvas: false, recordSteps: false, isWindow: false }, params.option);
    let message = {
      actions: [
        {
          eventDisplayName: "",
          internalAnimation: [],
          eventName: params.funcName,
          compParams: params.params,
          compList: [
            {
              compName: this.id,
              compCode: this.code,
            },
          ],
          performerID: params.option.isWindow ? "window" : "",
          sceneCode: window.meetingId,
          browsers: [],
        },
      ],
      targetId: "",
      meetingId: window.meetingId,
      controlledUsers: window.controlledUsers,
      commandUUID: this.commandUUID ? this.commandUUID : guid(),
      commandType: window.commandType ? window.commandType : "",
      sessionTransNum: window.commandType == "dp" ? 0 : 1,
      clientID: window.clientID,
      showCanvas: params.option.showCanvas,
      recordSteps: params.option.recordSteps,
      resourceId: this.resourceId,
    };
    window.screenOverload.centralWebSocketHandler.centralWS.send(`5:${JSON.stringify(message)}`);
    this.commandUUID = null;
  },
};

export default CommandModule;
