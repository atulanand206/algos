import { w3cwebsocket as W3CWebSocket } from "websocket";

export class WebSckts {

  static _instance: WebSckts
  client: W3CWebSocket

  constructor() {
    this.client = new W3CWebSocket(`ws://${window.location.host}/ws`);
    if (WebSckts._instance) {
      return WebSckts._instance
    }
    WebSckts._instance = this
  }

  public init() {
    this.client.onopen = () => {
      console.log('WebSocket client connected');
      const obj = JSON.stringify({
        "id": "ef60f971-f5ff-4772-9e83-ea6e65af2061",
        "name": "James",
        "email": "cat@ge.com"
      })
      console.log(obj)
      this.client.send(obj)
    };
    this.client.onmessage = (message) => {
      console.log(message);
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
}