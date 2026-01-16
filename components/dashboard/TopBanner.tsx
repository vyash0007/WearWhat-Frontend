import React from "react";

export default function TopBanner() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 200,
      width: 'calc(100vw - 200px)',
      background: '#0095da',
      color: '#fff',
      fontWeight: 600,
      fontSize: 15,
      padding: '6px 0',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      borderRadius: 0,
      margin: 0,
      letterSpacing: 0.2,
      zIndex: 0,
      minHeight: '32px',
      maxHeight: '38px',
      boxShadow: '0 1px 4px rgba(0,149,218,0.08)',
    }}>
      <span>Unlock access to all features!</span>
      <button style={{
        background: '#fff',
        color: '#0095da',
        fontWeight: 600,
        fontSize: 13,
        border: 'none',
        borderRadius: 8,
        padding: '4px 14px',
        cursor: 'pointer',
        boxShadow: '0 1px 4px rgba(0,149,218,0.08)',
        transition: 'background 0.15s, color 0.15s',
      }}>Choose a plan</button>
    </div>
  );
}
