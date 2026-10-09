import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    User, Mail, Lock, KeyRound, ShieldAlert,
    Trash2, CheckCircle2, Save, AlertCircle, X, Loader2
} from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    /* ── 1. Profile Information Form ── */
    const profileForm = useForm({
        name: user.name || '',
        email: user.email || '',
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    /* ── 2. Password Update Form ── */
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    /* ── 3. Delete Account Modal & Form ── */
    const [confirmDelete, setConfirmDelete] = useState(false);
    const deleteForm = useForm({
        password: '',
    });

    const handleDeleteSubmit = (e) => {
        e.preventDefault();
        deleteForm.delete(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => setConfirmDelete(false),
            onFinish: () => deleteForm.reset(),
        });
    };

    return (
        <AppLayout title="Profile Settings" subtitle="Manage your account profile, security, and preferences">
            <Head title="Profile Settings - PadelSpace" />

            <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* ── Card 1: Profile Information ── */}
                <div style={{
                    background: '#16162a',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: 16,
                    padding: '28px 32px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 24 }}>
                        <div style={{
                            width: 42, height: 42, borderRadius: 12,
                            background: 'rgba(99, 102, 241, 0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#818cf8', flexShrink: 0,
                        }}>
                            <User size={20} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f1f8', margin: 0 }}>
                                Profile Information
                            </h3>
                            <p style={{ fontSize: 13, color: '#8080a8', margin: '4px 0 0' }}>
                                Update your full name and public account email address.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleProfileSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                            {/* Name */}
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a0a0c0', marginBottom: 8 }}>
                                    Full Name
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <User size={16} color="#707090" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        id="name"
                                        type="text"
                                        value={profileForm.data.name}
                                        onChange={(e) => profileForm.setData('name', e.target.value)}
                                        required
                                        placeholder="Your full name"
                                        style={{
                                            width: '100%',
                                            padding: '11px 14px 11px 42px',
                                            background: '#1e1e35',
                                            border: `1px solid ${profileForm.errors.name ? '#ef4444' : 'rgba(99, 102, 241, 0.25)'}`,
                                            borderRadius: 10,
                                            color: '#f1f1f8',
                                            fontSize: 14,
                                            fontFamily: 'inherit',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>
                                {profileForm.errors.name && (
                                    <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{profileForm.errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a0a0c0', marginBottom: 8 }}>
                                    Email Address
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} color="#707090" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        id="email"
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={(e) => profileForm.setData('email', e.target.value)}
                                        required
                                        placeholder="your.email@example.com"
                                        style={{
                                            width: '100%',
                                            padding: '11px 14px 11px 42px',
                                            background: '#1e1e35',
                                            border: `1px solid ${profileForm.errors.email ? '#ef4444' : 'rgba(99, 102, 241, 0.25)'}`,
                                            borderRadius: 10,
                                            color: '#f1f1f8',
                                            fontSize: 14,
                                            fontFamily: 'inherit',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>
                                {profileForm.errors.email && (
                                    <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{profileForm.errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {profileForm.recentlySuccessful && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#34d399', fontWeight: 500 }}>
                                        <CheckCircle2 size={16} /> Changes saved successfully!
                                    </span>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    padding: '10px 22px',
                                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                    color: 'white', border: 'none', borderRadius: 10,
                                    fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
                                    cursor: profileForm.processing ? 'not-allowed' : 'pointer',
                                    opacity: profileForm.processing ? 0.7 : 1,
                                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                {profileForm.processing ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
                                Save Profile
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── Card 2: Update Password ── */}
                <div style={{
                    background: '#16162a',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: 16,
                    padding: '28px 32px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 24 }}>
                        <div style={{
                            width: 42, height: 42, borderRadius: 12,
                            background: 'rgba(99, 102, 241, 0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#818cf8', flexShrink: 0,
                        }}>
                            <KeyRound size={20} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f1f8', margin: 0 }}>
                                Update Password
                            </h3>
                            <p style={{ fontSize: 13, color: '#8080a8', margin: '4px 0 0' }}>
                                Ensure your account is using a long, random password to stay secure.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                            {/* Current Password */}
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a0a0c0', marginBottom: 8 }}>
                                    Current Password
                                </label>
                                <div style={{ position: 'relative', maxWidth: 440 }}>
                                    <Lock size={16} color="#707090" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="password"
                                        value={passwordForm.data.current_password}
                                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                        placeholder="••••••••"
                                        style={{
                                            width: '100%',
                                            padding: '11px 14px 11px 42px',
                                            background: '#1e1e35',
                                            border: `1px solid ${passwordForm.errors.current_password ? '#ef4444' : 'rgba(99, 102, 241, 0.25)'}`,
                                            borderRadius: 10,
                                            color: '#f1f1f8',
                                            fontSize: 14,
                                            fontFamily: 'inherit',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>
                                {passwordForm.errors.current_password && (
                                    <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{passwordForm.errors.current_password}</p>
                                )}
                            </div>

                            {/* New Password & Confirmation */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a0a0c0', marginBottom: 8 }}>
                                        New Password
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={16} color="#707090" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                                        <input
                                            type="password"
                                            value={passwordForm.data.password}
                                            onChange={(e) => passwordForm.setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            style={{
                                                width: '100%',
                                                padding: '11px 14px 11px 42px',
                                                background: '#1e1e35',
                                                border: `1px solid ${passwordForm.errors.password ? '#ef4444' : 'rgba(99, 102, 241, 0.25)'}`,
                                                borderRadius: 10,
                                                color: '#f1f1f8',
                                                fontSize: 14,
                                                fontFamily: 'inherit',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>
                                    {passwordForm.errors.password && (
                                        <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{passwordForm.errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a0a0c0', marginBottom: 8 }}>
                                        Confirm Password
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={16} color="#707090" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                                        <input
                                            type="password"
                                            value={passwordForm.data.password_confirmation}
                                            onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                            placeholder="••••••••"
                                            style={{
                                                width: '100%',
                                                padding: '11px 14px 11px 42px',
                                                background: '#1e1e35',
                                                border: `1px solid ${passwordForm.errors.password_confirmation ? '#ef4444' : 'rgba(99, 102, 241, 0.25)'}`,
                                                borderRadius: 10,
                                                color: '#f1f1f8',
                                                fontSize: 14,
                                                fontFamily: 'inherit',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>
                                    {passwordForm.errors.password_confirmation && (
                                        <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{passwordForm.errors.password_confirmation}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {passwordForm.recentlySuccessful && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#34d399', fontWeight: 500 }}>
                                        <CheckCircle2 size={16} /> Password updated successfully!
                                    </span>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    padding: '10px 22px',
                                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                    color: 'white', border: 'none', borderRadius: 10,
                                    fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
                                    cursor: passwordForm.processing ? 'not-allowed' : 'pointer',
                                    opacity: passwordForm.processing ? 0.7 : 1,
                                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                {passwordForm.processing ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── Card 3: Danger Zone / Delete Account ── */}
                <div style={{
                    background: '#1a1420',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: 16,
                    padding: '28px 32px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                            <div style={{
                                width: 42, height: 42, borderRadius: 12,
                                background: 'rgba(239, 68, 68, 0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#f87171', flexShrink: 0,
                            }}>
                                <Trash2 size={20} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f87171', margin: 0 }}>
                                    Delete Account
                                </h3>
                                <p style={{ fontSize: 13, color: '#a08088', margin: '4px 0 0', maxWidth: 480 }}>
                                    Permanently delete your account and all associated courts, bookings, and platform data. This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setConfirmDelete(true)}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '10px 20px',
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: '#f87171',
                                border: '1px solid rgba(239, 68, 68, 0.35)',
                                borderRadius: 10,
                                fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                flexShrink: 0,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#ef4444';
                                e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                                e.currentTarget.style.color = '#f87171';
                            }}
                        >
                            <Trash2 size={15} />
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Delete Confirmation Modal ── */}
            {confirmDelete && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(6px)',
                    zIndex: 99999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 20,
                }}>
                    <div style={{
                        background: '#18182c',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: 18,
                        padding: 32,
                        maxWidth: 480,
                        width: '100%',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                        animation: 'fadeIn 0.2s ease',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    background: 'rgba(239, 68, 68, 0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#f87171',
                                }}>
                                    <ShieldAlert size={20} />
                                </div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f1f8', margin: 0 }}>
                                    Are you sure?
                                </h3>
                            </div>
                            <button
                                onClick={() => setConfirmDelete(false)}
                                style={{ background: 'none', border: 'none', color: '#707090', cursor: 'pointer', padding: 4 }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <p style={{ fontSize: 14, color: '#a0a0c0', lineHeight: 1.6, marginBottom: 20 }}>
                            Once your account is deleted, all resources and data will be permanently removed. Please enter your password to confirm deletion.
                        </p>

                        <form onSubmit={handleDeleteSubmit}>
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a0a0c0', marginBottom: 8 }}>
                                    Confirm Your Password
                                </label>
                                <input
                                    type="password"
                                    value={deleteForm.data.password}
                                    onChange={(e) => deleteForm.setData('password', e.target.value)}
                                    placeholder="Enter your password"
                                    autoFocus
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '11px 14px',
                                        background: '#1e1e35',
                                        border: `1px solid ${deleteForm.errors.password ? '#ef4444' : 'rgba(239, 68, 68, 0.3)'}`,
                                        borderRadius: 10,
                                        color: '#f1f1f8',
                                        fontSize: 14,
                                        fontFamily: 'inherit',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                                {deleteForm.errors.password && (
                                    <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{deleteForm.errors.password}</p>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                <button
                                    type="button"
                                    onClick={() => setConfirmDelete(false)}
                                    style={{
                                        padding: '10px 18px',
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        color: '#d1d1e0',
                                        border: 'none',
                                        borderRadius: 10,
                                        fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={deleteForm.processing}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 10,
                                        fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
                                        cursor: deleteForm.processing ? 'not-allowed' : 'pointer',
                                        opacity: deleteForm.processing ? 0.7 : 1,
                                    }}
                                >
                                    {deleteForm.processing ? 'Deleting...' : 'Delete Permanently'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
