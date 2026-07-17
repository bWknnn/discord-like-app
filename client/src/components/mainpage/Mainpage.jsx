import { useState } from "react";
import ServerList from "../server/ServerList";

export default function MainPage() {
  return (
    <div className="bg-bg-main h-screen">
      <ServerList />
    </div>
  );
}
