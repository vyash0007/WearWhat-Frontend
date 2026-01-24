"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutGrid,
    Scissors,
    Calendar,
    Users,
    MessageCircle,
    Bookmark,
    User,
    Menu,
    X,
    Shirt,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import UpgradeToProModal from "@/components/dashboard/UpgradeToProModal"

const navItems = [
    { href: "/dashboard/wardrobe", label: "Wardrobe", icon: LayoutGrid },
    { href: "/dashboard/styling", label: "Styling", icon: Scissors },
    { href: "/dashboard/planning", label: "Planning", icon: Calendar },
    { href: "/dashboard/community", label: "Community", icon: Users },
    { href: "/dashboard/stylechat", label: "StyleChat", icon: MessageCircle },
    { href: "/dashboard/saved", label: "Saved", icon: Bookmark },
    { href: "/dashboard/profile", label: "Profile", icon: User },
]

function NavContent({ pathname, onItemClick }: { pathname: string; onItemClick?: () => void }) {
    return (
        <nav className="flex flex-col gap-1 p-2 sm:p-3">
            {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onItemClick}
                        className={cn(
                            "flex items-center gap-2.5 sm:gap-3 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200",
                            isActive
                                ? "bg-white text-black shadow-lg"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        )}
                    >
                        <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isProModalOpen, setIsProModalOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-background dashboard-theme text-foreground">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-sidebar border-r border-sidebar-border">
                <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary">
                        <Shirt className="h-5 w-5 text-sidebar-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold text-sidebar-foreground tracking-tight">WearWhat</span>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <NavContent pathname={pathname} />
                </div>
                <div className="p-4 border-t border-sidebar-border">
                    <div className="rounded-xl bg-sidebar-accent/50 p-4">
                        <p className="text-xs text-sidebar-foreground/60 mb-2">Upgrade to Pro</p>
                        <p className="text-sm text-sidebar-foreground font-medium">Unlimited AI styling</p>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border">
                <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                        <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-sidebar-primary flex-shrink-0">
                            <Shirt className="h-4 w-4 sm:h-5 sm:w-5 text-sidebar-primary-foreground" />
                        </div>
                        <span className="text-base sm:text-lg font-bold text-sidebar-foreground truncate">WearWhat</span>
                    </div>
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-sidebar-foreground h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0">
                                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="bg-sidebar p-0 border-sidebar-border w-[85%] sm:w-[320px] max-w-sm">
                            <div className="flex h-14 sm:h-16 items-center gap-2 px-4 sm:px-6 border-b border-sidebar-border">
                                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-sidebar-primary flex-shrink-0">
                                    <Shirt className="h-4 w-4 sm:h-5 sm:w-5 text-sidebar-primary-foreground" />
                                </div>
                                <span className="text-lg sm:text-xl font-bold text-sidebar-foreground truncate">WearWhat</span>
                            </div>
                            <div className="overflow-y-auto h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)]">
                                <NavContent pathname={pathname} onItemClick={() => setMobileOpen(false)} />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64">
                {/* Pro Banner */}
                <div className="hidden lg:block sticky top-0 z-40 pt-4 px-6">
                    <div className="flex items-center justify-center gap-4 bg-black rounded-lg px-6 py-2">
                        <p className="text-sm font-medium text-white">
                            Get unlimited AI outfit suggestions and weather-based recommendations!
                        </p>
                        <Button
                            size="sm"
                            variant="default"
                            className="bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-md"
                            onClick={() => setIsProModalOpen(true)}
                        >
                            Upgrade to Pro
                        </Button>
                    </div>
                </div>

                <div className="pt-14 sm:pt-16 lg:pt-0">
                    {children}
                </div>
            </main>

            <UpgradeToProModal
                isOpen={isProModalOpen}
                onClose={() => setIsProModalOpen(false)}
            />
        </div>
    )
}
