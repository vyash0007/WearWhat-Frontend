"use client";
import React from "react";
import WardrobePage from "./wardrobe/page";
import StylingPage from "./styling/page";
import PlanningPage from "./planning/page";
import CommunityPage from "./community/page";
import StyleChatPage from "./stylechat/page";
import SavedPage from "./saved/page";

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">Dashboard</h1>
      <p className="text-sm text-muted-foreground mt-2">Welcome to your dashboard!</p>
    </div>
  );
}
