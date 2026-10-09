import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    LayoutDashboard, Building2, CalendarDays,
    Settings, LogOut, ChevronRight, Bell, X, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function AppLayout({ children, title = '', subtitle = '' }) {
    const { auth, flash } = usePage().props;
    const [flashMsg, setFlashMsg] = useState(null);
    const url = usePage().url;

    useEffect(() => {
        if (flash?.success) {
            setFlashMsg({ type: 'success', msg: flash.success });
            const t = setTimeout(() => setFlashMsg(null), 3500);
            return () => clearTimeout(t);
        }
        if (flash?.error) {
            setFlashMsg({ type: 'error', msg: flash.error });
            const t = setTimeout(() => setFlashMsg(null), 3500);
            return () => clearTimeout(t);
        }
    }, [flash]);

    const isActive = (path) => url.startsWith(path);

    const handleLogout = () => router.post(route('logout'));

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/courts',    label: 'Courts',    icon: Building2 },
        { href: '/bookings',  label: 'Bookings',  icon: CalendarDays },
    ];

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                            <path d="M2 12h20"/>
                        </svg>
                    </div>
                    <div className="sidebar-logo-text">
                        <h1>PadelSpace</h1>
                        <span>Management Platform</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section-label">MENU</div>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-link ${active ? 'active' : ''}`}
                            >
                                <Icon size={16} className="nav-icon" style={{ width: 20, flexShrink: 0 }}/>
                                <span style={{ flex: 1 }}>{item.label}</span>
                                {active && <ChevronRight size={14} style={{ opacity: 0.5 }}/>}
                            </Link>
                        );
                    })}

                    <div className="nav-section-label" style={{ marginTop: 16 }}>ACCOUNT</div>
                    <Link
                        href="/profile"
                        className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                    >
                        <Settings size={16} style={{ width: 20, flexShrink: 0 }}/>
                        <span style={{ flex: 1 }}>Settings</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="nav-link"
                        style={{ color: '#ef4444', width: '100%', textAlign: 'left' }}
                    >
                        <LogOut size={16} style={{ width: 20, flexShrink: 0 }}/>
                        <span style={{ flex: 1 }}>Logout</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-card">
                        <div className="user-avatar">
                            {auth?.user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
                        </div>
                        <div className="user-info">
                            <div className="user-name">{auth?.user?.name}</div>
                            <div className="user-role">Administrator</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="main-content">
                {/* Top bar */}
                <div className="top-bar">
                    <div className="page-title">
                        <h2>{title}</h2>
                        {subtitle && <p>{subtitle}</p>}
                    </div>
                    <div className="top-bar-actions">
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CalendarDays size={13}/>
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <button style={{
                            width: 34, height: 34, borderRadius: 8,
                            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'var(--text-muted)',
                        }}>
                            <Bell size={15}/>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="page-body">{children}</div>
            </div>

            {/* Flash */}
            {flashMsg && (
                <div className={`flash-message flash-${flashMsg.type}`}>
                    {flashMsg.type === 'success'
                        ? <CheckCircle2 size={18}/>
                        : <AlertCircle size={18}/>
                    }
                    <span style={{ flex: 1 }}>{flashMsg.msg}</span>
                    <button
                        onClick={() => setFlashMsg(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }}
                    >
                        <X size={15}/>
                    </button>
                </div>
            )}
        </div>
    );
}
