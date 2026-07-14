import Server from "../serverlist/Server";

export default function Log() {
  return (
    <div className="flex-1 h-screen bg-[#313338] flex flex-col">
      <div className="h-16 border-b-2 border-black flex items-center px-6">
        <Server name="Ahmet" customClass="profile" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        <p>Deneme</p>
        <p>Deneme</p>
        <p>Deneme</p>
        <p>Deneme</p>
        <p>Deneme</p>
        <p>Deneme</p>
        <p>Deneme</p>
        <p>Deneme</p>
      </div>

      <div className="h-24 px-6 flex items-center border-t-2 border-black">
        <input
          type="text"
          className="w-full bg-neutral-600 text-white py-3 px-5 rounded-full outline-none focus:ring-2 focus:ring-neutral-400 transition-all"
          placeholder="Enter Message..."
        />
      </div>
    </div>
  );
}
