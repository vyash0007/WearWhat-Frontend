"use client";
import React from "react";
import { LuUsers } from "react-icons/lu";

export default function CommunityPage() {
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
      <LuUsers size={64} color="#0095da" style={{ marginBottom: 8, opacity: 0.85 }} />
      <div style={{ fontWeight: 700, fontSize: 28, color: '#222', marginBottom: 4 }}>Community Coming Soon</div>
      <div style={{ fontWeight: 400, fontSize: 17, color: '#888', maxWidth: 420, lineHeight: 1.5 }}>
        We're building a vibrant space for fashion lovers to connect, share, and inspire each other. Stay tuned for exciting community features!
      </div>
    </div>
  );
}
