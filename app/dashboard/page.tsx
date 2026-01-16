"use client";
import React, { useState } from "react";
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';
import WardrobePage from "./wardrobe/page";
import TopBanner from "../../components/dashboard/TopBanner";
import StylingPage from "./styling/page";
import PlanningPage from "./planning/page";
import CommunityPage from "./community/page";
import StyleChatPage from "./stylechat/page";
import SavedPage from "./saved/page";
import { FaEdit } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { FiGrid, FiScissors, FiCalendar, FiUsers, FiMessageCircle, FiBookmark } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { LuCalendarPlus } from "react-icons/lu";
import { FiMapPin } from "react-icons/fi";
import { IoCloudUploadOutline } from "react-icons/io5";

export default function DashboardPage() {
const sidebarLinks = [
  { name: "Wardrobe", icon: <FiGrid size={20} />, key: "wardrobe" },
  { name: "Styling", icon: <FiScissors size={20} />, key: "styling" },
  { name: "Planning", icon: <FiCalendar size={20} />, key: "planning" },
  { name: "Community", icon: <FiUsers size={20} />, key: "community" },
  { name: "StyleChat", icon: <FiMessageCircle size={20} />, key: "stylechat" },
  { name: "Saved", icon: <FiBookmark size={20} />, key: "saved" },
];

const [activeSection, setActiveSection] = useState("wardrobe");
return (
  <>
    <TopBanner />
    <div style={{ display: "flex", height: "100vh", background: "#f5f0f2" }}>
      {/* Sidebar */}
      <aside style={{ width: 200, background: "#fff", borderRight: "1px solid #e8eaf0", display: "flex", flexDirection: "column", justifyContent: "space-between", fontFamily: 'Poppins, Arial, sans-serif' }}>
        <div>
          <div style={{ padding: "18px 0 18px 16px", display: 'flex', alignItems: 'center', gap: 4 }}>
            <img src="/logo.png" alt="WearWhat Logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
            <span style={{ fontWeight: 700, fontSize: 16, color: '#171717', fontFamily: 'Poppins, Arial, sans-serif', letterSpacing: '-1px' }}>WearWhat</span>
          </div>
          <nav style={{ marginTop: 4 }}>
            {sidebarLinks.map((link) => (
              <div
                key={link.key}
                onClick={() => setActiveSection(link.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 16px",
                  background: activeSection === link.key ? "#e8f4fc" : "none",
                  color: activeSection === link.key ? "#0095da" : "#444",
                  fontWeight: activeSection === link.key ? 600 : 500,
                  borderRadius: 7,
                  marginBottom: 0,
                  cursor: "pointer",
                  fontSize: 14,
                  transition: 'background 0.2s, color 0.2s',
                  gap: 10
                }}
              >
                {link.icon}
                <span>{link.name}</span>
              </div>
            ))}
          </nav>
        </div>
      </aside>
      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 44px)', background: '#fafbfc', marginTop: 44, overflow: 'hidden' }}>
        <div style={{ padding: '0 32px', width: '100%', height: '100%', overflow: 'hidden' }}>
          {activeSection === "wardrobe" && <WardrobePage />}
          {activeSection === "styling" && <StylingPage />}
          {activeSection === "planning" && <PlanningPage />}
          {activeSection === "community" && <CommunityPage />}
          {activeSection === "stylechat" && <StyleChatPage />}
          {activeSection === "saved" && <SavedPage />}
        </div>
      </main>
    </div>
  </>
);
}