const SidebarSkeleton = () => (
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