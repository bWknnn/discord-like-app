import { useState, useEffect } from "react";
import ServerList from "../server/ServerList";
import ChannelList from "../channel/ChannelList";
import MessageList from "../message/MessageList";
import VoiceChat from "../voice/VoiceChat";
import { connect, disconnect } from "../../api/websocket";
import { currentUser as fetchCurrentUser } from "../../api/users";

export default function MainPage() {
  const [selectedServerId, setSelectedServerId] = useState(null);
  const [activeTextChannel, setActiveTextChannel] = useState(null);
  const [activeVoiceChannel, setActiveVoiceChannel] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    connect();
    fetchCurrentUser().then(setUser);
    return () => disconnect();
  }, []);

  function handleSelectServer(serverId) {
    setSelectedServerId(serverId);
    setActiveTextChannel(null);
    setActiveVoiceChannel(null);
  }

  function handleSelectChannel(channel) {
    if (channel.type === "voice") {
      // Voice channel: join immediately, keep text channel as is
      setActiveVoiceChannel(channel);
    } else {
      // Text channel: switch text view, keep voice as is
      setActiveTextChannel(channel);
    }
  }

  function handleVoiceDisconnect() {
    setActiveVoiceChannel(null);
  }

  return (
    <div className="bg-bg-main h-screen w-full flex overflow-hidden">
      <div className="z-10 shrink-0 h-full">
        <ServerList onSelectServer={handleSelectServer} />
      </div>

      <div className="shrink-0 h-full -ml-2 z-0">
        <ChannelList
          visible={Boolean(selectedServerId)}
          serverId={selectedServerId}
          onSelectChannel={handleSelectChannel}
          activeVoiceChannelId={activeVoiceChannel?.id}
          voiceUsers={activeVoiceChannel && user ? [user] : []}
        />
      </div>

      <div className="flex-1 h-full overflow-hidden flex flex-col">
        {/* Voice panel at top (if in a voice call) */}
        {activeVoiceChannel && (
          <VoiceChat
            channel={activeVoiceChannel}
            currentUser={user}
            onDisconnect={handleVoiceDisconnect}
          />
        )}

        {/* Text messages below */}
        <MessageList channel={activeTextChannel} />
      </div>
    </div>
  );
}
