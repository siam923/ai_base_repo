'use client';

import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { memo, useEffect, useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import { fetcher, getLocalStorage } from '@/lib/utils';
import { BASE_URL } from '@/data/api-handler';
import { ChatItem } from './chat-item';



export function SidebarHistory({ user }) {
  const { setOpenMobile } = useSidebar();
  const { id } = useParams();
  const pathname = usePathname();
 // Configure SWR with options
 const {
  data: history,
  error,
  isLoading,
  mutate
} = useSWR(
  user ? `${BASE_URL}/api/history` : null, // Only fetch if user exists
  fetcher,
  {
    revalidateOnFocus: false,
    refreshInterval: 30000, // Refresh every 30 seconds
    shouldRetryOnError: true,
    onError: (err) => {
      toast.error('Failed to load chat history');
      console.error('SWR Error:', err);
    }
  }
);

    // Refresh data when pathname changes
    useEffect(() => {
      if (user) {
        mutate();
      }
    }, [pathname, mutate, user]);


  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const accessToken = getLocalStorage('accessToken');

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const deletePromise = fetch(`${BASE_URL}/api/history?id=${deleteId}`, {
        method: 'DELETE',
        headers: {
          'accesstoken': `${accessToken}`,
        },
      });

      toast.promise(deletePromise, {
        loading: 'Deleting chat...',
        success: () => {
          mutate((history) => history?.filter((h) => h.id !== id));
          if (deleteId === id) {
            router.push('/');
          }
          return 'Chat deleted successfully';
        },
        error: 'Failed to delete chat',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="flex flex-col items-center justify-center p-4 space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading chats...</p>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (error) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-4 py-3 text-sm text-red-500">
            Failed to load chat history. Please try again.
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }


  // Handle no user state
  if (!user) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-4 py-3 text-sm text-muted-foreground text-center">
            Login to save and revisit previous chats!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

    // Handle empty history
    if (!history?.length) {
      return (
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              Your conversations will appear here once you start chatting!
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      );
    }

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="flex flex-col">
            {[44, 32, 28, 64, 52].map((item) => (
              <div
                key={item}
                className="rounded-md h-8 flex gap-2 px-2 items-center"
              >
                <div
                  className="h-4 rounded-md flex-1 max-w-[--skeleton-width] bg-sidebar-accent-foreground/10"
                  style={{ '--skeleton-width': `${item}%` }}
                />
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (history?.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
            Your conversations will appear here once you start chatting!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {history.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === id}
                onDelete={(chatId) => {
                  setDeleteId(chatId);
                  setShowDeleteDialog(true);
                }}
                setOpenMobile={setOpenMobile}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              chat and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}