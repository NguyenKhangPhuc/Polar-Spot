"use client";

import React, { useId } from "react";
import { Plate, usePlateEditor } from "platejs/react";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { EditorContainer, Editor } from "@/components/ui/editor";
import { FixedToolbarButtons } from "@/components/ui/fixed-toolbar-buttons";
import { TooltipProvider } from "@/components/ui/tooltip";

import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  HighlightPlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  H4Plugin,
  H5Plugin,
  H6Plugin,
  BlockquotePlugin,
  HorizontalRulePlugin,
} from "@platejs/basic-nodes/react";

import {
  FontSizePlugin,
  FontColorPlugin,
  FontBackgroundColorPlugin,
  FontFamilyPlugin,
  TextAlignPlugin,
  LineHeightPlugin,
} from "@platejs/basic-styles/react";

import { LinkPlugin } from "@platejs/link/react";
import { ListPlugin } from "@platejs/list/react";
import { IndentPlugin } from "@platejs/indent/react";
import {
  TablePlugin,
  TableRowPlugin,
  TableCellPlugin,
  TableCellHeaderPlugin,
} from "@platejs/table/react";
import {
  ImagePlugin,
  VideoPlugin,
  AudioPlugin,
  FilePlugin,
  MediaEmbedPlugin,
} from "@platejs/media/react";
import { DatePlugin } from "@platejs/date/react";
import { TogglePlugin } from "@platejs/toggle/react";

import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value?: any;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

// Convert JSON value or HTML string to Slate/Plate value format safely
const parseInitialValue = (val?: any) => {
  if (!val) {
    return [
      {
        type: "p",
        children: [{ text: "" }],
      },
    ];
  }
  if (Array.isArray(val) && val.length > 0) {
    return val;
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed) {
      return [
        {
          type: "p",
          children: [{ text: "" }],
        },
      ];
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // If val is raw text or HTML, wrap in paragraph
      return [
        {
          type: "p",
          children: [{ text: val }],
        },
      ];
    }
  }
  return [
    {
      type: "p",
      children: [{ text: "" }],
    },
  ];
};

const editorPlugins = [
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  HighlightPlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  H4Plugin,
  H5Plugin,
  H6Plugin,
  BlockquotePlugin,
  HorizontalRulePlugin,
  FontSizePlugin,
  FontColorPlugin,
  FontBackgroundColorPlugin,
  FontFamilyPlugin,
  TextAlignPlugin,
  LineHeightPlugin,
  LinkPlugin,
  ListPlugin,
  IndentPlugin,
  TablePlugin,
  TableRowPlugin,
  TableCellPlugin,
  TableCellHeaderPlugin,
  ImagePlugin,
  VideoPlugin,
  AudioPlugin,
  FilePlugin,
  MediaEmbedPlugin,
  DatePlugin,
  TogglePlugin,
];

