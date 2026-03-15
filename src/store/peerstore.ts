import { create } from "zustand";
import type { SignalingClient } from "../lib/signaling/SignalingClient";

interface PeerStore {
  selfId: string | null;
  self: Peer | null;
  peers: Record<string, Peer>;
  signalingClient: SignalingClient | null;
  setSignalingClient: (client: SignalingClient) => void;
  setSelfId: (id: string) => void;
  setSelf: (self: Peer) => void;
  addPeer: (peer: Peer) => void;
  removePeer: (peerId: string) => void;
}

export interface Peer {
  deviceType: string;
  displayName: string;
  ip: string;
  peerId: string;
}

export const usePeerStore = create<PeerStore>((set, get) => ({
  selfId: null,
  self: null,
  peers: {},
  signalingClient: null,

  setSignalingClient: (client) => set({ signalingClient: client }),

  setSelfId: (id) => set({ selfId: id }),
  setSelf: (self) => set({ self: self }),

  removePeer: (peerId) =>
    set((state) => {
      const peers = { ...state.peers };
      delete peers[peerId];
      return { peers };
    }),

  addPeer: (peer) => {
    console.log("peeeer", peer);
    set((state) => ({
      peers: { ...state.peers, [peer?.peerId]: peer },
    }));
  },
}));
