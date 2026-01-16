"use client";
import React from "react";
import { FiScissors } from "react-icons/fi";

export default function StylingPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      color: '#0095da',
      textAlign: 'center',
      gap: 18,
      fontFamily: 'Poppins, Arial, sans-serif',
      maxWidth: 520,
      margin: '0 auto'
    }}>
      <FiScissors size={64} color="#0095da" style={{ marginBottom: 8, opacity: 0.85 }} />
      <div style={{ fontWeight: 700, fontSize: 28, color: '#222', marginBottom: 4 }}>Styling Coming Soon</div>
      <div style={{ fontWeight: 400, fontSize: 17, color: '#888', maxWidth: 420, lineHeight: 1.5 }}>
        Soon you'll be able to get personalized outfit styling and recommendations. Stay tuned for new features!
      </div>
    </div>
  );
}
