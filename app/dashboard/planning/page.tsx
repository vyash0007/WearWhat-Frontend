"use client"

import { useState, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { Send, Trash2, RefreshCw, Share2, Save, CloudRain, Sun, Cloud, CloudSnow, CloudLightning, X, Calendar, Check } from "lucide-react"
import ShirtLoader from "@/components/ui/ShirtLoader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { stylingService } from "@/lib/api/styling"
import { calendarOutfitsService } from "@/lib/api/calendarOutfits"
import PostOutfitModal from "@/components/dashboard/PostOutfitModal"
import type { StylingRecommendationResponse, WeatherData } from "@/lib/api/styling"
import type { CalendarOutfit } from "@/lib/api/calendarOutfits"

// User location state
interface UserLocation {
    lat: number;
    lon: number;
}

// Generate dynamic days array based on current date
const generateDays = () => {
    const today = new Date()
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return Array.from({ length: 5 }, (_, i) => {
        const date = new Date(today)
        date.setDate(today.getDate() + i - 2) // -2 to start 2 days before today

        const dayOfWeek = i === 2 ? 'Today' : dayNames[date.getDay()]
        const monthDay = `${monthNames[date.getMonth()]} ${date.getDate()}`
        const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD format

        return { day: dayOfWeek, date: monthDay, dateStr }
    })
}

const days = generateDays()

export default function PlanningPage() {
    const queryClient = useQueryClient()
    const [selectedDay, setSelectedDay] = useState(2)
    const [planInput, setPlanInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [recommendation, setRecommendation] = useState<StylingRecommendationResponse | null>(null)
    const [savedOutfit, setSavedOutfit] = useState<CalendarOutfit | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isPostModalOpen, setIsPostModalOpen] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
    const [weather, setWeather] = useState<WeatherData | null>(null)

    // Get user's location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    })
                },
                (err) => {
                    console.log("Geolocation error:", err.message)
                    // Fallback - continue without location
                }
            )
        }
    }, [])

    // Show toast notification
    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    // Get weather icon based on condition
    const getWeatherIcon = (condition?: string) => {
        if (!condition) return CloudRain
        const c = condition.toLowerCase()
        if (c.includes('clear') || c.includes('sun')) return Sun
        if (c.includes('cloud')) return Cloud
        if (c.includes('rain') || c.includes('drizzle')) return CloudRain
        if (c.includes('snow')) return CloudSnow
        if (c.includes('thunder') || c.includes('storm')) return CloudLightning
        return Cloud
    }

    // Load saved outfit for selected day
    useEffect(() => {
        setWeather(null) // Clear weather when day changes
        loadOutfitForDay(days[selectedDay].dateStr)
    }, [selectedDay])

    const loadOutfitForDay = async (date: string) => {
        try {
            console.log('🔍 Loading outfit for date:', date)
            const outfit = await calendarOutfitsService.getByDate(date)
            console.log('✅ Loaded outfit:', outfit)
            setSavedOutfit(outfit)
            if (outfit) {
                setPlanInput(outfit.prompt || "")
                setRecommendation({
                    success: true,
                    prompt: outfit.prompt,
                    selected_categories: outfit.selected_categories || [],
                    combined_image_url: outfit.combined_image_url,
                    items: outfit.items || [],
                })
                // Set weather from saved outfit if available
                if (outfit.temperature !== undefined || outfit.weather) {
                    setWeather({
                        current: {
                            temp: outfit.temperature ?? 0,
                            condition: outfit.weather || '',
                        },
                    } as WeatherData)
                }
            } else {
                console.log('ℹ️ No outfit found for this date')
                setRecommendation(null)
                setPlanInput("")
            }
        } catch (err: any) {
            console.error("❌ Error loading outfit:", err)
            // If it's a "not found" error, that's expected - just clear the state
            if (err.status === 404 || err.message?.includes("not found")) {
                setRecommendation(null)
                setPlanInput("")
                setSavedOutfit(null)
            } else {
                setError(err.message || "Failed to load outfit")
            }
        }
    }

    const handleGetRecommendation = async () => {
        if (!planInput?.trim()) return

        try {
            setLoading(true)
            setError(null)
            setWeather(null)

            const result = await stylingService.getRecommendation({
                prompt: planInput.trim(),
                lat: userLocation?.lat,
                lon: userLocation?.lon,
                date: days[selectedDay].dateStr,
            })

            setRecommendation(result)
            if (result.weather) {
                setWeather(result.weather)
            }
        } catch (err: any) {
            console.error("Error getting recommendation:", err)
            setError(err.message || "Failed to get recommendation")
        } finally {
            setLoading(false)
        }
    }

    const handleSaveOutfit = async () => {
        if (!recommendation) return

        try {
            await calendarOutfitsService.save({
                outfit_date: days[selectedDay].dateStr,
                combined_image_url: recommendation.combined_image_url,
                prompt: recommendation.prompt,
                temperature: weather?.current?.temp ? Math.round(weather.current.temp) : undefined,
                weather: weather?.current?.condition || undefined,
                selected_categories: recommendation.selected_categories,
                items: recommendation.items,
            })

            await loadOutfitForDay(days[selectedDay].dateStr)
            showToast("Outfit saved successfully!", "success")
        } catch (err) {
            console.error("Error saving outfit:", err)
            showToast("Failed to save outfit", "error")
        }
    }

    const handleDeleteOutfit = async () => {
        if (!savedOutfit) return

        try {
            await calendarOutfitsService.delete(days[selectedDay].dateStr)
            setSavedOutfit(null)
            setRecommendation(null)
            setPlanInput("")
        } catch (err) {
            console.error("Error deleting outfit:", err)
            showToast("Failed to delete outfit", "error")
        }
    }

    const handleTryAnother = () => {
        setRecommendation(null)
        setPlanInput("")
        setWeather(null)
    }

    // Split items into "THE FIT" (first 5) and "THE INSPO" (rest or combined image)
    const fitItems = recommendation?.items?.slice(0, 5) || []
    const inspoItems = recommendation?.items?.slice(5) || []

    return (
        <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 pb-20 sm:pb-6">
            <div className="max-w-6xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
                {/* Header */}
                <div className="min-w-0">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-lg tracking-tight text-foreground">Outfit Planner</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Plan your outfits for the week with AI-powered suggestions based on weather.
                    </p>
                </div>

                {/* Day Selector */}
                <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
                    {days.map((d, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedDay(index)}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-[60px] xs:min-w-[68px] sm:min-w-[72px] px-2.5 xs:px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl transition-all duration-200 flex-shrink-0",
                                selectedDay === index
                                    ? "bg-foreground text-background shadow-lg"
                                    : "bg-card border border-border hover:bg-muted"
                            )}
                        >
                            <span className="text-xs xs:text-sm font-semibold whitespace-nowrap">{d.day}</span>
                            <span className="text-[10px] xs:text-xs opacity-70 whitespace-nowrap">{d.date}</span>
                        </button>
                    ))}
                </div>

                {/* Plan Input */}
                <div className="bg-card rounded-lg sm:rounded-xl md:rounded-2xl border border-border p-3 sm:p-4 md:p-6">
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 block">
                        {"What's your plan for this day?"}
                    </label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="e.g., casual day out, formal meeting, rainy day..."
                            value={planInput || ""}
                            onChange={(e) => setPlanInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleGetRecommendation()
                                }
                            }}
                            className="flex-1 bg-background text-xs sm:text-sm md:text-base h-9 sm:h-10 md:h-11"
                            disabled={loading}
                        />
                        <Button
                            size="icon"
                            className="shrink-0 h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11"
                            onClick={handleGetRecommendation}
                            disabled={loading || !planInput?.trim()}
                        >
                            <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
                        {/* Left Column - Weather & Label */}
                        <div className="lg:col-span-1 flex flex-row lg:flex-col items-center justify-between lg:justify-start gap-3 sm:gap-4">
                            {/* Weather Widget - Loading */}
                            <div className="bg-card rounded-lg sm:rounded-xl md:rounded-2xl border border-border p-3 sm:p-4 flex flex-col items-center flex-shrink-0">
                                <ShirtLoader size="sm" />
                                <span className="text-[10px] xs:text-xs text-muted-foreground mt-2">{days[selectedDay].date}</span>
                            </div>

                            {/* Vertical Label - Hidden on mobile, shown on desktop */}
                            <div className="hidden lg:flex items-center justify-center flex-1 min-h-[400px]">
                                <span className="text-5xl xl:text-6xl 2xl:text-7xl font-black tracking-tighter text-primary/30 [writing-mode:vertical-lr] rotate-180 uppercase select-none pointer-events-none break-words">
                                    {planInput}
                                </span>
                            </div>

                            {/* Horizontal Label - Shown on mobile only */}
                            <div className="lg:hidden flex-1 min-w-0">
                                <p className="text-lg sm:text-sm font-semibold text-primary/70 uppercase truncate">
                                    {planInput}
                                </p>
                            </div>
                        </div>

                        {/* The Fit Section - Loading */}
                        <div className="hidden lg:block lg:col-span-5">
                            <div className="bg-card rounded-lg sm:rounded-xl md:rounded-2xl border border-border overflow-hidden h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
                                <div className="p-3 sm:p-4 border-b border-border">
                                    <h2 className="text-base sm:text-lg font-bold text-foreground text-center">THE FIT</h2>
                                </div>
                                <div className="p-3 sm:p-4 md:p-6 h-[calc(100%-50px)] sm:h-[calc(100%-60px)] flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <ShirtLoader size="lg" />
                                        <p className="text-sm text-muted-foreground">Generating...</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* The Inspo Section - Loading */}
                        <div className="lg:col-span-6">
                            <div className="bg-card rounded-lg sm:rounded-xl md:rounded-2xl border border-border overflow-hidden h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
                                <div className="p-3 sm:p-4 border-b border-border">
                                    <h2 className="text-base sm:text-lg font-bold text-foreground text-center">THE INSPO</h2>
                                </div>
                                <div className="p-3 sm:p-4 md:p-6 h-[calc(100%-50px)] sm:h-[calc(100%-60px)] flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <ShirtLoader size="lg" />
                                        <p className="text-sm text-muted-foreground">Generating...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                            <X className="h-8 w-8 text-destructive" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Failed to get recommendation</h3>
                        <p className="text-muted-foreground mt-1">{error}</p>
                        <Button onClick={handleGetRecommendation} className="mt-4">Try Again</Button>
                    </div>
                )}

                {/* Main Content Grid - Only show when we have a recommendation */}
                {recommendation && !loading && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
                            {/* Left Column - Weather & Label */}
                            <div className="lg:col-span-1 flex flex-row lg:flex-col items-center justify-between lg:justify-start gap-3 sm:gap-4">
                                {/* Weather Widget */}
                                {(() => {
                                    const WeatherIcon = getWeatherIcon(weather?.current?.condition)
                                    return (
                                        <div className="bg-card rounded-lg sm:rounded-xl md:rounded-2xl border border-border p-3 sm:p-4 flex flex-col items-center flex-shrink-0">
                                            <WeatherIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-muted-foreground mb-1 sm:mb-2" />
                                            <span className="text-xl sm:text-2xl md:text-2xl font-bold text-foreground">
                                                {weather?.current?.temp ? `${Math.round(weather.current.temp)}°` : '--°'}
                                            </span>
                                            <span className="text-[10px] xs:text-xs text-muted-foreground">{days[selectedDay].date}</span>
                                        </div>
                                    )
                                })()}

                                {/* Vertical Label - Hidden on mobile, shown on desktop */}
                                <div className="hidden lg:flex items-center justify-center flex-1 min-h-[400px]">
                                    <span className="text-5xl xl:text-6xl 2xl:text-7xl font-black tracking-tighter text-primary/30 [writing-mode:vertical-lr] rotate-180 uppercase select-none pointer-events-none break-words">
                                        {recommendation.prompt}
                                    </span>
                                </div>

                                {/* Horizontal Label - Shown on mobile only */}
                                <div className="lg:hidden flex-1 min-w-0">
                                    <p className="text-lg sm:text-sm font-semibold text-primary/70 uppercase truncate">
                                        {recommendation.prompt}
                                    </p>
                                </div>
                            </div>

                            {/* The Fit Section */}
                            <div className="hidden lg:block lg:col-span-5">
                                <div className="bg-card rounded-lg sm:rounded-xl md:rounded-2xl border border-border overflow-hidden h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
                                    <div className="p-3 sm:p-4 border-b border-border">
                                        <h2 className="text-base sm:text-lg font-bold text-foreground text-center">THE FIT</h2>
                                    </div>
                                    <div className="p-3 sm:p-4 md:p-6 h-[calc(100%-50px)] sm:h-[calc(100%-60px)]">
                                        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 h-full auto-rows-fr">
                                            {fitItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="relative rounded-lg sm:rounded-xl overflow-hidden bg-muted/50"
                                                >
                                                    <Image
                                                        src={item.image_url}
                                                        alt={item.category}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* The Inspo Section */}
                            <div className="lg:col-span-6">
                                <div className="bg-card rounded-lg sm:rounded-xl md:rounded-2xl border border-border overflow-hidden h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
                                    <div className="p-3 sm:p-4 border-b border-border">
                                        <h2 className="text-base sm:text-lg font-bold text-foreground text-center">THE INSPO</h2>
                                    </div>
                                    <div className="p-3 sm:p-4 md:p-6 h-[calc(100%-50px)] sm:h-[calc(100%-60px)]">
                                        {recommendation.combined_image_url ? (
                                            <div className="relative h-full w-full rounded-lg sm:rounded-xl overflow-hidden bg-white">
                                                <Image
                                                    src={recommendation.combined_image_url}
                                                    alt="Complete outfit inspiration"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : inspoItems.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 h-full">
                                                {inspoItems.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="relative rounded-lg sm:rounded-xl overflow-hidden bg-white"
                                                    >
                                                        <Image
                                                            src={item.image_url}
                                                            alt={item.category}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-full rounded-lg sm:rounded-xl bg-white">
                                                <p className="text-xs sm:text-sm text-muted-foreground text-center px-4">No inspiration images available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 bg-card rounded-lg sm:rounded-xl md:rounded-2xl border border-border p-3 sm:p-4">
                            <Button
                                variant="ghost"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 w-full sm:w-auto justify-center sm:justify-start text-xs sm:text-sm"
                                onClick={handleDeleteOutfit}
                                disabled={!savedOutfit}
                            >
                                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                Delete
                            </Button>

                            <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    className="gap-2 bg-transparent text-xs sm:text-sm h-9 sm:h-10 flex-1 sm:flex-initial"
                                    onClick={handleTryAnother}
                                >
                                    <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    <span className="hidden xs:inline">Try Another</span>
                                    <span className="xs:hidden">Try</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="gap-2 bg-transparent text-xs sm:text-sm h-9 sm:h-10 flex-1 sm:flex-initial"
                                    onClick={() => setIsPostModalOpen(true)}
                                >
                                    <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    Post
                                </Button>
                                <Button
                                    className="gap-2 shadow-lg shadow-primary/20 text-xs sm:text-sm h-9 sm:h-10 flex-1 sm:flex-initial"
                                    onClick={handleSaveOutfit}
                                >
                                    <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">{savedOutfit ? "Update Outfit" : "Save Outfit"}</span>
                                    <span className="sm:hidden">{savedOutfit ? "Update" : "Save"}</span>
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                {/* Empty State */}
                {!recommendation && !loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                        {/* The Fit Section - Empty */}
                        <div className="hidden md:block">
                            <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground text-center mb-3 sm:mb-4">THE FIT</h2>
                            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg sm:rounded-xl md:rounded-2xl min-h-[250px] sm:min-h-[300px] md:min-h-[350px] flex items-center justify-center bg-muted/20">
                                <Calendar className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-muted-foreground/40" />
                            </div>
                        </div>

                        {/* The Inspo Section - Empty */}
                        <div>
                            <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground text-center mb-3 sm:mb-4">THE INSPO</h2>
                            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg sm:rounded-xl md:rounded-2xl min-h-[250px] sm:min-h-[300px] md:min-h-[350px] flex items-center justify-center bg-muted/20">
                                <Calendar className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-muted-foreground/40" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Post Outfit Modal */}
                {recommendation && (
                    <PostOutfitModal
                        open={isPostModalOpen}
                        onClose={() => setIsPostModalOpen(false)}
                        imageUrl={recommendation.combined_image_url}
                        onSuccess={() => {
                            // Invalidate posts feed so community page shows new post
                            queryClient.invalidateQueries({ queryKey: ['posts'] })
                        }}
                    />
                )}
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <div className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border",
                        toast.type === 'success'
                            ? "bg-green-500/10 border-green-500/20 text-green-600"
                            : "bg-destructive/10 border-destructive/20 text-destructive"
                    )}>
                        {toast.type === 'success' ? (
                            <Check className="h-5 w-5" />
                        ) : (
                            <X className="h-5 w-5" />
                        )}
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    )
}
