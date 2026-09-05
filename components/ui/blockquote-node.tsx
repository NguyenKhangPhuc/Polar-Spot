'use client';

import { type PlateElementProps, PlateElement } from 'platejs/react';

export function BlockquoteElement(props: PlateElementProps) {
  return (
    <PlateElement
      as="blockquote"
      className="my-3 border-l-2 border-[#00ffec] bg-[#00ffec]/5 pl-4 pr-3 py-2 text-[#b9cbc2] italic rounded-r-sm"
      {...props}
    />
  );
}
