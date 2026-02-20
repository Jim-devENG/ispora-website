import React, { useState } from 'react';
import type { Event } from '../../../src/types/admin';
import { Loader2, AlertCircle, RefreshCw, Plus, Edit, Trash2, X, Download } from 'lucide-react';
import { apiClient } from '../../../src/lib/apiClient';
import { ImageUpload } from '../../ui/ImageUpload';
import { RichTextEditor } from '../../ui/RichTextEditor';
import { exportEventsToCSV } from '../../../src/utils/exportToCSV';

interface EventsTabProps {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function EventsTab({ events, setEvents, loading, error, onRefresh }: EventsTabProps) {
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    start_at: '',
    end_at: '',
    location: '',
    registration_link: '',
    description: '',
    cover_image_url: '',
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const openModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        status: event.status,
        start_at: event.start_at ? new Date(event.start_at).toISOString().slice(0, 16) : '',
        end_at: event.end_at ? new Date(event.end_at).toISOString().slice(0, 16) : '',
        location: event.location || '',
        registration_link: event.registration_link || '',
        description: event.description || '',
        cover_image_url: event.cover_image_url || '',
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        status: 'draft',
        start_at: '',
        end_at: '',
        location: '',
        registration_link: '',
        description: '',
        cover_image_url: '',
      });
    }
    setIsModalOpen(true);
    setSaveError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
      setFormData({
        title: '',
        status: 'draft',
        start_at: '',
        end_at: '',
        location: '',
        registration_link: '',
        description: '',
        cover_image_url: '',
      });
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.start_at) {
      setSaveError('Title and start date are required');
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const payload = {
        ...formData,
        start_at: new Date(formData.start_at).toISOString(),
        end_at: formData.end_at ? new Date(formData.end_at).toISOString() : null,
        cover_image_url: formData.cover_image_url || null,
      };

      if (editingEvent) {
        // Update existing event
        const response = await apiClient.patch<{ event: Event }>(
          `/api/events/${editingEvent.id}`,
          payload
        );
        setEvents(events.map(e => e.id === editingEvent.id ? response.event : e));
        console.log('[EventsTab] Event updated:', response.event.id);
      } else {
        // Create new event
        const response = await apiClient.post<{ event: Event }>(
          '/api/events',
          payload
        );
        setEvents([response.event, ...events]);
        console.log('[EventsTab] Event created:', response.event.id);
      }
      closeModal();
      onRefresh();
    } catch (error: any) {
      console.error('[EventsTab] Failed to save event:', error);
      // Show detailed error message
      const errorMsg = error.message || 'Failed to save event';
      setSaveError(errorMsg);
      // Also log full error for debugging
      if (error.details || error.hint) {
        console.error('[EventsTab] Error details:', error.details);
        console.error('[EventsTab] Error hint:', error.hint);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(eventId);
    setDeleteError(null);

    try {
      await apiClient.del(`/api/events/${eventId}`);
      setEvents(events.filter(e => e.id !== eventId));
      console.log('[EventsTab] Event deleted:', eventId);
    } catch (error: any) {
      console.error('[EventsTab] Failed to delete event:', error);
      setDeleteError(error.message || 'Failed to delete event');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        <span className="ml-3 text-slate-400">Loading events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-red-400 font-medium">Failed to load events</h3>
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
          Events ({events.length})
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportEventsToCSV(events)}
            disabled={events.length === 0}
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
            New Event
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
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Start Date</th>
                <th className="px-4 py-3 text-left font-medium">End Date</th>
                <th className="px-4 py-3 text-left font-medium">Location</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No events found
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="px-4 py-3 text-slate-200 font-medium">{event.title}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={event.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {new Date(event.start_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {event.end_at ? new Date(event.end_at).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{event.location || '—'}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(event.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(event)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id, event.title)}
                          disabled={deleting === event.id}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors disabled:opacity-50"
                        >
                          {deleting === event.id ? (
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
                {editingEvent ? 'Edit Event' : 'New Event'}
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
                <ImageUpload
                  value={formData.cover_image_url}
                  onChange={(url) => setFormData({ ...formData, cover_image_url: url || '' })}
                  type="event"
                  label="Cover Image"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_at}
                  onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_at}
                  onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Registration Link
                </label>
                <input
                  type="url"
                  value={formData.registration_link}
                  onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Description
                </label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => setFormData({ ...formData, description: value })}
                  placeholder="Write your event description here..."
                  className="w-full"
                  uploadType="event"
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
                  {saving ? 'Saving...' : editingEvent ? 'Update' : 'Create'}
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
