import { useState, useEffect } from "react";
import ServerList from "../server/ServerList";
import ChannelList from "../channel/ChannelList";
import MessageList from "../message/MessageList";
import { connect, disconnect } from "../../api/websocket";

export default function MainPage() {
  const [selectedServerId, setSelectedServerId] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  function handleSelectServer(serverId) {
    setSelectedServerId(serverId);
    setSelectedChannel(null);
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
          onSelectChannel={setSelectedChannel}
        />
      </div>

      <div className="flex-1 h-full overflow-hidden">
        <MessageList channel={selectedChannel} />
      </div>
    </div>
  );
}
