'use client';

import { startTransition, useMemo, useOptimistic, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { models } from '@/lib/ai/models';
import { cn } from '@/lib/utils';
import { CheckCircle, ChevronDown } from 'lucide-react';
import { saveModelId } from '@/app/(chat)/actions';


export function ModelSelector({
  selectedModelId,
  className,
} ) {
  const [open, setOpen] = useState(false);
  const [optimisticModelId, setOptimisticModelId] =
    useOptimistic(selectedModelId);

  const selectedModel = useMemo(
    () => models.find((model) => model.id === optimisticModelId),
    [optimisticModelId],
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
          className,
        )}
      >
        <Button variant="outline" className="md:px-2 md:h-[34px]">
          {selectedModel?.label}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[300px]">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onSelect={() => {
              setOpen(false);

              startTransition(() => {
                setOptimisticModelId(model.id);
                saveModelId(model.id);
              });
            }}
            className="gap-4 group/item flex flex-row justify-between items-center"
            data-active={model.id === optimisticModelId}
          >
            <div className="flex flex-col gap-1 items-start">
              {model.label}
              {model.description && (
                <div className="text-xs text-muted-foreground">
                  {model.description}
                </div>
              )}
            </div>
            <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
              <CheckCircle />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
