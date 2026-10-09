import AppLayout from '@/Layouts/AppLayout';
import CustomSelect from '@/Components/ui/CustomSelect';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Plus, Pencil, Trash2, Building2, Home, Sun,
    CheckCircle2, XCircle, X, Save, Loader2, TriangleAlert,
    CalendarDays
} from 'lucide-react';

const formatCurrency = (val) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val ?? 0);

const SURFACES = ['Artificial Grass', 'Concrete', 'Clay', 'Hard Court'];

/* ── Modal Form ── */
function CourtModal({ court, onClose }) {
    const isEdit = !!court;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name:           court?.name           ?? '',
        type:           court?.type           ?? 'indoor',
        surface:        court?.surface        ?? 'Artificial Grass',
        price_per_hour: court?.price_per_hour ?? '',
        is_available:   court?.is_available   ?? true,
        description:    court?.description    ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('courts.update', court.id), { onSuccess: onClose });
        } else {
            post(route('courts.store'), { onSuccess: () => { reset(); onClose(); } });
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Building2 size={20} color="var(--primary-light)"/>
                        {isEdit ? 'Edit Court' : 'New Court'}
                    </h2>
                    <button className="modal-close" onClick={onClose}><X size={16}/></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Court Name *</label>
                        <input id="court-name" className="form-input" placeholder="e.g. Court A - Premium Indoor"
                            value={data.name} onChange={e => setData('name', e.target.value)}/>
                        {errors.name && <div className="form-error">{errors.name}</div>}
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Type *</label>
                            <CustomSelect
                                id="court-type"
                                value={data.type}
                                onChange={val => setData('type', val)}
                                options={[
                                    { value: 'indoor', label: 'Indoor' },
                                    { value: 'outdoor', label: 'Outdoor' },
                                ]}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Surface *</label>
                            <CustomSelect
                                id="court-surface"
                                value={data.surface}
                                onChange={val => setData('surface', val)}
                                options={SURFACES.map(s => ({ value: s, label: s }))}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Price per Hour (IDR) *</label>
                        <input id="court-price" type="number" className="form-input" placeholder="e.g. 150000"
                            value={data.price_per_hour} onChange={e => setData('price_per_hour', e.target.value)}/>
                        {errors.price_per_hour && <div className="form-error">{errors.price_per_hour}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea id="court-description" className="form-textarea"
                            placeholder="Brief description of the court..."
                            value={data.description} onChange={e => setData('description', e.target.value)}/>
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={data.is_available}
                                onChange={e => setData('is_available', e.target.checked)}/>
                            <div className="toggle-track"/>
                        </label>
                        <span className="form-label mb-0">Court is Available</span>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={processing}
                            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {processing ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }}/> : <Save size={14}/>}
                            {processing ? 'Saving...' : isEdit ? 'Update Court' : 'Create Court'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Confirm Delete ── */
function ConfirmDelete({ court, onClose }) {
    const { delete: destroy, processing } = useForm();
    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal confirm-modal">
                <div className="confirm-icon">
                    <TriangleAlert size={24} color="#ef4444"/>
                </div>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <h2 className="modal-title" style={{ marginBottom: 8 }}>Delete Court?</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                        Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{court.name}</strong>?
                        All associated bookings will also be deleted.
                    </p>
                </div>
                <div className="modal-footer" style={{ justifyContent: 'center' }}>
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-danger"
                        onClick={() => destroy(route('courts.destroy', court.id), { onSuccess: onClose })}
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
export default function CourtsIndex({ courts }) {
    const [showModal,    setShowModal]    = useState(false);
    const [editCourt,    setEditCourt]    = useState(null);
    const [deleteCourt,  setDeleteCourt]  = useState(null);

    return (
        <AppLayout title="Courts" subtitle="Manage your padel courts">
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    {courts.length} court{courts.length !== 1 ? 's' : ''} registered
                </p>
                <button id="btn-add-court" className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    onClick={() => { setEditCourt(null); setShowModal(true); }}>
                    <Plus size={15}/> Add Court
                </button>
            </div>

            {courts.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <Building2 size={40} style={{ opacity: 0.3, margin: '0 auto 16px', display: 'block' }}/>
                        <div className="empty-state-title">No courts yet</div>
                        <div className="empty-state-desc">Add your first padel court to get started.</div>
                        <button className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                            onClick={() => setShowModal(true)}>
                            <Plus size={14}/> Add Court
                        </button>
                    </div>
                </div>
            ) : (
                <div className="courts-grid">
                    {courts.map(court => (
                        <div key={court.id} className="court-card">
                            {/* Card header */}
                            <div className="court-card-header">
                                <div style={{
                                    position: 'relative', zIndex: 1,
                                    width: 56, height: 56, borderRadius: 14,
                                    background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(16,185,129,0.2))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '1px solid rgba(99,102,241,0.2)',
                                }}>
                                    {court.type === 'indoor'
                                        ? <Home size={26} color="#818cf8"/>
                                        : <Sun  size={26} color="#34d399"/>
                                    }
                                </div>
                            </div>

                            <div className="court-card-body">
                                <div className="court-name">{court.name}</div>
                                <div className="court-meta">
                                    <span className={`badge badge-${court.type}`}>
                                        {court.type === 'indoor' ? <Home size={10}/> : <Sun size={10}/>}
                                        {' '}{court.type}
                                    </span>
                                    <span className={`badge badge-${court.is_available ? 'available' : 'unavailable'}`}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                        {court.is_available
                                            ? <><CheckCircle2 size={10}/> Available</>
                                            : <><XCircle size={10}/> Unavailable</>
                                        }
                                    </span>
                                </div>

                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                                    {court.surface}
                                </div>

                                <div className="court-price">{formatCurrency(court.price_per_hour)}</div>
                                <div className="court-price-label">per hour</div>

                                {court.description && (
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>
                                        {court.description.length > 80
                                            ? court.description.slice(0, 80) + '...'
                                            : court.description}
                                    </div>
                                )}

                                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8,
                                    display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <CalendarDays size={11}/> {court.bookings_count} total
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <CheckCircle2 size={11}/> {court.active_bookings_count} active
                                    </span>
                                </div>

                                <div className="court-actions">
                                    <button id={`btn-edit-court-${court.id}`}
                                        className="btn btn-secondary btn-sm w-full"
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                                        onClick={() => { setEditCourt(court); setShowModal(true); }}>
                                        <Pencil size={13}/> Edit
                                    </button>
                                    <button id={`btn-delete-court-${court.id}`}
                                        className="btn btn-danger btn-sm btn-icon"
                                        onClick={() => setDeleteCourt(court)}>
                                        <Trash2 size={13}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <CourtModal court={editCourt} onClose={() => { setShowModal(false); setEditCourt(null); }}/>
            )}
            {deleteCourt && (
                <ConfirmDelete court={deleteCourt} onClose={() => setDeleteCourt(null)}/>
            )}
        </AppLayout>
    );
}

