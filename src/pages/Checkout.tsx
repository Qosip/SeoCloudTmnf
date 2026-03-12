import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Lock, Check, ChevronRight, Shield, Plus, Minus, ArrowRight, Server, Globe, Key, Users as UsersIcon, Cpu, Database } from 'lucide-react'
import SEO from '../components/SEO'

/* ─── Shared Data (mirrors Products page) ────────────────────────────────── */
const PLANS = [
    { id: 'starter', name: 'Starter', price: 4.99, slots: 8, ram: '512 MB', cpu: '1 vCPU', color: 'var(--text-mid)' },
    { id: 'pro', name: 'Pro', price: 9.99, slots: 16, ram: '1 GB', cpu: '2 vCPU', color: 'var(--primary)', popular: true },
    { id: 'elite', name: 'Elite', price: 24.99, slots: 32, ram: '4 GB', cpu: '4 vCPU', color: 'var(--yellow)' },
    { id: 'flash', name: 'Flash 24h', price: 1.99, slots: 12, ram: '512 MB', cpu: '1 vCPU', color: 'var(--orange)' },
]

const ADDONS = [
    { id: 'extra-ram', icon: Database, label: 'RAM supplémentaire', desc: '+512 MB RAM par unité', price: 1.99, unit: '/mois', max: 8, default: 0 },
    { id: 'extra-slot', icon: UsersIcon, label: 'Slots supplémentaires', desc: '+4 slots joueurs', price: 0.99, unit: '/mois', max: 4, default: 0 },
    { id: 'ip-ded', icon: Globe, label: 'IP dédiée', desc: 'Adresse IP fixe propre', price: 2.49, unit: '/mois', max: 1, default: 0 },
    { id: 'backup', icon: Shield, label: 'Backup horaire', desc: 'Sauvegarde toutes les heures', price: 1.49, unit: '/mois', max: 1, default: 0 },
    { id: 'xaseco', icon: Zap, label: 'XAseco + ManiaLive', desc: 'Pack plugins pré-configuré', price: 0.99, unit: '/mois', max: 1, default: 0 },
    { id: 'extra-cpu', icon: Cpu, label: 'vCPU supplémentaire', desc: '+1 vCPU de calcul', price: 3.49, unit: '/mois', max: 2, default: 0 },
]

const REGIONS = [
    { id: 'eu-paris', flag: '🇫🇷', label: 'Europe — Paris', ping: '~8ms', price: 0 },
    { id: 'eu-frankfurt', flag: '🇩🇪', label: 'Europe — Frankfurt', ping: '~14ms', price: 0 },
    { id: 'eu-london', flag: '🇬🇧', label: 'Europe — London', ping: '~20ms', price: 0 },
    { id: 'na-east', flag: '🇺🇸', label: 'Amérique — Est', ping: '~90ms', price: 0 },
]

