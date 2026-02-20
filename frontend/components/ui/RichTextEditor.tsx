import React, { useCallback, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css';
import { supabase } from '../../src/lib/supabase';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  uploadType?: 'blog' | 'event';
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Start writing...',
  className = '',
  uploadType = 'blog'
}: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const safeValue = typeof value === 'string' ? value : '';

  const handleChange = useCallback((nextValue: any) => {
    onChange(typeof nextValue === 'string' ? nextValue : '');
  }, [onChange]);

  const uploadAndInsertImage = useCallback(async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select an image file');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('Image must be less than 5MB');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${uploadType}/inline-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message || 'Failed to upload image');
    }

    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    const imageUrl = urlData?.publicUrl;
    if (!imageUrl) {
      throw new Error('Failed to get public URL for uploaded image');
    }

    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const range = editor.getSelection(true);
    const insertIndex = range?.index ?? editor.getLength();
    editor.insertEmbed(insertIndex, 'image', imageUrl, 'user');
    editor.setSelection(insertIndex + 1, 0, 'user');
  }, [uploadType]);

  const handleImageToolbarClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    },
    handlers: {
      image: handleImageToolbarClick,
    },
  }), [handleImageToolbarClick]);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  return (
    <div className={`rich-text-editor-wrapper ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            await uploadAndInsertImage(file);
          } catch (err: any) {
            alert(err?.message || 'Failed to upload image');
          } finally {
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }
        }}
      />
      <ReactQuill
        ref={(instance) => {
          quillRef.current = instance;
        }}
        theme="snow"
        value={safeValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}

