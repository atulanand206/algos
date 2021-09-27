import { w3cwebsocket as W3CWebSocket } from "websocket";

enum Action {
  Begin,
  Join,
  Start,
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

  constructor() {
    this.client = new W3CWebSocket(`ws://${window.location.hostname}:${5000}/ws`);
    console.log("Websockets constructed")
    if (WebSckts._instance) {
      return WebSckts._instance
    }
    WebSckts._instance = this
  }

  public init() {
    this.client.onopen = () => {
      console.log('WebSocket client connected');
    };
    this.client.onmessage = (message) => {
      console.log(message);
      var wbms: WebScktsMessage = JSON.parse(message.data.toString())
      console.log(wbms)
    };
    this.client.onclose = () => {
      console.log('WebSocket connection closed')
    }
    this.client.onerror = (e: Error) => {
      console.log(e)
    }
  }

  public send(message: string) {
    this.client.send(message)
  }

  public isConnected() {
    return WebSckts._instance !== undefined && WebSckts._instance.client.OPEN
  }
}