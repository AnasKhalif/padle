import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Mail, Lock, TrendingUp, Shield, Zap } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 480px',
            height: '100vh',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif",
            background: '#0a0a14',
        }}>
            {/* ── Left: background image + overlay text ── */}
            <div style={{
                position: 'relative',
                backgroundImage: "url('/images/padel-bg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden',
            }}>
                {/* dark overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(10,10,20,0.85) 0%, rgba(30,20,80,0.6) 100%)',
                }}/>
                {/* content */}
                <div style={{
                    position: 'relative', zIndex: 10,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    height: '100%', padding: '48px',
                }}>
                    {/* logo top */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 10,
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 20px rgba(99,102,241,0.5)',
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>
                            </svg>
                        </div>
                        <span style={{ color: 'white', fontSize: 20, fontWeight: 700, letterSpacing: '-0.3px' }}>
                            PadelSpace
                        </span>
                    </div>

                    {/* center headline */}
                    <div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
                            borderRadius: 100, padding: '4px 14px', marginBottom: 20,
                        }}>
                            <Zap size={13} color="#818cf8"/>
                            <span style={{ color: '#818cf8', fontSize: 12, fontWeight: 600, letterSpacing: '0.5px' }}>
                                PADEL MANAGEMENT PLATFORM
                            </span>
                        </div>
                        <h1 style={{
                            fontSize: 44, fontWeight: 800, color: 'white',
                            lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 16,
                        }}>
                            Manage Your<br/>
                            <span style={{
                                background: 'linear-gradient(90deg, #818cf8, #34d399)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            }}>Padel Courts</span><br/>
                            Effortlessly.
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7, maxWidth: 420 }}>
                            A complete booking & court management solution designed for modern padel businesses.
                        </p>
                    </div>

                    {/* feature pills bottom */}
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {[
                            { icon: TrendingUp, label: 'Real-time Analytics' },
                            { icon: Shield,     label: 'Secure Bookings' },
                            { icon: Zap,        label: 'Instant Updates' },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: 8, padding: '8px 14px',
                            }}>
                                <Icon size={14} color="#818cf8"/>
                                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 500 }}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right: dark form panel ── */}
            <div style={{
                background: '#111120',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '40px 48px',
                borderLeft: '1px solid rgba(99,102,241,0.15)',
            }}>
                <div style={{ width: '100%', maxWidth: 360 }}>
                    {/* heading */}
                    <div style={{ marginBottom: 32 }}>
                        <h2 style={{
                            fontSize: 26, fontWeight: 800, color: '#f1f1f8',
                            letterSpacing: '-0.5px', marginBottom: 8,
                        }}>
                            Welcome back 👋
                        </h2>
                        <p style={{ fontSize: 14, color: '#6060a0' }}>
                            Sign in to your PadelSpace account
                        </p>
                    </div>

                    {/* status message */}
                    {status && (
                        <div style={{
                            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                            borderRadius: 8, padding: '10px 14px', marginBottom: 20,
                            color: '#10b981', fontSize: 13,
                        }}>
                            {status}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{
                                display: 'block', fontSize: 13, fontWeight: 600,
                                color: '#a0a0c0', marginBottom: 6,
                            }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} color="#6060a0" style={{
                                    position: 'absolute', left: 14, top: '50%',
                                    transform: 'translateY(-50%)', pointerEvents: 'none',
                                }}/>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="username"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="admin@padel.com"
                                    style={{
                                        width: '100%', padding: '11px 14px 11px 42px',
                                        background: '#1e1e35', border: `1px solid ${errors.email ? '#ef4444' : 'rgba(99,102,241,0.2)'}`,
                                        borderRadius: 10, color: '#f1f1f8', fontSize: 14,
                                        fontFamily: 'inherit', outline: 'none',
                                        boxSizing: 'border-box', transition: 'border-color 0.2s',
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                                    onBlur={e => e.target.style.borderColor = errors.email ? '#ef4444' : 'rgba(99,102,241,0.2)'}
                                />
                            </div>
                            {errors.email && (
                                <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{
                                display: 'block', fontSize: 13, fontWeight: 600,
                                color: '#a0a0c0', marginBottom: 6,
                            }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} color="#6060a0" style={{
                                    position: 'absolute', left: 14, top: '50%',
                                    transform: 'translateY(-50%)', pointerEvents: 'none',
                                }}/>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    style={{
                                        width: '100%', padding: '11px 42px 11px 42px',
                                        background: '#1e1e35', border: `1px solid ${errors.password ? '#ef4444' : 'rgba(99,102,241,0.2)'}`,
                                        borderRadius: 10, color: '#f1f1f8', fontSize: 14,
                                        fontFamily: 'inherit', outline: 'none',
                                        boxSizing: 'border-box', transition: 'border-color 0.2s',
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                                    onBlur={e => e.target.style.borderColor = errors.password ? '#ef4444' : 'rgba(99,102,241,0.2)'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(s => !s)}
                                    style={{
                                        position: 'absolute', right: 12, top: '50%',
                                        transform: 'translateY(-50%)', background: 'none',
                                        border: 'none', cursor: 'pointer', color: '#6060a0',
                                        display: 'flex', alignItems: 'center',
                                    }}
                                >
                                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                                </button>
                            </div>
                            {errors.password && (
                                <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.password}</p>
                            )}
                        </div>

                        {/* Remember + Forgot */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: 24,
                        }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    style={{ accentColor: '#6366f1', width: 14, height: 14 }}
                                />
                                <span style={{ fontSize: 13, color: '#6060a0' }}>Remember me</span>
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    style={{ fontSize: 13, color: '#818cf8', textDecoration: 'none', fontWeight: 500 }}
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                width: '100%', padding: '13px',
                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                border: 'none', borderRadius: 10, color: 'white',
                                fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
                                cursor: processing ? 'not-allowed' : 'pointer',
                                opacity: processing ? 0.7 : 1,
                                boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                                transition: 'all 0.2s', letterSpacing: '0.2px',
                            }}
                        >
                            {processing ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* divider */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        margin: '28px 0 24px',
                    }}>
                        <div style={{ flex: 1, height: 1, background: 'rgba(99,102,241,0.15)' }}/>
                        <span style={{ fontSize: 12, color: '#4040708' }}>or</span>
                        <div style={{ flex: 1, height: 1, background: 'rgba(99,102,241,0.15)' }}/>
                    </div>

                    {/* hint */}
                    <div style={{
                        background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                        borderRadius: 10, padding: '12px 16px', marginBottom: 20,
                    }}>
                        <p style={{ fontSize: 12, color: '#6060a0', marginBottom: 4 }}>Demo credentials:</p>
                        <p style={{ fontSize: 13, color: '#a0a0c0' }}>
                            <strong style={{ color: '#818cf8' }}>admin@padel.com</strong> / <strong style={{ color: '#818cf8' }}>password</strong>
                        </p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: 13, color: '#707090' }}>
                            Don't have an account?{' '}
                            <Link href={route('register')} style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
                                Sign up
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
