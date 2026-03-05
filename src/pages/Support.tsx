import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    MessageCircle, Mail, Book, ChevronRight, Send, Check,
    Zap, Clock, Phone, Badge, AlertCircle, HelpCircle, FileText, Wrench
} from 'lucide-react'

const TICKET_TYPES = ['Problème technique', 'Facturation', 'Compte', 'Performance serveur', 'Autre']
const FAQS = [
    { q: 'Mon serveur ne démarre pas', a: 'Vérifiez votre tableau de bord — si le statut est "Provisioning", attendez 60s. Sinon, utilisez le bouton Restart. Si le problème persiste, ouvrez un ticket.' },
    { q: 'Comment changer le mot de passe de mon serveur ?', a: 'Dashboard → Console RCON → tapez SetServerPassword MonMotDePasse. Pour remettre le serveur en public : SetServerPassword (sans mot de passe).' },
    { q: 'Je ne vois pas mon serveur dans ManiaPlanet', a: 'Le serveur peut prendre 1-2 minutes à apparaître dans la liste officielle. Vous pouvez aussi vous connecter directement via adresse IP:port.' },
    { q: 'Comment upgrader mon plan ?', a: 'Paramètres → Plan → Changer de plan. Le changement est immédiat, la facturation est proratisée.' },
    { q: 'Mes records ont disparu', a: "Vérifiez que XAseco est bien démarré (Console RCON → logs XAseco). Si you avez redémarré sans XAseco, les records locaux peuvent être perdus — Dedimania les conserve." },
]

export default function Support() {
    const nav = useNavigate()
    const [form, setForm] = useState({ type: TICKET_TYPES[0], subject: '', body: '', email: '' })
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        await new Promise(r => setTimeout(r, 1200))
        setLoading(false)
        setSent(true)
    }

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Support</h1>
                <p className="page-subtitle">Nous sommes là pour vous aider · Réponse sous 24h (Pro) · 2h (Elite)</p>
            </div>

            {/* Contact channels */}
            <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
                {[
                    { icon: MessageCircle, label: 'Chat communauté', desc: 'Posez vos questions à la communauté', color: 'var(--cyan)', action: () => nav('/blog') },
                    { icon: Book, label: 'Documentation', desc: 'Guides pas-à-pas et références', color: 'var(--primary)', action: () => nav('/docs') },
                    { icon: Mail, label: 'Email support', desc: 'support@trackhost.gg', color: 'var(--orange)', action: () => { } },
                ].map(({ icon: Icon, label, desc, color, action }) => (
                    <div key={label} className="card" style={{ cursor: 'pointer', transition: 'border-color 200ms' }}
                        onClick={action}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <div style={{ width: 38, height: 38, background: `color-mix(in oklch, ${color} 15%, transparent)`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={18} style={{ color }} />
                            </div>
                            <div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-high)', letterSpacing: '0.03em' }}>{label}</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)' }}>{desc}</div>
                            </div>
                            <ChevronRight size={14} style={{ color: 'var(--text-ghost)', marginLeft: 'auto' }} />
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-5)', alignItems: 'start' }}>

                {/* Ticket form */}
                <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-high)', letterSpacing: '0.03em', marginBottom: 20 }}>
                        <FileText size={16} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)' }} />
                        Ouvrir un ticket
                    </h2>

                    {sent ? (
                        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-7)' }}>
                            <div style={{ width: 56, height: 56, background: 'var(--primary-dim)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                <Check size={24} style={{ color: 'var(--primary)' }} />
                            </div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-high)', marginBottom: 8 }}>Ticket envoyé !</div>
                            <p style={{ color: 'var(--text-mid)', fontSize: 13, marginBottom: 20 }}>Nous vous répondrons sous 24h. Référence : #TH-{Math.floor(Math.random() * 90000) + 10000}</p>
                            <button className="btn btn-ghost" onClick={() => setSent(false)}>Nouveau ticket</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label className="auth-label">Type de problème</label>
                                    <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                                        {TICKET_TYPES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="auth-label">Votre email</label>
                                    <input className="input" type="email" placeholder="vous@exemple.fr" value={form.email}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                                </div>
                            </div>
                            <div>
                                <label className="auth-label">Sujet</label>
                                <input className="input" placeholder="Résumez le problème en une phrase" value={form.subject}
                                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required />
                            </div>
                            <div>
                                <label className="auth-label">Description détaillée</label>
                                <textarea className="input" rows={6} style={{ resize: 'vertical' }}
                                    placeholder="Décrivez le problème, les étapes pour le reproduire, les messages d'erreur…"
                                    value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} required />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <button className="btn btn-primary" type="submit" disabled={loading} style={{ padding: '10px 24px', fontSize: 13 }}>
                                    {loading ? <span className="spinner" /> : <><Send size={13} /> Envoyer le ticket</>}
                                </button>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-ghost)' }}>
                                    <Clock size={10} style={{ display: 'inline', marginRight: 4 }} />
                                    Réponse sous 24h Pro · 2h Elite
                                </span>
                            </div>
                        </form>
                    )}
                </div>

                {/* FAQ */}
                <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-high)', letterSpacing: '0.03em', marginBottom: 20 }}>
                        <HelpCircle size={16} style={{ display: 'inline', marginRight: 8, color: 'var(--cyan)' }} />
                        FAQ rapide
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {FAQS.map((f, i) => (
                            <div key={i} className="card faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ cursor: 'pointer', padding: '14px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--text-high)', letterSpacing: '0.02em' }}>{f.q}</span>
                                    <ChevronRight size={12} style={{ color: 'var(--text-low)', flexShrink: 0, transform: openFaq === i ? 'rotate(90deg)' : 'none', transition: 'transform 200ms' }} />
                                </div>
                                {openFaq === i && <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-mid)', marginTop: 10, lineHeight: 1.7 }}>{f.a}</p>}
                            </div>
                        ))}
                    </div>

                    <div className="card" style={{ marginTop: 16, background: 'var(--primary-dim)', border: '1px solid #00FF8720' }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <Zap size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-high)', marginBottom: 4 }}>Support 24/7 sur Elite</div>
                                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.6 }}>Le plan Elite inclut un accès support prioritaire avec réponse garantie en moins de 2h.</p>
                                <Link to="/pricing" className="btn btn-primary" style={{ marginTop: 10, fontSize: 12, padding: '7px 14px' }}>Passer à Elite <ChevronRight size={11} /></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
