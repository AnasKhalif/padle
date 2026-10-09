import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Mail, Lock, User, TrendingUp, Shield, Zap } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
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
            <Head title="Register - PadelSpace" />

            {/* ── Left: background image + overlay text ── */}
            <div style={{
                position: 'relative',
                backgroundImage: "url('/images/padel-bg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(10,10,20,0.85) 0%, rgba(30,20,80,0.6) 100%)',
                }}/>
                <div style={{
                    position: 'relative', zIndex: 10,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    height: '100%', padding: '48px',
                }}>
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

                    <div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
                            borderRadius: 100, padding: '4px 14px', marginBottom: 20,
                        }}>
                            <Zap size={13} color="#818cf8"/>
                            <span style={{ color: '#818cf8', fontSize: 12, fontWeight: 600, letterSpacing: '0.5px' }}>
                                START YOUR JOURNEY
                            </span>
                        </div>
                        <h1 style={{
                            fontSize: 44, fontWeight: 800, color: 'white',
                            lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 16,
                        }}>
                            Join the Best<br/>
                            <span style={{
                                background: 'linear-gradient(90deg, #818cf8, #34d399)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            }}>Padel Community</span><br/>
                            Today.
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7, maxWidth: 420 }}>
                            Set up your account to start managing courts, reservations, schedules, and revenue insights.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {[
                            { icon: TrendingUp, label: 'Real-time Analytics' },
                            { icon: Shield,     label: 'Secure Bookings' },
                            { icon: Zap,        label: 'Instant Updates' },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.12)', borderRadius: 100,
                                padding: '8px 16px', color: 'rgba(255,255,255,0.85)',
                                fontSize: 13, fontWeight: 500,
                            }}>
                                <Icon size={14} color="#818cf8"/>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right: Form Container ── */}
            <div style={{
                background: '#121220',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '40px 48px',
                borderLeft: '1px solid rgba(255,255,255,0.06)',
                overflowY: 'auto',
            }}>
                <div style={{ width: '100%', maxWidth: 380, margin: '0 auto' }}>
                    <div style={{ marginBottom: 28 }}>
                        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f1f1f8', marginBottom: 6 }}>
                            Create account
                        </h2>
                        <p style={{ color: '#707090', fontSize: 14 }}>
                            Enter your details to create an account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a0a0c0', marginBottom: 6 }}>
                                Full Name
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} color="#6060a0" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}/>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    style={{
                                        width: '100%', padding: '11px 14px 11px 42px',
                                        background: '#1e1e35', border: `1px solid ${errors.name ? '#ef4444' : 'rgba(99,102,241,0.2)'}`,
                                        borderRadius: 10, color: '#f1f1f8', fontSize: 14,
                                        fontFamily: 'inherit', outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                            {errors.name && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a0a0c0', marginBottom: 6 }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} color="#6060a0" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}/>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="admin@padel.com"
                                    required
                                    style={{
                                        width: '100%', padding: '11px 14px 11px 42px',
                                        background: '#1e1e35', border: `1px solid ${errors.email ? '#ef4444' : 'rgba(99,102,241,0.2)'}`,
                                        borderRadius: 10, color: '#f1f1f8', fontSize: 14,
                                        fontFamily: 'inherit', outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                            {errors.email && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a0a0c0', marginBottom: 6 }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} color="#6060a0" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}/>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: '100%', padding: '11px 42px 11px 42px',
                                        background: '#1e1e35', border: `1px solid ${errors.password ? '#ef4444' : 'rgba(99,102,241,0.2)'}`,
                                        borderRadius: 10, color: '#f1f1f8', fontSize: 14,
                                        fontFamily: 'inherit', outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
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
                            {errors.password && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.password}</p>}
                        </div>

                        {/* Password Confirmation */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a0a0c0', marginBottom: 6 }}>
                                Confirm Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} color="#6060a0" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}/>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: '100%', padding: '11px 14px 11px 42px',
                                        background: '#1e1e35', border: `1px solid ${errors.password_confirmation ? '#ef4444' : 'rgba(99,102,241,0.2)'}`,
                                        borderRadius: 10, color: '#f1f1f8', fontSize: 14,
                                        fontFamily: 'inherit', outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                            {errors.password_confirmation && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.password_confirmation}</p>}
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
                            {processing ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div style={{ marginTop: 24, textAlign: 'center' }}>
                        <span style={{ fontSize: 13, color: '#707090' }}>
                            Already have an account?{' '}
                            <Link href={route('login')} style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
                                Sign in
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
