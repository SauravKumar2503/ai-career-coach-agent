"use client"
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SparklesIcon } from "lucide-react";
import axios from "axios";
import { v4 } from "uuid";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

function RoadmapGeneratorDialog({ openDialog, setOpenDialog }: any) {
  const [userInput, setUserInput] = useState<string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const GenerateRoadmap = async () => {
    const roadmapId = v4();
    setLoading(true);
    try {
      const result = await axios.post("/api/ai-roadmap-agent", {
        roadmapId: roadmapId,
        userInput: userInput,
      });
      console.log(result.data);
      router.push('/ai-tools/ai-roadmap-agent/' + roadmapId)
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Position/Skills to Generate Roadmap</DialogTitle>
          {/* Move Input outside of DialogDescription or avoid div inside it */}
          <DialogDescription>
            Please provide a role like "Full Stack Developer"
          </DialogDescription>
          <Input
            placeholder="e.g. Full Stack Developer"
            onChange={(event) => setUserInput(event?.target.value)}
          />
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button onClick={GenerateRoadmap} disabled={loading || !userInput}>
            {loading ? <Loader2Icon className="animate-spin" /> : null}
            <SparklesIcon className="mr-2 h-4 w-4" />
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RoadmapGeneratorDialog;










