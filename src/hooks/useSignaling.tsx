import React, { useEffect, useRef } from "react";
import { SignalingClient } from "../lib/signaling/SignalingClient";
import { usePeerStore, type Peer } from "../store/peerstore";
const useSignaling = (serverUrl: string) => {
  const socketRef = useRef<SignalingClient | null>(null);
  const { setSelfId, addPeer, setSelf, removePeer } = usePeerStore();

  useEffect(() => {
    const socket = new SignalingClient(serverUrl);
    socketRef.current = socket;

    const handelEvent = (e: Event) => {
      const msg = (e as CustomEvent).detail;

      switch (msg.type) {
        case "peers": {
          setSelfId(msg.selfId);
          setSelf(msg.selfInfo);
          if (msg.peers.length > 0) {
            msg.peers.map((peer: Peer) => addPeer(peer));
          }
          break;
        }

        case "peer-joined": {
          addPeer(msg.peer);
          break;
        }

        case "peer-left": {
          console.log(msg);
          removePeer(msg.peerId);
        }
      }
    };

    socket.addEventListener("message", handelEvent);
    socket.connect();

    return () => {
      socket.removeEventListener("message", handelEvent);
      socketRef.current?.close();
    };
  }, [serverUrl]);

  const send = (data: any) => socketRef.current?.send(data);

  return { send };
};

export default useSignaling;
