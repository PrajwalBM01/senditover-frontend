import React from "react";
import PeerAvatar from "../components/PeerAvatar";
import useSignaling from "../hooks/useSignaling";
import { usePeerStore } from "../store/peerstore";
import RadarWaves from "../components/RadarWaves";
import { UserPen } from "lucide-react";
import EditProfile from "../components/EditProfile";

const Sendit = () => {
  const { send } = useSignaling("ws://192.168.1.12:8080");
  const { self } = usePeerStore();
  return (
    <div className="h-dvh w-full flex flex-col gap-2 justify-between relative p-1">
      <header className="border bg-background">Header</header>
      {/*avatar section*/}
      <div className="border h-full w-full border-green-300"></div>
      {/* radar animation */}
      <RadarWaves />
      {/* avatar */}
      {/* <div className="absolute border inset-0">
        <PeerAvatar device={self?.deviceType} name={self?.displayName} />
      </div> */}

      <footer className="bg-background p-2 px-4">
        <EditProfile />
      </footer>
    </div>
  );
};

export default Sendit;
