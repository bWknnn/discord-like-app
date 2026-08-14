import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiPlus, FiHash, FiVolume2, FiX } from "react-icons/fi";
import Channel from "./Channel";
import Topbar from "./Topbar";
import { channelFetch } from "../../api/channels";
import { connect, subscribeToServer, sendChannel } from "../../api/websocket";

export default function ChannelList({ visible, serverId, onSelectChannel }) {
  const [active, setActive] = useState("");
  const [addPanel, setAddPanel] = useState(false);
  const [type, setType] = useState("text");
  const [name, setName] = useState("");
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    if (!visible || !serverId) return;

    fetchChannels();

    let subscription = null;
    connect(() => {
      subscription = subscribeToServer(serverId, (newChannel) => {
        setChannels((prev) => {
          if (prev.some((c) => c.uid === newChannel.uid)) return prev;
          return [...prev, newChannel];
        });
      });
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [serverId, visible]);

  if (!visible) return null;

  const textChannels = channels.filter((channel) => channel.type === "text");
  const voiceChannels = channels.filter((channel) => channel.type === "voice");

  function closePanel() {
    setAddPanel(false);
    setType("text");
    setName("");
  }

  function handleNameChange(event) {
    const formattedName = event.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(formattedName);
  }

  async function fetchChannels() {
    try {
      const channels = await channelFetch(serverId);
      setChannels(channels);
    } catch (error) {
      console.error("Failed to fetch channels:", error);
    }
  }

  function createChannel() {
    sendChannel({ name, type, serverId });
    closePanel();
  }

  return (
    <>
      {addPanel &&
        createPortal(
          <div
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={closePanel}
          >
            <div
              className="w-96 bg-bg-card border border-accent/30 rounded-lg glow font-mono animate-in fade-in zoom-in-95 duration-150"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-dark">
                <span className="text-accent text-sm font-bold">
                  &gt; create_channel
                </span>

                <button
                  type="button"
                  onClick={closePanel}
                  className="text-text-light/50 hover:text-accent transition-colors cursor-pointer"
                >
                  <FiX size={16} />
                </button>
              </div>

              <div className="p-4 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-text-light/50 uppercase tracking-wide">
                    channel type
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setType("text")}
                      className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-colors cursor-pointer ${type === "text"
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border-dark text-text-light/60 hover:text-accent hover:border-accent/40"
                        }`}
                    >
                      <FiHash size={14} />
                      text
                    </button>

                    <button
                      type="button"
                      onClick={() => setType("voice")}
                      className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-colors cursor-pointer ${type === "voice"
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border-dark text-text-light/60 hover:text-accent hover:border-accent/40"
                        }`}
                    >
                      <FiVolume2 size={14} />
                      voice
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs text-text-light/50 uppercase tracking-wide">
                    channel name
                  </span>

                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-border-dark focus-within:border-accent/60 transition-colors">
                    <span className="text-accent/70 text-sm flex items-center">
                      {type === "text" ? (
                        <FiHash size={14} />
                      ) : (
                        <FiVolume2 size={14} />
                      )}
                    </span>

                    <input
                      autoFocus
                      value={name}
                      onChange={handleNameChange}
                      placeholder="new-channel"
                      className="flex-1 bg-transparent text-sm text-text-light outline-none placeholder:text-text-light/30"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 px-4 py-3 border-t border-border-dark">
                <button
                  type="button"
                  onClick={closePanel}
                  className="px-3 py-1.5 text-sm text-text-light/60 hover:text-text-light transition-colors cursor-pointer"
                >
                  cancel
                </button>

                <button
                  type="button"
                  onClick={createChannel}
                  disabled={!name.trim()}
                  className={`px-3 py-1.5 text-sm rounded-md font-bold transition-colors ${name.trim()
                      ? "bg-accent text-bg-card hover:bg-accent/90 cursor-pointer"
                      : "bg-border-dark text-text-light/30 cursor-not-allowed"
                    }`}
                >
                  create
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      <div className="w-64 bg-bg-card flex flex-col h-full border-r border-border-dark shrink-0">
        <div className="h-14 border-b border-border-dark px-4 flex items-center justify-between bg-bg-card/50">
          <span className="font-mono text-sm font-bold text-accent truncate">
            channels
          </span>

          <button
            type="button"
            onClick={() => setAddPanel(true)}
            className="p-1.5 text-text-light/60 hover:text-accent hover:bg-accent/10 rounded-md transition-colors cursor-pointer"
          >
            <FiPlus size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4">
          {textChannels.length > 0 && (
            <div className="flex flex-col gap-1">
              <Topbar name="Text" />

              {textChannels.map((channel) => (
                <Channel
                  key={channel.uid}
                  name={channel.name}
                  type={channel.type}
                  active={channel.uid === active}
                  onClick={() => {
                    setActive(channel.uid);
                    onSelectChannel?.({ id: channel.uid, type: channel.type, name: channel.name });
                  }}
                />
              ))}
            </div>
          )}

          {voiceChannels.length > 0 && (
            <div className="flex flex-col gap-1">
              <Topbar name="Voice" />

              {voiceChannels.map((channel) => (
                <Channel
                  key={channel.uid}
                  name={channel.name}
                  type={channel.type}
                  active={channel.uid === active}
                  onClick={() => {
                    setActive(channel.uid);
                    onSelectChannel?.({ id: channel.uid, type: channel.type, name: channel.name });
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
