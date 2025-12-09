/**
 * Modern Admin Dashboard with Sidebar
 * 
 * Features:
 * - Sidebar navigation
 * - Password authentication (ispora2025)
 * - Modern dark theme
 * - Responsive design
 */

import React, { useState, useEffect } from 'react';
import { fetchJson } from '../../src/utils/fetchJson';
import type {
  DashboardStats,
  Registration,
  BlogPost,
  Event,
  Partner,
  JoinRequest,
  DashboardStatsResponse,
  BlogPostsResponse,
  EventsResponse,
} from '../../src/types/admin';
import { AdminLogin } from './AdminLogin';
import { OverviewTab } from './tabs/OverviewTab';
import { RegistrationsTab } from './tabs/RegistrationsTab';
import { BlogTab } from './tabs/BlogTab';
import { EventsTab } from './tabs/EventsTab';
import { PartnersTab } from './tabs/PartnersTab';
import { JoinTab } from './tabs/JoinTab';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Handshake,
  UserPlus,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

type TabId = 'overview' | 'registrations' | 'blog' | 'events' | 'partners' | 'join';

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: 'registrations', label: 'Registrations', icon: <Users className="h-5 w-5" /> },
  { id: 'blog', label: 'Blog Posts', icon: <FileText className="h-5 w-5" /> },
  { id: 'events', label: 'Events', icon: <Calendar className="h-5 w-5" /> },
  { id: 'partners', label: 'Partners', icon: <Handshake className="h-5 w-5" /> },
  { id: 'join', label: 'Join Requests', icon: <UserPlus className="h-5 w-5" /> },
];

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  // Stats state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Registrations state
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [registrationsError, setRegistrationsError] = useState<string | null>(null);

  // Blog posts state
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);

  // Events state
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // Partners state
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(false);
  const [partnersError, setPartnersError] = useState<string | null>(null);

  // Join requests state
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    const loginTime = localStorage.getItem('adminLoginTime');

    if (adminAuth === 'true' && loginTime) {
      const loginDate = new Date(loginTime);
      const now = new Date();
      const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminLoginTime');
      }
    }
  }, []);

  // Load stats and registrations on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadRegistrations();
    }
  }, [isAuthenticated]);

  // Lazy load data when tabs are activated
  useEffect(() => {
    if (!isAuthenticated) return;

    if (activeTab === 'blog' && posts.length === 0 && !postsLoading && !postsError) {
      loadBlogPosts();
    }
    if (activeTab === 'events' && events.length === 0 && !eventsLoading && !eventsError) {
      loadEvents();
    }
    if (activeTab === 'partners' && partners.length === 0 && !partnersLoading && !partnersError) {
      loadPartners();
    }
    if (activeTab === 'join' && joinRequests.length === 0 && !joinLoading && !joinError) {
      loadJoinRequests();
    }
  }, [activeTab, isAuthenticated]);

  // Load dashboard stats
  const loadStats = async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const data = await fetchJson<DashboardStatsResponse>('/api/dashboard/stats');
      setStats({
        totalRegistrations: data.totalRegistrations,
        todayRegistrations: data.todayRegistrations,
        thisWeekRegistrations: data.thisWeekRegistrations || 0,
        thisMonthRegistrations: data.thisMonthRegistrations || 0,
        topCountries: data.topCountries || [],
        recentActivity: data.recentActivity || [],
      });
    } catch (err: any) {
      console.error('[AdminDashboard] Failed to load stats:', err);
      setStatsError(err.message || 'Failed to load dashboard stats');
    } finally {
      setStatsLoading(false);
    }
  };

  // Load registrations
  const loadRegistrations = async () => {
    setRegistrationsLoading(true);
    setRegistrationsError(null);
    try {
      const data = await fetchJson<{ registrations: Registration[] }>('/api/registrations');
      setRegistrations(data.registrations || []);
    } catch (err: any) {
      console.error('[AdminDashboard] Failed to load registrations:', err);
      setRegistrationsError(err.message || 'Failed to load registrations');
    } finally {
      setRegistrationsLoading(false);
    }
  };

  // Load blog posts
  const loadBlogPosts = async () => {
    setPostsLoading(true);
    setPostsError(null);
    try {
      const data = await fetchJson<BlogPostsResponse>('/api/blog-posts');
      setPosts(data.posts || []);
    } catch (err: any) {
      console.error('[AdminDashboard] Failed to load blog posts:', err);
      setPostsError(err.message || 'Failed to load blog posts');
    } finally {
      setPostsLoading(false);
    }
  };

  // Load events
  const loadEvents = async () => {
    setEventsLoading(true);
    setEventsError(null);
    try {
      const data = await fetchJson<EventsResponse>('/api/events');
      setEvents(data.events || []);
    } catch (err: any) {
      console.error('[AdminDashboard] Failed to load events:', err);
      setEventsError(err.message || 'Failed to load events');
    } finally {
      setEventsLoading(false);
    }
  };

  // Load partners
  const loadPartners = async () => {
    setPartnersLoading(true);
    setPartnersError(null);
    try {
      const data = await fetchJson<{ partners: Partner[] }>('/api/partners');
      setPartners(data.partners || []);
    } catch (err: any) {
      console.error('[AdminDashboard] Failed to load partners:', err);
      setPartnersError(err.message || 'Failed to load partners');
    } finally {
      setPartnersLoading(false);
    }
  };

  // Load join requests
  const loadJoinRequests = async () => {
    setJoinLoading(true);
    setJoinError(null);
    try {
      const data = await fetchJson<{ joinRequests: JoinRequest[] }>('/api/join-requests');
      setJoinRequests(data.joinRequests || []);
    } catch (err: any) {
      console.error('[AdminDashboard] Failed to load join requests:', err);
      setJoinError(err.message || 'Failed to load join requests');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    setIsAuthenticated(false);
    setActiveTab('overview');
  };

  const handleRefresh = () => {
    if (activeTab === 'overview') {
      loadStats();
      loadRegistrations();
    } else if (activeTab === 'registrations') {
      loadRegistrations();
    } else if (activeTab === 'blog') {
      loadBlogPosts();
    } else if (activeTab === 'events') {
      loadEvents();
    } else if (activeTab === 'partners') {
      loadPartners();
    } else if (activeTab === 'join') {
      loadJoinRequests();
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-slate-800 border-r border-slate-700 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">iSpora Admin</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-white transition-colors lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold text-white">
              {navItems.find((item) => item.id === activeTab)?.label || 'Dashboard'}
            </h2>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <OverviewTab
              stats={stats}
              statsLoading={statsLoading}
              statsError={statsError}
              registrations={registrations}
            />
          )}

          {activeTab === 'registrations' && (
            <RegistrationsTab
              registrations={registrations}
              setRegistrations={setRegistrations}
              loading={registrationsLoading}
              error={registrationsError}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'blog' && (
            <BlogTab
              posts={posts}
              setPosts={setPosts}
              loading={postsLoading}
              error={postsError}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'events' && (
            <EventsTab
              events={events}
              setEvents={setEvents}
              loading={eventsLoading}
              error={eventsError}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'partners' && (
            <PartnersTab
              partners={partners}
              setPartners={setPartners}
              loading={partnersLoading}
              error={partnersError}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'join' && (
            <JoinTab
              joinRequests={joinRequests}
              setJoinRequests={setJoinRequests}
              loading={joinLoading}
              error={joinError}
              onRefresh={handleRefresh}
            />
          )}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
