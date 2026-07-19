import { useEffect, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiChevronRight,
  FiChevronDown,
  FiSettings,
  FiPlusCircle,
  FiLogOut,
} from "react-icons/fi";
import Server from "./Server";
import { useNavigate } from "react-router";
import {
  addMember,
  createServer,
  getJoinedServers,
  getJoinableServers,
} from "../../api/servers";

export default function ServerList() {
  const [active, setActive] = useState(""); // which server is selected
  const [open, setOpen] = useState(true); // is server list shown
  const [create, setCreate] = useState(false); // server creation tab
  const [add, setAdd] = useState(false); // server addition tab
  const [serverName, setServerName] = useState(""); // servername in createserver
  const [user, setUser] = useState(null); // user
  const [joinable, setJoinable] = useState([]); // joinable servers
  const [joined, setJoined] = useState([]); // joined servers

  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  async function fetchJoinedServers(userId) {
    try {
      const data = await getJoinedServers(userId);
      setJoined(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function serverCreate() {
    if (!serverName || serverName.trim() === "") {
      alert("Enter a server name.");
      return;
    }
    try {
      const server = await createServer(serverName.trim(), user?.userName);
      await addMember(user.uid, server.uid);

      setServerName("");
      setCreate(false);

      await fetchJoinedServers(user.uid);
    } catch (err) {
      console.log(err);
    }
  }

  async function getAllServers() {
    if (!user?.uid) return;
    try {
      const serversData = await getJoinableServers(user.uid);
      setJoinable(serversData);
      setAdd(true);
    } catch (err) {
      console.log(err);
    }
  }

  async function joinServer(serverId) {
    try {
      await addMember(user.uid, serverId);
      setAdd(false);
      await fetchJoinedServers(user.uid);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const userRaw = localStorage.getItem("user");

    if (userRaw) {
      try {
        const parsedUser = JSON.parse(userRaw);
        if (parsedUser) {
          setUser(parsedUser);
          fetchJoinedServers(parsedUser.uid);
        }
      } catch (e) {
        console.error("JSON parse error:", e);
        localStorage.removeItem("user");
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      {create && (
        <div
          onClick={() => setCreate(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-card min-h-1/5 min-w-1/4 p-6 pb-0.5 rounded-md border border-border-dark flex flex-col"
          >
            <label
              htmlFor="servername"
              className="block font-mono text-xs text-accent mb-1.5"
            >
              &gt; servername
            </label>
            <input
              id="servername"
              type="text"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              className="input mt-2"
              placeholder="Server Name"
            />
            <button className="create-button" onClick={serverCreate}>
              <FiPlusCircle size={16} />
              Create Server
            </button>
          </div>
        </div>
      )}

      {add && (
        <div
          onClick={() => setAdd(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-card min-h-1/5 min-w-1/4 p-6 pb-0.5 rounded-md border border-border-dark flex flex-col"
          >
            <label
              htmlFor="servername"
              className="font-mono text-xs text-accent mb-1.5 flex items-center gap-1.5"
            >
              <FiChevronDown />
              Available Servers
            </label>
            <div className="flex flex-col gap-1 p-2 overflow-y-auto max-h-80 w-full">
              {joinable.map((j) => (
                <div
                  key={j.uid}
                  className="relative flex items-center group cursor-pointer"
                  onClick={() => joinServer(j.uid)}
                >
                  <Server
                    name={j.serverName}
                    active={false}
                    onClick={() => {}}
                  />
                  <FiPlus className="absolute right-4 pointer-events-none text-text-light/60 group-hover:text-accent transition-colors duration-150" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-bg-card flex flex-col w-fit px-4 h-full gap-1 border-r border-border-dark rounded-md">
        <header className="flex flex-col gap-2 bg-bg-card p-2 rounded-md">
          <button className="create-button" onClick={() => setCreate(true)}>
            <FiPlusCircle size={16} />
            Create Server
          </button>
          <button className="add-button" onClick={getAllServers}>
            <FiPlus size={16} />
            Add Server
          </button>

          <div className="relative">
            <FiSearch
              size={15}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-text-light/40"
            />
            <input
              placeholder="Search for a server"
              type="text"
              name="search"
              id="search"
              className="input pl-5"
            />
          </div>
        </header>

        <div className="w-64 bg-bg-card flex flex-col flex-1 min-h-0">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center gap-2 px-3 py-3 border-b border-border-dark bg-bg-header rounded-md cursor-pointer"
          >
            <FiChevronRight
              size={15}
              className="text-accent transition-transform duration-150"
              style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
            />
            <span className="font-mono text-sm text-accent">servers</span>
          </button>

          {open && (
            <div className="flex flex-col gap-1 p-2 overflow-y-auto">
              {joined.map((s) => (
                <Server
                  key={s.uid}
                  name={s.serverName}
                  active={s.uid === active}
                  onClick={() => setActive(s.uid)}
                />
              ))}
            </div>
          )}
        </div>

        <footer className="flex flex-col gap-1 bg-bg-header border-t border-border-dark p-3 mt-auto mb-2 rounded-md">
          <span className="font-mono text-sm text-accent">
            {user?.userName}
          </span>
          <div className="flex justify-between">
            <button className="flex items-center gap-1.5 font-mono text-xs text-text-light/60 hover:text-accent cursor-pointer transition-colors w-fit">
              <FiSettings size={13} />
              Settings
            </button>
            <FiLogOut
              className="text-text-light/60 hover:text-badge transition-colors cursor-pointer"
              onClick={logout}
            />
          </div>
        </footer>
      </div>
    </>
  );
}
