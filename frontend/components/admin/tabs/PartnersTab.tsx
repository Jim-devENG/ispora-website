import React, { useState } from 'react';
import type { Partner } from '../../../src/types/admin';
import { Loader2, AlertCircle, RefreshCw, Trash2, CheckCircle, XCircle, Download, ChevronDown, ChevronUp, Phone, Mail, Globe, Building, Briefcase, Link as LinkIcon, Target, FileText, MessageSquare, MapPin, Linkedin } from 'lucide-react';
import { apiClient } from '../../../src/lib/apiClient';
import { exportPartnersToCSV } from '../../../src/utils/exportToCSV';

interface PartnersTabProps {
  partners: Partner[];
  setPartners: React.Dispatch<React.SetStateAction<Partner[]>>;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function PartnersTab({ partners, setPartners, loading, error, onRefresh }: PartnersTabProps) {
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleApprove = async (id: string) => {
    setUpdating(id);
    setUpdateError(null);

    try {
      const response = await apiClient.patch<Partner>(
        `/api/partners/${id}`,
        { status: 'approved' }
      );
      setPartners(partners.map(p => p.id === id ? response : p));
      console.log('[PartnersTab] Partner approved:', id);
    } catch (error: any) {
      console.error('[PartnersTab] Failed to approve partner:', error);
      setUpdateError(error.message || 'Failed to approve partner');
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = async (id: string) => {
    setUpdating(id);
    setUpdateError(null);

    try {
      const response = await apiClient.patch<Partner>(
        `/api/partners/${id}`,
        { status: 'rejected' }
      );
      setPartners(partners.map(p => p.id === id ? response : p));
      console.log('[PartnersTab] Partner rejected:', id);
    } catch (error: any) {
      console.error('[PartnersTab] Failed to reject partner:', error);
      setUpdateError(error.message || 'Failed to reject partner');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete partner submission for "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(id);
    setDeleteError(null);

    try {
      await apiClient.del(`/api/partners/${id}`);
      setPartners(partners.filter(p => p.id !== id));
      console.log('[PartnersTab] Partner deleted:', id);
    } catch (error: any) {
      console.error('[PartnersTab] Failed to delete partner:', error);
      setDeleteError(error.message || 'Failed to delete partner');
    } finally {
      setDeleting(null);
    }
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
        <span className="ml-3 text-slate-400">Loading partners...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-red-400 font-medium">Failed to load partners</h3>
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
          Partners ({partners.length})
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportPartnersToCSV(partners)}
            disabled={partners.length === 0}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
            title="Download as CSV"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
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
                <th className="px-4 py-3 text-left font-medium w-8"></th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Organization</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Country</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {partners.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    No partners found
                  </td>
                </tr>
              ) : (
                partners.map((partner) => {
                  const isExpanded = expandedRows.has(partner.id);
                  // Map snake_case from API to camelCase for display
                  const mappedPartner = {
                    ...partner,
                    fullName: partner.fullName || partner.full_name || partner.name,
                    orgName: partner.orgName || partner.org_name || partner.organization,
                    orgType: partner.orgType || partner.org_type,
                    role: partner.role,
                    phone: partner.phone,
                    linkedin: partner.linkedin,
                    country: partner.country,
                    orgWebsite: partner.orgWebsite || partner.org_website,
                    orgSocialMedia: partner.orgSocialMedia || partner.org_social_media,
                    partnershipFocus: partner.partnershipFocus || partner.partnership_focus || [],
                    otherFocus: partner.otherFocus || partner.other_focus,
                    aboutWork: partner.aboutWork || partner.about_work,
                    whyPartner: partner.whyPartner || partner.why_partner,
                    howContribute: partner.howContribute || partner.how_contribute,
                    whatExpect: partner.whatExpect || partner.what_expect,
                    additionalNotes: partner.additionalNotes || partner.additional_notes
                  };
                  return (
                    <React.Fragment key={partner.id}>
                      <tr className="hover:bg-slate-900/60 transition-colors">
                        <td className="px-2 py-3">
                          <button
                            onClick={() => toggleRow(partner.id)}
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
                        <td className="px-4 py-3 text-slate-200">
                          {mappedPartner.fullName || '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {mappedPartner.orgName || '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-300">{partner.email}</td>
                        <td className="px-4 py-3 text-slate-400">{mappedPartner.country || '—'}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={partner.status} />
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {new Date(partner.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {partner.status !== 'approved' && (
                              <button
                                onClick={() => handleApprove(partner.id)}
                                disabled={updating === partner.id}
                                className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors disabled:opacity-50"
                                title="Approve"
                              >
                                {updating === partner.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-3 w-3" />
                                )}
                              </button>
                            )}
                            {partner.status !== 'rejected' && (
                              <button
                                onClick={() => handleReject(partner.id)}
                                disabled={updating === partner.id}
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors disabled:opacity-50"
                                title="Reject"
                              >
                                {updating === partner.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <XCircle className="h-3 w-3" />
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(partner.id, mappedPartner.fullName || 'Unknown')}
                              disabled={deleting === partner.id}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors disabled:opacity-50"
                            >
                              {deleting === partner.id ? (
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
                          <td colSpan={8} className="px-4 py-4 bg-slate-900/40">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              {/* Contact Information */}
                              <div className="space-y-2">
                                <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                                  <Mail className="h-4 w-4" /> Contact Information
                                </h4>
                                {mappedPartner.phone && (
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <Phone className="h-3 w-3 text-slate-400" />
                                    <span>Phone: {mappedPartner.phone}</span>
                                  </div>
                                )}
                                {mappedPartner.country && (
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <MapPin className="h-3 w-3 text-slate-400" />
                                    <span>Country: {mappedPartner.country}</span>
                                  </div>
                                )}
                                {mappedPartner.linkedin && (
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <Linkedin className="h-3 w-3 text-slate-400" />
                                    <a href={mappedPartner.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                                      LinkedIn Profile
                                    </a>
                                  </div>
                                )}
                              </div>

                              {/* Organization Information */}
                              <div className="space-y-2">
                                <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                                  <Building className="h-4 w-4" /> Organization Details
                                </h4>
                                {mappedPartner.orgType && (
                                  <div className="text-slate-300">
                                    <span className="text-slate-400">Organization Type:</span> {mappedPartner.orgType}
                                  </div>
                                )}
                                {mappedPartner.role && (
                                  <div className="text-slate-300">
                                    <span className="text-slate-400">Role:</span> {mappedPartner.role}
                                  </div>
                                )}
                                {mappedPartner.orgWebsite && (
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <LinkIcon className="h-3 w-3 text-slate-400" />
                                    <a href={mappedPartner.orgWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                                      Website
                                    </a>
                                  </div>
                                )}
                                {mappedPartner.orgSocialMedia && (
                                  <div className="text-slate-300">
                                    <span className="text-slate-400">Social Media:</span> {mappedPartner.orgSocialMedia}
                                  </div>
                                )}
                              </div>

                              {/* Partnership Focus */}
                              {(mappedPartner.partnershipFocus?.length > 0 || mappedPartner.otherFocus) && (
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                                    <Target className="h-4 w-4" /> Partnership Focus
                                  </h4>
                                  {mappedPartner.partnershipFocus && mappedPartner.partnershipFocus.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {mappedPartner.partnershipFocus.map((focus: string, idx: number) => (
                                        <span key={idx} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">
                                          {focus}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  {mappedPartner.otherFocus && (
                                    <div className="text-slate-300">
                                      <span className="text-slate-400">Other Focus:</span> {mappedPartner.otherFocus}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Partnership Details */}
                              <div className="space-y-2">
                                <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4" /> Partnership Details
                                </h4>
                                {mappedPartner.aboutWork && (
                                  <div className="text-slate-300 mb-3">
                                    <span className="text-slate-400 font-medium">About Your Work:</span>
                                    <p className="mt-1 text-slate-400 italic">{mappedPartner.aboutWork}</p>
                                  </div>
                                )}
                                {mappedPartner.whyPartner && (
                                  <div className="text-slate-300 mb-3">
                                    <span className="text-slate-400 font-medium">Why Partner:</span>
                                    <p className="mt-1 text-slate-400 italic">{mappedPartner.whyPartner}</p>
                                  </div>
                                )}
                                {mappedPartner.howContribute && (
                                  <div className="text-slate-300 mb-3">
                                    <span className="text-slate-400 font-medium">How You Can Contribute:</span>
                                    <p className="mt-1 text-slate-400 italic">{mappedPartner.howContribute}</p>
                                  </div>
                                )}
                                {mappedPartner.whatExpect && (
                                  <div className="text-slate-300 mb-3">
                                    <span className="text-slate-400 font-medium">What You Expect:</span>
                                    <p className="mt-1 text-slate-400 italic">{mappedPartner.whatExpect}</p>
                                  </div>
                                )}
                                {mappedPartner.additionalNotes && (
                                  <div className="text-slate-300">
                                    <span className="text-slate-400 font-medium">Additional Notes:</span>
                                    <p className="mt-1 text-slate-400 italic">{mappedPartner.additionalNotes}</p>
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
    approved: 'bg-green-900/30 text-green-400 border-green-800',
    rejected: 'bg-red-900/30 text-red-400 border-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs border ${colors[status as keyof typeof colors] || 'bg-slate-800 text-slate-400'}`}>
      {status}
    </span>
  );
}
