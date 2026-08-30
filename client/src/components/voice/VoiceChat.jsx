import { useState, useEffect, useRef } from "react";
import {
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiMonitor,
  FiPhoneOff,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { subscribeToVoiceParticipants, joinVoiceChannel, leaveVoiceChannel, sendWebRTCSignal, syncVoiceParticipants } from "../../api/websocket";
import { useWebRTC } from "../../hooks/useWebRTC";
import ParticipantTile from "./ParticipantTile";

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default function VoiceChat({ channel, currentUser, onDisconnect, wsConnected }) {
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [page, setPage] = useState(0);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    setMuted(false);
    setCameraOn(false);
    setScreenSharing(false);
  }, [channel?.id]);

  const { localStream, remoteStreams, remoteStatuses } = useWebRTC(channel?.id, currentUser, participants, cameraOn, muted, wsConnected);

  const timerRef = useRef(null);
  const wheelTimeoutRef = useRef(null);

  useEffect(() => {
    if (!currentUser?.uid || !wsConnected) return;

    participants.forEach(p => {
      if (p.uid === currentUser.uid) return;
      sendWebRTCSignal({
        senderUid: currentUser.uid,
        targetUid: p.uid,
        type: "status",
        data: JSON.stringify({ muted, cameraOn }),
      });
    });
  }, [muted, cameraOn, participants, currentUser, wsConnected]);

  useEffect(() => {
    if (!channel?.id || !wsConnected) return;

    const sub = subscribeToVoiceParticipants(channel.id, (users) => {
      setParticipants(users);
    });

    const timer = setTimeout(() => {
      joinVoiceChannel(channel.id);
      syncVoiceParticipants(channel.id);
    }, 100);

    return () => {
      clearTimeout(timer);
      sub?.unsubscribe?.();
      leaveVoiceChannel(channel.id);
    };
  }, [channel?.id, wsConnected]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(participants.length / itemsPerPage);

  useEffect(() => {
    if (totalPages === 0 && page > 0) {
      setPage(0);
    } else if (page >= totalPages && totalPages > 0) {
      setPage(totalPages - 1);
    }
  }, [totalPages, page]);

  const displayedParticipants = participants.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage,
  );

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

  function handleWheel(e) {
    if (totalPages <= 1) return;
    if (wheelTimeoutRef.current) return;

    wheelTimeoutRef.current = setTimeout(() => {
      wheelTimeoutRef.current = null;
    }, 50);

    if (e.deltaY > 0) {
      setPage((p) => Math.min(totalPages - 1, p + 1));
    } else if (e.deltaY < 0) {
      setPage((p) => Math.max(0, p - 1));
    }
  }

  return (
    <div className="shrink-0 border-b border-accent/20 bg-bg-card/60 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
      <div className="flex flex-col items-center gap-3 px-6 py-5">
        <div className="flex items-center justify-center gap-2 w-full max-w-6xl">
          {totalPages > 1 && (
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 text-text-light/50 hover:text-accent disabled:opacity-30 disabled:hover:text-text-light/50 transition-colors cursor-pointer"
            >
              <FiChevronLeft size={24} />
            </button>
          )}

          <div
            className="flex flex-nowrap items-center justify-center gap-3"
            onWheel={handleWheel}
          >
            {displayedParticipants.map((p) => {
              const isSelf = p.uid === currentUser?.uid;
              const stream = isSelf ? localStream : remoteStreams[p.uid];

              return (
                <ParticipantTile
                  key={p.uid}
                  user={p}
                  isSelf={isSelf}
                  isMuted={isSelf ? muted : remoteStatuses[p.uid]?.muted || false}
                  isCameraOn={isSelf ? cameraOn : (remoteStatuses[p.uid]?.cameraOn || (stream && stream.getVideoTracks().length > 0))}
                  stream={stream}
                />
              );
            })}
          </div>

          {totalPages > 1 && (
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-2 text-text-light/50 hover:text-accent disabled:opacity-30 disabled:hover:text-text-light/50 transition-colors cursor-pointer"
            >
              <FiChevronRight size={24} />
            </button>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 -mt-1 mb-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === page ? "bg-accent" : "bg-border-dark"
                  }`}
              />
            ))}
          </div>
        )}

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
