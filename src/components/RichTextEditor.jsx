import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Undo,
  Redo,
  Minus,
  Trash2,
  Send,
  Handshake,
  PenLine,
} from "lucide-react";
import { motion } from "framer-motion";

/**
 * Email-focused Rich Text Editor
 * Fixes:
 *  - Reliable Undo/Redo (own history stack + keyboard shortcuts)
 *  - Insert Link: styled + opens on Ctrl/Cmd + Click
 *  - Greeting/Signature buttons now use lucide-react icons
 *  - Restores selection before toolbar actions; focuses the editor
 */

const RichTextEditor = ({
  content,
  onChange,
  onSend, // (htmlString) => void
  aiSections = [],
  placeholder = "Start typing your email...",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef(null);

  // --- Selection handling (so toolbar actions work at the caret) ---
  const savedRangeRef = useRef(null);
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0);
    }
  };
  const restoreSelection = () => {
    const range = savedRangeRef.current;
    if (!range) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const focusEditor = () => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
  };

  // --- History stack for reliable undo/redo ---
  const historyRef = useRef([content || ""]); // past states (current is last)
  const futureRef = useRef([]); // redo stack
  const lastContentRef = useRef(content || "");

  // push into history when external content changes (e.g., AI regenerate)
  useEffect(() => {
    if (content !== lastContentRef.current) {
      historyRef.current.push(content || "");
      futureRef.current = [];
      lastContentRef.current = content || "";
    }
  }, [content]);

  const pushHistory = (newHTML) => {
    if (newHTML === lastContentRef.current) return;
    historyRef.current.push(newHTML);
    // cap history to avoid memory bloat
    if (historyRef.current.length > 200) historyRef.current.shift();
    futureRef.current = [];
    lastContentRef.current = newHTML;
  };

  const doUndo = () => {
    const hist = historyRef.current;
    if (hist.length <= 1) return; // nothing to undo
    // current -> future stack
    const current = hist.pop();
    futureRef.current.push(current);
    const prev = hist[hist.length - 1];
    onChange(prev);
    // restore focus/caret at end
    requestAnimationFrame(() => placeCaretAtEnd());
  };

  const doRedo = () => {
    const fut = futureRef.current;
    if (fut.length === 0) return;
    const next = fut.pop();
    historyRef.current.push(next);
    onChange(next);
    requestAnimationFrame(() => placeCaretAtEnd());
  };

  // --- Core helpers ---
  const placeCaretAtEnd = () => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const formatText = (command, value = null) => {
    focusEditor();
    restoreSelection();
    document.execCommand(command, false, value);
    // after DOM change, sync controlled content
    // NOTE: pulling from the live DOM avoids caret jumps
    const newHTML = editorRef.current.innerHTML;
    onChange(newHTML);
    pushHistory(newHTML);
    saveSelection();
  };

  const sanitizeUrl = (url) => {
    try {
      const u = new URL(url);
      return u.href;
    } catch {
      return url; // fallback; browser will handle invalid
    }
  };

  const insertStyledLink = (url) => {
    if (!url) return;
    focusEditor();
    restoreSelection();

    // If there's selected text, wrap it; else insert the URL text itself
    const sel = window.getSelection();
    const hasSelection = sel && sel.toString().length > 0;

    const safeUrl = sanitizeUrl(url);

    if (hasSelection) {
      document.execCommand("createLink", false, safeUrl);
      // normalize just-created link (closest ancestor <a>)
      const range = sel.getRangeAt(0);
      let node = range.commonAncestorContainer;
      while (node && node.nodeType === 3) node = node.parentNode; // text -> element
      const link = node && (node.closest ? node.closest("a") : null);
      if (link) {
        link.setAttribute("href", safeUrl);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
        link.setAttribute("class", "text-blue-600 underline hover:opacity-80");
      }
    } else {
      // insert <a>URL</a> at caret
      const a = document.createElement("a");
      a.href = safeUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "text-blue-600 underline hover:opacity-80";
      a.textContent = url;

      const range = sel.getRangeAt(0);
      range.insertNode(a);

      // add a trailing space and move caret after the link
      const space = document.createTextNode(" ");
      a.after(space);
      range.setStartAfter(space);
      range.setEndAfter(space);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    // sync back to state/history
    const newHTML = editorRef.current.innerHTML;
    onChange(newHTML);
    pushHistory(newHTML);
    saveSelection();
  };

  const insertAtCursor = (html) => {
    focusEditor();
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const el = document.createElement("div");
    el.innerHTML = html;
    const frag = document.createDocumentFragment();
    let node;
    while ((node = el.firstChild)) frag.appendChild(node);
    range.insertNode(frag);
    // place caret at end of inserted content
    placeCaretAtEnd();

    const newHTML = editorRef.current.innerHTML;
    onChange(newHTML);
    pushHistory(newHTML);
    saveSelection();
  };

  const handleContentInput = (e) => {
    const newContent = e.currentTarget.innerHTML;
    onChange(newContent);
    pushHistory(newContent);
    saveSelection();
  };

  const handleKeyDown = (e) => {
    // Undo/Redo shortcuts
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === "z") {
      e.preventDefault();
      if (e.shiftKey) doRedo(); // Cmd+Shift+Z
      else doUndo();
      return;
    }
    if (mod && (e.key.toLowerCase() === "y")) {
      e.preventDefault();
      doRedo();
      return;
    }

    // Link shortcut Ctrl/Cmd + K
    if (mod && e.key.toLowerCase() === "k") {
      e.preventDefault();
      const url = window.prompt("Enter URL:");
      insertStyledLink(url);
      return;
    }
  };

  const handleEditorClick = (e) => {
    // Ctrl/Cmd + Click opens link in new tab
    const target = e.target;
    if (target && target.tagName === "A" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const href = target.getAttribute("href");
      if (href) window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  const handleSend = () => {
    const plain = (content || "").replace(/<[^>]*>/g, "").trim();
    if (!plain) {
      alert("Email content is empty!");
      return;
    }
    onSend && onSend(content);
  };

  const wordCount = useMemo(
    () => (content || "").replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length,
    [content]
  );
  const charCount = useMemo(
    () => (content || "").replace(/<[^>]*>/g, "").length,
    [content]
  );

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <motion.div
        className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-200 bg-gray-50"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        onMouseDown={(e) => e.preventDefault()} // prevent toolbar click from blurring editor
      >
        {/* Text styling */}
        <IconBtn onClick={() => formatText("bold")} title="Bold" Icon={Bold} />
        <IconBtn onClick={() => formatText("italic")} title="Italic" Icon={Italic} />
        <IconBtn onClick={() => formatText("underline")} title="Underline" Icon={Underline} />

        <Divider />

        {/* Lists & Quote */}
        <IconBtn onClick={() => formatText("insertUnorderedList")} title="Bulleted list" Icon={List} />
        <IconBtn onClick={() => formatText("formatBlock", "<blockquote>")} title="Quote" Icon={Quote} />

        <Divider />

        {/* Alignment */}
        <IconBtn onClick={() => formatText("justifyLeft")} title="Align left" Icon={AlignLeft} />
        <IconBtn onClick={() => formatText("justifyCenter")} title="Align center" Icon={AlignCenter} />
        <IconBtn onClick={() => formatText("justifyRight")} title="Align right" Icon={AlignRight} />
        <IconBtn onClick={() => formatText("justifyFull")} title="Justify" Icon={AlignJustify} />

        <Divider />

        {/* Insert Link */}
        <IconBtn
          onClick={() => {
            const url = window.prompt("Enter URL:");
            insertStyledLink(url);
          }}
          title="Insert link (Ctrl/Cmd + K)"
          Icon={Link2}
        />

        {/* Undo / Redo */}
        <Divider />
        <IconBtn onClick={doUndo} title="Undo (Ctrl/Cmd + Z)" Icon={Undo} />
        <IconBtn onClick={doRedo} title="Redo (Ctrl/Cmd + Y / Shift+Z)" Icon={Redo} />

        <Divider />

        {/* Email quick inserts */}
        <IconBtn
          onClick={() => insertAtCursor("Hi [Name],<br/><br/>")}
          title="Insert greeting"
          Icon={Handshake}
        />
        <IconBtn
          onClick={() => insertAtCursor("<br/>Best regards,<br/>Your Name")}
          title="Insert signature"
          Icon={PenLine}
        />
        <IconBtn onClick={() => insertAtCursor("<hr/>")} title="Insert divider" Icon={Minus} />
        <IconBtn onClick={() => formatText("removeFormat")} title="Clear formatting" Icon={Trash2} />

        <div className="ml-auto text-xs text-gray-500 px-2 py-1 bg-blue-50 rounded-md">
          AI suggestions are highlighted
        </div>
      </motion.div>

      {/* Editor */}
      <motion.div className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[300px] p-6 outline-none text-gray-800 leading-relaxed"
          onInput={handleContentInput}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          onKeyDown={handleKeyDown}
          onMouseUp={saveSelection}
          onKeyUp={saveSelection}
          onClick={handleEditorClick}
          dangerouslySetInnerHTML={{ __html: content }}
          style={{
            fontFamily: "var(--font-family-primary)",
            fontSize: "var(--font-size-base)",
            lineHeight: "var(--line-height-relaxed)",
          }}
        />

        {!content && !isEditing && (
          <div className="absolute top-6 left-6 text-gray-400 pointer-events-none">{placeholder}</div>
        )}

        
      </motion.div>

      {/* Status + Send */}
      <div className="flex items-center justify-between p-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        <span>
          Words: {wordCount} • Characters: {charCount}
        </span>
       
      </div>
    </div>
  );
};

// Small UI helpers
const IconBtn = ({ onClick, title, Icon }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()} // keep focus on editor
    onClick={onClick}
    title={title}
    className="p-2 rounded-md hover:bg-gray-200"
  >
    <Icon size={16} />
  </button>
);

const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

export default RichTextEditor;
