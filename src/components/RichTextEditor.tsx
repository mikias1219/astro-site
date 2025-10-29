'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your content here...',
  readOnly = false,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="w-full h-64 bg-gray-100 rounded-xl animate-pulse" />;
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      [{ color: [] }, { background: [] }],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'align',
    'blockquote',
    'code-block',
    'link',
    'image',
    'color',
    'background',
    'size',
  ];

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          readOnly={readOnly}
          className="quill-editor"
        />
      </div>
      <style jsx>{`
        :global(.quill-editor) {
          min-height: 400px;
          font-size: 16px;
        }
        :global(.quill-editor .ql-container) {
          font-size: 16px;
          font-family: inherit;
        }
        :global(.quill-editor .ql-editor) {
          min-height: 350px;
          padding: 16px;
        }
        :global(.quill-editor .ql-picker-label[data-label]::before),
        :global(.quill-editor .ql-picker-item[data-label]::before) {
          content: attr(data-label);
        }
        :global(.quill-editor .ql-picker.ql-header .ql-picker-item[data-value="1"]::before) {
          content: "Heading 1";
        }
        :global(.quill-editor .ql-picker.ql-header .ql-picker-item[data-value="2"]::before) {
          content: "Heading 2";
        }
        :global(.quill-editor .ql-picker.ql-header .ql-picker-item[data-value="3"]::before) {
          content: "Heading 3";
        }
        :global(.quill-editor .ql-picker.ql-header .ql-picker-item[data-value="4"]::before) {
          content: "Heading 4";
        }
        :global(.quill-editor .ql-picker.ql-header .ql-picker-item[data-value="5"]::before) {
          content: "Heading 5";
        }
        :global(.quill-editor .ql-picker.ql-header .ql-picker-item[data-value="6"]::before) {
          content: "Heading 6";
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
