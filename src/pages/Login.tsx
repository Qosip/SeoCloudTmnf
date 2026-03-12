import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Zap, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import SEO from '../components/SEO'

export default function Login() {
    const { login } = useAuth()
    const nav = useNavigate()
    const location = useLocation()
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/servers'
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(''); setLoading(true)
        const ok = await login(email, pass)
        setLoading(false)
        if (ok) { nav(from, { replace: true }) }
        else { setError('Email ou mot de passe incorrect. Essayez demo@trackhost.gg / demo') }
    }

    return (
        <div className="auth-page">
            <SEO 
                title="Connexion" 
                description="Connectez-vous à votre interface de gestion TrackHost."
                noindex
            />
            <div className="auth-bg-glow" />
            <div className="auth-card">
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                    <div className="sidebar-logo-icon" style={{ width: 36, height: 36 }}><Zap size={18} /></div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, letterSpacing: '0.05em' }}>TrackHost</span>
                </div>

                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--text-high)', marginBottom: 6 }}>
                    Bon retour.
                </h1>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-low)', marginBottom: 28 }}>
                    Connectez-vous à votre compte
                </p>

                {/* Demo hint */}
                <div className="auth-hint">
                    <Check size={12} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <span>Demo : <b>demo@trackhost.gg</b> / <b>demo</b></span>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
                    <div>
                        <label className="auth-label">Email</label>
                        <input className="input" type="email" autoComplete="email" placeholder="vous@exemple.fr"
                            value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label className="auth-label">Mot de passe</label>
                            <Link to="/forgot" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--primary)', textDecoration: 'none' }}>Oublié ?</Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input className="input" type={show ? 'text' : 'password'} placeholder="••••••••"
                                value={pass} onChange={e => setPass(e.target.value)} required style={{ paddingRight: 40 }} />
                            <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-low)' }}>
                                {show ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button className="btn btn-primary" type="submit" disabled={loading}
                        style={{ justifyContent: 'center', padding: '12px', marginTop: 4, fontSize: 14 }}>
                        {loading ? <span className="spinner" /> : <><ArrowRight size={15} /> Connexion</>}
                    </button>
                </form>

                <div className="auth-divider"><span>ou</span></div>

                <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-mid)' }}>
                    Pas encore de compte ?{' '}
                    <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Créer un compte</Link>
                </p>
            </div>
        </div>
    )
}
