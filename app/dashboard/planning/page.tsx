"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { X, Send, Trash2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { stylingService, type StylingRecommendationResponse } from "@/lib/api/styling";
import { calendarOutfitsService, type CalendarOutfit } from "@/lib/api/calendarOutfits";
import { cn } from "@/lib/utils";
import PostOutfitModal from "@/components/dashboard/PostOutfitModal";
import ShirtLoader from "@/components/ui/ShirtLoader";

interface DayData {
  day: string;
  date: string;
  fullDate: string; // Format: YYYY-MM-DD for API
  temp: string;
  tempValue: number;
  icon: string;
  today?: boolean;
}

// Generate 5 days data: 2 before today, today, and 2 after today
function generateWeekData(): DayData[] {
  const today = new Date();
  const days: DayData[] = [];

  // Start from 2 days ago to 2 days after (5 days total)
  for (let i = -2; i <= 2; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const isToday = i === 0;
    const dayName = isToday ? "Today" : dayNames[date.getDay()];
    const dateStr = `${monthNames[date.getMonth()]} ${date.getDate()}`;
    const fullDate = date.toISOString().split('T')[0];

    // Mock weather data for 5 days
    const temps = [20, 21, 22, 23, 24];
    const lows = [10, 9, 10, 11, 12];
    const icons = ["sunny", "sunny", "sunny", "cloudy", "sunny"];

    days.push({
      day: dayName,
      date: dateStr,
      fullDate,
      temp: `${temps[i + 2]}° / ${lows[i + 2]}°`,
      tempValue: temps[i + 2],
      icon: icons[i + 2],
      today: isToday,
    });
  }

  return days;
}

const week = generateWeekData();

function getWeatherIcon(icon: string, size: number = 20) {
  if (icon === "sunny") return <span style={{ fontSize: size }}>☀️</span>;
  if (icon === "cloudy") return <span style={{ fontSize: size }}>⛅️</span>;
  if (icon === "rainy") return <span style={{ fontSize: size }}>🌧️</span>;
  return null;
}

