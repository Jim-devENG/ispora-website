import React, { useState } from 'react';
import type { Contact } from '../../../src/types/admin';
import { Loader2, AlertCircle, RefreshCw, Trash2, Mail, Eye, Archive, Download } from 'lucide-react';
import { apiClient } from '../../../src/lib/apiClient';
import { exportContactsToCSV } from '../../../src/utils/exportToCSV';

interface ContactTabProps {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function ContactTab({ contacts, setContacts, loading, error, onRefresh }: ContactTabProps) {
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleStatusUpdate = async (id: string, status: Contact['status']) => {
    setUpdating(id);
    setUpdateError(null);

    try {
      const response = await apiClient.patch<Contact>(
        `/api/contact/${id}`,
        { status }
      );
      setContacts(contacts.map(c => c.id === id ? response : c));
      console.log('[ContactTab] Contact status updated:', id, status);
    } catch (error: any) {
      console.error('[ContactTab] Failed to update contact:', error);
      setUpdateError(error.message || 'Failed to update contact');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete contact submission from "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(id);
    setDeleteError(null);

    try {
      await apiClient.del(`/api/contact/${id}`);
      setContacts(contacts.filter(c => c.id !== id));
      console.log('[ContactTab] Contact deleted:', id);
    } catch (error: any) {
      console.error('[ContactTab] Failed to delete contact:', error);
      setDeleteError(error.message || 'Failed to delete contact');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadge = (status: Contact['status']) => {
    const styles = {
      new: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      read: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      replied: 'bg-green-500/20 text-green-400 border-green-500/50',
      archived: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-3 text-slate-400">Loading contact submissions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4 inline mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Contact Submissions</h2>
          <p className="text-slate-400 mt-1">
            {contacts.length} {contacts.length === 1 ? 'submission' : 'submissions'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportContactsToCSV(contacts)}
            disabled={contacts.length === 0}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
            title="Download as CSV"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Messages */}
      {updateError && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          {updateError}
        </div>
      )}
      {deleteError && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          {deleteError}
        </div>
      )}

      {/* Contact List */}
      {contacts.length === 0 ? (
        <div className="text-center py-12">
          <Mail className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No contact submissions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-slate-900/60 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                    {getStatusBadge(contact.status)}
                  </div>
                  <div className="text-sm text-slate-400 space-y-1">
                    <p><span className="text-slate-500">Email:</span> {contact.email}</p>
                    {contact.role && (
                      <p><span className="text-slate-500">Role:</span> {contact.role}</p>
                    )}
                    <p><span className="text-slate-500">Submitted:</span> {new Date(contact.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {contact.status === 'new' && (
                    <button
                      onClick={() => handleStatusUpdate(contact.id, 'read')}
                      disabled={updating === contact.id}
                      className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded transition-colors disabled:opacity-50"
                      title="Mark as read"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                  {contact.status !== 'replied' && (
                    <button
                      onClick={() => handleStatusUpdate(contact.id, 'replied')}
                      disabled={updating === contact.id}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded transition-colors disabled:opacity-50"
                      title="Mark as replied"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                  )}
                  {contact.status !== 'archived' && (
                    <button
                      onClick={() => handleStatusUpdate(contact.id, 'archived')}
                      disabled={updating === contact.id}
                      className="p-2 bg-slate-500/20 hover:bg-slate-500/30 text-slate-400 rounded transition-colors disabled:opacity-50"
                      title="Archive"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(contact.id, contact.name)}
                    disabled={deleting === contact.id}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting === contact.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="text-slate-300 whitespace-pre-wrap">{contact.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

