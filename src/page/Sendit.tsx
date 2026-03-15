import React from "react";
import PeerAvatar from "../components/PeerAvatar";
import useSignaling from "../hooks/useSignaling";
import { usePeerStore } from "../store/peerstore";
import RadarWaves from "../components/RadarWaves";

const Sendit = () => {
  const { send } = useSignaling("ws://192.168.1.12:8080");
  const { self } = usePeerStore();
  return (
    <div className="h-dvh w-full flex justify-center items-center relative">
      
        <RadarWaves />
      
      <PeerAvatar device={self?.deviceType} name={self?.displayName} />
    </div>
  );
};

export default Sendit;
