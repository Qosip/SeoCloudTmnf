import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import SEO from '../components/SEO'

const STRENGTH = ['', 'Faible', 'Moyen', 'Fort', 'Excellent']
const STRENGTH_COLOR = ['', 'var(--red)', 'var(--orange)', 'var(--yellow)', 'var(--primary)']

function getStrength(p: string) {
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
}

export default function Register() {
    const { register } = useAuth()
    const nav = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [confirm, setConfirm] = useState('')
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [agree, setAgree] = useState(false)

    const strength = getStrength(pass)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        if (pass !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
        if (strength < 2) { setError('Mot de passe trop faible.'); return }
        if (!agree) { setError('Vous devez accepter les conditions.'); return }
        setLoading(true)
        await register(name, email, pass)
        setLoading(false)
        nav('/pricing')
    }

    return (
        <div className="auth-page">
            <SEO 
                title="Créer un compte" 
                description="Rejoignez TrackHost et créez votre serveur TrackMania Nations Forever en quelques secondes."
            />
            <div className="auth-bg-glow" />
            <div className="auth-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                    <div className="sidebar-logo-icon" style={{ width: 36, height: 36 }}><Zap size={18} /></div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, letterSpacing: '0.05em' }}>TrackHost</span>
                </div>

                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--text-high)', marginBottom: 6 }}>
                    Créez votre compte.
                </h1>
                <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 28, lineHeight: 1.6 }}>
                    Rejoignez des milliers de joueurs sur TrackHost et lancez votre propre serveur 
                    TrackMania Nations Forever (TMNF) en moins de 60 secondes. Profitez d'une 
                    installation automatisée des maps, gestion des droits administrateur RCON, 
                    sans aucune configuration compliquée de votre côté.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <label className="auth-label">Pseudo / Nom</label>
                        <input className="input" type="text" placeholder="ton_pseudo" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="auth-label">Email</label>
                        <input className="input" type="email" placeholder="vous@exemple.fr" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label className="auth-label">Mot de passe</label>
                        <div style={{ position: 'relative' }}>
                            <input className="input" type={show ? 'text' : 'password'} placeholder="Min. 8 caractères"
                                value={pass} onChange={e => setPass(e.target.value)} required style={{ paddingRight: 40 }} />
                            <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-low)' }}>
                                {show ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                        {pass && (
                            <div style={{ marginTop: 6 }}>
                                <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i <= strength ? STRENGTH_COLOR[strength] : 'var(--border)' }} />
                                    ))}
                                </div>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: STRENGTH_COLOR[strength] }}>{STRENGTH[strength]}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="auth-label">Confirmer le mot de passe</label>
                        <input className="input" type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} required
                            style={{ borderColor: confirm && confirm !== pass ? 'var(--red)' : undefined }} />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
                        <div className={`checkbox ${agree ? 'checked' : ''}`} onClick={() => setAgree(!agree)}>
                            {agree && <Check size={10} />}
                        </div>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-mid)' }}>
                            J'accepte les <Link to="/docs/terms" style={{ color: 'var(--primary)', textDecoration: 'none' }}>conditions d'utilisation</Link> et la <Link to="/docs/privacy" style={{ color: 'var(--primary)', textDecoration: 'none' }}>politique de confidentialité</Link>
                        </span>
                    </label>

                    {error && <div className="auth-error">{error}</div>}

                    <button className="btn btn-primary" type="submit" disabled={loading}
                        style={{ justifyContent: 'center', padding: '12px', marginTop: 4, fontSize: 14 }}>
                        {loading ? <span className="spinner" /> : <><ArrowRight size={15} /> Créer mon compte</>}
                    </button>
                </form>

                <div className="auth-divider"><span>ou</span></div>

                <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-mid)' }}>
                    Déjà un compte ?{' '}
                    <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Se connecter</Link>
                </p>
            </div>
        </div>
    )
}
