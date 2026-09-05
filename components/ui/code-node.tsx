'use client';

import * as React from 'react';

import type { PlateLeafProps } from 'platejs/react';

import { PlateLeaf } from 'platejs/react';

export function CodeLeaf(props: PlateLeafProps) {
  return (
    <PlateLeaf
      {...props}
      as="code"
      className="whitespace-pre-wrap rounded-sm bg-[#100e0d] border border-white/10 text-[#00ffec] px-[0.4em] py-[0.15em] font-mono text-xs"
    >
      {props.children}
    </PlateLeaf>
  );
}
