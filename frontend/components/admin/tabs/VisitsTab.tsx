import React, { useState } from 'react';
import { Loader2, AlertCircle, RefreshCw, Download, Eye, Globe, MapPin, Monitor, Clock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchJson } from '../../../src/utils/fetchJson';

interface Visit {
  id: string;
  ip_address: string | null;
  page: string | null;
  referrer: string | null;
  user_agent: string | null;
  location: {
    country?: string;
    city?: string;
    region?: string;
    timezone?: string;
    latitude?: number;
    longitude?: number;
  } | null;
  country: string | null;
  city: string | null;
  region: string | null;
  timezone: string | null;
  created_at: string;
}

interface VisitsTabProps {
  visits: Visit[];
  setVisits: React.Dispatch<React.SetStateAction<Visit[]>>;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function VisitsTab({ visits, setVisits, loading, error, onRefresh }: VisitsTabProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getFilteredVisits = () => {
    if (filter === 'all') return visits;
    
    const now = new Date();
    const filterDate = new Date();
    
    if (filter === 'today') {
      filterDate.setHours(0, 0, 0, 0);
    } else if (filter === 'week') {
      filterDate.setDate(now.getDate() - 7);
    } else if (filter === 'month') {
      filterDate.setMonth(now.getMonth() - 1);
    }
    
    return visits.filter(visit => {
      const visitDate = new Date(visit.created_at);
      return visitDate >= filterDate;
    });
  };

  const exportToCSV = () => {
    const filtered = getFilteredVisits();
    const headers = ['Date', 'Page', 'Country', 'City', 'IP Address', 'Referrer', 'User Agent'];
    const rows = filtered.map(visit => [
      new Date(visit.created_at).toLocaleString(),
      visit.page || 'Unknown',
      visit.country || visit.location?.country || 'Unknown',
      visit.city || visit.location?.city || 'Unknown',
      visit.ip_address || 'Unknown',
      visit.referrer || 'Direct',
      visit.user_agent || 'Unknown',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `visits-${filter}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        <span className="ml-3 text-slate-400">Loading visits...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-red-400 font-medium">Failed to load visits</h3>
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

  const filteredVisits = getFilteredVisits();

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-slate-400" />
          <h2 className="text-xl font-semibold text-slate-50">
            Website Visits ({filteredVisits.length.toLocaleString()})
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Filter Buttons */}
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('today')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filter === 'today'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filter === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setFilter('month')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filter === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Month
            </button>
          </div>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Visits Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Referrer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-12">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    No visits found
                  </td>
                </tr>
              ) : (
                filteredVisits.map((visit) => {
                  const isExpanded = expandedRows.has(visit.id);
                  const location = visit.country || visit.location?.country || 'Unknown';
                  const city = visit.city || visit.location?.city;
                  const displayLocation = city ? `${city}, ${location}` : location;

                  return (
                    <React.Fragment key={visit.id}>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 text-sm text-slate-300">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-500" />
                            {new Date(visit.created_at).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-200">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-slate-500" />
                            <span className="font-medium">{visit.page || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-500" />
                            {displayLocation}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-400 font-mono">
                          {visit.ip_address || 'Unknown'}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-400">
                          {visit.referrer ? (
                            <a
                              href={visit.referrer}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                              {new URL(visit.referrer).hostname}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-slate-500">Direct</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleRow(visit.id)}
                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="px-4 py-4 bg-slate-800/30">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <h4 className="text-slate-400 font-medium mb-2">Location Details</h4>
                                <div className="space-y-1 text-slate-300">
                                  {visit.location?.country && (
                                    <div className="flex items-center gap-2">
                                      <Globe className="h-4 w-4 text-slate-500" />
                                      <span>Country: {visit.location.country}</span>
                                    </div>
                                  )}
                                  {visit.location?.city && (
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-slate-500" />
                                      <span>City: {visit.location.city}</span>
                                    </div>
                                  )}
                                  {visit.location?.region && (
                                    <div className="flex items-center gap-2">
                                      <span>Region: {visit.location.region}</span>
                                    </div>
                                  )}
                                  {visit.location?.timezone && (
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-slate-500" />
                                      <span>Timezone: {visit.location.timezone}</span>
                                    </div>
                                  )}
                                  {visit.location?.latitude && visit.location?.longitude && (
                                    <div className="flex items-center gap-2">
                                      <span>
                                        Coordinates: {visit.location.latitude.toFixed(4)}, {visit.location.longitude.toFixed(4)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-slate-400 font-medium mb-2">Technical Details</h4>
                                <div className="space-y-1 text-slate-300">
                                  <div>
                                    <span className="text-slate-400">User Agent:</span>
                                    <p className="text-xs font-mono mt-1 break-all">{visit.user_agent || 'Unknown'}</p>
                                  </div>
                                  {visit.referrer && (
                                    <div>
                                      <span className="text-slate-400">Full Referrer:</span>
                                      <p className="text-xs break-all mt-1">{visit.referrer}</p>
                                    </div>
                                  )}
                                </div>
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

