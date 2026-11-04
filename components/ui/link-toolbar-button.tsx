'use client';

import * as React from 'react';

import { unwrapLink, upsertLink } from '@platejs/link';
import { useLinkToolbarButtonState } from '@platejs/link/react';
import { Check, Link, Unlink } from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorRef } from 'platejs/react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { ToolbarButton } from './toolbar';

export function LinkToolbarButton(
  props: React.ComponentProps<typeof ToolbarButton>
) {
  const editor = useEditorRef();
  const state = useLinkToolbarButtonState();
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState('');
  const [text, setText] = React.useState('');

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && editor) {
      const linkEntry = editor.api.node({
        match: { type: editor.getType(KEYS.link) },
      });
      if (linkEntry) {
        const [linkNode, linkPath] = linkEntry;
        setUrl(typeof linkNode.url === 'string' ? linkNode.url : '');
        setText(editor.api.string(linkPath) || '');
      } else {
        setUrl('');
        setText(
          editor.selection ? editor.api.string(editor.selection) || '' : ''
        );
      }
    }
    setOpen(nextOpen);
  };

  const handleApply = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;
    const normalizedUrl = /^https?:\/\/|^mailto:|^tel:/i.test(trimmedUrl)
      ? trimmedUrl
      : `https://${trimmedUrl}`;

    upsertLink(editor, {
      url: normalizedUrl,
      text: text.trim() || normalizedUrl,
      target: '_blank',
      skipValidation: true,
    });
    setOpen(false);
    editor.tf.focus();
  };

  const handleUnlink = () => {
    unwrapLink(editor);
    setOpen(false);
    editor.tf.focus();
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
      <PopoverTrigger asChild>
        <ToolbarButton
          {...props}
          pressed={state.pressed || open}
          data-plate-focus
          tooltip="Link"
        >
          <Link />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-72 p-3 bg-[#1d1b1a] border border-white/15 text-[#e8e1df] rounded-sm shadow-xl"
      >
        <div className="flex flex-col gap-2.5 font-mono text-xs">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#83958d]">
              URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleApply();
                }
              }}
              placeholder="https://example.com"
              className="bg-[#151312] text-[#e8e1df] placeholder-[#83958d]/50 border border-white/10 focus:border-[#00ffec]/60 rounded-sm px-2.5 py-1.5 text-xs outline-none"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#83958d]">
              DISPLAY TEXT
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleApply();
                }
              }}
              placeholder="Link label (optional)"
              className="bg-[#151312] text-[#e8e1df] placeholder-[#83958d]/50 border border-white/10 focus:border-[#00ffec]/60 rounded-sm px-2.5 py-1.5 text-xs outline-none"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            {state.pressed && (
              <button
                type="button"
                onClick={handleUnlink}
                className="flex items-center gap-1 px-2.5 py-1 rounded-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 text-[11px] font-bold uppercase cursor-pointer"
              >
                <Unlink className="size-3" />
                Unlink
              </button>
            )}
            <button
              type="button"
              onClick={() => handleApply()}
              className="flex items-center gap-1 px-3 py-1 rounded-sm bg-[#00ffec] text-[#00382b] hover:bg-[#00e6d4] text-[11px] font-bold uppercase cursor-pointer"
            >
              <Check className="size-3" />
              Apply
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
