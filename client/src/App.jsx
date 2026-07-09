import Text from "./components/chat/Text";
import Sidebar from "./components/leftbar/Sidebar";

function App() {
  return (
    <div className="h-screen w-full flex">
      <Sidebar />
      <Text />
    </div>
  );
}

export default App;
