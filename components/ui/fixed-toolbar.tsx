'use client';

import { cn } from '@/lib/utils';

import { Toolbar } from './toolbar';

export function FixedToolbar(props: React.ComponentProps<typeof Toolbar>) {
  return (
    <Toolbar
      {...props}
      className={cn(
        'scrollbar-hide sticky top-0 left-0 z-20 w-full justify-between overflow-x-auto rounded-t-sm border-b border-white/10 bg-[#100e0d] p-2 text-[#e8e1df] backdrop-blur-sm',
        props.className
      )}
    />
  );
}
