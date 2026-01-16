"use client";
import React from "react";
import { FiBookmark } from "react-icons/fi";

const outfitImages = [
  "083b5947-291e-4f39-addf-f823019d22a0.jpg",
  "09d3c6eb-7b2e-4d95-ad0c-8c0a97a00723.webp",
  "1ff5d1c5-054d-4262-8a0a-7128ceb33d64.webp",
  "23341bf6-c03a-410b-b6b8-e45468bcb73f.webp",
];

export default function SavedPage() {
  return (
    <s style={{
      width: '100vw',
      minHeight: '100vh',
      overflow: 'hidden',
      boxSizing: 'border-box',
      background: '#fafbfc',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <h2 style={{ fontWeight: 700, fontSize: 28, margin: '0 0 32px 8px', color: '#222', letterSpacing: -1 }}>Saved Outfits</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 24,
        marginTop: 12,
        minHeight: 400,
        width: '100%',
        boxSizing: 'border-box',
        paddingRight: 24,
        flex: 1,
        maxHeight: 'calc(100vh - 48px)', // 48px is the assumed top banner height, adjust as needed
        overflowY: 'auto',
      }}>
        {outfitImages.map((img) => (
          <div
            key={img}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '3/5',
              height: 220,
              overflow: 'hidden',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              const overlay = e.currentTarget.querySelector('.img-overlay') as HTMLElement | null;
              if (overlay) overlay.style.opacity = '1';
            }}
            onMouseLeave={e => {
              const overlay = e.currentTarget.querySelector('.img-overlay') as HTMLElement | null;
              if (overlay) overlay.style.opacity = '0';
            }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f7f7f7',
              padding: 12,
              boxSizing: 'border-box',
              borderRadius: 0,
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}>
              <img
                src={`/outfits/${img}`}
                alt="saved-outfit"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: 0,
                  background: 'transparent',
                  display: 'block',
                }}
              />
            </div>
            {/* Overlay for hover */}
            <div
              className="img-overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.55)',
                opacity: 0,
                transition: 'opacity 0.2s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              {/* Top right filled bookmark icon */}
              <span
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  zIndex: 2,
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <svg width="28" height="28" fill="#fff" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.18))' }}><path d="M6 2a2 2 0 0 0-2 2v16l8-5.333L20 20V4a2 2 0 0 0-2-2H6z"/></svg>
              </span>
              {/* Centered Add Note text link */}
              <span
                style={{
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'underline',
                  letterSpacing: 0.1,
                  background: 'transparent',
                  padding: '0 10px',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginBottom: 6,
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  userSelect: 'none',
                }}
                onClick={e => { e.stopPropagation(); /* Add note logic here */ }}
              >
                + Add Note
              </span>
              {/* Date bottom right */}
              <span
                style={{
                  position: 'absolute',
                  right: 10,
                  bottom: 10,
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: 11,
                  fontWeight: 400,
                  letterSpacing: 0.1,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                Jan 1, 2026
              </span>
            </div>
          </div>
        ))}
      </div>
    </s>
  );
}
