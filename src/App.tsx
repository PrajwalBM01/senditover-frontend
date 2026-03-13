import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import useSignaling from "../hooks/useSignaling";
import { usePeerStore, type Peer } from "../store/peerstore";
import { Monitor, TabletSmartphone } from "lucide-react";
import useSafeZone from "../hooks/useSafeZone";
function App() {
  const [count, setCount] = useState(0);
  const { send } = useSignaling("ws:localhost:8080");
  const { selfId, peers, self } = usePeerStore();
  const selfContainer = useRef<HTMLDivElement>(null);
  const { getRandomSafePos } = useSafeZone(selfContainer);

  const [coords, setCoords] = useState<
    Record<string, { x: number; y: number }>
  >({});

  useEffect(() => {
    const newCoords = { ...coords };
    let updated = false;

    Object.values(peers).forEach((peer) => {
      // Only generate a position if we don't have one for this peer yet
      if (!newCoords[peer.peerId]) {
        newCoords[peer.peerId] = getRandomSafePos();
        updated = true;
      }
    });

    if (updated) {
      setCoords(newCoords);
    }
  }, [peers, getRandomSafePos]);

  return (
    <div className="bg-neutral-800 h-screen w-full flex flex-col gap-2 justify-center items-center">
      {Object.values(peers).map((peer: Peer) => {
        const pos = coords[peer.peerId] || { x: 0, y: 0 };
        return (
          <div
            key={peer.peerId}
            className="absolute flex flex-col justify-center items-center"
            style={{ left: pos.x, top: pos.y }}
          >
            <div className="rounded-full  bg-neutral-400 p-2 shadow hover:cursor-pointer">
              {peer?.deviceType === "desktop" ? (
                <Monitor size={35} />
              ) : (
                <TabletSmartphone size={35} />
              )}
            </div>
            <p className="text-neutral-500 font-medium text-lg">
              {peer?.displayName}
            </p>
          </div>
        );
      })}

      <div className=" h-screen w-full flex justify-center items-center">
        <div
          ref={selfContainer}
          className="flex flex-col justify-center items-center  "
        >
          <div className="rounded-full  bg-neutral-700 p-2 shadow">
            {self?.deviceType === "desktop" ? (
              <Monitor size={35} />
            ) : (
              <TabletSmartphone size={35} />
            )}
          </div>
          <p className="text-neutral-500 font-medium text-lg">
            {self?.displayName}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
