import { useState } from "react";
import ServerList from "../server/ServerList";
import ChannelList from "../channel/ChannelList";

export default function MainPage() {
  const [selectedServerId, setSelectedServerId] = useState(null);

  return (
    <div className="bg-bg-main h-screen w-full flex overflow-hidden">
      <div className="z-10 shrink-0 h-full">
        <ServerList
          onSelectServer={(serverId) => setSelectedServerId(serverId)}
        />
      </div>

      <div className="shrink-0 h-full -ml-2 z-0">
        <ChannelList
          visible={Boolean(selectedServerId)}
          serverId={selectedServerId}
        />
      </div>
    </div>
  );
}
