"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiGrid, FiScissors, FiCalendar, FiUsers, FiMessageCircle, FiBookmark, FiUser } from "react-icons/fi";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";

const sidebarLinks: { name: string; href: string; icon: IconType }[] = [
    { name: "Wardrobe", href: "/dashboard/wardrobe", icon: FiGrid },
    { name: "Styling", href: "/dashboard/styling", icon: FiScissors },
    { name: "Planning", href: "/dashboard/planning", icon: FiCalendar },
    { name: "Community", href: "/dashboard/community", icon: FiUsers },
    { name: "StyleChat", href: "/dashboard/stylechat", icon: FiMessageCircle },
    { name: "Saved", href: "/dashboard/saved", icon: FiBookmark },
    { name: "Profile", href: "/dashboard/profile", icon: FiUser },
];

export default function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen flex flex-col p-4 bg-sidebar border-r border-sidebar-border fixed left-0 top-0">
            <div className="flex items-center gap-2 px-4 mb-8">
                <span className="text-xl font-lg text-sidebar-foreground">WearWhat</span>
            </div>
            <nav className="flex flex-col gap-2">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-colors",
                                isActive
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            )}
                        >
                            {link.name === "Styling" ? (
                                <Image
                                    src="/whitelogo.png"
                                    alt="Styling"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5 object-contain"
                                />
                            ) : (
                                <link.icon className="w-5 h-5" />
                            )}
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
