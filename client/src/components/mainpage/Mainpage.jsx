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
  const [voiceParticipants, setVoiceParticipants] = useState({});
  const [user, setUser] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    connect(
      () => setWsConnected(true),
      () => setWsConnected(false)
    );
    fetchCurrentUser().then(setUser);
    return () => disconnect();
  }, []);

  function handleSelectServer(serverId) {
    setSelectedServerId(serverId);
  }

  function handleSelectChannel(channel) {
    if (channel.type === "voice") {
      if (activeVoiceChannel && activeVoiceChannel.id !== channel.id) {
      }
      if (activeVoiceChannel?.id !== channel.id) {
        setActiveVoiceChannel(channel);
      }
    } else {
      setActiveTextChannel(channel);
    }
  }

  function handleVoiceDisconnect() {
    if (activeVoiceChannel) {
    }
    setActiveVoiceChannel(null);
  }

  return (
    <div className="bg-bg-main h-screen w-full flex overflow-hidden">
      <div className="hidden md:block z-10 shrink-0 h-full transition-all duration-300">
        <ServerList onSelectServer={handleSelectServer} />
      </div>

      <div className="hidden md:block shrink-0 h-full -ml-2 z-0 transition-all duration-300">
        <ChannelList
          visible={Boolean(selectedServerId)}
          serverId={selectedServerId}
          onSelectChannel={handleSelectChannel}
          activeVoiceChannelId={activeVoiceChannel?.id}
          activeTextChannelId={activeTextChannel?.id}
          voiceParticipants={voiceParticipants}
          onVoiceParticipantsChange={setVoiceParticipants}
        />
      </div>

      <div className="flex-1 h-full overflow-hidden flex flex-col">
        {activeVoiceChannel && (
          <VoiceChat
            channel={activeVoiceChannel}
            currentUser={user}
            participants={voiceParticipants[activeVoiceChannel.id] || []}
            onDisconnect={handleVoiceDisconnect}
            wsConnected={wsConnected}
          />
        )}

        <MessageList channel={activeTextChannel} wsConnected={wsConnected} />
      </div>
    </div>
  );
}
