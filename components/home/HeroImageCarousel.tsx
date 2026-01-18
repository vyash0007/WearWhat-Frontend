"use client";

export function HeroImageCarousel() {
  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center'
    }}>
      <img
        src="/hero.png"
        alt="Fashion model"
        style={{
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          maxWidth: '140%',
          maxHeight: '100%',
          marginBottom: '-2px'
        }}
      />
    </div>
  );
}