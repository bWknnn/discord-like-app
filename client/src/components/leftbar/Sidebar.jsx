import Serverlist from "../serverlist/Serverlist";
import Profile from "./Profile";
import Topnav from "./Topnav";

export default function Sidebar() {
  return (
    <>
      <div className="fcenter flex-col bg-left w-1/7 gap-2 pb-2 pt-2">
        <Topnav />
        <Serverlist />
        <Profile />
      </div>
    </>
  );
}
