import Text from "../chat/Text";
import Sidebar from "../leftbar/Sidebar";

export default function Mainpage() {
  return (
    <div className="h-screen w-full flex">
      <Sidebar />
      <Text />
    </div>
  );
}
