import { uniqueNamesGenerator, colors, animals } from "unique-names-generator";

export class SignalingClient extends EventTarget {
  private serverUrl: string;
  private ws: WebSocket | null = null;
  private selfId: string | null = null;

  private _reconnectDelay = 1000;
  private _maxReconnectDelay = 30000;
  constructor(serverUrl: string) {
    super();
    this.serverUrl = serverUrl;
  }

  connect() {
    this.ws = new WebSocket(this.serverUrl);

    this.ws.onopen = () => {
      this._reconnectDelay = 1000;
      console.log("connected suscfuly");

      this.send({
        type: "register",
        displayName: this._getDisplayName(),
        deviceType: this._getDeviceType(),
      });
    };

    this.ws.onmessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "peers" && msg.selfId) {
        this.selfId = msg.selfId;
      }

      console.log(msg, event);
      this.dispatchEvent(new CustomEvent(msg.type, { detail: msg }));
      this.dispatchEvent(new CustomEvent("message", { detail: msg }));
    };

    this.ws.onclose = () => {
      setTimeout(() => {
        this._reconnectDelay = Math.min(
          this._reconnectDelay * 2,
          this._maxReconnectDelay,
        );
        this.connect();
      }, this._reconnectDelay);
      this.dispatchEvent(new CustomEvent("disconnected"));
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  sendTo(targetId: string, data: any) {
    this.send({ ...data, targetId });
  }

  close() {
    this.ws?.close();
  }

  _getDisplayName() {
    const key = "p2p-display-name";
    let displayName = localStorage.getItem(key);
    if (!displayName) {
      displayName = uniqueNamesGenerator({
        dictionaries: [colors, animals],
        length: 2,
      });
      localStorage.setItem(key, displayName);
    }
    return displayName;
  }

  setNewDisplayName(newname: string, peerId: string) {
    // localStorage.setItem("p2p-display-name", newname);
    this.send({
      type: "peer-name-change",
      displayName: newname,
      peerId: peerId,
    });
  }

  updateDisplayName(){
    
  }

  _getDeviceType() {
    return /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop";
  }
}
