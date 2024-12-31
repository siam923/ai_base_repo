"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ModelSelector } from "../forms/model-selector";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { memo } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import AddTokenDialog from "../forms/add-token-dialog";
import { SidebarToggle } from "./sidebar-toggle";

function PureChatHeader({
  selectedModelId,
  isReadonly,
}) {
  const router = useRouter();
  const { open } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle window resize
  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Don't render anything until after mount to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
         <SidebarToggle />
      {(!open || isMobile) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
              onClick={() => {
                router.push("/");
                router.refresh();
              }}
            >
              <PlusIcon />
              <span className="md:sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      )}

      {!isReadonly && (
        <ModelSelector
          selectedModelId={selectedModelId}
          className="order-1 md:order-2"
        />
      )}

      <div className="md:flex py-1.5 px-2 h-fit md:h-[34px] order-4 md:ml-auto">
        <AddTokenDialog />
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});