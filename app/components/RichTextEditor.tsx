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

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Convert JSON value or HTML string to Slate/Plate value format safely
const parseInitialValue = (val?: string) => {
  if (!val || val.trim() === "") {
    return [
      {
        type: "p",
        children: [{ text: "" }],
      },
    ];
  }
  try {
    const parsed = JSON.parse(val);
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

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write detailed event description, schedule rules, guidelines...",
  className = "",
}: RichTextEditorProps) {
  const plateId = useId();
  const editor = usePlateEditor({
    id: plateId,
    value: parseInitialValue(value),
    plugins: editorPlugins,
  });

  // Sync editor change to parent callback
  const handleEditorChange = ({ value: newValue }: { value: any }) => {
    if (onChange) {
      // Serialize value as JSON string for storage
      const jsonString = JSON.stringify(newValue);
      onChange(jsonString);
    }
  };

  return (
    <div className={`flex flex-col border border-white/15 rounded-xl bg-[#0a1526] overflow-hidden ${className}`}>
      <TooltipProvider>
        <Plate editor={editor} onChange={handleEditorChange}>
          <EditorContainer>
            <FixedToolbar>
              <FixedToolbarButtons />
            </FixedToolbar>

            <Editor placeholder={placeholder} />
          </EditorContainer>
        </Plate>
      </TooltipProvider>
    </div>
  );
}

export default RichTextEditor;
