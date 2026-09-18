import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function RichTextEditor({
    value,
    onChange,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],

        content: value,

        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="rounded-md border">
            <EditorContent editor={editor} className="min-h-[200px] p-4" />
        </div>
    );
}
