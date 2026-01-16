

import React, { useRef, useState } from "react";

export default function NewOutfitModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [images, setImages] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    setImages(prev => {
      const total = prev.length + selected.length;
      if (total > 9) {
        return [...prev, ...selected.slice(0, 9 - prev.length)];
      }
      return [...prev, ...selected];
    });
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (images.length >= 9) return;
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length) {
      setImages(prev => {
        const total = prev.length + files.length;
        if (total > 9) {
          return [...prev, ...files.slice(0, 9 - prev.length)];
        }
        return [...prev, ...files];
      });
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.10)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 18,
        minWidth: 800,
        minHeight: 420,
        maxWidth: '98vw',
        fontFamily: 'Poppins, Arial, sans-serif',
        color: '#222',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        boxShadow: '0 8px 48px rgba(0,149,218,0.18)',
        border: 'none',
        padding: 0,
      }}>
        {/* Left: Upload UI */}
        <div style={{
          flex: 1,
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          alignItems: 'flex-start',
          justifyContent: 'center',
          borderRight: '1px solid #f0f0f0',
          minWidth: 340,
        }}>
          <h2 style={{ fontFamily: 'Poppins, Arial, sans-serif', fontSize: 26, fontWeight: 700, marginBottom: 18, letterSpacing: 0.5 }}>Add Outfits</h2>
          <div
            style={{
              width: 320,
              minHeight: 160,
              border: '2px dashed #0095da',
              borderRadius: 14,
              background: '#f8fafd',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 0',
              marginBottom: 18,
              position: 'relative',
              cursor: images.length < 9 ? 'pointer' : 'not-allowed',
              fontFamily: 'Poppins, Arial, sans-serif',
              boxShadow: '0 2px 12px rgba(0,149,218,0.04)',
              transition: 'border 0.2s',
            }}
            onClick={() => {
              if (images.length < 9 && inputRef.current) inputRef.current.click();
            }}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div style={{ fontSize: 32, color: '#0095da', marginBottom: 0 }}>&uarr;</div>
            <div style={{ fontSize: 18, color: '#222', fontWeight: 500, marginBottom: 2 }}>Drag and Drop files here</div>
            <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>or</div>
            <button
              type="button"
              style={{
                background: '#fff',
                color: '#0095da',
                border: '2px solid #0095da',
                borderRadius: 8,
                fontFamily: 'Poppins, Arial, sans-serif',
                fontWeight: 600,
                fontSize: 16,
                padding: '6px 24px',
                cursor: images.length < 9 ? 'pointer' : 'not-allowed',
                boxShadow: '0 1px 4px rgba(0,149,218,0.08)',
                marginBottom: 0,
                outline: 'none',
                transition: 'border 0.2s',
              }}
              onClick={e => {
                e.stopPropagation();
                if (images.length < 9 && inputRef.current) inputRef.current.click();
              }}
              disabled={images.length >= 9}
            >Browse Files</button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={images.length >= 9}
            />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            <button
              style={{
                background: '#0095da',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontFamily: 'Poppins, Arial, sans-serif',
                fontWeight: 600,
                fontSize: 16,
                padding: '8px 24px',
                cursor: images.length === 0 ? 'not-allowed' : 'pointer',
                boxShadow: '0 1px 4px rgba(0,149,218,0.08)',
                outline: 'none',
                marginRight: 0,
                transition: 'background 0.2s',
                opacity: images.length === 0 ? 0.6 : 1
              }}
              disabled={images.length === 0}
            >Upload({images.length})</button>
            <button
              onClick={onClose}
              style={{
                background: '#eee',
                color: '#444',
                border: 'none',
                borderRadius: 8,
                fontFamily: 'Poppins, Arial, sans-serif',
                fontWeight: 500,
                fontSize: 15,
                padding: '8px 24px',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                outline: 'none',
                marginLeft: 0,
                transition: 'background 0.2s',
              }}
            >cancel</button>
          </div>
        </div>
        {/* Right: Image preview grid */}
        <div style={{
          flex: 1.2,
          minWidth: 340,
          background: '#fff',
          borderRadius: '0 18px 18px 0',
          border: 'none',
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 0',
        }}>
          {images.length === 0 ? (
            <div style={{ color: '#bbb', fontSize: 16 }}>No images selected</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: 18,
              width: '90%',
              maxWidth: 380,
              minHeight: 120,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {images.map((img, idx) => (
                <div key={idx} style={{
                  position: 'relative',
                  width: 100,
                  height: 100,
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,149,218,0.10)',
                  border: '1.5px solid #e0eaf3',
                  background: '#f8fafd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Selected ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 12,
                    }}
                  />
                  <button
                    onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      background: 'rgba(255,255,255,0.85)',
                      border: 'none',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                      zIndex: 2
                    }}
                    title="Remove image"
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" fill="#d00"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
