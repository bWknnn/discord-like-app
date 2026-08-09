import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiPlus,
  FiSearch,
  FiChevronRight,
  FiChevronDown,
  FiSettings,
  FiPlusCircle,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router";
import Server from "./Server";
import {
  addMember,
  createServer,
  getJoinedServers,
  getJoinableServers,
} from "../../api/servers";
import { logOut, currentUser } from "../../api/users";

export default function ServerList({ onSelectServer }) {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(true);
  const [create, setCreate] = useState(false);
  const [add, setAdd] = useState(false);
  const [serverName, setServerName] = useState("");
  const [user, setUser] = useState(null);
  const [joinable, setJoinable] = useState([]);
  const [joined, setJoined] = useState([]);

  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  async function fetchJoinedServers() {
    try {
      const data = await getJoinedServers();
      setJoined(data);
    } catch (error) {
      console.error("Failed to fetch joined servers:", error);
    }
  }

  async function serverCreate() {
    const trimmedServerName = serverName.trim();

    if (!trimmedServerName) {
      alert("Enter a server name.");
      return;
    }

    try {
      const server = await createServer(trimmedServerName, user?.uid || "");

      await addMember(server.uid);

      setServerName("");
      setCreate(false);

      await fetchJoinedServers();
    } catch (error) {
      console.error("Failed to create server:", error);
    }
  }

  async function getAllServers() {
    try {
      const serversData = await getJoinableServers();

      setJoinable(serversData);
      setAdd(true);
    } catch (error) {
      console.error("Failed to fetch joinable servers:", error);
    }
  }

  async function joinServer(serverId) {
    try {
      await addMember(serverId);

      setAdd(false);
      await fetchJoinedServers();
    } catch (error) {
      console.error("Failed to join server:", error);
    }
  }

  useEffect(() => {
    currentUser().then((user) => {
      if (!user) {
        navigate("/", { replace: true });
        return;
      }
      setUser(user);
      fetchJoinedServers();
    });
  }, [navigate]);

  return (
    <>
      {create &&
        createPortal(
          <div
            onClick={() => {
              setCreate(false);
              setServerName("");
            }}
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="bg-bg-card min-h-1/5 min-w-1/4 p-6 pb-0.5 rounded-md border border-border-dark flex flex-col animate-in fade-in zoom-in-95 duration-150"
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
                onChange={(event) => setServerName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    serverCreate();
                  }

                  if (event.key === "Escape") {
                    setCreate(false);
                    setServerName("");
                  }
                }}
                className="input mt-2"
                placeholder="Server Name"
                autoComplete="off"
                autoFocus
              />

              <button
                type="button"
                className="create-button"
                onClick={serverCreate}
              >
                <FiPlusCircle size={16} />
                Create Server
              </button>
            </div>
          </div>,
          document.body,
        )}

      {add &&
        createPortal(
          <div
            onClick={() => setAdd(false)}
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="bg-bg-card min-h-1/5 min-w-1/4 p-6 pb-0.5 rounded-md border border-border-dark flex flex-col animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="font-mono text-xs text-accent mb-1.5 flex items-center gap-1.5">
                <FiChevronDown />
                Available Servers
              </div>

              <div className="flex flex-col gap-1 p-2 overflow-y-auto max-h-80 w-full">
                {joinable.length === 0 ? (
                  <p className="font-mono text-xs text-text-light/60 p-2">
                    No available servers.
                  </p>
                ) : (
                  joinable.map((joinableServer) => (
                    <div
                      key={joinableServer.uid}
                      className="relative flex items-center group cursor-pointer"
                      onClick={() => joinServer(joinableServer.uid)}
                    >
                      <Server
                        name={joinableServer.serverName}
                        active={false}
                        onClick={() => {}}
                      />

                      <FiPlus className="absolute right-4 pointer-events-none text-text-light/60 group-hover:text-accent transition-colors duration-150" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}

      <div className="bg-bg-card flex flex-col w-fit px-4 h-full gap-1 border-r border-border-dark rounded-md">
        <header className="flex flex-col gap-2 bg-bg-card p-2 rounded-md">
          <button
            type="button"
            className="create-button"
            onClick={() => setCreate(true)}
          >
            <FiPlusCircle size={16} />
            Create Server
          </button>

          <button type="button" className="join-button" onClick={getAllServers}>
            <FiPlus size={16} />
            Join Server
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
              autoComplete="off"
            />
          </div>
        </header>

        <div className="w-64 bg-bg-card flex flex-col flex-1 min-h-0">
          <button
            type="button"
            onClick={() => setOpen((currentOpen) => !currentOpen)}
            className="w-full flex items-center gap-2 px-3 py-3 border-b border-border-dark bg-bg-header rounded-md cursor-pointer"
          >
            <FiChevronRight
              size={15}
              className="text-accent transition-transform duration-150"
              style={{
                transform: open ? "rotate(90deg)" : "rotate(0deg)",
              }}
            />

            <span className="font-mono text-sm text-accent">servers</span>
          </button>

          {open && (
            <div className="flex flex-col gap-1 p-2 overflow-y-auto">
              {joined.map((joinedServer) => (
                <Server
                  key={joinedServer.uid}
                  name={joinedServer.serverName}
                  active={joinedServer.uid === active}
                  onClick={() => {
                    setActive(joinedServer.uid);
                    onSelectServer?.(joinedServer.uid);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <footer className="flex flex-col gap-1 bg-bg-header border-t border-border-dark p-3 mt-auto mb-2 rounded-md">
          <span className="font-mono text-sm text-accent">
            {user?.username}
          </span>

          <div className="flex justify-between">
            <button
              type="button"
              className="flex items-center gap-1.5 font-mono text-xs text-text-light/60 hover:text-accent cursor-pointer transition-colors w-fit"
            >
              <FiSettings size={13} />
              Settings
            </button>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
              className="text-text-light/60 hover:text-badge transition-colors cursor-pointer"
            >
              <FiLogOut />
            </button>
          </div>
        </footer>
      </div>
    </>
  );
}
