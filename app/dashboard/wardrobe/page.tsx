"use client";
import React from "react";
import NewOutfitModal from "@/components/dashboard/NewOutfitModal";
const outfitImages = [
  "083b5947-291e-4f39-addf-f823019d22a0.jpg",
  "09d3c6eb-7b2e-4d95-ad0c-8c0a97a00723.webp",
  "1ff5d1c5-054d-4262-8a0a-7128ceb33d64.webp",
  "23341bf6-c03a-410b-b6b8-e45468bcb73f.webp",
  "24d99482-0d74-4f7e-8cd5-edfe0b054a9e.webp",
  "259b0336-ecf2-4c9c-ad25-1dfa1cf86fc2.png",
  "2d2fe8b6-0ff9-4a69-84a4-15f85bd9be81.jpg",
  "2d3d5de4-282f-46d7-821e-502d4a754b84.jpg",
  "2df6ad83-7ea6-42c4-ad6b-2423177acfb0.webp",
  "3246e477-f2a0-4b3f-8ca4-d8ee77be4fde.jpg",
  "3484f2c7-fe39-469a-9e7c-88b346ae1da5.jpg",
  "3577a4f2-85a1-4fb6-927d-eb812645eaa1.webp",
  "4a10136c-a597-4f59-9529-71097ac73a2e.webp",
  "4e61efe5-6838-4781-b8f0-14465ed0a3b9.jpg",
  "500d3ee5-ed91-498b-865e-4905509312cf.jpg",
  "68265cf6-ee56-4855-804f-c305b74e16fe.png",
  "700437e7-ea90-426e-a344-4e2fd6a037ca.jpg",
  "702be949-2293-4c68-af7b-2768f85b6982.jpg",
  "77699d73-e6b4-4d04-ab1b-fc1ee138714d.jpg",
  "79c9112a-dc64-47e5-b777-da25425a148e.jpg",
  "7afdfacb-4ada-4f09-b0ce-6e01d6f0b1c8.jpg",
  "84a51de1-9ca6-42cc-8733-d8f653e25450.jpg",
  "9644c66a-f5b0-4ef1-944c-fb162e18e636.webp",
  "9dd1f53d-2083-4bfc-8d89-404565094767.webp",
  "a069f99b-0d04-454c-96ca-d3f5c28635f0.jpg",
  "b7357618-a6cd-4c61-b117-2b0fce2d583b.jpg",
  "b76c7888-dfe1-4f4b-846b-a1a7f674aa26.webp",
  "c0570df1-b274-4e3e-ac5a-f7b9767e22b2.png",
  "c17d2d2a-7fab-489a-899e-ee11d543ab0a.jpg",
  "c682f554-f7e7-463b-a25e-2d8f5e033785.png",
  "c6ed6092-877b-4419-87d4-fada936ede59.png",
  "c8e042f3-0089-4840-a212-166dbef514ec.jpg",
  "cd747546-e35e-4dc8-8549-e7999e63b46d.jpg",
  "d14bd2de-5d3c-4432-8aaa-f3e34cc3538b.jpg",
  "db7f6d56-b549-4a49-89b2-395004b17f72.webp",
  "de752fa7-e212-4f9f-bd81-f5a7d826c978.webp",
  "e2644b20-f1aa-492b-920b-7d8c3a34ad1e.webp",
  "ea562331-c584-4c91-8afe-5b6d58fda4c2.jpg",
  "eb2882ae-297d-4b80-adf9-507ebcdeb4bc.webp",
  "f05ffe48-2dfa-4620-974e-6800629cf99a.jpg",
  "fb59165e-f08e-460a-a841-2eb68c466dea.webp",
  "fe52ae1f-c232-4171-969d-38876e551994.jpg",
];

export default function WardrobePage() {
    const [showModal, setShowModal] = React.useState(false);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <NewOutfitModal open={showModal} onClose={() => setShowModal(false)} />
      <h2 style={{ fontWeight: 700, fontSize: 28, margin: '0 0 32px 8px', color: '#222', letterSpacing: -1, flexShrink: 0 }}>Wardrobe</h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 32px 0 0', gap: 18, flexShrink: 0 }}>
        <div style={{ fontWeight: 500, fontSize: 18, color: '#555', marginLeft: 8 }}>3 Listings</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <input
            type="text"
            placeholder="Search listings..."
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid #e3eaf2',
              fontSize: 15,
              outline: 'none',
              width: 220,
              background: '#fff',
              color: '#444',
              boxShadow: '0 1px 3px rgba(0,149,218,0.03)'
            }}
          />
          <button
            style={{
              background: '#0095da',
              color: '#fff',
              fontWeight: 600,
              fontSize: 13,
              border: 'none',
              borderRadius: 6,
              padding: '5px 12px',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,149,218,0.07)',
              transition: 'background 0.15s, color 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
            onClick={() => setShowModal(true)}
          >
            <span style={{ fontSize: 15, fontWeight: 700 }}>+</span> <span style={{fontSize: 13}}>New Outfit</span>
          </button>
        </div>
      </div>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginTop: 12,
        marginRight: -32,
        paddingRight: 32,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 24,
          paddingBottom: 24,
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
              alt="outfit"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: 0,
                background: 'transparent',
                display: 'block',
              }}
            />
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
                  marginBottom: 6
                }}
              >
                {/* You can use any edit icon here, e.g. from react-icons */}
                <svg width="15" height="15" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 2 }}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                Edit
              </span>
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
        </div>
      ))}
        </div>
      </div>
    </div>
  );
}
