"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, X, Smile } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { postsService } from "@/lib/api/posts"
import type { Post, Comment } from "@/lib/api/posts"

interface PostDetailProps {
    post: Post | null
    isOpen: boolean
    onClose: () => void
    onLike?: (postId: string) => void
    onSave?: (postId: string) => void
    isLiked?: boolean
    isSaved?: boolean
}

export function PostDetail({ post, isOpen, onClose, onLike, onSave, isLiked, isSaved }: PostDetailProps) {
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState<Comment[]>([])
    const [loadingComments, setLoadingComments] = useState(false)
    const [postingComment, setPostingComment] = useState(false)

    useEffect(() => {
        if (isOpen && post) {
            fetchComments()
        }
    }, [isOpen, post])

    const fetchComments = async () => {
        if (!post) return
        try {
            setLoadingComments(true)
            const response = await postsService.getComments(post.id)
            setComments(response.comments)
        } catch (err) {
            console.error("Error fetching comments:", err)
        } finally {
            setLoadingComments(false)
        }
    }

    const handlePostComment = async () => {
        if (!comment.trim() || !post || postingComment) return

        try {
            setPostingComment(true)
            const response = await postsService.addComment(post.id, comment.trim())
            setComments(prev => [response.comment, ...prev])
            setComment("")
        } catch (err) {
            console.error("Error posting comment:", err)
            alert("Failed to post comment")
        } finally {
            setPostingComment(false)
        }
    }

    if (!post) return null

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
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 overflow-hidden bg-card border-border h-[90vh] md:h-[500px] lg:h-[600px]">
                <DialogTitle className="sr-only">Post by {post.user_name}</DialogTitle>
                <DialogDescription className="sr-only">Detailed view of the social post</DialogDescription>
                <div className="flex flex-col md:flex-row h-full">
                    {/* Image Area - Left */}
                    <div className="flex-1 relative bg-black flex items-center justify-center border-r border-border min-h-[40vh] md:min-h-0">
                        <Image
                            src={post.image_url}
                            alt="Post detail"
                            fill
                            className="object-contain"
                        />
                    </div>

                    {/* Content Area - Right */}
                    <div className="w-full md:w-[400px] flex flex-col bg-card">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    {post.user_profile_image ? (
                                        <AvatarImage src={post.user_profile_image} alt={post.user_name} />
                                    ) : null}
                                    <AvatarFallback>{getInitials(post.user_name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold leading-none">{post.user_name}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-tight mt-0.5">Original Poster</span>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section (Scrollable) */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {/* Original Caption */}
                            <div className="flex gap-3">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                    {post.user_profile_image ? (
                                        <AvatarImage src={post.user_profile_image} alt={post.user_name} />
                                    ) : null}
                                    <AvatarFallback>{getInitials(post.user_name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm">
                                        <span className="font-bold mr-2">{post.user_name}</span>
                                        <span className="text-foreground">{post.text}</span>
                                    </p>
                                    <span className="text-[10px] text-muted-foreground uppercase">{getTimeAgo(post.created_at)}</span>
                                </div>
                            </div>

                            {/* Comments List */}
                            {loadingComments ? (
                                <div className="py-8 text-center text-muted-foreground text-sm">
                                    <p>Loading comments...</p>
                                </div>
                            ) : comments.length > 0 ? (
                                comments.map((c) => (
                                    <div key={c.id} className="flex gap-3">
                                        <Avatar className="h-8 w-8 flex-shrink-0">
                                            {c.user_profile_image ? (
                                                <AvatarImage src={c.user_profile_image} alt={c.user_name} />
                                            ) : null}
                                            <AvatarFallback>{getInitials(c.user_name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col gap-1 flex-1">
                                            <p className="text-sm">
                                                <span className="font-bold mr-2">{c.user_name}</span>
                                                <span className="text-foreground">{c.text}</span>
                                            </p>
                                            <span className="text-[10px] text-muted-foreground uppercase">{getTimeAgo(c.created_at)}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-muted-foreground text-sm">
                                    <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                    <p>No comments yet.</p>
                                    <p className="text-xs">Start the conversation!</p>
                                </div>
                            )}
                        </div>

                        {/* Interactions Bottom Area */}
                        <div className="border-t border-border mt-auto">
                            {/* Action Buttons */}
                            <div className="px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => onLike?.(post.id)}>
                                        <Heart className={cn("h-6 w-6", isLiked ? "fill-red-500 text-red-500" : "text-foreground")} />
                                    </button>
                                    <button>
                                        <MessageCircle className="h-6 w-6" />
                                    </button>
                                    <button>
                                        <Send className="h-6 w-6" />
                                    </button>
                                </div>
                                <button onClick={() => onSave?.(post.id)}>
                                    <Bookmark className={cn("h-6 w-6", isSaved ? "fill-foreground text-foreground" : "text-foreground")} />
                                </button>
                            </div>

                            {/* Likes Info */}
                            <div className="px-4 pb-2">
                                <p className="text-sm font-bold">{post.likes_count.toLocaleString()} likes</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                                    {new Date(post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>

                            {/* Add Comment Input */}
                            <div className="p-4 pt-2 border-t border-border flex items-center gap-3">
                                <Smile className="h-6 w-6 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                                <Input
                                    placeholder="Add a comment..."
                                    className="border-none shadow-none focus-visible:ring-0 p-0 text-sm bg-transparent"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey && comment.trim()) {
                                            e.preventDefault()
                                            handlePostComment()
                                        }
                                    }}
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "font-bold text-primary hover:bg-transparent px-0",
                                        (!comment.trim() || postingComment) && "opacity-50 pointer-events-none"
                                    )}
                                    onClick={handlePostComment}
                                    disabled={!comment.trim() || postingComment}
                                >
                                    {postingComment ? "Posting..." : "Post"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}
