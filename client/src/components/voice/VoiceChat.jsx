import { useState, useEffect, useRef } from "react";
import {
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiMonitor,
  FiPhoneOff,
  FiVolume2,
} from "react-icons/fi";

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function ParticipantTile({ user, isSelf, isMuted, isCameraOn }) {
  const initial = user?.username?.[0]?.toUpperCase() || "?";

  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-2xl overflow-hidden transition-all duration-300 select-none
        ring-1 ring-border-dark
        ${isCameraOn ? "bg-bg-main" : "bg-bg-card"}
      `}
      style={{ width: 200, height: 140 }}
    >
      {isCameraOn ? (
        <div className="absolute inset-0 bg-linear-to-br from-accent/10 via-bg-card to-bg-main flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center text-2xl font-bold font-mono text-accent animate-pulse">
            {initial}
          </div>
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/50 text-[10px] font-mono text-white/80 flex items-center gap-1">
            <FiVideo size={10} />
            Camera
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold font-mono transition-all duration-300
            ${isSelf ? "bg-accent text-bg-main" : "bg-avatar-bg text-accent border border-border-dark"}
          `}
          >
            {initial}
          </div>
        </div>
      )}

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
        {isMuted && <FiMicOff size={10} className="text-badge" />}
        <span className="text-[11px] font-mono text-white/90 truncate max-w-24">
          {user?.username || "Unknown"}
          {isSelf && <span className="text-accent/70 ml-1">(You)</span>}
        </span>
      </div>

    </div>
  );
}

export default function VoiceChat({ channel, currentUser, onDisconnect }) {
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const timerRef = useRef(null);

  const participants = currentUser ? [currentUser] : [];

  useEffect(() => {
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [channel?.id]);


  function handleDisconnect() {
    setMuted(false);
    setCameraOn(false);
    setScreenSharing(false);
    setElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
    onDisconnect?.();
  }

  if (!channel) return null;

  return (
    <div className="shrink-0 border-b border-accent/20 bg-bg-card/60 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
      <div className="flex flex-col items-center gap-3 px-6 py-5">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {participants.map((p) => (
            <ParticipantTile
              key={p.uid}
              user={p}
              isSelf={p.uid === currentUser?.uid}
              isMuted={p.uid === currentUser?.uid ? muted : false}
              isCameraOn={p.uid === currentUser?.uid ? cameraOn : false}

            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScreenSharing((prev) => !prev)}
            title={screenSharing ? "Stop Sharing" : "Share Screen"}
            className={`p-2.5 rounded-full transition-all duration-200 cursor-pointer active:scale-90
              ${screenSharing
                ? "bg-accent/20 text-accent hover:bg-accent/30"
                : "bg-bg-card text-text-light/60 hover:text-text-light hover:bg-bg-card/80"
              }`}
          >
            <FiMonitor size={18} />
          </button>

          <button
            type="button"
            onClick={() => setCameraOn((prev) => !prev)}
            title={cameraOn ? "Turn Off Camera" : "Turn On Camera"}
            className={`p-2.5 rounded-full transition-all duration-200 cursor-pointer active:scale-90
              ${cameraOn
                ? "bg-accent/20 text-accent hover:bg-accent/30"
                : "bg-bg-card text-text-light/60 hover:text-text-light hover:bg-bg-card/80"
              }`}
          >
            {cameraOn ? <FiVideo size={18} /> : <FiVideoOff size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setMuted((prev) => !prev)}
            title={muted ? "Unmute" : "Mute"}
            className={`p-2.5 rounded-full transition-all duration-200 cursor-pointer active:scale-90
              ${muted
                ? "bg-badge/20 text-badge hover:bg-badge/30"
                : "bg-bg-card text-text-light/60 hover:text-text-light hover:bg-bg-card/80"
              }`}
          >
            {muted ? <FiMicOff size={18} /> : <FiMic size={18} />}
          </button>

          <button
            type="button"
            onClick={handleDisconnect}
            title="Disconnect"
            className="p-2.5 rounded-full bg-badge text-white hover:bg-badge/80 transition-all duration-200 cursor-pointer active:scale-90"
          >
            <FiPhoneOff size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-online animate-pulse" />
          <span className="font-mono text-[11px] text-online">
            Voice Connected
          </span>
          <span className="font-mono text-[11px] text-text-light/30">
            · {channel.name} · {formatDuration(elapsed)}
          </span>
        </div>
      </div>
    </div>
  );
}
