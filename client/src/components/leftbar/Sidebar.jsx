import Serverlist from "./Serverlist";
import User from "./User";
import Topnav from "./Topnav";

export default function Sidebar() {
  return (
    <>
      <div className="fcenter flex-col bg-bg-header w-1/7 gap-2 pb-2 pt-2">
        <Topnav />
        <Serverlist />
        <User />
      </div>
    </>
  );
}
