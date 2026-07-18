import { Editor } from '@tiptap/react';
import { Button } from '../../components/ui/Button';
import {
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  List,
  Quote,
  Code,
  Image as ImageIcon,
  Minus,
  RotateCcw,
  RotateCw,
} from 'lucide-react';
import { useState } from 'react';

interface JournalToolbarProps {
  editor: Editor | null;
}

export function JournalToolbar({ editor }: JournalToolbarProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  if (!editor) return null;

  const handleHeadingChange = (level: 1 | 2 | 3 | null) => {
    if (level === null) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  const handleAddLink = () => {
    if (!linkUrl.trim()) return;

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: linkUrl })
      .run();

    setLinkUrl('');
    setShowLinkInput(false);
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const handleAddImage = () => {
    if (!imageUrl.trim()) return;

    editor.chain().focus().setImage({ src: imageUrl }).run();

    setImageUrl('');
    setShowImageInput(false);
  };

  return (
    <div className="shrink-0 flex flex-col gap-2 border-b border-border p-2 overflow-x-auto bg-surface-secondary/50">
      {/* First row: Type selector + formatting */}
      <div className="flex items-center gap-1">
        {/* Heading/Paragraph selector */}
        <select
          value={
            editor.isActive('heading', { level: 1 })
              ? 'h1'
              : editor.isActive('heading', { level: 2 })
                ? 'h2'
                : editor.isActive('heading', { level: 3 })
                  ? 'h3'
                  : 'p'
          }
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'p') handleHeadingChange(null);
            else handleHeadingChange(parseInt(value.substring(1)) as 1 | 2 | 3);
          }}
          className="text-xs px-2 py-1.5 rounded border border-border bg-surface hover:bg-surface-secondary transition-colors cursor-pointer"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <div className="w-px h-4 bg-border mx-1"></div>

        {/* Formatting buttons */}
        <Button
          variant={editor.isActive('bold') ? 'primary' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        >
          <Bold size={14} />
        </Button>

        <Button
          variant={editor.isActive('italic') ? 'primary' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <Italic size={14} />
        </Button>

        <Button
          variant={editor.isActive('underline') ? 'primary' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (Ctrl+U)"
        >
          <Underline size={14} />
        </Button>

        <div className="w-px h-4 bg-border mx-1"></div>

        {/* Link buttons */}
        <Button
          variant={editor.isActive('link') ? 'primary' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowLinkInput(!showLinkInput)}
          title="Insert/Edit Link"
        >
          <LinkIcon size={14} />
        </Button>

        {editor.isActive('link') && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:bg-red-500/10"
            onClick={handleRemoveLink}
            title="Remove Link"
          >
            <LinkIcon size={14} className="line-through" />
          </Button>
        )}

        <div className="w-px h-4 bg-border mx-1"></div>

        {/* List buttons */}
        <Button
          variant={editor.isActive('bulletList') ? 'primary' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List size={14} />
        </Button>

        <Button
          variant={editor.isActive('orderedList') ? 'primary' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Ordered List"
        >
          <List size={14} className="rotate-90" />
        </Button>

        <div className="w-px h-4 bg-border mx-1"></div>

        {/* Block elements */}
        <Button
          variant={editor.isActive('blockquote') ? 'primary' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          <Quote size={14} />
        </Button>

        <Button
          variant={editor.isActive('codeBlock') ? 'primary' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
        >
          <Code size={14} />
        </Button>

        <div className="w-px h-4 bg-border mx-1"></div>

        {/* Media */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowImageInput(!showImageInput)}
          title="Insert Image"
        >
          <ImageIcon size={14} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus size={14} />
        </Button>

        <div className="w-px h-4 bg-border mx-1"></div>

        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <RotateCcw size={14} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Shift+Z)"
        >
          <RotateCw size={14} />
        </Button>
      </div>

      {/* Link input row */}
      {showLinkInput && (
        <div className="flex items-center gap-2">
          <input
            type="url"
            placeholder="Enter URL (https://...)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddLink();
              if (e.key === 'Escape') {
                setShowLinkInput(false);
                setLinkUrl('');
              }
            }}
            className="flex-1 text-xs px-2 py-1.5 rounded border border-border bg-surface focus:outline-none focus:border-accent"
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={handleAddLink}
          >
            Add
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => {
              setShowLinkInput(false);
              setLinkUrl('');
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Image input row */}
      {showImageInput && (
        <div className="flex items-center gap-2">
          <input
            type="url"
            placeholder="Enter image URL (https://...)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddImage();
              if (e.key === 'Escape') {
                setShowImageInput(false);
                setImageUrl('');
              }
            }}
            className="flex-1 text-xs px-2 py-1.5 rounded border border-border bg-surface focus:outline-none focus:border-accent"
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={handleAddImage}
          >
            Add
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => {
              setShowImageInput(false);
              setImageUrl('');
            }}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
