import { ICloseEvent, IMessageEvent, w3cwebsocket as W3CWebSocket } from "websocket";
import { Action } from "./Action";

type WebScktsMessage = {
  action: string
  content: string
}

export class WebSckts {

  static _instance: WebSckts
  client: W3CWebSocket
  websocketUrl: string = `${process.env.REACT_APP_WEBSOCKETS_SCHEME}://${window.location.hostname}:${5000}/ws`

  handlers = new Map()

  constructor() {
    this.client = new W3CWebSocket(this.websocketUrl);
    this.init()
    if (WebSckts._instance) {
      return WebSckts._instance
    }
    WebSckts._instance = this
  }

  public static register(action: Action, handler: (msg: string) => void) {
    this._instance.handlers.set(Action.toString(action), handler)
  }

  private static sendMessage(message: string) {
    if (this._instance === undefined) return
    if (this.isConnected()) this._instance.client.send(message)
  }

  public static send(requestAction: Action, requestObj: string) {
    const request = { action: Action.toString(requestAction), content: requestObj.toString() };
    WebSckts.sendMessage(JSON.stringify(request));
  }

  private init() {
    this.client.onopen = () => {
      console.log('WebSocket client connected');
    }
    this.client.onclose = (event: ICloseEvent) => {
      console.log('WebSocket connection closed')
      console.log(event)
    }
    this.client.onmessage = (message) => {
      this.onMessage(message)
    }
    this.client.onerror = (e: Error) => {
      console.log('WebSocket connection error ', e)
    }
  }

  private onMessage(message: IMessageEvent) {
    try {
      var wbms: WebScktsMessage = JSON.parse(message.data.toString())
      var action = wbms.action
      if (this.handlers.has(action)) {
        this.handlers.get(action)(wbms.content)
      }
    } catch (e) { }
  }

  private static isConnected() {
    return WebSckts._instance !== undefined && WebSckts._instance.client.OPEN
  }
}