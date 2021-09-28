import { IMessageEvent, w3cwebsocket as W3CWebSocket } from "websocket";

export enum Action {
  Begin,
  Join,
  Start,
  Reveal,
  Attempt,
  Score,
  Next,
  Over,
  Extend,
  S_Game,
  S_Player,
  S_Question,
  S_Answer,
  S_Over,
  Failure
}

type WebScktsMessage = {
  action: Action
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

  public static register(action: Action, handler: (msg: string) => void) {
    this._instance.handlers.set(action, handler)
  }

  public static send(message: string) {
    if (this._instance === undefined) return
    if (this.isConnected()) this._instance.client.send(message)
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
      if (this.handlers.has(wbms.action)) {
        this.handlers.get(wbms.action)(message)
      }
    } catch (e) { }
  }

  private static isConnected() {
    return WebSckts._instance !== undefined && WebSckts._instance.client.OPEN
  }
}