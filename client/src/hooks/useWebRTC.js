import { useState, useEffect, useRef, useCallback } from "react";
import { subscribeToWebRTCSignaling, sendWebRTCSignal } from "../api/websocket";

import { STUN_SERVERS } from "../api/constants";

export function useWebRTC(channelId, currentUser, participants, cameraOn, muted, wsConnected) {
  const [localStream, setLocalStream] = useState(null);
  const [videoTrack, setVideoTrack] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const peersRef = useRef({});
  const localStreamRef = useRef(null);

  const [remoteStatuses, setRemoteStatuses] = useState({});

  useEffect(() => {
    let stream = null;
    const getMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setLocalStream(stream);
        localStreamRef.current = stream;

        stream.getAudioTracks().forEach(t => t.enabled = !muted);
      } catch (err) {
        console.error("Failed to get local stream", err);
      }
    };
    getMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(t => {
        t.enabled = !muted;
      });
    }

    Object.values(peersRef.current).forEach(peer => {
      peer.getSenders().forEach(sender => {
        if (sender.track && sender.track.kind === 'audio') {
          sender.track.enabled = !muted;
        }
      });
    });
  }, [muted]);

  useEffect(() => {
    let isCancelled = false;

    if (cameraOn && !videoTrack) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(async (stream) => {
          if (isCancelled) {
            stream.getTracks().forEach(t => t.stop());
            return;
          }

          const newVideoTrack = stream.getVideoTracks()[0];
          setVideoTrack(newVideoTrack);

          if (localStreamRef.current) {
            localStreamRef.current.addTrack(newVideoTrack);
            setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
          }

          for (const [targetUid, peer] of Object.entries(peersRef.current)) {
            if (peer.signalingState !== "closed") {
              try {
                peer.addTrack(newVideoTrack, localStreamRef.current);
                const offer = await peer.createOffer();
                await peer.setLocalDescription(offer);
                sendWebRTCSignal({
                  senderUid: currentUser.uid,
                  targetUid: targetUid,
                  type: "offer",
                  data: JSON.stringify(offer),
                });
              } catch (e) {
                console.warn("Failed to negotiate new video track:", e);
              }
            }
          }
        })
        .catch(err => console.error("Failed to get video stream", err));
    } else if (!cameraOn && videoTrack) {
      videoTrack.stop();
      if (localStreamRef.current) {
        localStreamRef.current.removeTrack(videoTrack);
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
      }

      Object.values(peersRef.current).forEach(async peer => {
        if (peer.signalingState !== "closed") {
          const sender = peer.getSenders().find(s => s.track === videoTrack);
          if (sender) {
            try {
              peer.removeTrack(sender);
              const offer = await peer.createOffer();
              await peer.setLocalDescription(offer);
              const targetUid = Object.keys(peersRef.current).find(key => peersRef.current[key] === peer);
              if (targetUid) {
                sendWebRTCSignal({
                  senderUid: currentUser.uid,
                  targetUid: targetUid,
                  type: "offer",
                  data: JSON.stringify(offer),
                });
              }
            } catch (e) {
              console.warn("Failed to negotiate track removal:", e);
            }
          }
        }
      });
      setVideoTrack(null);
    }

    return () => {
      isCancelled = true;
    };
  }, [cameraOn, currentUser, videoTrack]);

  const createPeer = useCallback((targetUid) => {
    if (peersRef.current[targetUid]) return peersRef.current[targetUid];

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: STUN_SERVERS }]
    });
    peersRef.current[targetUid] = peer;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peer.addTrack(track, localStreamRef.current);
      });
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        sendWebRTCSignal({
          senderUid: currentUser.uid,
          targetUid: targetUid,
          type: "ice",
          data: JSON.stringify(event.candidate),
        });
      }
    };

    peer.ontrack = (event) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [targetUid]: event.streams[0],
      }));
    };

    return peer;
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.uid || !wsConnected) return;

    const sub = subscribeToWebRTCSignaling(currentUser.uid, async (message) => {
      const { senderUid, type, data } = message;

      if (type === "offer") {
        const peer = createPeer(senderUid);
        await peer.setRemoteDescription(new RTCSessionDescription(JSON.parse(data)));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        sendWebRTCSignal({
          senderUid: currentUser.uid,
          targetUid: senderUid,
          type: "answer",
          data: JSON.stringify(answer),
        });
      } else if (type === "answer") {
        const peer = peersRef.current[senderUid];
        if (peer) {
          await peer.setRemoteDescription(new RTCSessionDescription(JSON.parse(data)));
        }
      } else if (type === "ice") {
        const peer = peersRef.current[senderUid];
        if (peer) {
          await peer.addIceCandidate(new RTCIceCandidate(JSON.parse(data)));
        }
      } else if (type === "status") {
        const statusData = JSON.parse(data);
        setRemoteStatuses(prev => ({
          ...prev,
          [senderUid]: statusData
        }));
      }
    });

    return () => {
      sub?.unsubscribe?.();
    };
  }, [currentUser, wsConnected, createPeer]);

  useEffect(() => {
    if (!currentUser?.uid || !localStream) return;

    participants.forEach(async (p) => {
      if (p.uid === currentUser.uid) return;
      if (peersRef.current[p.uid]) return;

      if (currentUser.uid < p.uid) {
        const peer = createPeer(p.uid);
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        sendWebRTCSignal({
          senderUid: currentUser.uid,
          targetUid: p.uid,
          type: "offer",
          data: JSON.stringify(offer),
        });
      }
    });

    const participantUids = new Set(participants.map(p => p.uid));
    Object.keys(peersRef.current).forEach((targetUid) => {
      if (!participantUids.has(targetUid)) {
        peersRef.current[targetUid].close();
        delete peersRef.current[targetUid];
        setRemoteStreams((prev) => {
          const newStreams = { ...prev };
          delete newStreams[targetUid];
          return newStreams;
        });
      }
    });

  }, [participants, currentUser, localStream, createPeer]);

  useEffect(() => {
    return () => {
      Object.values(peersRef.current).forEach(peer => peer.close());
      peersRef.current = {};
      setRemoteStreams({});
    };
  }, []);

  return { localStream, remoteStreams, remoteStatuses };
}
