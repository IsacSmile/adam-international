import React, { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import { UploadCloud, Image as ImageIcon, X, RefreshCw, AlertCircle, Check } from 'lucide-react';

function formatFileSize(bytes) {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Resizes an image on an HTML5 canvas and converts it to a JPEG blob.
 */
function resizeToBlob(img, maxLongestSide, quality) {
  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;
  const longestSide = Math.max(width, height);

  if (longestSide > maxLongestSide) {
    const scale = maxLongestSide / longestSide;
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas toBlob conversion failed'));
          return;
        }
        resolve({ blob, width, height });
      },
      'image/jpeg',
      quality
    );
  });
}

export default function ImageUploader({
  label = 'Image',
  value,
  thumbValue,
  width,
  height,
  pathname,
  onChange,
  onRemove,
  disabled = false,
  required = false,
  helpText,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [uploadedSize, setUploadedSize] = useState(null);
  const fileInputRef = useRef(null);

  const previewUrl = value || thumbValue;

  const processAndUploadFile = async (file) => {
    setErrorMessage(null);

    // 1. Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    // 2. Reject files over 15 MB before processing
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('Image is too large (max 15 MB).');
      return;
    }

    setIsUploading(true);
    setUploadProgress(5);

    let tempObjUrl = null;
    try {
      // 3. Load image in browser to read dimensions and resize via canvas
      tempObjUrl = URL.createObjectURL(file);
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load selected image.'));
        img.src = tempObjUrl;
      });

      // 4. Create full image (max 1600px longest side, JPEG 0.85)
      const { blob: fullBlob, width: fullWidth, height: fullHeight } = await resizeToBlob(
        img,
        1600,
        0.85
      );
      setUploadProgress(20);

      // 5. Create thumbnail (max 600px longest side, JPEG 0.8)
      const { blob: thumbBlob } = await resizeToBlob(img, 600, 0.8);
      setUploadProgress(30);

      // Determine target pathnames
      let basePath = (pathname || 'uploads/image').trim();
      if (basePath.endsWith('.jpg') || basePath.endsWith('.jpeg')) {
        basePath = basePath.replace(/\.(jpg|jpeg)$/i, '');
      }
      const fullPathname = `${basePath}.jpg`;
      const thumbPathname = `${basePath}-thumb.jpg`;

      // 6. Upload full image (30% -> 75%)
      const fullUpload = await upload(fullPathname, fullBlob, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload',
        onUploadProgress: (p) => {
          setUploadProgress(30 + Math.round((p.percentage || 0) * 0.45));
        },
      });

      // 7. Upload thumbnail (75% -> 100%)
      const thumbUpload = await upload(thumbPathname, thumbBlob, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload',
        onUploadProgress: (p) => {
          setUploadProgress(75 + Math.round((p.percentage || 0) * 0.25));
        },
      });

      setUploadedSize(fullBlob.size);
      setUploadProgress(100);

      if (onChange) {
        onChange({
          url: fullUpload.url,
          thumbUrl: thumbUpload.url,
          width: fullWidth,
          height: fullHeight,
          size: fullBlob.size,
        });
      }
    } catch (err) {
      console.error('Image processing/upload failed:', err);
      setErrorMessage(err.message || 'Image upload failed. Please try again.');
    } finally {
      if (tempObjUrl) {
        URL.revokeObjectURL(tempObjUrl);
      }
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
  };

  const handleTriggerSelect = () => {
    if (!disabled && !isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setErrorMessage(null);
    setUploadedSize(null);
    if (onRemove) {
      onRemove();
    } else if (onChange) {
      onChange({ url: null, thumbUrl: null, width: null, height: null, size: null });
    }
  };

  return (
    <div className="space-y-2">
      {/* Label and help text */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {helpText && <span className="text-[11px] text-slate-400">{helpText}</span>}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Main Upload Box */}
      {previewUrl ? (
        /* Preview state with Replace and Remove actions */
        <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4 transition-all">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Thumbnail Preview */}
            <div className="relative w-full sm:w-44 h-32 rounded-xl overflow-hidden bg-white border border-slate-200/90 shadow-sm flex items-center justify-center shrink-0">
              <img
                src={previewUrl}
                alt={label}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>

            {/* Metadata and Actions */}
            <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check className="w-3 h-3" />
                  <span>Uploaded</span>
                </span>
                {width && height && (
                  <span className="text-xs font-medium text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                    {width} × {height} px
                  </span>
                )}
                {uploadedSize && (
                  <span className="text-xs font-medium text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                    {formatFileSize(uploadedSize)}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 truncate" title={value || thumbValue}>
                {value || thumbValue}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTriggerSelect}
                  disabled={disabled || isUploading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0B1F3A] transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Replace</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={disabled || isUploading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700 transition-all cursor-pointer disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>

          {/* Upload Progress overlay if replacing */}
          {isUploading && (
            <div className="absolute inset-0 bg-white/85 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-4 z-10">
              <div className="w-full max-w-xs space-y-2 text-center">
                <div className="flex justify-between text-xs font-bold text-[#0B1F3A]">
                  <span>Optimizing & Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0B1F3A] transition-all duration-200 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty Drag and drop dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleTriggerSelect}
          className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-[#C9A84C] bg-[#FAF7F2]'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
        >
          {isUploading ? (
            <div className="max-w-xs mx-auto space-y-3">
              <div className="flex justify-between text-xs font-bold text-[#0B1F3A]">
                <span>Optimizing & Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0B1F3A] transition-all duration-200 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Generating full resolution and 600px thumbnail...
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto text-[#0B1F3A]">
                <UploadCloud className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <div className="text-xs sm:text-sm text-slate-700">
                <span className="font-bold text-[#0B1F3A]">Choose image</span> or drag and drop
              </div>
              <p className="text-[11px] text-slate-400">
                JPEG, PNG, WebP up to 15 MB (automatically optimized)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Inline Error message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
