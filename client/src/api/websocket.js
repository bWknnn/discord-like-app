import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";

let stompClient = null;

export function connect(onConnected) {
  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("WebSocket connected!");
      if (onConnected) onConnected();
    },

    onStompError: (frame) => {
      console.error("STOMP error:", frame.headers["message"]);
    },
  });
  stompClient.activate();
}

export function subscribe(channelUid, onMessageReceived) {
  if (!stompClient || !stompClient.connected) return null;

  return stompClient.subscribe(`/channels/${channelUid}`, (message) => {
    const parsed = JSON.parse(message.body);
    onMessageReceived(parsed);
  });
}

export function sendMessage(message) {
  if (!stompClient || !stompClient.connected) return;

  stompClient.publish({
    destination: "/send/message",
    body: JSON.stringify(message),
  });
}

export function disconnect() {
  if (stompClient) {
    stompClient.deactivate();
  }
}
