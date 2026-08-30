import { useRef, useEffect, useState } from "react";
import { FiVideo, FiMicOff } from "react-icons/fi";

export default function ParticipantTile({
  user,
  isSelf,
  isMuted,
  isCameraOn,
  stream,
}) {
  const initial = user?.username?.[0]?.toUpperCase() || "?";
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speakingTimeoutRef = useRef(null);

  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream || null;
  }, [stream]);

  useEffect(() => {
    if (!stream || stream.getAudioTracks().length === 0) return;

    let audioContext;
    let source;
    let analyser;
    let intervalId;

    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.4;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      intervalId = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;

        if (average > 15 && !isMutedRef.current) {
          setIsSpeaking(true);

          if (speakingTimeoutRef.current) {
            clearTimeout(speakingTimeoutRef.current);
          }
          speakingTimeoutRef.current = setTimeout(() => {
            setIsSpeaking(false);
          }, 300);
        }
      }, 100);
    } catch (err) {
      console.warn("Failed to create AudioContext or read stream:", err);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
      if (source) source.disconnect();
      if (audioContext && audioContext.state !== "closed") audioContext.close();
    };
  }, [stream]);

  const hasVideo = stream && stream.getVideoTracks().length > 0 && isCameraOn;

  return (
    <div
      className={`relative rounded-2xl p-0.5 overflow-hidden select-none transition-all duration-300
        ${isSpeaking && !isMuted ? "shadow-[0_0_15px_rgba(187,255,0,0.3)]" : "ring-1 ring-border-dark shadow-none"}
      `}
      style={{ width: 200, height: 140 }}
    >
      {isSpeaking && !isMuted && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,var(--color-accent)_0%,rgba(255,220,0,1)_50%,var(--color-accent)_100%)] animate-spin blur-[2px]"
          style={{ animationDuration: "3s", animationDirection: "reverse" }}
        />
      )}

      <div
        className={`relative w-full h-full rounded-[14px] overflow-hidden z-10 flex flex-col items-center justify-center ${isCameraOn ? "bg-bg-main" : "bg-bg-card"}`}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isSelf}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            hasVideo ? "opacity-100" : "opacity-0 pointer-events-none"
          } ${isSelf ? "-scale-x-100" : ""}`}
        />

        {!hasVideo && isCameraOn && (
          <div className="absolute inset-0 bg-linear-to-br from-accent/10 via-bg-card to-bg-main flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center text-2xl font-bold font-mono text-accent animate-pulse">
              {initial}
            </div>
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/50 text-[10px] font-mono text-white/80 flex items-center gap-1">
              <FiVideo size={10} />
              Camera
            </div>
          </div>
        )}

        {!hasVideo && !isCameraOn && (
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
          </span>
        </div>
      </div>
    </div>
  );
}
