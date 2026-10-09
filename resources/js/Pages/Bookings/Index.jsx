import AppLayout from '@/Layouts/AppLayout';
import CustomSelect from '@/Components/ui/CustomSelect';
import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Plus, Pencil, Trash2, Search, CalendarDays, Clock,
    CheckCircle2, XCircle, TrendingUp, DollarSign, Filter,
    X, Save, Loader2, TriangleAlert, ChevronLeft, ChevronRight,
    Building2, Eye, EyeOff
} from 'lucide-react';

const formatCurrency = (val) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val ?? 0);

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed'];

const STATUS_CONFIG = {
    pending:   { cls: 'badge-pending',   Icon: Clock,        label: 'Pending'   },
    confirmed: { cls: 'badge-confirmed', Icon: CheckCircle2, label: 'Confirmed' },
    cancelled: { cls: 'badge-cancelled', Icon: XCircle,      label: 'Cancelled' },
    completed: { cls: 'badge-completed', Icon: TrendingUp,   label: 'Completed' },
};

/* ── Booking Modal ── */
function BookingModal({ booking, courts, onClose }) {
    const isEdit = !!booking;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        court_id:       booking?.court_id       ?? (courts[0]?.id ?? ''),
        customer_name:  booking?.customer_name  ?? '',
        customer_phone: booking?.customer_phone ?? '',
        customer_email: booking?.customer_email ?? '',
        booking_date:   booking?.booking_date
            ? new Date(booking.booking_date).toISOString().slice(0, 10) : '',
        start_time:     booking?.start_time?.slice(0, 5) ?? '08:00',
        end_time:       booking?.end_time?.slice(0, 5)   ?? '10:00',
        status:         booking?.status ?? 'pending',
        notes:          booking?.notes  ?? '',
    });

    const selectedCourt = courts.find(c => c.id == data.court_id);
    const startH = parseInt(data.start_time?.split(':')[0] ?? 8);
    const endH   = parseInt(data.end_time?.split(':')[0]   ?? 10);
    const hours  = Math.max(0, endH - startH);
    const estimatedPrice = selectedCourt ? selectedCourt.price_per_hour * hours : 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('bookings.update', booking.id), { onSuccess: onClose });
        } else {
            post(route('bookings.store'), { onSuccess: () => { reset(); onClose(); } });
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal" style={{ maxWidth: 620 }}>
                <div className="modal-header">
                    <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CalendarDays size={20} color="var(--primary-light)"/>
                        {isEdit ? 'Edit Booking' : 'New Booking'}
                    </h2>
                    <button className="modal-close" onClick={onClose}><X size={16}/></button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Court */}
                    <div className="form-group">
                        <label className="form-label">Court *</label>
                        <CustomSelect
                            id="booking-court"
                            value={data.court_id}
                            onChange={val => setData('court_id', val)}
                            placeholder="Select Court..."
                            searchable={true}
                            options={courts.map(c => ({
                                value: c.id,
                                label: `${c.name} (${c.type.toUpperCase()})`,
                                sub: `${formatCurrency(c.price_per_hour)}/hr • ${c.surface}`,
                            }))}
                            error={!!errors.court_id}
                        />
                        {errors.court_id && <div className="form-error">{errors.court_id}</div>}
                    </div>

                    {/* Customer */}
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Customer Name *</label>
                            <input id="booking-customer-name" className="form-input" placeholder="Full name"
                                value={data.customer_name} onChange={e => setData('customer_name', e.target.value)}/>
                            {errors.customer_name && <div className="form-error">{errors.customer_name}</div>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone *</label>
                            <input id="booking-phone" className="form-input" placeholder="08xxxxxxxxxx"
                                value={data.customer_phone} onChange={e => setData('customer_phone', e.target.value)}/>
                            {errors.customer_phone && <div className="form-error">{errors.customer_phone}</div>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input id="booking-email" type="email" className="form-input" placeholder="Optional email"
                            value={data.customer_email} onChange={e => setData('customer_email', e.target.value)}/>
                    </div>

                    {/* Schedule */}
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Date *</label>
                            <input id="booking-date" type="date" className="form-input"
                                value={data.booking_date} onChange={e => setData('booking_date', e.target.value)}/>
                            {errors.booking_date && <div className="form-error">{errors.booking_date}</div>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <CustomSelect
                                id="booking-status"
                                value={data.status}
                                onChange={val => setData('status', val)}
                                options={STATUS_OPTIONS.map(s => ({
                                    value: s,
                                    label: STATUS_CONFIG[s]?.label || s,
                                }))}
                            />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Start Time *</label>
                            <input id="booking-start-time" type="time" className="form-input"
                                value={data.start_time} onChange={e => setData('start_time', e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Time *</label>
                            <input id="booking-end-time" type="time" className="form-input"
                                value={data.end_time} onChange={e => setData('end_time', e.target.value)}/>
                            {errors.end_time && <div className="form-error">{errors.end_time}</div>}
                        </div>
                    </div>

                    {/* Price estimate */}
                    {hours > 0 && (
                        <div style={{
                            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)',
                            borderRadius: 10, padding: '12px 16px', marginBottom: 16,
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <DollarSign size={14} color="var(--primary-light)"/>
                                Estimated Total ({hours} hr{hours > 1 ? 's' : ''})
                            </span>
                            <span style={{ color: 'var(--primary-light)', fontWeight: 700, fontSize: 16 }}>
                                {formatCurrency(estimatedPrice)}
                            </span>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Notes</label>
                        <textarea id="booking-notes" className="form-textarea"
                            placeholder="Any special requests or notes..."
                            value={data.notes} onChange={e => setData('notes', e.target.value)}/>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={processing}
                            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {processing ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }}/> : <Save size={14}/>}
                            {processing ? 'Saving...' : isEdit ? 'Update Booking' : 'Create Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Quick Status Dropdown ── */
function StatusDropdown({ booking }) {
    const [open, setOpen] = useState(false);
    const cfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
    const { Icon } = cfg;

    const changeStatus = (status) => {
        router.patch(route('bookings.status', booking.id), { status }, {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <div style={{ position: 'relative' }}>
            <span className={`badge ${cfg.cls}`}
                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                onClick={() => setOpen(!open)} title="Click to change status">
                <Icon size={10}/> {cfg.label}
            </span>
            {open && (
                <div style={{
                    position: 'absolute', top: '110%', left: 0, zIndex: 60,
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 10, padding: 4, minWidth: 150, boxShadow: 'var(--shadow-md)',
                }}>
                    {STATUS_OPTIONS.map(s => {
                        const { Icon: SIcon, label } = STATUS_CONFIG[s];
                        return (
                            <button key={s} onClick={() => changeStatus(s)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                                    padding: '7px 12px', background: 'none', border: 'none',
                                    color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer',
                                    borderRadius: 6, transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                                <SIcon size={13}/> {label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ── Confirm Delete ── */
function ConfirmDelete({ booking, onClose }) {
    const { delete: destroy, processing } = useForm();
    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal confirm-modal">
                <div className="confirm-icon"><TriangleAlert size={24} color="#ef4444"/></div>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <h2 className="modal-title" style={{ marginBottom: 8 }}>Delete Booking?</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                        Delete booking for <strong style={{ color: 'var(--text-primary)' }}>{booking.customer_name}</strong>?
                        This action cannot be undone.
                    </p>
                </div>
                <div className="modal-footer" style={{ justifyContent: 'center' }}>
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-danger"
                        onClick={() => destroy(route('bookings.destroy', booking.id), { onSuccess: onClose })}
                        disabled={processing}
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {processing ? <Loader2 size={14}/> : <Trash2 size={14}/>}
                        {processing ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Main Page ── */
export default function BookingsIndex({ bookings, courts, stats, filters }) {
    const [showModal,     setShowModal]     = useState(false);
    const [editBooking,   setEditBooking]   = useState(null);
    const [deleteBooking, setDeleteBooking] = useState(null);
    const [search, setSearch] = useState(filters?.search ?? '');
    const [status, setStatus] = useState(filters?.status ?? '');
    const [date,   setDate]   = useState(filters?.date   ?? '');

    const applyFilter = () => {
        router.get(route('bookings.index'), { search, status, date }, { preserveState: true });
    };

    const clearFilter = () => {
        setSearch(''); setStatus(''); setDate('');
        router.get(route('bookings.index'));
    };

    return (
        <AppLayout title="Bookings" subtitle="Manage all court reservations">

            {/* Mini stats row */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                {[
                    { label: 'Total',     value: stats.total,     color: 'var(--text-primary)',  Icon: CalendarDays },
                    { label: 'Pending',   value: stats.pending,   color: '#f59e0b',              Icon: Clock },
                    { label: 'Confirmed', value: stats.confirmed, color: '#10b981',              Icon: CheckCircle2 },
                    { label: 'Today',     value: stats.today,     color: '#818cf8',              Icon: CalendarDays },
                ].map(s => (
                    <div key={s.label} style={{
                        flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)', padding: '14px 18px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <s.Icon size={14} color={s.color}/>
                            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</span>
                        </div>
                        <span style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</span>
                    </div>
                ))}
                <div style={{
                    flex: 1.5, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)',
                    borderRadius: 'var(--radius-md)', padding: '14px 18px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <DollarSign size={14} color="var(--primary-light)"/>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Revenue</span>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--primary-light)' }}>
                        {formatCurrency(stats.revenue)}
                    </span>
                </div>
            </div>

            {/* Filter Bar */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="search-input-wrapper" style={{ flex: 1, minWidth: 200 }}>
                    <Search size={15} className="search-icon"/>
                    <input id="booking-search" className="search-input"
                        placeholder="Search by name or phone..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyFilter()}/>
                </div>
                <div style={{ minWidth: 160 }}>
                    <CustomSelect
                        id="filter-status"
                        value={status}
                        onChange={val => setStatus(val)}
                        placeholder="All Status"
                        options={[
                            { value: '', label: 'All Status' },
                            ...STATUS_OPTIONS.map(s => ({
                                value: s,
                                label: STATUS_CONFIG[s]?.label || s,
                            })),
                        ]}
                    />
                </div>
                <input id="filter-date" type="date" className="filter-select"
                    value={date} onChange={e => setDate(e.target.value)} style={{ minWidth: 160 }}/>
                <button className="btn btn-secondary" onClick={applyFilter}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Filter size={13}/> Filter
                </button>
                {(search || status || date) && (
                    <button className="btn btn-secondary" onClick={clearFilter}
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <X size={13}/> Clear
                    </button>
                )}
                <button id="btn-add-booking" className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    onClick={() => { setEditBooking(null); setShowModal(true); }}>
                    <Plus size={14}/> New Booking
                </button>
            </div>

            {/* Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Customer</th>
                                <th>Court</th>
                                <th>Schedule</th>
                                <th>Duration</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.data.length === 0 ? (
                                <tr><td colSpan={8}>
                                    <div className="empty-state">
                                        <CalendarDays size={36} style={{ opacity: 0.3, margin: '0 auto 12px', display: 'block' }}/>
                                        <div className="empty-state-title">No bookings found</div>
                                        <div className="empty-state-desc">Try adjusting filters or create a new booking.</div>
                                    </div>
                                </td></tr>
                            ) : bookings.data.map((b, i) => (
                                <tr key={b.id}>
                                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{bookings.from + i}</td>
                                    <td>
                                        <div className="td-primary">{b.customer_name}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.customer_phone}</div>
                                        {b.customer_email && (
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.customer_email}</div>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Building2 size={12} color="var(--text-muted)"/>
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                                                    {b.court?.name}
                                                </div>
                                                <span className={`badge badge-${b.court?.type}`} style={{ marginTop: 3 }}>
                                                    {b.court?.type}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {new Date(b.booking_date).toLocaleDateString('id-ID', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Clock size={10}/> {b.start_time?.slice(0,5)} – {b.end_time?.slice(0,5)}
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {b.duration_hours}h
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: 13 }}>
                                            {formatCurrency(b.total_price)}
                                        </span>
                                    </td>
                                    <td><StatusDropdown booking={b}/></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                            <button id={`btn-edit-booking-${b.id}`}
                                                className="btn btn-secondary btn-icon btn-sm"
                                                title="Edit"
                                                onClick={() => { setEditBooking(b); setShowModal(true); }}>
                                                <Pencil size={13}/>
                                            </button>
                                            <button id={`btn-delete-booking-${b.id}`}
                                                className="btn btn-danger btn-icon btn-sm"
                                                title="Delete"
                                                onClick={() => setDeleteBooking(b)}>
                                                <Trash2 size={13}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {bookings.last_page > 1 && (
                    <div className="pagination" style={{ padding: '16px 24px' }}>
                        <div className="pagination-info">
                            Showing {bookings.from}–{bookings.to} of {bookings.total} bookings
                        </div>
                        <div className="pagination-links">
                            <button className="pagination-btn" disabled={!bookings.prev_page_url}
                                onClick={() => bookings.prev_page_url && router.get(bookings.prev_page_url)}>
                                <ChevronLeft size={14}/>
                            </button>
                            {bookings.links.slice(1, -1).map((link, i) => (
                                <button key={i}
                                    className={`pagination-btn ${link.active ? 'active' : ''}`}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}/>
                            ))}
                            <button className="pagination-btn" disabled={!bookings.next_page_url}
                                onClick={() => bookings.next_page_url && router.get(bookings.next_page_url)}>
                                <ChevronRight size={14}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <BookingModal booking={editBooking} courts={courts}
                    onClose={() => { setShowModal(false); setEditBooking(null); }}/>
            )}
            {deleteBooking && (
                <ConfirmDelete booking={deleteBooking} onClose={() => setDeleteBooking(null)}/>
            )}
        </AppLayout>
    );
}
