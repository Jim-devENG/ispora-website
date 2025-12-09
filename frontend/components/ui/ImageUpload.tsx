import React, { useState, useRef } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from './utils';
import { supabase } from '../../src/lib/supabase';

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string | null) => void;
  type?: 'blog' | 'event';
  label?: string;
  className?: string;
  required?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  type = 'blog',
  label = 'Image',
  className,
  required = false
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Image must be less than 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `images/${fileName}`;

      console.log('[ImageUpload] Uploading to Supabase Storage:', filePath);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('[ImageUpload] Upload error:', uploadError);
        throw new Error(uploadError.message || 'Failed to upload image to Supabase Storage');
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }

      const imageUrl = urlData.publicUrl;
      console.log('[ImageUpload] Upload successful:', imageUrl);

      // Set preview and call onChange
      setPreview(imageUrl);
      onChange(imageUrl);
    } catch (err: any) {
      console.error('[ImageUpload] Upload error:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="image-upload">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      
      <div className="space-y-2">
        {/* Preview */}
        {preview && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Upload Area */}
        <div
          onClick={handleClick}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
            preview ? "border-border" : "border-primary/30 hover:border-primary/50",
            uploading && "opacity-50 cursor-not-allowed"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          
          <div className="flex flex-col items-center justify-center space-y-2">
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : preview ? (
              <>
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to change image</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium">Click to upload image</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Manual URL Input (Fallback) */}
        <div className="space-y-1">
          <Label htmlFor="image-url-manual" className="text-xs text-muted-foreground">
            Or enter image URL manually:
          </Label>
          <Input
            id="image-url-manual"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={value || ''}
            onChange={(e) => {
              const url = e.target.value.trim() || null;
              setPreview(url);
              onChange(url);
              setError(null);
            }}
            className="text-sm"
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {/* Help Text */}
        {!error && !preview && (
          <p className="text-xs text-muted-foreground">
            Recommended: 1200x630px for blog posts, 800x450px for events
          </p>
        )}
      </div>
    </div>
  );
}
