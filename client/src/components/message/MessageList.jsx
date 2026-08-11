import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import Message from "./Message";
import { currentUser as fetchCurrentUser } from "../../api/users";
import { URL } from "../../api/constants";
import {
  connect,
  subscribe,
  sendMessage as sendWsMessage,
  disconnect,
} from "../../api/websocket";

export default function MessageList({ channel }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchCurrentUser().then(setCurrentUser);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!channel) return;

    fetch(`${URL}/messages/${channel.id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setMessages);

    connect(() => {
      subscribe(channel.id, (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
      });
    });

    return () => disconnect();
  }, [channel]);

  if (!channel || channel.type !== "text") {
    return null;
  }

  function sendMessage() {
    const text = input.trim();
    if (!text || !currentUser) return;

    sendWsMessage({
      text: text,
      senderUid: currentUser.uid,
      senderUsername: currentUser.username,
      channelUid: channel.id,
    });

    setInput("");
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-bg-main overflow-hidden">
      <div className="flex-1 overflow-y-scroll px-6 py-4 flex flex-col gap-2">
        {messages.map((msg, idx) => {
          const prev = messages[idx - 1];
          const showHeader = !prev || prev.senderUsername !== msg.senderUsername;
          return (
            <Message
              key={msg.messageUid}
              msg={msg}
              currentUser={currentUser}
              showHeader={showHeader}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 px-6 py-4 border-t border-border-dark">
        <div className="flex items-center gap-3 bg-bg-card border border-border-dark rounded-xl px-4 py-2.5 focus-within:border-accent/50 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Send message to #${channel.name}`}
            autoComplete="off"
            className="flex-1 bg-transparent text-sm text-text-light placeholder:text-text-light/30 outline-none"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!input.trim()}
            aria-label="Send"
            className={`shrink-0 p-2 rounded-lg transition-all
              ${input.trim()
                ? "bg-accent text-bg-main hover:bg-accent-hover cursor-pointer"
                : "text-text-light/20 cursor-not-allowed"
              }`}
          >
            <FiSend size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
