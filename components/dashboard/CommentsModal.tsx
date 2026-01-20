"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Trash2 } from "lucide-react";
import { FiHeart } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { postsService, type Post, type Comment } from "@/lib/api/posts";
import ShirtLoader from "@/components/ui/ShirtLoader";

interface CommentsModalProps {
  open: boolean;
  onClose: () => void;
  post: Post;
  onLike: (postId: string) => void;
  currentUserId?: string;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString();
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function CommentsModal({ open, onClose, post, onLike, currentUserId }: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLiking, setIsLiking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      fetchComments();
      setLikesCount(post.likes_count);
    }
  }, [open, post.id, post.likes_count]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await postsService.getComments(post.id);
      if (response.success) {
        setComments(response.comments);
      }
    } catch (err) {
      console.error("Fetch comments error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isPosting) return;

    setIsPosting(true);
    try {
      const response = await postsService.addComment(post.id, newComment.trim());
      if (response.success) {
        setComments((prev) => [...prev, response.comment]);
        setNewComment("");
        inputRef.current?.focus();
      }
    } catch (err) {
      console.error("Post comment error:", err);
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setDeletingCommentId(commentId);
    try {
      const response = await postsService.deleteComment(commentId);
      if (response.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch (err) {
      console.error("Delete comment error:", err);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const response = await postsService.like(post.id);
      if (response.success) {
        setLikesCount(response.likes_count);
        onLike(post.id);
      }
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setIsLiking(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-5xl h-[90vh] max-h-[800px] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left side - Post Image */}
        <div className="flex-1 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-black flex items-center justify-center overflow-hidden">
          <div className="w-full h-full flex items-center justify-center p-8">
            <img
              src={post.image_url}
              alt="Post"
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Right side - Comments */}
        <div className="w-[450px] flex flex-col bg-white dark:bg-gray-900">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <Avatar className="w-10 h-10 ring-2 ring-gray-200 dark:ring-gray-700">
              {post.user_profile_image && (
                <AvatarImage src={post.user_profile_image} alt={post.user_name} />
              )}
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold">
                {getInitials(post.user_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                {post.user_name}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-500 hover:text-blue-600 font-semibold text-sm h-8 px-4"
            >
              Follow
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Post text + Comments list */}
          <div className="flex-1 overflow-y-auto">
            {/* Original post text */}
            {post.text && (
              <div className="flex gap-3 px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                <Avatar className="w-9 h-9 flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-700">
                  {post.user_profile_image && (
                    <AvatarImage src={post.user_profile_image} alt={post.user_name} />
                  )}
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xs font-semibold">
                    {getInitials(post.user_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm leading-relaxed">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 mr-2">
                      {post.user_name}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {post.text.split(' ').map((word, i) => {
                        if (word.startsWith('#')) {
                          return (
                            <span key={i} className="text-blue-600 dark:text-blue-400 font-medium">
                              {word}{' '}
                            </span>
                          );
                        }
                        return <span key={i}>{word} </span>;
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {formatTimeAgo(post.created_at)}
                  </p>
                </div>
              </div>
            )}

            {/* Loading comments */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <ShirtLoader size="md" />
              </div>
            )}

            {/* Comments list */}
            {!isLoading && comments.length === 0 && !post.text && (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  No comments yet
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  Start the conversation!
                </p>
              </div>
            )}

            {!isLoading && comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                <Avatar className="w-9 h-9 flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-700">
                  {comment.user_profile_image && (
                    <AvatarImage src={comment.user_profile_image} alt={comment.user_name} />
                  )}
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white text-xs font-semibold">
                    {getInitials(comment.user_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm leading-relaxed">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 mr-2">
                      {comment.user_name}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 break-words">
                      {comment.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {formatTimeAgo(comment.created_at)}
                    </p>
                    {currentUserId === comment.user_id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={deletingCommentId === comment.id}
                        className="text-xs text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 flex items-center gap-1"
                      >
                        {deletingCommentId === comment.id ? (
                          <ShirtLoader size="sm" />
                        ) : (
                          <>
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions & Likes */}
          <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className="text-gray-700 dark:text-gray-300 hover:text-red-500 hover:scale-110 transition-all disabled:opacity-50"
              >
                {isLiking ? (
                  <ShirtLoader size="sm" />
                ) : (
                  <FiHeart className="w-7 h-7" />
                )}
              </button>
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {likesCount.toLocaleString()} {likesCount === 1 ? "like" : "likes"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mt-1">
              {formatTimeAgo(post.created_at)}
            </p>
          </div>

          {/* Comment input */}
          <form
            onSubmit={handleSubmitComment}
            className="border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center gap-3 bg-white dark:bg-gray-900"
          >
            <Input
              ref={inputRef}
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isPosting}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-sm placeholder:text-gray-400"
            />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              disabled={!newComment.trim() || isPosting}
              className="text-blue-500 hover:text-blue-600 font-semibold text-sm disabled:opacity-40 h-8 px-3"
            >
              {isPosting ? (
                <ShirtLoader size="sm" />
              ) : (
                "Post"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
