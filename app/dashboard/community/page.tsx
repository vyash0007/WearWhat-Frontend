"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiHeart, FiMessageCircle, FiMoreHorizontal, FiSend, FiBookmark } from "react-icons/fi";
import { postsService, type Post } from "@/lib/api/posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentsModal from "@/components/dashboard/CommentsModal";
import ShirtLoader from "@/components/ui/ShirtLoader";

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
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

export default function CommunityPage() {
  const [likingPostId, setLikingPostId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["communityPosts"],
    queryFn: async () => {
      const response = await postsService.getFeed();
      if (response.success) {
        return response.posts;
      }
      throw new Error("Failed to load posts");
    },
  });

  const posts = data ?? [];

  const handleLike = async (postId: string) => {
    if (likingPostId) return;

    setLikingPostId(postId);
    try {
      const response = await postsService.like(postId);
      if (response.success) {
        queryClient.setQueryData<Post[]>(["communityPosts"], (oldData) =>
          oldData
            ? oldData.map((post) =>
                post.id === postId
                  ? { ...post, likes_count: response.likes_count }
                  : post
              )
            : []
        );
      }
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setLikingPostId(null);
    }
  };

  const handleLikeFromModal = (postId: string) => {
    queryClient.setQueryData<Post[]>(["communityPosts"], (oldData) =>
      oldData
        ? oldData.map((post) =>
            post.id === postId
              ? { ...post, likes_count: post.likes_count + 1 }
              : post
          )
        : []
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Style Community
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Share your favorite outfits and get inspired by others
      </p>

      <div className="mt-8 flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-[20vh] pt-20">
            <ShirtLoader size="lg" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500 mb-4">{error instanceof Error ? error.message : "Failed to load posts"}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              No posts yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Be the first to share your outfit with the community!
            </p>
          </div>
        )}

        {/* Posts Grid */}
        {!isLoading && !error && posts.length > 0 && (
          <div className="flex flex-wrap gap-6 pb-8 px-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-shadow overflow-hidden w-[350px]"
              >
                {/* User Header */}
                <div className="flex items-center gap-2 p-3">
                  <Avatar className="w-8 h-8 ring-2 ring-gray-200 dark:ring-gray-700">
                    {post.user_profile_image && (
                      <AvatarImage src={post.user_profile_image} alt={post.user_name} />
                    )}
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold text-sm">
                      {getInitials(post.user_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {post.user_name}
                    </h3>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                    <FiMoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Image */}
                <div
                  className="bg-white dark:bg-gray-900 cursor-pointer aspect-[4/3] relative group overflow-hidden"
                  onDoubleClick={() => handleLike(post.id)}
                  onClick={() => setSelectedPost(post)}
                >
                  <img
                    src={post.image_url}
                    alt="Outfit post"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                </div>

                {/* Actions & Details */}
                <div className="p-3">
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        disabled={likingPostId === post.id}
                        className="text-gray-700 dark:text-gray-300 hover:text-red-500 hover:scale-110 transition-all disabled:opacity-50"
                      >
                        {likingPostId === post.id ? (
                          <ShirtLoader size="sm" />
                        ) : (
                          <FiHeart className="w-6 h-6" />
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-500 hover:scale-110 transition-all"
                      >
                        <FiMessageCircle className="w-6 h-6" />
                      </button>
                      <button className="text-gray-700 dark:text-gray-300 hover:text-green-500 hover:scale-110 transition-all">
                        <FiSend className="w-6 h-6" />
                      </button>
                    </div>
                    <button className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 hover:scale-110 transition-all">
                      <FiBookmark className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Likes Count */}
                  <div className="mb-2">
                    <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {post.likes_count.toLocaleString()} likes
                    </p>
                  </div>

                  {/* Caption */}
                  {post.text && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                        <span className="font-semibold mr-1">{post.user_name}</span>
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
                      </p>
                    </div>
                  )}

                  {/* View Comments */}
                  {post.comments_count > 0 && (
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      View all {post.comments_count} comments
                    </button>
                  )}

                  {/* Timestamp */}
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                    {formatTimeAgo(post.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comments Modal */}
      {selectedPost && (
        <CommentsModal
          open={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          post={selectedPost}
          onLike={handleLikeFromModal}
        />
      )}
    </div>
  );
}
