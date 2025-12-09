/**
 * Blog Post Detail Page
 * 
 * Displays a single blog post in full detail.
 * Accessed via /blog-post/[slug] or /blog/[slug]
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Section } from './layout/Section';
import { safeAnimate, safeTransition } from './utils/animationUtils';
import { FloatingShapes, AnimatedBlob } from './animations/FloatingElements';
import { AnimatedDots } from './animations/AnimatedBackground';
import { fetchJson } from '../src/utils/fetchJson';
import { 
  Calendar, 
  User, 
  Clock,
  ArrowLeft,
  Tag,
  Loader2,
  Share2,
  BookOpen
} from 'lucide-react';
import { cn } from './ui/utils';

interface BlogPostDetailPageProps {
  onPageChange: (page: string) => void;
  postId?: string;
  postSlug?: string;
}

export function BlogPostDetailPage({ onPageChange, postId, postSlug }: BlogPostDetailPageProps) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch by ID
        if (postId) {
          const response = await fetchJson<{ post: any }>(`/api/blog-posts/${postId}`);
          setPost(response.post);
        } else if (postSlug) {
          // If we have slug, fetch all and filter
          const response = await fetchJson<{ posts: any[] }>('/api/blog-posts?status=published');
          const foundPost = response.posts.find((p: any) => p.slug === postSlug);
          if (foundPost) {
            setPost(foundPost);
          } else {
            throw new Error('Post not found');
          }
        } else {
          throw new Error('Post ID or slug is required');
        }
      } catch (err: any) {
        console.error('Error fetching blog post:', err);
        setError(err.message || 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, postSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
          <p className="text-muted-foreground mb-6">{error || 'The blog post you are looking for does not exist.'}</p>
          <Button onClick={() => onPageChange('blog')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const publishedDate = new Date(post.published_at || post.created_at);
  const readingTime = post.content ? Math.ceil(post.content.split(/\s+/).length / 200) : 5;

  return (
    <div className="min-h-screen">
      {/* Hero Section with Cover Image */}
      <Section 
        className="relative overflow-hidden pt-24 pb-12"
        style={{
          background: 'linear-gradient(135deg, hsl(220 100% 96%) 0%, hsl(220 100% 92%) 50%, hsl(220 100% 95%) 100%)'
        }}
      >
        <AnimatedBlob className="top-0 right-0 bg-primary/15" delay={0} size="w-96 h-96" />
        <AnimatedDots />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => onPageChange('blog')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>

          {post.cover_image_url && (
            <motion.div
              className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-8 shadow-xl"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: safeTransition({ duration: 0.6 })
                }
              }}
            >
              <img 
                src={post.cover_image_url} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </motion.div>
          )}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: safeTransition({ duration: 0.6, delay: 0.2 })
              }
            }}
          >
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag: string, index: number) => (
                  <Badge key={index} className="bg-primary/10 text-primary border-primary/20">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              {post.author_name && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{post.author_name}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{publishedDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      text: post.excerpt,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="ml-auto"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Content Section */}
      <Section 
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(220 100% 96%) 50%, hsl(220 100% 98%) 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.article
            className="prose prose-lg dark:prose-invert max-w-none"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: safeTransition({ duration: 0.6, delay: 0.3 })
              }
            }}
          >
            <div 
              className={cn(
                "text-base sm:text-lg leading-relaxed",
                "prose-headings:font-bold prose-headings:text-foreground",
                "prose-p:text-foreground/90 prose-p:mb-6",
                "prose-a:text-primary prose-a:underline",
                "prose-strong:text-foreground prose-strong:font-semibold",
                "prose-ul:list-disc prose-ol:list-decimal",
                "prose-li:text-foreground/90",
                "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic",
                "prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
                "prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg",
                "prose-img:rounded-lg prose-img:shadow-lg"
              )}
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </motion.article>

          {/* Back to Blog Button */}
          <motion.div
            className="mt-12 pt-8 border-t"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: safeTransition({ duration: 0.6, delay: 0.5 })
              }
            }}
          >
            <Button
              variant="outline"
              onClick={() => onPageChange('blog')}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}

