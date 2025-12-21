import React, { useState } from 'react';
import type { Registration } from '../../../src/types/admin';
import { Loader2, AlertCircle, RefreshCw, Trash2, CheckCircle, ChevronDown, ChevronUp, MapPin, Phone, Mail, Globe, Briefcase, GraduationCap, Heart, MessageSquare } from 'lucide-react';
import { apiClient } from '../../../src/lib/apiClient';

interface RegistrationsTabProps {
  registrations: Registration[];
  setRegistrations: React.Dispatch<React.SetStateAction<Registration[]>>;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function RegistrationsTab({ registrations, setRegistrations, loading, error, onRefresh }: RegistrationsTabProps) {
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleStatusUpdate = async (id: string, newStatus: 'pending' | 'verified' | 'active') => {
    setUpdating(id);
    setUpdateError(null);

    try {
      const response = await apiClient.patch<{ registration: Registration }>(
        `/api/registrations/${id}`,
        { status: newStatus }
      );
      setRegistrations(registrations.map(r => r.id === id ? response.registration : r));
      console.log('[RegistrationsTab] Status updated:', id, newStatus);
    } catch (error: any) {
      console.error('[RegistrationsTab] Failed to update status:', error);
      setUpdateError(error.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete registration for "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(id);
    setDeleteError(null);

    try {
      await apiClient.del(`/api/registrations/${id}`);
      setRegistrations(registrations.filter(r => r.id !== id));
      console.log('[RegistrationsTab] Registration deleted:', id);
    } catch (error: any) {
      console.error('[RegistrationsTab] Failed to delete registration:', error);
      setDeleteError(error.message || 'Failed to delete registration');
    } finally {
      setDeleting(null);
    }
  };

  const getNextStatus = (currentStatus: string): 'pending' | 'verified' | 'active' | null => {
    if (currentStatus === 'pending') return 'verified';
    if (currentStatus === 'verified') return 'active';
    return null;
  };

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        <span className="ml-3 text-slate-400">Loading registrations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-red-400 font-medium">Failed to load registrations</h3>
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
          Registrations ({registrations.length})
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
                <th className="px-4 py-3 text-left font-medium w-8"></th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Country (Residence)</th>
                <th className="px-4 py-3 text-left font-medium">Country (Origin)</th>
                <th className="px-4 py-3 text-left font-medium">Group</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                    No registrations found
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => {
                  const nextStatus = getNextStatus(reg.status);
                  const isExpanded = expandedRows.has(reg.id);
                  const location = reg.location || {};
                  
                  return (
                    <React.Fragment key={reg.id}>
                      <tr className="hover:bg-slate-900/60 transition-colors">
                        <td className="px-2 py-3">
                          <button
                            onClick={() => toggleRow(reg.id)}
                            className="text-slate-400 hover:text-slate-200 transition-colors"
                            title={isExpanded ? 'Collapse details' : 'Expand details'}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-slate-200">{reg.name}</td>
                        <td className="px-4 py-3 text-slate-300">{reg.email}</td>
                        <td className="px-4 py-3 text-slate-300">{reg.countryOfResidence}</td>
                        <td className="px-4 py-3 text-slate-300">{reg.countryOfOrigin}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">
                            {reg.group}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={reg.status} />
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {new Date(reg.createdAt || reg.created_at || '').toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {nextStatus && (
                              <button
                                onClick={() => handleStatusUpdate(reg.id, nextStatus)}
                                disabled={updating === reg.id}
                                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs transition-colors disabled:opacity-50 flex items-center"
                                title={`Set status to ${nextStatus}`}
                              >
                                {updating === reg.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-3 w-3" />
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(reg.id, reg.name)}
                              disabled={deleting === reg.id}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors disabled:opacity-50"
                            >
                              {deleting === reg.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={9} className="px-4 py-4 bg-slate-900/40">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              {/* Contact Information */}
                              <div className="space-y-2">
                                <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                                  <Mail className="h-4 w-4" /> Contact Information
                                </h4>
                                {reg.whatsapp && (
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <Phone className="h-3 w-3 text-slate-400" />
                                    <span>WhatsApp: {reg.whatsapp}</span>
                                  </div>
                                )}
                                {location.city && (
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <MapPin className="h-3 w-3 text-slate-400" />
                                    <span>{location.city}{location.country ? `, ${location.country}` : ''}</span>
                                  </div>
                                )}
                                {location.linkedin && (
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <Globe className="h-3 w-3 text-slate-400" />
                                    <a href={location.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                                      LinkedIn Profile
                                    </a>
                                  </div>
                                )}
                              </div>

                              {/* Professional Information */}
                              <div className="space-y-2">
                                <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                                  <Briefcase className="h-4 w-4" /> Professional Information
                                </h4>
                                {location.currentWork && (
                                  <div className="text-slate-300">
                                    <span className="text-slate-400">Current Work:</span> {location.currentWork}
                                  </div>
                                )}
                                {location.fieldOfStudy && (
                                  <div className="text-slate-300">
                                    <span className="text-slate-400">Field of Study:</span> {location.fieldOfStudy}
                                  </div>
                                )}
                                {location.background && (
                                  <div className="text-slate-300">
                                    <span className="text-slate-400">Background:</span> {location.background}
                                  </div>
                                )}
                                {location.contributeInterest && (
                                  <div className="text-slate-300">
                                    <span className="text-slate-400">Contribution Interest:</span> {location.contributeInterest}
                                  </div>
                                )}
                              </div>

                              {/* Interests & Areas */}
                              {(location.areasOfInterest?.length > 0 || location.interests?.length > 0) && (
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                                    <Heart className="h-4 w-4" /> Areas of Interest
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {(location.areasOfInterest || location.interests || []).map((interest, idx) => (
                                      <span key={idx} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">
                                        {interest}
                                      </span>
                                    ))}
                                  </div>
                                  {location.otherInterest && (
                                    <div className="text-slate-300 mt-2">
                                      <span className="text-slate-400">Other:</span> {location.otherInterest}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Additional Details */}
                              <div className="space-y-2">
                                <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4" /> Additional Details
                                </h4>
                                {location.state && (
                                  <div className="text-slate-300">
                                    <span className="text-slate-400">State/Region:</span> {location.state}
                                  </div>
                                )}
                                {location.ageRange && (
                                  <div className="text-slate-300">
                                    <span className="text-slate-400">Age Range:</span> {location.ageRange}
                                  </div>
                                )}
                                {location.expectations && (
                                  <div className="text-slate-300">
                                    <span className="text-slate-400">Expectations:</span>
                                    <p className="mt-1 text-slate-400 italic">{location.expectations}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
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
    verified: 'bg-green-900/30 text-green-400 border-green-800',
    active: 'bg-blue-900/30 text-blue-400 border-blue-800',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs border ${colors[status as keyof typeof colors] || 'bg-slate-800 text-slate-400'}`}>
      {status}
    </span>
  );
}
