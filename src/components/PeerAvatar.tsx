import { Monitor, Smartphone, User } from "lucide-react";
import React from "react";

interface PeerAvatarTypes {
  device: string | undefined;
  name: string | undefined;
}

const PeerAvatar = ({ device, name }: PeerAvatarTypes) => {
  return (
    <div className="p-2 flex flex-col justify-center items-center gap-3">
      <div className="h-15 md:h-20 w-15 md:w-20 relative flex justify-center items-center bg-primary rounded-[20px] md:rounded-[50px] [corner-shape:squircle]">
        <User className="size-12 md:size-15 stroke-1" />

        {device === "mobile" ? (
          <Smartphone className="size-8 md:size-10 stroke-1 fill-accent absolute -bottom-2 -right-1" />
        ) : (
          <Monitor className="size-8 md:size-10 fill-accent stroke-1 absolute -bottom-3 -right-2" />
        )}
      </div>
      <p className="text-xs md:text-base">{name}</p>
    </div>
  );
};

export default PeerAvatar;
