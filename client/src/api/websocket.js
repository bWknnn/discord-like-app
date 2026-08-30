import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";

import { WS_URL } from "./constants";

let stompClient = null;

export function connect(onConnected, onDisconnected) {
  if (stompClient?.connected) {
    if (onConnected) onConnected();
    return;
  }

  stompClient = new Client({
    webSocketFactory: () => new SockJS(WS_URL, null, { withCredentials: true }),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("WebSocket connected!");
      if (onConnected) onConnected();
    },
    onWebSocketClose: () => {
      console.log("WebSocket disconnected!");
      if (onDisconnected) onDisconnected();
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

export function sendMessage(channelUid, text) {
  if (!stompClient || !stompClient.connected) return;

  stompClient.publish({
    destination: `/send/messages/${channelUid}`,
    body: text,
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

export function subscribeToVoiceParticipants(channelUid, onParticipantsUpdate) {
  if (!stompClient || !stompClient.connected) return null;

  return stompClient.subscribe(`/channels/voice/${channelUid}`, (message) => {
    const parsed = JSON.parse(message.body);
    onParticipantsUpdate(parsed);
  });
}

export function joinVoiceChannel(channelUid) {
  if (!stompClient || !stompClient.connected) return;

  stompClient.publish({
    destination: `/send/voice/join/${channelUid}`,
  });
}

export function leaveVoiceChannel(channelUid) {
  if (!stompClient || !stompClient.connected) return;

  stompClient.publish({
    destination: `/send/voice/leave/${channelUid}`,
  });
}

export function subscribeToWebRTCSignaling(userUid, onSignalReceived) {
  if (!stompClient || !stompClient.connected) return null;

  return stompClient.subscribe(`/channels/voice/signal/${userUid}`, (message) => {
    const parsed = JSON.parse(message.body);
    onSignalReceived(parsed);
  });
}

export function sendWebRTCSignal(signalData) {
  if (!stompClient || !stompClient.connected) return;

  stompClient.publish({
    destination: "/send/voice/signal",
    body: JSON.stringify(signalData),
  });
}

export function syncVoiceParticipants(channelUid) {
  if (!stompClient || !stompClient.connected) return;

  stompClient.publish({
    destination: `/send/voice/sync/${channelUid}`,
  });
}
