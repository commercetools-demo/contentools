import { createGlobalStyle } from 'styled-components';

export const TipTapEditorStyles = createGlobalStyle`
  /* Import Google Fonts */
  @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

  /* Body and HTML styles for editor app */
  body {
    --tt-toolbar-height: 44px;
    --tt-theme-text: var(--tt-gray-light-900);
    font-family: "Inter", sans-serif;
    color: var(--tt-theme-text);
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    padding: 0;
    overscroll-behavior-y: none;

    .dark & {
      --tt-theme-text: var(--tt-gray-dark-900);
    }
  }

  html,
  body {
    overscroll-behavior-x: none;
  }

  html,
  body,
  #root,
  #app {
    height: 100%;
    background-color: var(--tt-bg-color);
  }

  ::-webkit-scrollbar {
    width: 0.25rem;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: var(--tt-scrollbar-color) transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--tt-scrollbar-color);
    border-radius: 9999px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Editor wrapper styles */
  .simple-editor-wrapper {
    overflow: auto;
  }

  .simple-editor-content {
    max-width: 648px;
    width: 100%;
    margin: 0 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;

    .tiptap.ProseMirror.simple-editor {
      flex: 1;
      padding: 3rem 3rem 30vh;
    }
  }

  /* ====================================================================
     TIPTAP EDITOR CORE STYLES
     ==================================================================== */

  .tiptap.ProseMirror {
    /* CSS Variables */
    --tt-collaboration-carets-label: var(--tt-gray-light-900);
    --link-text-color: var(--tt-brand-color-500);
    --thread-text: var(--tt-gray-light-900);
    --placeholder-color: var(--tt-gray-light-a-400);
    --thread-bg-color: var(--tt-color-yellow-inc-2);
    --tiptap-ai-insertion-color: var(--tt-brand-color-600);
    
    /* Blockquote */
    --blockquote-bg-color: var(--tt-gray-light-900);
    
    /* Horizontal Rule */
    --horizontal-rule-color: var(--tt-gray-light-a-200);
    
    /* Code */
    --tt-inline-code-bg-color: var(--tt-gray-light-a-100);
    --tt-inline-code-text-color: var(--tt-gray-light-a-700);
    --tt-inline-code-border-color: var(--tt-gray-light-a-200);
    --tt-codeblock-bg: var(--tt-gray-light-a-50);
    --tt-codeblock-text: var(--tt-gray-light-a-800);
    --tt-codeblock-border: var(--tt-gray-light-a-200);
    
    /* Lists */
    --tt-checklist-bg-color: var(--tt-gray-light-a-100);
    --tt-checklist-bg-active-color: var(--tt-gray-light-a-900);
    --tt-checklist-border-color: var(--tt-gray-light-a-200);
    --tt-checklist-border-active-color: var(--tt-gray-light-a-900);
    --tt-checklist-check-icon-color: var(--white);
    --tt-checklist-text-active: var(--tt-gray-light-a-500);

    .dark & {
      --tt-collaboration-carets-label: var(--tt-gray-dark-100);
      --link-text-color: var(--tt-brand-color-400);
      --thread-text: var(--tt-gray-dark-900);
      --placeholder-color: var(--tt-gray-dark-a-400);
      --thread-bg-color: var(--tt-color-yellow-dec-2);
      --tiptap-ai-insertion-color: var(--tt-brand-color-400);
      
      --blockquote-bg-color: var(--tt-gray-dark-900);
      --horizontal-rule-color: var(--tt-gray-dark-a-200);
      
      --tt-inline-code-bg-color: var(--tt-gray-dark-a-100);
      --tt-inline-code-text-color: var(--tt-gray-dark-a-700);
      --tt-inline-code-border-color: var(--tt-gray-dark-a-200);
      --tt-codeblock-bg: var(--tt-gray-dark-a-50);
      --tt-codeblock-text: var(--tt-gray-dark-a-800);
      --tt-codeblock-border: var(--tt-gray-dark-a-200);
      
      --tt-checklist-bg-color: var(--tt-gray-dark-a-100);
      --tt-checklist-bg-active-color: var(--tt-gray-dark-a-900);
      --tt-checklist-border-color: var(--tt-gray-dark-a-200);
      --tt-checklist-border-active-color: var(--tt-gray-dark-a-900);
      --tt-checklist-check-icon-color: var(--black);
      --tt-checklist-text-active: var(--tt-gray-dark-a-500);
    }

    /* Font setup */
    font-family: "DM Sans", sans-serif;
    white-space: pre-wrap;
    outline: none;
    caret-color: var(--tt-cursor-color);

    /* Ensure relative positioning for placeholders */
    > * {
      position: relative;
    }

    /* ============================
       PARAGRAPHS
       ============================ */
    p:not(:first-child) {
      font-size: 1rem;
      line-height: 1.6;
      font-weight: normal;
      margin-top: 20px;
    }

    /* ============================
       HEADINGS
       ============================ */
    h1, h2, h3, h4 {
      position: relative;
      color: inherit;
      font-style: inherit;

      &:first-child {
        margin-top: 0;
      }
    }

    h1 {
      font-size: 1.5em;
      font-weight: 700;
      margin-top: 3em;
    }

    h2 {
      font-size: 1.25em;
      font-weight: 700;
      margin-top: 2.5em;
    }

    h3 {
      font-size: 1.125em;
      font-weight: 600;
      margin-top: 2em;
    }

    h4 {
      font-size: 1em;
      font-weight: 600;
      margin-top: 2em;
    }

    /* ============================
       BLOCKQUOTES
       ============================ */
    blockquote {
      position: relative;
      padding-left: 1em;
      padding-top: 0.375em;
      padding-bottom: 0.375em;
      margin: 1.5rem 0;

      p {
        margin-top: 0;
      }

      &::before,
      &.is-empty::before {
        position: absolute;
        bottom: 0;
        left: 0;
        top: 0;
        height: 100%;
        width: 0.25em;
        background-color: var(--blockquote-bg-color);
        content: "";
        border-radius: 0;
      }
    }

    /* ============================
       HORIZONTAL RULES
       ============================ */
    hr {
      border: none;
      height: 1px;
      background-color: var(--horizontal-rule-color);
    }

    [data-type="horizontalRule"] {
      margin-top: 2.25em;
      margin-bottom: 2.25em;
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    }

    /* ============================
       CODE FORMATTING
       ============================ */
    code {
      background-color: var(--tt-inline-code-bg-color);
      color: var(--tt-inline-code-text-color);
      border: 1px solid var(--tt-inline-code-border-color);
      font-family: "JetBrains Mono NL", monospace;
      font-size: 0.875em;
      line-height: 1.4;
      padding: 0.125em 0.375em;
      border-radius: var(--tt-radius-xs, 0.25rem);
    }

    pre {
      margin: 1.5rem 0;
      background-color: var(--tt-codeblock-bg);
      border: 1px solid var(--tt-codeblock-border);
      border-radius: var(--tt-radius-md, 0.5rem);
      overflow: auto;

      code {
        display: block;
        padding: 0.875rem 1rem;
        color: var(--tt-codeblock-text);
        background: transparent;
        border: none;
        font-family: "JetBrains Mono NL", monospace;
        font-size: 0.875rem;
        line-height: 1.5;
      }
    }

    /* ============================
       LISTS
       ============================ */
    ol, ul {
      margin-top: 1.5em;
      margin-bottom: 1.5em;
      padding-left: 1.5em;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }

      ol, ul {
        margin-top: 0;
        margin-bottom: 0;
      }
    }

    li {
      p {
        margin-top: 0;
        line-height: 1.6;
      }
    }

    /* Ordered lists */
    ol {
      list-style: decimal;

      ol {
        list-style: lower-alpha;

        ol {
          list-style: lower-roman;
        }
      }
    }

    /* Unordered lists */
    ul:not([data-type="taskList"]) {
      list-style: disc;

      ul {
        list-style: circle;

        ul {
          list-style: square;
        }
      }
    }

    /* Task lists */
    ul[data-type="taskList"] {
      padding-left: 0.25em;

      li {
        display: flex;
        flex-direction: row;
        align-items: flex-start;

        &:not(:has(> p:first-child)) {
          list-style-type: none;
        }

        &[data-checked="true"] {
          > div > p {
            opacity: 0.5;
            text-decoration: line-through;
          }

          > div > p span {
            text-decoration: line-through;
          }
        }

        label {
          position: relative;
          padding-top: 0.375rem;
          padding-right: 0.5rem;

          input[type="checkbox"] {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
          }

          span {
            display: block;
            width: 1em;
            height: 1em;
            border: 1px solid var(--tt-checklist-border-color);
            border-radius: var(--tt-radius-xs, 0.25rem);
            position: relative;
            cursor: pointer;
            background-color: var(--tt-checklist-bg-color);
            transition: background-color 80ms ease-out, border-color 80ms ease-out;

            &::before {
              content: "";
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 0.75em;
              height: 0.75em;
              background-color: var(--tt-checklist-check-icon-color);
              opacity: 0;
              -webkit-mask: url("data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22currentColor%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M21.4142%204.58579C22.1953%205.36683%2022.1953%206.63317%2021.4142%207.41421L10.4142%2018.4142C9.63317%2019.1953%208.36684%2019.1953%207.58579%2018.4142L2.58579%2013.4142C1.80474%2012.6332%201.80474%2011.3668%202.58579%2010.5858C3.36683%209.80474%204.63317%209.80474%205.41421%2010.5858L9%2014.1716L18.5858%204.58579C19.3668%203.80474%2020.6332%203.80474%2021.4142%204.58579Z%22%20fill%3D%22currentColor%22%2F%3E%3C%2Fsvg%3E") center/contain no-repeat;
              mask: url("data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22currentColor%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M21.4142%204.58579C22.1953%205.36683%2022.1953%206.63317%2021.4142%207.41421L10.4142%2018.4142C9.63317%2019.1953%208.36684%2019.1953%207.58579%2018.4142L2.58579%2013.4142C1.80474%2012.6332%201.80474%2011.3668%202.58579%2010.5858C3.36683%209.80474%204.63317%209.80474%205.41421%2010.5858L9%2014.1716L18.5858%204.58579C19.3668%203.80474%2020.6332%203.80474%2021.4142%204.58579Z%22%20fill%3D%22currentColor%22%2F%3E%3C%2Fsvg%3E") center/contain no-repeat;
            }
          }

          input[type="checkbox"]:checked + span {
            background: var(--tt-checklist-bg-active-color);
            border-color: var(--tt-checklist-border-active-color);

            &::before {
              opacity: 1;
            }
          }
        }

        div {
          flex: 1 1 0%;
          min-width: 0;
        }
      }
    }

    /* ============================
       IMAGES
       ============================ */
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    > img:not([data-type="emoji"] img) {
      margin: 2rem 0;
      outline: 0.125rem solid transparent;
      border-radius: var(--tt-radius-xs, 0.25rem);
    }

    img:not([data-type="emoji"] img).ProseMirror-selectednode {
      outline-color: var(--tt-brand-color-500);
    }

    .tiptap-thread:has(> img) {
      margin: 2rem 0;

      img {
        outline: 0.125rem solid transparent;
        border-radius: var(--tt-radius-xs, 0.25rem);
      }
    }

    .tiptap-thread img {
      margin: 0;
    }

    /* ============================
       SELECTION STYLES
       ============================ */
    &:not(.readonly):not(.ProseMirror-hideselection) {
      ::selection {
        background-color: var(--tt-selection-color);
      }

      .selection::selection {
        background: transparent;
      }
    }

    .selection {
      display: inline;
      background-color: var(--tt-selection-color);
    }

    .ProseMirror-selectednode:not(img):not(pre):not(.react-renderer) {
      border-radius: var(--tt-radius-md);
      background-color: var(--tt-selection-color);
    }

    .ProseMirror-hideselection {
      caret-color: transparent;
    }

    &.resize-cursor {
      cursor: ew-resize;
      cursor: col-resize;
    }

    /* ============================
       TEXT DECORATION
       ============================ */
    a span {
      text-decoration: underline;
    }

    s span {
      text-decoration: line-through;
    }

    u span {
      text-decoration: underline;
    }

    .tiptap-ai-insertion {
      color: var(--tiptap-ai-insertion-color);
    }

    /* ============================
       LINKS
       ============================ */
    a {
      color: var(--link-text-color);
      text-decoration: underline;
    }

    /* ============================
       EMOJI
       ============================ */
    [data-type="emoji"] img {
      display: inline-block;
      width: 1.25em;
      height: 1.25em;
      cursor: text;
    }

    /* ============================
       MENTION
       ============================ */
    [data-type="mention"] {
      display: inline-block;
      color: var(--tt-brand-color-500);
    }

    /* ============================
       COLLABORATION
       ============================ */
    .collaboration-carets {
      &__caret {
        border-right: 1px solid transparent;
        border-left: 1px solid transparent;
        pointer-events: none;
        margin-left: -1px;
        margin-right: -1px;
        position: relative;
        word-break: normal;
      }

      &__label {
        color: var(--tt-collaboration-carets-label);
        border-radius: 0.25rem;
        border-bottom-left-radius: 0;
        font-size: 0.75rem;
        font-weight: 600;
        left: -1px;
        line-height: 1;
        padding: 0.125rem 0.375rem;
        position: absolute;
        top: -1.3em;
        user-select: none;
        white-space: nowrap;
      }
    }

    /* ============================
       THREADS
       ============================ */
    .tiptap-thread.tiptap-thread--unresolved.tiptap-thread--inline {
      transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
      color: var(--thread-text);
      border-bottom: 2px dashed var(--tt-color-yellow-base);
      font-weight: 600;

      &.tiptap-thread--selected,
      &.tiptap-thread--hovered {
        background-color: var(--thread-bg-color);
        border-bottom-color: transparent;
      }
    }

    .tiptap-thread.tiptap-thread--unresolved.tiptap-thread--block {
      &:has(img) {
        outline: 0.125rem solid var(--tt-color-yellow-base);
        border-radius: var(--tt-radius-xs, 0.25rem);
        overflow: hidden;
        width: fit-content;

        &.tiptap-thread--selected {
          outline-width: 0.25rem;
          outline-color: var(--tt-color-yellow-base);
        }

        &.tiptap-thread--hovered {
          outline-width: 0.25rem;
        }
      }

      &:not(:has(img)) {
        border-radius: 0.25rem;
        border-bottom: 0.125rem dashed var(--tt-color-yellow-base);
        padding-bottom: 0.5rem;
        outline: 0.25rem solid transparent;

        &.tiptap-thread--hovered,
        &.tiptap-thread--selected {
          background-color: var(--tt-color-yellow-base);
          outline-color: var(--tt-color-yellow-base);
        }
      }
    }

    .tiptap-thread.tiptap-thread--resolved.tiptap-thread--inline.tiptap-thread--selected {
      background-color: var(--tt-color-yellow-base);
      border-color: transparent;
      opacity: 0.5;
    }

    .tiptap-thread.tiptap-thread--block:has(.react-renderer) {
      margin-top: 3rem;
      margin-bottom: 3rem;
    }

    /* ============================
       DROP CURSOR
       ============================ */
    .prosemirror-dropcursor-block,
    .prosemirror-dropcursor-inline {
      background: var(--tt-brand-color-400) !important;
      border-radius: 0.25rem;
      margin-left: -1px;
      margin-right: -1px;
      width: 100%;
      height: 0.188rem;
      cursor: grabbing;
    }
  }

  /* ============================
     PLACEHOLDER STYLES
     ============================ */
  .is-empty:not(.with-slash)[data-placeholder]:has(> .ProseMirror-trailingBreak:only-child)::before {
    content: attr(data-placeholder);
  }

  .is-empty.with-slash[data-placeholder]:has(> .ProseMirror-trailingBreak:only-child)::before {
    content: "Write, type '/' for commands…";
    font-style: italic;
  }

  .is-empty[data-placeholder]:has(> .ProseMirror-trailingBreak:only-child):before {
    pointer-events: none;
    height: 0;
    position: absolute;
    width: 100%;
    text-align: inherit;
    left: 0;
    right: 0;
  }

  .is-empty[data-placeholder]:has(> .ProseMirror-trailingBreak):before {
    color: var(--placeholder-color);
  }

  /* ====================================================================
     IMAGE UPLOAD COMPONENT STYLES
     ==================================================================== */
  
  :root {
    --tiptap-image-upload-active: var(--tt-brand-color-500);
    --tiptap-image-upload-progress-bg: var(--tt-brand-color-50);
    --tiptap-image-upload-icon-bg: var(--tt-brand-color-500);
    --tiptap-image-upload-text-color: var(--tt-gray-light-a-700);
    --tiptap-image-upload-subtext-color: var(--tt-gray-light-a-400);
    --tiptap-image-upload-border: var(--tt-gray-light-a-300);
    --tiptap-image-upload-border-hover: var(--tt-gray-light-a-400);
    --tiptap-image-upload-border-active: var(--tt-brand-color-500);
    --tiptap-image-upload-icon-doc-bg: var(--tt-gray-light-a-200);
    --tiptap-image-upload-icon-doc-border: var(--tt-gray-light-300);
    --tiptap-image-upload-icon-color: var(--white);
  }

  .dark {
    --tiptap-image-upload-active: var(--tt-brand-color-400);
    --tiptap-image-upload-progress-bg: var(--tt-brand-color-900);
    --tiptap-image-upload-icon-bg: var(--tt-brand-color-400);
    --tiptap-image-upload-text-color: var(--tt-gray-dark-a-700);
    --tiptap-image-upload-subtext-color: var(--tt-gray-dark-a-400);
    --tiptap-image-upload-border: var(--tt-gray-dark-a-300);
    --tiptap-image-upload-border-hover: var(--tt-gray-dark-a-400);
    --tiptap-image-upload-border-active: var(--tt-brand-color-400);
    --tiptap-image-upload-icon-doc-bg: var(--tt-gray-dark-a-200);
    --tiptap-image-upload-icon-doc-border: var(--tt-gray-dark-300);
    --tiptap-image-upload-icon-color: var(--black);
  }

  .tiptap-image-upload {
    margin: 2rem 0;

    input[type="file"] {
      display: none;
    }

    .tiptap-image-upload-dropzone {
      position: relative;
      width: 3.125rem;
      height: 3.75rem;
      display: inline-flex;
      align-items: flex-start;
      justify-content: center;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    .tiptap-image-upload-icon-container {
      position: absolute;
      width: 1.75rem;
      height: 1.75rem;
      bottom: 0;
      right: 0;
      background-color: var(--tiptap-image-upload-icon-bg);
      border-radius: var(--tt-radius-lg, 0.75rem);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tiptap-image-upload-icon {
      width: 0.875rem;
      height: 0.875rem;
      color: var(--tiptap-image-upload-icon-color);
    }

    .tiptap-image-upload-dropzone-rect-primary {
      color: var(--tiptap-image-upload-icon-doc-bg);
      position: absolute;
    }

    .tiptap-image-upload-dropzone-rect-secondary {
      position: absolute;
      top: 0;
      right: 0.25rem;
      bottom: 0;
      color: var(--tiptap-image-upload-icon-doc-border);
    }

    .tiptap-image-upload-text {
      color: var(--tiptap-image-upload-text-color);
      font-weight: 500;
      font-size: 0.875rem;
      line-height: normal;

      em {
        font-style: normal;
        text-decoration: underline;
      }
    }

    .tiptap-image-upload-subtext {
      color: var(--tiptap-image-upload-subtext-color);
      font-weight: 600;
      line-height: normal;
      font-size: 0.75rem;
    }

    .tiptap-image-upload-drag-area {
      padding: 2rem 1.5rem;
      border: 1.5px dashed var(--tiptap-image-upload-border);
      border-radius: var(--tt-radius-md, 0.5rem);
      text-align: center;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--tiptap-image-upload-border-hover);
      }

      &.drag-active {
        border-color: var(--tiptap-image-upload-border-active);
        background-color: rgba(var(--tiptap-image-upload-active-rgb, 0, 123, 255), 0.05);
      }

      &.drag-over {
        border-color: var(--tiptap-image-upload-border-active);
        background-color: rgba(var(--tiptap-image-upload-active-rgb, 0, 123, 255), 0.1);
      }
    }

    .tiptap-image-upload-content {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 0.25rem;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    .tiptap-image-upload-previews {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .tiptap-image-upload-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--tiptap-image-upload-border);
      margin-bottom: 0.5rem;

      span {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--tiptap-image-upload-text-color);
      }
    }

    .tiptap-image-upload-preview {
      position: relative;
      border-radius: var(--tt-radius-md, 0.5rem);
      overflow: hidden;

      .tiptap-image-upload-progress {
        position: absolute;
        inset: 0;
        background-color: var(--tiptap-image-upload-progress-bg);
        transition: all 300ms ease-out;
      }

      .tiptap-image-upload-preview-content {
        position: relative;
        border: 1px solid var(--tiptap-image-upload-border);
        border-radius: var(--tt-radius-md, 0.5rem);
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .tiptap-image-upload-file-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        height: 2rem;

        .tiptap-image-upload-file-icon {
          padding: 0.5rem;
          background-color: var(--tiptap-image-upload-icon-bg);
          border-radius: var(--tt-radius-lg, 0.75rem);

          svg {
            width: 0.875rem;
            height: 0.875rem;
            color: var(--tiptap-image-upload-icon-color);
          }
        }
      }

      .tiptap-image-upload-details {
        display: flex;
        flex-direction: column;
      }

      .tiptap-image-upload-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .tiptap-image-upload-progress-text {
          font-size: 0.75rem;
          color: var(--tiptap-image-upload-border-active);
          font-weight: 600;
        }
      }
    }
  }

  .tiptap.ProseMirror.ProseMirror-focused {
    .ProseMirror-selectednode .tiptap-image-upload-drag-area {
      border-color: var(--tiptap-image-upload-active);
    }
  }

  /* ============================
     MOBILE RESPONSIVE
     ============================ */
  @media (max-width: 480px) {
    .simple-editor-content .tiptap.ProseMirror.simple-editor {
      padding: 1rem 1.5rem 30vh;
    }

    .tiptap-image-upload {
      .tiptap-image-upload-drag-area {
        padding: 1.5rem 1rem;
      }

      .tiptap-image-upload-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .tiptap-image-upload-preview-content {
        padding: 0.75rem;
      }
    }
  }
`;

export default TipTapEditorStyles;
