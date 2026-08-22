'use client';

import { cn } from '@/lib/utils';

import { Toolbar } from './toolbar';

export function FixedToolbar(props: React.ComponentProps<typeof Toolbar>) {
  return (
    <Toolbar
      {...props}
      className={cn(
        'scrollbar-hide sticky top-0 left-0 z-20 w-full justify-between overflow-x-auto rounded-t-md border-b border-white/15 bg-[#000000] p-2 text-slate-100 backdrop-blur-sm',
        props.className
      )}
    />
  );
}
