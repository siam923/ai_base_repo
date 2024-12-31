'use client';

import Link from 'next/link';
import { memo } from 'react';
import { toast } from 'sonner';


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,

} from '@/components/ui/sidebar';
import { CheckCircle, GlobeIcon, LockIcon, MoreHorizontalIcon, ShareIcon, TrashIcon } from 'lucide-react';


const PureChatItem = ({ chat, isActive, onDelete, setOpenMobile }) => {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link href={`/chat/${chat._id}`} onClick={() => setOpenMobile(false)}>
            <span>{chat.title}</span>
          </Link>
        </SidebarMenuButton>
  
        <DropdownMenu modal={true}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mr-0.5"
              showOnHover={!isActive}
            >
              <MoreHorizontalIcon />
              <span className="sr-only">More</span>
            </SidebarMenuAction>
          </DropdownMenuTrigger>
  
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <ShareIcon />
                <span>Share</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem className="cursor-pointer">
                    <GlobeIcon className="mr-2 h-4 w-4" />
                    <span>Public link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <LockIcon className="mr-2 h-4 w-4" />
                    <span>Private link</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/chat/${chat._id}`);
                      toast.success('Link copied to clipboard');
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    <span>Copy link</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
  
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
              onSelect={() => onDelete(chat._id)}
            >
              <TrashIcon />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  };
  
  export const ChatItem = memo(PureChatItem, (prevProps, nextProps) => {
    if (prevProps.isActive !== nextProps.isActive) return false;
    return true;
  });