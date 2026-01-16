"use client";
import React from "react";
import { FiCalendar } from "react-icons/fi";

const week = [
  { day: "Tue", date: "Jan 13", temp: "20° 10°", icon: "sunny" },
  { day: "Wed", date: "Jan 14", temp: "20° 9°", icon: "sunny" },
  { day: "Today", date: "Jan 15", temp: "21° 10°", icon: "sunny", today: true },
  { day: "Fri", date: "Jan 16", temp: "23° 11°", icon: "sunny" },
  { day: "Sat", date: "Jan 17", temp: "24° 12°", icon: "cloudy" },
  { day: "Sun", date: "Jan 18", temp: "22° 10°", icon: "rainy" },
  { day: "Mon", date: "Jan 19", temp: "19° 8°", icon: "sunny" },
];

function getWeatherIcon(icon: string) {
  if (icon === "sunny") return <span style={{fontSize: 20}}>☀️</span>;
  if (icon === "cloudy") return <span style={{fontSize: 20}}>⛅️</span>;
  if (icon === "rainy") return <span style={{fontSize: 20}}>🌧️</span>;
  return null;
}

export default function PlanningPage() {
  const [carouselIdx, setCarouselIdx] = React.useState(2); // Center on 'Today'
  const maxCardH = 0.95;
  const medCardH = 0.75;
  const totalMargin = 3 * 36;
  const cardW = `calc((100vw - 200px - 240px - ${totalMargin}px) / 3)`;
  const idx = Math.max(1, Math.min(carouselIdx, week.length - 2));
  const visible = week.slice(idx - 1, idx + 2);
  return (
    <div style={{ padding: 0, fontFamily: 'Poppins, Arial, sans-serif', background: '#fafbfc', minHeight: '100vh' }}>
      {/* ...existing code... */}
      <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 32, color: '#222', letterSpacing: -1 }}>Outfit Calendar</h2>
      <div style={{ position: 'relative', width: '100%', height: '620px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Left arrow */}
        <button
          onClick={() => setCarouselIdx(idx => Math.max(idx - 1, 1))}
          style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: '#fff', border: '1.5px solid #eee', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', cursor: carouselIdx > 1 ? 'pointer' : 'not-allowed', opacity: carouselIdx > 1 ? 1 : 0.4 }}
          disabled={carouselIdx <= 1}
          aria-label="Previous day"
        >
          <svg width="22" height="22" fill="none" stroke="#0095da" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: `calc(100% * ${maxCardH})` }}>
          {visible.map((d, i) => {
            // i: 0=left, 1=center, 2=right
            let scale, fontSize, iconSize, borderRadius, opacity;
            const dayFont = i === 1 ? 18 : 15;
            const dateFont = i === 1 ? 14 : 12;
            const tempFont = i === 1 ? 15 : 13;
            const weatherIcon = i === 1 ? 28 : 22;
            if (i === 1) {
              scale = 1;
              fontSize = 32;
              iconSize = 54;
              borderRadius = 28;
              opacity = 1;
            } else {
              scale = medCardH / maxCardH;
              fontSize = 32;
              iconSize = 54;
              borderRadius = 28;
              opacity = 0.7;
            }
            return (
              <div key={d.day + d.date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: cardW, maxWidth: cardW, width: cardW, opacity, transition: 'all 0.35s cubic-bezier(0.4,0.2,0.2,1)', margin: '0 18px', height: '100%', justifyContent: 'center', background: i === 1 ? '#fafdff' : 'none', zIndex: i === 1 ? 1 : 0 }}>
                <div style={{ transform: `scale(${scale})`, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.35s cubic-bezier(0.4,0.2,0.2,1)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontWeight: d.today ? 700 : 600, fontSize: dayFont, color: d.today ? '#222' : '#444', letterSpacing: 0.2, position: 'relative', textAlign: 'center', lineHeight: 1.1 }}>
                      {d.today && <span style={{ position: 'absolute', left: '50%', top: -14, transform: 'translateX(-50%)', fontSize: 14, color: '#0095da' }}>•</span>}
                      {d.day}
                    </div>
                    <div style={{ fontWeight: 400, fontSize: dateFont, color: '#aaa', marginTop: 1, marginBottom: 2, letterSpacing: 0.1 }}>{d.date}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                      {getWeatherIcon(d.icon)}
                      <span style={{ fontWeight: 400, fontSize: tempFont, color: '#bbb', marginLeft: 2 }}>{d.temp}</span>
                    </div>
                  </div>
                  <div style={{ width: cardW, height: 'calc(100% * 0.7)', background: '#f7f7f7', borderRadius, border: '1.5px solid #ececec', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8, transition: 'all 0.35s cubic-bezier(0.4,0.2,0.2,1)', overflow: 'hidden' }}>
                    <FiCalendar size={iconSize} color="#bdbdbd" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Right arrow */}
        <button
          onClick={() => setCarouselIdx(idx => Math.min(idx + 1, week.length - 2))}
          style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: '#fff', border: '1.5px solid #eee', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', cursor: carouselIdx < week.length - 2 ? 'pointer' : 'not-allowed', opacity: carouselIdx < week.length - 2 ? 1 : 0.4 }}
          disabled={carouselIdx >= week.length - 2}
          aria-label="Next day"
        >
          <svg width="22" height="22" fill="none" stroke="#0095da" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
}
