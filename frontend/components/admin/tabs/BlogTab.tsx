import React, { useState } from 'react';
import type { BlogPost } from '../../../src/types/admin';
import { Loader2, AlertCircle, RefreshCw, Plus, Edit, Trash2, X, Download } from 'lucide-react';
import { apiClient } from '../../../src/lib/apiClient';
import { ImageUpload } from '../../ui/ImageUpload';
import { exportBlogPostsToCSV } from '../../../src/utils/exportToCSV';

interface BlogTabProps {
  posts: BlogPost[];
  setPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function BlogTab({ posts, setPosts, loading, error, onRefresh }: BlogTabProps) {
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    author_name: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const openModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        slug: post.slug,
        status: post.status,
        author_name: post.author_name || '',
        excerpt: post.excerpt || '',
        content: post.content,
        cover_image_url: post.cover_image_url || '',
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        slug: '',
        status: 'draft',
        author_name: '',
        excerpt: '',
        content: '',
        cover_image_url: '',
      });
    }
    setIsModalOpen(true);
    setSaveError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
      setFormData({
        title: '',
        slug: '',
        status: 'draft',
        author_name: '',
        excerpt: '',
        content: '',
        cover_image_url: '',
      });
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
      setSaveError('Title, slug, and content are required');
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const payload = {
        ...formData,
        cover_image_url: formData.cover_image_url || null,
      };

      if (editingPost) {
        // Update existing post
        const response = await apiClient.patch<{ post: BlogPost }>(
          `/api/blog-posts/${editingPost.id}`,
          payload
        );
        setPosts(posts.map(p => p.id === editingPost.id ? response.post : p));
        console.log('[BlogTab] Post updated:', response.post.id);
      } else {
        // Create new post
        const response = await apiClient.post<{ post: BlogPost }>(
          '/api/blog-posts',
          payload
        );
        setPosts([response.post, ...posts]);
        console.log('[BlogTab] Post created:', response.post.id);
      }
      closeModal();
      onRefresh();
    } catch (error: any) {
      console.error('[BlogTab] Failed to save post:', error);
      setSaveError(error.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (postId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(postId);
    setDeleteError(null);

    try {
      await apiClient.del(`/api/blog-posts/${postId}`);
      setPosts(posts.filter(p => p.id !== postId));
      console.log('[BlogTab] Post deleted:', postId);
    } catch (error: any) {
      console.error('[BlogTab] Failed to delete post:', error);
      setDeleteError(error.message || 'Failed to delete post');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        <span className="ml-3 text-slate-400">Loading blog posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-red-400 font-medium">Failed to load blog posts</h3>
          </div>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-300 rounded-lg text-sm transition-colors"
          >
            Retry
          </button>
        </div>
        <p className="mt-2 text-sm text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error messages */}
      {saveError && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-sm text-red-300">
          {saveError}
        </div>
      )}
      {deleteError && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-sm text-red-300">
          {deleteError}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-50">
          Blog Posts ({posts.length})
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportBlogPostsToCSV(posts)}
            disabled={posts.length === 0}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
            title="Download as CSV"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => openModal()}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors"
            type="button"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </button>
          <button
            onClick={onRefresh}
            className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Slug</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Author</th>
                <th className="px-4 py-3 text-left font-medium">Published</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No blog posts found
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="px-4 py-3 text-slate-200 font-medium">{post.title}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{post.slug}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-300">{post.author_name || '—'}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(post)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deleting === post.id}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors disabled:opacity-50"
                        >
                          {deleting === post.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-50">
                {editingPost ? 'Edit Post' : 'New Post'}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <ImageUpload
                  value={formData.cover_image_url}
                  onChange={(url) => setFormData({ ...formData, cover_image_url: url || '' })}
                  type="blog"
                  label="Cover Image"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              {saveError && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-sm text-red-300">
                  {saveError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center"
                >
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {saving ? 'Saving...' : editingPost ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    draft: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
    published: 'bg-green-900/30 text-green-400 border-green-800',
    archived: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs border ${colors[status as keyof typeof colors] || 'bg-slate-800 text-slate-400'}`}>
      {status}
    </span>
  );
}
