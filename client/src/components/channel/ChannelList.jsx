import { useState } from "react";
import { FiPlus, FiChevronDown } from "react-icons/fi";
import Channel from "./Channel";
import Topbar from "./Topbar";

export default function ChannelList({ visible }) {
  const [active, setActive] = useState("");

  const channels = [
    { id: "1", name: "general", type: "text" },
    { id: "2", name: "announcements", type: "text" },
    { id: "3", name: "dev-chat", type: "text" },
    { id: "4", name: "General Voice", type: "voice" },
    { id: "5", name: "Gaming Room", type: "voice" },
  ];

  if (!visible) return null;

  const textChannels = channels.filter((c) => c.type === "text");
  const voiceChannels = channels.filter((c) => c.type === "voice");

  return (
    <div className="w-64 bg-bg-card flex flex-col h-full border-r border-border-dark shrink-0">
      <div className="h-14 border-b border-border-dark px-4 flex items-center justify-between bg-bg-card/50">
        <span className="font-mono text-sm font-bold text-accent truncate">
          channels
        </span>

        <button
          type="button"
          className="p-1.5 text-text-light/60 hover:text-accent hover:bg-accent/10 rounded-md transition-colors cursor-pointer"
        >
          <FiPlus size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Topbar name="Text" />

          {textChannels.map((channel) => (
            <Channel
              key={channel.id}
              name={channel.name}
              type={channel.type}
              active={channel.name === active}
              onClick={() => setActive(channel.name)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <Topbar name={"Voice"} />

          {voiceChannels.map((channel) => (
            <Channel
              key={channel.id}
              name={channel.name}
              type={channel.type}
              active={channel.name === active}
              onClick={() => setActive(channel.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
