"use client"

import Image from "next/image"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/api/posts"

interface PostCardProps {
    post: Post
    onLike?: (postId: string) => void
    onCommentClick?: (post: Post) => void
    onDelete?: (postId: string) => void
    isLiked?: boolean
}

export function PostCard({ post, onLike, onCommentClick, onDelete, isLiked }: PostCardProps) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (seconds < 60) return 'just now'
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
        return `${Math.floor(seconds / 604800)}w ago`
    }

    return (
        <article className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border">
                        {post.user_profile_image ? (
                            <AvatarImage src={post.user_profile_image} alt={post.user_name} />
                        ) : null}
                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
                            {getInitials(post.user_name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col -space-y-0.5">
                        <span className="text-sm font-bold text-foreground leading-tight">{post.user_name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-tight">Style Assistant</span>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="text-sm">Report</DropdownMenuItem>
                        {onDelete && (
                            <DropdownMenuItem className="text-sm text-destructive" onClick={() => onDelete(post.id)}>
                                Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Post Image */}
            <div
                className="relative aspect-square w-full bg-muted cursor-pointer group"
                onClick={() => onCommentClick?.(post)}
            >
                <Image
                    src={post.image_url}
                    alt="Post content"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
            </div>

            {/* Actions Layer */}
            <div className="p-3 pb-2">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onLike?.(post.id)}
                            className="transition-transform active:scale-125 duration-200"
                        >
                            <Heart
                                className={cn(
                                    "h-6 w-6",
                                    isLiked ? "fill-red-500 text-red-500" : "text-foreground hover:text-muted-foreground transition-colors"
                                )}
                            />
                        </button>
                        <button
                            onClick={() => onCommentClick?.(post)}
                            className="hover:text-muted-foreground transition-colors"
                        >
                            <MessageCircle className="h-6 w-6" />
                        </button>
                        <div className="relative group">
                            <button className="hover:text-muted-foreground transition-colors">
                                <Send className="h-6 w-6" />
                            </button>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Coming soon
                            </span>
                        </div>
                    </div>
                    <button className="hover:text-muted-foreground transition-colors">
                        <Bookmark className="h-6 w-6" />
                    </button>
                </div>

                {/* Likes info */}
                <p className="text-sm font-bold text-foreground mb-1">
                    {post.likes_count.toLocaleString()} likes
                </p>

                {/* Caption */}
                <div className="text-sm mb-1 line-clamp-2">
                    <span className="font-bold text-foreground mr-2">{post.user_name}</span>
                    <span className="text-muted-foreground">{post.text}</span>
                </div>

                {/* Comments Link */}
                {post.comments_count > 0 && (
                    <button
                        onClick={() => onCommentClick?.(post)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-1"
                    >
                        View all {post.comments_count} comments
                    </button>
                )}

                {/* Footer */}
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                    {getTimeAgo(post.created_at)}
                </p>
            </div>
        </article>
    )
}