export default function PlanningPage() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(2);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [result, setResult] = useState<StylingRecommendationResponse | null>(null);
  const [error, setError] = useState("");
  const [savedOutfits, setSavedOutfits] = useState<Record<string, CalendarOutfit>>({});
  const [loadingSavedOutfits, setLoadingSavedOutfits] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postImageUrl, setPostImageUrl] = useState("");

  const selectedDay = week[selectedDayIndex];
  const hasSavedOutfit = selectedDay ? !!savedOutfits[selectedDay.fullDate] : false;

  // Load saved outfits on mount
  const fetchSavedOutfits = useCallback(async () => {
    try {
      setLoadingSavedOutfits(true);
      const outfits = await calendarOutfitsService.getAll();
      const outfitsMap: Record<string, CalendarOutfit> = {};
      outfits.forEach((outfit) => {
        outfitsMap[outfit.outfit_date] = outfit;
      });
      setSavedOutfits(outfitsMap);
    } catch (err) {
      console.error("Failed to load saved outfits:", err);
    } finally {
      setLoadingSavedOutfits(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedOutfits();
  }, [fetchSavedOutfits]);

  useEffect(() => {
    if (selectedDay) {
      const savedOutfit = savedOutfits[selectedDay.fullDate];
      if (savedOutfit) {
        setPrompt(savedOutfit.prompt);
        setResult({
          success: true,
          prompt: savedOutfit.prompt,
          selected_categories: savedOutfit.selected_categories,
          combined_image_url: savedOutfit.combined_image_url,
          items: savedOutfit.items,
        });
      } else {
        setPrompt("");
        setResult(null);
      }
      setError("");
    }
  }, [selectedDay, savedOutfits]);

  const handleGenerateOutfit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await stylingService.getRecommendation(prompt.trim());
      setResult(response);
    } catch (err) {
      setError("Failed to generate outfit. Please try again.");
      console.error("Styling error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOutfit = async () => {
    if (!selectedDay || !result || isSaving) return;

    setIsSaving(true);
    setError("");

    try {
      await calendarOutfitsService.save({
        outfit_date: selectedDay.fullDate,
        combined_image_url: result.combined_image_url,
        prompt: prompt,
        temperature: selectedDay.tempValue,
        selected_categories: result.selected_categories,
        items: result.items,
      });
      await fetchSavedOutfits();
    } catch (err) {
      setError("Failed to save outfit. Please try again.");
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteOutfit = async () => {
    if (!selectedDay || isDeleting) return;

    setIsDeleting(true);
    setError("");

    try {
      await calendarOutfitsService.delete(selectedDay.fullDate);
      setSavedOutfits((prev) => {
        const updated = { ...prev };
        delete updated[selectedDay.fullDate];
        return updated;
      });
      setResult(null);
      setPrompt("");
    } catch (err) {
      setError("Failed to delete outfit. Please try again.");
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePostClick = (imageUrl: string) => {
    setPostImageUrl(imageUrl);
    setShowPostModal(true);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Outfit Calendar
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Plan your outfits for the week with AI-powered suggestions based on weather.
      </p>

      {/* Day Selector */}
      <div className="mt-6 flex justify-center gap-2">
        {week.map((day, index) => (
          <button
            key={day.fullDate}
            onClick={() => setSelectedDayIndex(index)}
            className={cn(
              "rounded-lg px-4 py-2 text-center transition-all duration-200",
              selectedDayIndex === index
                ? "bg-gray-900 text-white shadow-md dark:bg-gray-100 dark:text-gray-900"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            )}
          >
            <div className="font-semibold">{day.day}</div>
            <div className="text-xs">{day.date}</div>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="mt-6 flex-1 rounded-2xl bg-white dark:bg-gray-800 shadow-lg p-8 overflow-y-auto mb-6 mx-6">
        <div className="grid grid-cols-12 gap-8 h-full">
          {/* Left Vertical Text */}
          <div className="col-span-1 flex flex-col items-center justify-between">
            <div className="flex-1 flex items-center">
              <h2 className="text-5xl font-bold text-gray-300 dark:text-gray-600" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                {prompt.toUpperCase() || "EVENT"}
              </h2>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">HAPPY HOUR</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">THE HENRY</p>
            </div>
          </div>

          {/* Center Content */}
          <div className="col-span-11">
            {/* Prompt Input */}
            <form onSubmit={handleGenerateOutfit} className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                What's your plan for this day?
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="e.g., office meeting, casual brunch, date night..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                    className="h-12 px-4 text-base rounded-xl border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!prompt.trim() || isLoading}
                  className="h-12 px-5 rounded-xl"
                >
                  {isLoading ? (
                    <ShirtLoader size="sm" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </form>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            {loadingSavedOutfits ? (
               <div className="flex min-h-[20vh] items-center justify-center pt-20">
                 <ShirtLoader size="lg" />
               </div>
            ) : (
              <div className="grid grid-cols-2 gap-8 min-h-[500px]">
                {/* The Fit */}
                <div className="flex flex-col h-full">
                  <h3 className="text-center text-2xl font-semibold tracking-widest text-gray-800 dark:text-gray-200 mb-4">THE FIT</h3>
                  {isLoading ? (
                     <div className="flex flex-1 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700/50">
                       <p className="text-gray-500">Generating...</p>
                     </div>
                  ) : result?.items ? (
                    <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-100 dark:bg-gray-700/50 p-4 flex-1">
                      {result.items.map(item => (
                        <div key={item.id} className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow aspect-square">
                          <img src={item.image_url} alt={item.category} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <FiCalendar size={48} className="text-gray-300 dark:text-gray-500" />
                    </div>
                  )}
                </div>

                {/* The Inspo */}
                <div className="flex flex-col h-full">
                  <h3 className="text-center text-2xl font-semibold tracking-widest text-gray-800 dark:text-gray-200 mb-4">THE INSPO</h3>
                   {isLoading ? (
                     <div className="flex flex-1 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700/50">
                        <p className="text-gray-500">Generating...</p>
                     </div>
                  ) : result?.combined_image_url ? (
                    <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow flex-1">
                      <img src={result.combined_image_url} alt="Outfit inspiration" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                     <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                       <FiCalendar size={48} className="text-gray-300 dark:text-gray-500" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {result && !isLoading && (
              <div className="mt-6 flex items-center justify-between">
                <div>
                  {hasSavedOutfit && (
                     <Button
                      onClick={handleDeleteOutfit}
                      disabled={isDeleting}
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-900/20"
                    >
                      {isDeleting ? <ShirtLoader size="sm" /> : <Trash2 className="mr-2 h-4 w-4" />}
                      Delete
                    </Button>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setResult(null);
                      setPrompt("");
                    }}
                    variant="outline"
                  >
                    Try Another
                  </Button>
                  <Button
                    onClick={() => handlePostClick(result.combined_image_url)}
                    variant="outline"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Post
                  </Button>
                  <Button onClick={handleSaveOutfit} disabled={isSaving}>
                    {isSaving ? (
                      <ShirtLoader size="sm" />
                    ) : null}
                    {hasSavedOutfit ? 'Update Outfit' : 'Save to Calendar'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Modal */}
      <PostOutfitModal
        open={showPostModal}
        onClose={() => setShowPostModal(false)}
        imageUrl={postImageUrl}
      />
    </div>
  );
}
