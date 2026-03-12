import React, { useState } from 'react'
import { NavLink, useLocation, Link, Navigate, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, Terminal, Map, Settings, Server,
  Zap, ChevronRight, Activity, BookOpen, MessageSquare,
  Tag, ShoppingBag, LogOut, LogIn, UserPlus, Gift,
  HelpCircle, Layers, ChevronDown, Gamepad2
} from 'lucide-react'
import { AuthProvider, useAuth } from './contexts/AuthContext'

/* ─── Protected Route ─────────────────────────────────────────────────────── */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()
  if (isLoading) return null
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return <>{children}</>
}

import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Console from './pages/Console'
import Maps from './pages/Maps'
import SettingsPage from './pages/Settings'
import Pricing from './pages/Pricing'
import Products from './pages/Products'
import Promo from './pages/Promo'
import Blog from './pages/Blog'
import Docs, { DocsHub, ArticleView } from './pages/Docs'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import Servers from './pages/Servers'
import Support from './pages/Support'
import Guides from './pages/Guides'
import GuideView from './pages/GuideView'

import './index.css'
import './App.css'

/* ─── Nav Structure ───────────────────────────────────────────────────────── */
const NAV_GROUPS = [
  {
    id: 'server',
    label: 'Mon Serveur',
    authOnly: true,
    items: [
      { to: '/servers', icon: Layers, label: 'Mes Serveurs' },
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/console', icon: Terminal, label: 'Console RCON' },
      { to: '/maps', icon: Map, label: 'Maps & Plugins' },
      { to: '/settings', icon: Settings, label: 'Paramètres' },
    ],
  },
  {
    id: 'shop',
    label: 'Boutique',
    authOnly: false,
    items: [
      { to: '/products', icon: ShoppingBag, label: 'Produits' },
      { to: '/pricing', icon: Tag, label: 'Tarifs' },
      { to: '/promotions', icon: Gift, label: 'Promotions' },
    ],
  },
  {
    id: 'community',
    label: 'Ressources',
    authOnly: false,
    items: [
      { to: '/guides', icon: Gamepad2, label: 'Guides TMNF' },
      { to: '/blog', icon: MessageSquare, label: 'Communauté' },
      { to: '/docs', icon: BookOpen, label: 'Documentation' },
      { to: '/support', icon: HelpCircle, label: 'Support' },
    ],
  },
]

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
function Sidebar() {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const toggle = (id: string) => setCollapsed(s => ({ ...s, [id]: !s[id] }))

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
        <div className="sidebar-logo-icon"><Zap size={18} /></div>
        <span className="sidebar-logo-text">TrackHost</span>
      </Link>

      {/* Live server pill (logged in) */}
      {user && (
        <Link to="/servers" style={{ textDecoration: 'none', margin: '0 8px' }}>
          <div className="sidebar-server-card">
            <div className="server-pulse-wrapper">
              <div className="server-pulse-ring" /><div className="server-pulse-dot" />
            </div>
            <div className="sidebar-server-info">
              <span className="sidebar-server-name">My TMNF Server</span>
              <span className="sidebar-server-status">En ligne · 6 joueurs</span>
            </div>
          </div>
        </Link>
      )}

      <div className="divider" style={{ margin: '0 16px 4px' }} />

      {/* Nav groups */}
      <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto' }}>
        {NAV_GROUPS.map(group => {
          if (group.authOnly && !user) return null
          const open = !collapsed[group.id]
          return (
            <div key={group.id} style={{ marginBottom: 4 }}>
              {/* Group header */}
              <button
                onClick={() => toggle(group.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)' }}>
                <span className="sidebar-group-label" style={{ margin: 0, flex: 1, textAlign: 'left' }}>{group.label}</span>
                <ChevronDown size={10} style={{ color: 'var(--text-ghost)', transition: 'transform 200ms', transform: open ? 'rotate(0)' : 'rotate(-90deg)' }} />
              </button>

              {/* Group items */}
              {open && group.items.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <Icon size={14} /><span>{label}</span><ChevronRight size={10} className="sidebar-link-arrow" />
                </NavLink>
              ))}
            </div>
          )
        })}
      </nav>

      <div className="divider" style={{ margin: '4px 16px' }} />

      {/* User / Auth */}
      <div style={{ padding: '4px 8px 8px' }}>
        {user ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4 }}>
              <div className="avatar-circle" style={{ width: 28, height: 28, fontSize: 10, flexShrink: 0 }}>{user.avatar}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: 'var(--text-high)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-low)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
              </div>
            </div>
            <button className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)' }} onClick={logout}>
              <LogOut size={13} /><span>Déconnexion</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <NavLink to="/login" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><LogIn size={13} /><span>Connexion</span></NavLink>
            <NavLink to="/register" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--primary)' }}><UserPlus size={13} /><span>Créer un compte</span></NavLink>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer-item"><Activity size={12} /><span>v1.0.0-beta</span></div>
      </div>
    </aside>
  )
}

