import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";

import { WS_URL } from "./constants";

let stompClient = null;

export function connect(onConnected) {
  if (stompClient?.connected) {
    if (onConnected) onConnected();
    return;
  }

  stompClient = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
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

export function subscribeToServer(serverId, onChannelReceived) {
  if (!stompClient || !stompClient.connected) return null;

  return stompClient.subscribe(`/servers/${serverId}/channels`, (message) => {
    const parsed = JSON.parse(message.body);
    onChannelReceived(parsed);
  });
}

export function sendChannel(channel) {
  if (!stompClient || !stompClient.connected) return;

  stompClient.publish({
    destination: "/send/channel",
    body: JSON.stringify(channel),
  });
}

export function disconnect() {
  if (stompClient) {
    stompClient.deactivate();
  }
}
