import ShirtLoader from "@/components/ui/ShirtLoader"

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <ShirtLoader size="xl" />
            <p className="mt-4 text-sm text-muted-foreground">Loading your wardrobe...</p>
        </div>
    )
}
