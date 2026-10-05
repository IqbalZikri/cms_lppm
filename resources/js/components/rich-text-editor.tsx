import { useEditor, useEditorState, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    List,
    ListOrdered,
    Quote,
    Heading1,
    Heading2,
    Heading3,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link as LinkIcon,
    Undo,
    Redo,
    Minus,
} from 'lucide-react';
import ToolbarButton from './toolbar-button';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ link: false }),
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false, autolink: true }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none outline-none min-h-[250px] p-4 dark:text-white',
            },
        },
    });

    // Cara resmi Tiptap untuk membaca state secara reaktif
    const editorState = useEditorState({
        editor,
        selector: (ctx) => ({
            isBold: ctx.editor?.isActive('bold') ?? false,
            isItalic: ctx.editor?.isActive('italic') ?? false,
            isUnderline: ctx.editor?.isActive('underline') ?? false,
            isStrike: ctx.editor?.isActive('strike') ?? false,
            isCode: ctx.editor?.isActive('code') ?? false,
            isHeading1: ctx.editor?.isActive('heading', { level: 1 }) ?? false,
            isHeading2: ctx.editor?.isActive('heading', { level: 2 }) ?? false,
            isHeading3: ctx.editor?.isActive('heading', { level: 3 }) ?? false,
            isBulletList: ctx.editor?.isActive('bulletList') ?? false,
            isOrderedList: ctx.editor?.isActive('orderedList') ?? false,
            isBlockquote: ctx.editor?.isActive('blockquote') ?? false,
            isAlignLeft: ctx.editor?.isActive({ textAlign: 'left' }) ?? false,
            isAlignCenter: ctx.editor?.isActive({ textAlign: 'center' }) ?? false,
            isAlignRight: ctx.editor?.isActive({ textAlign: 'right' }) ?? false,
            isLink: ctx.editor?.isActive('link') ?? false,
        }),
    });

    if (!editor) return null;

    return (
        <div className="overflow-hidden rounded-md border bg-background text-foreground">
            <div className="flex flex-wrap gap-1 border-b p-2">
                <ToolbarButton
                    label="Bold"
                    isActive={editorState.isBold}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    label="Italic"
                    isActive={editorState.isItalic}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    label="Underline"
                    isActive={editorState.isUnderline}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <UnderlineIcon className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    label="Strikethrough"
                    isActive={editorState.isStrike}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    <Strikethrough className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    label="Code"
                    isActive={editorState.isCode}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                >
                    <Code className="h-4 w-4" />
                </ToolbarButton>

                <div className="bg-border mx-1 w-px" />

                <ToolbarButton
                    label="Heading 1"
                    isActive={editorState.isHeading1}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <Heading1 className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    label="Heading 2"
                    isActive={editorState.isHeading2}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    label="Heading 3"
                    isActive={editorState.isHeading3}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading3 className="h-4 w-4" />
                </ToolbarButton>

                <div className="bg-border mx-1 w-px" />

                <ToolbarButton
                    label="Bullet List"
                    isActive={editorState.isBulletList}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    label="Ordered List"
                    isActive={editorState.isOrderedList}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    label="Blockquote"
                    isActive={editorState.isBlockquote}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote className="h-4 w-4" />
                </ToolbarButton>

                <div className="bg-border mx-1 w-px" />

                <ToolbarButton
                    label="Align Left"
                    isActive={editorState.isAlignLeft}
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                >
                    <AlignLeft className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    label="Align Center"
                    isActive={editorState.isAlignCenter}
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                >
                    <AlignCenter className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    label="Align Right"
                    isActive={editorState.isAlignRight}
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                >
                    <AlignRight className="h-4 w-4" />
                </ToolbarButton>

                <div className="bg-border mx-1 w-px" />

                <ToolbarButton
                    label="Link"
                    isActive={editorState.isLink}
                    onClick={() => {
                        const url = window.prompt('Masukkan URL');
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run();
                        } else {
                            editor.chain().focus().unsetLink().run();
                        }
                    }}
                >
                    <LinkIcon className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    label="Horizontal Rule"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                    <Minus className="h-4 w-4" />
                </ToolbarButton>

                <div className="bg-border mx-1 w-px" />

                <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
                    <Undo className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
                    <Redo className="h-4 w-4" />
                </ToolbarButton>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}