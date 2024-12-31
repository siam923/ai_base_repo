'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';

import { SidebarUserNav } from './sidebar-user-nav';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { SidebarHistory } from './sidebar-history';

export function AppSidebar({ user }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const handleNewChat = () => {
    setOpenMobile(false);
    router.push('/');
    router.refresh();
  };

  const handleLogoClick = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={handleLogoClick}
              className="flex flex-row gap-3 items-center"
            >
              <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer transition-colors duration-200">
                Chatbot
              </span>
            </Link>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit hover:bg-muted/50 transition-colors duration-200"
                  onClick={handleNewChat}
                  aria-label="New Chat"
                >
                  <PlusIcon className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end" className="bg-popover text-popover-foreground">
                New Chat
              </TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>

      <SidebarFooter>
        {user && <SidebarUserNav user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}