import { cookies } from 'next/headers';

import { AppSidebar } from '@/components/main/structure/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';


export const experimental_ppr = true;

export default async function Layout({
  children,
}) {
  const [ cookieStore] = await Promise.all([ cookies()]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

  const user = {
    name: 'John Doe',
    email: 'test@kmail.com'
  }

  return (
    <>

      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar user={user} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