// Rich typography rules matching cyber-frost dark theme (#00ffec, #151312, #e8e1df, #b9cbc2)
const richtextThemeClasses = cn(
  // Base typography
  "text-[#b9cbc2] font-sans text-sm md:text-base leading-relaxed selection:bg-[#00ffec]/20 selection:text-[#00ffec]",
  // Headings
  "[&_h1]:font-montserrat [&_h1]:font-bold [&_h1]:text-2xl [&_h1]:md:text-3xl [&_h1]:text-[#e8e1df] [&_h1]:tracking-tight [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:pb-2 [&_h1]:border-b [&_h1]:border-white/10 [&_h1:first-child]:mt-0",
  "[&_h2]:font-montserrat [&_h2]:font-bold [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:text-[#e8e1df] [&_h2]:tracking-tight [&_h2]:mt-5 [&_h2]:mb-2.5 [&_h2:first-child]:mt-0",
  "[&_h3]:font-montserrat [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:md:text-xl [&_h3]:text-[#00ffec] [&_h3]:tracking-tight [&_h3]:mt-4 [&_h3]:mb-2 [&_h3:first-child]:mt-0",
  "[&_h4]:font-montserrat [&_h4]:font-semibold [&_h4]:text-base [&_h4]:text-[#e8e1df] [&_h4]:mt-3 [&_h4]:mb-1.5 [&_h4:first-child]:mt-0",
  "[&_h5]:font-semibold [&_h5]:text-sm [&_h5]:text-[#e8e1df] [&_h5]:mt-3 [&_h5]:mb-1",
  "[&_h6]:font-semibold [&_h6]:text-xs [&_h6]:text-[#83958d] [&_h6]:uppercase [&_h6]:tracking-wider [&_h6]:mt-3 [&_h6]:mb-1",
  // Paragraphs
  "[&_p]:text-[#b9cbc2] [&_p]:leading-relaxed [&_p]:my-2.5",
  // Inline marks
  "[&_strong]:font-bold [&_strong]:text-[#e8e1df]",
  "[&_em]:italic [&_em]:text-[#b9cbc2]",
  "[&_u]:underline [&_u]:underline-offset-2 [&_u]:decoration-[#00ffec]/60",
  "[&_s]:line-through [&_s]:text-[#83958d]",
  // Links
  "[&_a]:text-[#00ffec] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-[#00ffec]/50 hover:[&_a]:decoration-[#00ffec] hover:[&_a]:text-[#3be1fe] [&_a]:transition-colors",
  // Inline Code
  "[&:not(pre)_code]:font-mono [&:not(pre)_code]:text-xs [&:not(pre)_code]:text-[#00ffec] [&:not(pre)_code]:bg-[#100e0d] [&:not(pre)_code]:border [&:not(pre)_code]:border-white/10 [&:not(pre)_code]:px-1.5 [&:not(pre)_code]:py-0.5 [&:not(pre)_code]:rounded-sm",
  // Code Blocks
  "[&_pre]:bg-[#100e0d] [&_pre]:border [&_pre]:border-white/10 [&_pre]:p-4 [&_pre]:rounded-sm [&_pre]:overflow-x-auto [&_pre]:my-4 [&_pre]:text-xs [&_pre]:font-mono [&_pre]:text-[#00ffec]",
  "[&_pre_code]:bg-transparent [&_pre_code]:border-0 [&_pre_code]:p-0 [&_pre_code]:text-[#00ffec]",
  // Blockquotes
  "[&_blockquote]:border-l-2 [&_blockquote]:border-[#00ffec] [&_blockquote]:bg-[#00ffec]/5 [&_blockquote]:text-[#b9cbc2] [&_blockquote]:italic [&_blockquote]:pl-4 [&_blockquote]:pr-3 [&_blockquote]:py-2.5 [&_blockquote]:my-3.5 [&_blockquote]:rounded-r-sm",
  // Lists
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:my-3 [&_ul]:text-[#b9cbc2] [&_ul]:marker:text-[#00ffec]",
  "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:my-3 [&_ol]:text-[#b9cbc2] [&_ol]:marker:text-[#00ffec] [&_ol]:marker:font-mono",
  "[&_li]:text-sm [&_li]:leading-relaxed",
  // Dividers
  "[&_hr]:border-0 [&_hr]:border-t [&_hr]:border-white/10 [&_hr]:my-6",
  // Tables
  "[&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:border [&_table]:border-white/10 [&_table]:text-sm",
  "[&_th]:bg-[#100e0d] [&_th]:border [&_th]:border-white/10 [&_th]:px-3.5 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-mono [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-[#00ffec]",
  "[&_td]:border [&_td]:border-white/5 [&_td]:px-3.5 [&_td]:py-2 [&_td]:text-[#b9cbc2]"
);

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write detailed event description, schedule rules, guidelines...",
  className = "",
  readOnly = false,
}: RichTextEditorProps) {
  const plateId = useId();
  const editor = usePlateEditor({
    id: plateId,
    value: parseInitialValue(value),
    plugins: editorPlugins,
  });

  // Sync editor change to parent callback
  const handleEditorChange = ({ value: newValue }: { value: any }) => {
    if (!readOnly && onChange) {
      // Serialize value as JSON string for storage
      const jsonString = JSON.stringify(newValue);
      onChange(jsonString);
    }
  };

  return (
    <div
      onClick={() => {
        if (!readOnly && editor) {
          editor.tf.focus();
        }
      }}
      className={cn(
        "flex flex-col overflow-hidden transition-all duration-200",
        readOnly
          ? "bg-[#151312] border border-white/5 rounded-sm p-4 md:p-6 text-[#e8e1df]"
          : "border border-white/10 rounded-sm bg-[#151312] text-[#e8e1df] focus-within:border-[#00ffec]/50 cursor-text",
        className
      )}
    >
      <TooltipProvider>
        <Plate editor={editor} onChange={handleEditorChange} readOnly={readOnly}>
          <EditorContainer
            className={cn(
              "flex-1 flex flex-col min-h-0",
              readOnly ? "overflow-visible" : "cursor-text caret-[#00ffec]"
            )}
          >
            {!readOnly && (
              <FixedToolbar>
                <FixedToolbarButtons />
              </FixedToolbar>
            )}

            <Editor
              placeholder={readOnly ? "" : placeholder}
              readOnly={readOnly}
              className={cn(
                "flex-1 w-full text-sm leading-relaxed transition-colors focus-visible:outline-none",
                readOnly
                  ? "p-0 min-h-0 cursor-default select-text focus:ring-0 focus:outline-none"
                  : "p-4 min-h-[220px] text-[#e8e1df] cursor-text caret-[#00ffec]",
                richtextThemeClasses
              )}
            />
          </EditorContainer>
        </Plate>
      </TooltipProvider>
    </div>
  );
}

export default RichTextEditor;
