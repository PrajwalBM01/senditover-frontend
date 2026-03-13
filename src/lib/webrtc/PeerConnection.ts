import { data } from "react-router";
import type { SignalingClient } from "../signaling/SignalingClient";

const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  //add turn server
];

export class PeerConnection extends EventTarget {
  private signalingClient: SignalingClient;
  private remotePeerId: string;
  private initator: boolean;

  private pc: RTCPeerConnection;
  private dataChannels: Map<string, RTCDataChannel>;
  constructor(
    signalingClient: SignalingClient,
    remotePeerId: string,
    initator: boolean = false,
  ) {
    super();
    this.signalingClient = signalingClient;
    this.remotePeerId = remotePeerId;
    this.initator = initator;

    this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    this.dataChannels = new Map();

    this._setupICEHandlers();
    this._setupStateHandlers();
  }

  async initiate() {
    this._createDataChannel("control", { ordered: true });
    this._createDataChannel("transfer-0", { ordered: true });

    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    this.signalingClient.sendTo(this.remotePeerId, {
      type: "offer",
      sdp: offer,
    });
  }

  async handleOffer(sdp: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(sdp));

    this.pc.ondatachannel = (e) => {
      this._registerDataChannel(e.channel);
    };

    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);

    this.signalingClient.sendTo(this.remotePeerId, {
      type: "answer",
      sdp: answer,
    });
  }

  async handleAnswer(sdp: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
  }

  async handelIceCandidte(candidate: RTCIceCandidateInit) {
    try {
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.warn("ICE candidate error:", err);
    }
  }

  getDataChannel(name: string) {
    return this.dataChannels.get(name);
  }

  _createDataChannel(name: string, options: any = {}) {
    const channel = this.pc.createDataChannel(name, {
      ordered: true,
      ...options,
    });
    channel.binaryType = "arraybuffer";
    this._registerDataChannel(channel);
    return channel;
  }

  _registerDataChannel(channel: RTCDataChannel) {
    this.dataChannels.set(channel.label, channel);
    channel.onopen = () => {
      this.dispatchEvent(
        new CustomEvent("channel-open", { detail: channel.label }),
      );
    };

    channel.onclose = () => {
      this.dispatchEvent(
        new CustomEvent("channel-close", { detail: channel.label }),
      );
    };

    channel.onmessage = (e) => {
      this.dispatchEvent(
        new CustomEvent("channel-message", {
          detail: { channelName: channel.label, data: e.data },
        }),
      );
    };
  }

  _setupICEHandlers() {
    this.pc.onicecandidate = (e) => {
      if (e.candidate) {
        this.signalingClient.sendTo(this.remotePeerId, {
          type: "ice-candidate",
          candidate: e.candidate,
        });
      }
    };

    this.pc.oniceconnectionstatechange = () => {
      const state = this.pc.iceConnectionState;
      this.dispatchEvent(new CustomEvent("ice-state", { detail: state }));

      if (state === "failed") {
        this.pc.restartIce();
      }
    };
  }

  _setupStateHandlers() {
    this.pc.onconnectionstatechange = () => {
      const state = this.pc.connectionState;
      this.dispatchEvent(
        new CustomEvent("connection-state", { detail: state }),
      );
    };
  }
}
