import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import {
    Building2, CalendarDays, Clock, DollarSign,
    TrendingUp, CheckCircle2, XCircle, ArrowRight
} from 'lucide-react';

const formatCurrency = (val) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val ?? 0);

const STATUS_CONFIG = {
    pending:   { cls: 'badge-pending',   icon: Clock,         label: 'Pending' },
    confirmed: { cls: 'badge-confirmed', icon: CheckCircle2,  label: 'Confirmed' },
    cancelled: { cls: 'badge-cancelled', icon: XCircle,       label: 'Cancelled' },
    completed: { cls: 'badge-completed', icon: TrendingUp,    label: 'Completed' },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    const Icon = cfg.icon;
    return (
        <span className={`badge ${cfg.cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon size={10}/>
            {cfg.label}
        </span>
    );
}

export default function Dashboard({ stats, recent_bookings, courts }) {
    return (
        <AppLayout title="Dashboard" subtitle="Welcome back! Here's your padel overview.">

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card purple">
                    <div className="stat-icon purple">
                        <Building2 size={22} color="#818cf8"/>
                    </div>
                    <div className="stat-value">{stats.total_courts}</div>
                    <div className="stat-label">Total Courts</div>
                    <div className="stat-change" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={11}/> {stats.available_courts} available
                    </div>
                </div>

                <div className="stat-card green">
                    <div className="stat-icon green">
                        <CalendarDays size={22} color="#10b981"/>
                    </div>
                    <div className="stat-value">{stats.total_bookings}</div>
                    <div className="stat-label">Total Bookings</div>
                    <div className="stat-change" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <TrendingUp size={11}/> {stats.today_bookings} today
                    </div>
                </div>

                <div className="stat-card amber">
                    <div className="stat-icon amber">
                        <Clock size={22} color="#f59e0b"/>
                    </div>
                    <div className="stat-value">{stats.pending}</div>
                    <div className="stat-label">Pending</div>
                    <div className="stat-change" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={11}/> {stats.confirmed} confirmed
                    </div>
                </div>

                <div className="stat-card blue">
                    <div className="stat-icon blue">
                        <DollarSign size={22} color="#60a5fa"/>
                    </div>
                    <div className="stat-value" style={{ fontSize: 20 }}>
                        {formatCurrency(stats.month_revenue)}
                    </div>
                    <div className="stat-label">This Month Revenue</div>
                    <div className="stat-change" style={{ color: '#60a5fa', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <TrendingUp size={11}/> All time: {formatCurrency(stats.total_revenue)}
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid-2-col">
                {/* Recent Bookings */}
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Recent Bookings</div>
                            <div className="card-subtitle">Latest 5 reservations</div>
                        </div>
                        <Link href="/bookings" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            View All <ArrowRight size={13}/>
                        </Link>
                    </div>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Court</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_bookings.length === 0 ? (
                                    <tr><td colSpan={4}>
                                        <div className="empty-state">
                                            <CalendarDays size={36} style={{ opacity: 0.3, margin: '0 auto 12px' }}/>
                                            <div className="empty-state-title">No bookings yet</div>
                                        </div>
                                    </td></tr>
                                ) : recent_bookings.map(b => (
                                    <tr key={b.id}>
                                        <td>
                                            <div className="td-primary">{b.customer_name}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.customer_phone}</div>
                                        </td>
                                        <td>{b.court?.name}</td>
                                        <td>
                                            <div style={{ fontSize: 12 }}>
                                                {new Date(b.booking_date).toLocaleDateString('id-ID')}
                                            </div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                                {b.start_time?.slice(0,5)} – {b.end_time?.slice(0,5)}
                                            </div>
                                        </td>
                                        <td><StatusBadge status={b.status}/></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Courts Overview */}
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Courts Overview</div>
                            <div className="card-subtitle">Active bookings per court</div>
                        </div>
                        <Link href="/courts" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            Manage <ArrowRight size={13}/>
                        </Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {courts.map(c => (
                            <div key={c.id} style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '12px 14px', background: 'var(--bg-elevated)',
                                borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                            }}>
                                <div style={{
                                    width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                                    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(16,185,129,0.1))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Building2 size={16} color="#818cf8"/>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {c.name}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.type} · {c.surface}</div>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary-light)' }}>
                                        {c.active_bookings_count}
                                    </div>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>active</div>
                                </div>
                                <span className={`badge badge-${c.is_available ? 'available' : 'unavailable'}`}>
                                    {c.is_available ? 'Open' : 'Closed'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