/* ─── Top Bar ─────────────────────────────────────────────────────────────── */
const PT: Record<string, string> = {
  '/servers': 'Mes Serveurs', '/dashboard': 'Dashboard', '/console': 'Console RCON',
  '/maps': 'Maps & Plugins', '/settings': 'Paramètres', '/pricing': 'Tarifs',
  '/products': 'Produits', '/promotions': 'Promotions', '/blog': 'Communauté',
  '/docs': 'Documentation', '/support': 'Support', '/guides': 'Guides TMNF',
}

function TopBar() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const base = '/' + pathname.split('/')[1]
  const title = PT[base] ?? 'TrackHost'
  return (
    <header className="topbar">
      <div className="topbar-title">
        <Server size={13} style={{ color: 'var(--text-low)' }} />
        <span className="topbar-breadcrumb">TrackHost</span>
        <ChevronRight size={11} style={{ color: 'var(--text-ghost)' }} />
        <span className="topbar-page">{title}</span>
      </div>
      <div className="topbar-actions">
        {user?.plan && <span className="badge badge-cyan" style={{ textTransform: 'capitalize' }}>{user.plan}</span>}
        <span className="badge badge-green">
          <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'var(--primary)' }} />
          ONLINE
        </span>
        {!user && <Link to="/login" className="btn btn-ghost" style={{ fontSize: 11, padding: '5px 12px' }}>Se connecter</Link>}
        {!user && <Link to="/checkout" className="btn btn-primary" style={{ fontSize: 11, padding: '5px 12px' }}>Commander</Link>}
      </div>
    </header>
  )
}

/* ─── App Shell ───────────────────────────────────────────────────────────── */
function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-col">
        <TopBar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}

import type { RouteRecord } from 'vite-react-ssg'

import { GUIDES } from './pages/Guides'
import { ARTICLES } from './pages/Docs'

import { HelmetProvider } from 'react-helmet-async'

/* ─── Router ──────────────────────────────────────────────────────────────── */
export const routes: RouteRecord[] = [
  {
    path: '/',
    element: (
      <HelmetProvider>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </HelmetProvider>
    ),
    children: [
      /* Full-page (no shell) */
      { index: true, element: <Landing /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'checkout', element: <Checkout /> },

      /* Shell pages */
      { path: 'servers', element: <ProtectedRoute><AppShell><Servers /></AppShell></ProtectedRoute> },
      { path: 'dashboard', element: <ProtectedRoute><AppShell><Dashboard /></AppShell></ProtectedRoute> },
      { path: 'console', element: <ProtectedRoute><AppShell><Console /></AppShell></ProtectedRoute> },
      { path: 'maps', element: <ProtectedRoute><AppShell><Maps /></AppShell></ProtectedRoute> },
      { path: 'settings', element: <ProtectedRoute><AppShell><SettingsPage /></AppShell></ProtectedRoute> },
      { path: 'pricing', element: <AppShell><Pricing /></AppShell> },
      { path: 'products', element: <AppShell><Products /></AppShell> },
      { path: 'promotions', element: <AppShell><Promo /></AppShell> },
      { path: 'blog/*', element: <AppShell><Blog /></AppShell> },
      {
        path: 'docs',
        element: <AppShell><Docs /></AppShell>,
        children: [
          { index: true, element: <DocsHub /> },
          {
            path: ':slug',
            element: <ArticleView />,
            getStaticPaths: () => Object.values(ARTICLES).flat().map(a => 'docs/' + a.slug)
          },
        ]
      },
      { path: 'guides', element: <AppShell><Guides /></AppShell> },
      {
        path: 'guides/:slug',
        element: <AppShell><GuideView /></AppShell>,
        getStaticPaths: () => GUIDES.map(g => 'guides/' + g.slug)
      },
      { path: 'support', element: <AppShell><Support /></AppShell> },

      /* 404 Redirect */
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
]

export default function App() {
  return null
}
