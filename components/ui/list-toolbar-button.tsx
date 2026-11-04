'use client';

import * as React from 'react';

import { ListStyleType, someList, toggleList } from '@platejs/list';
import {
  useIndentTodoToolBarButton,
  useIndentTodoToolBarButtonState,
} from '@platejs/list/react';
import { List, ListOrdered, ListTodoIcon } from 'lucide-react';
import { useEditorRef, useEditorSelector } from 'platejs/react';

import { ToolbarButton } from './toolbar';

export function BulletedListToolbarButton() {
  const editor = useEditorRef();

  const pressed = useEditorSelector(
    (editor) =>
      someList(editor, [
        ListStyleType.Disc,
        ListStyleType.Circle,
        ListStyleType.Square,
      ]),
    []
  );

  return (
    <ToolbarButton
      tooltip="Bulleted List"
      onClick={() => {
        toggleList(editor, {
          listStyleType: ListStyleType.Disc,
        });
      }}
      data-state={pressed ? 'on' : 'off'}
      className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
    >
      <List className="size-4" />
    </ToolbarButton>
  );
}

export function NumberedListToolbarButton() {
  const editor = useEditorRef();

  const pressed = useEditorSelector(
    (editor) =>
      someList(editor, [
        ListStyleType.Decimal,
        ListStyleType.LowerAlpha,
        ListStyleType.UpperAlpha,
        ListStyleType.LowerRoman,
        ListStyleType.UpperRoman,
      ]),
    []
  );

  return (
    <ToolbarButton
      tooltip="Numbered List (1, 2, 3)"
      onClick={() =>
        toggleList(editor, {
          listStyleType: ListStyleType.Decimal,
        })
      }
      data-state={pressed ? 'on' : 'off'}
      className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
    >
      <ListOrdered className="size-4" />
    </ToolbarButton>
  );
}

export function TodoListToolbarButton(
  props: React.ComponentProps<typeof ToolbarButton>
) {
  const state = useIndentTodoToolBarButtonState({ nodeType: 'todo' });
  const { props: buttonProps } = useIndentTodoToolBarButton(state);

  return (
    <ToolbarButton {...props} {...buttonProps} tooltip="Todo">
      <ListTodoIcon />
    </ToolbarButton>
  );
}
