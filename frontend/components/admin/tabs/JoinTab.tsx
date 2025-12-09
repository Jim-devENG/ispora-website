import React, { useState } from 'react';
import type { JoinRequest } from '../../../src/types/admin';
import { Loader2, AlertCircle, RefreshCw, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { apiClient } from '../../../src/lib/apiClient';

interface JoinTabProps {
  joinRequests: JoinRequest[];
  setJoinRequests: React.Dispatch<React.SetStateAction<JoinRequest[]>>;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function JoinTab({ joinRequests, setJoinRequests, loading, error, onRefresh }: JoinTabProps) {
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setUpdating(id);
    setUpdateError(null);

    try {
      const response = await apiClient.patch<JoinRequest>(
        `/api/join-requests/${id}`,
        { status: 'approved' }
      );
      setJoinRequests(joinRequests.map(r => r.id === id ? response : r));
      console.log('[JoinTab] Join request approved:', id);
    } catch (error: any) {
      console.error('[JoinTab] Failed to approve join request:', error);
      setUpdateError(error.message || 'Failed to approve join request');
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = async (id: string) => {
    setUpdating(id);
    setUpdateError(null);

    try {
      const response = await apiClient.patch<JoinRequest>(
        `/api/join-requests/${id}`,
        { status: 'rejected' }
      );
      setJoinRequests(joinRequests.map(r => r.id === id ? response : r));
      console.log('[JoinTab] Join request rejected:', id);
    } catch (error: any) {
      console.error('[JoinTab] Failed to reject join request:', error);
      setUpdateError(error.message || 'Failed to reject join request');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete join request for "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(id);
    setDeleteError(null);

    try {
      await apiClient.del(`/api/join-requests/${id}`);
      setJoinRequests(joinRequests.filter(r => r.id !== id));
      console.log('[JoinTab] Join request deleted:', id);
    } catch (error: any) {
      console.error('[JoinTab] Failed to delete join request:', error);
      setDeleteError(error.message || 'Failed to delete join request');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        <span className="ml-3 text-slate-400">Loading join requests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-red-400 font-medium">Failed to load join requests</h3>
          </div>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-300 rounded-lg text-sm transition-colors"
          >
            Retry
          </button>
        </div>
        <p className="mt-2 text-sm text-red-300">{error}</p>
        {error.includes('not yet implemented') && (
          <p className="mt-3 text-xs text-slate-400">
            The /api/join-requests endpoint needs to be created in the backend.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error messages */}
      {updateError && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-sm text-red-300">
          {updateError}
        </div>
      )}
      {deleteError && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-sm text-red-300">
          {deleteError}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-50">
          Join Requests ({joinRequests.length})
        </h2>
        <button
          onClick={onRefresh}
          className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {joinRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No join requests found
                  </td>
                </tr>
              ) : (
                joinRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="px-4 py-3 text-slate-200">{request.name}</td>
                    <td className="px-4 py-3 text-slate-300">{request.email}</td>
                    <td className="px-4 py-3 text-slate-400">{request.role || '—'}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {request.status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(request.id)}
                            disabled={updating === request.id}
                            className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors disabled:opacity-50"
                            title="Approve"
                          >
                            {updating === request.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle className="h-3 w-3" />
                            )}
                          </button>
                        )}
                        {request.status !== 'rejected' && (
                          <button
                            onClick={() => handleReject(request.id)}
                            disabled={updating === request.id}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors disabled:opacity-50"
                            title="Reject"
                          >
                            {updating === request.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(request.id, request.name)}
                          disabled={deleting === request.id}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors disabled:opacity-50"
                        >
                          {deleting === request.id ? (
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
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
    approved: 'bg-green-900/30 text-green-400 border-green-800',
    rejected: 'bg-red-900/30 text-red-400 border-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs border ${colors[status as keyof typeof colors] || 'bg-slate-800 text-slate-400'}`}>
      {status}
    </span>
  );
}
