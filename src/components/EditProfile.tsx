import { UserPen } from "lucide-react";
import React, { useState } from "react";
import { usePeerStore } from "../store/peerstore";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Field, FieldGroup } from "./ui/field";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "sonner";

const EditProfile = () => {
  const { self, signalingClient, selfId } = usePeerStore();
  const [open, setopen] = useState(false);

  const handleSumbit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const updatedName = name.trim();

    if (updatedName === self?.displayName) {
      toast("No changes");
      return;
    }

    if (signalingClient && selfId) {
      signalingClient.setNewDisplayName(updatedName, selfId);
      setopen(false);
      toast(`Name changed to ${updatedName}`);
    } else {
      toast.error("Not connected to any server");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setopen}>
      <div className="flex md:gap-4 items-center justify-between md:justify-center">
        <h1 className="text-base md:text-lg">
          You are discoverable as:{" "}
          <span className="font-semibold text-primary">
            {self?.displayName}
          </span>
        </h1>
        <DialogTrigger>
          <UserPen className="stroke-1 hover:cursor-pointer size-8 p-1 bg-accent  rounded" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <form className="flex flex-col gap-4" onSubmit={handleSumbit}>
            <DialogHeader>
              <DialogTitle>Edit Name</DialogTitle>
              <DialogDescription>
                Make changes to your name here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="name-1">Name</Label>
                <input
                  id="name-1"
                  name="name"
                  defaultValue={self?.displayName}
                  className="border p-1 rounded-md"
                />
              </Field>
            </FieldGroup>
            <div className="flex gap-2 justify-end">
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="cursor-pointer">
                Change Name
              </Button>
            </div>
          </form>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default EditProfile;
