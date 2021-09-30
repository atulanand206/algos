import { IMessageEvent, w3cwebsocket as W3CWebSocket } from "websocket";
import { Action } from "./Action";

type WebScktsMessage = {
  action: string
  content: string
}

export class WebSckts {

  static _instance: WebSckts
  client: W3CWebSocket

  handlers = new Map()

  constructor() {
    this.client = new W3CWebSocket(`ws://${window.location.hostname}:${5000}/ws`);
    this.init()
    if (WebSckts._instance) {
      return WebSckts._instance
    }
    WebSckts._instance = this
  }

  private static register(action: Action, handler: (msg: string) => void) {
    this._instance.handlers.set(action, handler)
  }

  private static send(message: string) {
    if (this._instance === undefined) return
    if (this.isConnected()) this._instance.client.send(message)
  }

  public static sendAndReceive(requestAction: Action, requestObj: string, responseAction: Action, onResponse: (response: string) => void) {
    const request = { action: Action.toString(requestAction), content: JSON.stringify(requestObj) }
    WebSckts.register(responseAction, (response) => {
      onResponse(response)
    })
    WebSckts.send(JSON.stringify(request))
  }

  private init() {
    this.client.onopen = () => {
      console.log('WebSocket client connected');
    }
    this.client.onclose = () => {
      console.log('WebSocket connection closed')
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
      var action = Action.fromString(wbms.action)
      if (this.handlers.has(action)) {
        this.handlers.get(action)(message)
      }
    } catch (e) { }
  }

  private static isConnected() {
    return WebSckts._instance !== undefined && WebSckts._instance.client.OPEN
  }
}