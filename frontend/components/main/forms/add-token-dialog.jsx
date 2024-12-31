"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "usehooks-ts";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSWRConfig } from "swr";
import { BASE_URL } from "@/data/api-handler";
import { Label } from "@/components/ui/label";
import { setContext } from "@/app/(chat)/actions";

const AddTokenDialog = () => {
  // Manage accessToken and projectId in local storage
  const [accessToken, setAccessToken] = useLocalStorage("accessToken", "");
  const [projectId, setProjectId] = useLocalStorage("projectId", "");
  const { mutate } = useSWRConfig();
  // Temporary state for dialog input
  const [tempAccessToken, setTempAccessToken] = useState(accessToken);
  const [tempProjectId, setTempProjectId] = useState(projectId);

  const handleSave = () => {
    setAccessToken(tempAccessToken); // Save accessToken to local storage
    setProjectId(tempProjectId); // Save projectId to local storage
    setContext({ accessToken: tempAccessToken, projectId: tempProjectId });
    mutate(`${BASE_URL}/api/history`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 py-1.5 px-2">
          Add token & data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Access Token & Project ID
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your Access Token and Project ID below. These will be stored
            locally and used in API requests.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="accessToken">Access Token</Label>
            <Input
              id="accessToken"
              placeholder="Enter your access token"
              value={tempAccessToken}
              onChange={(e) => setTempAccessToken(e.target.value)}
              type="password"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="projectId">Project ID</Label>
            <Input
              id="projectId"
              placeholder="Enter your project ID"
              value={tempProjectId}
              onChange={(e) => setTempProjectId(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTokenDialog;
