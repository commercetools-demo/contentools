import React, { useEffect, useReducer, useState } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RichTextFieldProps {
  /** HTML string. */
  value: string | undefined;
  onChange: (value: string) => void;
}

/** Font-size presets offered in the toolbar. Empty value == inherit/default. */
const FONT_SIZE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Default', value: '' },
  { label: 'Small (14px)', value: '14px' },
  { label: 'Normal (16px)', value: '16px' },
  { label: 'Large (20px)', value: '20px' },
  { label: 'X-Large (24px)', value: '24px' },
  { label: 'Huge (32px)', value: '32px' },
];

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------

const btnStyle = (active: boolean): React.CSSProperties => ({
  minWidth: 28,
  height: 28,
  padding: '0 6px',
  border: '1px solid var(--color-neutral-60, #b3b3b3)',
  borderRadius: 'var(--border-radius-4, 4px)',
  background: active ? 'var(--color-primary-95, #e6eefb)' : 'var(--color-surface, #fff)',
  color: active ? 'var(--color-primary, #1a1a2e)' : 'var(--color-solid, #303030)',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  lineHeight: '26px',
});

interface ToolbarButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ label, onClick, active, children }) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={active}
    title={label}
    // Prevent the editor losing selection when the button takes focus
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    style={btnStyle(!!active)}
  >
    {children}
  </button>
);

const Toolbar: React.FC<{ editor: Editor }> = ({ editor }) => {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const currentFontSize: string =
    (editor.getAttributes('textStyle').fontSize as string | undefined) ?? '';

  const applyFontSize = (size: string) => {
    const chain = editor.chain().focus();
    if (size) chain.setFontSize(size).run();
    else chain.unsetFontSize().run();
  };

  const openLink = () => {
    setLinkUrl((editor.getAttributes('link').href as string | undefined) ?? '');
    setLinkOpen(true);
  };

  const applyLink = () => {
    const chain = editor.chain().focus().extendMarkRange('link');
    if (linkUrl.trim()) chain.setLink({ href: linkUrl.trim() }).run();
    else chain.unsetLink().run();
    setLinkOpen(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        padding: 6,
        borderBottom: '1px solid var(--color-neutral-90, #e0e0e0)',
        background: 'var(--color-neutral-95, #f4f4f4)',
        alignItems: 'center',
      }}
    >
      <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <b>B</b>
      </ToolbarButton>
      <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <i>I</i>
      </ToolbarButton>
      <ToolbarButton label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <u>U</u>
      </ToolbarButton>
      <ToolbarButton label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <s>S</s>
      </ToolbarButton>

      <span style={{ width: 1, height: 20, background: 'var(--color-neutral-90, #e0e0e0)', margin: '0 2px' }} />

      <ToolbarButton label="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        H1
      </ToolbarButton>
      <ToolbarButton label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </ToolbarButton>
      <ToolbarButton label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </ToolbarButton>
      <ToolbarButton label="Paragraph" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()}>
        ¶
      </ToolbarButton>

      <span style={{ width: 1, height: 20, background: 'var(--color-neutral-90, #e0e0e0)', margin: '0 2px' }} />

      <ToolbarButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • ☰
      </ToolbarButton>
      <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1. ☰
      </ToolbarButton>
      <ToolbarButton label="Insert or edit link" active={editor.isActive('link')} onClick={openLink}>
        🔗
      </ToolbarButton>

      <span style={{ width: 1, height: 20, background: 'var(--color-neutral-90, #e0e0e0)', margin: '0 2px' }} />

      {/* Font size — task #2 */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-neutral-40, #666)' }}>
        <span aria-hidden="true">A</span>
        <select
          aria-label="Font size"
          value={currentFontSize}
          onChange={(e) => applyFontSize(e.target.value)}
          style={{
            height: 28,
            border: '1px solid var(--color-neutral-60, #b3b3b3)',
            borderRadius: 'var(--border-radius-4, 4px)',
            background: 'var(--color-surface, #fff)',
            fontSize: 12,
            padding: '0 4px',
          }}
        >
          {FONT_SIZE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      {linkOpen && (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', width: '100%', marginTop: 4 }}>
          <input
            type="url"
            aria-label="Link URL"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyLink();
              if (e.key === 'Escape') setLinkOpen(false);
            }}
            style={{
              flex: 1,
              height: 28,
              padding: '0 8px',
              border: '1px solid var(--color-neutral-60, #b3b3b3)',
              borderRadius: 'var(--border-radius-4, 4px)',
              fontSize: 13,
            }}
          />
          <ToolbarButton label="Apply link" onClick={applyLink}>
            OK
          </ToolbarButton>
          <ToolbarButton label="Cancel link" onClick={() => setLinkOpen(false)}>
            ✕
          </ToolbarButton>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// RichTextField — custom Puck field component (outputs HTML)
// ---------------------------------------------------------------------------

export const RichTextField: React.FC<RichTextFieldProps> = ({ value, onChange }) => {
  const editor = useEditor({
    // SSR-safe: avoid hydration mismatch warnings when used outside the editor
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
    ],
    content: value ?? '',
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      // TipTap emits "<p></p>" for empty content — normalise to empty string
      onChange(html === '<p></p>' ? '' : html);
    },
  });

  // Re-render toolbar state (active marks, current font size) on every transaction.
  const [, force] = useReducer((x: number) => x + 1, 0);
  useEffect(() => {
    if (!editor) return;
    const handler = () => force();
    editor.on('transaction', handler);
    return () => {
      editor.off('transaction', handler);
    };
  }, [editor]);

  // Sync external value changes (e.g. switching selected component) into the editor
  // without clobbering the cursor while the user is typing.
  useEffect(() => {
    if (!editor) return;
    const incoming = value ?? '';
    const isSame = editor.getHTML() === incoming || (incoming === '' && editor.isEmpty);
    if (!isSame) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [value, editor]);

  return (
    <div
      style={{
        border: '1px solid var(--color-neutral-60, #b3b3b3)',
        borderRadius: 'var(--border-radius-4, 4px)',
        overflow: 'hidden',
        background: 'var(--color-surface, #fff)',
      }}
    >
      {editor && <Toolbar editor={editor} />}
      <EditorContent
        editor={editor}
        className="puck-rich-text-editor"
        style={{ padding: '8px 12px', minHeight: 120, fontSize: 14, lineHeight: 1.5 }}
      />
      <style>{`
        .puck-rich-text-editor .tiptap { outline: none; min-height: 104px; }
        .puck-rich-text-editor .tiptap p { margin: 0 0 0.5em; }
        .puck-rich-text-editor .tiptap:focus { outline: none; }
        .puck-rich-text-editor .tiptap p.is-editor-empty:first-child::before {
          content: 'Start typing…';
          color: var(--color-neutral-60, #b3b3b3);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};