function fmt(n: number) { return n.toFixed(2) }
function detectCard(n: string) {
    if (/^4/.test(n)) return 'VISA'
    if (/^5[1-5]/.test(n)) return 'MC'
    if (/^3[47]/.test(n)) return 'AMEX'
    return '----'
}
function fmtCard(v: string) { return v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim() }
function fmtExp(v: string) { return v.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2') }

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function Checkout() {
    const nav = useNavigate()
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
    const [planId, setPlanId] = useState('pro')
    const [addons, setAddons] = useState<Record<string, number>>(
        Object.fromEntries(ADDONS.map(a => [a.id, a.default]))
    )

    // Server config
    const [serverName, setServerName] = useState('Mon Serveur TMNF')
    const [serverPass, setServerPass] = useState('')
    const [region, setRegion] = useState('eu-paris')
    const [gameMode, setGameMode] = useState('TimeAttack')

    // Payment
    const [cardNum, setCardNum] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvv, setCvv] = useState('')
    const [holder, setHolder] = useState('')
    const [loading, setLoading] = useState(false)

    const plan = PLANS.find(p => p.id === planId)!
    const disc = billing === 'yearly' ? 0.8 : 1
    const planPrice = parseFloat(fmt(plan.price * disc))
    const addonsTotal = ADDONS.reduce((s, a) => s + (addons[a.id] ?? 0) * a.price, 0)
    const total = parseFloat(fmt(planPrice + addonsTotal))
    const totalYear = billing === 'yearly' ? parseFloat(fmt(total * 12)) : null

    const STEPS = ['Plan', 'Options & Config', 'Paiement', 'Confirmation']

    function setAddon(id: string, val: number) {
        setAddons(prev => ({ ...prev, [id]: val }))
    }

    async function handlePay(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        await new Promise(r => setTimeout(r, 1600))
        setLoading(false)
        setStep(4)
    }

    /* ── Summary sidebar ── */
    const Summary = () => (
        <div className="card" style={{ position: 'sticky', top: 20 }}>
            <div className="card-title" style={{ marginBottom: 16 }}>Récapitulatif</div>

            <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-mid)', fontSize: 13 }}>Plan {plan.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-high)' }}>{fmt(planPrice)}€</span>
                </div>
                {ADDONS.filter(a => addons[a.id] > 0).map(a => (
                    <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ color: 'var(--text-mid)', fontSize: 12 }}>{a.label} ×{addons[a.id]}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--primary)' }}>+{fmt(a.price * addons[a.id])}€</span>
                    </div>
                ))}
                {billing === 'yearly' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ color: 'var(--primary)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>Réduction annuelle</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--primary)' }}>-20%</span>
                    </div>
                )}
            </div>

            <div className="divider" />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-high)', letterSpacing: '0.02em' }}>
                    Total/{billing === 'yearly' ? 'an' : 'mois'}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>
                    {totalYear ? fmt(totalYear) : fmt(total)}€
                </span>
            </div>

            {serverName && step >= 2 && (
                <div style={{ background: 'var(--bg-raised)', borderRadius: 'var(--radius-md)', padding: '10px 12px', marginBottom: 12 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-ghost)', marginBottom: 4 }}>SERVEUR CONFIGURÉ</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text-high)', fontWeight: 600 }}>{serverName}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-low)', marginTop: 2 }}>
                        {REGIONS.find(r => r.id === region)?.label} · {plan.slots + (addons['extra-slot'] ?? 0) * 4} slots
                    </div>
                </div>
            )}

            {[
                'Annulation à tout moment',
                'Garantie 7 jours satisfait ou remboursé',
                'Actif en < 60 secondes',
            ].map(f => (
                <div key={f} style={{ display: 'flex', gap: 8, marginBottom: 7 }}>
                    <Check size={12} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-mid)' }}>{f}</span>
                </div>
            ))}
        </div>
    )

    return (
        <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: 32, paddingBottom: 48 }}>
            <SEO 
                title="Configuration & Paiement" 
                description="Configurez votre serveur, choisissez vos options et finalisez votre commande en toute sécurité."
            />
            <div className="auth-bg-glow" />
            <div style={{ width: '100%', maxWidth: 980, margin: '0 auto', padding: '0 24px' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }} aria-label="Accueil TrackHost">
                        <div className="sidebar-logo-icon" style={{ width: 28, height: 28 }}><Zap size={14} /></div>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text-high)', letterSpacing: '0.05em' }}>TrackHost</span>
                    </Link>
                    <span style={{ color: 'var(--border-bright)', margin: '0 6px' }}>·</span>
                    <Lock size={10} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)' }}>Commande sécurisée</span>
                </div>

                {/* Steps bar */}
                <div className="checkout-steps" style={{ marginBottom: 32 }}>
                    {STEPS.map((s, i) => (
                        <div key={s} className={`checkout-step ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'done' : ''}`}>
                            <div className="step-num">{step > i + 1 ? <Check size={11} /> : i + 1}</div>
                            <span>{s}</span>
                        </div>
                    ))}
                </div>

                {step === 4 ? (
                    /* ── Confirmation ── */
                    <div className="card" style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', padding: 48 }}>
                        <div style={{ width: 72, height: 72, background: 'var(--primary-dim)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '2px solid #00FF8740' }}>
                            <Shield size={30} style={{ color: 'var(--primary)' }} />
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--text-high)', marginBottom: 8 }}>Commande confirmée !</h2>
                        <p style={{ color: 'var(--text-mid)', fontSize: 14, marginBottom: 8, lineHeight: 1.7 }}>
                            <strong style={{ color: 'var(--text-high)' }}>{serverName}</strong> est en cours de provisionnement sur {REGIONS.find(r => r.id === region)?.label.split('—')[1]?.trim()}.
                        </p>
                        <div className="badge badge-green" style={{ margin: '0 auto 24px', display: 'inline-flex' }}>
                            Serveur actif en {"< 60 secondes"}
                        </div>
                        <div style={{ background: 'var(--bg-raised)', borderRadius: 8, padding: '12px 16px', marginBottom: 24, textAlign: 'left' }}>
                            {[
                                ['Plan', plan.name],
                                ['Facturation', billing === 'yearly' ? 'Annuelle (-20%)' : 'Mensuelle'],
                                ['Total', `${totalYear ? fmt(totalYear) : fmt(total)}€/${billing === 'yearly' ? 'an' : 'mois'}`],
                                ['Options', ADDONS.filter(a => addons[a.id] > 0).map(a => a.label).join(', ') || 'Aucune'],
                            ].map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 12, marginBottom: 6 }}>
                                    <span style={{ color: 'var(--text-low)' }}>{k}</span>
                                    <span style={{ color: 'var(--text-high)' }}>{v}</span>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 14 }} onClick={() => nav('/servers')}>
                            Gérer mes serveurs <ArrowRight size={14} />
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
                        <div>
                            {/* ── STEP 1: Plan ── */}
                            {step === 1 && (
                                <div>
                                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-high)', marginBottom: 16 }}>Choisissez votre plan</h1>

                                    <div className="billing-toggle" style={{ marginBottom: 20 }}>
                                        <button className={`bill-btn ${billing === 'monthly' ? 'active' : ''}`} onClick={() => setBilling('monthly')}>Mensuel</button>
                                        <button className={`bill-btn ${billing === 'yearly' ? 'active' : ''}`} onClick={() => setBilling('yearly')}>
                                            Annuel <span className="badge badge-green" style={{ marginLeft: 6, fontSize: 9 }}>-20%</span>
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                                        {PLANS.map(p => (
                                            <label key={p.id} className={`plan-select-row ${planId === p.id ? 'active' : ''}`} onClick={() => setPlanId(p.id)}>
                                                <div className={`radio-dot ${planId === p.id ? 'checked' : ''}`} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-high)', letterSpacing: '0.03em' }}>{p.name}</span>
                                                        {p.popular && <span className="badge badge-green" style={{ fontSize: 9 }}>Populaire</span>}
                                                    </div>
                                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-low)' }}>
                                                        {p.slots} slots · {p.ram} · {p.cpu}
                                                    </span>
                                                </div>
                                                <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: planId === p.id ? p.color : 'var(--text-high)', letterSpacing: '-0.01em' }}>
                                                    {fmt(p.price * disc)}€<span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-low)', fontWeight: 400 }}>/mois</span>
                                                </span>
                                            </label>
                                        ))}
                                    </div>

                                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} onClick={() => setStep(2)}>
                                        Continuer <ChevronRight size={14} />
                                    </button>
                                </div>
                            )}

                            {/* ── STEP 2: Options + Config ── */}
                            {step === 2 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    {/* Add-ons */}
                                    <div>
                                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-high)', marginBottom: 4 }}>Options supplémentaires</h2>
                                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)', marginBottom: 16 }}>Personnalisez votre serveur avec des ressources additionnelles</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                            {ADDONS.map(addon => {
                                                const Icon = addon.icon
                                                const qty = addons[addon.id] ?? 0
                                                return (
                                                    <div key={addon.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg-raised)', border: `1px solid ${qty > 0 ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', transition: 'border-color 200ms' }}>
                                                        <div style={{ width: 36, height: 36, background: qty > 0 ? 'var(--primary-dim)' : 'var(--bg-surface)', border: `1px solid ${qty > 0 ? '#00FF8730' : 'var(--border)'}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                            <Icon size={15} style={{ color: qty > 0 ? 'var(--primary)' : 'var(--text-low)' }} />
                                                        </div>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--text-high)', letterSpacing: '0.02em' }}>{addon.label}</div>
                                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-low)' }}>{addon.desc} · {fmt(addon.price)}€{addon.unit}</div>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                                            <button className="btn btn-ghost" style={{ padding: '5px 10px', minWidth: 30 }} onClick={() => setAddon(addon.id, Math.max(0, qty - 1))} disabled={qty === 0}><Minus size={11} /></button>
                                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: qty > 0 ? 'var(--primary)' : 'var(--text-mid)', minWidth: 16, textAlign: 'center' }}>{qty}</span>
                                                            <button className="btn btn-ghost" style={{ padding: '5px 10px', minWidth: 30 }} onClick={() => setAddon(addon.id, Math.min(addon.max, qty + 1))} disabled={qty >= addon.max}><Plus size={11} /></button>
                                                            {qty > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--primary)', minWidth: 52 }}>+{fmt(addon.price * qty)}€</span>}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Server config */}
                                    <div>
                                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-high)', marginBottom: 4 }}>Configuration du serveur</h2>
                                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)', marginBottom: 16 }}>Ces paramètres peuvent être modifiés plus tard depuis le dashboard</p>
                                        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                                <div>
                                                    <label className="auth-label"><Server size={10} style={{ display: 'inline', marginRight: 4 }} />Nom du serveur</label>
                                                    <input className="input" value={serverName} onChange={e => setServerName(e.target.value)} placeholder="Mon Serveur TMNF" />
                                                </div>
                                                <div>
                                                    <label className="auth-label"><Key size={10} style={{ display: 'inline', marginRight: 4 }} />Mot de passe (optionnel)</label>
                                                    <input className="input" type="password" value={serverPass} onChange={e => setServerPass(e.target.value)} placeholder="Vide = serveur public" />
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                                <div>
                                                    <label className="auth-label">Mode de jeu</label>
                                                    <select className="input" value={gameMode} onChange={e => setGameMode(e.target.value)}>
                                                        {['TimeAttack', 'Stunts', 'Platform', 'Puzzle', 'Laps'].map(m => <option key={m}>{m}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="auth-label">Slots max</label>
                                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--primary)', padding: '8px 12px', background: 'var(--bg-void)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                                        {plan.slots + (addons['extra-slot'] ?? 0) * 4} joueurs
                                                        <span style={{ color: 'var(--text-ghost)', fontSize: 10, marginLeft: 8 }}>(plan + options)</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="auth-label"><Globe size={10} style={{ display: 'inline', marginRight: 4 }} />Région du serveur</label>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                    {REGIONS.map(r => (
                                                        <label key={r.id} className={`region-row ${region === r.id ? 'active' : ''}`} onClick={() => setRegion(r.id)}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                <div className={`radio-dot ${region === r.id ? 'checked' : ''}`} />
                                                                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13 }}>{r.flag} {r.label}</span>
                                                            </div>
                                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--primary)' }}>{r.ping}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(1)}>Retour</button>
                                        <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center', padding: '12px' }} onClick={() => setStep(3)}>
                                            Passer au paiement <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 3: Payment ── */}
                            {step === 3 && (
                                <div>
                                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-high)', marginBottom: 20 }}>Paiement</h2>
                                    <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                        <div>
                                            <label className="auth-label">Titulaire de la carte</label>
                                            <input className="input" placeholder="Jean Dupont" value={holder} onChange={e => setHolder(e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="auth-label">Numéro de carte</label>
                                            <div style={{ position: 'relative' }}>
                                                <input className="input" placeholder="1234 5678 9012 3456" value={cardNum}
                                                    onChange={e => setCardNum(fmtCard(e.target.value))} maxLength={19} required style={{ paddingRight: 72 }} />
                                                <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-mid)' }}>
                                                    {detectCard(cardNum.replace(/\s/g, ''))}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                            <div>
                                                <label className="auth-label">Expiration</label>
                                                <input className="input" placeholder="MM/AA" value={expiry} onChange={e => setExpiry(fmtExp(e.target.value))} maxLength={5} required />
                                            </div>
                                            <div>
                                                <label className="auth-label">CVV</label>
                                                <input className="input" placeholder="•••" type="password" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} required />
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--primary-dim)', border: '1px solid #00FF8720', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
                                            <Lock size={12} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mid)' }}>TLS 1.3 · PCI-DSS Compliant · Données jamais stockées</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                                            <button type="button" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(2)}>Retour</button>
                                            <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center', padding: '13px' }} disabled={loading}>
                                                {loading ? <span className="spinner" /> : <><Lock size={13} /> Payer {totalYear ? fmt(totalYear) : fmt(total)}€</>}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Summary sidebar */}
                        <Summary />
                    </div>
                )}
            </div>
        </div>
    )
}
